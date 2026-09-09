from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.extensions.socketio import emit_customer_order_update
from app.models.order import Order
from app.models.payment import Payment
from app.routes.orders import restore_order_inventory
from app.services.email_service import send_order_confirmation
from app.services.mpesa_service import stk_push

mpesa_bp = Blueprint(
    "mpesa",
    __name__,
    url_prefix="/api/mpesa",
)


@mpesa_bp.route("/stkpush", methods=["POST"])
@jwt_required()
def create_stk_push():

    data = request.get_json(silent=True) or {}

    phone = str(data.get("phone", "")).strip()
    order_id = data.get("order_id")

    # Normalize Kenyan phone numbers
    if phone.startswith("+254"):
        phone = phone[1:]
    elif phone.startswith("07"):
        phone = "254" + phone[1:]
    elif phone.startswith("01"):
        phone = "254" + phone[1:]

    # Validate Kenyan mobile number
    if not phone:
        return jsonify({
            "message": "Phone number required"
        }), 400

    if not phone.isdigit() or len(phone) != 12 or not phone.startswith("254"):
        return jsonify({
            "message": "Enter a valid Kenyan phone number"
        }), 400

    if not order_id:
        return jsonify({
            "message": "Order id required"
        }), 400

    try:
        order_id = int(order_id)
    except (TypeError, ValueError):
        return jsonify({
            "message": "Invalid order id"
        }), 400

    user_id = int(get_jwt_identity())

    order = Order.query.filter_by(
        id=order_id,
        user_id=user_id
    ).first()

    if not order:
        return jsonify({
            "message": "Order not found"
        }), 404

    # Only Pending orders may start a new payment.
    if order.status != "Pending":
        if order.status == "Paid" or order.payment_status == "Paid":
            return jsonify({
                "message": "Order already paid"
            }), 400

        return jsonify({
            "message": "Order is not available for payment"
        }), 400

    # Prevent multiple active M-Pesa payments for the same order.
    existing_payment = Payment.query.filter_by(
        order_id=order.id,
        provider="M-Pesa",
        status="Pending"
    ).first()

    if existing_payment:
        return jsonify({
            "success": False,
            "message": "An M-Pesa payment is already in progress.",
            "checkout_request_id": existing_payment.transaction_id
        }), 409

    try:
        response = stk_push(
            phone=phone,
            amount=order.total,
            order_id=order.id,
        )

        checkout_request_id = response.get("CheckoutRequestID")

        if not checkout_request_id:
            raise ValueError("M-Pesa did not return a CheckoutRequestID")

        payment = Payment(
            order_id=order.id,
            amount=order.total,
            provider="M-Pesa",
            status="Pending",
            currency="KES",
            transaction_id=checkout_request_id,
        )

        db.session.add(payment)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "STK Push sent successfully.",
            "checkout_request_id": checkout_request_id,
            "merchant_request_id": response.get("MerchantRequestID"),
        })

    except Exception:
        db.session.rollback()

        try:
            restore_order_inventory(order)
            order.status = "Cancelled"
            order.payment_status = "Failed"
            db.session.commit()
        except Exception:
            db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Failed to initiate M-Pesa payment. Please try again."
        }), 500


@mpesa_bp.route("/callback", methods=["POST"])
def mpesa_callback():

    payload = request.get_json(silent=True) or {}

    try:
        callback = payload["Body"]["stkCallback"]

        checkout_id = callback["CheckoutRequestID"]
        result_code = callback["ResultCode"]

        payment = Payment.query.filter_by(
            transaction_id=checkout_id
        ).first()

        if not payment:
            return jsonify({
                "ResultCode": 0,
                "ResultDesc": "Payment not found"
            })

        order = db.session.get(Order, payment.order_id)

        if not order:
            return jsonify({
                "ResultCode": 0,
                "ResultDesc": "Order not found"
            })

        # -------------------------------------------------
        # IDEMPOTENCY
        # -------------------------------------------------
        # Ignore duplicate callbacks after payment is completed.
        if payment.status == "Completed":
            return jsonify({
                "ResultCode": 0,
                "ResultDesc": "Payment already processed"
            })

        # -------------------------------------------------
        # SUCCESS
        # -------------------------------------------------
        if result_code == 0:

            metadata = callback.get("CallbackMetadata", {}).get("Item", [])

            callback_amount = None
            mpesa_receipt = None

            for item in metadata:
                if item.get("Name") == "Amount":
                    callback_amount = item.get("Value")

                elif item.get("Name") == "MpesaReceiptNumber":
                    mpesa_receipt = item.get("Value")

            # Verify amount returned by M-Pesa
            expected_amount = round(float(payment.amount), 2)

            if callback_amount is None:
                payment.status = "Failed"
                db.session.commit()

                return jsonify({
                    "ResultCode": 0,
                    "ResultDesc": "Payment amount missing"
                })

            if round(float(callback_amount), 2) != expected_amount:
                payment.status = "Failed"
                db.session.commit()

                return jsonify({
                    "ResultCode": 0,
                    "ResultDesc": "Payment amount mismatch"
                })

            # A successful M-Pesa payment should contain a receipt.
            if not mpesa_receipt:
                payment.status = "Failed"
                db.session.commit()

                return jsonify({
                    "ResultCode": 0,
                    "ResultDesc": "M-Pesa receipt missing"
                })

            # Prevent a second payment from changing an already-paid order.
            if order.status == "Paid" or order.payment_status == "Paid":
                payment.status = "Completed"
                payment.verified_at = datetime.now(timezone.utc)

                # Store receipt if your Payment model has this field.
                if hasattr(payment, "receipt_number"):
                    payment.receipt_number = str(mpesa_receipt)

                db.session.commit()

                return jsonify({
                    "ResultCode": 0,
                    "ResultDesc": "Order already paid"
                })

            # Complete payment
            payment.status = "Completed"
            payment.verified_at = datetime.now(timezone.utc)

            # Store M-Pesa receipt if supported by the model.
            if hasattr(payment, "receipt_number"):
                payment.receipt_number = str(mpesa_receipt)

            order.status = "Paid"
            order.payment_status = "Paid"

            db.session.commit()

            emit_customer_order_update(order)
            send_order_confirmation(order.user, order)

        # -------------------------------------------------
        # FAILED / CANCELLED
        # -------------------------------------------------
        else:

            # Never downgrade a paid order.
            if order.status == "Paid" or order.payment_status == "Paid":
                return jsonify({
                    "ResultCode": 0,
                    "ResultDesc": "Order already paid"
                })

            payment.status = "Failed"

            # Inventory is restored only once while the order
            # is still Pending.
            if order.status == "Pending":
                restore_order_inventory(order)

                order.status = "Cancelled"
                order.payment_status = "Failed"

            db.session.commit()

        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Success"
        })

    except Exception as e:

        db.session.rollback()

        print("M-Pesa Callback Error:", e)

        return jsonify({
            "ResultCode": 1,
            "ResultDesc": "Callback processing failed"
        })
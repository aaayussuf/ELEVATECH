from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.order import Order
from app.models.payment import Payment
from app.routes.orders import restore_order_inventory
from app.services.mpesa_service import get_access_token, stk_push

mpesa_bp = Blueprint(
    "mpesa",
    __name__,
    url_prefix="/api/mpesa",
)


@mpesa_bp.route("/token", methods=["GET"])
def test_token():
    try:
        token = get_access_token()

        return jsonify({
            "success": True,
            "token": token
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@mpesa_bp.route("/stkpush", methods=["POST"])
@jwt_required()
def create_stk_push():

    data = request.get_json() or {}

    phone = str(data.get("phone", "")).strip()

    if phone.startswith("07"):
        phone = "254" + phone[1:]

    if phone.startswith("+254"):
        phone = phone[1:]

    order_id = data.get("order_id")

    if not phone:
        return jsonify({"message": "Phone number required"}), 400

    if not order_id:
        return jsonify({"message": "Order id required"}), 400

    order = db.session.get(Order, order_id)

    if not order:
        return jsonify({"message": "Order not found"}), 404

    if order.status == "Paid":
        return jsonify({"message": "Order already paid"}), 400

    response = stk_push(
        phone=phone,
        amount=order.total,
        order_id=order.id,
    )

    payment = Payment(
        order_id=order.id,
        amount=order.total,
        provider="M-Pesa",
        status="Pending",
        currency="KES",
        transaction_id=response.get("CheckoutRequestID"),
    )

    db.session.add(payment)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "STK Push sent successfully.",
        "checkout_request_id": response.get("CheckoutRequestID"),
        "merchant_request_id": response.get("MerchantRequestID"),
        "response": response,
    })


@mpesa_bp.route("/callback", methods=["POST"])
def mpesa_callback():

    payload = request.get_json()

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

        if result_code == 0:

            payment.status = "Completed"
            payment.verified_at = datetime.utcnow()

            order = db.session.get(Order, payment.order_id)

            if order:
                order.status = "Paid"

        else:

            payment.status = "Failed"

            order = db.session.get(Order, payment.order_id)

            if order and order.status == "Pending":

                restore_order_inventory(order)

                order.status = "Cancelled"

        db.session.commit()

        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Success"
        })

    except Exception as e:

        print("M-Pesa Callback Error:", e)

        return jsonify({
            "ResultCode": 1,
            "ResultDesc": str(e)
        })
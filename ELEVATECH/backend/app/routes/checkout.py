from datetime import datetime, timezone

import stripe
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.extensions.socketio import emit_customer_order_update
from app.models.order import Order
from app.models.payment import Payment

from app.routes.orders import restore_order_inventory

from app.services.email_service import send_order_confirmation
from app.services.stripe_service import (
    create_checkout_session,
    retrieve_session,
    verify_webhook_event,
)


checkout_bp = Blueprint("checkout", __name__, url_prefix="/api/checkout")


@checkout_bp.route("", methods=["POST"])
@jwt_required()
def create_checkout():
    """Create a Stripe Checkout Session for an existing order."""

    identity = get_jwt_identity()
    # JWT identity is stored as str(user_id) — cast for DB comparisons.
    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid session. Please sign in again."}), 401

    data = request.get_json() or {}
    order_id = data.get("order_id")
    if not order_id:
        return jsonify({"error": "order_id is required"}), 400

    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404

    if order.status != "Pending":
        return (
            jsonify({"error": f"Order status must be Pending (current: {order.status})"}),
            400,
        )

    try:
        stripe_currency = current_app.config.get("STRIPE_CURRENCY", "KES")

        session = create_checkout_session(
            order_id=order.id,
            order=order,
            success_url=current_app.config.get("STRIPE_SUCCESS_URL"),
            cancel_url=current_app.config.get("STRIPE_CANCEL_URL"),
            currency=stripe_currency,
        )

        # Idempotent Payment creation/update using stripe_session_id.
        payment = (
            Payment.query.filter_by(order_id=order.id, stripe_session_id=session.id).first()
        )

        if not payment:
            payment = Payment(
                order_id=order.id,
                amount=order.total,
                provider="Stripe",
                status="Pending",
                currency=stripe_currency,
                stripe_session_id=session.id,
                stripe_payment_intent_id=getattr(session, "payment_intent", None),
            )
            db.session.add(payment)
        else:
            payment.status = "Pending"
            payment.amount = order.total
            payment.provider = "Stripe"
            payment.currency = stripe_currency
            payment.stripe_payment_intent_id = getattr(session, "payment_intent", None)

        db.session.commit()

        return jsonify({"checkout_session_id": session.id, "url": session.url}), 201

    except Exception:
        db.session.rollback()

        try:
            restore_order_inventory(order)
            order.status = "Cancelled"
            order.payment_status = "Failed"
            db.session.commit()
        except Exception:
            db.session.rollback()
            current_app.logger.exception(
                "Failed to restore inventory after Stripe checkout error "
                "for order %s",
                order.id,
            )

        current_app.logger.exception(
            "Failed to create Stripe Checkout for order %s",
            order.id,
        )

        return jsonify({
            "error": "Unable to start payment. Please try again."
        }), 500


@checkout_bp.route("/verify/<session_id>", methods=["GET"])
@jwt_required()
def verify_payment(session_id):
    """
    Verify a Stripe Checkout Session belonging to the
    authenticated user's order.
    """

    if not session_id or not session_id.startswith("cs_"):
        return jsonify({
            "error": "Invalid checkout session"
        }), 400

    try:
        identity = get_jwt_identity()

        session = retrieve_session(session_id)

        metadata = session.metadata or {}
        order_id = metadata.get("order_id")

        if not order_id:
            return jsonify({
                "error": "Order not associated with this session"
            }), 404

        try:
            order_id = int(order_id)
        except (TypeError, ValueError):
            return jsonify({
                "error": "Invalid order reference"
            }), 404

        # Make absolutely sure this order belongs to
        # the authenticated customer.
        order = Order.query.filter_by(
            id=order_id,
            user_id=identity,
        ).first()

        if not order:
            return jsonify({
                "error": "Order not found"
            }), 404

        # Verify the Stripe session amount.
        expected_amount = round(float(order.total) * 100)
        received_amount = session.amount_total

        if received_amount != expected_amount:
            current_app.logger.error(
                "Stripe verification amount mismatch: "
                "order=%s expected=%s received=%s",
                order.id,
                expected_amount,
                received_amount,
            )

            return jsonify({
                "error": "Payment verification failed"
            }), 400

        # Verify currency.
        expected_currency = current_app.config.get(
            "STRIPE_CURRENCY",
            "KES",
        ).lower()

        received_currency = str(
            session.currency or ""
        ).lower()

        if received_currency != expected_currency:
            current_app.logger.error(
                "Stripe verification currency mismatch: "
                "order=%s expected=%s received=%s",
                order.id,
                expected_currency,
                received_currency,
            )

            return jsonify({
                "error": "Payment verification failed"
            }), 400

        payment_intent_id = None

        if session.payment_intent:
            if hasattr(session.payment_intent, "id"):
                payment_intent_id = session.payment_intent.id
            elif isinstance(session.payment_intent, str):
                payment_intent_id = session.payment_intent

        return jsonify({
            "paid": session.payment_status == "paid",
            "status": session.payment_status,
            "order_id": order.id,
            "payment_intent": payment_intent_id,
        })

    except Exception:
        current_app.logger.exception(
            "Stripe payment verification failed"
        )

        return jsonify({
            "error": "Unable to verify payment"
        }), 400


@checkout_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    """Handle verified Stripe webhook events safely and idempotently."""

    payload = request.get_data()
    sig_header = request.headers.get("Stripe-Signature")

    if not sig_header:
        return jsonify({"error": "Missing Stripe-Signature header"}), 400

    try:
        event = verify_webhook_event(payload, sig_header)

        if hasattr(event, "_to_dict_recursive"):
            event = event._to_dict_recursive()
        else:
            event = event.to_dict_recursive()

    except Exception:
        current_app.logger.exception("Stripe webhook signature/event verification failed")
        return jsonify({"error": "Invalid webhook"}), 400

    event_type = event.get("type")
    obj = event.get("data", {}).get("object", {})

    # ============================================================
    # SUCCESSFUL CHECKOUT
    # ============================================================
    if event_type == "checkout.session.completed":

        order_id = obj.get("metadata", {}).get("order_id")

        if not order_id:
            current_app.logger.warning(
                "Stripe checkout session has no order_id metadata: %s",
                obj.get("id"),
            )
            return jsonify({"received": True}), 200

        try:
            order_id = int(order_id)
        except (TypeError, ValueError):
            current_app.logger.warning(
                "Invalid Stripe order_id metadata: %s",
                order_id,
            )
            return jsonify({"received": True}), 200

        order = db.session.get(Order, order_id)

        if not order:
            current_app.logger.warning(
                "Stripe webhook order not found: %s",
                order_id,
            )
            return jsonify({"received": True}), 200

        # Stripe must report the payment as paid.
        if obj.get("payment_status") != "paid":
            current_app.logger.warning(
                "Stripe checkout completed but payment is not paid. "
                "Order=%s status=%s",
                order.id,
                obj.get("payment_status"),
            )
            return jsonify({"received": True}), 200

        # --------------------------------------------------------
        # Verify amount
        # --------------------------------------------------------
        expected_amount = round(float(order.total) * 100)
        received_amount = obj.get("amount_total")

        if received_amount != expected_amount:
            current_app.logger.error(
                "Stripe amount mismatch for order %s: expected=%s received=%s",
                order.id,
                expected_amount,
                received_amount,
            )
            return jsonify({"error": "Payment amount mismatch"}), 400

        # --------------------------------------------------------
        # Verify currency
        # --------------------------------------------------------
        expected_currency = current_app.config.get(
            "STRIPE_CURRENCY",
            "KES",
        ).lower()

        received_currency = str(
            obj.get("currency", "")
        ).lower()

        if received_currency != expected_currency:
            current_app.logger.error(
                "Stripe currency mismatch for order %s: expected=%s received=%s",
                order.id,
                expected_currency,
                received_currency,
            )
            return jsonify({"error": "Payment currency mismatch"}), 400

        session_id = obj.get("id")
        payment_intent_id = obj.get("payment_intent")

        # --------------------------------------------------------
        # Find existing payment
        # --------------------------------------------------------
        payment = None

        if session_id:
            payment = Payment.query.filter_by(
                stripe_session_id=session_id
            ).first()

        if not payment and payment_intent_id:
            payment = Payment.query.filter_by(
                stripe_payment_intent_id=payment_intent_id
            ).first()

        if not payment and payment_intent_id:
            payment = Payment.query.filter_by(
                transaction_id=payment_intent_id
            ).first()

        if not payment:
            payment = Payment.query.filter_by(
                order_id=order.id,
                provider="Stripe",
            ).order_by(
                Payment.id.desc()
            ).first()

        # --------------------------------------------------------
        # Create payment if necessary
        # --------------------------------------------------------
        if not payment:
            payment = Payment(
                order_id=order.id,
                amount=order.total,
                provider="Stripe",
                status="Pending",
                currency=expected_currency,
            )
            db.session.add(payment)

        # --------------------------------------------------------
        # Idempotency
        # --------------------------------------------------------
        already_completed = payment.status == "Completed"

        payment.status = "Completed"
        payment.amount = order.total
        payment.provider = "Stripe"
        payment.currency = expected_currency
        payment.verified_at = datetime.now(timezone.utc)

        if session_id:
            payment.stripe_session_id = session_id

        if payment_intent_id:
            payment.stripe_payment_intent_id = payment_intent_id
            payment.transaction_id = payment_intent_id

        # --------------------------------------------------------
        # Mark order paid
        # --------------------------------------------------------
        order_was_already_paid = (
            order.status == "Paid"
            and order.payment_status == "Paid"
        )

        order.status = "Paid"
        order.payment_status = "Paid"

        db.session.commit()

        # --------------------------------------------------------
        # Only notify once
        # --------------------------------------------------------
        if not already_completed and not order_was_already_paid:
            emit_customer_order_update(order)
            send_order_confirmation(order.user, order)

        current_app.logger.info(
            "Stripe payment completed successfully for order %s",
            order.id,
        )

        return jsonify({"received": True}), 200

    elif event["type"] == "payment_intent.succeeded":

        # Stripe Checkout's checkout.session.completed event is
        # authoritative for completing the order.
        #
        # We intentionally do not mark the order Paid here because
        # the PaymentIntent event does not carry the Checkout Session
        # context needed for our order/payment reconciliation.
        return jsonify({
            "received": True
        }), 200

# ============================================================
    # EXPIRED CHECKOUT / FAILED PAYMENT
    # ============================================================
    elif event_type in (
        "checkout.session.expired",
        "payment_intent.payment_failed",
    ):

        metadata = obj.get("metadata", {})
        order_id = metadata.get("order_id")

        if not order_id:
            return jsonify({"received": True}), 200

        try:
            order_id = int(order_id)
        except (TypeError, ValueError):
            return jsonify({"received": True}), 200

        order = db.session.get(Order, order_id)

        if not order:
            return jsonify({"received": True}), 200

        # Never cancel an already-paid order.
        if order.status == "Paid":
            return jsonify({"received": True}), 200

        if order.status == "Pending":

            restore_order_inventory(order)

            order.status = "Cancelled"
            order.payment_status = "Failed"

            payment_intent_id = (
                obj.get("payment_intent")
                if event_type == "checkout.session.expired"
                else obj.get("id")
            )

            session_id = (
                obj.get("id")
                if event_type == "checkout.session.expired"
                else None
            )

            payment = None

            if session_id:
                payment = Payment.query.filter_by(
                    stripe_session_id=session_id
                ).first()

            if not payment and payment_intent_id:
                payment = Payment.query.filter_by(
                    stripe_payment_intent_id=payment_intent_id
                ).first()

            if not payment and payment_intent_id:
                payment = Payment.query.filter_by(
                    transaction_id=payment_intent_id
                ).first()

            if payment:
                payment.status = "Failed"

            db.session.commit()

            current_app.logger.info(
                "Stripe payment failed/expired for order %s",
                order.id,
            )

    return jsonify({"received": True}), 200

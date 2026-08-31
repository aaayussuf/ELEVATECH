from datetime import datetime

import stripe
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
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
    # identity shape depends on your JWT setup; assume user_id is identity.
    user_id = identity

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
                provider="stripe",
                status="Pending",
                currency=stripe_currency,
                stripe_session_id=session.id,
                stripe_payment_intent_id=getattr(session, "payment_intent", None),
            )
            db.session.add(payment)
        else:
            payment.status = "Pending"
            payment.amount = order.total
            payment.provider = "stripe"
            payment.currency = stripe_currency
            payment.stripe_payment_intent_id = getattr(session, "payment_intent", None)

        db.session.commit()

        return jsonify({"checkout_session_id": session.id, "url": session.url}), 201

    except Exception as e:
        db.session.rollback()
        restore_order_inventory(order)
        order.status = "Cancelled"
        order.payment_status = "Failed"
        db.session.commit()
        return jsonify({"error": f"Failed to create Stripe Checkout: {str(e)}"}), 500


@checkout_bp.route("/verify/<session_id>", methods=["GET"])
def verify_payment(session_id):
    """
    Verify a Checkout Session directly with Stripe.
    """

    try:
        session = retrieve_session(session_id)

        return jsonify({
            "paid": session.payment_status == "paid",
            "status": session.payment_status,
            "order_id": session.metadata.get("order_id"),
            "payment_intent": session.payment_intent.id if session.payment_intent else None,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@checkout_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    """Stripe webhook handler."""

    payload = request.get_data()
    sig_header = request.headers.get("Stripe-Signature")

    if not sig_header:
        return jsonify({"error": "Missing Stripe-Signature header"}), 400

    try:
        event = verify_webhook_event(payload, sig_header)

        # Strip v13+ renamed to_dict_recursive() -> _to_dict_recursive()
        if hasattr(event, "_to_dict_recursive"):
            event = event._to_dict_recursive()
        else:
            event = event.to_dict_recursive()

    except Exception as e:
        import traceback

        traceback.print_exc()

        print("=" * 60)
        print("WEBHOOK EXCEPTION:", repr(e))
        print("=" * 60)

        return jsonify({"error": str(e)}), 400

    event_type = event["type"]
    obj = event["data"]["object"]

    # -----------------------------
    # PAYMENT SUCCEEDED
    # -----------------------------
    if event_type in (
        "checkout.session.completed",
        "payment_intent.succeeded",
    ):

        metadata = obj.get("metadata", {})
        order_id = metadata.get("order_id")

        session_id = obj.get("id") if event_type.startswith("checkout.session") else None
        payment_intent_id = (
            obj.get("payment_intent")
            if event_type.startswith("checkout.session")
            else obj.get("id")
        )

        if order_id:

            order = Order.query.get(int(order_id))

            if order:

                payment = None

                # 1. Try finding by Stripe session ID
                if session_id:
                    payment = Payment.query.filter_by(
                        stripe_session_id=session_id
                    ).first()

                # 2. Try finding by Stripe Payment Intent ID or Transaction ID
                if not payment and payment_intent_id:
                    payment = Payment.query.filter(
                        (Payment.stripe_payment_intent_id == payment_intent_id)
                        | (Payment.transaction_id == payment_intent_id)
                    ).first()

                # 3. Fallback to latest payment for this order
                if not payment:
                    payment = Payment.query.filter_by(
                        order_id=order.id,
                        provider="stripe",
                    ).order_by(Payment.id.desc()).first()

                if payment:

                    payment.status = "Completed"
                    payment.verified_at = datetime.utcnow()

                    if payment_intent_id:
                        payment.transaction_id = payment_intent_id
                        payment.stripe_payment_intent_id = payment_intent_id

                    if session_id:
                        payment.stripe_session_id = session_id

                else:

                    payment = Payment(
                        order_id=order.id,
                        amount=order.total,
                        provider="stripe",
                        status="Completed",
                        currency=current_app.config.get(
                            "STRIPE_CURRENCY",
                            "KES",
                        ),
                        stripe_session_id=session_id,
                        stripe_payment_intent_id=payment_intent_id,
                        transaction_id=payment_intent_id or session_id,
                        verified_at=datetime.utcnow(),
                    )

                    db.session.add(payment)

                order.status = "Paid"
                order.payment_status = "Paid"

                db.session.commit()

                send_order_confirmation(order.user, order)

    # -----------------------------
    # PAYMENT FAILED / CANCELLED
    # -----------------------------
    elif event_type in (
        "checkout.session.expired",
        "payment_intent.payment_failed",
    ):

        metadata = obj.get("metadata", {})
        order_id = metadata.get("order_id")

        session_id = obj.get("id") if event_type.startswith("checkout.session") else None
        payment_intent_id = (
            obj.get("payment_intent")
            if event_type.startswith("checkout.session")
            else obj.get("id")
        )

        if order_id:

            order = Order.query.get(int(order_id))

            if order and order.status == "Pending":

                restore_order_inventory(order)

                order.status = "Cancelled"
                order.payment_status = "Failed"

                payment = None
                if session_id:
                    payment = Payment.query.filter_by(
                        stripe_session_id=session_id
                    ).first()

                if not payment and payment_intent_id:
                    payment = Payment.query.filter(
                        (Payment.stripe_payment_intent_id == payment_intent_id)
                        | (Payment.transaction_id == payment_intent_id)
                    ).first()

                if not payment:
                    payment = Payment.query.filter_by(
                        order_id=order.id,
                        provider="stripe",
                    ).order_by(Payment.id.desc()).first()

                if payment:
                    payment.status = "Failed"

                db.session.commit()

    return jsonify({"received": True}), 200


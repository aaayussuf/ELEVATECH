from datetime import datetime

import stripe
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.order import Order
from app.models.payment import Payment
from app.services.stripe_service import create_checkout_session, verify_webhook_event


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


@checkout_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    """Stripe webhook handler. Verifies signature and updates order/payment."""

    payload = request.get_data()
    sig_header = request.headers.get("Stripe-Signature")
    if not sig_header:
        return jsonify({"error": "Missing Stripe-Signature header"}), 400

    try:
        event = verify_webhook_event(payload, sig_header)
    except stripe.error.SignatureVerificationError:
        return jsonify({"error": "Invalid webhook signature"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    event_type = event.get("type")
    data = event.get("data", {})

    if event_type in {"checkout.session.completed", "payment_intent.succeeded"}:
        stripe_session_id = None
        payment_intent_id = None
        metadata = {}

        if event_type == "checkout.session.completed":
            session_obj = data.get("object", {})
            stripe_session_id = session_obj.get("id")
            payment_intent_id = session_obj.get("payment_intent")
            metadata = session_obj.get("metadata") or {}
            order_id = metadata.get("order_id")
        else:
            pi_obj = data.get("object", {})
            payment_intent_id = pi_obj.get("id")
            metadata = pi_obj.get("metadata") or {}
            order_id = metadata.get("order_id")

        if not order_id:
            return jsonify({"error": "Missing order_id in webhook metadata"}), 400

        order = Order.query.filter_by(id=order_id).first()
        if not order:
            return jsonify({"error": "Order not found"}), 404

        payment_q = Payment.query.filter_by(order_id=order.id, provider="stripe")
        if stripe_session_id:
            payment_q = payment_q.filter_by(stripe_session_id=stripe_session_id)

        payment = payment_q.first()

        if not payment:
            payment = Payment(
                order_id=order.id,
                amount=order.total,
                provider="stripe",
                status="Completed",
                currency=current_app.config.get("STRIPE_CURRENCY", "KES"),
                stripe_session_id=stripe_session_id,
                stripe_payment_intent_id=payment_intent_id,
                verified_at=datetime.utcnow(),
                transaction_id=str(payment_intent_id) if payment_intent_id else None,
            )
            db.session.add(payment)
        else:
            payment.status = "Completed"
            payment.stripe_payment_intent_id = payment_intent_id
            if not payment.stripe_session_id and stripe_session_id:
                payment.stripe_session_id = stripe_session_id
            payment.verified_at = payment.verified_at or datetime.utcnow()
            if payment_intent_id and not payment.transaction_id:
                payment.transaction_id = str(payment_intent_id)

        order.status = "Paid"
        db.session.commit()

    return jsonify({"received": True}), 200


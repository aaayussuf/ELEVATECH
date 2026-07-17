from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models.order import Order
from app.models.payment import Payment


payments_bp = Blueprint(
    "payments",
    __name__,
    url_prefix="/api/payments",
)


# ==========================================
# GET ALL PAYMENTS
# ==========================================
@payments_bp.route("", methods=["GET"])
def get_payments():
    payments = Payment.query.order_by(Payment.created_at.desc()).all()

    return jsonify(
        {
            "count": len(payments),
            "payments": [p.to_dict() for p in payments],
        }
    )


# ==========================================
# GET SINGLE PAYMENT
# ==========================================
@payments_bp.route("/<int:id>", methods=["GET"])
def get_payment(id):
    payment = Payment.query.get_or_404(id)

    return jsonify(payment.to_dict())


# ==========================================
# CREATE PAYMENT (Deprecated - Stripe checkout should be used)
# ==========================================
@payments_bp.route("", methods=["POST"])
def create_payment():
    """Deprecated: use /api/checkout for Stripe payments."""

    data = request.get_json() or {}
    order = Order.query.get_or_404(data["order_id"])

    payment = Payment(
        order_id=order.id,
        amount=order.total,
        provider=data.get("provider", "cash"),
        status="Pending",
    )

    db.session.add(payment)
    db.session.commit()

    return jsonify({"message": "Payment created (deprecated)", "payment": payment.to_dict()}), 201


# ==========================================
# VERIFY PAYMENT (Deprecated)
# ==========================================
@payments_bp.route("/<int:id>/verify", methods=["PATCH"])
def verify_payment(id):
    """Deprecated: Stripe webhooks now automatically verify payments."""

    payment = Payment.query.get_or_404(id)
    payment.status = "Completed"
    if not payment.transaction_id:
        payment.transaction_id = f"TXN-{payment.id:06d}"
    db.session.commit()

    return jsonify({"message": "Payment verified (deprecated)", "payment": payment.to_dict()})


# ==========================================
# PAYMENT HISTORY FOR AN ORDER
# ==========================================
@payments_bp.route("/order/<int:order_id>", methods=["GET"])
def order_payments(order_id):
    payments = Payment.query.filter_by(order_id=order_id).all()

    return jsonify(
        {
            "count": len(payments),
            "payments": [p.to_dict() for p in payments],
        }
    )


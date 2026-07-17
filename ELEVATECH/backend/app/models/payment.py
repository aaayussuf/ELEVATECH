from app.extensions import db
from .base import BaseModel


class Payment(BaseModel):
    __tablename__ = "payments"

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id"),
        nullable=False
    )

    amount = db.Column(db.Float, nullable=False)

    provider = db.Column(db.String(50), nullable=False)

    transaction_id = db.Column(db.String(255))

    # Stripe identifiers
    stripe_session_id = db.Column(db.String(255), index=True)
    stripe_payment_intent_id = db.Column(db.String(255), index=True)
    verified_at = db.Column(db.DateTime)


    status = db.Column(
        db.String(50),
        default="Pending"
    )

    currency = db.Column(
        db.String(10),
        default="KES"
    )


    order = db.relationship(
        "Order",
        backref=db.backref("payments", lazy=True)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "amount": self.amount,
            "provider": self.provider,
            "transaction_id": self.transaction_id,
            "stripe_session_id": self.stripe_session_id,
            "stripe_payment_intent_id": self.stripe_payment_intent_id,
            "verified_at": self.verified_at.isoformat() if self.verified_at else None,
            "status": self.status,
            "currency": self.currency,
        }



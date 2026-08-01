from app.extensions import db
from .base import BaseModel


class Coupon(BaseModel):
    __tablename__ = "coupons"

    code = db.Column(db.String(50), unique=True, nullable=False)

    description = db.Column(db.String(255))

    discount_type = db.Column(
        db.String(20),
        nullable=False
    )
    # percent or fixed

    value = db.Column(
        db.Float,
        nullable=False
    )

    minimum_amount = db.Column(
        db.Float,
        default=0
    )

    usage_limit = db.Column(
        db.Integer,
        default=0
    )

    used = db.Column(
        db.Integer,
        default=0
    )

    expires_at = db.Column(db.DateTime)

    active = db.Column(
        db.Boolean,
        default=True
    )

    def to_dict(self):

        return {

            "id": self.id,

            "code": self.code,

            "description": self.description,

            "discount_type": self.discount_type,

            "value": self.value,

            "minimum_amount": self.minimum_amount,

            "usage_limit": self.usage_limit,

            "used": self.used,

            "expires_at":
                self.expires_at.isoformat()
                if self.expires_at
                else None,

            "active": self.active,

        }


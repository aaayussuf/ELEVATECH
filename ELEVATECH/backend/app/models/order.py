from app.extensions import db
from datetime import datetime, timezone


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    total = db.Column(db.Float, nullable=False)

    status = db.Column(
        db.String(30),
        default="Pending"
    )

    payment_method = db.Column(
        db.String(50),
        default="Cash"
    )

    # NEW
    payment_status = db.Column(
        db.String(30),
        default="Pending"
    )

    tracking_number = db.Column(
        db.String(100)
    )

    courier = db.Column(
        db.String(100)
    )

    notes = db.Column(
        db.Text
    )

    shipped_at = db.Column(
        db.DateTime
    )

    delivered_at = db.Column(
        db.DateTime
    )

    # Coupon
    coupon_id = db.Column(
        db.Integer,
        db.ForeignKey("coupons.id"),
        nullable=True,
    )

    coupon_code = db.Column(
        db.String(50)
    )

    discount = db.Column(
        db.Float,
        default=0
    )

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    items = db.relationship(
        "OrderItem",
        backref="order",
        lazy=True,
        cascade="all, delete-orphan"
    )

    coupon = db.relationship(
        "Coupon",
        backref="orders",
        lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total": float(self.total),
            "status": self.status,
            "payment_method": self.payment_method,
            "payment_status": self.payment_status,
            "tracking_number": self.tracking_number,
            "courier": self.courier,
            "notes": self.notes,
            "discount": self.discount,
            "coupon_code": self.coupon_code,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "shipped_at": self.shipped_at.isoformat() if self.shipped_at else None,
            "delivered_at": self.delivered_at.isoformat() if self.delivered_at else None,
            "items": [item.to_dict() for item in self.items]
        }


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id"),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    price = db.Column(
        db.Float,
        nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else None,
            "image": self.product.image if self.product else None,
            "quantity": self.quantity,
            "price": float(self.price),
            "subtotal": float(self.price * self.quantity),
        }

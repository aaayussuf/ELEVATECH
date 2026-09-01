from datetime import datetime, timezone

from app.extensions import db


class InventoryMovement(db.Model):
    __tablename__ = "inventory_movements"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    purchase_order_id = db.Column(
        db.Integer,
        db.ForeignKey("purchase_orders.id")
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    movement_type = db.Column(
        db.String(30),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    product = db.relationship("Product")

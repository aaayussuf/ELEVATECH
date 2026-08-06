from datetime import datetime

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
        default=datetime.utcnow
    )

    product = db.relationship("Product")

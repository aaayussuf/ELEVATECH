from datetime import datetime

from app.extensions import db
from app.models.purchase_order_item import PurchaseOrderItem


class PurchaseOrder(db.Model):

    __tablename__ = "purchase_orders"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    supplier_id = db.Column(
        db.Integer,
        db.ForeignKey("suppliers.id"),
        nullable=False
    )

    status = db.Column(
        db.String(30),
        default="Draft"
    )

    notes = db.Column(
        db.Text
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    supplier = db.relationship(
        "Supplier"
    )

    items = db.relationship(

        "PurchaseOrderItem",

        cascade="all, delete-orphan",

        lazy=True

    )

    def to_dict(self):

        return {

            "id": self.id,

            "status": self.status,

            "notes": self.notes,

            "supplier": self.supplier.to_dict(),

            "items": [

                item.to_dict()

                for item in self.items

            ],

            "created_at": self.created_at.isoformat()

        }

from app.extensions import db


class PurchaseOrderItem(db.Model):

    __tablename__ = "purchase_order_items"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    purchase_order_id = db.Column(
        db.Integer,
        db.ForeignKey("purchase_orders.id"),
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

    cost_price = db.Column(
        db.Float,
        default=0
    )

    product = db.relationship("Product")

    def to_dict(self):

        return {

            "id": self.id,

            "product_id": self.product_id,

            "product_name": self.product.name,

            "quantity": self.quantity,

            "cost_price": self.cost_price

        }

from app.extensions import db

from app.models.product import Product
from app.models.inventory_movement import InventoryMovement


def receive_purchase_order(po):

    if po.status == "Received":
        return False

    for item in po.items:

        product = Product.query.get(item.product_id)

        product.quantity += item.quantity

        movement = InventoryMovement(

            product_id=product.id,

            purchase_order_id=po.id,

            quantity=item.quantity,

            movement_type="IN"

        )

        db.session.add(movement)

    po.status = "Received"

    db.session.commit()

    return True

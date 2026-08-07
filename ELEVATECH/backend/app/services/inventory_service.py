from app.extensions import db
from app.models.product import Product
from app.models.inventory_movement import InventoryMovement


def get_reorder_suggestions():
    """
    Return products that are at or below their low-stock threshold.
    """
    products = Product.query.all()

    suggestions = []

    for product in products:
        threshold = product.low_stock or 0

        if product.quantity <= threshold:
            suggestions.append({
                "product_id": product.id,
                "product_name": product.name,
                "current_stock": product.quantity,
                "minimum_stock": threshold,
                "recommended_quantity": max(threshold * 2, 10),
                "supplier_id": product.supplier_id,
            })

    return suggestions


def receive_purchase_order(po):
    """
    Receive a purchase order and add stock to inventory.
    """
    if po.status == "Received":
        return False

    for item in po.items:
        product = Product.query.get(item.product_id)

        if not product:
            continue

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


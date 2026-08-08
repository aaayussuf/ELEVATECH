from app.extensions import db

from app.models.purchase_order import PurchaseOrder
from app.models.purchase_order_item import PurchaseOrderItem
from app.models.product import Product


def get_items(purchase_order_id):
    return PurchaseOrderItem.query.filter_by(
        purchase_order_id=purchase_order_id
    ).all()


def add_item(data):
    purchase_order_id = data.get("purchase_order_id")
    product_id = data.get("product_id")
    quantity = int(data.get("quantity", 0))
    cost_price = float(data.get("cost_price", 0))

    purchase_order = PurchaseOrder.query.get(purchase_order_id)

    if not purchase_order:
        raise ValueError("Purchase order not found.")

    if purchase_order.status in ["Received", "Cancelled"]:
        raise ValueError(
            "Cannot modify a purchase order that is Received or Cancelled."
        )

    product = Product.query.get(product_id)

    if not product:
        raise ValueError("Product not found.")

    if quantity <= 0:
        raise ValueError("Quantity must be greater than zero.")

    if cost_price < 0:
        raise ValueError("Cost price cannot be negative.")

    existing_item = PurchaseOrderItem.query.filter_by(
        purchase_order_id=purchase_order_id,
        product_id=product_id
    ).first()

    if existing_item:
        existing_item.quantity += quantity
        existing_item.cost_price = cost_price

        db.session.commit()

        return existing_item

    item = PurchaseOrderItem(
        purchase_order_id=purchase_order_id,
        product_id=product_id,
        quantity=quantity,
        cost_price=cost_price
    )

    db.session.add(item)
    db.session.commit()

    return item


def update_item(item_id, data):
    item = PurchaseOrderItem.query.get(item_id)

    if not item:
        return None

    purchase_order = PurchaseOrder.query.get(
        item.purchase_order_id
    )

    if not purchase_order:
        return None

    if purchase_order.status in ["Received", "Cancelled"]:
        raise ValueError(
            "Cannot modify items on a Received or Cancelled purchase order."
        )

    if "quantity" in data:
        quantity = int(data["quantity"])

        if quantity <= 0:
            raise ValueError(
                "Quantity must be greater than zero."
            )

        item.quantity = quantity

    if "cost_price" in data:
        cost_price = float(data["cost_price"])

        if cost_price < 0:
            raise ValueError(
                "Cost price cannot be negative."
            )

        item.cost_price = cost_price

    db.session.commit()

    return item


def delete_item(item_id):
    item = PurchaseOrderItem.query.get(item_id)

    if not item:
        return False

    purchase_order = PurchaseOrder.query.get(
        item.purchase_order_id
    )

    if not purchase_order:
        return False

    if purchase_order.status in ["Received", "Cancelled"]:
        raise ValueError(
            "Cannot delete items from a Received or Cancelled purchase order."
        )

    db.session.delete(item)

    db.session.commit()

    return True

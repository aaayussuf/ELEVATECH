from app.extensions import db

from app.models.purchase_order_item import PurchaseOrderItem


def get_items(po_id):
    return PurchaseOrderItem.query.filter_by(
        purchase_order_id=po_id
    ).all()


def add_item(data):

    item = PurchaseOrderItem(

        purchase_order_id=data["purchase_order_id"],

        product_id=data["product_id"],

        quantity=data["quantity"],

        cost_price=data["cost_price"]

    )

    db.session.add(item)
    db.session.commit()

    return item


def update_item(item_id, data):

    item = PurchaseOrderItem.query.get(item_id)

    if not item:
        return None

    item.quantity = data.get(
        "quantity",
        item.quantity
    )

    item.cost_price = data.get(
        "cost_price",
        item.cost_price
    )

    db.session.commit()

    return item


def delete_item(item_id):

    item = PurchaseOrderItem.query.get(item_id)

    if not item:
        return False

    db.session.delete(item)
    db.session.commit()

    return True

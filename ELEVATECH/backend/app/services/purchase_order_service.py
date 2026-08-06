from app.extensions import db
from app.models.purchase_order import PurchaseOrder


def get_purchase_orders():
    return (
        PurchaseOrder.query
        .order_by(PurchaseOrder.created_at.desc())
        .all()
    )


def get_purchase_order(po_id):
    return PurchaseOrder.query.get(po_id)


def create_purchase_order(data):

    po = PurchaseOrder(
        supplier_id=data["supplier_id"],
        status=data.get("status", "Draft"),
        notes=data.get("notes", "")
    )

    db.session.add(po)
    db.session.commit()

    return po


def update_purchase_order(po_id, data):

    po = PurchaseOrder.query.get(po_id)

    if not po:
        return None

    po.status = data.get("status", po.status)
    po.notes = data.get("notes", po.notes)

    db.session.commit()

    return po


def delete_purchase_order(po_id):

    po = PurchaseOrder.query.get(po_id)

    if not po:
        return False

    db.session.delete(po)
    db.session.commit()

    return True

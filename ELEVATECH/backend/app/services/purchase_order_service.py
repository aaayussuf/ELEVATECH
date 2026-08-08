from app.extensions import db
from app.models.purchase_order import PurchaseOrder


PROTECTED_STATUSES = {"Received", "Cancelled"}
VALID_STATUSES = {"Draft", "Ordered", "Received", "Cancelled"}


def get_purchase_orders():
    return (
        PurchaseOrder.query
        .order_by(PurchaseOrder.created_at.desc())
        .all()
    )


def get_purchase_order(po_id):
    return PurchaseOrder.query.get(po_id)


def create_purchase_order(data):
    status = data.get("status", "Draft")

    if status not in VALID_STATUSES:
        raise ValueError("Invalid purchase order status.")

    po = PurchaseOrder(
        supplier_id=data["supplier_id"],
        status=status,
        notes=data.get("notes", "")
    )

    db.session.add(po)
    db.session.commit()

    return po


def update_purchase_order(po_id, data):
    po = PurchaseOrder.query.get(po_id)

    if not po:
        return None

    if po.status in PROTECTED_STATUSES:
        raise ValueError(
            "Cannot modify a Received or Cancelled purchase order."
        )

    status = data.get("status", po.status)

    if status not in VALID_STATUSES:
        raise ValueError("Invalid purchase order status.")

    # Do not allow editing directly back into Received here.
    # Receiving must happen through the /receive endpoint.
    if status == "Received":
        raise ValueError(
            "Use the receive action to mark a purchase order as Received."
        )

    po.status = status
    po.notes = data.get("notes", po.notes)

    db.session.commit()

    return po


def delete_purchase_order(po_id):
    po = PurchaseOrder.query.get(po_id)

    if not po:
        return False, "Purchase order not found."

    if po.status in ("Received", "Cancelled"):
        return False, (
            "Cannot delete a Received or Cancelled purchase order."
        )

    db.session.delete(po)
    db.session.commit()

    return True, "Purchase order deleted successfully."

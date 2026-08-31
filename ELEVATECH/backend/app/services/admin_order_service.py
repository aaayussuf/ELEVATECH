from datetime import datetime

from app.extensions import db
from app.extensions.socketio import socketio
from app.models.order import Order


def get_all_orders():
    return (
        Order.query
        .order_by(Order.created_at.desc())
        .all()
    )


def get_order(order_id):
    return Order.query.get(order_id)


def update_order(order_id, data):

    order = Order.query.get(order_id)

    if not order:
        return None

    # -----------------------------------------
    # ORDER STATUS
    # -----------------------------------------

    if "status" in data:

        new_status = data["status"]

        order.status = new_status

        # Record shipping time only once
        if new_status == "Shipped" and not order.shipped_at:
            order.shipped_at = datetime.utcnow()

        # Record delivery time only once
        if new_status == "Delivered" and not order.delivered_at:
            order.delivered_at = datetime.utcnow()

    # -----------------------------------------
    # PAYMENT STATUS
    # -----------------------------------------

    if "payment_status" in data:
        order.payment_status = data["payment_status"]

    # -----------------------------------------
    # SHIPPING INFORMATION
    # -----------------------------------------

    if "tracking_number" in data:
        order.tracking_number = data["tracking_number"]

    if "courier" in data:
        order.courier = data["courier"]

    # -----------------------------------------
    # NOTES
    # -----------------------------------------

    if "notes" in data:
        order.notes = data["notes"]

    # -----------------------------------------
    # SAVE
    # -----------------------------------------

    db.session.commit()

    # -----------------------------------------
    # REAL-TIME ADMIN/CUSTOMER UPDATE
    # -----------------------------------------

    socketio.emit(
        "order_updated",
        {
            "order_id": order.id,
            "status": order.status,
        },
        room=f"customer_{order.user_id}"
    )

    return order

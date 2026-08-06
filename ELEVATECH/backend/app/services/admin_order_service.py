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

    if "status" in data:
        order.status = data["status"]

        if data["status"] == "Shipped":
            order.shipped_at = datetime.utcnow()

        if data["status"] == "Delivered":
            order.delivered_at = datetime.utcnow()

    if "payment_status" in data:
        order.payment_status = data["payment_status"]

    if "tracking_number" in data:
        order.tracking_number = data["tracking_number"]

    if "courier" in data:
        order.courier = data["courier"]

    if "notes" in data:
        order.notes = data["notes"]

    db.session.commit()

    socketio.emit(
        "order_updated",
        {
            "order_id": order.id,
            "status": order.status,
        }
    )

    return order

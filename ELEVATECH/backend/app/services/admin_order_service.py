from app.extensions import db
from app.models.order import Order


def get_all_orders():
    """Return all orders ordered by newest first."""
    return (
        Order.query
        .order_by(Order.created_at.desc())
        .all()
    )


def get_order(order_id):
    """Return one order or None."""
    return Order.query.get(order_id)


def update_order_status(order_id, status):
    order = Order.query.get(order_id)

    if not order:
        return None

    order.status = status

    db.session.commit()

    return order


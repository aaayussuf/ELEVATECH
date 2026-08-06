from app.models.order import Order


STATUSES = [
    "Pending",
    "Processing",
    "Paid",
    "Shipped",
    "Delivered",
    "Cancelled",
]


def get_kanban_orders():

    board = {}

    for status in STATUSES:

        orders = (
            Order.query
            .filter_by(status=status)
            .order_by(Order.created_at.desc())
            .all()
        )

        board[status] = [
            order.to_dict()
            for order in orders
        ]

    return board

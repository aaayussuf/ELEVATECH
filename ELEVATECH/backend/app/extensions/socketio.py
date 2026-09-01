from flask_socketio import SocketIO, join_room
from flask_jwt_extended import decode_token

socketio = SocketIO(
    cors_allowed_origins="*"
)


@socketio.on("join_customer_room")
def join_customer_room(data):

    token = data.get("token") if data else None

    if not token:
        return

    try:
        decoded = decode_token(token)

        user_id = decoded.get("sub")

        if not user_id:
            return

        room = f"customer_{user_id}"

        join_room(room)

        print(
            f"Socket client {user_id} joined {room}"
        )

    except Exception as exc:
        print(
            "Socket authentication failed:",
            exc
        )


def emit_customer_order_update(order):
    """
    Send an order update only to the customer
    who owns the order.
    """

    if not order or not order.user_id:
        return

    socketio.emit(
        "customer_order_updated",
        {
            "order_id": order.id,
            "status": order.status,
            "payment_status": order.payment_status,
            "tracking_number": order.tracking_number,
            "courier": order.courier,
            "shipped_at": (
                order.shipped_at.isoformat()
                if order.shipped_at
                else None
            ),
            "delivered_at": (
                order.delivered_at.isoformat()
                if order.delivered_at
                else None
            ),
        },
        room=f"customer_{order.user_id}",
    )

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

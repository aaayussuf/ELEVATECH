from app.extensions.socketio import socketio


def send_test_notification():
    socketio.emit(
        "notification",
        {
            "title": "Socket.IO Connected",
            "message": "Real-time notifications are working!"
        }
    )

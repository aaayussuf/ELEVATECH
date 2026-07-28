from flask_mail import Message
from app.extensions import mail


def send_order_status_email(user, order):

    msg = Message(
        subject=f"ELEVATECH Order #{order.id}",
        recipients=[user.email]
    )

    msg.body = f"""
Hello {user.first_name},

Your order status has changed.

Order #{order.id}

New Status

{order.status}

Thank you for shopping with ELEVATECH.
"""

    mail.send(msg)


def send_order_confirmation(user, order):
    print("===== SENDING EMAIL =====")
    print("Recipient:", user.email)

    msg = Message(
        subject=f"ELEVATECH - Order #{order.id} Confirmed",
        recipients=[user.email],
    )

    msg.body = f"""
Hello {user.first_name},

Thank you for shopping with ELEVATECH!

Your payment has been received successfully.

Order ID: {order.id}
Amount: KES {order.total}

Regards,
ELEVATECH Store
"""

    try:
        mail.send(msg)
        print("✅ EMAIL SENT SUCCESSFULLY")

    except Exception as e:
        print("=" * 60)
        print("EMAIL ERROR")
        print(type(e).__name__)
        print(e)
        print("=" * 60)
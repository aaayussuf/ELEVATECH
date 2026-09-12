from flask import current_app
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
        print("[OK] EMAIL SENT SUCCESSFULLY")

    except Exception as e:
        print("=" * 60)
        print("EMAIL ERROR")
        print(type(e).__name__)
        print(e)
        print("=" * 60)


def _deliver_verification_email(subject, user, code):
    """
    Shared internal helper for one-time-code emails.

    In TESTING mode we never touch the real SMTP server — the code is printed
    to the console instead so the automated suite stays fast and offline.
    """
    msg = Message(subject=subject, recipients=[user.email])

    msg.body = f"""
Hi {user.first_name},

Your ELEVATECH verification code is: {code}

The code expires in 10 minutes. If you didn't request this code,
please ignore this email — your account stays safe.

Regards,
The ELEVATECH Team
"""

    msg.html = f"""
<!DOCTYPE html>
<html>
  <body style="margin:0;background:#07101D;font-family:Arial,sans-serif;padding:32px">
    <div style="max-width:520px;margin:auto;border-radius:16px;background:#0B1526;color:#ffffff;padding:32px">
      <div style="font-size:12px;letter-spacing:2px;color:#FACC14;font-weight:bold">ELEVATECH</div>
      <h2 style="margin:16px 0 4px;font-size:22px">Hello {user.first_name},</h2>
      <p style="color:#CBD5E1;line-height:1.6">Use the code below to complete your verification. It expires in <b>10 minutes</b>.</p>
      <div style="background:#101A2E;border:1px solid #FACC14;border-radius:12px;padding:18px;text-align:center;font-size:30px;letter-spacing:8px;font-weight:bold;color:#FACC14">{code}</div>
      <p style="color:#94A3B8;font-size:13px;margin-top:20px">If you didn't request this code, you can safely ignore this email.<br/>&copy; 2026 ELEVATECH &mdash; Premium technology, better living.</p>
    </div>
  </body>
</html>
"""

    if current_app.config.get("TESTING"):
        print(f"[MAIL:TEST] {subject} -> {user.email}: {code}")
        return True

    try:
        mail.send(msg)
        print(f"[MAIL] {subject} -> {user.email}")
        return True
    except Exception as e:
        print("=" * 60)
        print("EMAIL ERROR")
        print(type(e).__name__)
        print(e)
        print("=" * 60)
        return False


def send_otp_email(user, code):
    return _deliver_verification_email(
        "Your ELEVATECH verification code",
        user,
        code,
    )


def send_reset_email(user, code):
    return _deliver_verification_email(
        "Reset your ELEVATECH password",
        user,
        code,
    )
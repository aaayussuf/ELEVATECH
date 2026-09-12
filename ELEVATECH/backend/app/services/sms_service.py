import os

import requests


def send_otp_sms(user, code):
    """
    Deliver a one-time password to `user.phone` via SMS.

    Twilio is used when TWILIO_* settings are present. Without credentials the
    code is logged to the server console so the full flow can still be tested
    locally (the frontend always shows "if you don't receive it, contact us").
    """
    message = (
        f"Your ELEVATECH verification code is {code}. "
        f"Valid for 10 minutes. Do not share it with anyone."
    )

    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_FROM_NUMBER")

    phone = user.phone or ""

    if account_sid and auth_token and from_number:
        try:
            resp = requests.post(
                f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json",
                auth=(account_sid, auth_token),
                data={
                    "To": phone,
                    "From": from_number,
                    "Body": message,
                },
                timeout=10,
            )
            resp.raise_for_status()
            print(f"[SMS] OTP code sent to {user.email} via Twilio")
            return True
        except Exception as exc:
            print("=" * 60)
            print("SMS ERROR")
            print(type(exc).__name__)
            print(exc)
            print("=" * 60)
            return False

    print("=" * 60)
    print("SMS (dev mode - no Twilio credentials)")
    print(f"To: {phone}")
    print(f"Code: {code}")
    print("=" * 60)
    return True
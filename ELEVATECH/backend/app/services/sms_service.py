import os

import requests


def _sms_config(key, default=None):
    try:
        from flask import current_app, has_app_context
        if has_app_context():
            value = current_app.config.get(key, default)
            if value not in (None, ""):
                return value
    except Exception:
        pass
    return os.getenv(key, default)


def _to_e164(raw_phone):
    raw = (raw_phone or "").strip()
    if raw.startswith("+"):
        return raw
    return f"+{raw}" if raw else ""


def send_otp_sms(user, code):
    """
    Deliver a one-time password to `user.phone` via SMS.

    Priority:
      1. Africa's Talking (AT_API_KEY set) — best for real Kenyan delivery
      2. Twilio (TWILIO_* set)
      3. Dev mode — logs the code to the server console.

    Returns True when the code was handed to a provider (or logged in dev),
    False when the provider call failed.
    """
    message = (
        f"Your ELEVATECH verification code is {code}. "
        f"Valid for 10 minutes. Do not share it with anyone."
    )

    from flask import current_app

    def _cfg(key, default=None):
        try:
            value = current_app.config.get(key, default)
            if value not in (None, ""):
                return value
        except Exception:
            pass
        return _sms_config(key, default)

    to_phone = _to_e164(user.phone)

    at_key = _cfg("AT_API_KEY")
    at_username = _cfg("AT_USERNAME", "sandbox") or "sandbox"
    at_sender = _cfg("AT_SENDER_ID", "") or ""

    if at_key:
        try:
            payload = {
                "username": at_username,
                "to": to_phone,
                "message": message,
            }
            if at_sender:
                payload["from"] = at_sender
            resp = requests.post(
                "https://api.africastalking.com/version1/messaging",
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "apiKey": at_key,
                },
                data=payload,
                timeout=15,
            )
            resp.raise_for_status()
            print(f"[SMS] OTP sent to {to_phone} via Africa's Talking")
            return True
        except Exception as exc:
            print("=" * 60)
            print("SMS ERROR (Africa's Talking)")
            print(type(exc).__name__)
            print(exc)
            try:
                print(resp.text[:500])
            except Exception:
                pass
            print("=" * 60)
            return False

    account_sid = _cfg("TWILIO_ACCOUNT_SID")
    auth_token = _cfg("TWILIO_AUTH_TOKEN")
    from_number = _cfg("TWILIO_FROM_NUMBER")

    if account_sid and auth_token and from_number:
        try:
            resp = requests.post(
                f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json",
                auth=(account_sid, auth_token),
                data={
                    "To": to_phone,
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
            try:
                print(resp.text[:500])
            except Exception:
                pass
            print("=" * 60)
            return False

    print("=" * 60)
    print("SMS (dev mode - no SMS credentials)")
    print(f"To: {to_phone}")
    print(f"Code: {code}")
    print("=" * 60)
    return True
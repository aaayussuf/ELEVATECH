import base64
from datetime import datetime

import requests
from flask import current_app


def get_base_url():
    env = current_app.config.get("MPESA_ENV", "sandbox").lower()

    if env == "production":
        return "https://api.safaricom.co.ke"

    return "https://sandbox.safaricom.co.ke"


def get_access_token():

    consumer_key = current_app.config["MPESA_CONSUMER_KEY"]
    consumer_secret = current_app.config["MPESA_CONSUMER_SECRET"]

    auth = base64.b64encode(
        f"{consumer_key}:{consumer_secret}".encode()
    ).decode()

    headers = {
        "Authorization": f"Basic {auth}"
    }

    response = requests.get(
        f"{get_base_url()}/oauth/v1/generate?grant_type=client_credentials",
        headers=headers,
        timeout=30
    )

    response.raise_for_status()

    return response.json()["access_token"]


def generate_password():

    shortcode = current_app.config["MPESA_SHORTCODE"]
    passkey = current_app.config["MPESA_PASSKEY"]

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    password = base64.b64encode(
        f"{shortcode}{passkey}{timestamp}".encode()
    ).decode()

    return password, timestamp


def stk_push(phone, amount, order_id):

    token = get_access_token()

    password, timestamp = generate_password()

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {
        "BusinessShortCode": current_app.config["MPESA_SHORTCODE"],
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": current_app.config["MPESA_SHORTCODE"],
        "PhoneNumber": phone,
        "CallBackURL": current_app.config["MPESA_CALLBACK_URL"],
        "AccountReference": f"ORDER-{order_id}",
        "TransactionDesc": f"Elevatech Order {order_id}"
    }

    response = requests.post(
        f"{get_base_url()}/mpesa/stkpush/v1/processrequest",
        headers=headers,
        json=payload,
        timeout=30
    )

    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)

    response.raise_for_status()

    return response.json()

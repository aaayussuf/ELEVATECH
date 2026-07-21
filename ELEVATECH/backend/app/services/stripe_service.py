import stripe

from flask import current_app

from app.models.order import Order


def init_stripe():
    stripe.api_key = current_app.config["STRIPE_SECRET_KEY"]


def verify_webhook_event(payload: bytes, sig_header: str):
    """Verify Stripe webhook signature and return the decoded event."""
    # Stripe recommends using the webhook signing secret from config.
    webhook_secret = current_app.config["STRIPE_WEBHOOK_SECRET"]
    return stripe.Webhook.construct_event(
        payload=payload,
        sig_header=sig_header,
        secret=webhook_secret,
    )


def create_checkout_session(order_id, order=None, success_url=None, cancel_url=None, currency="KES"):
    """Create a Stripe Checkout Session for an order.

    Backwards compatible with legacy signature create_checkout_session(order_id).
    Also supports the newer route calling convention that passes `order` and URLs.
    """
    init_stripe()

    if order is None:
        order = Order.query.get_or_404(order_id)

    if success_url is None:
        success_url = f"{current_app.config['FRONTEND_URL']}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
    if cancel_url is None:
        cancel_url = f"{current_app.config['FRONTEND_URL']}/payment-cancel"

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[
            {
                "price_data": {
                    "currency": currency.lower(),
                    "product_data": {"name": f"Order #{order.id}"},
                    "unit_amount": round(float(order.total) * 100),
                },
                "quantity": 1,
            }
        ],
        mode="payment",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "order_id": str(order.id)
        },
    )

    return session


def retrieve_session(session_id):
    init_stripe()
    return stripe.checkout.Session.retrieve(session_id)

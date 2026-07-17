import stripe

from flask import current_app

from app.models.order import Order


def init_stripe():
    stripe.api_key = current_app.config["STRIPE_SECRET_KEY"]


def create_checkout_session(order_id):
    """
    Create a Stripe Checkout Session for an order.
    """

    init_stripe()

    order = Order.query.get_or_404(order_id)

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],

        line_items=[
            {
                "price_data": {
                    "currency": "kes",

                    "product_data": {
                        "name": f"Order #{order.id}"
                    },

                    "unit_amount": int(order.total * 100),
                },

                "quantity": 1,
            }
        ],

        mode="payment",

        success_url=f"{current_app.config['FRONTEND_URL']}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",

        cancel_url=f"{current_app.config['FRONTEND_URL']}/payment-cancel",

        metadata={
            "order_id": order.id
        }
    )

    return session


def retrieve_session(session_id):
    init_stripe()

    return stripe.checkout.Session.retrieve(session_id)
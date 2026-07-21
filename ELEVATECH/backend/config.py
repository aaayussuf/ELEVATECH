import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # ==========================
    # DATABASE
    # ==========================
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ==========================
    # FLASK
    # ==========================
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    # ==========================
    # CORS / FRONTEND
    # ==========================
    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173"
    )

    # ==========================
    # FILE UPLOADS
    # ==========================
    UPLOAD_FOLDER = os.getenv(
        "UPLOAD_FOLDER",
        "uploads"
    )

    MAX_CONTENT_LENGTH = int(
        os.getenv("MAX_CONTENT_LENGTH", 16777216)
    )

    # ==========================
    # STRIPE
    # ==========================
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
    STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
    STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

    STRIPE_SUCCESS_URL = os.getenv(
        "STRIPE_SUCCESS_URL",
        "http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}",
    )

    STRIPE_CANCEL_URL = os.getenv(
        "STRIPE_CANCEL_URL",
        "http://localhost:5173/checkout/cancel",
    )

    STRIPE_CURRENCY = os.getenv(
        "STRIPE_CURRENCY",
        "KES"
    )

    # ==========================
    # M-PESA DARAJA
    # ==========================
    MPESA_ENV = os.getenv(
        "MPESA_ENV",
        "sandbox"
    )

    MPESA_CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
    MPESA_CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")

    MPESA_SHORTCODE = os.getenv("MPESA_SHORTCODE")

    MPESA_PASSKEY = os.getenv("MPESA_PASSKEY")

    MPESA_CALLBACK_URL = os.getenv("MPESA_CALLBACK_URL")
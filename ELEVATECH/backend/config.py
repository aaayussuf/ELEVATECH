import os
from dotenv import load_dotenv

load_dotenv()


def _str_to_bool(value, default=False):
    """Parse env booleans case-insensitively: true/1/yes/on -> True."""
    if value is None or value == "":
        return default
    return str(value).strip().lower() in ("1", "true", "yes", "y", "on")


class Config:
    # ==========================
    # DATABASE
    # ==========================
    # DATABASE_URL (Postgres) when set; otherwise local SQLite dev DB at
    # backend/instance/elevatech.db so `python run.py` works with no .env.
    SQLALCHEMY_DATABASE_URI = (
        os.getenv("DATABASE_URL", "").replace("postgres://", "postgresql://", 1)
        or "sqlite:///"
        + os.path.abspath(
            os.path.join(os.path.dirname(__file__), "instance", "elevatech.db")
        ).replace("\\", "/")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ==========================
    # AUTO-INITIALIZE DATABASE
    # ==========================
    # When True, the app creates any missing tables and seeds the initial
    # storefront data (categories/products) automatically on startup.
    # Set AUTO_INIT_DB=false to disable this behaviour.
    AUTO_INIT_DB = os.getenv("AUTO_INIT_DB", "true").lower() == "true"

    # ==========================
    # FLASK
    # ==========================
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-change-me")

    # ==========================
    # CORS / FRONTEND
    # ==========================
    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173"
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
    # CLOUDINARY
    # ==========================
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

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

    # ==========================
    # MAIL
    # ==========================
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = _str_to_bool(os.getenv("MAIL_USE_TLS", "true"), default=True)
    MAIL_USE_SSL = _str_to_bool(os.getenv("MAIL_USE_SSL", "false"), default=False)

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    # Default the sender to the login address so Gmail accepts it even when
    # MAIL_DEFAULT_SENDER is not set explicitly.
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER") or os.getenv("MAIL_USERNAME")

    # ==========================
    # ACCOUNT VERIFICATION (OTP)
    # ==========================
    OTP_LENGTH = int(os.getenv("OTP_LENGTH", 6))
    # How long a single code stays valid (seconds)
    OTP_EXPIRY_SECONDS = int(os.getenv("OTP_EXPIRY_SECONDS", 600))
    # Minimum wait before a user can request a new code (seconds)
    OTP_RESEND_COOLDOWN_SECONDS = int(
        os.getenv("OTP_RESEND_COOLDOWN_SECONDS", 60)
    )

    # ==========================
    # SMS (Twilio / Africa's Talking) — phone OTP
    # ==========================
    # When blank the OTP is printed to the server console (development).
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER")
    # Africa's Talking (recommended for real Kenyan SMS delivery)
    AT_API_KEY = os.getenv("AT_API_KEY")
    AT_USERNAME = os.getenv("AT_USERNAME", "sandbox")
    AT_SENDER_ID = os.getenv("AT_SENDER_ID", "")
    # Set EXPOSE_DEV_OTP=true ONLY on local dev to return the code in the
    # register/resend JSON response so you can test without real SMS.
    EXPOSE_DEV_OTP = os.getenv("EXPOSE_DEV_OTP", "false").lower() == "true"

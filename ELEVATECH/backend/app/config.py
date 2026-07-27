import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")

    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
    STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

    STRIPE_SUCCESS_URL = os.getenv(
        "STRIPE_SUCCESS_URL",
        "http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}",
    )

    STRIPE_CANCEL_URL = os.getenv(
        "STRIPE_CANCEL_URL",
        "http://localhost:5173/checkout/cancel",
    )

    STRIPE_CURRENCY = os.getenv("STRIPE_CURRENCY", "KES")

    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

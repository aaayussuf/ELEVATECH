import secrets
from datetime import datetime, timedelta, timezone

from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import db
from .base import BaseModel


def utcnow():
    """
    Naive-UTC clock used for storing/comparing datetimes.

    SQLAlchemy `DateTime` columns are timezone-naive on both SQLite and
    PostgreSQL (timestamp without time zone), so comparisons must use a
    consistent naive-UTC value.
    """
    return datetime.now(timezone.utc).replace(tzinfo=None)


class User(BaseModel):

    __tablename__ = "users"

    OTP_CHANNELS = ("email", "phone")

    first_name = db.Column(db.String(80), nullable=False)

    last_name = db.Column(db.String(80), nullable=False)

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    phone = db.Column(db.String(30))

    role = db.Column(
        db.String(20),
        default="customer"
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    # ------------------------------------------------------------------
    # Account verification (email + phone OTPs)
    # ------------------------------------------------------------------
    email_verified = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    phone_verified = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    email_otp = db.Column(db.String(6), nullable=True)
    email_otp_expires_at = db.Column(db.DateTime, nullable=True)
    email_otp_sent_at = db.Column(db.DateTime, nullable=True)

    phone_otp = db.Column(db.String(6), nullable=True)
    phone_otp_expires_at = db.Column(db.DateTime, nullable=True)
    phone_otp_sent_at = db.Column(db.DateTime, nullable=True)

    # --- password reset OTP (delivered by email) ---
    reset_otp = db.Column(db.String(6), nullable=True)
    reset_otp_expires_at = db.Column(db.DateTime, nullable=True)
    reset_otp_sent_at = db.Column(db.DateTime, nullable=True)

    orders = db.relationship(
        "Order",
        backref="user",
        lazy=True
    )

    reviews = db.relationship(
        "Review",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(
            self.password_hash,
            password
        )

    # ------------------------------------------------------------------
    # OTP / verification helpers
    # ------------------------------------------------------------------
    @staticmethod
    def new_otp(length=6):
        """Cryptographically-secure numeric one-time password."""
        return "".join(str(secrets.randbelow(10)) for _ in range(length))

    def otp_fields(self, channel):
        if channel == "email":
            return ("email_otp", "email_otp_expires_at", "email_otp_sent_at")
        if channel == "phone":
            return ("phone_otp", "phone_otp_expires_at", "phone_otp_sent_at")
        if channel == "reset":
            return ("reset_otp", "reset_otp_expires_at", "reset_otp_sent_at")
        raise ValueError(f"Unknown OTP channel: {channel}")

    def generate_otp(self, channel, ttl_seconds=600):
        """Generate + store a fresh OTP for a channel (email/phone/reset)."""
        code, expires, _ = self.otp_fields(channel)
        now = utcnow()
        setattr(self, code, User.new_otp())
        setattr(self, expires, now + timedelta(seconds=ttl_seconds))
        # sent_at is used for the resend cooldown clock
        setattr(self, self.otp_fields(channel)[2], now)
        return getattr(self, code)

    def check_otp(self, channel, code):
        """Verify `code` for `channel`. Returns (ok, reason)."""
        code_col, expires_col, _ = self.otp_fields(channel)
        expected = getattr(self, code_col)
        expires_at = getattr(self, expires_col)

        if not expected:
            return False, "no_code"

        if expected != code:
            return False, "wrong"

        if not expires_at or expires_at < utcnow():
            return False, "expired"

        return True, "ok"

    def consume_otp(self, channel):
        """Clear a used OTP so it can never be re-used."""
        code_col, expires_col, sent_col = self.otp_fields(channel)
        setattr(self, code_col, None)
        setattr(self, expires_col, None)
        setattr(self, sent_col, None)

    def is_fully_verified(self):
        return bool(self.email_verified and self.phone_verified)

    def verification_status(self):
        return {
            "email": self.email_verified,
            "phone": self.phone_verified,
        }

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "email_verified": self.email_verified,
            "phone_verified": self.phone_verified,
            "verified": self.is_fully_verified(),
        }


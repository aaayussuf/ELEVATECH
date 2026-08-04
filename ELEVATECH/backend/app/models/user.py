from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import db
from .base import BaseModel


class User(BaseModel):

    __tablename__ = "users"

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

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
        }


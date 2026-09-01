from datetime import datetime, timezone

from app.extensions import db


class Supplier(db.Model):
    __tablename__ = "suppliers"

    id = db.Column(db.Integer, primary_key=True)

    company_name = db.Column(
        db.String(200),
        nullable=False
    )

    contact_name = db.Column(
        db.String(150)
    )

    email = db.Column(
        db.String(150)
    )

    phone = db.Column(
        db.String(50)
    )

    address = db.Column(
        db.Text
    )

    notes = db.Column(
        db.Text
    )

    active = db.Column(
        db.Boolean,
        default=True
    )

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "company_name": self.company_name,
            "contact_name": self.contact_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "notes": self.notes,
            "active": self.active,
            "created_at": self.created_at.isoformat(),
        }

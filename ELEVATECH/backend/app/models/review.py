from datetime import datetime

from app.extensions import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    rating = db.Column(
        db.Integer,
        nullable=False
    )

    title = db.Column(
        db.String(150)
    )

    comment = db.Column(
        db.Text,
        nullable=False
    )

    helpful_count = db.Column(
        db.Integer,
        default=0,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="reviews"
    )

    product = db.relationship(
        "Product",
        back_populates="reviews"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "rating": self.rating,
            "title": self.title,
            "comment": self.comment,
            "helpful_count": self.helpful_count,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "user": {
                "id": self.user.id,
                "name": self.user.name
            }
        }


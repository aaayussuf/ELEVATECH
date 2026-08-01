from datetime import datetime
from app.extensions import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)

    rating = db.Column(db.Integer, nullable=False)

    comment = db.Column(db.Text)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
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

    user = db.relationship("User")

    def to_dict(self):

        return {

            "id": self.id,

            "rating": self.rating,

            "comment": self.comment,

            "created_at": self.created_at.isoformat(),

            "user": self.user.name if self.user else "Anonymous"

        }


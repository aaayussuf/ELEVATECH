from app.extensions import db
from .base import BaseModel


class Category(BaseModel):

    __tablename__ = "categories"

    name = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    slug = db.Column(
        db.String(120),
        unique=True,
        index=True
    )

    description = db.Column(db.Text)

    image = db.Column(db.String(255))

    active = db.Column(
        db.Boolean,
        default=True
    )

    products = db.relationship(
        "Product",
        backref="category",
        lazy=True
    )

    def to_dict(self):

        return {

            "id": self.id,

            "name": self.name,

            "slug": self.slug,

            "description": self.description,

            "image": self.image,

            "active": self.active,

            "products": len(self.products)

        }

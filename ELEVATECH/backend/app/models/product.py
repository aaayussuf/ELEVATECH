from app.extensions import db
from .base import BaseModel


class Product(BaseModel):
    __tablename__ = "products"

    # Basic Information
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(220), unique=True, nullable=False)

    description = db.Column(db.Text)

    short_description = db.Column(db.String(300))

    sku = db.Column(db.String(80), unique=True)

    barcode = db.Column(db.String(80))

    # Pricing
    price = db.Column(db.Float, nullable=False)

    discount_price = db.Column(db.Float)

    cost_price = db.Column(db.Float)

    # Inventory
    quantity = db.Column(db.Integer, default=0)

    low_stock = db.Column(db.Integer, default=5)

    track_inventory = db.Column(db.Boolean, default=True)

    # Images
    image = db.Column(db.String(255))

    image2 = db.Column(db.String(255))

    image3 = db.Column(db.String(255))

    image4 = db.Column(db.String(255))

    # Brand
    brand = db.Column(db.String(120))

    # Status
    featured = db.Column(db.Boolean, default=False)

    active = db.Column(db.Boolean, default=True)

    # Product Specs
    weight = db.Column(db.Float)

    color = db.Column(db.String(80))

    warranty = db.Column(db.String(120))

    # SEO
    meta_title = db.Column(db.String(255))

    meta_description = db.Column(db.String(500))

    # Rating
    rating = db.Column(db.Float, default=0)

    reviews = db.Column(db.Integer, default=0)

    sold = db.Column(db.Integer, default=0)

    views = db.Column(db.Integer, default=0)

    # Relationships
    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=False
    )

    order_items = db.relationship(
        "OrderItem",
        backref="product",
        lazy=True
    )

    # -----------------------------
    # Helper Methods
    # -----------------------------

    @property
    def in_stock(self):
        return self.quantity > 0

    @property
    def has_discount(self):
        return (
            self.discount_price is not None
            and self.discount_price < self.price
        )

    @property
    def discount_percent(self):
        if not self.has_discount:
            return 0

        return round(
            ((self.price - self.discount_price) / self.price) * 100
        )

    # -----------------------------
    # Serialization
    # -----------------------------

    def to_dict(self):
        return {
            "id": self.id,

            "name": self.name,

            "slug": self.slug,

            "description": self.description,

            "short_description": self.short_description,

            "sku": self.sku,

            "barcode": self.barcode,

            "price": self.price,

            "discount_price": self.discount_price,

            "cost_price": self.cost_price,

            "quantity": self.quantity,

            "low_stock": self.low_stock,

            "track_inventory": self.track_inventory,

            "image": self.image,

            "image2": self.image2,

            "image3": self.image3,

            "image4": self.image4,

            "brand": self.brand,

            "featured": self.featured,

            "active": self.active,

            "weight": self.weight,

            "color": self.color,

            "warranty": self.warranty,

            "meta_title": self.meta_title,

            "meta_description": self.meta_description,

            "rating": self.rating,

            "reviews": self.reviews,

            "sold": self.sold,

            "views": self.views,

            "category": self.category.name if self.category else None,

            "category_id": self.category_id,

            "in_stock": self.in_stock,

            "has_discount": self.has_discount,

            "discount_percent": self.discount_percent
        }
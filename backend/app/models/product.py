from extensions import db


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), nullable=False, unique=True, index=True)

    description = db.Column(db.Text, default='', nullable=False)

    price = db.Column(db.Numeric(12, 2), nullable=False)
    currency = db.Column(db.String(10), nullable=False, default='USD')

    stock = db.Column(db.Integer, nullable=False, default=0)

    # optional image URL
    imageUrl = db.Column(db.String(500), nullable=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    category = db.relationship('Category', backref=db.backref('products', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'price': float(self.price),
            'currency': self.currency,
            'stock': self.stock,
            'imageUrl': self.imageUrl,
            'category': self.category.slug if self.category else None,
        }


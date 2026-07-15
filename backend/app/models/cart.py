from extensions import db


class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)

    # cart is session-based. We store a session_id string.
    session_id = db.Column(db.String(64), index=True, nullable=False)

    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product = db.relationship('Product', lazy=True)

    quantity = db.Column(db.Integer, nullable=False, default=1)

    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)

    def line_total(self):
        return float(self.product.price) * int(self.quantity)

    def to_dict(self):
        return {
            'id': self.id,
            'quantity': self.quantity,
            'lineTotal': self.line_total(),
            'product': {
                'id': self.product.id,
                'name': self.product.name,
                'slug': self.product.slug,
                'price': float(self.product.price),
                'currency': self.product.currency,
                'imageUrl': self.product.imageUrl,
            },
        }


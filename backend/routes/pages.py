from flask import Blueprint, jsonify, request

from ..models import Category, Product

pages_bp = Blueprint('pages_bp', __name__, url_prefix='/api')


@pages_bp.get('/public/home')
def home():
    categories = Category.query.order_by(Category.name).limit(8).all()
    featured = Product.query.order_by(Product.created_at.desc()).limit(8).all()

    return jsonify({
        'featured': [p.to_dict() for p in featured],
        'categories': [
            {'id': c.id, 'name': c.name, 'slug': c.slug}
            for c in categories
        ],
    })


@pages_bp.get('/public/about')
def about():
    return jsonify({
        'title': 'About BX Tech Digital World',
        'content': 'Electronics for work & play.',
    })


@pages_bp.post('/public/contact')
def contact():
    data = request.get_json(silent=True) or {}
    if not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({'message': 'name, email, and message are required'}), 400

    # Demo only: pretend message was stored/sent.
    return jsonify({'ok': True, 'message': 'Contact received'})


from flask import Blueprint, jsonify, request

from ..models import Category, Product

products_bp = Blueprint('products_bp', __name__, url_prefix='/api')


@products_bp.get('/categories')
def categories():
    cats = Category.query.order_by(Category.name).all()
    return jsonify({
        'items': [
            {'id': c.id, 'name': c.name, 'slug': c.slug}
            for c in cats
        ]
    })


@products_bp.get('/products')
def list_products():
    category_slug = request.args.get('category')
    q = request.args.get('q')

    query = Product.query

    if category_slug:
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)
        else:
            query = query.filter(False)

    if q:
        like = f"%{q}%"
        query = query.filter((Product.name.ilike(like)) | (Product.slug.ilike(like)))

    items = query.order_by(Product.created_at.desc()).limit(40).all()
    return jsonify({'items': [p.to_dict() for p in items]})


@products_bp.get('/products/<slug>')
def product_detail(slug: str):
    p = Product.query.filter_by(slug=slug).first()
    if not p:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(p.to_dict())


# Admin create/update/delete are in auth-protected routes for simplicity


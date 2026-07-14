from datetime import timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from werkzeug.security import check_password_hash

from ..extensions import db, jwt
from ..models import User, Product


auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api')


@auth_bp.post('/auth/register')
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    role = data.get('role') or 'user'

    if not email or not password:
        return jsonify({'message': 'email and password are required'}), 400

    if role not in ('admin', 'user'):
        return jsonify({'message': 'role must be admin or user'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'email already exists'}), 409

    u = User(email=email, role=role)
    u.set_password(password)
    db.session.add(u)
    db.session.commit()

    return jsonify({'ok': True})


@auth_bp.post('/auth/login')
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    u = User.query.filter_by(email=email).first()
    if not u or not u.check_password(password):
        return jsonify({'message': 'invalid credentials'}), 401

    token = create_access_token(identity={'user_id': u.id, 'role': u.role}, expires_delta=timedelta(hours=12))
    return jsonify({'token': token, 'role': u.role})


@auth_bp.get('/auth/me')
@jwt_required()
def me():
    identity = get_jwt_identity()
    return jsonify({'id': identity.get('user_id'), 'role': identity.get('role')})


# Admin products CRUD
@auth_bp.post('/admin/products')
@jwt_required()
def admin_create_product():
    identity = get_jwt_identity()
    if identity.get('role') != 'admin':
        return jsonify({'message': 'admin only'}), 403

    data = request.get_json(silent=True) or {}
    name = (data.get('name') or '').strip()
    slug = (data.get('slug') or '').strip()

    if not name or not slug:
        return jsonify({'message': 'name and slug are required'}), 400

    if Product.query.filter_by(slug=slug).first():
        return jsonify({'message': 'slug already exists'}), 409

    price = data.get('price')
    stock = data.get('stock', 0)
    description = data.get('description') or ''
    currency = data.get('currency') or 'USD'
    imageUrl = data.get('imageUrl')
    category_id = data.get('categoryId')

    p = Product(
        name=name,
        slug=slug,
        description=description,
        price=price,
        stock=stock,
        currency=currency,
        imageUrl=imageUrl,
        category_id=category_id,
    )
    db.session.add(p)
    db.session.commit()

    return jsonify(p.to_dict()), 201


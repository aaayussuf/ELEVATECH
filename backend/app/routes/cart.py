import uuid

from flask import Blueprint, jsonify, request, session

from ..models import CartItem, Product
from extensions import db


cart_bp = Blueprint('cart_bp', __name__, url_prefix='/api')


def _get_session_id():
    sid = session.get('sid')
    if not sid:
        sid = uuid.uuid4().hex
        session['sid'] = sid
    return sid


@cart_bp.get('/cart')
def get_cart():
    sid = _get_session_id()
    items = CartItem.query.filter_by(session_id=sid).all()

    total = 0.0
    payload_items = []
    for it in items:
        total += it.line_total()
        payload_items.append(it.to_dict())

    return jsonify(
        {
            'items': [
                {**it, 'lineTotal': it['lineTotal'], 'product': it['product']}
                for it in payload_items
            ],
            'total': f"${total:.2f}",
        }
    )


@cart_bp.post('/cart/add')
def add_to_cart():
    data = request.get_json(silent=True) or {}
    product_id = data.get('productId')
    quantity = int(data.get('quantity') or 1)

    if not product_id:
        return jsonify({'message': 'productId is required'}), 400

    p = Product.query.filter_by(id=product_id).first()
    if not p:
        return jsonify({'message': 'product not found'}), 404

    sid = _get_session_id()

    item = CartItem.query.filter_by(session_id=sid, product_id=product_id).first()
    if not item:
        item = CartItem(session_id=sid, product_id=product_id, quantity=quantity)
        db.session.add(item)
    else:
        item.quantity += quantity

    db.session.commit()
    return jsonify({'ok': True})


@cart_bp.post('/cart/update')
def update_cart():
    data = request.get_json(silent=True) or {}
    product_id = data.get('productId')
    quantity = int(data.get('quantity') or 1)

    sid = _get_session_id()

    item = CartItem.query.filter_by(session_id=sid, product_id=product_id).first()
    if not item:
        return jsonify({'message': 'item not found'}), 404

    if quantity <= 0:
        db.session.delete(item)
    else:
        item.quantity = quantity

    db.session.commit()
    return get_cart()


@cart_bp.post('/cart/clear')
def clear_cart():
    sid = _get_session_id()
    CartItem.query.filter_by(session_id=sid).delete()
    db.session.commit()
    return get_cart()


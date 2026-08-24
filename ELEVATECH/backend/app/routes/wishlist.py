from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.product import Product
from app.models.wishlist import Wishlist

wishlist_bp = Blueprint(
    "wishlist",
    __name__,
    url_prefix="/api/wishlist"
)


# ======================================================
# GET CURRENT USER WISHLIST
# ======================================================
@wishlist_bp.route("", methods=["GET"])
@jwt_required()
def get_wishlist():
    user_id = int(get_jwt_identity())
    items = Wishlist.query.filter_by(user_id=user_id).all()
    return jsonify({
        "count": len(items),
        "wishlist": [
            item.to_dict() for item in items
        ]
    }), 200


# ======================================================
# ADD PRODUCT TO CURRENT USER WISHLIST
# ======================================================
@wishlist_bp.route("", methods=["POST"])
@jwt_required()
def add_to_wishlist():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    product_id = data.get("product_id")

    if not product_id:
        return jsonify({
            "message": "product_id is required"
        }), 400

    product = Product.query.get_or_404(product_id)
    exists = Wishlist.query.filter_by(
        user_id=user_id,
        product_id=product.id
    ).first()

    if exists:
        return jsonify({
            "message": "Product already in wishlist"
        }), 400

    item = Wishlist(
        user_id=user_id,
        product_id=product.id
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({
        "message": "Added to wishlist",
        "wishlist": item.to_dict()
    }), 201


# ======================================================
# REMOVE CURRENT USER WISHLIST ITEM
# ======================================================
@wishlist_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def remove_from_wishlist(id):
    user_id = int(get_jwt_identity())
    item = Wishlist.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not item:
        return jsonify({
            "message": "Wishlist item not found"
        }), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({
        "message": "Removed from wishlist"
    }), 200
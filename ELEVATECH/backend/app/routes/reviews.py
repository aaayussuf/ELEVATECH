from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.review import Review
from app.models.product import Product

reviews_bp = Blueprint(
    "reviews",
    __name__,
    url_prefix="/api/reviews"
)


# ---------------------------------------------------
# Get reviews for a product
# ---------------------------------------------------

@reviews_bp.route("/product/<int:product_id>", methods=["GET"])
def get_reviews(product_id):

    reviews = (
        Review.query
        .filter_by(product_id=product_id)
        .order_by(Review.created_at.desc())
        .all()
    )

    return jsonify([
        review.to_dict()
        for review in reviews
    ])


# ---------------------------------------------------
# Create review
# ---------------------------------------------------

@reviews_bp.route("", methods=["POST"])
@jwt_required()
def create_review():

    user_id = int(get_jwt_identity())

    data = request.get_json()

    product = Product.query.get_or_404(
        data["product_id"]
    )

    existing = Review.query.filter_by(
        user_id=user_id,
        product_id=product.id
    ).first()

    if existing:
        return jsonify({
            "message": "You already reviewed this product."
        }), 400

    review = Review(
        user_id=user_id,
        product_id=product.id,
        rating=data["rating"],
        title=data.get("title"),
        comment=data["comment"]
    )

    db.session.add(review)

    db.session.commit()

    return jsonify(
        review.to_dict()
    ), 201

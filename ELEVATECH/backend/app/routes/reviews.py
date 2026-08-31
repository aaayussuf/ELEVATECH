from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.review import Review
from app.models.product import Product
from app.models.order import Order, OrderItem


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

    data = request.get_json() or {}

    # -----------------------------------------------
    # Validate product
    # -----------------------------------------------

    product_id = data.get("product_id")

    if not product_id:
        return jsonify({
            "message": "Product is required."
        }), 400

    product = Product.query.get_or_404(product_id)

    # -----------------------------------------------
    # Validate rating
    # -----------------------------------------------

    rating = data.get("rating")

    if rating is None:
        return jsonify({
            "message": "Rating is required."
        }), 400

    try:
        rating = int(rating)
    except (TypeError, ValueError):
        return jsonify({
            "message": "Rating must be a number."
        }), 400

    if rating < 1 or rating > 5:
        return jsonify({
            "message": "Rating must be between 1 and 5."
        }), 400

    # -----------------------------------------------
    # Validate comment
    # -----------------------------------------------

    comment = str(data.get("comment", "")).strip()

    if not comment:
        return jsonify({
            "message": "Please write a review."
        }), 400

    # -----------------------------------------------
    # Prevent duplicate reviews
    # -----------------------------------------------

    existing = Review.query.filter_by(
        user_id=user_id,
        product_id=product.id
    ).first()

    if existing:
        return jsonify({
            "message": "You already reviewed this product."
        }), 400

    # -----------------------------------------------
    # Verify purchase
    # -----------------------------------------------

    purchased = (
        db.session.query(OrderItem.id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(
            Order.user_id == user_id,
            OrderItem.product_id == product.id
        )
        .first()
    )

    if not purchased:
        return jsonify({
            "message": "You can only review products you have purchased."
        }), 403

    # -----------------------------------------------
    # Create review
    # -----------------------------------------------

    review = Review(
        user_id=user_id,
        product_id=product.id,
        rating=rating,
        title=data.get("title"),
        comment=comment
    )

    db.session.add(review)

    # -----------------------------------------------
    # Update product rating
    # -----------------------------------------------

    db.session.flush()

    reviews = Review.query.filter_by(
        product_id=product.id
    ).all()

    product.rating = round(
        sum(r.rating for r in reviews) / len(reviews),
        1
    )

    db.session.commit()

    return jsonify(
        review.to_dict()
    ), 201


# ---------------------------------------------------
# Mark review as helpful
# ---------------------------------------------------

@reviews_bp.route("/<int:review_id>/helpful", methods=["POST"])
def mark_helpful(review_id):

    review = Review.query.get_or_404(review_id)

    review.helpful_count += 1

    db.session.commit()

    return jsonify({
        "message": "Review marked as helpful.",
        "helpful_count": review.helpful_count
    })


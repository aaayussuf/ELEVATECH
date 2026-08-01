from flask import Blueprint, jsonify, request

from app.extensions import db

from app.models.review import Review

reviews_bp = Blueprint(
    "reviews",
    __name__,
    url_prefix="/api/reviews"
)


@reviews_bp.route("/<int:product_id>")
def get_reviews(product_id):

    reviews = Review.query.filter_by(
        product_id=product_id
    ).order_by(
        Review.created_at.desc()
    ).all()

    return jsonify([
        r.to_dict()
        for r in reviews
    ])


@reviews_bp.route("", methods=["POST"])
def create_review():

    data = request.get_json()

    review = Review(

        rating=data["rating"],

        comment=data["comment"],

        user_id=data["user_id"],

        product_id=data["product_id"]

    )

    db.session.add(review)

    db.session.commit()

    return jsonify(review.to_dict())


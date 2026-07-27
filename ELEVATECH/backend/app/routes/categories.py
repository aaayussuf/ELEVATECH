from flask import Blueprint, jsonify
from app.models.category import Category

categories_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


# ---------------------------------
# GET ALL CATEGORIES
# ---------------------------------
@categories_bp.route("", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories])


# ---------------------------------
# GET SINGLE CATEGORY
# ---------------------------------
@categories_bp.route("/<int:id>", methods=["GET"])
def get_category(id):
    category = Category.query.get_or_404(id)
    return jsonify(category.to_dict())


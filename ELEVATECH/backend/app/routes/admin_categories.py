from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from slugify import slugify

from app.extensions import db
from app.models.category import Category
from app.utils.admin_required import admin_required

admin_categories_bp = Blueprint(
    "admin_categories",
    __name__,
    url_prefix="/api/admin/categories"
)


# ---------------------------------
# GET ALL CATEGORIES
# ---------------------------------
@admin_categories_bp.route("", methods=["GET"])
@admin_required
def list_categories():

    search = request.args.get("search", "")

    page = request.args.get("page", 1, type=int)

    per_page = request.args.get("per_page", 10, type=int)

    query = Category.query

    if search:
        query = query.filter(
            or_(
                Category.name.ilike(f"%{search}%"),
                Category.description.ilike(f"%{search}%")
            )
        )

    pagination = query.order_by(Category.name).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    return jsonify({

        "categories": [
            c.to_dict()
            for c in pagination.items
        ],

        "page": pagination.page,

        "pages": pagination.pages,

        "total": pagination.total

    })


# ---------------------------------
# GET ONE
# ---------------------------------
@admin_categories_bp.route("/<int:id>")
@admin_required
def get_category(id):

    category = Category.query.get_or_404(id)

    return jsonify(category.to_dict())


# ---------------------------------
# CREATE
# ---------------------------------
@admin_categories_bp.route("", methods=["POST"])
@admin_required
def create_category():

    data = request.get_json()

    category = Category(

        name=data["name"],

        slug=slugify(data["name"]),

        description=data.get("description"),

        image=data.get("image"),

        active=data.get("active", True)

    )

    db.session.add(category)

    db.session.commit()

    return jsonify(category.to_dict()), 201


# ---------------------------------
# UPDATE
# ---------------------------------
@admin_categories_bp.route("/<int:id>", methods=["PUT"])
@admin_required
def update_category(id):

    category = Category.query.get_or_404(id)

    data = request.get_json()

    category.name = data["name"]

    category.slug = slugify(data["name"])

    category.description = data.get("description")

    category.image = data.get("image")

    category.active = data.get("active", True)

    db.session.commit()

    return jsonify(category.to_dict())


# ---------------------------------
# DELETE
# ---------------------------------
@admin_categories_bp.route("/<int:id>", methods=["DELETE"])
@admin_required
def delete_category(id):

    category = Category.query.get_or_404(id)

    db.session.delete(category)

    db.session.commit()

    return jsonify({

        "message": "Category deleted."

    })


# ---------------------------------
# TOGGLE STATUS
# ---------------------------------
@admin_categories_bp.route("/<int:id>/status", methods=["PATCH"])
@admin_required
def toggle_status(id):

    category = Category.query.get_or_404(id)

    category.active = not category.active

    db.session.commit()

    return jsonify(category.to_dict())

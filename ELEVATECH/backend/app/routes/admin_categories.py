from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from slugify import slugify

from app.extensions import db
from app.models.category import Category
from app.utils.admin_required import admin_required
from app.services.cloudinary_service import upload_image

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

    name = request.form.get("name")
    description = request.form.get("description")
    active = request.form.get("active", "true").lower() == "true"

    image_url = request.form.get("image_url")

    if not image_url:

        image = request.files.get("image")

        if image:
            result = upload_image(
                image,
                folder="categories"
            )
            image_url = result["secure_url"]

    category = Category(
        name=name,
        slug=slugify(name),
        description=description,
        image=image_url,
        active=active,
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

    category.name = request.form.get("name")
    category.slug = slugify(category.name)
    category.description = request.form.get("description")
    category.active = (
        request.form.get("active", "true").lower() == "true"
    )

    image_url = request.form.get("image_url")

    if image_url:
        category.image = image_url

    else:

        image = request.files.get("image")

        if image:
            result = upload_image(
                image,
                folder="categories"
            )
            category.image = result["secure_url"]

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

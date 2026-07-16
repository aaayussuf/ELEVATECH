from flask import Blueprint, jsonify, request
from sqlalchemy import or_

from app.extensions import db
from app.models.product import Product

admin_products_bp = Blueprint(
    "admin_products",
    __name__,
    url_prefix="/api/admin/products"
)

# ======================================================
# LIST ALL PRODUCTS
# ======================================================
@admin_products_bp.route("", methods=["GET"])
def list_products():

    search = request.args.get("search")
    featured = request.args.get("featured")
    active = request.args.get("active")

    query = Product.query

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.brand.ilike(f"%{search}%"),
                Product.slug.ilike(f"%{search}%")
            )
        )

    if featured == "true":
        query = query.filter(Product.featured.is_(True))

    if active == "true":
        query = query.filter(Product.active.is_(True))

    products = query.order_by(Product.created_at.desc()).all()

    return jsonify({
        "count": len(products),
        "products": [p.to_dict() for p in products]
    })


# ======================================================
# GET SINGLE PRODUCT
# ======================================================
@admin_products_bp.route("/<int:id>", methods=["GET"])
def get_product(id):

    product = Product.query.get_or_404(id)

    return jsonify(product.to_dict())


# ======================================================
# CREATE PRODUCT
# ======================================================
@admin_products_bp.route("", methods=["POST"])
def create_product():

    data = request.get_json()

    product = Product(
        name=data["name"],
        slug=data["slug"],
        description=data.get("description"),
        short_description=data.get("short_description"),
        sku=data.get("sku"),
        barcode=data.get("barcode"),
        price=data["price"],
        discount_price=data.get("discount_price"),
        cost_price=data.get("cost_price"),
        quantity=data.get("quantity", 0),
        low_stock=data.get("low_stock", 5),
        track_inventory=data.get("track_inventory", True),
        image=data.get("image"),
        image2=data.get("image2"),
        image3=data.get("image3"),
        image4=data.get("image4"),
        brand=data.get("brand"),
        featured=data.get("featured", False),
        active=data.get("active", True),
        weight=data.get("weight"),
        color=data.get("color"),
        warranty=data.get("warranty"),
        meta_title=data.get("meta_title"),
        meta_description=data.get("meta_description"),
        category_id=data["category_id"]
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        "message": "Product created successfully",
        "product": product.to_dict()
    }), 201


# ======================================================
# UPDATE PRODUCT
# ======================================================
@admin_products_bp.route("/<int:id>", methods=["PUT"])
def update_product(id):

    product = Product.query.get_or_404(id)

    data = request.get_json()

    for key, value in data.items():
        if hasattr(product, key):
            setattr(product, key, value)

    db.session.commit()

    return jsonify({
        "message": "Product updated successfully",
        "product": product.to_dict()
    })


# ======================================================
# DELETE PRODUCT
# ======================================================
@admin_products_bp.route("/<int:id>", methods=["DELETE"])
def delete_product(id):

    product = Product.query.get_or_404(id)

    db.session.delete(product)
    db.session.commit()

    return jsonify({
        "message": "Product deleted successfully"
    })


# ======================================================
# UPDATE STOCK
# ======================================================
@admin_products_bp.route("/<int:id>/stock", methods=["PATCH"])
def update_stock(id):

    product = Product.query.get_or_404(id)

    data = request.get_json()

    product.quantity = data["quantity"]

    db.session.commit()

    return jsonify({
        "message": "Stock updated",
        "quantity": product.quantity
    })


# ======================================================
# TOGGLE FEATURED
# ======================================================
@admin_products_bp.route("/<int:id>/featured", methods=["PATCH"])
def toggle_featured(id):

    product = Product.query.get_or_404(id)

    product.featured = not product.featured

    db.session.commit()

    return jsonify({
        "message": "Featured status updated",
        "featured": product.featured
    })


# ======================================================
# TOGGLE ACTIVE STATUS
# ======================================================
@admin_products_bp.route("/<int:id>/status", methods=["PATCH"])
def toggle_status(id):

    product = Product.query.get_or_404(id)

    product.active = not product.active

    db.session.commit()

    return jsonify({
        "message": "Status updated",
        "active": product.active
    })


# ======================================================
# LOW STOCK PRODUCTS
# ======================================================
@admin_products_bp.route("/low-stock", methods=["GET"])
def low_stock_products():

    products = Product.query.filter(
        Product.quantity <= Product.low_stock
    ).all()

    return jsonify({
        "count": len(products),
        "products": [p.to_dict() for p in products]
    })


# ======================================================
# FEATURED PRODUCTS
# ======================================================
@admin_products_bp.route("/featured", methods=["GET"])
def featured_products():

    products = Product.query.filter(
        Product.featured.is_(True)
    ).all()

    return jsonify({
        "count": len(products),
        "products": [p.to_dict() for p in products]
    })
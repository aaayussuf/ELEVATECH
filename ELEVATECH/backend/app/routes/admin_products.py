from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import or_

from app.extensions import db
from app.models.product import Product
from app.utils.admin_required import admin_required

admin_products_bp = Blueprint(
    "admin_products",
    __name__,
    url_prefix="/api/admin/products"
)

# ======================================================
# LIST ALL PRODUCTS
# ======================================================
@admin_products_bp.route("", methods=["GET"])
@jwt_required()
@admin_required
def list_products():

    search = request.args.get("search")
    featured = request.args.get("featured")
    active = request.args.get("active")
    sort = request.args.get("sort", "newest")
    category = request.args.get("category")

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    query = Product.query

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.brand.ilike(f"%{search}%"),
                Product.slug.ilike(f"%{search}%")
            )
        )

    if category:
        query = query.filter(
            Product.category_id == category
        )

    if featured == "true":
        query = query.filter(Product.featured.is_(True))

    if active == "true":
        query = query.filter(Product.active.is_(True))

    if sort == "price":
        query = query.order_by(Product.price.asc())
    elif sort == "stock":
        query = query.order_by(Product.quantity.asc())
    elif sort == "name":
        query = query.order_by(Product.name.asc())
    else:
        query = query.order_by(Product.created_at.desc())

    pagination = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False,
    )

    return jsonify({
        "products": [
            p.to_dict()
            for p in pagination.items
        ],
        "page": pagination.page,
        "pages": pagination.pages,
        "total": pagination.total
    })


# ======================================================
# PRODUCT STATS (for admin dashboard cards)
# ======================================================
@admin_products_bp.route("/stats", methods=["GET"])
@jwt_required()
@admin_required
def product_stats():

    total_products = Product.query.count()

    featured_products = Product.query.filter(
        Product.featured.is_(True)
    ).count()

    active_products = Product.query.filter(
        Product.active.is_(True)
    ).count()

    low_stock = Product.query.filter(
        Product.quantity > 0,
        Product.quantity <= Product.low_stock
    ).count()

    out_of_stock = Product.query.filter(
        Product.quantity == 0
    ).count()

    return jsonify({
        "total_products": total_products,
        "featured_products": featured_products,
        "active_products": active_products,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock
    })


# ======================================================
# GET SINGLE PRODUCT
# ======================================================
@admin_products_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
@admin_required
def get_product(id):

    product = Product.query.get_or_404(id)

    return jsonify(product.to_dict())


# ======================================================
# CREATE PRODUCT
# ======================================================
@admin_products_bp.route("", methods=["POST"])
@jwt_required()
@admin_required
def create_product():

    data = request.get_json()

    # Validate required fields
    required = [
        "name",
        "slug",
        "price",
        "category_id"
    ]

    for field in required:
        if not data.get(field):
            return jsonify({
                "message": f"{field} is required"
            }), 400

    # Prevent duplicate slug
    if Product.query.filter_by(
        slug=data["slug"]
    ).first():
        return jsonify({
            "message": "Slug already exists"
        }), 400

    # Prevent duplicate SKU
    if data.get("sku"):
        if Product.query.filter_by(
            sku=data["sku"]
        ).first():
            return jsonify({
                "message": "SKU already exists"
            }), 400

    product = Product(
        name=data["name"],
        slug=data["slug"],
        description=data.get("description"),
        short_description=data.get("short_description"),
        sku=data.get("sku").strip() if data.get("sku") and data.get("sku").strip() else None,
        barcode=data.get("barcode").strip() if data.get("barcode") and data.get("barcode").strip() else None,
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
@jwt_required()
@admin_required
def update_product(id):

    product = Product.query.get_or_404(id)

    data = request.get_json() or {}

    allowed_fields = {
        "name",
        "slug",
        "description",
        "short_description",
        "sku",
        "barcode",
        "price",
        "discount_price",
        "cost_price",
        "quantity",
        "low_stock",
        "track_inventory",
        "image",
        "image2",
        "image3",
        "image4",
        "brand",
        "featured",
        "active",
        "weight",
        "color",
        "warranty",
        "meta_title",
        "meta_description",
        "category_id",
    }

    for key, value in data.items():

        if key not in allowed_fields:
            continue

        if key in ["sku", "barcode"]:
            value = (
                value.strip()
                if isinstance(value, str) and value.strip()
                else None
            )

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
@jwt_required()
@admin_required
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
@jwt_required()
@admin_required
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
@jwt_required()
@admin_required
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
@jwt_required()
@admin_required
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
@jwt_required()
@admin_required
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
@jwt_required()
@admin_required
def featured_products():

    products = Product.query.filter(
        Product.featured.is_(True)
    ).all()

    return jsonify({
        "count": len(products),
        "products": [p.to_dict() for p in products]
    })


# ======================================================
# INVENTORY
# ======================================================
@admin_products_bp.route("/inventory", methods=["GET"])
@jwt_required()
@admin_required
def inventory():

    products = Product.query.order_by(Product.name.asc()).all()

    inventory = []

    for product in products:

        if product.quantity == 0:
            status = "Out of Stock"
        elif product.quantity <= product.low_stock:
            status = "Low Stock"
        else:
            status = "In Stock"

        inventory.append({
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "stock": product.quantity,
            "low_stock": product.low_stock,
            "status": status,
        })

    return jsonify(inventory)


# ======================================================
# BULK DELETE PRODUCTS
# ======================================================
@admin_products_bp.route("/bulk-delete", methods=["DELETE"])
@jwt_required()
@admin_required
def bulk_delete_products():

    data = request.get_json()

    ids = data.get("ids", [])

    if not ids:
        return jsonify({
            "message": "No products selected"
        }), 400

    Product.query.filter(
        Product.id.in_(ids)
    ).delete(synchronize_session=False)

    db.session.commit()

    return jsonify({
        "message": "Products deleted successfully"
    })

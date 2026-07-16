from flask import Blueprint, jsonify, request
from sqlalchemy import or_

from app.extensions import db
from app.models.product import Product

products_bp = Blueprint("products", __name__, url_prefix="/api/products")


# ---------------------------------
# GET ALL PRODUCTS
# ---------------------------------
@products_bp.route("", methods=["GET"])
def get_products():

    query = Product.query.filter_by(active=True)

    # ---------------- Search ----------------
    search = request.args.get("search")

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
                Product.brand.ilike(f"%{search}%")
            )
        )

    # ---------------- Category ----------------
    category = request.args.get("category")

    if category:
        query = query.join(Product.category).filter_by(name=category)

    # ---------------- Brand ----------------
    brand = request.args.get("brand")

    if brand:
        query = query.filter(Product.brand == brand)

    # ---------------- Price ----------------
    min_price = request.args.get("min_price", type=float)

    max_price = request.args.get("max_price", type=float)

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # ---------------- Featured ----------------
    featured = request.args.get("featured")

    if featured == "true":
        query = query.filter(Product.featured.is_(True))

    # ---------------- Sorting ----------------
    sort = request.args.get("sort", "newest")

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())

    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())

    elif sort == "bestseller":
        query = query.order_by(Product.sold.desc())

    elif sort == "rating":
        query = query.order_by(Product.rating.desc())

    else:
        query = query.order_by(Product.created_at.desc())

    # ---------------- Pagination ----------------
    page = request.args.get("page", 1, type=int)

    per_page = request.args.get("per_page", 12, type=int)

    pagination = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    return jsonify({
        "products": [p.to_dict() for p in pagination.items],
        "page": page,
        "pages": pagination.pages,
        "total": pagination.total,
        "has_next": pagination.has_next,
        "has_prev": pagination.has_prev
    })


# ---------------------------------
# FEATURED PRODUCTS
# ---------------------------------
@products_bp.route("/featured", methods=["GET"])
def featured_products():

    products = (
        Product.query
        .filter_by(featured=True, active=True)
        .limit(8)
        .all()
    )

    return jsonify([p.to_dict() for p in products])


# ---------------------------------
# LATEST PRODUCTS
# ---------------------------------
@products_bp.route("/latest", methods=["GET"])
def latest_products():

    products = (
        Product.query
        .filter_by(active=True)
        .order_by(Product.created_at.desc())
        .limit(8)
        .all()
    )

    return jsonify([p.to_dict() for p in products])


# ---------------------------------
# PRODUCT DETAILS
# ---------------------------------
@products_bp.route("/<slug>", methods=["GET"])
def product_details(slug):

    product = Product.query.filter_by(
        slug=slug,
        active=True
    ).first_or_404()

    product.views += 1

    db.session.commit()

    return jsonify(product.to_dict())


# ---------------------------------
# RELATED PRODUCTS
# ---------------------------------
@products_bp.route("/related/<int:product_id>", methods=["GET"])
def related_products(product_id):

    product = Product.query.get_or_404(product_id)

    products = (
        Product.query
        .filter(
            Product.category_id == product.category_id,
            Product.id != product.id,
            Product.active.is_(True)
        )
        .limit(4)
        .all()
    )

    return jsonify([p.to_dict() for p in products])
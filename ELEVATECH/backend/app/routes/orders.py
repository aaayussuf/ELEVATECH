from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.coupon import Coupon

orders_bp = Blueprint(
    "orders",
    __name__,
    url_prefix="/api/orders"
)


def serialize_order(order):
    return {
        "id": order.id,
        "status": order.status,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "tracking_number": order.tracking_number,
        "courier": order.courier,
        "notes": order.notes,
        "discount": order.discount,
        "coupon_code": order.coupon_code,
        "total": order.total,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "shipped_at": (
            order.shipped_at.isoformat()
            if order.shipped_at else None
        ),
        "delivered_at": (
            order.delivered_at.isoformat()
            if order.delivered_at else None
        ),
        "customer": {
            "id": order.user.id,
            "name": order.user.name,
            "email": order.user.email,
            "phone": order.user.phone
        },
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name,
                "product_slug": (
                    item.product.slug if item.product else None
                ),
                "image": item.product.image if item.product else None,
                "price": item.price,
                "quantity": item.quantity,
                "subtotal": item.price * item.quantity
            }
            for item in order.items
        ],
    }


def restore_order_inventory(order):
    """
    Restore stock when an order is cancelled or payment fails.

    Inventory is restored only for a Pending order so that
    repeated calls cannot restore stock twice.
    """

    if not order:
        return False

    if order.status != "Pending":
        return False

    for item in order.items:

        product = Product.query.get(item.product_id)

        if not product:
            continue

        if product.track_inventory:
            product.quantity += item.quantity

        if product.sold >= item.quantity:
            product.sold -= item.quantity

    if order.coupon and order.coupon.used > 0:
        order.coupon.used -= 1

    return True


# ======================================================
# CREATE ORDER
# ======================================================

@orders_bp.route("", methods=["POST"])
@jwt_required()
def create_order():

    user_id = int(get_jwt_identity())

    # Prevent duplicate checkout orders.
    # A customer must finish or cancel the current pending order
    # before creating another one.
    existing_pending_order = Order.query.filter_by(
        user_id=user_id,
        status="Pending"
    ).first()

    if existing_pending_order:
        return jsonify({
            "message": "You already have a pending order.",
            "order_id": existing_pending_order.id
        }), 409

    data = request.get_json() or {}

    items = data.get("items", [])
    coupon_code = data.get("coupon_code")

    # Only allow payment methods supported by the application.
    payment_method = str(
        data.get("payment_method", "Stripe")
    ).strip()

    allowed_payment_methods = {
        "Stripe",
        "M-Pesa",
    }

    if payment_method not in allowed_payment_methods:
        return jsonify({
            "message": "Unsupported payment method."
        }), 400

    if not isinstance(items, list) or not items:
        return jsonify({
            "message": "Cart is empty"
        }), 400

    total = 0

    order = Order(
        user_id=user_id,
        total=0,
        status="Pending",
        payment_status="Pending",
        payment_method=payment_method
    )

    db.session.add(order)

    # -------------------------
    # Create order items
    # -------------------------

    for item in items:

        if not isinstance(item, dict):
            db.session.rollback()
            return jsonify({
                "message": "Invalid order item."
            }), 400

        product_id = item.get("product_id")
        requested_quantity = item.get("quantity")

        if product_id is None or requested_quantity is None:
            db.session.rollback()
            return jsonify({
                "message": "Each item must include product_id and quantity."
            }), 400

        try:
            product_id = int(product_id)
            quantity = int(requested_quantity)
        except (TypeError, ValueError):
            db.session.rollback()
            return jsonify({
                "message": "Invalid product ID or quantity."
            }), 400

        if product_id <= 0:
            db.session.rollback()
            return jsonify({
                "message": "Invalid product ID."
            }), 400

        if quantity <= 0:
            db.session.rollback()
            return jsonify({
                "message": "Quantity must be greater than zero."
            }), 400

        product = Product.query.get(product_id)

        if not product:
            db.session.rollback()
            return jsonify({
                "message": f"Product {product_id} not found"
            }), 404

        if not product.active:
            db.session.rollback()
            return jsonify({
                "message": f"{product.name} is currently unavailable."
            }), 400

        if product.track_inventory:

            if quantity > product.quantity:
                db.session.rollback()
                return jsonify({
                    "message": (
                        f"{product.name} has only "
                        f"{product.quantity} left"
                    )
                }), 400

            product.quantity -= quantity

        product.sold += quantity

        line_total = product.price * quantity
        total += line_total

        db.session.add(
            OrderItem(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price
            )
        )
    # -------------------------
    # Apply Coupon
    # -------------------------

    discount = 0

    if coupon_code:

        coupon = Coupon.query.filter_by(
            code=str(coupon_code).upper().strip(),
            active=True
        ).first()

        if not coupon:
            db.session.rollback()
            return jsonify({
                "message": "Invalid coupon."
            }), 400

        if (
            coupon.expires_at
            and coupon.expires_at < datetime.now(timezone.utc)
        ):
            db.session.rollback()
            return jsonify({
                "message": "Coupon expired."
            }), 400

        if (
            coupon.usage_limit
            and coupon.usage_limit > 0
            and coupon.used >= coupon.usage_limit
        ):
            db.session.rollback()
            return jsonify({
                "message": "Coupon usage limit reached."
            }), 400

        if total < coupon.minimum_amount:
            db.session.rollback()
            return jsonify({
                "message": (
                    f"Minimum order is "
                    f"{coupon.minimum_amount}"
                )
            }), 400

        if coupon.discount_type == "percent":
            discount = total * (coupon.value / 100)
        else:
            discount = coupon.value

        if discount > total:
            discount = total

        coupon.used += 1

        order.coupon = coupon
        order.coupon_id = coupon.id
        order.coupon_code = coupon.code

    # -------------------------
    # Final total
    # -------------------------

    order.discount = round(discount, 2)
    order.total = round(
        max(0, total - discount),
        2
    )

    db.session.commit()

    return jsonify({
        "message": "Order created successfully",
        "subtotal": round(total, 2),
        "discount": order.discount,
        "total": order.total,
        "order": serialize_order(order)
    }), 201


# ======================================================
# CANCEL ORDER / RESTORE INVENTORY
# ======================================================

@orders_bp.route("/<int:order_id>/cancel", methods=["POST"])
@jwt_required()
def cancel_order(order_id):

    user_id = int(get_jwt_identity())

    order = Order.query.filter_by(
        id=order_id,
        user_id=user_id
    ).first()

    if not order:
        return jsonify({
            "message": "Order not found"
        }), 404

    # Only Pending orders can be cancelled.
    if order.status != "Pending":
        return jsonify({
            "message": f"Cannot cancel order with status '{order.status}'"
        }), 400

    # Never cancel an order that is already marked as paid.
    if order.payment_status == "Paid":
        return jsonify({
            "message": "Cannot cancel a paid order"
        }), 400

    restored = restore_order_inventory(order)

    if not restored:
        return jsonify({
            "message": "Order has already been cancelled or inventory restored"
        }), 400

    order.status = "Cancelled"
    order.payment_status = "Failed"

    db.session.commit()

    return jsonify({
        "message": "Order cancelled successfully",
        "order": serialize_order(order)
    }), 200


# ======================================================
# GET ALL ORDERS FOR LOGGED-IN USER
# ======================================================

@orders_bp.route("", methods=["GET"])
@jwt_required()
def get_orders():

    user_id = int(get_jwt_identity())

    orders = (
        Order.query
        .filter_by(user_id=user_id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return jsonify([
        serialize_order(order)
        for order in orders
    ])


# ======================================================
# GET SINGLE ORDER
# ======================================================

@orders_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):

    user_id = int(get_jwt_identity())

    order = Order.query.filter_by(
        id=order_id,
        user_id=user_id
    ).first()

    if not order:
        return jsonify({
            "message": "Order not found"
        }), 404

    return jsonify(
        serialize_order(order)
    )
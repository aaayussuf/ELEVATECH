from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.order import Order, OrderItem
from app.models.product import Product

orders_bp = Blueprint(
    "orders",
    __name__,
    url_prefix="/api/orders"
)


def serialize_order(order):
    return {
        "id": order.id,
        "user_id": order.user_id,
        "status": order.status,
        "payment_method": order.payment_method,
        "total": order.total,
        "created_at": order.created_at.isoformat(),
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "name": item.product.name,
                "image": item.product.image,
                "price": item.price,
                "quantity": item.quantity,
                "subtotal": item.price * item.quantity
            }
            for item in order.items
        ]
    }


@orders_bp.route("", methods=["POST"])
@jwt_required()
def create_order():

    user_id = int(get_jwt_identity())

    data = request.get_json() or {}

    items = data.get("items", [])

    payment_method = data.get(
        "payment_method",
        "Stripe"
    )

    if len(items) == 0:
        return jsonify({
            "message": "Cart is empty"
        }), 400

    total = 0

    order = Order(
        user_id=user_id,
        total=0,
        status="Pending",
        payment_method=payment_method
    )

    db.session.add(order)

    for item in items:

        product = Product.query.get(item["product_id"])

        if not product:
            db.session.rollback()

            return jsonify({
                "message": f"Product {item['product_id']} not found"
            }), 404

        quantity = int(item["quantity"])

        if quantity <= 0:

            db.session.rollback()

            return jsonify({
                "message": "Quantity must be greater than zero"
            }), 400

        if product.track_inventory:

            if quantity > product.quantity:

                db.session.rollback()

                return jsonify({
                    "message": f"{product.name} has only {product.quantity} left"
                }), 400

            product.quantity -= quantity

        product.sold += quantity

        line_total = product.price * quantity

        total += line_total

        order_item = OrderItem(
            order=order,
            product=product,
            quantity=quantity,
            price=product.price
        )

        db.session.add(order_item)

    order.total = total

    db.session.commit()

    return jsonify({
        "message": "Order created successfully",
        "order": serialize_order(order)
    }), 201


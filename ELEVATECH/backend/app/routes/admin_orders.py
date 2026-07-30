from flask import Blueprint, jsonify, request

from flask_jwt_extended import jwt_required

from app.utils.admin_required import admin_required
from app.services.admin_order_service import (
    get_all_orders,
    get_order,
    update_order_status,
)

admin_orders_bp = Blueprint(
    "admin_orders",
    __name__,
    url_prefix="/api/admin/orders",
)


@admin_orders_bp.route("", methods=["GET"])
@jwt_required()
@admin_required
def orders():

    orders = get_all_orders()

    return jsonify([
        o.to_dict()
        for o in orders
    ])


@admin_orders_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
@admin_required
def order(order_id):

    order = get_order(order_id)

    if not order:
        return jsonify({
            "message": "Order not found"
        }), 404

    return jsonify({

        "id": order.id,

        "status": order.status,

        "payment_method": order.payment_method,

        "total": order.total,

        "created_at": order.created_at.isoformat() if order.created_at else None,

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
                "price": item.price,
                "quantity": item.quantity,
                "subtotal": item.price * item.quantity
            }
            for item in order.items
        ]

    })


@admin_orders_bp.route("/<int:order_id>/status", methods=["PATCH"])
@jwt_required()
@admin_required
def change_status(order_id):

    data = request.get_json()

    status = data.get("status")

    allowed = [
        "Pending",
        "Processing",
        "Paid",
        "Shipped",
        "Delivered",
        "Cancelled",
    ]

    if status not in allowed:
        return jsonify({
            "message": "Invalid status"
        }), 400

    order = update_order_status(order_id, status)

    if not order:
        return jsonify({
            "message": "Order not found"
        }), 404

    return jsonify(order.to_dict())


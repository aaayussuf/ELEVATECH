from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.utils.admin_required import admin_required
from app.extensions import db
from app.extensions.socketio import socketio
from app.models.order import Order
from app.services.admin_order_service import (
    get_all_orders,
    get_order,
    update_order,
)
from app.services.admin_kanban_service import get_kanban_orders

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

    return jsonify(order.to_dict())


@admin_orders_bp.route("/<int:order_id>", methods=["PATCH"])
@jwt_required()
@admin_required
def update_order_route(order_id):

    data = request.get_json()

    if "status" in data:
        allowed = [
            "Pending",
            "Processing",
            "Paid",
            "Shipped",
            "Delivered",
            "Cancelled",
        ]

        if data["status"] not in allowed:
            return jsonify({
                "message": "Invalid status"
            }), 400

    order = update_order(order_id, data)

    if not order:
        return jsonify({
            "message": "Order not found"
        }), 404

    return jsonify(order.to_dict())


@admin_orders_bp.route("/kanban", methods=["GET"])
@jwt_required()
@admin_required
def kanban():

    return jsonify(
        get_kanban_orders()
    )


# ======================================================
# UPDATE COMPLETE ORDER
# ======================================================

@admin_orders_bp.route("/<int:order_id>", methods=["PUT"])
@jwt_required()
@admin_required
def update_order_full(order_id):

    order = Order.query.get_or_404(order_id)

    data = request.get_json() or {}

    if "status" in data:
        order.status = data["status"]

    if "payment_status" in data:
        order.payment_status = data["payment_status"]

    if "tracking_number" in data:
        order.tracking_number = data["tracking_number"]

    if "courier" in data:
        order.courier = data["courier"]

    if "notes" in data:
        order.notes = data["notes"]

    if order.status == "Shipped" and not order.shipped_at:
        order.shipped_at = datetime.utcnow()

    if order.status == "Delivered" and not order.delivered_at:
        order.delivered_at = datetime.utcnow()

    db.session.commit()

    socketio.emit(
        "order_updated",
        {
            "order_id": order.id,
            "status": order.status,
        }
    )

    return jsonify(order.to_dict())

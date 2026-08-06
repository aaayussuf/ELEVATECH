from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.utils.admin_required import admin_required

from app.services.purchase_order_service import (
    get_purchase_orders,
    get_purchase_order,
    create_purchase_order,
    update_purchase_order,
    delete_purchase_order,
)

from app.services.inventory_service import receive_purchase_order

purchase_orders_bp = Blueprint(
    "purchase_orders",
    __name__,
    url_prefix="/api/admin/purchase-orders"
)


@purchase_orders_bp.route("", methods=["GET"])
@jwt_required()
@admin_required
def list_purchase_orders():

    return jsonify([
        po.to_dict()
        for po in get_purchase_orders()
    ])


@purchase_orders_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
@admin_required
def single_purchase_order(id):

    po = get_purchase_order(id)

    if not po:
        return jsonify({"message": "Not found"}), 404

    return jsonify(po.to_dict())


@purchase_orders_bp.route("", methods=["POST"])
@jwt_required()
@admin_required
def create():

    po = create_purchase_order(request.json)

    return jsonify(po.to_dict()), 201


@purchase_orders_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
@admin_required
def update(id):

    po = update_purchase_order(id, request.json)

    if not po:
        return jsonify({"message": "Not found"}), 404

    return jsonify(po.to_dict())


@purchase_orders_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete(id):

    if delete_purchase_order(id):
        return jsonify({"message": "Deleted"})

    return jsonify({"message": "Not found"}), 404


@purchase_orders_bp.route("/<int:id>/receive", methods=["POST"])
@jwt_required()
@admin_required
def receive(id):

    po = get_purchase_order(id)

    if not po:
        return jsonify({"message": "Not found"}), 404

    if receive_purchase_order(po):
        return jsonify({"message": "Purchase order received"})

    return jsonify({
        "message": "Already received"
    }), 400

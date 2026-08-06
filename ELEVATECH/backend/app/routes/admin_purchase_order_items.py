from flask import Blueprint, jsonify, request

from flask_jwt_extended import jwt_required

from app.utils.admin_required import admin_required

from app.services.purchase_order_item_service import (
    get_items,
    add_item,
    update_item,
    delete_item,
)

purchase_order_items_bp = Blueprint(
    "purchase_order_items",
    __name__,
    url_prefix="/api/admin/purchase-order-items"
)


@purchase_order_items_bp.route("/<int:purchase_order_id>", methods=["GET"])
@jwt_required()
@admin_required
def items(purchase_order_id):

    return jsonify([
        item.to_dict()
        for item in get_items(purchase_order_id)
    ])


@purchase_order_items_bp.route("", methods=["POST"])
@jwt_required()
@admin_required
def create():

    item = add_item(request.json)

    return jsonify(item.to_dict()), 201


@purchase_order_items_bp.route("/<int:item_id>", methods=["PUT"])
@jwt_required()
@admin_required
def update(item_id):

    item = update_item(item_id, request.json)

    if not item:
        return jsonify({"message": "Not found"}), 404

    return jsonify(item.to_dict())


@purchase_order_items_bp.route("/<int:item_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete(item_id):

    if delete_item(item_id):
        return jsonify({"message": "Deleted"})

    return jsonify({"message": "Not found"}), 404

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.utils.admin_required import admin_required
from app.services.admin_supplier_service import (
    get_suppliers,
    get_supplier,
    create_supplier,
    update_supplier,
    delete_supplier,
)

admin_suppliers_bp = Blueprint(
    "admin_suppliers",
    __name__,
    url_prefix="/api/admin/suppliers"
)


@admin_suppliers_bp.route("", methods=["GET"])
@jwt_required()
@admin_required
def suppliers():
    return jsonify([
        s.to_dict()
        for s in get_suppliers()
    ])


@admin_suppliers_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
@admin_required
def supplier(id):
    supplier = get_supplier(id)

    if not supplier:
        return jsonify({"message": "Supplier not found"}), 404

    return jsonify(supplier.to_dict())


@admin_suppliers_bp.route("", methods=["POST"])
@jwt_required()
@admin_required
def create():
    supplier = create_supplier(request.json)

    return jsonify(supplier.to_dict()), 201


@admin_suppliers_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
@admin_required
def update(id):
    supplier = update_supplier(id, request.json)

    if not supplier:
        return jsonify({"message": "Supplier not found"}), 404

    return jsonify(supplier.to_dict())


@admin_suppliers_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete(id):
    if delete_supplier(id):
        return jsonify({"message": "Deleted"})

    return jsonify({"message": "Supplier not found"}), 404

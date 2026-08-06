from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.utils.admin_required import admin_required
from app.services.inventory_reorder_service import (
    get_reorder_suggestions
)

inventory_bp = Blueprint(
    "inventory",
    __name__,
    url_prefix="/api/admin/inventory"
)


@inventory_bp.route("/reorder-suggestions")
@jwt_required()
@admin_required
def reorder_suggestions():

    return jsonify(
        get_reorder_suggestions()
    )

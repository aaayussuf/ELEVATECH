from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.models.order import Order
from app.utils.admin_required import admin_required

admin_orders_bp = Blueprint(
    "admin_orders",
    __name__,
    url_prefix="/api/admin/orders"
)


@admin_orders_bp.route("", methods=["GET"])
@jwt_required()
@admin_required
def get_orders():

    orders = (
        Order.query
        .order_by(Order.created_at.desc())
        .all()
    )

    results = []

    for order in orders:

        results.append({
            "id": order.id,
            "customer": f"{order.user.first_name} {order.user.last_name}",
            "email": order.user.email,
            "status": order.status,
            "payment": order.payment_method,
            "total": float(order.total),
            "created_at": order.created_at.isoformat()
        })

    return jsonify(results)


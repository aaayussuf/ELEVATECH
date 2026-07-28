from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func

from app.extensions import db
from app.models.order import Order
from app.models.user import User
from app.utils.admin_required import admin_required

admin_customers_bp = Blueprint(
    "admin_customers",
    __name__,
    url_prefix="/api/admin/customers",
)


@admin_customers_bp.route("", methods=["GET"])
@jwt_required()
@admin_required
def list_customers():

    customers = []

    for user in User.query.order_by(User.created_at.desc()).all():
        total_orders = Order.query.filter_by(user_id=user.id).count()

        total_spent = (
            db.session.query(func.coalesce(func.sum(Order.total), 0))
            .filter(
                Order.user_id == user.id,
                Order.status == "Paid",
            )
            .scalar()
        )

        last_order = (
            Order.query.filter_by(user_id=user.id)
            .order_by(Order.created_at.desc())
            .first()
        )

        customers.append({
            "id": user.id,
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "created_at": user.created_at.isoformat(),
            "orders": total_orders,
            "spent": float(total_spent),
            "last_order": (
                last_order.created_at.isoformat() if last_order else None
            ),
        })

    return jsonify(customers)


@admin_customers_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
@admin_required
def get_customer(id):

    user = User.query.get(id)

    if not user:
        return jsonify({"error": "Customer not found"}), 404

    orders = (
        Order.query
        .filter_by(user_id=user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    total_spent = (
        db.session.query(func.coalesce(func.sum(Order.total), 0))
        .filter(
            Order.user_id == user.id,
            Order.status == "Paid",
        )
        .scalar()
    )

    return jsonify({
        "customer": {
            "id": user.id,
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "phone": user.phone or "",
            "created_at": user.created_at.strftime("%Y-%m-%d"),
        },
        "orders": [
            {
                "id": order.id,
                "status": order.status,
                "total": float(order.total),
            }
            for order in orders
        ],
        "spent": float(total_spent),
        "total_orders": len(orders),
    })



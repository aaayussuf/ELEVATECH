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

        first = (user.first_name or "").strip()
        last = (user.last_name or "").strip()
        full_name = f"{first} {last}".strip() or (user.email or "Customer")

        customers.append({
            "id": user.id,
            "name": full_name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "orders": total_orders,
            "spent": float(total_spent or 0),
            "last_order": (
                last_order.created_at.isoformat() if last_order and last_order.created_at else None
            ),
        })

    return jsonify(customers)


@admin_customers_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
@admin_required
def get_customer(id):

    user = db.session.get(User, id)

    if not user:
        return jsonify({"message": "Customer not found", "error": "Customer not found"}), 404

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

    first = (user.first_name or "").strip()
    last = (user.last_name or "").strip()
    full_name = f"{first} {last}".strip() or (user.email or "Customer")

    return jsonify({
        "customer": {
            "id": user.id,
            "name": full_name,
            "email": user.email,
            "phone": user.phone or "",
            "created_at": user.created_at.strftime("%Y-%m-%d") if user.created_at else "",
        },
        "orders": [
            {
                "id": order.id,
                "status": order.status,
                "total": float(order.total or 0),
            }
            for order in orders
        ],
        "spent": float(total_spent or 0),
        "total_orders": len(orders),
    })



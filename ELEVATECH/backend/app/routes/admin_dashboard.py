from datetime import datetime

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from app.extensions import db
from app.models.user import User
from app.models.order import Order
from app.models.product import Product
from app.models.payment import Payment
from app.utils.admin_required import admin_required

admin_dashboard_bp = Blueprint("admin_dashboard", __name__, url_prefix="/api/admin")


@admin_dashboard_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard_stats():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Allow only admins
    if not user or user.role != "admin":
        return jsonify({"error": "Admin access required"}), 403

    total_revenue = (
        db.session.query(func.coalesce(func.sum(Order.total), 0))
        .filter(Order.status == "Paid")
        .scalar()
    )

    total_orders = Order.query.count()
    total_customers = User.query.filter_by(role="customer").count()
    total_products = Product.query.count()
    paid_orders = Order.query.filter_by(status="Paid").count()
    pending_orders = Order.query.filter_by(status="Pending").count()

    recent_orders = (
        Order.query.order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    return jsonify({
        "revenue": float(total_revenue),
        "total_orders": total_orders,
        "paid_orders": paid_orders,
        "pending_orders": pending_orders,
        "customers": total_customers,
        "products": total_products,
        "recent_orders": [
            {
                "id": order.id,
                "status": order.status,
                "total": order.total,
                "created_at": order.created_at.isoformat(),
            }
            for order in recent_orders
        ],
    })


@admin_dashboard_bp.route("/analytics", methods=["GET"])
@jwt_required()
@admin_required
def analytics():
    today = datetime.utcnow().date()

    today_sales = (
        db.session.query(func.sum(Order.total))
        .filter(
            Order.status == "Paid",
            func.date(Order.created_at) == today,
        )
        .scalar()
        or 0
    )

    monthly_sales = (
        db.session.query(func.sum(Order.total))
        .filter(
            Order.status == "Paid",
            func.extract("month", Order.created_at) == today.month,
            func.extract("year", Order.created_at) == today.year,
        )
        .scalar()
        or 0
    )

    yearly_sales = (
        db.session.query(func.sum(Order.total))
        .filter(
            Order.status == "Paid",
            func.extract("year", Order.created_at) == today.year,
        )
        .scalar()
        or 0
    )

    orders_today = (
        Order.query.filter(
            func.date(Order.created_at) == today
        ).count()
    )

    average_order = (
        db.session.query(func.avg(Order.total))
        .filter(Order.status == "Paid")
        .scalar()
        or 0
    )

    return jsonify({
        "today_sales": round(today_sales, 2),
        "monthly_sales": round(monthly_sales, 2),
        "yearly_sales": round(yearly_sales, 2),
        "orders_today": orders_today,
        "average_order": round(average_order, 2),
    })


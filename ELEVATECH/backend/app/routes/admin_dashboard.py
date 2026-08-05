from datetime import datetime, timedelta

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from app.extensions import db
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.payment import Payment
from app.utils.admin_required import admin_required
from app.services.admin_dashboard_service import (
    get_dashboard_summary,
    sales_last_7_days,
    top_products,
)
from app.services.admin_notification_service import get_notifications

admin_dashboard_bp = Blueprint("admin_dashboard", __name__, url_prefix="/api/admin")


@admin_dashboard_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard_stats():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Allow only admins
    if not user or user.role != "admin":
        return jsonify({"error": "Admin access required"}), 403

    summary = get_dashboard_summary()

    sales_chart = sales_last_7_days()

    best_products = top_products()

    recent_orders = (
        Order.query.order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    # ---------------------------------------------------------------
    # Revenue trend — this week vs previous week
    # ---------------------------------------------------------------
    today = datetime.utcnow().date()

    def _revenue_between(start, end):
        return (
            db.session.query(func.coalesce(func.sum(Order.total), 0))
            .filter(
                Order.status == "Paid",
                func.date(Order.created_at) >= start,
                func.date(Order.created_at) <= end,
            )
            .scalar()
        )

    week_start = today - timedelta(days=today.weekday())
    prev_week_start = week_start - timedelta(days=7)
    prev_week_end = week_start - timedelta(days=1)

    revenue_this_week = float(_revenue_between(week_start, today))
    revenue_prev_week = float(_revenue_between(prev_week_start, prev_week_end))

    if revenue_prev_week > 0:
        revenue_change_percent = round(
            ((revenue_this_week - revenue_prev_week) / revenue_prev_week) * 100,
            1,
        )
    else:
        revenue_change_percent = 100.0 if revenue_this_week > 0 else 0.0

    return jsonify({
        **summary,
        "sales_chart": sales_chart,
        "top_products": best_products,
        "revenue_this_week": revenue_this_week,
        "revenue_prev_week": revenue_prev_week,
        "revenue_change_percent": revenue_change_percent,
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


@admin_dashboard_bp.route("/notifications", methods=["GET"])
@jwt_required()
@admin_required
def notifications():

    return jsonify(
        get_notifications()
    )

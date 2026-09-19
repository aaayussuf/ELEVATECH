from datetime import datetime, timedelta, timezone

from sqlalchemy import func

from app.extensions import db
from app.models.order import Order, OrderItem
from app.models.payment import Payment
from app.models.product import Product
from app.models.user import User


def get_dashboard_summary():
    today = datetime.now(timezone.utc).date()

    revenue = (
        db.session.query(func.coalesce(func.sum(Order.total), 0))
        .filter(Order.status == "Paid")
        .scalar()
    )

    customers = User.query.filter_by(
        role="customer"
    ).count()

    products = Product.query.count()

    orders = Order.query.count()

    paid_orders = Order.query.filter_by(
        status="Paid"
    ).count()

    pending_orders = Order.query.filter_by(
        status="Pending"
    ).count()

    return {
        "revenue": float(revenue),
        "orders": orders,
        "customers": customers,
        "products": products,
        "paid_orders": paid_orders,
        "pending_orders": pending_orders,
    }


def get_analytics_data():
    today = datetime.now(timezone.utc).date()

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

    return {
        "today_sales": round(today_sales, 2),
        "monthly_sales": round(monthly_sales, 2),
        "yearly_sales": round(yearly_sales, 2),
        "orders_today": orders_today,
        "average_order": round(average_order, 2),
    }


def sales_last_7_days():
    today = datetime.now(timezone.utc).date()
    start = today - timedelta(days=6)

    rows = (
        db.session.query(
            func.date(Order.created_at),
            func.coalesce(func.sum(Order.total), 0)
        )
        .filter(
            Order.status == "Paid",
            func.date(Order.created_at) >= start.isoformat()
        )
        .group_by(func.date(Order.created_at))
        .all()
    )

    # SQLite returns DATE as 'YYYY-MM-DD' strings — normalise keys to strings.
    totals = {}
    for day_key, total in rows:
        key = str(day_key)[:10] if day_key is not None else ""
        try:
            totals[key] = float(total or 0)
        except (TypeError, ValueError):
            totals[key] = 0.0

    labels = []
    values = []

    for i in range(7):
        day = start + timedelta(days=i)
        labels.append(day.strftime("%a"))
        values.append(round(totals.get(day.isoformat(), 0.0), 2))

    return {
        "labels": labels,
        "values": values
    }


def top_products(limit=5):
    rows = (
        db.session.query(
            Product.name,
            func.sum(OrderItem.quantity).label("sold")
        )
        .join(OrderItem, OrderItem.product_id == Product.id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.status == "Paid")
        .group_by(Product.id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "name": r.name,
            "sold": int(r.sold or 0)
        }
        for r in rows
    ]

from sqlalchemy import func

from app.extensions import db
from app.models.order import Order
from app.models.product import Product


def get_dashboard_analytics():
    total_revenue = (
        db.session.query(func.coalesce(func.sum(Order.total), 0))
        .scalar()
    )

    total_orders = Order.query.count()

    pending_orders = (
        Order.query.filter_by(status="Pending")
        .count()
    )

    completed_orders = (
        Order.query.filter_by(status="Delivered")
        .count()
    )

    stripe_orders = (
        Order.query.filter_by(payment_method="Stripe")
        .count()
    )

    mpesa_orders = (
        Order.query.filter_by(payment_method="Mpesa")
        .count()
    )

    top_products = (
        Product.query
        .order_by(Product.sold.desc())
        .limit(5)
        .all()
    )

    latest_orders = (
        Order.query
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "totalRevenue": float(total_revenue),
        "totalOrders": total_orders,
        "pendingOrders": pending_orders,
        "completedOrders": completed_orders,
        "stripeOrders": stripe_orders,
        "mpesaOrders": mpesa_orders,
        "topProducts": [
            {
                "id": p.id,
                "name": p.name,
                "sold": p.sold,
                "price": p.price
            }
            for p in top_products
        ],
        "latestOrders": [
            {
                "id": o.id,
                "customer": o.user.name,
                "status": o.status,
                "payment": o.payment_method,
                "total": o.total,
                "created_at": o.created_at.isoformat()
            }
            for o in latest_orders
        ]
    }

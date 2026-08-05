from app.models.order import Order
from app.models.product import Product


def get_notifications():

    notifications = []

    # New pending orders
    pending_orders = Order.query.filter_by(
        status="Pending"
    ).count()

    if pending_orders:
        notifications.append({
            "type": "order",
            "title": "New Orders",
            "message": f"{pending_orders} orders waiting for processing",
            "color": "red",
            "count": pending_orders
        })

    # Low stock
    low_stock = Product.query.filter(
        Product.quantity > 0,
        Product.quantity <= Product.low_stock
    ).count()

    if low_stock:
        notifications.append({
            "type": "stock",
            "title": "Low Stock",
            "message": f"{low_stock} products running low",
            "color": "yellow",
            "count": low_stock
        })

    # Out of stock
    out_of_stock = Product.query.filter(
        Product.quantity == 0
    ).count()

    if out_of_stock:
        notifications.append({
            "type": "inventory",
            "title": "Out of Stock",
            "message": f"{out_of_stock} products are out of stock",
            "color": "red",
            "count": out_of_stock
        })

    # Pending reviews
    # pending_reviews = Review.query.filter_by(
    #     approved=False
    # ).count()

    # if pending_reviews:
    #     notifications.append({
    #         "type": "review",
    #         "title": "Reviews Pending",
    #         "message": f"{pending_reviews} reviews awaiting approval",
    #         "color": "blue",
    #         "count": pending_reviews
    #     })

    return notifications


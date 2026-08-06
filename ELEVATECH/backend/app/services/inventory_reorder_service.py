from app.models.product import Product


def get_reorder_suggestions():
    products = Product.query.all()

    suggestions = []

    for product in products:

        minimum = product.minimum_stock or 0

        if product.quantity <= minimum:

            suggestions.append({

                "product_id": product.id,

                "product_name": product.name,

                "current_stock": product.quantity,

                "minimum_stock": minimum,

                "recommended_quantity":
                    product.reorder_quantity,

                "supplier":
                    product.supplier.to_dict()
                    if product.supplier else None

            })

    return suggestions

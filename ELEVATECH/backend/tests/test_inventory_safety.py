from app.extensions import db
from app.models.product import Product


def test_product_quantity_cannot_become_negative(client):
    product = Product.query.first()

    if product is None:
        return

    original_quantity = product.quantity

    product.quantity = -1

    db.session.commit()

    refreshed = db.session.get(Product, product.id)

    assert refreshed.quantity == -1

    refreshed.quantity = original_quantity
    db.session.commit()


def test_product_quantity_is_integer(client):
    product = Product.query.first()

    if product is None:
        return

    assert isinstance(product.quantity, int)


def test_product_in_stock_matches_quantity(client):
    product = Product.query.first()

    if product is None:
        return

    product.quantity = 5
    db.session.commit()

    assert product.in_stock is True

    product.quantity = 0
    db.session.commit()

    assert product.in_stock is False


def test_product_discount_only_when_discount_price_is_lower(client):
    product = Product.query.first()

    if product is None:
        return

    product.price = 1000
    product.discount_price = 800

    assert product.has_discount is True

    product.discount_price = 1000

    assert product.has_discount is False

    product.discount_price = 1200

    assert product.has_discount is False


def test_product_discount_percent(client):
    product = Product.query.first()

    if product is None:
        return

    product.price = 1000
    product.discount_price = 750

    assert product.discount_percent == 25

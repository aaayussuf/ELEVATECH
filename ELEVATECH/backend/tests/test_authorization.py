import pytest

from app.extensions import db
from app.models.user import User
from app.models.category import Category
from app.models.product import Product


def register_user(
    client,
    email="customer@example.com",
    password="TestPass123",
):
    return client.post(
        "/api/auth/register",
        json={
            "first_name": "Test",
            "last_name": "Customer",
            "email": email,
            "password": password,
            "phone": "0712345678",
        },
    )


def login_user(client, email="customer@example.com"):
    return client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": "TestPass123",
        },
    )


def auth_header(client, email="customer@example.com"):
    # Users must complete email + phone verification before signing in.
    # The app context is active during tests, so codes are read straight
    # from the database (mirroring what would arrive by email/SMS).
    user = User.query.filter_by(email=email).one()
    client.post(
        "/api/auth/verify-email",
        json={"email": email, "code": user.email_otp},
    )
    client.post(
        "/api/auth/verify-phone",
        json={"email": email, "code": user.phone_otp},
    )
    response = login_user(client, email)
    token = response.get_json()["token"]

    return {
        "Authorization": f"Bearer {token}",
    }


def make_admin(email="admin@example.com"):
    user = User.query.filter_by(email=email).first()

    if not user:
        user = User(
            first_name="Admin",
            last_name="User",
            email=email,
            phone="0711111111",
            role="admin",
            email_verified=True,
            phone_verified=True,
        )
        user.set_password("AdminPass123")

        db.session.add(user)
        db.session.commit()

    else:
        user.role = "admin"
        user.email_verified = True
        user.phone_verified = True
        db.session.commit()

    return user


def admin_auth_header(client, email="admin@example.com"):
    response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": "AdminPass123",
        },
    )

    token = response.get_json()["token"]

    return {
        "Authorization": f"Bearer {token}",
    }


def test_admin_products_requires_authentication(client):
    response = client.get("/api/admin/products")

    assert response.status_code == 401


def test_admin_orders_requires_authentication(client):
    response = client.get("/api/admin/orders")

    assert response.status_code == 401


def test_customer_cannot_access_admin_products(client):
    register_user(client)

    headers = auth_header(client)

    response = client.get(
        "/api/admin/products",
        headers=headers,
    )

    assert response.status_code == 403


def test_customer_cannot_access_admin_orders(client):
    register_user(client)

    headers = auth_header(client)

    response = client.get(
        "/api/admin/orders",
        headers=headers,
    )

    assert response.status_code == 403


def test_admin_can_access_admin_products(client):
    make_admin()

    headers = admin_auth_header(client)

    response = client.get(
        "/api/admin/products",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "products" in data
    assert "page" in data
    assert "pages" in data
    assert "total" in data


def test_admin_can_access_admin_orders(client):
    make_admin()

    headers = admin_auth_header(client)

    response = client.get(
        "/api/admin/orders",
        headers=headers,
    )

    assert response.status_code == 200


def test_customer_cannot_create_admin_product(client):
    register_user(client)

    headers = auth_header(client)

    response = client.post(
        "/api/admin/products",
        headers=headers,
        json={
            "name": "Unauthorized Product",
            "slug": "unauthorized-product",
            "price": 1000,
            "category_id": 1,
        },
    )

    assert response.status_code == 403


def test_customer_cannot_update_admin_order(client):
    register_user(client)

    headers = auth_header(client)

    response = client.patch(
        "/api/admin/orders/1",
        headers=headers,
        json={
            "status": "Delivered",
        },
    )

    assert response.status_code == 403


def test_customer_cannot_delete_admin_product(client):
    register_user(client)

    headers = auth_header(client)

    response = client.delete(
        "/api/admin/products/1",
        headers=headers,
    )

    assert response.status_code == 403

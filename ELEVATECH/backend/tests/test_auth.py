from app.extensions import db
from app.models.user import User


def register_user(client, email="test@example.com"):
    return client.post(
        "/api/auth/register",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": email,
            "password": "TestPass123",
            "phone": "0712345678",
        },
    )


def login_user(client, email="test@example.com"):
    return client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": "TestPass123",
        },
    )


def test_register_success(client):
    response = register_user(client)

    assert response.status_code == 201

    data = response.get_json()
    assert data["message"] == "Registration successful"


def test_register_duplicate_email(client):
    register_user(client)

    response = register_user(client)

    assert response.status_code == 400

    data = response.get_json()
    assert data["message"] == "Email already exists"


def test_register_missing_required_field(client):
    response = client.post(
        "/api/auth/register",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": "missing@example.com",
        },
    )

    assert response.status_code == 400

    data = response.get_json()
    assert data["message"] == "password is required"


def test_login_success(client):
    register_user(client)

    response = login_user(client)

    assert response.status_code == 200

    data = response.get_json()

    assert "token" in data
    assert data["email"] == "test@example.com"
    assert data["role"] == "customer"
    assert "user_id" in data


def test_login_invalid_password(client):
    register_user(client)

    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "WrongPassword",
        },
    )

    assert response.status_code == 401

    data = response.get_json()
    assert data["message"] == "Invalid credentials"


def test_login_unknown_user(client):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "doesnotexist@example.com",
            "password": "TestPass123",
        },
    )

    assert response.status_code == 401

    data = response.get_json()
    assert data["message"] == "Invalid credentials"


def test_profile_requires_authentication(client):
    response = client.get("/api/auth/profile")

    assert response.status_code == 401


def test_profile_authenticated(client):
    register_user(client)

    login_response = login_user(client)
    token = login_response.get_json()["token"]

    response = client.get(
        "/api/auth/profile",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["email"] == "test@example.com"
    assert data["first_name"] == "Test"
    assert data["last_name"] == "User"


def test_profile_does_not_expose_password_hash(client):
    register_user(client)

    login_response = login_user(client)
    token = login_response.get_json()["token"]

    response = client.get(
        "/api/auth/profile",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "password_hash" not in data
    assert "password" not in data

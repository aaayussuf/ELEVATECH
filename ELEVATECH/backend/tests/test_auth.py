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


def login_user(client, email="test@example.com", password="TestPass123"):
    return client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )


def verify_user(client, app, email="test@example.com"):
    """Mark a freshly-registered user fully verified (email + phone)."""
    with app.app_context():
        user = User.query.filter_by(email=email).one()
        email_code = user.email_otp
        phone_code = user.phone_otp

    email_res = client.post(
        "/api/auth/verify-email",
        json={"email": email, "code": email_code},
    )
    assert email_res.status_code == 200

    phone_res = client.post(
        "/api/auth/verify-phone",
        json={"email": email, "code": phone_code},
    )
    assert phone_res.status_code == 200


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

def test_register_success(client):
    response = register_user(client)

    assert response.status_code == 201

    data = response.get_json()
    assert data["message"] == "Registration successful"
    assert data["requires_verification"] is True
    assert data["email_verified"] is False
    assert data["phone_verified"] is False
    assert data["email"] == "test@example.com"


def test_register_normalizes_email_and_phone(client):
    response = client.post(
        "/api/auth/register",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": "  TEST@Example.COM  ",
            "password": "TestPass123",
            "phone": " 0712 345678 ",
        },
    )

    assert response.status_code == 201

    data = response.get_json()
    assert data["email"] == "test@example.com"
    # Kenyan number is normalized to 2547XXXXXXXX
    assert data["phone"] == "254712345678"


def test_register_duplicate_email(client):
    register_user(client)

    response = register_user(client)

    assert response.status_code == 400

    data = response.get_json()
    assert data["message"] == "Email already exists"


def test_register_duplicate_phone(client):
    register_user(client)

    response = client.post(
        "/api/auth/register",
        json={
            "first_name": "Other",
            "last_name": "Person",
            "email": "other@example.com",
            "password": "TestPass123",
            "phone": "0712345678",
        },
    )

    assert response.status_code == 400

    data = response.get_json()
    assert "already registered" in data["message"]


def test_register_invalid_phone(client):
    response = client.post(
        "/api/auth/register",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": "badphone@example.com",
            "password": "TestPass123",
            "phone": "12345",
        },
    )

    assert response.status_code == 400

    data = response.get_json()
    assert "valid Kenyan phone number" in data["message"]


def test_register_missing_required_field(client):
    response = client.post(
        "/api/auth/register",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": "missing@example.com",
            "phone": "0712345678",
        },
    )

    assert response.status_code == 400

    data = response.get_json()
    assert data["message"] == "password is required"

# ---------------------------------------------------------------------------
# Login + verification gating
# ---------------------------------------------------------------------------

def test_login_success_after_verification(client, app):
    register_user(client)
    verify_user(client, app)

    response = login_user(client)

    assert response.status_code == 200

    data = response.get_json()

    assert "token" in data
    assert data["email"] == "test@example.com"
    assert data["role"] == "customer"
    assert "user_id" in data


def test_login_blocked_until_email_verified(client):
    register_user(client)

    response = login_user(client)

    assert response.status_code == 403

    data = response.get_json()
    assert data["code"] == "email_not_verified"
    assert data["email"] == "test@example.com"


def test_login_blocked_until_phone_verified(client, app):
    register_user(client)

    with app.app_context():
        user = User.query.filter_by(email="test@example.com").one()
        email_code = user.email_otp

    client.post(
        "/api/auth/verify-email",
        json={"email": "test@example.com", "code": email_code},
    )

    response = login_user(client)

    assert response.status_code == 403

    data = response.get_json()
    assert data["code"] == "phone_not_verified"


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
# ---------------------------------------------------------------------------
# Email / phone verification endpoints
# ---------------------------------------------------------------------------

def test_verify_email_success(client, app):
    register_user(client)

    with app.app_context():
        user = User.query.filter_by(email="test@example.com").one()
        code = user.email_otp

    response = client.post(
        "/api/auth/verify-email",
        json={"email": "test@example.com", "code": code},
    )

    assert response.status_code == 200

    data = response.get_json()
    assert data["email_verified"] is True
    assert data["phone_verified"] is False


def test_verify_email_wrong_code(client):
    register_user(client)

    response = client.post(
        "/api/auth/verify-email",
        json={"email": "test@example.com", "code": "000000"},
    )

    assert response.status_code == 400

    data = response.get_json()
    assert "Invalid or expired code" in data["message"]


def test_verify_phone_success(client, app):
    register_user(client)

    with app.app_context():
        user = User.query.filter_by(email="test@example.com").one()
        code = user.phone_otp

    response = client.post(
        "/api/auth/verify-phone",
        json={"email": "test@example.com", "code": code},
    )

    assert response.status_code == 200

    data = response.get_json()
    assert data["phone_verified"] is True


def test_verify_unknown_account(client):
    response = client.post(
        "/api/auth/verify-email",
        json={"email": "ghost@example.com", "code": "123456"},
    )

    assert response.status_code == 404


def test_resend_verification_respects_cooldown(client):
    register_user(client)

    response = client.post(
        "/api/auth/resend-verification",
        json={"email": "test@example.com", "channel": "email"},
    )

    assert response.status_code == 429
    assert "retry_after" in response.get_json()


def test_resend_verification_succeeds_after_cooldown(client, app):
    register_user(client)

    # Reset the sent timestamp so the cooldown is not active.
    with app.app_context():
        user = User.query.filter_by(email="test@example.com").one()
        user.email_otp_sent_at = None
        db.session.commit()

    response = client.post(
        "/api/auth/resend-verification",
        json={"email": "test@example.com", "channel": "email"},
    )

    assert response.status_code == 200
    assert response.get_json()["message"] == "Verification code sent"


def test_verification_status(client, app):
    register_user(client)

    response = client.get("/api/auth/verification-status?email=test@example.com")

    assert response.status_code == 200

    data = response.get_json()
    assert data["email_verified"] is False
    assert data["phone_verified"] is False
    assert data["verified"] is False
# ---------------------------------------------------------------------------
# Password reset
# ---------------------------------------------------------------------------

def test_forgot_and_reset_password(client, app):
    register_user(client)

    forgot_resp = client.post(
        "/api/auth/forgot-password",
        json={"email": "test@example.com"},
    )

    assert forgot_resp.status_code == 200

    with app.app_context():
        user = User.query.filter_by(email="test@example.com").one()
        reset_code = user.reset_otp
        assert reset_code

    reset_resp = client.post(
        "/api/auth/reset-password",
        json={
            "email": "test@example.com",
            "code": reset_code,
            "password": "NewPass456",
        },
    )

    assert reset_resp.status_code == 200

    # Old password should no longer work.
    assert login_user(client, password="TestPass123").status_code == 401

    # New password works but phone is still unverified -> blocked with code.
    blocked = login_user(client, password="NewPass456")
    assert blocked.status_code == 403
    assert blocked.get_json()["code"] == "phone_not_verified"


def test_forgot_password_does_not_leak_existence(client):
    response = client.post(
        "/api/auth/forgot-password",
        json={"email": "nobody@example.com"},
    )

    assert response.status_code == 200
    assert "If an account exists" in response.get_json()["message"]


def test_reset_password_wrong_code(client, app):
    register_user(client)

    response = client.post(
        "/api/auth/reset-password",
        json={
            "email": "test@example.com",
            "code": "000000",
            "password": "NewPass456",
        },
    )

    assert response.status_code == 400


# ---------------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------------

def test_profile_requires_authentication(client):
    response = client.get("/api/auth/profile")

    assert response.status_code == 401


def test_profile_authenticated(client, app):
    register_user(client)
    verify_user(client, app)

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
    assert data["email_verified"] is True
    assert data["phone_verified"] is True
    assert data["verified"] is True


def test_profile_does_not_expose_password_hash(client, app):
    register_user(client)
    verify_user(client, app)

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
    assert "email_otp" not in data
    assert "phone_otp" not in data
    assert "reset_otp" not in data

"""Quick end-to-end smoke test of the registration + email/phone verification flow."""
import os

os.environ["AUTO_INIT_DB"] = "false"

from app import create_app
from app.extensions import db
from app.models import User

app = create_app()
app.config.update(TESTING=True, SQLALCHEMY_DATABASE_URI="sqlite:///:memory:")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {}

with app.app_context():
    db.create_all()

client = app.test_client()

# 1. Register
r = client.post("/api/auth/register", json={
    "first_name": "Ada",
    "last_name": "Lovelace",
    "email": "ADA@example.com",
    "phone": "0712345678",
    "password": "secret99",
})
print("REGISTER", r.status_code, r.get_json())
assert r.status_code == 201
data = r.get_json()
assert data["requires_verification"] is True
assert data["email"] == "ada@example.com"  # normalized lower

# 2. Login while unverified -> blocked
r = client.post("/api/auth/login", json={"email": "ada@example.com", "password": "secret99"})
print("LOGIN_UNVERIFIED", r.status_code, r.get_json())
assert r.status_code == 403
assert r.get_json()["code"] == "email_not_verified"

# 3. Pull the codes from the DB (dev-delivery path)
with app.app_context():
    user = User.query.filter_by(email="ada@example.com").one()
    email_code = user.email_otp
    phone_code = user.phone_otp
    assert email_code and phone_code
    print("EMAIL_OTP", email_code, "PHONE_OTP", phone_code)

# 4. Verify email with WRONG code
r = client.post("/api/auth/verify-email", json={"email": "ada@example.com", "code": "000000"})
print("VERIFY_EMAIL_WRONG", r.status_code, r.get_json())
assert r.status_code == 400

# 5. Verify email
r = client.post("/api/auth/verify-email", json={"email": "ada@example.com", "code": email_code})
print("VERIFY_EMAIL", r.status_code, r.get_json())
assert r.status_code == 200

# 6. Login again -> now blocked on phone
r = client.post("/api/auth/login", json={"email": "ada@example.com", "password": "secret99"})
print("LOGIN_PHONE_PENDING", r.status_code, r.get_json())
assert r.status_code == 403
assert r.get_json()["code"] == "phone_not_verified"

# 7. Resend cooldown
r = client.post("/api/auth/resend-verification", json={"email": "ada@example.com", "channel": "phone"})
print("RESEND_PHONE_COOLDOWN", r.status_code, r.get_json())
assert r.status_code == 429

# 8. Verify phone
r = client.post("/api/auth/verify-phone", json={"email": "ada@example.com", "code": phone_code})
print("VERIFY_PHONE", r.status_code, r.get_json())
assert r.status_code == 200

# 9. Fully verified login works
r = client.post("/api/auth/login", json={"email": "ada@example.com", "password": "secret99"})
print("LOGIN_VERIFIED", r.status_code, r.get_json())
assert r.status_code == 200
assert "token" in r.get_json()

# 10. Forgot + reset password flow
r = client.post("/api/auth/forgot-password", json={"email": "ada@example.com"})
print("FORGOT", r.status_code, r.get_json())
assert r.status_code == 200

with app.app_context():
    user = User.query.filter_by(email="ada@example.com").one()
    reset_code = user.reset_otp
    assert reset_code

r = client.post("/api/auth/reset-password", json={
    "email": "ada@example.com",
    "code": reset_code,
    "password": "brandnewpass1",
})
print("RESET", r.status_code, r.get_json())
assert r.status_code == 200

r = client.post("/api/auth/login", json={"email": "ada@example.com", "password": "brandnewpass1"})
print("LOGIN_AFTER_RESET", r.status_code)
assert r.status_code == 200

print("\nALL AUTH FLOW SMOKE TESTS PASSED ✔")
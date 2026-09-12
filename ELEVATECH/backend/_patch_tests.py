import io

PATH = r"c:\Users\Lenovo\Desktop\BX-Tech-Digital-World\ELEVATECH\backend\tests\test_authorization.py"

with io.open(PATH, "r", encoding="utf-8") as fh:
    src = fh.read()

old_auth_header = '''def auth_header(client, email="customer@example.com"):
    response = login_user(client, email)
    token = response.get_json()["token"]
'''

new_auth_header = '''def auth_header(client, email="customer@example.com"):
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
'''

assert old_auth_header in src, "auth_header block not found"

src = src.replace(old_auth_header, new_auth_header, 1)

old_admin_new = '''            role="admin",
        )
        user.set_password("AdminPass123")
'''

new_admin_new = '''            role="admin",
            email_verified=True,
            phone_verified=True,
        )
        user.set_password("AdminPass123")
'''

assert old_admin_new in src, "make_admin create block not found"

src = src.replace(old_admin_new, new_admin_new, 1)

old_admin_else = '''        user.role = "admin"
        db.session.commit()
'''

new_admin_else = '''        user.role = "admin"
        user.email_verified = True
        user.phone_verified = True
        db.session.commit()
'''

assert old_admin_else in src, "make_admin else block not found"

src = src.replace(old_admin_else, new_admin_else, 1)

with io.open(PATH, "w", encoding="utf-8", newline="") as fh:
    fh.write(src)

print("test_authorization.py patched ok")
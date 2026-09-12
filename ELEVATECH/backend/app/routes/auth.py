from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from app.extensions import db
from app.models.user import User
from app.services.email_service import send_otp_email, send_reset_email
from app.services.sms_service import send_otp_sms
from app.utils.phone import format_phone

auth_bp = Blueprint("auth", __name__)

OTP_TTL_SECONDS = 600          # 10 minutes
RESEND_COOLDOWN_SECONDS = 60   # 1 minute


def _error(message, status=400, **extra):
    payload = {"message": message}
    payload.update(extra)
    return jsonify(payload), status


@auth_bp.get("/register")
def register_get():
    return jsonify({
        "message": "Use POST /api/auth/register to create an account. Send JSON with: first_name, last_name, email, password (and optional phone)."
    }), 200


@auth_bp.post("/register")
def register():

    data = request.get_json(silent=True) or {}

    required = [
        "first_name",
        "last_name",
        "email",
        "phone",
        "password",
    ]

    for field in required:
        if not data.get(field):
            return _error(f"{field} is required")

    email = data["email"].strip().lower()
    first_name = data["first_name"].strip()
    last_name = data["last_name"].strip()

    if len(data["password"]) < 6:
        return _error("Password must be at least 6 characters")

    try:
        phone = format_phone(data["phone"])
    except ValueError:
        return _error("Enter a valid Kenyan phone number")

    if User.query.filter_by(email=email).first():
        return _error("Email already exists")

    if User.query.filter_by(phone=phone).first():
        return _error(
            "Phone number already registered. Try signing in instead."
        )

    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
    )

    user.set_password(data["password"])

    email_code = user.generate_otp("email", ttl_seconds=OTP_TTL_SECONDS)
    phone_code = user.generate_otp("phone", ttl_seconds=OTP_TTL_SECONDS)

    db.session.add(user)
    db.session.commit()

    # Deliver both codes. Failures are logged but never block registration:
    # users can re-request codes from the verification screen.
    send_otp_email(user, email_code)
    send_otp_sms(user, phone_code)

    return jsonify({
        "message": "Registration successful",
        "requires_verification": True,
        "email_verified": False,
        "phone_verified": False,
        "email": user.email,
        "phone": user.phone,
    }), 201


@auth_bp.post("/login")
def login():

    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password or ""):
        return _error("Invalid credentials", 401)

    if not user.is_active:
        return _error(
            "Your account has been deactivated. Please contact support.",
            403,
        )

    if not user.email_verified:
        return _error(
            "Please verify your email address before signing in.",
            403,
            code="email_not_verified",
            email=user.email,
        )

    if not user.phone_verified:
        return _error(
            "Please verify your phone number before signing in.",
            403,
            code="phone_not_verified",
            email=user.email,
        )

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role
        }
    )

    return jsonify({
        "token": access_token,
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "email_verified": True,
        "phone_verified": True,
    })


# ===========================================================================
# Verification
# ===========================================================================

@auth_bp.post("/verify-email")
def verify_email():

    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    code = (data.get("code") or "").strip()

    user = User.query.filter_by(email=email).first()

    if not user:
        return _error("No account found for that email", 404)

    if user.email_verified:
        return jsonify({
            "message": "Email already verified",
            "email_verified": True,
            "phone_verified": user.phone_verified,
        }), 200

    ok, reason = user.check_otp("email", code)
    if not ok:
        return _error(
            "Invalid or expired code. Please request a new one.",
            400,
            reason=reason,
        )

    user.email_verified = True
    user.consume_otp("email")
    db.session.commit()

    return jsonify({
        "message": "Email verified successfully",
        "email_verified": True,
        "phone_verified": user.phone_verified,
    }), 200


@auth_bp.post("/verify-phone")
def verify_phone():

    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    code = (data.get("code") or "").strip()

    user = User.query.filter_by(email=email).first()

    if not user:
        return _error("No account found for that email", 404)

    if user.phone_verified:
        return jsonify({
            "message": "Phone already verified",
            "email_verified": user.email_verified,
            "phone_verified": True,
        }), 200

    ok, reason = user.check_otp("phone", code)
    if not ok:
        return _error(
            "Invalid or expired code. Please request a new one.",
            400,
            reason=reason,
        )

    user.phone_verified = True
    user.consume_otp("phone")
    db.session.commit()

    return jsonify({
        "message": "Phone verified successfully",
        "email_verified": user.email_verified,
        "phone_verified": True,
    }), 200


@auth_bp.post("/resend-verification")
def resend_verification():

    import datetime as _dt

    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    channel = (data.get("channel") or "email").lower()

    if channel not in User.OTP_CHANNELS:
        return _error("channel must be 'email' or 'phone'")

    user = User.query.filter_by(email=email).first()

    if not user:
        return _error("No account found for that email", 404)

    if channel == "email" and user.email_verified:
        return _error("Email is already verified")

    if channel == "phone" and user.phone_verified:
        return _error("Phone is already verified")

    _now = _dt.datetime.now(_dt.timezone.utc).replace(tzinfo=None)
    sent_at = getattr(user, user.otp_fields(channel)[2])

    if sent_at is not None:
        elapsed = (_now - sent_at).total_seconds()
        if elapsed < RESEND_COOLDOWN_SECONDS:
            return _error(
                f"Please wait {int(RESEND_COOLDOWN_SECONDS - elapsed)}s "
                "before requesting a new code.",
                429,
                retry_after=int(RESEND_COOLDOWN_SECONDS - elapsed),
            )

    code = user.generate_otp(channel, ttl_seconds=OTP_TTL_SECONDS)
    db.session.commit()

    if channel == "email":
        send_otp_email(user, code)
    else:
        send_otp_sms(user, code)

    return jsonify({
        "message": "Verification code sent",
        "channel": channel,
        "email_verified": user.email_verified,
        "phone_verified": user.phone_verified,
    }), 200


@auth_bp.get("/verification-status")
def verification_status():

    email = (request.args.get("email") or "").strip().lower()

    user = User.query.filter_by(email=email).first()

    if not user:
        return _error("No account found for that email", 404)

    return jsonify({
        "email_verified": user.email_verified,
        "phone_verified": user.phone_verified,
        "verified": user.is_fully_verified(),
    }), 200


# ===========================================================================
# Password reset (OTP delivered by email)
# ===========================================================================

@auth_bp.post("/forgot-password")
def forgot_password():

    import datetime as _dt

    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()

    user = User.query.filter_by(email=email).first()

    # Never reveal whether an account exists.
    message = "If an account exists for that email, a reset code has been sent."

    if not user:
        return jsonify({"message": message}), 200

    _now = _dt.datetime.now(_dt.timezone.utc).replace(tzinfo=None)
    sent_at = user.reset_otp_sent_at

    if sent_at is not None:
        elapsed = (_now - sent_at).total_seconds()
        if elapsed < RESEND_COOLDOWN_SECONDS:
            return jsonify({
                "message": "A reset code was already sent. Please check your inbox.",
                "retry_after": int(RESEND_COOLDOWN_SECONDS - elapsed),
            }), 200

    code = user.generate_otp("reset", ttl_seconds=OTP_TTL_SECONDS)
    db.session.commit()

    send_reset_email(user, code)

    return jsonify({"message": message}), 200


@auth_bp.post("/reset-password")
def reset_password():

    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    code = (data.get("code") or "").strip()
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return _error("No account found for that email", 404)

    if not password or len(password) < 6:
        return _error("Password must be at least 6 characters")

    ok, reason = user.check_otp("reset", code)
    if not ok:
        return _error(
            "Invalid or expired code. Please request a new one.",
            400,
            reason=reason,
        )

    user.set_password(password)
    user.consume_otp("reset")

    # A successful reset proves control of the inbox.
    user.email_verified = True

    db.session.commit()

    return jsonify({
        "message": "Password updated successfully. You can now sign in.",
    }), 200


@auth_bp.get("/profile")
@jwt_required()
def profile():

    user_id = int(get_jwt_identity())

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    if not user.is_active:
        return jsonify({
            "message": "Account is deactivated"
        }), 403

    return jsonify(user.to_dict())


@auth_bp.put("/profile")
@jwt_required()
def update_profile():

    user_id = int(get_jwt_identity())

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    data = request.get_json() or {}

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    phone = data.get("phone")

    if not first_name or not first_name.strip():
        return jsonify({
            "message": "First name is required"
        }), 400

    if not last_name or not last_name.strip():
        return jsonify({
            "message": "Last name is required"
        }), 400

    user.first_name = first_name.strip()
    user.last_name = last_name.strip()
    user.phone = phone.strip() if phone else None

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "user": user.to_dict()
    }), 200


@auth_bp.patch("/profile/password")
@jwt_required()
def change_password():

    user_id = get_jwt_identity()

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    data = request.get_json() or {}

    old_password = data.get("old_password")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    if not old_password:
        return jsonify({
            "message": "Current password is required"
        }), 400

    if not new_password:
        return jsonify({
            "message": "New password is required"
        }), 400

    if new_password != confirm_password:
        return jsonify({
            "message": "New passwords do not match"
        }), 400

    if not user.check_password(old_password):
        return jsonify({
            "message": "Current password is incorrect"
        }), 400

    if len(new_password) < 6:
        return jsonify({
            "message": "New password must be at least 6 characters"
        }), 400

    user.set_password(new_password)

    db.session.commit()

    return jsonify({
        "message": "Password updated successfully"
    }), 200


from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.get("/register")
def register_get():
    return jsonify({
        "message": "Use POST /api/auth/register to create an account. Send JSON with: first_name, last_name, email, password (and optional phone)."
    }), 200


@auth_bp.post("/register")
def register():

    data = request.get_json()


    required = [
        "first_name",
        "last_name",
        "email",
        "password"
    ]

    for field in required:
        if field not in data:
            return jsonify({
                "message": f"{field} is required"
            }), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({
            "message": "Email already exists"
        }), 400

    user = User(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        phone=data.get("phone")
    )

    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Registration successful"
    }), 201


@auth_bp.post("/login")
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:

        return jsonify({
            "message": "Invalid credentials"
        }), 401

    if not user.check_password(password):

        return jsonify({
            "message": "Invalid credentials"
        }), 401

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
        "role": user.role
    })


@auth_bp.get("/profile")
@jwt_required()
def profile():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    return jsonify(user.to_dict())


@auth_bp.put("/profile")
@jwt_required()
def update_profile():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

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

    user = User.query.get(user_id)

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


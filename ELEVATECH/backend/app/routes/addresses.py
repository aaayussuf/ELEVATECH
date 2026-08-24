from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.address import Address

addresses_bp = Blueprint(
    "addresses",
    __name__,
    url_prefix="/api/addresses"
)

def current_user_id():
    return int(get_jwt_identity())

# =====================================================
# GET ALL ADDRESSES
# =====================================================

@addresses_bp.route("", methods=["GET"])
@jwt_required()
def get_addresses():

    user_id = current_user_id()

    addresses = (
        Address.query
        .filter_by(user_id=user_id)
        .order_by(Address.is_default.desc(), Address.id.desc())
        .all()
    )

    return jsonify({
        "count": len(addresses),
        "addresses": [a.to_dict() for a in addresses]
    })

# =====================================================
# CREATE ADDRESS
# =====================================================

@addresses_bp.route("", methods=["POST"])
@jwt_required()
def create_address():

    user_id = current_user_id()

    data = request.get_json() or {}

    required_fields = [
        "full_name",
        "phone",
        "county",
        "city",
        "address_line_1",
    ]

    missing = [
        field
        for field in required_fields
        if not str(data.get(field, "")).strip()
    ]

    if missing:
        return jsonify({
            "message": "Missing required fields",
            "fields": missing
        }), 400

    is_default = bool(data.get("is_default", False))

    # If this is the first address, automatically make it default.
    existing_count = Address.query.filter_by(
        user_id=user_id
    ).count()

    if existing_count == 0:
        is_default = True

    # Only one default address per user.
    if is_default:
        Address.query.filter_by(
            user_id=user_id
        ).update({
            "is_default": False
        })

    address = Address(
        user_id=user_id,
        full_name=data["full_name"].strip(),
        phone=data["phone"].strip(),
        county=data["county"].strip(),
        city=data["city"].strip(),
        address_line_1=data["address_line_1"].strip(),
        address_line_2=(
            data.get("address_line_2", "").strip()
            or None
        ),
        postal_code=(
            data.get("postal_code", "").strip()
            or None
        ),
        is_default=is_default,
    )

    db.session.add(address)
    db.session.commit()

    return jsonify({
        "message": "Address created successfully",
        "address": address.to_dict()
    }), 201

# =====================================================
# UPDATE ADDRESS
# =====================================================

@addresses_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_address(id):

    user_id = current_user_id()

    address = Address.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not address:
        return jsonify({
            "message": "Address not found"
        }), 404

    data = request.get_json() or {}

    allowed_fields = [
        "full_name",
        "phone",
        "county",
        "city",
        "address_line_1",
        "address_line_2",
        "postal_code",
    ]

    for field in allowed_fields:
        if field in data:
            value = data[field]

            if isinstance(value, str):
                value = value.strip()

            setattr(address, field, value or None)

    if data.get("is_default") is True:

        Address.query.filter(
            Address.user_id == user_id,
            Address.id != address.id
        ).update({
            "is_default": False
        })

        address.is_default = True

    db.session.commit()

    return jsonify({
        "message": "Address updated successfully",
        "address": address.to_dict()
    })

# =====================================================
# DELETE ADDRESS
# =====================================================

@addresses_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_address(id):

    user_id = current_user_id()

    address = Address.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not address:
        return jsonify({
            "message": "Address not found"
        }), 404

    was_default = address.is_default

    db.session.delete(address)
    db.session.commit()

    # If the deleted address was the default,
    # automatically choose another address.
    if was_default:

        replacement = (
            Address.query
            .filter_by(user_id=user_id)
            .order_by(Address.id.desc())
            .first()
        )

        if replacement:
            replacement.is_default = True
            db.session.commit()

    return jsonify({
        "message": "Address deleted successfully"
    })

# =====================================================
# SET DEFAULT ADDRESS
# =====================================================

@addresses_bp.route("/<int:id>/default", methods=["PATCH"])
@jwt_required()
def set_default(id):

    user_id = current_user_id()

    address = Address.query.filter_by(
        id=id,
        user_id=user_id
    ).first()

    if not address:
        return jsonify({
            "message": "Address not found"
        }), 404

    Address.query.filter_by(
        user_id=user_id
    ).update({
        "is_default": False
    })

    address.is_default = True

    db.session.commit()

    return jsonify({
        "message": "Default address updated",
        "address": address.to_dict()
    })
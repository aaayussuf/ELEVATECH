from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.coupon import Coupon
from app.utils.admin_required import admin_required

admin_coupons_bp = Blueprint(
    "admin_coupons",
    __name__,
    url_prefix="/api/admin/coupons"
)


@admin_coupons_bp.route("", methods=["GET"])
@admin_required
def list_coupons():

    coupons = Coupon.query.order_by(
        Coupon.created_at.desc()
    ).all()

    return jsonify([c.to_dict() for c in coupons])


@admin_coupons_bp.route("", methods=["POST"])
@admin_required
def create_coupon():

    data = request.get_json()

    coupon = Coupon(

        code=data["code"].upper(),

        description=data.get("description"),

        discount_type=data["discount_type"],

        value=data["value"],

        minimum_amount=data.get("minimum_amount", 0),

        usage_limit=data.get("usage_limit", 0),

        expires_at=datetime.fromisoformat(
            data["expires_at"]
        ) if data.get("expires_at") else None,

        active=True

    )

    try:
        db.session.add(coupon)
        db.session.commit()

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "message": "Coupon code already exists."
        }), 400

    return jsonify(coupon.to_dict()), 201


@admin_coupons_bp.route("/<int:id>", methods=["GET"])
@admin_required
def get_coupon(id):

    coupon = Coupon.query.get_or_404(id)

    return jsonify(coupon.to_dict())


@admin_coupons_bp.route("/<int:id>", methods=["PUT"])
@admin_required
def update_coupon(id):

    coupon = Coupon.query.get_or_404(id)

    data = request.get_json()

    coupon.code = data["code"].upper()

    coupon.description = data.get("description")

    coupon.discount_type = data["discount_type"]

    coupon.value = data["value"]

    coupon.minimum_amount = data.get(
        "minimum_amount",
        0
    )

    coupon.usage_limit = data.get(
        "usage_limit",
        0
    )

    coupon.expires_at = (
        datetime.fromisoformat(data["expires_at"])
        if data.get("expires_at")
        else None
    )

    coupon.active = data.get("active", True)

    db.session.commit()

    return jsonify(coupon.to_dict())


@admin_coupons_bp.route("/<int:id>", methods=["DELETE"])
@admin_required
def delete_coupon(id):

    coupon = Coupon.query.get_or_404(id)

    db.session.delete(coupon)

    db.session.commit()

    return jsonify({

        "message": "Coupon deleted"

    })

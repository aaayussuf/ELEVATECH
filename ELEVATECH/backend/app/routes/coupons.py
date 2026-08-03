from datetime import datetime

from flask import Blueprint, jsonify, request

from app.models.coupon import Coupon

coupons_bp = Blueprint(
    "coupons",
    __name__,
    url_prefix="/api/coupons"
)


@coupons_bp.route("/apply", methods=["POST"])
def apply_coupon():

    data = request.get_json()

    code = data.get("code", "").upper().strip()

    subtotal = float(data.get("subtotal", 0))

    coupon = Coupon.query.filter_by(
        code=code,
        active=True
    ).first()

    if not coupon:
        return jsonify({
            "success": False,
            "message": "Invalid coupon code."
        }), 404

    if coupon.expires_at and coupon.expires_at < datetime.utcnow():
        return jsonify({
            "success": False,
            "message": "Coupon has expired."
        }), 400

    if coupon.usage_limit > 0 and coupon.used >= coupon.usage_limit:
        return jsonify({
            "success": False,
            "message": "Coupon usage limit reached."
        }), 400

    if subtotal < coupon.minimum_amount:
        return jsonify({
            "success": False,
            "message": f"Minimum order is {coupon.minimum_amount}."
        }), 400

    if coupon.discount_type == "percent":
        discount = subtotal * (coupon.value / 100)
    else:
        discount = coupon.value

    if discount > subtotal:
        discount = subtotal

    total = subtotal - discount

    return jsonify({
        "success": True,
        "coupon": coupon.to_dict(),
        "discount": round(discount, 2),
        "total": round(total, 2)
    })

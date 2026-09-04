from flask import Blueprint, jsonify

payments_bp = Blueprint(
    "payments",
    __name__,
    url_prefix="/api/payments",
)

@payments_bp.route("", methods=["GET", "POST"])
def deprecated_payments():
    return jsonify(
        {
            "message": "This payment API is deprecated. "
            "Use the protected /api/checkout payment flow instead."
        }
    ), 410

@payments_bp.route("/<int:id>", methods=["GET"])
def deprecated_payment(id):
    return jsonify(
        {
            "message": "This payment API is deprecated. "
            "Use the protected /api/checkout payment flow instead."
        }
    ), 410

@payments_bp.route("/<int:id>/verify", methods=["PATCH"])
def deprecated_verify_payment(id):
    return jsonify(
        {
            "message": "Payment verification through this endpoint is disabled. "
            "Payments must be verified through the configured payment provider."
        }
    ), 410

@payments_bp.route("/order/<int:order_id>", methods=["GET"])
def deprecated_order_payments(order_id):
    return jsonify(
        {
            "message": "This payment API is deprecated. "
            "Use the protected /api/checkout payment flow instead."
        }
    ), 410


from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt


def admin_required(f):
    """Decorator that checks the JWT claims for an admin role."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        claims = get_jwt()

        if claims.get("role") != "admin":
            return jsonify({"message": "Admin access required"}), 403

        return f(*args, **kwargs)

    return decorated_function


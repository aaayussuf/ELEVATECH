from functools import wraps

from flask import jsonify

from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt,
    get_jwt_identity,
)


def admin_required(fn):
    """Require a valid JWT AND an admin role.

    Checks the ``role`` JWT claim first (set at login), then falls back
    to a database role lookup so tokens minted before the claim existed
    — or with a stale claim — still work for real admins.
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):

        # Verify JWT first
        verify_jwt_in_request()

        claims = get_jwt() or {}

        if claims.get("role") == "admin":
            return fn(*args, **kwargs)

        # Fallback: look the user up in the DB (identity is stored as str(id)).
        try:
            from app.extensions import db
            from app.models.user import User

            raw = get_jwt_identity()
            user_id = int(raw) if raw is not None else None
            user = db.session.get(User, user_id) if user_id is not None else None
            if user and user.role == "admin":
                return fn(*args, **kwargs)
        except Exception:
            pass

        return jsonify({
            "message": "Admin access required"
        }), 403

    return wrapper

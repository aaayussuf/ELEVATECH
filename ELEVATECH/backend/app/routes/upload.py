"""Upload API — POST /api/admin/upload

Allows authenticated admin users to upload image files.
- If Cloudinary credentials are configured, uploads to Cloudinary
  and returns the secure Cloudinary URL.
- Otherwise falls back to local storage in UPLOAD_FOLDER and returns
  a local URL (``/uploads/<filename>``) served by the Flask app.

Returns the URL of the uploaded image.
"""

import os
import uuid

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

from app.utils.admin_required import admin_required

upload_bp = Blueprint(
    "upload",
    __name__,
    url_prefix="/api/admin/upload",
)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"}


def _allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def _cloudinary_configured():
    return bool(
        current_app.config.get("CLOUDINARY_CLOUD_NAME")
        and current_app.config.get("CLOUDINARY_API_KEY")
        and current_app.config.get("CLOUDINARY_API_SECRET")
    )


def _save_local(file, folder="products"):
    """Save uploaded file locally and return its public URL path."""
    upload_root = current_app.config.get("UPLOAD_FOLDER", "uploads")
    # Make absolute relative to backend dir so it works regardless of CWD
    if not os.path.isabs(upload_root):
        base_dir = os.path.abspath(
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        )
        upload_root = os.path.join(base_dir, upload_root)
    target_dir = os.path.join(upload_root, folder)
    os.makedirs(target_dir, exist_ok=True)

    original = secure_filename(file.filename or "image")
    ext = original.rsplit(".", 1)[1].lower() if "." in original else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(target_dir, filename)
    file.save(filepath)

    # URL served by backend at GET /uploads/<folder>/<filename>
    return f"/uploads/{folder}/{filename}"


# ======================================================
# UPLOAD IMAGE
# ======================================================
@upload_bp.route("", methods=["POST"])
@upload_bp.route("/", methods=["POST"])
@jwt_required()
@admin_required
def upload():
    """Accept an image file and upload it to Cloudinary (or local disk).

    Expects a multipart/form-data request with a field named ``"image"``.

    Returns
    -------
    JSON
        On success (201):
            ``{ "url": "https://res.cloudinary.com/..." }``
            or ``{ "url": "/uploads/products/....jpg" }`` for local fallback.
        On missing file (400):
            ``{ "message": "No image provided" }``
        On upload failure (500):
            ``{ "message": "Upload failed", "error": "..." }``
    """
    # Be tolerant about field name: frontend sends "image", but accept common
    # aliases ("file", "upload", "photo") so Postman/curl users don't hit
    # "No image provided" when they attach under a slightly different key.
    file = (
        request.files.get("image")
        or request.files.get("file")
        or request.files.get("upload")
        or request.files.get("photo")
    )
    if file is None:
        return jsonify({
            "message": "No image provided. Attach file as 'image'.",
            "received_keys": list(request.files.keys()),
            "content_type": request.content_type,
        }), 400

    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400

    if not _allowed_file(file.filename):
        return jsonify({
            "message": "Invalid file type. Allowed: png, jpg, jpeg, gif, webp, svg, bmp",
        }), 400

    # Try Cloudinary first when configured, else use local storage.
    if _cloudinary_configured():
        try:
            from app.services.cloudinary_service import upload_image

            result = upload_image(file, folder="products")
            return jsonify({"url": result["secure_url"]}), 201
        except Exception as e:
            current_app.logger.exception("Cloudinary upload failed, trying local fallback")
            # Fall through to local save so admin work is not blocked.
            # Rewind the stream since Cloudinary already consumed it.
            try:
                file.seek(0)
            except Exception:
                pass
            try:
                url = _save_local(file, folder="products")
                # request.host_url e.g. http://127.0.0.1:5000/
                absolute = request.host_url.rstrip("/") + url
                return jsonify({
                    "url": absolute,
                    "warning": f"Cloudinary failed ({e}); saved locally instead.",
                }), 201
            except Exception as local_err:
                return jsonify({
                    "message": "Upload failed",
                    "error": f"Cloudinary error: {e}; local fallback error: {local_err}",
                }), 500
    else:
        try:
            url = _save_local(file, folder="products")
            absolute = request.host_url.rstrip("/") + url
            return jsonify({"url": absolute}), 201
        except Exception as e:
            current_app.logger.exception("Local upload failed")
            return jsonify({
                "message": "Upload failed",
                "error": str(e),
            }), 500


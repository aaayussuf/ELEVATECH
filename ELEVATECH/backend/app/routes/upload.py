"""Upload API — POST /api/admin/upload

Allows authenticated admin users to upload image files to Cloudinary.
Returns the secure Cloudinary URL of the uploaded image.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.cloudinary_service import upload_image
from app.utils.admin_required import admin_required

upload_bp = Blueprint(
    "upload",
    __name__,
    url_prefix="/api/admin/upload",
)


# ======================================================
# UPLOAD IMAGE
# ======================================================
@upload_bp.route("", methods=["POST"])
@jwt_required()
@admin_required
def upload():
    """Accept an image file and upload it to Cloudinary.

    Expects a multipart/form-data request with a field named ``"file"``.

    Returns
    -------
    JSON
        On success (201):
            ``{ "url": "https://res.cloudinary.com/..." }``
        On missing file (400):
            ``{ "message": "No file provided" }``
        On upload failure (500):
            ``{ "message": "Upload failed", "error": "..." }``
    """
    if "image" not in request.files:
        return jsonify({"message": "No image provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400

    try:
        result = upload_image(file, folder="products")

        return jsonify({"url": result["secure_url"]}), 201

    except Exception as e:
        return jsonify({
            "message": "Upload failed",
            "error": str(e),
        }), 500


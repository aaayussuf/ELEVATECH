"""Cloudinary service for image upload and management.

Provides helper functions to upload, delete, and manage images
on Cloudinary using the configured cloud name, API key, and API secret.
"""

try:
    import cloudinary  # type: ignore
    import cloudinary.uploader  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    cloudinary = None  # type: ignore

from flask import current_app


def init_cloudinary():
    """Initialize the Cloudinary SDK with credentials from app config."""
    if not cloudinary:
        raise RuntimeError(
            "cloudinary package is not installed. Install it with 'pip install cloudinary'"
        )

    cloudinary.config(
        cloud_name=current_app.config["CLOUDINARY_CLOUD_NAME"],
        api_key=current_app.config["CLOUDINARY_API_KEY"],
        api_secret=current_app.config["CLOUDINARY_API_SECRET"],
        secure=True,
    )

    print("Cloud Name:", current_app.config["CLOUDINARY_CLOUD_NAME"])
    print("API Key:", current_app.config["CLOUDINARY_API_KEY"])


def upload_image(file, folder="products", public_id=None, **kwargs):
    """Upload an image file to Cloudinary.

    Parameters
    ----------
    file : file-like object
        The image file to upload (e.g. from ``request.files``).
    folder : str, optional
        The Cloudinary folder to place the image in (default ``"products"``).
    public_id : str, optional
        A custom public ID for the image. If not provided, Cloudinary
        will generate one automatically.
    **kwargs
        Additional options forwarded to ``cloudinary.uploader.upload``.

    Returns
    -------
    dict
        The upload result from Cloudinary, containing at least:
        - ``secure_url`` (str) — HTTPS URL to the uploaded image.
        - ``public_id``  (str) — The public ID of the uploaded asset.
    """
    init_cloudinary()

    upload_options = {
        "folder": folder,
        "resource_type": "image",
    }

    if public_id:
        upload_options["public_id"] = public_id

    upload_options.update(kwargs)

    uploader = cloudinary.uploader
    result = uploader.upload(file, **upload_options)

    return result


def delete_image(public_id, **kwargs):
    """Delete an image from Cloudinary by its public ID.

    Parameters
    ----------
    public_id : str
        The public ID of the asset to delete (including folder prefix).
    **kwargs
        Additional options forwarded to ``cloudinary.uploader.destroy``.

    Returns
    -------
    dict
        The deletion result from Cloudinary.
    """
    init_cloudinary()

    result = cloudinary.uploader.destroy(public_id, **kwargs)

    return result


def get_image_url(public_id, **options):
    """Generate a Cloudinary image URL for the given public ID.

    Parameters
    ----------
    public_id : str
        The public ID of the asset.
    **options
        Transformation options (e.g. ``width``, ``height``, ``crop``).

    Returns
    -------
    str
        The constructed Cloudinary URL.
    """
    init_cloudinary()

    return cloudinary.CloudinaryImage(public_id).build_url(**options)


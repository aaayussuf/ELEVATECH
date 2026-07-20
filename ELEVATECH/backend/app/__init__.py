from flask import Flask, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore

from config import Config
from app.extensions import db, migrate, jwt

# Import models
from app.models import User, Category, Product

# Import routes
from app.routes.auth import auth_bp
from app.routes.products import products_bp
from app.routes.admin_products import admin_products_bp
from app.routes.addresses import addresses_bp
from app.routes.wishlist import wishlist_bp
from app.routes.payments import payments_bp
from app.routes.checkout import checkout_bp
from app.routes.orders import orders_bp




def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/api/*": {"origins": Config.CORS_ORIGINS.split(",")}},
        supports_credentials=True,
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp)
    app.register_blueprint(admin_products_bp)
    app.register_blueprint(addresses_bp)

    # Step 5 — Register the Blueprint
    app.register_blueprint(wishlist_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(checkout_bp)
    app.register_blueprint(orders_bp)

    @app.route("/api/products")

    def get_products():
        products = Product.query.all()
        return jsonify([p.to_dict() for p in products])

    @app.route("/")
    def home():
        return {"message": "Welcome to ELEVATECH API"}

    return app


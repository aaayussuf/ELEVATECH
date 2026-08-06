from flask import Flask  # type: ignore
from flask_cors import CORS  # type: ignore

from config import Config
from app.extensions import db, migrate, jwt, mail, socketio

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
from app.routes.mpesa import mpesa_bp
from app.routes.admin_dashboard import admin_dashboard_bp
from app.routes.admin_orders import admin_orders_bp
from app.routes.admin_customers import admin_customers_bp
from app.routes.upload import upload_bp
from app.routes.categories import categories_bp
from app.routes.admin_categories import admin_categories_bp
from app.routes.admin_coupons import admin_coupons_bp
from app.routes.admin_suppliers import admin_suppliers_bp
from app.routes.admin_purchase_orders import purchase_orders_bp
from app.routes.admin_purchase_order_items import purchase_order_items_bp
from app.routes.coupons import coupons_bp
from app.routes.reviews import reviews_bp
from app.routes.admin_inventory import inventory_bp
from app.socket_events import send_test_notification


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
    mail.init_app(app)
    socketio.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp)
    app.register_blueprint(admin_products_bp)
    app.register_blueprint(addresses_bp)

    # Step 5 — Register the Blueprint
    app.register_blueprint(wishlist_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(checkout_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(mpesa_bp)
    app.register_blueprint(admin_dashboard_bp)
    app.register_blueprint(admin_orders_bp)
    app.register_blueprint(admin_customers_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(admin_categories_bp)
    app.register_blueprint(admin_coupons_bp)
    app.register_blueprint(admin_suppliers_bp)
    app.register_blueprint(purchase_orders_bp)
    app.register_blueprint(purchase_order_items_bp)
    app.register_blueprint(coupons_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(inventory_bp)

    @app.route("/")
    def home():
        return {"message": "Welcome to ELEVATECH API"}

    @app.route("/api/test-notification")
    def test_notification():
        send_test_notification()
        return {"message": "Test notification sent"}

    return app

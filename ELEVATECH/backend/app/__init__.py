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
from app.seed import seed_database


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    configured_origins = {
        origin.strip()
        for origin in Config.CORS_ORIGINS.split(",")
        if origin.strip()
    }
    configured_origins.update({
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    })

    CORS(
        app,
        resources={r"/api/*": {"origins": list(configured_origins)}},
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

    # ------------------------------------------------------------------
    # Auto-initialize the database on startup.
    #
    # Any tables that don't exist yet are created from the SQLAlchemy
    # models, then the initial storefront data (categories/products) is
    # seeded. Both steps are idempotent, so this is safe to run every
    # time the app boots. Set AUTO_INIT_DB=false to disable.
    # ------------------------------------------------------------------
    if app.config.get("AUTO_INIT_DB", True):
        with app.app_context():
            db.create_all()
            seed_database()

    return app

import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from extensions import db, migrate, jwt
from app.routes import init_routes
from init_db import seed_db_if_empty
from config import Config


def create_app():
    # Load environment variables
    base_dir = os.path.dirname(os.path.dirname(__file__))
    env_example = os.path.join(base_dir, ".env.example")
    load_dotenv(env_example)

    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = Config.DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = Config.SQLALCHEMY_TRACK_MODIFICATIONS
    app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY
    app.config["JWT_TOKEN_LOCATION"] = Config.JWT_TOKEN_LOCATION

    cors_origins = Config.CORS_ORIGINS.split(",")
    CORS(
        app,
        resources={r"/api/*": {"origins": cors_origins}},
        supports_credentials=True,
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    init_routes(app)

    if Config.SEED_DB_ON_STARTUP:
        with app.app_context():
            seed_db_if_empty()

    return app
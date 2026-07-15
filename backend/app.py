import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from extensions import db, migrate, jwt
from app.routes import init_routes
from init_db import seed_db_if_empty


def create_app():
    # Load environment variables
    env_file = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_file):
        load_dotenv(env_file)
    else:
        load_dotenv()

    app = Flask(__name__)

    # CORS
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    CORS(
        app,
        resources={r"/api/*": {"origins": cors_origins}},
        supports_credentials=True
    )

    # Database
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        # docker-compose-friendly default (when using service name `db`)
        "postgresql+psycopg2://bxtech:bxtech@db:5432/bxtech",
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # JWT
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "FLASK_SECRET_KEY",
        "change-me"
    )
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register routes
    init_routes(app)

    # Seed database (handles initial DB startup delays when using docker-compose)
    with app.app_context():
        import time

        last_exc = None
        for _ in range(10):
            try:
                seed_db_if_empty()
                last_exc = None
                break
            except Exception as e:
                last_exc = e
                time.sleep(1)

        if last_exc is not None:
            raise last_exc

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
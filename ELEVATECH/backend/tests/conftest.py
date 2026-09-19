import os

# Keep tests isolated: never auto-create/seed the real database (PostgreSQL)
# when the app factory runs. Tests create/drop their own in-memory SQLite DB.
os.environ["AUTO_INIT_DB"] = "false"
# Provide dummy values so Config has a valid DB URI + secrets at import time.
# The fixture below then overrides the URI with in-memory SQLite anyway.
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("JWT_SECRET_KEY", "7046e2115f4606917b086cf17cf00ae3e2ffe9b7680beeb811c019c9c1bc255f")

import pytest

from app import create_app
from app.extensions import db


@pytest.fixture()
def app():
    app = create_app()
    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
    )

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()
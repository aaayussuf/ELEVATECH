import os

# Keep tests isolated: never auto-create/seed the real database (PostgreSQL)
# when the app factory runs. Tests create/drop their own in-memory SQLite DB.
os.environ["AUTO_INIT_DB"] = "false"

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
import logging
from logging.config import fileConfig

import os

from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Import Flask lazily only if we have an application context.
try:
    from flask import current_app  # type: ignore
except Exception:  # pragma: no cover
    current_app = None


# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')


def get_engine_url():
    # Prefer Flask-SQLAlchemy engine URL when running within app context.
    if current_app is not None:
        try:
            ext = current_app.extensions.get('migrate')
            if ext is not None and hasattr(ext, 'db'):
                db_obj = ext.db
                engine = None
                try:
                    engine = db_obj.get_engine()
                except Exception:
                    engine = getattr(db_obj, 'engine', None)
                if engine is not None and hasattr(engine, 'url'):
                    return engine.url.render_as_string(hide_password=False).replace('%', '%%')
        except Exception:
            pass

    # Fallback: use DATABASE_URL from environment.
    url = os.getenv('DATABASE_URL')
    if not url:
        # Last resort: allow alembic.ini to provide it.
        url = config.get_main_option('sqlalchemy.url')
    if not url:
        raise RuntimeError("Could not determine database URL for Alembic. Set DATABASE_URL or sqlalchemy.url in alembic.ini")
    return str(url).replace('%', '%%')


def get_engine():
    """Return a SQLAlchemy Engine for Alembic online migrations."""

    # Prefer Flask-SQLAlchemy engine when available.
    if current_app is not None:
        try:
            ext = current_app.extensions.get("migrate")
            if ext is not None and hasattr(ext, "db"):
                db = ext.db
                try:
                    return db.get_engine()
                except Exception:
                    return db.engine
        except Exception:
            pass

    # Fallback for CLI usage.
    from sqlalchemy import create_engine

    return create_engine(config.get_main_option("sqlalchemy.url"))



# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
config.set_main_option('sqlalchemy.url', get_engine_url())

# Ensure SQLAlchemy models are loaded so Alembic can see the correct schema
# (required when running migrations from the CLI).
try:
    from app.models import *  # noqa: F401,F403
except Exception:
    # If models fail to import, migrations will error out later with a clearer message.
    pass

# For standalone runs, current_app may be missing; fallback to app metadata.
if current_app is not None and hasattr(current_app, 'extensions'):
    target_db = current_app.extensions['migrate'].db
else:
    # Flask-SQLAlchemy stores metadata on BaseModel's metadata
    from app.models.product import Product
    target_db = Product.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_metadata():
    if hasattr(target_db, 'metadatas'):
        return target_db.metadatas[None]
    return target_db.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=get_metadata(), literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """

    # this callback is used to prevent an auto-migration from being generated
    # when there are no changes to the schema
    # reference: http://alembic.zzzcomputing.com/en/latest/cookbook.html
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')

    if current_app is not None:
        conf_args = current_app.extensions["migrate"].configure_args
    else:
        conf_args = {}

    if conf_args.get("process_revision_directives") is None:
        conf_args["process_revision_directives"] = process_revision_directives

    connectable = get_engine()

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=get_metadata(),
            **conf_args
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

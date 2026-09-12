"""Add verification fields to users

Revision ID: b9c2d1e4f5a6
Revises: e6ecd655281b
Create Date: 2026-09-12

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "b9c2d1e4f5a6"
down_revision = "e6ecd655281b"
branch_labels = None
depends_on = None


def _existing_columns():
    """Return the set of column names currently on the `users` table."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return {col["name"] for col in inspector.get_columns("users")}


def upgrade():
    existing = _existing_columns()

    columns = [
        sa.Column("email_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("phone_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("email_otp", sa.String(length=6), nullable=True),
        sa.Column("email_otp_expires_at", sa.DateTime(), nullable=True),
        sa.Column("email_otp_sent_at", sa.DateTime(), nullable=True),
        sa.Column("phone_otp", sa.String(length=6), nullable=True),
        sa.Column("phone_otp_expires_at", sa.DateTime(), nullable=True),
        sa.Column("phone_otp_sent_at", sa.DateTime(), nullable=True),
        sa.Column("reset_otp", sa.String(length=6), nullable=True),
        sa.Column("reset_otp_expires_at", sa.DateTime(), nullable=True),
        sa.Column("reset_otp_sent_at", sa.DateTime(), nullable=True),
    ]

    missing = [col for col in columns if col.name not in existing]

    if missing:
        with op.batch_alter_table("users", schema=None) as batch_op:
            for col in missing:
                batch_op.add_column(col)


def downgrade():
    existing = _existing_columns()

    drop_order = [
        "reset_otp_sent_at",
        "reset_otp_expires_at",
        "reset_otp",
        "phone_otp_sent_at",
        "phone_otp_expires_at",
        "phone_otp",
        "email_otp_sent_at",
        "email_otp_expires_at",
        "email_otp",
        "phone_verified",
        "email_verified",
    ]

    with op.batch_alter_table("users", schema=None) as batch_op:
        for name in drop_order:
            if name in existing:
                batch_op.drop_column(name)
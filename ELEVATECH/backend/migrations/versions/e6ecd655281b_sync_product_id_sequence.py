"""sync product id sequence

Revision ID: e6ecd655281b
Revises: aaa077920208
Create Date: 2026-09-04
"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "e6ecd655281b"
down_revision = "aaa077920208"
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        SELECT setval(
            pg_get_serial_sequence('products', 'id'),
            COALESCE((SELECT MAX(id) FROM products), 1),
            (SELECT MAX(id) IS NOT NULL FROM products)
        );
    """)


def downgrade():
    pass

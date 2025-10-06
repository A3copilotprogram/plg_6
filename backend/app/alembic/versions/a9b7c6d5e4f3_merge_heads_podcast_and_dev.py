"""merge heads: podcast + dev

Revision ID: a9b7c6d5e4f3
Revises: ('2042a1f0c0a1', '64343f21e9a8')
Create Date: 2025-10-06 00:00:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a9b7c6d5e4f3'
down_revision = ('2042a1f0c0a1', '64343f21e9a8')
branch_labels = None
depends_on = None


def upgrade():
    # Merge point: no-op
    pass


def downgrade():
    # Merge point: no-op
    pass


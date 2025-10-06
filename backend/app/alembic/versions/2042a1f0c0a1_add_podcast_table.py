"""add podcast table

Revision ID: 2042a1f0c0a1
Revises: 10368f38610b
Create Date: 2025-10-05 06:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '2042a1f0c0a1'
down_revision = '2cde6f094a4e'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'podcast',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('course_id', sa.Uuid(), nullable=False),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('transcript', sa.Text(), nullable=False),
        sa.Column('audio_path', sqlmodel.sql.sqltypes.AutoString(length=1024), nullable=False),
        sa.Column('storage_backend', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=False),
        sa.Column('duration_seconds', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['course_id'], ['course.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('podcast')

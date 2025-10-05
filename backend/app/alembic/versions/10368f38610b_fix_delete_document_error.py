"""Fix delete document error.

Revision ID: 10368f38610b
Revises: b5370243d0bc
Create Date: 2025-10-02 07:06:36.831373

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '10368f38610b'
down_revision = 'b5370243d0bc'
branch_labels = None
depends_on = None


def upgrade():
    # This migration originally (incorrectly) re-created the 'chat' table.
    # The chat table is created in migration '6e308b39ff60_add_chat_table'.
    # Keep only the intended FK change for 'quizattempt'.
    op.drop_constraint(op.f('quizattempt_quiz_id_fkey'), 'quizattempt', type_='foreignkey')
    op.create_foreign_key(None, 'quizattempt', 'quiz', ['quiz_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade():
    # Revert the FK change only; do not drop 'chat' which belongs to a prior migration.
    op.drop_constraint(None, 'quizattempt', type_='foreignkey')
    op.create_foreign_key(op.f('quizattempt_quiz_id_fkey'), 'quizattempt', 'quiz', ['quiz_id'], ['id'])
    # ### end Alembic commands ###

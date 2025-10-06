"""add_embedding_column_to_chat

Revision ID: 18658cfb127d
Revises: 64343f21e9a8
Create Date: 2025-10-06 17:08:33.900980

"""
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


# revision identifiers, used by Alembic.
revision = '18658cfb127d'
down_revision = '64343f21e9a8'
branch_labels = None
depends_on = None

def upgrade():
    # Enable pgvector extension if not already enabled
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')
    
    # Add embedding column with vector type (1536 dimensions for text-embedding-3-small)
    op.add_column('chat', sa.Column('embedding', Vector(1536), nullable=True))
    
    # Create an ivfflat index for fast cosine similarity searches
    # Using lists=100 as a good default for medium-sized datasets
    # We'll use cosine distance (vector_cosine_ops) as that's what we use in queries
    op.execute('''
        CREATE INDEX IF NOT EXISTS chat_embedding_idx 
        ON chat 
        USING ivfflat (embedding vector_cosine_ops) 
        WITH (lists = 100)
    ''')


def downgrade():
    # Drop the index first
    op.execute('DROP INDEX IF EXISTS chat_embedding_idx')
    
    # Drop the embedding column
    op.drop_column('chat', 'embedding')
    
    # Note: We don't drop the vector extension as other tables might use it
    # If you want to drop it completely, uncomment:
    # op.execute('DROP EXTENSION IF EXISTS vector')


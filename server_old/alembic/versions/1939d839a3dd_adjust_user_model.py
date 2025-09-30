"""Adjust user model safely for SQLite

Revision ID: 1939d839a3dd
Revises: 8e6ea5f2f388
Create Date: 2025-09-26 16:52:15.476800
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '1939d839a3dd'
down_revision = '8e6ea5f2f388'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create a new users table with the correct schema
    op.create_table(
        'users_new',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('email', sa.String, nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=False),  # NOT NULL now
        sa.Column('is_admin', sa.Boolean, nullable=False),
        # Add any other existing columns you need here
    )

    # Copy data from the old users table to the new table
    conn = op.get_bind()
    conn.execute(
        """
        INSERT INTO users_new (id, email, created_at, is_admin)
        SELECT id, email, created_at, is_admin
        FROM users
        """
    )

    # Drop the old users table
    op.drop_table('users')

    # Rename the new table to users
    op.rename_table('users_new', 'users')


def downgrade() -> None:
    # Recreate the old users table structure
    op.create_table(
        'users_old',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('email', sa.String, nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=True),  # back to nullable
        sa.Column('is_verified', sa.Boolean, nullable=False),
        sa.Column('is_superuser', sa.Boolean, nullable=False),
        # Add any other columns that existed before
    )

    conn = op.get_bind()
    conn.execute(
        """
        INSERT INTO users_old (id, email, created_at, is_verified, is_superuser)
        SELECT id, email, created_at, 0, 0
        FROM users
        """
    )

    # Drop the current users table
    op.drop_table('users')

    # Rename back to users
    op.rename_table('users_old', 'users')

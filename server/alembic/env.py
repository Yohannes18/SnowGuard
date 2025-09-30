import asyncio
from logging.config import fileConfig
import os
import sys

from sqlalchemy.pool import NullPool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from alembic import context

# Add your app path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import Base  # Base from your database.py
from app.models.user import User
from app.models.analysis import AnalysisReport
from app.config import DATABASE_URL

# Alembic Config object
config = context.config
fileConfig(config.config_file_name)

target_metadata = Base.metadata

# Use DATABASE_URL from .env
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# --- Offline migration ---
def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

# --- Online migration ---
def do_run_migrations(connection: Connection):
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    connectable = create_async_engine(
        DATABASE_URL,
        poolclass=NullPool,
        future=True,
        echo=False,
    )
    

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())

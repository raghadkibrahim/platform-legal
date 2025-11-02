from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os

# --- our imports ---
from app.core.config import settings
from app.models.base import Base
from app.models import models  # ensures models are imported so metadata has tables

config = context.config
fileConfig(config.config_file_name)

# Point Alembic at your models' metadata
target_metadata = Base.metadata

def get_url():
    return settings.SQLALCHEMY_DATABASE_URI  # from .env

def run_migrations_offline():
    url = get_url()
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, compare_type=True
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    cfg = config.get_section(config.config_ini_section)
    connectable = engine_from_config(
        cfg,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        url=get_url(),
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

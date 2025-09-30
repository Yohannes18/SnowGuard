from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase as _BaseSQLAlchemyUserDatabase

class SQLAlchemyUserDatabase(_BaseSQLAlchemyUserDatabase):
    """Compatibility wrapper to handle `safe` argument gracefully."""
    async def create(self, *args, safe: bool = False, **kwargs):
        return await super().create(*args, **kwargs)
    async def update(self, *args, safe: bool = False, **kwargs):
        return await super().update(*args, **kwargs)
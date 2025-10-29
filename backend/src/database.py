from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from decouple import config


DB_URL = f"postgresql+asyncpg://{config('POSTGRES_USER')}:{config('POSTGRES_PASSWORD')}@{config('POSTGRES_HOST')}:5432/{config('POSTGRES_DB')}"

engine = create_async_engine(DB_URL)
new_session = async_sessionmaker(engine, expire_on_commit=False)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Return DB session."""
    async with new_session() as session:
        yield session


class Base(DeclarativeBase):
    pass
from datetime import datetime

from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base


class User(Base):
    """
    Represents a single user entity in the DB.

    Attributes:
        id (int): Unique Identifier.
        full_name (str): Full name of the user.
        email (str): User email address.
        password (str): Hashed password.
        created_at (datetime): When the user was created.
        updated_at (datetime): When the user was last updated.
    """
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=True, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=True)

    def __str__(self):
        return self.full_name

    def __repr__(self):
        return f'<User {self.full_name}>'



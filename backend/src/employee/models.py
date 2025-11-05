from datetime import datetime

from sqlalchemy import String, DateTime, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base
from src.users.models import User


class WorkPlace(Base):
    """
    Represents a work place entity in the DB.

    Attributes:
        id (int): Unique identifier.
        title (str): Title of the work place.
        address (str): Address of the work place.
    """
    __tablename__ = 'workplaces'

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    address: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    employees: Mapped[list["Employee"]] = relationship(back_populates="workplace", cascade="all, delete-orphan")

    def __str__(self):
        return self.title

    def __repr__(self):
        return f'<WorkPlace {self.title}>'


class Employee(Base):
    """
    Represents an employee entity in the DB.

    Attributes:
        id (int): Unique identifier.
        full_name (str): Full name of the user.
        email (str): User email address.
        phone_number (str): User phone number.
        is_active (bool): Whether the user is active or not.
        created_at (datetime): Date and time the user was created.
        updated_at (datetime): Date and time the user was last updated.
    """
    __tablename__ = 'employees'

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    phone_number: Mapped[str] = mapped_column(String(13), nullable=False, unique=True)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True, default=func.now(), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True, onupdate=func.now(), server_default=func.now())

    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    workplace_id: Mapped[int] = mapped_column(ForeignKey('workplaces.id', ondelete='RESTRICT'), nullable=False)
    workplace: Mapped["WorkPlace"] = relationship(back_populates="employees")

    def __str__(self):
        return self.full_name

    def __repr__(self):
        return f'<Employee {self.full_name}>'
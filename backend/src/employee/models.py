from datetime import datetime, date

from sqlalchemy import String, DateTime, func, ForeignKey, Date, Interval, UniqueConstraint
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
        first_name (str): First name of the employee.
        last_name (str): Last name of the employee.
        position (str): Position of the employee.
        profile_photo (str): URL to the profile photo.
        email (str): User email address.
        phone_number (str): User phone number.
        is_active (bool): Whether the user is active or not.
        created_at (datetime): Date and time the user was created.
        updated_at (datetime): Date and time the user was last updated.
    """
    __tablename__ = 'employees'

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    position: Mapped[str] = mapped_column(String(50), nullable=False)
    profile_photo: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    phone_number: Mapped[str] = mapped_column(String(13), nullable=False, unique=True)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    personal_token: Mapped[str] = mapped_column(String(255), nullable=True, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True, default=func.now(), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True, onupdate=func.now(), server_default=func.now())

    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    workplace_id: Mapped[int] = mapped_column(ForeignKey('workplaces.id', ondelete='RESTRICT'), nullable=False)
    user: Mapped[User] = relationship("User", lazy="joined")
    workplace: Mapped["WorkPlace"] = relationship(back_populates="employees")
    work_days: Mapped[list["WorkDay"]] = relationship(
        back_populates="employee",
        cascade="all, delete-orphan"
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def __repr__(self):
        return f'<Employee {self.first_name} {self.last_name}>'


class WorkDay(Base):
    """
    Represents an employee work day entity in the DB.

    Attributes:
        id (int): Unique identifier.
        work_date (date): Work day.
        employee_id (int): Employee id.
        total_duration (str): Total duration of the work day.
    """
    __tablename__ = 'work_days'

    id : Mapped[int] = mapped_column(primary_key=True)
    work_date: Mapped[date] = mapped_column(Date,nullable=False)
    employee_id: Mapped[int] = mapped_column(ForeignKey('employees.id', ondelete='CASCADE'), nullable=False)
    total_duration: Mapped[str] = mapped_column(Interval, server_default="0 hours", nullable=False)

    employee: Mapped["Employee"] = relationship(back_populates="work_days")
    sessions: Mapped[list["WorkSession"]] = relationship(back_populates="work_day", cascade="all, delete-orphan", lazy="selectin")

    __table_args__ = (
        UniqueConstraint('work_date', 'employee_id', name='uq_employee_day'),
    )

    def __str__(self):
        return self.work_date

    def __repr__(self):
        return f'<WorkDay {self.work_date}>'


class WorkSession(Base):
    """
    Represents a work session entity in the DB.

    Attributes:
        id (int): Unique identifier.
        work_day_id (int): Work day.
        start_time (datetime): Start time of the work day.
        end_time (datetime): End time of the work day.
    """
    __tablename__ = "work_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    work_day_id: Mapped[int] = mapped_column(ForeignKey("work_days.id", ondelete="CASCADE"), nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    work_day: Mapped["WorkDay"] = relationship(back_populates="sessions")


    def __repr__(self):
        return f"<WorkSession {self.start_time} - {self.end_time}>"


import re
from datetime import datetime, date, timedelta, time
from typing import List

from fastapi import Request
from pydantic import BaseModel, EmailStr, field_validator, HttpUrl, SerializationInfo, field_serializer


def to_absolute_url(value: str | None, info: SerializationInfo) -> str | None:
    """
    Converts a relative URL path to an absolute URL using the request context.
    """
    if not value:
        return None

    if info.context and "request" in info.context:
        request: Request | None = info.context.get("request")
        if request:
            return f"{str(request.base_url).rstrip('/')}{value}"
    return value


class EmployeeCreateSchema(BaseModel):
    """
    Schema using for employee creation
    """
    first_name: str
    last_name: str
    position: str
    email: EmailStr
    phone_number: str
    workplace_id: int

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str) -> str:
        """Validate phone number."""
        if not re.fullmatch(r"^\+380\d{9}$", value):
            raise ValueError("Phone must be in format +380XXXXXXXXX")
        return value


class WorkPlaceReturnSchema(BaseModel):
    """
    Schema using when returning work place
    """
    id: int
    title: str
    address: str

    model_config = {
        "from_attributes": True
    }


class WorkTimeStatusSchema(BaseModel):
    """
    Schema using when returning work time status
    """
    today: timedelta | None
    week: timedelta | None
    month: timedelta | None

    @field_serializer('today', 'week', 'month')
    def serialize_duration(self, value: timedelta | None, _info):
        if not value:
            return "00:00"

        total_seconds = int(value.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        return f"{hours:02}:{minutes:02}"


class EmployeeReturnSchema(BaseModel):
    """
    Schema using when returning employees information
    """
    id: int
    first_name: str
    last_name: str
    position: str
    profile_photo: str | None
    email: EmailStr
    phone_number: str
    created_at: datetime
    workplace: WorkPlaceReturnSchema

    model_config = {
        "from_attributes": True
    }

    @field_serializer("profile_photo")
    def make_photo_url_absolute(self, value: str | None, info: SerializationInfo):
        return to_absolute_url(value, info)


class EmployeeWithStatsReturnSchema(EmployeeReturnSchema):
    """
    Schema using when returning employee information with work time
    """
    work_stats: WorkTimeStatusSchema

    model_config = {
        "from_attributes": True
    }


class WorkSummarySchema(BaseModel):
    """
    Повертає статистику за день.
    hours - це об'єкт time (наприклад 08:45:00) або None.
    """
    date: date
    work_time: time | None

    model_config = {
        "from_attributes": True
    }


class EmployeeReturnDetailSchema(BaseModel):
    """
    Schema using when returning employee detail information
    """
    id: int
    first_name: str
    last_name: str
    position: str
    profile_photo: str | None
    email: EmailStr
    phone_number: str
    created_at: datetime
    workplace: WorkPlaceReturnSchema
    personal_token: str

    model_config = {
        "from_attributes": True
    }

    @field_serializer("profile_photo")
    def make_photo_url_absolute(self, value: str | None, info: SerializationInfo):
        return to_absolute_url(value, info)


class EmployeeWorkDetailSchema(BaseModel):
    """
    Schema using when returning employee work detail information
    """
    employee: EmployeeReturnDetailSchema
    period: str
    work_summary: List[WorkSummarySchema]
    total_hours: float


class WorkplaceCreateSchema(BaseModel):
    """
    Schema using when creating work place
    """
    title: str
    address: str


class EmployeeReturnByTokenSchema(EmployeeReturnDetailSchema):
    day_time: timedelta | None
    week_time: timedelta | None
    month_time: timedelta | None

    @field_serializer('day_time', 'week_time', 'month_time')
    def serialize_duration(self, value: timedelta | None, _info):
        if not value:
            return "00:00"

        total_seconds = int(value.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        return f"{hours:02}:{minutes:02}"
import re
from datetime import datetime, date
from typing import List

from pydantic import BaseModel, EmailStr, field_validator


class EmployeeCreateSchema(BaseModel):
    """
    Schema using for employee creation
    """
    full_name: str
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


class EmployeeReturnSchema(BaseModel):
    """
    Schema using when returning employees information
    """
    id: int
    full_name: str
    email: EmailStr
    phone_number: str
    created_at: datetime
    workplace: WorkPlaceReturnSchema

    model_config = {
        "from_attributes": True
    }


class WorkSummarySchema(BaseModel):
    """
    Schema using when returning work summary
    """
    date: date
    hours: float


class EmployeeReturnDetailSchema(BaseModel):
    """
    Schema using when returning employee detail information
    """
    id: int
    full_name: str
    email: EmailStr
    phone_number: str
    created_at: datetime
    workplace: WorkPlaceReturnSchema
    personal_token: str

    model_config = {
        "from_attributes": True
    }


class EmployeeWorkDetailSchema(BaseModel):
    """
    Schema using when returning employee work detail information
    """
    employee: EmployeeReturnDetailSchema
    period: str
    work_summary: List[WorkSummarySchema]
    total_hours: float
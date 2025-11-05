import re

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
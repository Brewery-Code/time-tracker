from datetime import datetime

from fastapi import HTTPException
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from pydantic_core.core_schema import ValidationInfo


class UserCreateSchema(BaseModel):
    """
    Schema used when creating a new user.
    """
    first_name: str
    last_name: str
    email: EmailStr
    password1: str = Field(min_length=8)
    password2: str = Field(min_length=8)

    @model_validator(mode="after")
    def check_passwords_match(self):
        if self.password1 != self.password2:
            raise ValueError("Passwords do not match")
        return self


class UserLoginSchema(BaseModel):
    """
    Schema used when user trying to log-in
    """
    email: EmailStr
    password: str = Field(min_length=8, max_length=70)


class UserCurrentSchema(BaseModel):
    """
    Schema used for current user return.
    """
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    created_at: datetime


from pydantic import BaseModel, EmailStr, Field


class UserCreateSchema(BaseModel):
    """
    Schema used when creating a new user.
    """
    full_name: str = Field(max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)


class UserLoginSchema(BaseModel):
    """
    Schema used when user trying to log-in
    """
    email: EmailStr
    password: str = Field(min_length=8, max_length=70)
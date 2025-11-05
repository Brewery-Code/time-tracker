from pydantic import BaseModel, EmailStr, Field


class UserCreateSchema(BaseModel):
    """
    User creation schema
    """
    full_name: str = Field(max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)


class UserLoginSchema(BaseModel):
    """
    User login schema
    """
    email: EmailStr
    password: str = Field(min_length=8, max_length=70)
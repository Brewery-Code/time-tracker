from pydantic import BaseModel, EmailStr, Field


class UserCreateSchema(BaseModel):
    full_name: str = Field(max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=70)
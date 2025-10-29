from datetime import timedelta

from fastapi import HTTPException, Response
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from authx import AuthX, AuthXConfig, RequestToken
from sqlalchemy import select, and_

from src.users.models import User
from src.users.schemas import UserCreateSchema, UserLoginSchema
from src.users.utils import hash_password, verify_password


config = AuthXConfig(
    JWT_ALGORITHM="HS256",
    JWT_SECRET_KEY="secret_key",
    JWT_TOKEN_LOCATION=["cookies"],
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=5),
    JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=5),
)

auth = AuthX(config=config)


class UserService:
    @staticmethod
    async def create_user(user: UserCreateSchema, session: AsyncSession):
        """Create new user."""
        hashed_password = hash_password(user.password)
        new_user = User(full_name=user.full_name, email=user.email, password=hashed_password)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return {"message": f"User with email={new_user.email} was created."}


    @staticmethod
    async def login_user(user: UserLoginSchema, response: Response  ,session: AsyncSession):
        """Login user."""
        query = select(User).where(User.email == user.email)
        result = await session.execute(query)
        db_user = result.scalar_one_or_none()

        if not db_user:
            raise HTTPException(status_code=401, detail="User not found")

        if not verify_password(user.password, db_user.password):
            raise HTTPException(status_code=401, detail="Incorrect password")

        access_token = auth.create_access_token(uid=str(db_user.id))
        refresh_token = auth.create_refresh_token(uid=str(db_user.id))

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=False,
            secure=False,
            samesite="Lax",
            max_age=300,
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=432_000,
        )
        return {"message": "Login successful."}


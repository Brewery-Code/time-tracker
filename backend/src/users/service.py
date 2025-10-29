import logging

from authx import TokenPayload
from fastapi import HTTPException, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.users.models import User
from src.users.schemas import UserCreateSchema, UserLoginSchema
from src.users.utils import hash_password, verify_password
from src.users.config import auth


logger = logging.getLogger(__name__)


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
        auth.set_access_cookies(access_token, response)
        auth.set_refresh_cookies(refresh_token, response)

        return {"message": "Login successful."}


    @staticmethod
    async def get_new_access_token(payload: TokenPayload, response: Response, session: AsyncSession):
        uid = payload.sub

        query = select(User).where(User.id == int(uid))
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        new_access_token = auth.create_access_token(uid=str(user.id))
        new_refresh_token = auth.create_refresh_token(uid=str(user.id))

        auth.set_access_cookies(new_access_token, response)
        auth.set_refresh_cookies(new_refresh_token, response)

        return {"message": "Access token refreshed."}


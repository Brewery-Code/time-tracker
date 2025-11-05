import logging

from authx import TokenPayload
from fastapi import HTTPException, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.users.models import User
from src.users.schemas import UserCreateSchema, UserLoginSchema
from src.users.utils import hash_password, verify_password
from src.users.config import auth
from src.utils.users import extract_user_uid_from_token, extract_user_by_id


logger = logging.getLogger(__name__)


class UserService:
    """
    Provides business logic for managing users accounts.
    """

    @staticmethod
    async def create_user(user: UserCreateSchema, session: AsyncSession):
        """
        Create a new user entry in the DB.

        Args:
            user (UserCreateSchema): Validated input data.
            session (AsyncSession): DB session.
        """
        hashed_password = hash_password(user.password)
        new_user = User(full_name=user.full_name, email=user.email, password=hashed_password)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        logger.info(f"User with email {new_user.email} created. His ID is {new_user.id}.")
        return {"status_code": 201, "message": "User created successfully."}


    @staticmethod
    async def login_user(user: UserLoginSchema, response: Response, session: AsyncSession):
        """
        Login an existing user entry in the DB.

        Args:
            user (UserLoginSchema): Validated input data.
            session (AsyncSession): DB session.
            response (Response): Response object.
        """
        logger.info(f"Login request for user {user.email}")
        query = select(User).where(User.email == user.email)
        result = await session.execute(query)
        db_user = result.scalar_one_or_none()

        if not db_user:
            logger.warning(f"Login failed. User with email={user.email} was not found.")
            raise HTTPException(status_code=401, detail="User not found")

        if not verify_password(user.password, db_user.password):
            logger.warning(f"Login failed. User with email={user.email} enter wrong password.")
            raise HTTPException(status_code=401, detail="Incorrect password")

        access_token = auth.create_access_token(uid=str(db_user.id))
        refresh_token = auth.create_refresh_token(uid=str(db_user.id))
        auth.set_access_cookies(access_token, response)
        auth.set_refresh_cookies(refresh_token, response)
        logger.info(f"User with email={user.email} logged in successfully.")

        return {"status_code": 200, "message": "Login successful."}


    @staticmethod
    async def get_new_access_token(payload: TokenPayload, response: Response, session: AsyncSession):
        """
        Update an JWT token for an existing user entry in the DB.

        Args:
            payload (TokenPayload): JWT token payload.
            session (AsyncSession): DB session.
            response (Response): Response object.
        """
        logger.info(f"Requesting new access token for user {payload.sub}")

        uid = extract_user_uid_from_token(payload)
        user = await extract_user_by_id(uid, User, session)

        new_access_token = auth.create_access_token(uid=str(user.id))
        new_refresh_token = auth.create_refresh_token(uid=str(user.id))

        auth.set_access_cookies(new_access_token, response)
        auth.set_refresh_cookies(new_refresh_token, response)
        logger.info(f"Access token for user {user.id} was successfully refreshed.")
        return {"status_code": 200, "message": "Access token refreshed."}


    @staticmethod
    async def get_user_profile(payload: TokenPayload, session: AsyncSession):
        """
        Get user profile info from the DB.

        Args:
            payload (TokenPayload): JWT token payload.
            session (AsyncSession): DB session.
        """
        uid = extract_user_uid_from_token(payload)
        user = await extract_user_by_id(uid, User, session)

        return user


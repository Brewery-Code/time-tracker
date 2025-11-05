from authx import TokenPayload
from authx.exceptions import InvalidToken
from fastapi import HTTPException
from sqlalchemy import select

from src.dependencies import SessionDep
from src.users.models import User


def extract_user_uid_from_token(payload: TokenPayload) -> int:
    """
    Extract user uid from token payload.

    Args:
        payload: Token payload.
    """
    try:
        uid = payload.sub
        return int(uid)
    except InvalidToken:
        raise HTTPException(status_code=401, detail="Invalid token.")


async def extract_user_by_id(uid: int, model, session: SessionDep) -> User:
    """
    Extract user by id from DB.

    Args:
        uid: User id.
        model: User model.
        session: DB session.
    """

    query = select(model).where(model.id == uid)
    result = await session.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
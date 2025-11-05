from authx import TokenPayload
from fastapi import APIRouter, Response, Depends, Request

from src.dependencies import SessionDep
from src.users.schemas import UserCreateSchema, UserLoginSchema
from src.users.service import UserService, auth


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", summary="Create a new user")
async def create_user(user: UserCreateSchema, session: SessionDep):
    """Create a new user."""
    return await UserService.create_user(user, session)


@router.post("/login", summary="Login a user")
async def login_user(user: UserLoginSchema, response: Response, session: SessionDep):
    """Login a user."""
    return await UserService.login_user(user, response, session)


@router.post("/token-refresh")
async def token_refresh(response: Response, session: SessionDep, payload: TokenPayload = Depends(auth.refresh_token_required)):
    """
    Return Updated JWT tokens in cookies.

    Requires refresh token cookie.
    """
    return await UserService.get_new_access_token(payload, response, session)

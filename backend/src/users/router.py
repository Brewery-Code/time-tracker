from fastapi import APIRouter, Response

from src.dependencies import SessionDep
from src.users.schemas import UserCreateSchema, UserLoginSchema
from src.users.service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", summary="Create a new user")
async def create_user(user: UserCreateSchema, session: SessionDep):
    """Create a new user"""
    return await UserService.create_user(user, session)


@router.post("/login", summary="Login a user")
async def login_user(user: UserLoginSchema, response: Response, session: SessionDep):
    """Login a user"""
    return await UserService.login_user(user, response, session)
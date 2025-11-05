from authx import TokenPayload
from fastapi import APIRouter, Depends

from src.dependencies import SessionDep
from src.employee.schemas import EmployeeCreateSchema
from src.employee.service import EmployeeService
from src.users.config import auth

router = APIRouter(prefix="/employee", tags=["employee"])


@router.post("", summary="Create a new employee")
async def create_employee(data: EmployeeCreateSchema, session: SessionDep, payload: TokenPayload = Depends(auth.access_token_required)):
    """Create a new employee."""
    return await EmployeeService.create_employee(data, payload, session)
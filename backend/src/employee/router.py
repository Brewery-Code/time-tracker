from authx import TokenPayload
from fastapi import APIRouter, Depends

from src.dependencies import SessionDep
from src.employee.schemas import EmployeeCreateSchema, EmployeeReturnSchema
from src.employee.service import EmployeeService
from src.users.config import auth

router = APIRouter(prefix="/employees", tags=["employees"])


@router.post("", summary="Create a new employee")
async def create_employee(data: EmployeeCreateSchema, session: SessionDep, payload: TokenPayload = Depends(auth.access_token_required)):
    """Create a new employee."""
    return await EmployeeService.create_employee(data, payload, session)


@router.get("", summary="Get all employees for current user", response_model=list[EmployeeReturnSchema])
async def get_all_employees(session: SessionDep, payload: TokenPayload = Depends(auth.access_token_required)):
    """Get all employees for current user."""
    return await EmployeeService.get_all_employees(session, payload)
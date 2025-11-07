from authx import TokenPayload
from fastapi import APIRouter, Depends

from src.dependencies import SessionDep
from src.employee.dependencies import get_current_employer_token
from src.employee.schemas import EmployeeCreateSchema, EmployeeReturnSchema, EmployeeWorkDetailSchema
from src.employee.service import EmployeeService
from src.users.config import auth
from src.security import *


router = APIRouter(prefix="/employees", tags=["employees"])


@router.post("", summary="Create a new employee", openapi_extra={"security": [{"JWT Access Cookie": []}]})
async def create_employee(data: EmployeeCreateSchema, session: SessionDep, payload: TokenPayload = Depends(auth.access_token_required)):
    """Create a new employee."""
    return await EmployeeService.create_employee(data, payload, session)


@router.get("", summary="Get all employees for current user", response_model=list[EmployeeReturnSchema], openapi_extra={"security": [{"JWT Access Cookie": []}]})
async def get_all_employees(session: SessionDep, payload: TokenPayload = Depends(auth.access_token_required)):
    """Get all employees for current user."""
    return await EmployeeService.get_all_employees(session, payload)


@router.get("/{employee_id}", summary="Get a specific employee", response_model=EmployeeWorkDetailSchema, openapi_extra={"security": [{"JWT Access Cookie": []}]})
async def get_employee_detail(employee_id: int, session: SessionDep, month: int | None = None, year: int | None = None ,payload: TokenPayload = Depends(auth.access_token_required)):
    """Get detailed info and work summary for an employee"""
    return await EmployeeService.get_employee_detail(employee_id, session, month, year, payload)


@router.post("/work/start", summary="Start a new work session", openapi_extra={"security": [{"Employer Header Token": []}]})
async def start_work(session: SessionDep, token: str = Depends(get_current_employer_token)):
    """Start a new work session."""
    return await EmployeeService.start_work(session, token)


@router.post("/work/end", summary="End a new work session", openapi_extra={"security": [{"Employer Header Token": []}]})
async def end_work(session: SessionDep, token: str = Depends(get_current_employer_token)):
    """End a new work session."""
    return await EmployeeService.end_work(session, token)
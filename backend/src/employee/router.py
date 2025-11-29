import os
from datetime import date

from authx import TokenPayload
from fastapi import APIRouter, Depends, UploadFile, File, Form, Request

from src.dependencies import SessionDep
from src.employee.dependencies import get_current_employer_token
from src.employee.schemas import EmployeeCreateSchema, EmployeeReturnSchema, EmployeeWorkDetailSchema, \
    WorkplaceCreateSchema, EmployeeWithStatsReturnSchema
from src.employee.service import EmployeeService
from src.users.config import auth
from src.security import *


router = APIRouter(prefix="/employees", tags=["employees"])


@router.post("", summary="Create a new employee", openapi_extra={"security": [{"JWT Access Cookie": []}]})
async def create_employee(session: SessionDep, file: UploadFile = File(...), data: str = Form(...) ,payload: TokenPayload = Depends(auth.access_token_required)):
    """Create a new employee."""
    employee_data = EmployeeCreateSchema.model_validate_json(data)

    return await EmployeeService.create_employee(data=employee_data, payload=payload, session=session, file=file)


@router.get("", summary="Get all employees for current user", response_model=list[EmployeeWithStatsReturnSchema], openapi_extra={"security": [{"JWT Access Cookie": []}]})
async def get_all_employees(request: Request, session: SessionDep, payload: TokenPayload = Depends(auth.access_token_required)):
    """Get all employees for current user."""
    return await EmployeeService.get_all_employees(request, session, payload)


@router.get("/{employee_id}", summary="Get a specific employee", response_model=EmployeeWorkDetailSchema, openapi_extra={"security": [{"JWT Access Cookie": []}]})
async def get_employee_detail(request: Request, employee_id: int, session: SessionDep, week: date | None = None, month: date | None = None,payload: TokenPayload = Depends(auth.access_token_required)):
    """Get detailed info and work summary for an employee"""
    return await EmployeeService.get_employee_detail(request=request, employee_id=employee_id, session=session, month=month, week=week, payload=payload)


@router.post("/work/start", summary="Start a new work session", openapi_extra={"security": [{"Employer Header Token": []}]})
async def start_work(session: SessionDep, token: str = Depends(get_current_employer_token)):
    """Start a new work session."""
    return await EmployeeService.start_work(session, token)


@router.post("/work/end", summary="End a new work session", openapi_extra={"security": [{"Employer Header Token": []}]})
async def end_work(session: SessionDep, token: str = Depends(get_current_employer_token)):
    """End a new work session."""
    return await EmployeeService.end_work(session, token)


@router.post("/workplaces")
async def add_workplace(data: WorkplaceCreateSchema, session: SessionDep, payload: TokenPayload = Depends(auth.access_token_required)):
    """Add a new workplace."""
    return await EmployeeService.add_workplace(data, payload, session)

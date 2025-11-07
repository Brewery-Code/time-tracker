from datetime import date, datetime, timedelta, timezone

from authx import TokenPayload
from fastapi import HTTPException
from sqlalchemy import select, update, func
from sqlalchemy.orm import selectinload

from src.dependencies import SessionDep
from src.employee.schemas import EmployeeCreateSchema, EmployeeReturnSchema
from src.employee.utils import generate_personal_token, hash_personal_token
from src.utils.users import extract_user_uid_from_token, extract_user_by_id
from src.users.models import User
from src.employee.models import Employee, WorkDay, WorkSession


class EmployeeService:
    """
    Provides business logic for managing employee accounts
    """

    @staticmethod
    async def create_employee(data: EmployeeCreateSchema, payload: TokenPayload, session: SessionDep):
        """
        Create a new employee entry in the DB.

        Args:
            data (EmployeeCreateSchema): Validated data.
            payload (TokenPayload): Validated payload.
            session (Session): Session object.
        """
        uid = extract_user_uid_from_token(payload)
        user = await extract_user_by_id(uid, User, session)

        new_employee = Employee(
            full_name=data.full_name,
            email=data.email,
            phone_number=data.phone_number,
            user_id=user.id,
            workplace_id=data.workplace_id,
        )
        session.add(new_employee)
        await session.commit()
        await session.refresh(new_employee)

        personal_token = generate_personal_token(new_employee.id)
        new_employee.personal_token = personal_token
        await session.commit()

        return {"msg": "success", "personal_token": personal_token}


    @staticmethod
    async def get_all_employees(session: SessionDep, payload: TokenPayload):
        """
        Get all workers for current user.

        Args:
            session (AsyncSession): Session object.
            payload (TokenPayload): Validated payload.
        """
        user_id = extract_user_uid_from_token(payload)

        query = select(Employee).where(Employee.user_id == user_id).options(selectinload(Employee.workplace))
        result = await session.execute(query)
        employees = result.scalars().all()

        return [EmployeeReturnSchema.model_validate(e) for e in employees]


    @staticmethod
    async def start_work(session: SessionDep, token: str):
        """
        Start a new work session for current employee.
        Args:
            session (AsyncSession): Session object.
            token (str): Employee token.
        """
        query = select(Employee).where(Employee.personal_token == token)
        result = await session.execute(query)
        employee = result.scalar_one_or_none()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")

        today = date.today()

        stmt = select(WorkDay).where(
            WorkDay.employee_id == employee.id, WorkDay.work_date == today
        )
        result = await session.execute(stmt)
        work_day = result.scalar_one_or_none()

        if not work_day:
            work_day = WorkDay(employee_id=employee.id, work_date=today, total_duration=timedelta())
            session.add(work_day)
            await session.commit()
            await session.refresh(work_day)

        stmt = select(WorkSession).where(
            WorkSession.work_day_id == work_day.id,
            WorkSession.end_time.is_(None)
        )
        result = await session.execute(stmt)
        open_session = result.scalar_one_or_none()
        if open_session:
            raise HTTPException(status_code=400, detail="Work session already started")

        new_session = WorkSession(work_day_id=work_day.id, start_time=datetime.utcnow())
        session.add(new_session)
        await session.commit()
        await session.refresh(new_session)

        return {"message": "Work session started", "session_id": new_session.id}


    @staticmethod
    async def end_work(session: SessionDep, token: str):
        """
        End work session for current employee.

        Args:
            session (AsyncSession): Session object.
            token (str): Employee token.
        """
        query = select(Employee).where(Employee.personal_token == token)
        result = await session.execute(query)
        employee = result.scalar_one_or_none()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")

        today = date.today()

        stmt = select(WorkDay).where(
            WorkDay.employee_id == employee.id,
            WorkDay.work_date == today
        )
        result = await session.execute(stmt)
        work_day = result.scalar_one_or_none()
        if not work_day:
            raise HTTPException(status_code=400, detail="No work day started today")

        stmt = select(WorkSession).where(
            WorkSession.work_day_id == work_day.id,
            WorkSession.end_time.is_(None)
        )
        result = await session.execute(stmt)
        open_session = result.scalar_one_or_none()
        if not open_session:
            raise HTTPException(status_code=400, detail="No active session to close")

        now = datetime.now(timezone.utc)
        open_session.end_time = now
        duration = now - open_session.start_time

        total_duration = work_day.total_duration or timedelta()
        total_duration += duration

        await session.execute(
            update(WorkDay)
            .where(WorkDay.id == work_day.id)
            .values(total_duration=total_duration)
        )

        await session.commit()
        return {"message": "Work session ended", "worked_for": str(duration)}
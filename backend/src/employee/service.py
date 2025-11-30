import os
import shutil
import uuid
from calendar import monthrange
from datetime import date, datetime, timedelta, timezone

from authx import TokenPayload
from fastapi import HTTPException, UploadFile, File, Request
from sqlalchemy import select, update, func, extract
from sqlalchemy.orm import selectinload, Session

from src.dependencies import SessionDep
from src.employee.schemas import EmployeeCreateSchema, EmployeeReturnSchema, EmployeeWorkDetailSchema, \
    EmployeeReturnDetailSchema, WorkSummarySchema, WorkplaceCreateSchema, EmployeeWithStatsReturnSchema
from src.employee.utils import generate_personal_token, hash_personal_token
from src.utils.users import extract_user_uid_from_token, extract_user_by_id
from src.users.models import User
from src.employee.models import Employee, WorkDay, WorkSession, WorkPlace


class EmployeeService:
    """
    Provides business logic for managing employee accounts
    """

    @staticmethod
    async def create_employee(data: EmployeeCreateSchema,payload: TokenPayload, session: SessionDep, file: UploadFile = File(...) ):
        """
        Create a new employee entry in the DB.

        Args:
            data (EmployeeCreateSchema): Validated data.
            payload (TokenPayload): Validated payload.
            session (Session): Session object.
            file (UploadFile): Profile photo.
        """
        uid = extract_user_uid_from_token(payload)
        user = await extract_user_by_id(uid, User, session)

        # Generate a unique filename
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        upload_dir = "static/employees/profile_photos"
        file_path = os.path.join(upload_dir, unique_filename)
        os.makedirs(upload_dir, exist_ok=True)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        profile_photo_url = f"/static/employees/profile_photos/{unique_filename}"

        new_employee = Employee(
            first_name=data.first_name,
            last_name=data.last_name,
            position=data.position,
            profile_photo=profile_photo_url,
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
    async def get_all_employees(request: Request, session: SessionDep, payload: TokenPayload):
        """
        Get all workers for current user.

        Args:
            session (AsyncSession): Session object.
            payload (TokenPayload): Validated payload.
            request (HTTPRequest): Request object.
        """
        user_id = extract_user_uid_from_token(payload)

        # дати для фільтрації
        today = date.today()
        start_of_week = today - timedelta(days=today.weekday())
        start_of_month = today.replace(day=1)

        def get_duration_subquery(start_date):
            return (
                select(func.sum(WorkDay.total_duration))
                .where(WorkDay.employee_id == Employee.id)
                .where(WorkDay.work_date >= start_date)
                .correlate(Employee)
                .scalar_subquery()
            )

        sq_today = select(func.sum(WorkDay.total_duration)) \
            .where(WorkDay.employee_id == Employee.id) \
            .where(WorkDay.work_date == today) \
            .correlate(Employee) \
            .scalar_subquery()

        sq_week = get_duration_subquery(start_of_week)
        sq_month = get_duration_subquery(start_of_month)

        query = (
            select(
                Employee,
                sq_today.label("hours_today"),
                sq_week.label("hours_week"),
                sq_month.label("hours_month")
            )
            .where(Employee.user_id == user_id)
            .options(selectinload(Employee.workplace))
        )

        result = await session.execute(query)
        rows = result.all()

        response_data = []
        for row in rows:
            employee = row[0]
            emp_dict = EmployeeReturnSchema.model_validate(employee).model_dump(context={"request": request})

            emp_dict["work_stats"] = {
                "today": row[1],
                "week": row[2],
                "month": row[3]
            }

            response_data.append(emp_dict)

        return [EmployeeWithStatsReturnSchema.model_validate(data) for data in response_data]


    @staticmethod
    async def get_employee_detail(
            request: Request,
            employee_id: int,
            session: SessionDep,
            week: date | None,
            month: date | None,
            payload: TokenPayload
    ) -> EmployeeWorkDetailSchema:
        user_id = extract_user_uid_from_token(payload)

        query = (
            select(Employee)
            .where(Employee.id == employee_id, Employee.user_id == user_id)
            .options(selectinload(Employee.workplace))
        )
        result = await session.execute(query)
        employee = result.scalar_one_or_none()

        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found or access denied")

        period_type = "today"
        today = date.today()

        if week:
            start_date = week - timedelta(days=week.weekday())
            end_date = start_date + timedelta(days=6)
            period_type = "week"
        elif month:
            start_date = month.replace(day=1)
            _, days_in_month = monthrange(start_date.year, start_date.month)
            end_date = start_date.replace(day=days_in_month)
            period_type = "month"
        else:
            start_date = today
            end_date = today
            period_type = "today"

        stmt = select(WorkDay).where(
            WorkDay.employee_id == employee.id,
            WorkDay.work_date.between(start_date, end_date)
        )
        result = await session.execute(stmt)
        db_work_days = result.scalars().all()
        work_map = {wd.work_date: wd.total_duration for wd in db_work_days}
        summaries: list[WorkSummarySchema] = []
        total_period_hours_float = 0.0

        current_date = start_date
        while current_date <= end_date:
            duration = work_map.get(current_date)

            hours_time_obj = None
            if duration:
                total_period_hours_float += duration.total_seconds() / 3600
                hours_time_obj = (datetime.min + duration).time()

            summaries.append(WorkSummarySchema(
                date=current_date,
                work_time=hours_time_obj
            ))

            current_date += timedelta(days=1)

        return EmployeeWorkDetailSchema(
            employee=EmployeeReturnDetailSchema.model_validate(employee).model_dump(context={"request": request}),
            period=period_type,
            work_summary=summaries,
            total_hours=round(total_period_hours_float, 2),
        )


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

    @staticmethod
    async def add_workplace(data: WorkplaceCreateSchema, session: SessionDep, token: str):
        """
        Add a new workplace.

        Args:
            data (WorkplaceCreateSchema): Validated data.
            session (AsyncSession): Session object.
            token (str): Employee token.
        """
        new_workplace = WorkPlace(title=data.title, address=data.address)
        session.add(new_workplace)
        await session.commit()
        await session.refresh(new_workplace)
        return {"message": "Workplace added", "workplace_id": new_workplace.id}
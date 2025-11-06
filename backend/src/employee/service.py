from authx import TokenPayload
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.dependencies import SessionDep
from src.employee.schemas import EmployeeCreateSchema, EmployeeReturnSchema
from src.employee.utils import generate_personal_token, hash_personal_token
from src.utils.users import extract_user_uid_from_token, extract_user_by_id
from src.users.models import User
from src.employee.models import Employee


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
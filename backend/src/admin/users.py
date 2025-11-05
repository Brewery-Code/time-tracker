import typing as tp
from fastadmin import register, SqlAlchemyModelAdmin
from sqlalchemy import select, update

from src.database import new_session
from src.users.models import User
from src.users.utils import verify_password, hash_password


@register(User, sqlalchemy_sessionmaker=new_session)
class UserAdmin(SqlAlchemyModelAdmin):
    """Admin panel configuration for User model."""
    exclude = ("password",)
    list_display = ("id", "full_name", "email", "is_active", "is_superuser", "created_at")
    list_display_links = ("id", "full_name")
    search_fields = ("full_name", "email")
    ordering = ("-created_at",)

    async def authenticate(self, email: str, password: str) -> int | None:
        """Authenticate admin superuser."""
        async with new_session() as session:
            stmt = select(User).where(User.email == email, User.is_superuser == True)
            user = await session.scalar(stmt)
            if user and verify_password(password, user.password):
                return user.id
            return None

    async def orm_save(self, obj: tp.Any) -> None:
        """
        Override default save method to avoid DetachedInstanceError.
        Always update via SQL directly.
        """
        async with new_session() as session:
            values = {
                "full_name": obj.full_name,
                "email": obj.email,
                "is_active": obj.is_active,
                "is_superuser": obj.is_superuser,
                "updated_at": obj.updated_at,
            }
            await session.execute(
                update(User).where(User.id == obj.id).values(**values)
            )
            await session.commit()

    async def change_password(self, id: int, password: str) -> None:
        """Change user password securely."""
        async with new_session() as session:
            hashed = hash_password(password)
            await session.execute(
                update(User).where(User.id == id).values(password=hashed)
            )
            await session.commit()

    async def orm_save_upload_field(self, obj: tp.Any, field: str, base64: str) -> None:
        """Save uploaded field (e.g., avatar)."""
        async with new_session() as session:
            await session.execute(
                update(User).where(User.id == obj.id).values({field: base64})
            )
            await session.commit()

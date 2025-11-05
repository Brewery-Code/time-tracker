from fastadmin import register, SqlAlchemyModelAdmin

from src.database import new_session
from src.employee.models import Employee, WorkPlace


@register(WorkPlace, sqlalchemy_sessionmaker=new_session)
class WorkPlaceAdmin(SqlAlchemyModelAdmin):
    """Admin panel configuration for work places."""
    list_display = ('id', 'title', 'address')
    list_display_links = ('id', 'title')
    search_fields = ('title', 'address')


@register(Employee, sqlalchemy_sessionmaker=new_session)
class EmployeeAdmin(SqlAlchemyModelAdmin):
    """Admin panel configuration for employee model."""
    list_display = ("id", "full_name", "email")
    list_display_links = ("id","full_name")
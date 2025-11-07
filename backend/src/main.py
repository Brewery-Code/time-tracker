from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastadmin import fastapi_app as admin_app
from fastapi.openapi.utils import get_openapi

from src.users.router import router as user_router
from src.employee.router import router as employee_router
from src.security import *
import src.admin


def custom_openapi():
    """
    Custom OpenAPI spec.
    """
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="WorkTime API",
        version="1.0.0",
        description="API for managing employees and work sessions",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "JWT Access Cookie": {
            "type": "apiKey",
            "in": "cookie",
            "name": "access_token",
            "description": "Access token stored in HttpOnly cookie",
        },
        "JWT Refresh Cookie": {
            "type": "apiKey",
            "in": "cookie",
            "name": "refresh_token",
            "description": "Refresh token stored in HttpOnly cookie",
        },
        "Employer Header Token": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
            "description": "Employer token. Format: `token <PERSONAL_TOKEN>`",
        },
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema


# FastAPI app
app = FastAPI()
app.openapi = custom_openapi
app.mount("/admin", admin_app)
app.include_router(user_router)
app.include_router(employee_router)


# CORS Middleware
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app",host="0.0.0.0", port=8000, reload=True)

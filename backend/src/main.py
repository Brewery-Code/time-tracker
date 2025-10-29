from fastapi import FastAPI

from src.users.router import router as user_router


app = FastAPI()
app.include_router(user_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app",host="0.0.0.0", port=8000, reload=True)

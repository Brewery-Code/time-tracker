from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.users.router import router as user_router


app = FastAPI()
app.include_router(user_router)


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

from datetime import timedelta

from authx import AuthX, AuthXConfig


# JWT auth config
config = AuthXConfig(
    JWT_ALGORITHM="HS256",
    JWT_SECRET_KEY="secret_key",
    JWT_TOKEN_LOCATION=["cookies"],
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=5),
    JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=5),
    JWT_COOKIE_SAMESITE="lax",
    JWT_COOKIE_CSRF_PROTECT=False,
)
auth = AuthX(config=config)
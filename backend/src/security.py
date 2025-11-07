from fastapi.security import APIKeyCookie, APIKeyHeader

jwt_access_cookie_scheme = APIKeyCookie(
    name="access_token",
    description="Access JWT stored in HttpOnly cookie",
)

jwt_refresh_cookie_scheme = APIKeyCookie(
    name="refresh_token",
    description="Refresh JWT stored in HttpOnly cookie",
)

employer_header_scheme = APIKeyHeader(
    name="Authorization",
    description="Employer token. Format: `token <PERSONAL_TOKEN>`"
)



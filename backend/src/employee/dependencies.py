from fastapi import Depends, HTTPException, status, Request


async def get_current_employer_token(request: Request) -> str:
    """
    Extract employer token from Authorization header.
    Args:
        request (HTTPRequest): Request object.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("token "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header.",
        )

    token = auth_header.split(" ")[1]
    return token
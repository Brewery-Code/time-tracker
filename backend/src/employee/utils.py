import random
import string

from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_personal_token(personal_token: str) -> str:
    """Return hashed personal token."""
    return pwd_context.hash(personal_token)


def verify_personal_token(plain_personal_token: str, hashed_personal_token: str) -> bool:
    """Return True if plain_personal_token matches hashed_personal_token."""
    return pwd_context.verify(plain_personal_token, hashed_personal_token)


def generate_personal_token(uid: int) -> str:
    """Return random personal token"""
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(20)) + str(uid) + ''.join(random.choice(chars) for _ in range(20))
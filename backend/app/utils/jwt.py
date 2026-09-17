"""Oturum token'i uretimi/dogrulamasi — Node tarafindaki `src/utils/jwt.ts`
karsiligi. Algoritma (HS256), payload alani (`userId`) ve omur (30 gun) ayni
tutuldu; Express backend'inin urettigi token'lar bu backend'de de gecerli.
"""

from datetime import datetime, timedelta, timezone
from typing import TypedDict

import jwt

from app.config import JWT_SECRET

_ALGORITHM = "HS256"
_EXPIRES_IN = timedelta(days=30)


class AuthTokenPayload(TypedDict):
    userId: str


def sign_auth_token(payload: AuthTokenPayload) -> str:
    return jwt.encode(
        {**payload, "exp": datetime.now(timezone.utc) + _EXPIRES_IN},
        JWT_SECRET,
        algorithm=_ALGORITHM,
    )


def verify_auth_token(token: str) -> AuthTokenPayload:
    """Gecersiz/suresi dolmus token'da `jwt.PyJWTError` firlatir."""
    decoded = jwt.decode(token, JWT_SECRET, algorithms=[_ALGORITHM])
    user_id = decoded.get("userId")
    if not isinstance(user_id, str):
        raise jwt.InvalidTokenError("Token payload'inda userId yok.")
    return AuthTokenPayload(userId=user_id)

"""Oturum zorunlulugu — Node tarafindaki `src/middleware/requireAuth.ts`
karsiligi.

FastAPI'nin hazir `HTTPBearer` semasi kullanilmadi: eksik token'da `403` ve
`{ "detail": "Not authenticated" }` donuyor, Express tarafi ise `401` ve
`{ code, message }` donuyordu. Basligi elle okumak sozlesmeyi birebir korur.

Donus degeri dogrudan `user_id` oldugu icin controller'larda Node tarafinda
gereken `if (!req.userId)` savunma kontrolu artik yok — tip sistemi bunu
zaten garanti ediyor.
"""

from typing import Annotated, Optional

import jwt
from fastapi import Depends, Header

from app.middleware.error_handler import ApiError
from app.utils.jwt import verify_auth_token

_BEARER_PREFIX = "Bearer "


def require_auth(authorization: Annotated[Optional[str], Header()] = None) -> str:
    token = (
        authorization[len(_BEARER_PREFIX) :]
        if authorization and authorization.startswith(_BEARER_PREFIX)
        else None
    )

    if not token:
        raise ApiError(401, "UNAUTHORIZED", "Oturum token'i eksik.")

    try:
        payload = verify_auth_token(token)
    except jwt.PyJWTError as error:
        raise ApiError(
            401, "UNAUTHORIZED", "Oturum token'i gecersiz veya suresi dolmus."
        ) from error

    return payload["userId"]


# Route imzalarinda kullanilan kisayol — dogrulanmis kullanicinin id'sini verir.
AuthenticatedUserId = Annotated[str, Depends(require_auth)]

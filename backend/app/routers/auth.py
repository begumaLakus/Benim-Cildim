"""`/api/auth` route tablosu — Node tarafindaki `src/routes/auth.routes.ts`
karsiligi.

Express'te her async handler `asyncHandler` ile sarilmak zorundaydi (yoksa
reddedilen promise hata zincirine hic ulasmiyordu). FastAPI bunu kendisi
yaptigi icin o yardimcinin Python'da karsiligi yok.
"""

from fastapi import APIRouter, status

from app.controllers import auth as auth_controller
from app.db import DbSession
from app.schemas.auth import AuthResponseBody, CredentialsRequest

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/sign-up", response_model=AuthResponseBody, status_code=status.HTTP_201_CREATED)
def sign_up(body: CredentialsRequest, db: DbSession) -> AuthResponseBody:
    return auth_controller.sign_up(db, body)


@router.post("/login", response_model=AuthResponseBody, status_code=status.HTTP_200_OK)
def login(body: CredentialsRequest, db: DbSession) -> AuthResponseBody:
    return auth_controller.login(db, body)

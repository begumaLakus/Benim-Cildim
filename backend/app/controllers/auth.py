"""Kayit/giris is mantigi — Node tarafindaki `src/controllers/auth.controller.ts`
karsiligi."""

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.middleware.error_handler import ApiError
from app.models import User
from app.schemas.auth import AuthResponseBody, AuthUserDto, CredentialsRequest
from app.utils.jwt import AuthTokenPayload, sign_auth_token
from app.utils.password import hash_password, verify_password

_EMAIL_TAKEN = ApiError(409, "EMAIL_TAKEN", "Bu e-posta ile zaten bir hesap var.")

# Kullanici bulunamadi ile sifre yanlis durumlarini KASITLI olarak ayni
# mesajla donuyoruz — hangi e-postalarin kayitli oldugunu disariya
# sizdirmamak icin (user enumeration'a karsi standart onlem).
_INVALID_CREDENTIALS = ApiError(401, "INVALID_CREDENTIALS", "E-posta veya sifre hatali.")


def _session_response(user: User) -> AuthResponseBody:
    token = sign_auth_token(AuthTokenPayload(userId=user.id))
    return AuthResponseBody(token=token, user=AuthUserDto(id=user.id, email=user.email))


def sign_up(db: Session, credentials: CredentialsRequest) -> AuthResponseBody:
    existing_user = db.scalar(select(User).where(User.email == credentials.email))
    if existing_user is not None:
        raise _EMAIL_TAKEN

    user = User(email=credentials.email, password_hash=hash_password(credentials.password))
    db.add(user)

    try:
        db.commit()
    except IntegrityError as error:
        # Kontrol ile INSERT arasinda ayni e-posta ile ikinci bir kayit
        # gelirse benzersiz indeks devreye girer. Express surumu bu yarisi
        # 500 olarak donuyordu; ayni kullanici hatasi oldugu icin burada da
        # 409 donuyoruz.
        db.rollback()
        raise _EMAIL_TAKEN from error

    db.refresh(user)
    return _session_response(user)


def login(db: Session, credentials: CredentialsRequest) -> AuthResponseBody:
    user = db.scalar(select(User).where(User.email == credentials.email))
    if user is None:
        raise _INVALID_CREDENTIALS

    if not verify_password(credentials.password, user.password_hash):
        raise _INVALID_CREDENTIALS

    return _session_response(user)

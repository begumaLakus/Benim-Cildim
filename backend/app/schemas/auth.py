"""RN tarafindaki `src/types/auth.ts` ile birebir eslesecek sekilde
tasarlandi — sozlesme iki tarafta da ayni."""

from typing import Annotated

from pydantic import AfterValidator, BeforeValidator
from pydantic.networks import validate_email

from app.schemas.base import CamelModel, min_length


def _normalize_email(value: object) -> object:
    """Zod'daki `.trim().toLowerCase()` karsiligi — bicim kontrolunden ONCE
    calisir, boylece " Ali@X.COM " degeri de kabul edilip normalize olur."""
    if isinstance(value, str):
        return value.strip().lower()
    return value


def _validate_email_format(value: str) -> str:
    try:
        validate_email(value)
    except Exception as error:  # pydantic PydanticCustomError firlatir
        raise ValueError("Gecerli bir e-posta adresi gir.") from error
    return value


EmailField = Annotated[
    str, BeforeValidator(_normalize_email), AfterValidator(_validate_email_format)
]

# Faz 1'de e-posta dogrulama yok — bu yuzden sifre kurallari en azindan kaba
# kuvvet saldirilarina karsi makul bir taban cizgisi olsun diye 8 karakter
# zorunlu tutuluyor.
PasswordField = Annotated[str, AfterValidator(min_length(8, "Sifre en az 8 karakter olmali."))]


class CredentialsRequest(CamelModel):
    email: EmailField
    password: PasswordField


class AuthUserDto(CamelModel):
    id: str
    email: str


class AuthResponseBody(CamelModel):
    token: str
    user: AuthUserDto


class ApiErrorBody(CamelModel):
    code: str
    message: str

"""Hata sozlesmesi — Node tarafindaki `src/middleware/errorHandler.ts` ve
`src/utils/zodError.ts` burada birlesti.

RN istemcisi HER hatayi `{ code, message }` govdesi olarak okuyor
(`src/services/httpClient.ts`). FastAPI'nin varsayilanlari bu bicimde DEGIL —
dogrulama hatasi `422` + `{ "detail": [...] }`, bilinmeyen route `404` +
`{ "detail": "Not Found" }` doner. Asagidaki isleyiciler hepsini Express
backend'inin dondugu bicime geri cekiyor.
"""

import logging
from typing import Any, Optional

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("benim-cildim")


class ApiError(Exception):
    """Controller'larin bilincli olarak dondugu hata — durum kodu ve
    `{ code, message }` govdesini birlikte tasir."""

    def __init__(self, status_code: int, code: str, message: str) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message


def _error_response(status_code: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"code": code, "message": message})


def _first_issue_message(errors: list[dict[str, Any]]) -> str:
    """Dogrulama hatasinin ILK sorununu insan okunur mesaja cevirir.

    Pydantic, `ValueError` mesajlarini "Value error, ..." onekiyle sarar;
    orijinal metin `ctx["error"]` icinde durdugu icin oradan okuyoruz —
    boylece istemci Zod'un dondugu Turkce mesajin aynisini gorur.
    """
    if not errors:
        return "Gecersiz istek."

    first = errors[0]
    context = first.get("ctx") or {}
    raw_error = context.get("error")
    if raw_error is not None:
        return str(raw_error)
    message = first.get("msg")
    return str(message) if message else "Gecersiz istek."


def _is_invalid_json(errors: list[dict[str, Any]]) -> bool:
    """Govde hic JSON olarak ayristirilamadiginda Pydantic `json_invalid`
    tipinde tek bir sorun uretir — istemcinin 500 yerine dogru 400 gormesi
    icin bunu ayri bir koda ayiriyoruz."""
    return any(error.get("type") == "json_invalid" for error in errors)


async def api_error_handler(_request: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, ApiError)
    return _error_response(exc.status_code, exc.code, exc.message)


async def validation_error_handler(_request: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, RequestValidationError)
    errors: list[dict[str, Any]] = list(exc.errors())

    if _is_invalid_json(errors):
        return _error_response(400, "INVALID_JSON", "Istek govdesi gecerli bir JSON degil.")

    return _error_response(400, "VALIDATION_ERROR", _first_issue_message(errors))


async def http_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
    """Starlette'in kendi urettigi HTTP hatalari (eslesmeyen route, yanlis
    metot) icin `{ code, message }` zarfini korur. Express tarafinda bilinmeyen
    route'u yakalayan son middleware'in karsiligi."""
    assert isinstance(exc, StarletteHTTPException)
    if exc.status_code == 404:
        return _error_response(404, "NOT_FOUND", "Route bulunamadi.")
    if exc.status_code == 405:
        return _error_response(405, "METHOD_NOT_ALLOWED", "Bu route bu metodu desteklemiyor.")

    detail: Optional[str] = exc.detail if isinstance(exc.detail, str) else None
    return _error_response(exc.status_code, "HTTP_ERROR", detail or "Istek islenemedi.")


async def unhandled_error_handler(_request: Request, exc: Exception) -> JSONResponse:
    """Son savunma hatti: controller'larda yakalanmayan (beklenmeyen) hatalari
    500 olarak doner, konsola loglar. Hata detayini istemciye ASLA sizdirmaz."""
    logger.exception("Beklenmeyen sunucu hatasi:", exc_info=exc)
    return _error_response(500, "INTERNAL_ERROR", "Beklenmeyen bir hata olustu.")


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(ApiError, api_error_handler)
    app.add_exception_handler(RequestValidationError, validation_error_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, unhandled_error_handler)

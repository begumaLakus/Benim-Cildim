"""Gunluk rutin tik atma sozlesmesi — RN'deki `src/types/api.ts` ile elle
senkron. `date`, kullanicinin YEREL gun anahtari ("YYYY-MM-DD"), sunucunun
UTC gunu degil."""

import re
from typing import Annotated

from pydantic import AfterValidator

from app.schemas.base import CamelModel, trim_non_empty

_DATE_KEY_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
_DATE_KEY_MESSAGE = "date 'YYYY-MM-DD' formatinda olmali."


def _validate_date_key(value: str) -> str:
    if not _DATE_KEY_PATTERN.match(value):
        raise ValueError(_DATE_KEY_MESSAGE)
    return value


DateKeyField = Annotated[str, AfterValidator(_validate_date_key)]


class RoutineProgressResponseBody(CamelModel):
    date: str
    completed_step_ids: list[str]


class ToggleRoutineProgressRequestBody(CamelModel):
    date: DateKeyField
    step_id: Annotated[str, AfterValidator(trim_non_empty("stepId gerekli."))]

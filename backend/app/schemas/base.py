"""Sema temelleri.

RN tarafi camelCase bekliyor, Python tarafi snake_case yaziyor: `CamelModel`
iki bicim arasindaki cevrimi alias uretici ile yapiyor, boylece tel uzerindeki
govde Express backend'i ile birebir ayni kaliyor.

Asagidaki uc uretici, Node tarafindaki Zod zincirlerinin ("`.trim().min(1, ...)`")
karsiligi. Mesajlar Zod semalarindan HARFI HARFINE kopyalandi — RN ekranlari
bu mesajlari kullaniciya dogrudan gosteriyor, bu yuzden Pydantic'in Ingilizce
varsayilan metinleri kullanilamaz.
"""

from typing import Callable

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """camelCase alias'li temel model. `extra="ignore"`, Zod'un varsayilan
    nesne davranisiyla ayni: bilinmeyen alanlar hata degil, sessizce atilir."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        extra="ignore",
    )


def trim_non_empty(message: str) -> Callable[[str], str]:
    """Zod'daki `.trim().min(1, message)` karsiligi — degeri KIRPARAK dondurur."""

    def validate(value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError(message)
        return trimmed

    return validate


def min_length(minimum: int, message: str) -> Callable[[str], str]:
    """Zod'daki `.min(n, message)` karsiligi — kirpma YAPMAZ (sifre alani icin)."""

    def validate(value: str) -> str:
        if len(value) < minimum:
            raise ValueError(message)
        return value

    return validate


def min_value(minimum: int, message: str) -> Callable[[int], int]:
    """Zod'daki `.min(n, message)` sayisal karsiligi."""

    def validate(value: int) -> int:
        if value < minimum:
            raise ValueError(message)
        return value

    return validate

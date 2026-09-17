"""Zaman yardimcilari.

Node tarafi tarihleri `Date.prototype.toISOString()` ile donuyordu
(`2026-09-17T10:23:45.123Z`). Python'un `datetime.isoformat()`'i mikrosaniye
uretir ve 'Z' eki koymaz; RN'in `new Date(...)` ile ayni degeri okumasi icin
bicimi burada elle esitliyoruz.
"""

from datetime import datetime, timezone


def utcnow() -> datetime:
    """Naive (tz bilgisiz) UTC zamani — SQLite kolonlarinda saklanan bicim."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def to_iso_z(value: datetime) -> str:
    """`Date.toISOString()` ile ayni cikti: milisaniye hassasiyeti + 'Z' eki."""
    if value.tzinfo is not None:
        value = value.astimezone(timezone.utc).replace(tzinfo=None)
    return f"{value.strftime('%Y-%m-%dT%H:%M:%S')}.{value.microsecond // 1000:03d}Z"

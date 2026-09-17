"""Prisma'nin `@default(cuid())` fonksiyonunun Python karsiligi.

Mevcut `dev.db` satirlari cuid formatinda id tasiyor; ayni formati uretmek
tablodaki id'lerin tek tip kalmasini sagliyor. Id'ler istemci icin tamamen
opak — format yalnizca veritabani tutarliligi icin korunuyor.

Format (cuid v1, 25 karakter): 'c' + zaman damgasi + sayac + parmak izi + rastgele
"""

import os
import secrets
import threading
import time

_BLOCK_SIZE = 4
_BASE = 36
_DISCRETE_VALUES = _BASE**_BLOCK_SIZE

_counter = 0
_counter_lock = threading.Lock()


def _to_base36(value: int) -> str:
    if value == 0:
        return "0"
    digits = "0123456789abcdefghijklmnopqrstuvwxyz"
    out = ""
    while value > 0:
        value, remainder = divmod(value, _BASE)
        out = digits[remainder] + out
    return out


def _pad(value: str, size: int) -> str:
    return value.rjust(size, "0")[-size:]


def _next_counter() -> int:
    """Ayni milisaniye icinde uretilen id'leri ayirir; surec basina donguseldir."""
    global _counter
    with _counter_lock:
        current = _counter
        _counter = (_counter + 1) % _DISCRETE_VALUES
    return current


def _fingerprint() -> str:
    """Surec kimligi + makine adindan tureyen, surec omru boyunca sabit blok."""
    pid = _to_base36(os.getpid())
    hostname = os.uname().nodename
    host_value = len(hostname) + _BASE + sum(ord(char) for char in hostname)
    return _pad(pid, 2)[-2:] + _pad(_to_base36(host_value), 2)[-2:]


_FINGERPRINT = _fingerprint()


def cuid() -> str:
    timestamp = _to_base36(int(time.time() * 1000))
    counter = _pad(_to_base36(_next_counter()), _BLOCK_SIZE)
    random_block = _pad(_to_base36(secrets.randbelow(_DISCRETE_VALUES)), _BLOCK_SIZE) + _pad(
        _to_base36(secrets.randbelow(_DISCRETE_VALUES)), _BLOCK_SIZE
    )
    return f"c{timestamp}{counter}{_FINGERPRINT}{random_block}"

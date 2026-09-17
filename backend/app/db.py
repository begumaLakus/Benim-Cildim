"""Veritabani baglantisi — Node tarafindaki `src/db.ts` karsiligi.

Prisma Client yerine SQLAlchemy 2.0 kullaniliyor; tablo/kolon isimleri
`app/models.py`'de Prisma semasiyla birebir ayni tutuldugu icin ayni
`dev.db` dosyasi iki tarafta da okunabilir.

Oturumlar SENKRON: SQLite tek dosya uzerinde calisiyor ve `bcrypt` CPU-bound.
FastAPI senkron route fonksiyonlarini zaten bir threadpool'da calistirdigi
icin bu, event loop'u bloklamayan en basit dogru kurulum.
"""

import sqlite3
from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import DATABASE_URL

# `check_same_thread=False`: FastAPI senkron handler'lari farkli threadlerde
# calistirir, SQLite'in varsayilan tek-thread kisiti buna izin vermezdi.
engine: Engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    future=True,
)


@event.listens_for(engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection: object, _connection_record: object) -> None:
    """SQLite yabanci anahtar kontrolunu her baglantida acar.

    SQLite'ta bu PRAGMA VARSAYILAN OLARAK KAPALIDIR; Prisma kendi
    baglantilarinda aciyordu. Acik olmasa silinmis bir kullaniciya ait
    `userId` sessizce yazilir ve `RoutineHistory` yetim satirlar biriktirirdi
    (bkz. `app/controllers/routine_history.py` icindeki 401 dalisi).
    """
    if isinstance(dbapi_connection, sqlite3.Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_db() -> Iterator[Session]:
    """FastAPI bagimliligi: istek basina bir oturum acar, sonunda kapatir."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Route imzalarinda kullanilan kisayol. `Depends()`'i varsayilan deger olarak
# yazmak yerine `Annotated` icine koymak FastAPI'nin guncel onerisi.
DbSession = Annotated[Session, Depends(get_db)]

"""Veri modeli — Node tarafindaki `prisma/schema.prisma` karsiligi.

Tablo ve kolon isimleri Prisma'nin urettigi semayla BIREBIR ayni tutuldu
(`User`, `RoutineHistory`, `RoutineProgress`; kolonlar camelCase). Boylece
Prisma ile olusturulmus mevcut `dev.db` dosyasi bu backend'de de sifir
donusumle calismaya devam eder.
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.utils.cuid import cuid
from app.utils.datetime_utils import utcnow


class Base(DeclarativeBase):
    pass


class User(Base):
    """Faz 1 auth: e-posta + sifre. E-posta dogrulama alani kasitli olarak yok
    (dogrulama Faz 1 kapsami disi birakildi)."""

    __tablename__ = "User"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=cuid)
    email: Mapped[str] = mapped_column(String, nullable=False)
    password_hash: Mapped[str] = mapped_column("passwordHash", String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime, nullable=False, default=utcnow
    )

    routine_history: Mapped[list["RoutineHistory"]] = relationship(back_populates="user")
    routine_progress: Mapped[list["RoutineProgress"]] = relationship(back_populates="user")


# Prisma'nin `@unique` alani icin urettigi indeksin ADIYLA ayni — ayni DDL,
# ayni dosya. `UniqueConstraint` yerine `Index` kullanilmasinin nedeni bu.
Index("User_email_key", User.email, unique=True)


class RoutineHistory(Base):
    """Kullanicinin hesaba baglanmis her anket+rutin sonucu.

    Anket cevaplari ve rutin onerisi JSON string olarak saklaniyor —
    semalari RN tarafindaki QuestionnaireAnswers / RoutineRecommendationResponse
    tipleriyle birebir eslesiyor (`src/types/api.ts`, `src/types/domain.ts`).
    """

    __tablename__ = "RoutineHistory"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=cuid)
    user_id: Mapped[str] = mapped_column(
        "userId",
        String,
        ForeignKey(
            "User.id",
            name="RoutineHistory_userId_fkey",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )
    answers_json: Mapped[str] = mapped_column("answersJson", Text, nullable=False)
    routine_json: Mapped[str] = mapped_column("routineJson", Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        "createdAt", DateTime, nullable=False, default=utcnow
    )

    user: Mapped[User] = relationship(back_populates="routine_history")


class RoutineProgress(Base):
    """Gunluk rutin tik atma durumu.

    `date` bilerek kullanicinin YEREL gun anahtari olarak RN tarafindan
    gonderiliyor ("YYYY-MM-DD") — sunucu UTC gunu kullanirsa gece yarisina
    yakin kullanicilarda yanlis gune yazabilirdi. `stepId`, rutin JSON'u
    icindeki adim id'sine (orn. "am-cleanser") referans verir — ayri bir
    RoutineStep tablosu olmadigi icin gercek bir foreign key DEGIL, sadece
    esleme amacli bir string. Benzersiz indeks ayni gun+adim icin ikinci bir
    satir olusmasini (cift POST/toggle race'i) engelliyor.
    """

    __tablename__ = "RoutineProgress"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=cuid)
    user_id: Mapped[str] = mapped_column(
        "userId",
        String,
        ForeignKey(
            "User.id",
            name="RoutineProgress_userId_fkey",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
    )
    date: Mapped[str] = mapped_column(String, nullable=False)
    step_id: Mapped[str] = mapped_column("stepId", String, nullable=False)
    completed_at: Mapped[datetime] = mapped_column(
        "completedAt", DateTime, nullable=False, default=utcnow
    )

    user: Mapped[User] = relationship(back_populates="routine_progress")


Index(
    "RoutineProgress_userId_date_stepId_key",
    RoutineProgress.user_id,
    RoutineProgress.date,
    RoutineProgress.step_id,
    unique=True,
)

__all__ = ["Base", "RoutineHistory", "RoutineProgress", "User"]

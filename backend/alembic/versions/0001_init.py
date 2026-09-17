"""Baslangic semasi — Prisma migration'larinin birlestirilmis karsiligi.

Node tarafindaki iki Prisma migration'i (`20260908073841_init` ve
`20260908145008_add_routine_progress`) burada TEK bir temel surume
sikistirildi: migration araci degistiginde yeni araca temiz bir taban
vermek standart yaklasim, eski adimlarin Prisma'ya ozgu gecmisini
tasimanin bir faydasi yok.

Uretilen DDL, Prisma'nin urettigiyle birebir ayni (tablo adlari, camelCase
kolonlar, yabanci anahtar ve benzersiz indeks adlari dahil) — bu yuzden
Prisma ile olusturulmus mevcut bir `dev.db` dosyasi `alembic stamp head`
ile oldugu gibi devralinabilir, yeniden olusturulmasi gerekmez.

Revision ID: 251bcfc0f27a
Revises:
Create Date: 2026-09-17
"""

from collections.abc import Sequence
from typing import Union

import sqlalchemy as sa

from alembic import op

revision: str = "251bcfc0f27a"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "User",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("passwordHash", sa.String(), nullable=False),
        sa.Column("createdAt", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("User_email_key", "User", ["email"], unique=True)

    op.create_table(
        "RoutineHistory",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("userId", sa.String(), nullable=False),
        sa.Column("answersJson", sa.Text(), nullable=False),
        sa.Column("routineJson", sa.Text(), nullable=False),
        sa.Column("createdAt", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["userId"],
            ["User.id"],
            name="RoutineHistory_userId_fkey",
            onupdate="CASCADE",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "RoutineProgress",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("userId", sa.String(), nullable=False),
        sa.Column("date", sa.String(), nullable=False),
        sa.Column("stepId", sa.String(), nullable=False),
        sa.Column("completedAt", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["userId"],
            ["User.id"],
            name="RoutineProgress_userId_fkey",
            onupdate="CASCADE",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "RoutineProgress_userId_date_stepId_key",
        "RoutineProgress",
        ["userId", "date", "stepId"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index("RoutineProgress_userId_date_stepId_key", table_name="RoutineProgress")
    op.drop_table("RoutineProgress")
    op.drop_table("RoutineHistory")
    op.drop_index("User_email_key", table_name="User")
    op.drop_table("User")

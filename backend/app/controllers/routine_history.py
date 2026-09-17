"""Rutin gecmisi is mantigi — Node tarafindaki
`src/controllers/routineHistory.controller.ts` karsiligi."""

import json

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.middleware.error_handler import ApiError
from app.models import RoutineHistory
from app.schemas.routine_history import (
    CreateRoutineHistoryRequestBody,
    LatestRoutineHistoryResponseBody,
    QuestionnaireAnswersDto,
    RoutineHistoryResponseBody,
    RoutinePlanDto,
    SkinSummaryDto,
)
from app.utils.datetime_utils import to_iso_z


def _is_foreign_key_violation(error: IntegrityError) -> bool:
    """SQLite yabanci anahtar ihlalini digerlerinden (orn. benzersiz indeks)
    ayirir — Prisma tarafindaki `P2003` hata kodunun karsiligi."""
    return "FOREIGN KEY constraint failed" in str(error.orig)


def create_routine_history(
    db: Session, user_id: str, body: CreateRoutineHistoryRequestBody
) -> RoutineHistoryResponseBody:
    """Misafirken toplanan anket cevaplarini/rutin onerisini hesaba kalici
    olarak baglar."""
    record = RoutineHistory(
        user_id=user_id,
        answers_json=json.dumps(body.answers.model_dump(by_alias=True)),
        routine_json=json.dumps(body.routine.model_dump(by_alias=True)),
    )
    db.add(record)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        # Token gecerli ama arkasindaki kullanici artik veritabaninda yok
        # (orn. hesap silinmis). Bunu genel hata isleyicisine (500) birakmak
        # yerine acikca 401 donuyoruz.
        if _is_foreign_key_violation(error):
            raise ApiError(
                401,
                "UNAUTHORIZED",
                "Oturum token'i gecersiz veya hesap artik mevcut degil.",
            ) from error
        raise

    db.refresh(record)
    return RoutineHistoryResponseBody(id=record.id, created_at=to_iso_z(record.created_at))


def get_latest_routine_history(db: Session, user_id: str) -> LatestRoutineHistoryResponseBody:
    """En son kaydedilen rutini doner. Kayit yoksa 404 doner; bu beklenen bir
    durum, hata degil — RN tarafi 404'u `null` olarak okuyor."""
    record = db.scalar(
        select(RoutineHistory)
        .where(RoutineHistory.user_id == user_id)
        .order_by(RoutineHistory.created_at.desc())
        .limit(1)
    )

    if record is None:
        raise ApiError(404, "NOT_FOUND", "Henuz kayitli bir rutin bulunamadi.")

    # Iki JSON kolonu da yazilirken dogrulanmisti; okurken tekrar semadan
    # geciriyoruz ki bozuk bir satir sessizce istemciye akmasin.
    answers = QuestionnaireAnswersDto.model_validate(json.loads(record.answers_json))
    routine = RoutinePlanDto.model_validate(json.loads(record.routine_json))

    return LatestRoutineHistoryResponseBody(
        routine=routine,
        product_suggestion=None,
        generated_at=to_iso_z(record.created_at),
        skin_summary=SkinSummaryDto(skin_type=answers.skin_type, concerns=answers.concerns),
    )

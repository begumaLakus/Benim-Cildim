"""Gunluk rutin ilerlemesi is mantigi — Node tarafindaki
`src/controllers/routineProgress.controller.ts` karsiligi."""


from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import RoutineProgress
from app.schemas.routine_progress import (
    RoutineProgressResponseBody,
    ToggleRoutineProgressRequestBody,
)


def _completed_step_ids(db: Session, user_id: str, date: str) -> list[str]:
    return list(
        db.scalars(
            select(RoutineProgress.step_id).where(
                RoutineProgress.user_id == user_id, RoutineProgress.date == date
            )
        )
    )


def get_routine_progress(db: Session, user_id: str, date: str) -> RoutineProgressResponseBody:
    """O gun icin isaretli adim id'lerini doner. Hic isaretleme yoksa BOS DIZI
    doner, 404 degil."""
    return RoutineProgressResponseBody(
        date=date, completed_step_ids=_completed_step_ids(db, user_id, date)
    )


def toggle_routine_progress(
    db: Session, user_id: str, body: ToggleRoutineProgressRequestBody
) -> RoutineProgressResponseBody:
    """(date, stepId) ikilisini isaretler/kaldirir (tersine cevirir) ve o gun
    icin guncel tam listeyi doner."""
    date = body.date
    step_id = body.step_id

    existing = db.scalar(
        select(RoutineProgress).where(
            RoutineProgress.user_id == user_id,
            RoutineProgress.date == date,
            RoutineProgress.step_id == step_id,
        )
    )

    if existing is not None:
        db.delete(existing)
    else:
        db.add(RoutineProgress(user_id=user_id, date=date, step_id=step_id))

    db.commit()

    return RoutineProgressResponseBody(
        date=date, completed_step_ids=_completed_step_ids(db, user_id, date)
    )

"""`/api/routine-progress` route tablosu — Node tarafindaki
`src/routes/routineProgress.routes.ts` karsiligi."""

from typing import Annotated

from fastapi import APIRouter, Query, status

from app.controllers import routine_progress as routine_progress_controller
from app.db import DbSession
from app.middleware.require_auth import AuthenticatedUserId
from app.schemas.routine_progress import (
    DateKeyField,
    RoutineProgressResponseBody,
    ToggleRoutineProgressRequestBody,
)

router = APIRouter(prefix="/api/routine-progress", tags=["routine-progress"])


@router.get("", response_model=RoutineProgressResponseBody, status_code=status.HTTP_200_OK)
def get_routine_progress(
    date: Annotated[DateKeyField, Query(description="Kullanicinin yerel gun anahtari.")],
    user_id: AuthenticatedUserId,
    db: DbSession,
) -> RoutineProgressResponseBody:
    return routine_progress_controller.get_routine_progress(db, user_id, date)


@router.post("/toggle", response_model=RoutineProgressResponseBody, status_code=status.HTTP_200_OK)
def toggle_routine_progress(
    body: ToggleRoutineProgressRequestBody,
    user_id: AuthenticatedUserId,
    db: DbSession,
) -> RoutineProgressResponseBody:
    return routine_progress_controller.toggle_routine_progress(db, user_id, body)

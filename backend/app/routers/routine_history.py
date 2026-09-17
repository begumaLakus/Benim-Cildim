"""`/api/routine-history` route tablosu — Node tarafindaki
`src/routes/routineHistory.routes.ts` karsiligi."""

from fastapi import APIRouter, status

from app.controllers import routine_history as routine_history_controller
from app.db import DbSession
from app.middleware.require_auth import AuthenticatedUserId
from app.schemas.routine_history import (
    CreateRoutineHistoryRequestBody,
    LatestRoutineHistoryResponseBody,
    RoutineHistoryResponseBody,
)

router = APIRouter(prefix="/api/routine-history", tags=["routine-history"])


@router.post("", response_model=RoutineHistoryResponseBody, status_code=status.HTTP_201_CREATED)
def create_routine_history(
    body: CreateRoutineHistoryRequestBody,
    user_id: AuthenticatedUserId,
    db: DbSession,
) -> RoutineHistoryResponseBody:
    return routine_history_controller.create_routine_history(db, user_id, body)


@router.get(
    "/latest",
    response_model=LatestRoutineHistoryResponseBody,
    status_code=status.HTTP_200_OK,
)
def get_latest_routine_history(
    user_id: AuthenticatedUserId,
    db: DbSession,
) -> LatestRoutineHistoryResponseBody:
    return routine_history_controller.get_latest_routine_history(db, user_id)

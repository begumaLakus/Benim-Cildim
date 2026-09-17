"""Uygulama kurulumu ve sunucu girisi — Node tarafindaki `src/app.ts` ve
`src/index.ts` burada birlesti.

Calistirmak icin:  uvicorn app.main:app --reload --port 3000
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import PORT
from app.middleware.error_handler import register_error_handlers
from app.routers import auth as auth_router
from app.routers import routine_history as routine_history_router
from app.routers import routine_progress as routine_progress_router

logging.basicConfig(level=logging.INFO)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Benim Cildim API",
        description="Faz 1 auth ve rutin gecmisi backend'i (FastAPI + SQLAlchemy + SQLite).",
        version="1.0.0",
    )

    # Express tarafindaki `cors()` varsayilaninin aynisi: tum kaynaklara acik,
    # cerez/kimlik bilgisi tasimiyor. Oturum `Authorization` basligiyla
    # tasindigi icin `allow_credentials`'a ihtiyac yok.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health", tags=["health"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(auth_router.router)
    app.include_router(routine_history_router.router)
    app.include_router(routine_progress_router.router)

    # Bilinmeyen route ve beklenmeyen hatalar dahil TUM hatalari RN'in
    # bekledigi `{ code, message }` govdesine cevirir.
    register_error_handlers(app)

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)

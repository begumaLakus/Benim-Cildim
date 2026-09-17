"""Ortam degiskenlerinin tek okuma noktasi (Node tarafindaki `src/index.ts`
icindeki `dotenv.config()` + `src/utils/jwt.ts` icindeki JWT_SECRET kontrolu
burada birlesti).

Node tarafinda `dotenv.config()`'in diger import'lardan ONCE calismasi elle
saglanmak zorundaydi; burada .env yuklemesi bu modulun import'una bagli ve
JWT_SECRET'e erisen her modul bu modulu import ettigi icin sira kendiliginden
dogru kuruluyor.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


def _require(name: str) -> str:
    value = os.getenv(name)
    if not value:
        # Sunucu ayaga kalkarken hemen patlar — yanlislikla secretsiz calismayi
        # engeller (uretimde sessizce zayif/varsayilan bir secret kullanmaktan
        # cok daha iyi).
        raise RuntimeError(f"{name} ortam degiskeni tanimli degil — .env dosyasini kontrol et.")
    return value


# SQLite dosya yolu .env'de gorece verildiginde (`sqlite:///./dev.db`) surecin
# calisma dizinine gore cozulurdu; `backend/` disindan baslatildiginda yanlis
# dosyayi acmamak icin proje kokune sabitliyoruz.
def _resolve_database_url() -> str:
    raw = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
    prefix = "sqlite:///./"
    if raw.startswith(prefix):
        return f"sqlite:///{BASE_DIR / raw[len(prefix):]}"
    return raw


DATABASE_URL: str = _resolve_database_url()
JWT_SECRET: str = _require("JWT_SECRET")
PORT: int = int(os.getenv("PORT", "3000"))

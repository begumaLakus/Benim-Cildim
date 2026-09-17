# Benim Cildim

Kullanıcının fotoğrafı ve/veya anket cevaplarından yola çıkarak kişiselleştirilmiş
sabah/akşam cilt bakım rutini öneren mobil uygulama. Faz 1 kapsamı içerik/aktif
madde bazlı önerilerle sınırlı (marka önerilmiyor); mimari, ileride bir güzellik
merkezinin ürün kataloğunun eklenmesine açık tasarlandı (bkz. `docs/adr.md`).

## Stack

React Native + TypeScript (strict) · Expo (Expo Go, Faz 1) · Expo Router ·
Zustand · Python/FastAPI + SQLAlchemy/SQLite backend (`backend/`, ayrı bir
`pyproject.toml`'u olan bağımsız paket — bkz. aşağı).

## Başlarken

```bash
npm install
cp .env.example .env   # gerekirse EXPO_PUBLIC_API_BASE_URL'i düzenle
npm start
```

Açılan QR kodu telefondaki **Expo Go** uygulamasıyla okut.

## Backend'i çalıştırma (`backend/`)

Python 3.9 veya üzeri gerekir; SQLite ek bir kurulum istemez.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # JWT_SECRET'i istersen değiştir
alembic upgrade head   # tabloları oluşturur (Prisma Migrate'in karşılığı)
uvicorn app.main:app --reload --port 3000
```

`http://localhost:3000/api/health` 200 dönüyorsa backend ayakta demektir.
Etkileşimli API dokümanı (FastAPI'nin ürettiği Swagger arayüzü)
`http://localhost:3000/docs` adresinde.

Şu an `/api/auth/sign-up`, `/api/auth/login`, (giriş yapmış kullanıcılar için,
`Authorization: Bearer <token>`) `POST /api/routine-history`,
`GET /api/routine-history/latest`, `GET /api/routine-progress` ve
`POST /api/routine-progress/toggle` uçları var (bkz. ADR-009, ADR-011, ADR-012,
ADR-016). Onboarding/anket/rutin önerisi ucu (`/api/onboarding`) henüz
backend'de yok — `src/services/mockApi.ts` bunun için hâlâ kullanılıyor.

Elinde Prisma ile oluşturulmuş eski bir `dev.db` varsa: tablo ve kolon adları
birebir aynı kaldığı için `alembic stamp head` ile olduğu gibi devralınabilir,
yeniden oluşturmak gerekmez.

## Durum

Faz 1 iskeleti kuruldu: onboarding (KVKK rızası), kamera, anket, bekleme ve
sonuç ekranları uçtan uca çalışıyor. Auth (e-posta+şifre, kayıt/giriş) ve ana
uygulama iskeleti (4 sekmeli tab bar) ADR-009 ile kararlaştırıldı,
geliştirmesi sürüyor.

Mimari kararlar ve gerekçeleri için `docs/adr.md` dosyasına bakın.

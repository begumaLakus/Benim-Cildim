# Benim Cildim

Kullanıcının fotoğrafı ve/veya anket cevaplarından yola çıkarak kişiselleştirilmiş
sabah/akşam cilt bakım rutini öneren mobil uygulama. Faz 1 kapsamı içerik/aktif
madde bazlı önerilerle sınırlı (marka önerilmiyor); mimari, ileride bir güzellik
merkezinin ürün kataloğunun eklenmesine açık tasarlandı (bkz. `docs/adr.md`).

## Stack

React Native + TypeScript (strict) · Expo (Expo Go, Faz 1) · Expo Router ·
Zustand · Node.js/Express + Prisma/SQLite backend (`backend/`, ayrı bir
`package.json`'ı olan bağımsız paket — bkz. aşağı).

## Başlarken

```bash
npm install
cp .env.example .env   # gerekirse EXPO_PUBLIC_API_BASE_URL'i düzenle
npm start
```

Açılan QR kodu telefondaki **Expo Go** uygulamasıyla okut.

## Backend'i çalıştırma (`backend/`)

```bash
cd backend
npm install
cp .env.example .env   # JWT_SECRET'i istersen değiştir, SQLite ek kurulum istemez
npx prisma migrate dev --name init
npm run dev
```

`http://localhost:3000/api/health` 200 dönüyorsa backend ayakta demektir.
Şu an `/api/auth/sign-up`, `/api/auth/login`, (giriş yapmış kullanıcılar için,
`Authorization: Bearer <token>`) `POST /api/routine-history` ve
`GET /api/routine-history/latest` uçları var (bkz. ADR-009, ADR-011, ADR-012).
Onboarding/anket/rutin önerisi ucu (`/api/onboarding`) henüz backend'de yok —
`src/services/mockApi.ts` bunun için hâlâ kullanılıyor.

## Durum

Faz 1 iskeleti kuruldu: onboarding (KVKK rızası), kamera, anket, bekleme ve
sonuç ekranları uçtan uca çalışıyor. Auth (e-posta+şifre, kayıt/giriş) ve ana
uygulama iskeleti (4 sekmeli tab bar) ADR-009 ile kararlaştırıldı,
geliştirmesi sürüyor.

Mimari kararlar ve gerekçeleri için `docs/adr.md` dosyasına bakın.

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
`Authorization: Bearer <token>`) `POST /api/routine-history`,
`GET /api/routine-history/latest`, `GET /api/routine-progress` ve
`POST /api/routine-progress/toggle` uçları var (bkz. ADR-009, ADR-011, ADR-012).
Onboarding/anket/rutin önerisi ucu (`/api/onboarding`) ve şifre sıfırlama ucu
(`/api/auth/forgot-password`) henüz backend'de yok — ilki için
`src/services/mockApi.ts` hâlâ kullanılıyor, ikincisi frontend'de hazır
(`src/services/authApi.ts` — sözleşme: `POST /api/auth/forgot-password`
body `{ email }` → 200 `{ message }`) ama uç eklenene kadar 404 döner.

## Gerçek cihazda test etme

Simülatör/emülatörde `.env`'e dokunmana gerek yok. **Gerçek telefonda** Expo
Go ile test ederken `localhost` telefonun kendisine işaret eder — bu yüzden
`src/services/httpClient.ts`, telefonun Expo Go ile bağlandığı Metro
sunucusunun LAN IP'sini otomatik algılayıp backend adresini oradan türetir
(bilgisayar ve telefon aynı Wi-Fi'daysa `.env`'de `EXPO_PUBLIC_API_BASE_URL`
satırını yorumda bırakman yeterli). Otomatik algılama işe yaramazsa (farklı
ağdaysanız, ofis Wi-Fi'ı cihazlar arası trafiği engelliyorsa) `.env.example`
içindeki iki alternatifi (yerel ağ IP'sini elle girme veya `ngrok http 3000`
tüneli) kullan. Windows'ta backend'e telefon bağlanamıyorsa Windows Defender
Güvenlik Duvarı'nın Node.js için sorduğu izni onayladığından emin ol.

## Durum

Faz 1 iskeleti kuruldu: onboarding (KVKK rızası), kamera, anket, bekleme ve
sonuç ekranları uçtan uca çalışıyor. Auth (e-posta+şifre, kayıt/giriş) ve ana
uygulama iskeleti (4 sekmeli tab bar) ADR-009 ile kararlaştırıldı,
geliştirmesi sürüyor.

Mimari kararlar ve gerekçeleri için `docs/adr.md` dosyasına bakın.

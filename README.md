# Benim Cildim

Kullanıcının fotoğrafı ve/veya anket cevaplarından yola çıkarak kişiselleştirilmiş
sabah/akşam cilt bakım rutini öneren mobil uygulama. Faz 1 kapsamı içerik/aktif
madde bazlı önerilerle sınırlı (marka önerilmiyor); mimari, ileride bir güzellik
merkezinin ürün kataloğunun eklenmesine açık tasarlandı (bkz. `docs/adr.md`).

## Stack

React Native + TypeScript (strict) · Expo (Expo Go, Faz 1) · Expo Router ·
Zustand · Node.js/Express backend (henüz ayrı repo olarak yok — bkz. aşağı).

## Başlarken

```bash
npm install
cp .env.example .env   # gerekirse EXPO_PUBLIC_API_BASE_URL'i düzenle
npm start
```

Açılan QR kodu telefondaki **Expo Go** uygulamasıyla okut.

## Durum

Faz 1 iskeleti kuruldu: onboarding (KVKK rızası + cinsiyet seçimi), kamera,
anket, bekleme ve sonuç ekranları uçtan uca çalışıyor. Express backend'i henüz
yok — `src/services/mockApi.ts`, gerçek API ile aynı sözleşmeyi kullanan sahte
gecikmeli bir yanıt üretiyor.

Mimari kararlar ve gerekçeleri için `docs/adr.md` dosyasına bakın.

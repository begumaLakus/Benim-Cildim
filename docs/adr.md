# Mimari Karar Kayıtları (ADR)

Bu dosya, projenin kilitlenmiş mimari kararlarını ve sonradan alınan
teknik kararları ADR formatında tutar. Yeni bir mimari karar alındığında
buraya yeni bir madde eklenir; var olan kararlar silinmez, gerekirse
"Durum: değiştirildi, bkz. ADR-00X" notuyla güncellenir.

---

## ADR-001: Teknoloji yığını

**Durum:** Kabul edildi (kilitli)

**Karar:** React Native + TypeScript (strict mode, her zaman açık). Faz 1
boyunca Expo Go ile geliştirme. Kamera için `expo-camera` — Faz 2'de
MediaPipe Face Mesh eklenince `react-native-vision-camera`'ya geçiş ayrı bir
ADR ile yapılacak. Backend: Node.js/Express. State management: Zustand
(Context API veya Redux kullanılmaz). Navigation: Expo Router.

**Gerekçe:** Expo Go ile hızlı iterasyon, tek geliştiriciyle basit state
yönetimi, dosya bazlı routing ile öngörülebilir navigasyon yapısı.

---

## ADR-002: Klasör yapısı

**Durum:** Kabul edildi (kilitli)

**Karar:**

```
src/
  features/        (onboarding, camera, questionnaire, results, ...)
  shared/
    components/
    theme/
    hooks/
  navigation/
  services/
  types/
assets/
```

Yeni ekran/özellik → `features/` altına kendi klasörü. `screens/` gibi tip
bazlı bir yapıya asla dönüştürülmez.

**Not (kapsam dışı ekleme):** Expo Router dosya bazlı routing kullandığı
için proje kökünde `app/` dizini de bulunur (Router'ın kendi zorunluluğu);
bu dizindeki dosyalar sadece ilgili `src/features/*/screens` bileşenini
render eden ince sarmalayıcılardır, iş mantığı içermez.

**Not (belirtilmemiş nokta, kilitli kararla çelişmiyor):** Zustand
store'ları için sabit yapıda ayrı bir klasör tanımlanmamıştı. Onboarding
akışı `features/` arası (gender, camera, questionnaire, results) paylaşılan
tek bir durumu yönettiği için `src/store/useOnboardingStore.ts` olarak ayrı
bir klasörde tutuldu. Bu, mimari kararlardan sapma değildir; istenirse
konumu değiştirilebilir.

---

## ADR-003: Tasarım sistemi

**Durum:** Kabul edildi (kilitli, final)

**Karar:** Renkler — zemin `#F9F8F6`, kart/yüzey `#EFEAE1`, aksan/CTA
`#8C7A6B`, başlık/ana metin `#262220` (asla saf siyah), aksan üzeri metin
`#FFFFFF`, ikincil metin `#7A7571` (küçük metinde `#6E6966` tercih edilir).
Başlık fontu Cormorant Garamond (SemiBold/Medium); gövde/buton/form fontu
Inter — tıklanabilir alanlarda kesinlikle Cormorant Garamond kullanılmaz.
Birincil buton dolgulu/aksan renkli + beyaz metin (Inter Medium, 15-16px);
ikincil buton outline + `#262220` metin; ikisi asla aynı görsel ağırlıkta
olmaz. Seçenek kartı 48-52px yükseklik, 16px `borderRadius`, düz kart (organik
süsleme yok). Gölge kullanılmaz; gerekirse `opacity: 0.04, radius: 8`.

**Uygulama:** `src/shared/theme/{colors,typography,spacing}.ts` ve
`src/shared/components/{Text,Button,Card,OptionCard,ScreenContainer}.tsx`.

---

## ADR-004: API / veri sözleşmesi

**Durum:** Kabul edildi (kilitli)

**Karar:** `RoutineRecommendationResponse` şeması Faz 3'teki ürün kataloğu
entegrasyonuna açık olacak şekilde tasarlandı; `productSuggestion: null`
alanı bu amaçla şemada kasıtlı olarak bulunur ve kaldırılmamalıdır
(`src/types/api.ts`). Fotoğraflar KVKK gereği kısa süreli saklanır veya
işlendikten hemen sonra silinir (`src/services/camera.ts` ->
`deleteLocalPhoto`); onboarding'de açık rıza onayı zorunludur
(`ConsentCheckbox`, `WelcomeScreen`).

**Geçici not:** Express backend'i henüz bu repoda/deploy'da yok.
`src/services/mockApi.ts` (`mockSubmitOnboarding`) UI akışını uçtan uca test
etmek için sahte, gecikmeli bir yanıt üretir ve aynı request/response
sözleşmesini kullanır. Backend hazır olduğunda ekranlarda import
`mockApi` -> `api` olarak değiştirilecek, `mockApi.ts` silinecek.

---

## ADR-005: Kod standardı

**Durum:** Kabul edildi (kilitli)

**Karar:** ESLint + Prettier + Husky (commit öncesi otomatik kontrol)
kurulu. `main` + `feature/*` branch modeli, her değişiklik PR ile. Her büyük
mimari karar bu dosyaya (ADR formatında) eklenir.

**Uygulama notu:** `eslint-config-expo@57.0.2`, ESLint 10 ile birlikte
kullanıldığında (`eslint-plugin-react@7.37.5`'in ESLint 10'un flat config
runtime'ından kaldırdığı `context.getFilename()` çağrısına bağımlı olması
nedeniyle) çöküyor. Bu yüzden `eslint` paketi bilinçli olarak `9.39.5`'e
sabitlendi. `eslint-config-expo` (veya üstündeki `eslint-plugin-react`)
ESLint 10 desteğini yayınladığında bu sabitleme kaldırılıp güncellenebilir.
`.husky/pre-commit`: `lint-staged` (ESLint --fix + Prettier) ve
`tsc --noEmit` çalıştırır.

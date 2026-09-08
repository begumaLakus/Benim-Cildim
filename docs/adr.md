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

---

## ADR-006: "İş Paketi 0" ile kilitli kararlar arasındaki çelişkinin çözümü

**Durum:** Kabul edildi

**Bağlam:** 4 Eylül tarihli "İş Paketleri" belgesindeki İş Paketi 0 (Proje
Kurulumu), ADR-001/ADR-002'deki kilitli kararlarla üç noktada çelişiyordu:

1. Navigasyon için "React Navigation kurulumu" istiyordu; kilitli karar
   Expo Router'dı.
2. Klasör yapısı olarak `src/screens, src/components, src/theme, ...` gibi
   tip bazlı düz bir yapı istiyordu; kilitli karar bunu açıkça yasaklayıp
   `features/` bazlı yapıyı zorunlu kılıyordu.
3. "Vision Camera native modül gerektirdiği için Expo kullanacaksan EAS Dev
   Client gerekiyor" diyerek kararı `react-native-vision-camera`ya
   bağlıyordu; kilitli karar Faz 1'de `expo-camera` + Expo Go'yu, Vision
   Camera'ya geçişi Faz 2'ye erteliyordu.

**Karar:** Kilitli mimari kararlar (ADR-001, ADR-002) esas alındı; İş Paketi
0 bu üç maddede zaten kurulmuş olan mimariye göre karşılanmış sayıldı:
Expo Router + `features/` klasör yapısı + `expo-camera`/Expo Go ile devam
ediliyor. İş Paketi dokümanının bu üç maddesi, kilitli kararlarla
güncellenmesi gereken eski/senkron dışı metin olarak işaretlendi — proje
kodunda bir değişiklik yapılmadı.

**Bu kararla birlikte tamamlanan geri kalan İş Paketi 0 maddeleri:**
GitHub reposu (kullanıcı tarafından oluşturuldu, bu repo push edildi),
kısa proje tanımı içeren `README.md`, `.env`/`.env.example`
(`EXPO_PUBLIC_API_BASE_URL`, Expo'nun yerleşik env desteğiyle, ek bir babel
eklentisi gerekmeden).

---

## ADR-007: `npm start` çalıştırılamama sorununun giderilmesi

**Durum:** Kabul edildi

**Bağlam:** 7 Eylül'de projeyi yerelde ayağa kaldırmaya çalışırken üç ayrı
sorun tespit edildi:

1. `react-native-reanimated@4.x`'in zorunlu peer bağımlılığı olan
   `react-native-worklets` `package.json`'da hiç listelenmemişti — Cuma
   günkü ilk kurulumda `--legacy-peer-deps` ile paket dolaylı olarak
   `node_modules`'a inmişti ama doğrudan bağımlılık olarak eklenmemişti;
   kullanıcının kendi `npm install` çalıştırması bu paketi hiç kurmadı ve
   uygulama bu yüzden açılışta çöktü ("There was a problem running the
   requested app").
2. `app.json`'da `web` platformu için ayrı bir yapılandırma bloğu
   bulunuyordu ve `platforms` alanı kısıtlanmamıştı; bu, Expo CLI'nin
   interaktif menüsünde yanlışlıkla `w` (web) tetiklenmesine ve
   `react-native-web` kurulu olmadığı için sunucunun durmasına yol
   açabiliyordu — proje Faz 1'de yalnızca Expo Go/mobil hedefliyor, web
   hiç kullanılmıyor.
3. `npm install` bazen `ERESOLVE` hatasıyla tamamen başarısız oluyordu:
   `expo-router`'ın web'e özgü, opsiyonel `@expo/ui` (radix-ui/vaul)
   bağımlılıkları `react-dom@^19.2.8` istiyor, proje ise Expo SDK 57'nin
   desteklediği `react@19.2.3`'e sabit — bu web'e özgü dal hiç
   kullanılmadığı için çakışma zararsız.

**Karar:**

- `react-native-worklets` doğrudan bağımlılık olarak `package.json`'a
  eklendi (`npx expo install react-native-worklets` ile).
- `app.json`'a `"platforms": ["ios", "android"]` eklendi, kullanılmayan
  `web` bloğu kaldırıldı.
- Kök dizine `legacy-peer-deps=true` içeren bir `.npmrc` eklendi; böylece
  `npm install` her seferinde elle `--legacy-peer-deps` yazılmadan
  yukarıdaki zararsız çakışmayı otomatik aşıyor.

## ADR-008: Anket akışının "tek soru, tek ekran" sihirbaza dönüştürülmesi

**Durum:** Kabul edildi

**Bağlam:** Onboarding akışı, kullanıcının isteğiyle şu sıraya göre yeniden
düzenlendi: açılış ekranı ve marka/amaç ekranı (WelcomeScreen) olduğu gibi
kalıyor — bu ikisi bu kararla değiştirilmedi, ileride Figma tasarımıyla
değiştirilecek. Bundan sonraki her soru artık tek başına kendi ekranında
geliyor (önceden tüm sorular `QuestionnaireScreen` içinde tek bir kaydırılan
sayfadaydı). Sıra: anket başlangıç ekranı -> yaş aralığı (yeni soru) ->
cinsiyet (önceden ayrı bir `GenderScreen`/route'du, artık sihirbazın bir
adımı) -> kamera -> cilt tipi -> cilt endişeleri -> aktif madde kullanımı ->
bilinen hassasiyet. Son adımın devam butonu "Rutinimi Oluştur, Sonucu Göster"
metnini taşıyor ve bekleme ekranına geçiyor.

**Kamera yerleşimi kararı:** Kullanıcı kamera adımının akışta nereye
ekleneceğini bilinçli olarak açık bıraktı. Kamera, cinsiyet sorusundan hemen
sonra ve kalan cilt/anket sorularından önce yerleştirildi — bu, kilitli
brief'teki "cinsiyet seçimi -> fotoğraf çekimi -> anket" sırasını korur ve en
donanım-yoğun/dikkat gerektiren adımı (3 açıdan fotoğraf çekimi) akışın
başında, kullanıcı henüz taze motivasyonluyken bitirir.

**Karar:**

- Anket sihirbazı tek bir route'ta (`app/questionnaire/flow.tsx` ->
  `QuestionnaireFlowScreen`) adım index'i olarak tutulur; her soru için ayrı
  bir route açılmadı — geri tuşu ve ilerleme çubuğu tek yerden yönetiliyor.
  Anket başlangıç ekranı ayrı bir route'tur (`app/questionnaire/index.tsx` ->
  `QuestionnaireIntroScreen`).
- Ortak adım iskeleti (`QuestionStepLayout` + `StepHeader`,
  `features/questionnaire/components/`) geri oku + ilerleme çubuğu + başlık +
  devam butonunu tüm adımlarda tekrar kullanır; mevcut `OptionCard`/`Button`
  görsel dili değişmeden korunur.
- Kamera artık ayrı bir route/ekran değil, sihirbazın bir adımı
  (`features/questionnaire/steps/CameraStep.tsx`). Donanıma özgü
  çekim/önizleme mantığı `features/camera/components/CameraCapture.tsx`'e
  taşındı ve açı bazında (önden/soldan/sağdan) 3 kez kullanılıyor.
- Yeni tipler: `AgeRange`, `CameraAngle` (`src/types/domain.ts`).
  `QuestionnaireAnswers.ageRange` eklendi. Store'daki tekil `photo`/`setPhoto`
  alanı, açı bazlı `photos: Record<CameraAngle, CapturedPhoto | null>` ve
  `setPhoto(angle, photo)`/`resetPhotos()` ile değiştirildi.
  `SubmitOnboardingRequest.photoReferenceId` (tekil) yerine
  `photoReferenceIds` (açı bazlı, opsiyonel) kullanılıyor.
- Bekleme ekranı (`WaitingScreen`) artık sırayla değişen durum mesajları
  gösteriyor ("Fotoğrafların değerlendiriliyor" -> ... -> "Sana özel rutin
  oluşturuluyor") — gerçek bir ilerleme yüzdesini temsil etmiyor, sonucun
  adım adım oluşturulduğu izlenimini veriyor.

---

## ADR-009: Auth sistemi, ana uygulama iskeleti ve navigasyon mimarisi

**Durum:** Kabul edildi

**Bağlam:** Faz 1'in ilk kilitlenen kapsamı (onboarding -> anket -> sonuç)
tek yönlü, doğrusal bir akıştı ve "sonuç ekranından sonra ne olur, kullanıcı
uygulamayı tekrar açtığında nereye düşer, hesap sistemi nasıl işler" hiç
tanımlanmamıştı. Bu boşluk fark edilince (bkz. sohbette paylaşılan
"Benim Cildim — Uçtan Uca Uygulama Haritası" dokümanı) aşağıdaki kararlar
alındı.

**Karar:**

1. **Auth zamanlaması:** Kullanıcı önce misafir olarak anketi doldurur,
   kamerayla fotoğraflarını çeker ve rutin önerisini görür — hesap açması
   bu noktadan ÖNCE istenmez. Sonuç ekranındaki "Rutinimi Kaydet ve Devam
   Et" CTA'sı, hesap oluşturma/giriş akışının tek kapısıdır.
2. **Auth yöntemi:** E-posta + şifre. Faz 1'de e-posta doğrulama (kayıt
   sonrası link'e tıklama) adımı YOK — kayıt olunca doğrudan giriş
   yapılır. Doğrulama, ileride ayrı bir iş paketi olarak eklenebilir.
3. **Karşılama ekranındaki "Zaten hesabım var" butonu** (bkz. ADR-008'de
   değişmeyeceği belirtilen WelcomeScreen), hesabı olan kullanıcının anketi
   baştan doldurmadan doğrudan giriş ekranına (`/auth/login`) geçebilmesini
   sağlar.
4. **Ana uygulama iskeleti:** Auth sonrası, `(tabs)` adlı ayrı bir Expo
   Router grubu altında 4 sekmeli bottom tab bar: Ana Sayfa/Rutinim
   (varsayılan sekme, günlük sabah/akşam rutin checklist'i), Okumalar/
   İçerik, Test Sonuçlarım/Geçmiş, Profilim. Bu grup, onboarding/anket/auth
   stack'inden ayrı bir navigasyon köküdür.
5. **Backend şimdi kuruluyor (mock'a devam edilmiyor):** Anket akışının
   aksine, auth mock veriyle anlamlı şekilde test edilemez (şifre
   hash'leme, oturum token'ı üretimi doğası gereği sunucu tarafı iştir) —
   bu yüzden `mockApi.ts` deseni auth için tekrarlanmıyor, gerçek backend
   frontend'le PARALEL kuruluyor, "önce frontend bitsin sonra backend"
   sırası izlenmiyor.
6. **Backend teknoloji seçimi:** Repo köküne (RN uygulamasından ayrı, kendi
   `package.json`'ı olan) bir `backend/` klasörü eklenir — Node.js +
   Express + TypeScript (ADR-001'deki kilitli karara uygun). Veritabanı
   erişimi için Prisma ORM, geliştirmede sıfır kurulum için SQLite
   (`backend/prisma/dev.db`, dosya tabanlı — Docker/Postgres kurulumu
   gerekmez). Prisma kullanmanın asıl nedeni: gerçek üretime (beauty
   center'a satış) geçmeden önce `schema.prisma`'da tek satır değiştirip
   PostgreSQL'e geçmek düşük risklidir, veri modeli/sorgular aynı kalır.
   Şifreler `bcrypt` ile hash'lenir (asla düz metin saklanmaz), oturumlar
   JWT (`jsonwebtoken`) ile yönetilir.
7. **Anket SORULARI (soru metinleri/seçenekleri) veritabanında değil,
   koddadır** (`src/features/questionnaire/data/questions.ts`) — bunlar
   statik UI içeriğidir, kullanıcı verisi değildir; bir CMS/admin panel
   olmadığı sürece kodda tutmak standarttır ve ekstra bir backend
   sorgusu gerektirmez. **Anket CEVAPLARI (kullanıcının verdiği yanıtlar)
   ise, kullanıcı hesaba bağlandığı andan itibaren backend'de saklanır**
   (`RoutineHistory` tablosu) — "Test Sonuçlarım" sekmesi ve cihazlar
   arası erişim bunu zorunlu kılar. Misafir aşamasında (hesap yokken)
   cevaplar sadece Zustand store'da, geçicidir.
8. **Navigasyon mantığı:** `app/index.tsx`, `expo-secure-store`'da bir
   oturum token'ı var mı kontrolüne göre yönlendirir — varsa doğrudan
   `(tabs)/home`, yoksa (ve yarım kalmış bir anket taslağı yoksa)
   `/onboarding`.

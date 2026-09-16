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

---

## ADR-010: Auth sonrası ana uygulama alanı için deneme pembe palette

**Durum:** Kabul edildi (deneme aşamasında)

**Bağlam:** Kullanıcının başta düşündüğü 3 pembe ton (F4DBD8, C09891, BEA8A7)
proje yöneticisi tarafından da onaylandı — mevcut sade kahve/bej palette
beğenildi ama "hiç pembe yok, bir ton eklensin" geri bildirimi geldi.
Onboarding/anket akışı (ADR-004'teki kilitli 5 renkli palette) BİLİNÇLİ
OLARAK bundan etkilenmiyor — kullanıcı o kısmın değişmesini istemedi.

**Karar:**

- `src/shared/theme/colors.ts`'e AYRI bir `tabColors` nesnesi eklendi
  (`background`, `surface`, `highlight`) — orijinal `colors` nesnesi
  değiştirilmedi, üzerine yazılmadı.
- `ScreenContainer` ve `Card` bileşenlerine `tone?: 'default' | 'tabs'`
  prop'u eklendi (varsayılan `'default'`, mevcut hiçbir ekran davranışı
  değişmedi). `'tabs'` verilince `tabColors` kullanılır.
- Butonlar/CTA'lar BİLEREK pembeye kaydırılmadı — marka aksiyon rengi
  (kahve, `colors.accent`) tüm uygulamada tek ve tutarlı kalıyor, pembe
  sadece zemin/yüzey/rozet gibi dekoratif alanlarda kullanılıyor.
- İlk uygulama alanı: `ProfileScreen` (deneme). Beğenilirse Ana Sayfa,
  Okumalar ve Test Sonuçlarım ekranlarına da aynı `tone="tabs"` ile
  genişletilecek; tab bar'ın kendisi (`app/(tabs)/_layout.tsx`) henüz
  değiştirilmedi.

---

## ADR-011: Rutin geçmişi yazma ucu (`POST /api/routine-history`)

**Durum:** Kabul edildi

**Bağlam:** ADR-009 madde 5 ve 7'de, kullanıcı hesaba bağlandığı andan
itibaren anket cevaplarının/rutin önerisinin backend'de (`RoutineHistory`
tablosu) saklanacağı kararlaştırılmıştı. Tablo (`backend/prisma/
schema.prisma`) zaten vardı ama yazma ucu hiç eklenmemişti — bu ADR o
boşluğu kapatıyor.

**Karar:**

- `POST /api/routine-history`, `requireAuth` middleware'i arkasında
  (`backend/src/middleware/requireAuth.ts`, JWT zorunlu) — token'sız istek
  401 döner.
- İstek gövdesi: `{ answers: QuestionnaireAnswers, routine: RoutinePlan }`.
  RN tarafındaki (`src/types/domain.ts`, `src/types/api.ts`) sözleşmeyle
  birebir eşleşecek şekilde backend'de elle senkron tutulan karşılığı
  `backend/src/types/routineHistory.types.ts`'te (ADR-009 madde 6'daki
  "RN app ile backend ayrı paket, tip paylaşılamıyor" notu, `auth.types.ts`
  ile aynı desen). `gender` bilerek gövdede yok — `RoutineHistory` şeması
  sadece `answersJson`/`routineJson` tutuyor; şemaya yeni alan eklemek ayrı
  bir karar olurdu, bu ADR'nin kapsamı dışında bırakıldı.
- Gövde `zod` ile doğrulanır — `auth.controller.ts`'teki desenle aynı
  (`ZodError` -> `{ code: 'VALIDATION_ERROR', message }`, 400). Bu ikisi
  arasında tekrar etmesin diye ortak `sendZodError` yardımcı fonksiyonu
  `backend/src/utils/zodError.ts`'e çıkarıldı; `auth.controller.ts` da bu
  ortak fonksiyona geçirildi.
- Başarılı yanıt (201) bilerek minimal: `{ id, createdAt }` — gönderilen
  veriyi geri yankılamaz. "Test Sonuçlarım" sekmesinin listeleyeceği okuma
  ucu (`GET /api/routine-history`) bu ADR'nin kapsamı dışında, ayrı bir iş
  paketi (ADR-009 madde 7).
- `userId` yabancı anahtar kısıtlaması başarısız olursa (Prisma `P2003` —
  token geçerli ama kullanıcı artık veritabanında yok, örn. hesap silinmiş)
  genel hata işleyicisinin (500) yerine açıkça 401 döner.

**Güncelleme — RN entegrasyonu tamamlandı:** İlk yazıldığında bu ADR
yalnızca backend ucunu kapsıyordu; RN tarafı ayrıca bağlandı. Ekran
seviyesinde (`ResultsScreen`/`SignUpScreen`) HİÇBİR değişiklik gerekmedi —
senkronizasyon `useAuthStore.ts`'teki `signUp`/`login` action'larının
içine (`syncGuestRoutineIfPresent`) eklendi: token set edildikten hemen
sonra, `useOnboardingStore`'da bekleyen bir `recommendation` varsa
`saveRoutineHistory` (`src/services/api.ts`) ile backend'e yazılır. Bu
sayede hem "Rutinimi Kaydet ve Devam Et" (sign-up) hem de sonuç
ekranındaki "Zaten hesabım var" (login) yolu tek yerden kapsanıyor —
her ikisi de aynı `useAuthStore` action'larını çağırıyor.

- `src/services/httpClient.ts` -> `postJson` opsiyonel bir `token`
  parametresi aldı (`Authorization: Bearer` başlığı) — auth uçları bunu
  kullanmıyor, yalnızca `requireAuth` arkasındaki uçlar için.
- Yazma best-effort: ağ hatası/backend kapalıysa sessizce yutulur,
  kullanıcıyı giriş/kayıttan sonra uygulamaya ulaşmaktan alıkoymaz.
- `useOnboardingStore`'a `recommendationSynced` bayrağı eklendi — aynı
  oturumda birden fazla auth olayının (örn. çıkış + tekrar giriş) aynı
  öneriyi backend'e tekrar tekrar yazmasını engeller; yeni bir
  `setRecommendation` çağrısı (yeni anket turu) bayrağı otomatik
  sıfırlar.

**Ek düzeltme (aynı test turunda bulundu):** `POST /api/routine-history`'yi
elle test ederken (bozuk bir JSON gövdesiyle) fark edildi — `express.json()`
(body-parser) geçersiz bir JSON gövdesi aldığında hata, route/controller'a
hiç ulaşmadan doğrudan Express'in genel hata zincirine düşüyordu; bu da
istemciye (RN tarafı) hangi uç olursa olsun anlamsız bir `500 INTERNAL_ERROR`
olarak yansıyordu — oysa bu tamamen istemci kaynaklı, düzeltilebilir bir
`400` durumu. `backend/src/middleware/errorHandler.ts`'e body-parser'ın JSON
parse hatasını (`type === 'entity.parse.failed'`) ayırt edip `{ code:
'INVALID_JSON', message }` ile 400 döndüren bir kontrol eklendi — tüm
uçları (auth dahil) kapsar, bu ADR'ye özgü değil.

---

## ADR-012: Rutin geçmişi okuma ucu (`GET /api/routine-history/latest`) ve Ana Sayfa'nın gerçek veriye bağlanması

**Durum:** Kabul edildi

**Bağlam:** ADR-011 sadece yazma ucunu ekliyordu. Bu arada gerçek bir hata
tespit edildi: `HomeScreen`, kullanıcının rutinini yalnızca o oturumda
(bellek-içi) `useOnboardingStore`'dan okuyordu — geçerli bir oturum
token'ıyla doğrudan `(tabs)/home`'a düşen bir kullanıcı (uygulamayı kapatıp
açtığında, ya da çıkış yapıp tekrar giriş yaptığında) rutinini "kaybolmuş"
görüyordu, çünkü o bellek hiçbir zaman yeniden doldurulmuyordu.

**Karar:**

- `GET /api/routine-history/latest`, `requireAuth` arkasında — kullanıcının
  en son kaydettiği `RoutineHistory` satırını (`createdAt DESC`, ilk kayıt)
  döner. Kayıt yoksa (yeni hesap, hiç anket tamamlanmamış) **404** döner —
  bu bir hata değil, beklenen bir durumdur.
- Yanıt şeması bilinçli olarak RN tarafındaki `RoutineRecommendationResponse`
  (`src/types/api.ts`) ile BİREBİR aynı (`routine`, `productSuggestion: null`,
  `generatedAt`) — böylece `HomeScreen`, misafirken alınan bir öneriyle
  backend'den çekilen bir öneriyi aynı store alanına (`recommendation`)
  yazabiliyor, ayrı bir tip/dönüşüm gerekmiyor.
- RN tarafı: `src/services/httpClient.ts`'e `getJson` eklendi — 404'ü özel
  olarak `null` döner (hata fırlatmaz), diğer `ApiRequestError` durumlarıyla
  karışmasın diye. `HomeScreen` artık mount olduğunda (token varsa) bu ucu
  çağırıyor; yükleniyor durumu (`ActivityIndicator`) ve hata durumu
  (`loadError`) eklendi. Ekranın render mantığı (rutini gösterme) değişmedi.
- Backend'den başarıyla çekilen bir öneri, hemen `markRecommendationSynced()`
  ile işaretlenir — bu kayıt zaten backend'de var, `useAuthStore.ts`'teki
  `syncGuestRoutineIfPresent`'in onu tekrar `POST` ETMEMESİ için (bkz.
  ADR-011 güncellemesi).

**Ek düzeltme (bu ucu eklerken bulundu — genel, tüm backend'i kapsar):**
Express 4.x, async route handler'larda `await` edilirken reddedilen
hataları otomatik olarak `errorHandler`'a yönlendirmez; bu hatalar
yakalanmamış bir "unhandled promise rejection" olarak kalır. Node 15+'ta
(bu backend Node 24 ile çalışıyor) bu, istemcinin yanıt alamayıp sonsuza
kadar beklemesiyle KALMAZ — sürecin çökmesine bile yol açabilir (varsayılan
davranış: unhandled rejection → `process.exit`). Yeni bağımlılık eklemeden
(`express-async-errors` yerine) `backend/src/utils/asyncHandler.ts` adında
küçük, sıfır-bağımlılıklı bir sarmalayıcı eklendi ve TÜM async route
controller'ları (`auth.routes.ts`, `routineHistory.routes.ts`) bununla
kaydedildi — controller imzaları/mantığı değişmedi.

**Güncelleme — pembenin kullanım yönü değişti (kenarlık/rozet vurgusu):**
Kullanıcı geri bildirimi: `Profilim`'de denenen tam sayfa zemini + tam kart
dolgusu, uygulamanın soft kahve/krem diliyle uyuşmuyordu, amatörce
hissettiriyordu. Yön değişti — pembe artık zemin/kart dolgusu DEĞİL,
yalnızca küçük, kasıtlı vurgu noktalarında kullanılıyor: seçim/onay
öğelerinde kenarlık (örn. avatar çerçevesi) ve onay/durum ikonlarında (örn.
"hesap aktif" rozetindeki `checkmark-circle` ikonu). `ProfileScreen` bu
yeni yöne göre yeniden tasarlandı — sayfa zemini ve kart artık kilitli
(ADR-003) krem/kahve palete geri döndü, `tabColors` sadece avatar
çerçevesinde ve rozette kullanılıyor. Diğer 3 sekmeye (Ana Sayfa/Okumalar/
Sonuçlarım) pembe zemin/kart uygulama planı bu kararla düşürüldü — ileride
aynı "kenarlık/rozet" mantığıyla oralara da kasıtlı vurgu noktaları
eklenebilir, ama tam sayfa/kart dolgusu olarak değil.

## ADR-013: Anket sonrası "Analiz Ekranı" (köpük/baloncuk geçişi)

**Durum:** Kabul edildi ve uygulandı

**Bağlam:** Anket bitince (`WaitingScreen`) sonuç doğrudan gösteriliyordu —
gerçek hesaplama (kural tabanlı eşleştirme, mock'ta 1800ms) zaten anlık
olduğu için bu an jenerik bir döndürücüden ibaretti. Kullanıcı, cilt
bakımı/temizlik metaforuyla örtüşen bir fikir önerdi: ekranı dolduran
köpük/baloncuklar, sonunda köpüğün kaybolup altından sonucun çıkması —
otomatik ya da kullanıcının baloncuklara dokunmasıyla.

**Karar:**

- **Etkileşim: hibrit.** Baloncuklar kendiliğinden dolar; kullanıcı isterse
  dokunup "patlatarak" süreci hızlandırabilir (10 baloncuk patlatılınca
  anında açılır) ama zorunlu değildir — veri hazır olur olmaz en az 2,2
  saniye (`MIN_VISIBLE_MS`) sonra, en geç ~1,6 saniye daha (`AUTO_REVEAL_DELAY_MS`)
  içinde otomatik açılır. Erişilebilirlik ("Hareketi Azalt" açık) ve
  sabırsız kullanıcı senaryolarının ikisi de karşılanıyor.
- **Renk: sadece krem + pembe, mevcut paletten.** Yeni bir renk ailesi
  (örn. mavi) eklenmedi — baloncuklar `colors.surface` (krem) ve
  `tabColors.highlight` (pembe, ~%25 oranında vurgu) kullanıyor, sheet
  zemini `colors.background`. **Not — bu bir mimari sınır genişletmesi:**
  `colors.ts`'teki not, pembenin SADECE auth-sonrası `(tabs)` alanında
  kullanılacağını, anket/onboarding akışının BİLİNÇLİ OLARAK buna
  dokunmadığını söylüyor. Analiz Ekranı `results/waiting` altında, yani
  teknik olarak anket akışının bir parçası — kullanıcı bunu bilerek
  onayladı (bkz. sohbet), ama ileride biri bu dosyayı okuyup "neden burada
  pembe var" diye sorarsa diye burada açıkça not düşülüyor. Anket
  ekranlarının kendisi (soru kartları, butonlar) hâlâ tamamen kilitli
  5 renkli palette — yalnızca bu geçiş ekranı istisna.
- **Dürüstlük kuralı:** Dönen durum yazıları ("cilt tipin eşleştiriliyor"
  gibi) mekanizmayı olduğu gibi anlatıyor — kural tabanlı bir eşleştirme
  bu; "yapay zeka analiz ediyor" gibi bir ifade BİLEREK kullanılmadı, çünkü
  ileride bir güzellik merkezine satılacak bir üründe yanlış teknik iddia
  güven sorunu yaratır.
- **Yeni bağımlılık yok.** `react-native-reanimated` (4.5.1) ve RN'in kendi
  `Pressable`'ı zaten kuruluydu ama daha önce hiç kullanılmıyordu — bu,
  projede Reanimated'ın ilk gerçek kullanımı. `react-native-gesture-handler`
  hiç dokunulmadı (basit `Pressable` yeterli oldu).
- **Mimari:** Yeni paylaşılan bileşen `src/shared/components/AnalyzingOverlay.tsx`
  — `ready`, `statusMessages`, `onFinished` prop'ları alıyor, tek başına bir
  ekran değil. `WaitingScreen` artık veri hazır olur olmaz `ResultsScreen`'i
  KENDİ İÇİNDE (henüz `results/waiting` route'undayken, overlay'in altında,
  görünmeden) render ediyor; overlay köpüğü kaldırdığında kullanıcı zaten
  hazır olan sonucu görüyor, `router.replace(routes.results)` ancak ONDAN
  SONRA çağrılıyor — böylece route değişiminde göz kırpması olmuyor. Aynı
  bileşen, Sonuçlarım'daki "Yeniden Analiz Başlat" akışı eklendiğinde
  (bkz. uygulama haritası) oradan da çağrılabilir.
- **Erişilebilirlik:** `AccessibilityInfo.isReduceMotionEnabled()` true ise
  baloncuk animasyonu tamamen atlanıyor, yerine eski sade `ActivityIndicator`
  - dönen metin gösteriliyor — süre sınırları (min/otomatik açılış) aynen
    korunuyor.
- **React Compiler notu:** `eslint-config-expo`'nun React Compiler kuralları
  (`react-hooks/immutability`), Reanimated'ın "shared value" mutasyonunu
  (`sharedValue.value = ...`) tanımıyor ve hatalı işaretliyor — bu,
  Reanimated'ın resmi/kasıtlı API'si olduğu için tek satırlık, açıklamalı
  bir `eslint-disable-next-line` ile susturuldu (sessizce değil, yorum
  satırıyla).

`npm run typecheck`, `npm run lint` ve `npm run format:check` (yeni/değişen
iki dosya için) temiz. Gerçek görsel doğrulama (Expo Go) kullanıcı
tarafından yapılacak — sandbox'ta canlı çalıştırılamıyor (bkz. ADR-007/012).

---

**Güncelleme — köpük yoğunluğu ve gerçekçiliği artırıldı:**
Kullanıcı geri bildirimi: ilk sürüm (24 tek tip, düz renkli, geniş boşluklu
baloncuk) "amatörce" durdu ve ekranı kaplamadı — bilinen sabun köpüğü
hissi yoktu. `AnalyzingOverlay` iki katmana bölündü:

- **Dip köpük** (20 adet, 90-220px, düşük opaklık, dokunulamaz) — ekranı
  gerçekten KAPLAYAN, örtüşen bulanık kütle.
- **Üst köpük** (64 adet, 12-46px, parlaklık noktalı + ince parlak kenarlı,
  dokunulabilir) — "gerçek baloncuk" hissini ve tıklama etkileşimini veren
  kısım; patlatma eşiği buna göre 20'ye çıkarıldı (~%31).

Her baloncuk artık tek bir `presence` shared value ile hem belirip hem
sürekli `breatheFloor`↔1 arasında rastgele periyotlarla "nefes alıyor" —
"fokur fokur" sürekli hareket hissi buradan geliyor (ayrı bir parçacık
üretme/yok etme sistemi kurulmadı, performans riski daha düşük ve statik
olarak doğrulanması daha kolay). Parlaklık/kenar rengi yeni bir renk
DEĞİL — `colors.background`'ın düşük alfalı hâli (bkz. `SHEEN_STRONG`/
`SHEEN_SOFT` sabitleri). `typecheck`/`lint`/`format` yine temiz.

## ADR-014: `react-native-worklets` sürüm uyuşmazlığı (uygulama hiç açılmıyordu)

**Durum:** Kabul edildi ve düzeltildi

**Bağlam:** ADR-013'teki Analiz Ekranı'nı Expo Go'da denerken uygulama HİÇ
açılmadı — kök `app/_layout.tsx`'te `react-native-gesture-handler`'dan
`GestureHandlerRootView` `undefined` geldi ("TypeError: undefined is not a
function"), bu da kök layout'u ve dolayısıyla TÜM route'ları ("missing
default export" uyarıları) çökertti. `app/_layout.tsx`'e o an hiç
dokunulmamıştı — hata orada değildi.

Kök neden: `package.json`'da `react-native-worklets` **`^0.12.1`** olarak
sabitlenmişti, ama `react-native-reanimated@4.5.1`'in `peerDependencies`'i
`react-native-worklets: "0.10.x"` istiyor (`node_modules/react-native-reanimated/package.json`).
Expo SDK 57'nin kendi uyumluluk listesi de (`node_modules/expo/bundledNativeModules.json`)
`0.10.1` bekliyor. Bu uyuşmazlık `package.json`'da BAŞINDAN BERİ vardı —
ama Reanimated hiçbir yerde gerçekten kullanılmadığı için (worklet
runtime'ı hiç tetiklenmediği için) tamamen sessiz/etkisizdi.
`AnalyzingOverlay`, projede Reanimated'ın (`useSharedValue`,
`useAnimatedStyle`) İLK gerçek kullanımı olunca worklet runtime'ı ilk kez
gerçekten başlatıldı — 0.12.x native ABI'siyle Expo Go'nun içine gömülü
0.10.x native koddaki karşılığı uyuşmadığı için worklets runtime'ının
başlatılması başarısız oldu; `react-native-gesture-handler` da aynı
worklets native modülünü paylaştığı için (yeni mimaride) o da bu
başarısızlıktan etkilenip export'unu `undefined` bıraktı.

**Karar:**

- `react-native-worklets` `^0.12.1` → `^0.10.1` olarak düzeltildi (`npm
install react-native-worklets@0.10.1`) — artık hem Reanimated'ın
  `peerDependencies`'iyle hem Expo SDK 57'nin beklediğiyle birebir uyumlu.
- Bu, Analiz Ekranı'nın NEDEN OLDUĞU bir hata değil — projede zaten var
  olan, ama hiç tetiklenmemiş bir sürüm uyuşmazlığıydı. İlk gerçek
  worklet kullanımı onu görünür kıldı.
- **Sende yapman gereken:** `npm install`'ı tekrar çalıştırıp Metro
  önbelleğini temizleyerek yeniden başlat (`npx expo start -c`) — sandbox
  bu bağımlılığı kurabildi ama gerçek cihaz/Expo Go üzerinde canlı testi
  hâlâ senin yapman gerekiyor (bkz. ADR-007).

---

## ADR-015: Rutinim ekranı yeniden yapılandırma (Sabah/Akşam segment, kart mimarisi, ürün slotu)

**Durum:** Kabul edildi ve uygulandı

**Bağlam:** Kullanıcı, Rutinim'in düz/statik dikey liste görünümünü, atomik
bileşenlerle kurulmuş, B2B ürün entegrasyonuna hazır bir yapıya çevirecek
detaylı bir teknik spesifikasyon verdi (renk kodları, komponent isimleri
dahil). Spesifikasyonun İKİ noktası kilitli mimariyle çakışıyordu, ikisi de
uygulamadan önce kullanıcıya soruldu ve netleştirildi:

1. **Renk sistemi çakışması:** İstenen kart yüzeyi (`#FFFFFF` + `1px
#EFEAE1` border) ve yeni bir pembe ton (`#E8C5B8`), ADR-003'ün düz/
   gölgesiz/sınırsız kart kuralıyla ve ADR-010'un zaten kilitli iki pembe
   tonuyla (`#F4DBD8`, `#C09891`) çakışıyordu. **Karar: mevcut palete sadık
   kalındı** — kart yüzeyi `colors.surface` (#EFEAE1), vurgu rengi
   `tabColors.highlight` (#C09891). ADR-003/ADR-010'a hiç dokunulmadı,
   sadece LAYOUT yenilendi.
2. **Cilt etiketi veri kaynağı:** İstenen "Karma / Nemsiz • Bariyer
   Onarımı" tarzı etiket anket cevaplarından geliyor, ama `GET
/api/routine-history/latest` bu cevapları dönmüyordu (ADR-12'de bilerek
   minimal tutulmuştu) — eklenirse tekrar girişte kaybolurdu. **Karar:
   backend'e bağlandı** (aşağıda, madde 5).

**Karar (uygulama):**

1. **Yeni atomik bileşenler:**
   - `src/shared/components/SegmentedControl.tsx` — jenerik (`T extends
string`) iki+ seçenekli segment kontrolü. Aktif segment
     `colors.accent` dolgu + `colors.textOnAccent` metin; pasif segment
     `colors.textSecondary`. İlk kullanım yeri Sabah/Akşam ama başka
     ekranlar da kullanabilir.
   - `src/features/home/components/RoutineCard.tsx` — tek rutin adımı
     kartı: sıra/kategori satırı, aktif madde (ana odak), talimat, sağda
     yuvarlak tamamlanma checkbox'ı (`tabColors.highlight` border/dolgu).
     Eski `RoutineStepRow` (hâlâ `ResultsScreen`'de kullanılıyor) BİLEREK
     değiştirilmedi — anket bitişindeki ilk önizlemede "bugün işaretleme"
     kavramı yok.
   - `src/features/home/components/ProductSlot.tsx` — `AffiliatedProduct
{ id, name, brand, imageUrl }` tipini tanımlar. `RoutineCard`'ın
     opsiyonel `affiliatedProduct` prop'u dolarsa kartın altında açılır.
     Şu an HİÇBİR yerden gerçek veri beslenmiyor (`HomeScreen` her zaman
     `undefined` geçiyor) — Faz 3'teki güzellik merkezi kataloğu bekliyor
     (bkz. uygulama haritası, ADR-004'teki `productSuggestion` sözleşmesi).
   - `src/features/home/utils/skinSummary.ts` — `formatSkinSummary`, ham
     `SkinSummary` enum'larını Türkçe etikete çevirir (örn. "Karma Cilt •
     Kızarıklık, Donukluk"). Formatlama BİLEREK RN tarafında — backend
     lokalizasyon bilmiyor, sadece veri taşıyor.
2. **`HomeScreen`:** Dikey sabah/akşam yığılması kaldırıldı,
   `SegmentedControl` ile `activeSlot` state'ine göre tek liste
   gösteriliyor. Günlük "tamamlandı" işaretleri şimdilik SADECE
   `useState<Set<string>>` ile bu oturumda tutuluyor — kalıcı hâle
   getirmek (backend `RoutineProgress` modeli) uygulama haritasındaki
   "Rutinim'e günlük işaretleme" adımının kendisi, bu değişikliğin
   kapsamında değil, bilerek ertelendi.
3. **Atlanan madde:** Spesifikasyon "sağ üstteki parlak mavi ayarlar
   butonunu kaldır" diyordu — uygulamada böyle bir buton (ya da genel
   olarak bir ayarlar ekranı) hiç yok, muhtemelen farklı bir referanstan
   geliyordu. Var olmayan bir şeyi "kaldırmak" anlamsız olduğu için, ve
   gidecek bir yeri olmayan süs bir ikon eklemek kötü pratik olacağı için
   bu madde atlandı.
4. **Yazı tipi notu:** Aktif madde metni için "Inter-SemiBold" istenmişti;
   projede sadece Inter Regular/Medium yüklü (`app/_layout.tsx`'teki
   `useFonts`). Yeni bir ağırlık indirmek yerine mevcut en kalın seçenek
   (`fontFamily.bodyMedium`, Inter Medium) kullanıldı — istenirse SemiBold
   eklemek küçük, düşük riskli bir ek iş.
5. **Backend genişletmesi:** `GET /api/routine-history/latest` yanıtına
   `skinSummary: { skinType, concerns } | null` eklendi
   (`backend/src/types/routineHistory.types.ts`,
   `routineHistory.controller.ts`) — zaten DB'de saklı `answersJson`'dan
   türetiliyor, yeni bir soru/tablo YOK. RN tarafında
   `RoutineRecommendationResponse`'a aynı alan eklendi; misafir akışında
   (`mockApi.ts`) da gerçek `request.answers`'tan dolduruluyor, sabit
   değer değil — böylece HomeScreen ikisini de aynı alan üzerinden okuyor.

`npm run typecheck`/`lint`/`format:check` (RN) ve `npx tsc --noEmit`
(backend, sadece önceden bilinen `jwt.ts` hatası dışında) temiz. Görsel
doğrulama yine kullanıcıda — sandbox'ta canlı çalıştırılamıyor.

---

## ADR-016: Rutinim — Kalıcı Günlük İlerleme, İlerleme Çubuğu ve "Neden Önerildi" Açıklaması

**Durum:** Kabul edildi
**Bağlam:** ADR-015'te Rutinim ekranı Sabah/Akşam Segmented Control +
`RoutineCard` yapısına geçti ama günlük "tamamlandı" işaretleri BİLEREK
sadece oturum-içi (`useState<Set<string>>`) bırakılmıştı. Kullanıcı
canlı testte fark etti: uygulamayı kapatıp yeniden açınca (yeni bir
oturum) işaretlediği adımlar sıfırlanıyordu — bu, günlük bir alışkanlık
takip özelliği için kabul edilemez, çünkü kullanıcı "bugün zaten
yaptım" bilgisini kaybediyor. Ayrıca kullanıcı iki ek istek belirtti:
(1) aktif sekmede kaç adımın tamamlandığını gösteren bir ilerleme
göstergesi + tamamlanınca bir kutlama mesajı, (2) her adımın altında
neden önerildiğini kısaca açıklayan bir satır.

**Karar:**

1. **Backend — `RoutineProgress` modeli (bkz. `backend/prisma/schema.prisma`):**

   ```prisma
   model RoutineProgress {
     id          String   @id @default(cuid())
     userId      String
     user        User     @relation(fields: [userId], references: [id])
     date        String
     stepId      String
     completedAt DateTime @default(now())

     @@unique([userId, date, stepId])
   }
   ```
   - `date`, sunucunun UTC gününü DEĞİL, RN tarafının hesapladığı
     kullanıcının YEREL gün anahtarını ("YYYY-MM-DD",
     `src/features/home/utils/date.ts` → `getLocalDateKey`) taşıyor.
     Sunucu UTC günü kullansaydı, gece yarısına yakın (örn. TR saatiyle
     00:30, UTC'de hâlâ önceki gün) bir kullanıcının işaretlemesi yanlış
     güne yazılabilirdi.
   - `stepId`, rutin JSON'u içindeki adım id'sine referans veriyor;
     ayrı bir `RoutineStep` tablosu olmadığı için gerçek bir foreign key
     DEĞİL, eşleme amaçlı bir string.
   - `@@unique([userId, date, stepId])`, aynı gün+adım için ikinci bir
     satır oluşmasını (çift POST/toggle race'i) engelliyor.
   - Yeni uçlar: `GET /api/routine-progress?date=YYYY-MM-DD` (o günün
     işaretli adım id'lerini döner; hiç işaretleme yoksa 404 DEĞİL, boş
     dizi — "henüz hiçbir şey yok" normal bir durum) ve
     `POST /api/routine-progress/toggle` (`{date, stepId}` — işaretler/
     kaldırır, backend'in GÜNCEL TAM listesini döner).
   - Dosyalar: `backend/src/types/routineProgress.types.ts`,
     `backend/src/controllers/routineProgress.controller.ts`,
     `backend/src/routes/routineProgress.routes.ts`, `app.ts`'e mount.

   **ÖNEMLİ — sandbox kısıtlaması:** Bu oturumda çalıştığım ortamın ağ
   erişimi `binaries.prisma.sh`'ı engelliyor, bu yüzden `npx prisma
generate` (ve migration) burada ÇALIŞTIRILAMADI —
   `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` ile bile 403 Forbidden.
   Kontrolcü kodu, Prisma'nın bilinen API kurallarına (özellikle bileşik
   `@@unique` için otomatik oluşan `userId_date_stepId` anahtar adı)
   göre elle yazıldı ve `npx tsc --noEmit` ile doğrulandı — tek kalan
   hatalar beklenen `Property 'routineProgress' does not exist`
   (istemci yeniden üretilmeden çözülemez) ve önceden var olan, bu
   değişiklikle ilgisiz `jwt.ts` hataları. **Bu değişikliğin backend'de
   çalışabilmesi için `backend/` içinde şunu çalıştırman gerekiyor:**

   ```
   npx prisma migrate dev --name add_routine_progress
   ```

   (bu hem migration'ı oluşturur hem Prisma Client'ı yeniden üretir),
   ardından backend dev sunucusunu yeniden başlat.

2. **RN — kalıcı ilerleme:** `HomeScreen`, eskiden sadece oturum-içi
   `Set<string>` kullanıyordu. Artık:
   - Rutin yüklendiğinde `getRoutineProgress(getLocalDateKey(), token)`
     çağrılıp `completedStepIds` sunucudan dolduruluyor.
   - Bir adıma dokunulunca `toggleRoutineProgress({date, stepId}, token)`
     çağrılıyor; iyimser (optimistic) güncelleme YAPILMIYOR — checkbox,
     backend'in döndürdüğü güncel tam listeyle eşitleniyor, böylece çift
     dokunuş ya da başarısız bir istek arayüzü sunucudaki gerçek
     durumdan asla saptırmıyor. Bir istek sırasında aynı adıma tekrar
     dokunmayı engellemek için `isTogglingStepId` state'i eklendi.
   - Yeni dosyalar/değişiklikler: `src/types/api.ts` (`RoutineProgress`,
     `ToggleRoutineProgressRequest`), `src/services/api.ts`
     (`getRoutineProgress`, `toggleRoutineProgress`),
     `src/services/index.ts` (export'lar).

3. **RN — ilerleme çubuğu (`RoutineProgressBar.tsx`, yeni):** Aktif
   sekmedeki tamamlanan/toplam adım sayısını ("X/Y adım tamamlandı") ve
   ince bir dolum çubuğunu gösteriyor; `completed === total` olduğunda
   altına bir kutlama satırı ("Bugünkü {sabah/akşam} rutinini
   tamamladın") ekleniyor. Renkler mevcut kilitli palet
   (`tabColors.highlight` dolum, `colors.surface` track) — yeni renk
   eklenmedi.

4. **RN — "neden önerildi" açıklaması (`utils/routineReason.ts`, yeni):**
   `formatRoutineReason(productCategory, skinSummary)`, elde zaten olan
   `skinSummary` (anket cevaplarından, bkz. ADR-015 madde 5) kullanarak
   BİLİNEN 4 kategori (Temizleyici, Serum, Güneş koruyucu, Nemlendirici)
   için kural tabanlı bir Türkçe cümle üretiyor (örn. "Karma cildinde
   akne görünümünü azaltmaya yardımcı olur."). Bilinmeyen bir kategori
   ya da eksik `skinType` durumunda `null` döner — uydurma bir cümle
   göstermek yerine satırı gizlemek tercih edildi. `RoutineCard`'a yeni
   `reason?: string | null` prop'u eklendi; doluysa adımın altında bir
   `sparkles-outline` ikonu + `colors.textSecondary` renkli küçük bir
   metin olarak render ediliyor. BİLEREK "yapay zeka" gibi bir iddiada
   bulunulmuyor — bu, kural tabanlı basit bir eşleştirme (bkz. ADR-013'te
   aynı dürüstlük ilkesi). Gerçek fotoğraf-analizi tabanlı kişiselleştirme
   Faz 2'nin kapsamında.

**Sonuç:** `npm run typecheck`/`lint`/`prettier --write` (RN, dokunulan
tüm dosyalarda) ve `npx tsc --noEmit` (backend, sadece yukarıda anlatılan
beklenen `routineProgress` hataları + önceden var olan ilgisiz `jwt.ts`
hataları) temiz. Görsel doğrulama ve migration'ın gerçekten çalıştığının
teyidi kullanıcıda — sandbox'ta ne canlı çalıştırılabiliyor ne de Prisma
Client yeniden üretilebiliyor.

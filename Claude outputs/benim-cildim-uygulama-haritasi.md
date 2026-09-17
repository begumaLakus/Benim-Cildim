# Benim Cildim — Uçtan Uca Uygulama Haritası

**Tarih:** 08.09.2026
**Amaç:** Faz 1'de sadece tek yönlü bir akış (onboarding → anket → sonuç) kilitlenmişti; auth sistemi, ana uygulama iskeleti ve "kullanıcı geri geldiğinde ne olur" hiç tanımlanmamıştı. Bu doküman, dünkü kararlara (auth anket+sonuçtan sonra / e-posta+şifre / 4 sekmeli tab bar / ana sayfa = günlük rutin checklist'i) göre uygulamanın başından sonuna kadar tüm ekranlarını listeler.

**Not:** Bu doküman kabul edilirse `docs/adr.md`'ye **ADR-009** olarak işlenmeli — Faz 1'in ilk kilitlenen kapsamının (onboarding → anket → sonuç) ötesine geçen yeni bir mimari karar olduğu için.

---

## 1. İlk kullanım akışı (misafir, mevcut — değişmiyor)

Zaten kodlanmış, sadece bütünün neresinde durduğunu göstermek için:

1. **Açılış / Karşılama** (`/onboarding`) — Figma tasarımına göre yeniden yapıldı, KVKK rıza onayı burada.
2. **Anket sihirbazı** (`/questionnaire` → `/questionnaire/flow`) — yaş, cinsiyet, kamera (3 açı), cilt tipi, cilt endişeleri, aktif madde kullanımı, bilinen hassasiyet.
3. **Bekleme ekranı** (`/results/waiting`) — durum mesajları.
4. **Sonuç ekranı** (`/results`) — önerilen rutin (ikonlu adımlar).

Bu noktaya kadar kullanıcı **hiç hesap açmamış** durumda — bu doğru, dünkü karara uygun.

---

## 2. YENİ: Auth kapısı (sonuç ekranından sonra)

Sonuç ekranına yeni bir CTA eklenir: **"Rutinimi Kaydet ve Devam Et"**. Bu, ana uygulamaya (tab bar) geçişin tek kapısıdır.

5. **Kayıt Ol** (`/auth/sign-up`) — e-posta + şifre + (opsiyonel) ad. Anket cevapları ve rutin, hesaba bu adımda bağlanır (misafir olarak toplanan veri kayıp gitmez).
6. **Giriş Yap** (`/auth/login`) — e-posta + şifre. "Zaten hesabım var" durumundaki kullanıcılar için (örn. uygulamayı silip tekrar kurdu, yeni cihaz).
7. **Şifremi Unuttum** (`/auth/forgot-password`) — e-posta ile sıfırlama linki isteme.
8. **Şifre Sıfırlama** (`/auth/reset-password`) — e-postadaki linkten açılan yeni şifre belirleme ekranı.

**Açık karar (senin onayın gerekiyor):** E-posta doğrulama (kayıt sonrası "linke tıkla" adımı) Faz 1'e girsin mi, yoksa MVP'de atlanıp direkt giriş mi yapılsın? Doğrulama eklemek güvenlik/veri kalitesi açısından iyi ama bir ekran + backend akışı daha demek.

---

## 3. YENİ: Ana uygulama iskeleti (auth sonrası, bottom tab bar)

Expo Router'da ayrı bir `(tabs)` grubu olarak kurulur; onboarding/anket/auth stack'inden tamamen ayrı bir navigasyon köküdür.

### Sekme 1 — Ana Sayfa / Rutinim (varsayılan açılan sekme)

9. **Ana Sayfa** (`/(tabs)/home`) — bugünün sabah/akşam rutin adımları, her adım işaretlenebilir (checkbox), tamamlanma durumu.
10. **Rutin Adımı Detayı** (`/(tabs)/home/step/[id]`) — bir rutin adımına dokunulunca: aktif madde açıklaması, kullanım talimatı, (Faz 3'te ürün önerisi buraya eklenecek).

### Sekme 2 — Okumalar / İçerik

11. **Okumalar Listesi** (`/(tabs)/readings`) — cilt bakımı, aktif maddeler, güneş koruyucu vb. konularda kısa eğitici içerik kartları.
12. **Okuma Detayı** (`/(tabs)/readings/[id]`) — tek bir makalenin tam içeriği.

### Sekme 3 — Test Sonuçlarım / Geçmiş

13. **Sonuç Geçmişi** (`/(tabs)/history`) — kullanıcının bugüne kadar doldurduğu anket/analiz sonuçlarının listesi (tarih sırasına göre).
14. **Geçmiş Sonuç Detayı** (`/(tabs)/history/[id]`) — o tarihteki rutin/analiz sonucunun tam görünümü; (Faz 2'de fotoğraf bazlı analiz sonucu da buraya eklenecek).
15. **Yeni Analiz Başlat** — bu ekrandan, anketi (bölüm 1) tekrar başlatan bir CTA (cildin değiştiğini düşünen kullanıcı için).

### Sekme 4 — Profilim

16. **Profil Ana Ekranı** (`/(tabs)/profile`) — ad, e-posta, üyelik tarihi.
17. **Ayarlar** (`/(tabs)/profile/settings`) — bildirim tercihleri, tema (varsa), dil.
18. **Gizlilik / KVKK** (`/(tabs)/profile/privacy`) — rıza metnini tekrar görüntüleme, veri silme talebi.
19. **Hesabımı Sil** — KVKK gereği kullanıcının kendi verisini silme hakkı; ayrı bir onay akışı gerektirir.
20. **Çıkış Yap** — oturumu kapatıp `/onboarding`'e değil, `/auth/login`'e döner (rutin/cevaplar cihazda değil backend'de tutulduğu için).

---

## 4. Navigasyon mantığı (kritik — kodun `app/_layout.tsx`'inde karar verilecek)

Uygulama her açıldığında şu kontrol zinciri işler:

- **Geçerli oturum token'ı var mı?** (`expo-secure-store`'da saklanacak) → **Var** → doğrudan `(tabs)/home`.
- **Token yok ama cihazda tamamlanmamış bir anket taslağı var mı?** → o kaldığı yerden (`/questionnaire/flow`) devam.
- **Hiçbiri yok (ilk kurulum)** → `/onboarding`.

Bu üç yol, `app/index.tsx`'te (mevcut dosya) bir yönlendirme (redirect) mantığına dönüşecek — şu an `app/index.tsx` muhtemelen doğrudan onboarding'e gidiyor, bu değişecek.

---

## 5. Backend etkisi (Python/FastAPI)

Bu doküman sadece ekranları değil, arkasındaki gereksinimleri de değiştiriyor, açıkça belirtmek isterim. Backend artık **Python + FastAPI** ile yazılıyor; ilk kurulan Node.js/Express sürümü bire bir çevrildi, ortadan kaldırıldı.

**Dikkat — çözülmesi gereken bir çelişki var:** ADR-001 backend'i "Node.js/Express" olarak **kilitli** işaretliyor. Bu değişiklik o kararı geçersiz kılıyor, dolayısıyla `docs/adr.md`'ye yeni bir ADR (ADR-017) olarak işlenmesi gerekiyor. İşlenmezse ADR dosyası kodla çelişir durumda kalır.

### API sözleşmesi değişmedi

Uçların yolları, istek/yanıt gövdeleri, HTTP durum kodları ve hata gövdeleri (`{ code, message }`) Express sürümüyle **birebir aynı**. Bu bilinçli bir kısıt: RN tarafında tek satır değişmesin diye. `src/services/httpClient.ts`, `authApi.ts` ve `api.ts` olduğu gibi çalışıyor.

| Uç                                  | Durum                                              |
| ----------------------------------- | -------------------------------------------------- |
| `POST /api/auth/sign-up`            | çalışıyor                                          |
| `POST /api/auth/login`              | çalışıyor                                          |
| `POST /api/routine-history`         | çalışıyor (token zorunlu)                          |
| `GET /api/routine-history/latest`   | çalışıyor (token zorunlu)                          |
| `GET /api/routine-progress?date=`   | çalışıyor (token zorunlu)                          |
| `POST /api/routine-progress/toggle` | çalışıyor (token zorunlu)                          |
| `POST /api/auth/forgot-password`    | henüz yok (bkz. bölüm 2, madde 7)                  |
| `POST /api/auth/reset-password`     | henüz yok (bkz. bölüm 2, madde 8)                  |
| `POST /api/onboarding`              | henüz yok — `src/services/mockApi.ts` kullanılıyor |

### Kütüphane karşılıkları

| Express sürümünde       | FastAPI sürümünde                                                               |
| ----------------------- | ------------------------------------------------------------------------------- |
| Express                 | FastAPI + Uvicorn                                                               |
| Zod (doğrulama)         | Pydantic v2                                                                     |
| Prisma Client           | SQLAlchemy 2.0                                                                  |
| Prisma Migrate          | Alembic                                                                         |
| `jsonwebtoken`          | PyJWT — aynı algoritma (HS256), aynı payload (`userId`), aynı ömür (30 gün)     |
| `bcrypt` (npm)          | `bcrypt` (PyPI) — aynı algoritma, aynı 12 tur                                   |
| `cors`                  | FastAPI `CORSMiddleware`                                                        |
| `dotenv`                | `python-dotenv`                                                                 |
| `utils/asyncHandler.ts` | karşılığı yok, gerekmiyor — FastAPI reddedilen promise sorununu kendisi çözüyor |

Klasör düzeni de korundu: `routes/` → `app/routers/`, `controllers/` → `app/controllers/`, `types/` → `app/schemas/`, `middleware/` → `app/middleware/`, `utils/` → `app/utils/`, `prisma/schema.prisma` → `app/models.py`.

### FastAPI'ye özel, atlanmaması gereken üç nokta

Bunlar Express'te bedava gelen ama FastAPI'de elle kurulması gereken şeyler — atlanırsa sessizce bozulurlar:

1. **Hata gövdesi elle geri çekilmeli.** FastAPI doğrulama hatasında `422` + `{ "detail": [...] }`, bilinmeyen route'ta `404` + `{ "detail": "Not Found" }` döner. RN istemcisi ise her hatayı `{ code, message }` olarak okuyor (`httpClient.ts`). `app/middleware/error_handler.py` dört ayrı işleyici kaydederek gövdeyi ve durum kodunu (doğrulama = `400`) Express'in döndüğü hâle geri çekiyor. Atlanırsa ekranlardaki hata mesajları sessizce boşalır.
2. **Doğrulama mesajları Türkçe kalmalı.** Zod'daki mesajlar ("Sifre en az 8 karakter olmali." gibi) kullanıcıya doğrudan gösteriliyor. Pydantic'in İngilizce varsayılanları kullanılamazdı; mesajlar `app/schemas/base.py`'deki doğrulayıcılarda harfi harfine korundu.
3. **SQLite yabancı anahtar kontrolü elle açılmalı.** Prisma bunu kendi bağlantılarında açıyordu, SQLite'ta varsayılan KAPALI. `app/db.py` her bağlantıda `PRAGMA foreign_keys=ON` çalıştırıyor — yoksa silinmiş bir kullanıcıya ait rutin kaydı sessizce yazılır ve o uçtaki `401` dalı hiç çalışmazdı.

### Veri modeli (değişmedi)

`User`, `RoutineHistory` (geçmiş sonuçlar), `RoutineProgress` (günlük checklist durumu). Tablo ve kolon adları Prisma'nın ürettiğiyle birebir aynı tutuldu (camelCase kolonlar, yabancı anahtar ve benzersiz indeks adları dahil), bu yüzden eldeki `dev.db` dosyası `alembic stamp head` ile olduğu gibi devralınabiliyor.

### Hâlâ gereken işler

- JWT oturum token'ı üretimi ve `expo-secure-store` ile cihazda saklama: **tamam** (`src/store/useAuthStore.ts`).
- Misafirken toplanan anket cevaplarının/rutinin kayıt anında hesaba bağlanması (guest → user migration): **tamam** (`useAuthStore.ts` içindeki `syncGuestRoutineIfPresent`).
- Şifre sıfırlama akışı (bölüm 2, madde 7-8): **açık**. Uçların kendisi kolay, ama e-posta gönderimi bir dış servis kararı gerektiriyor (SMTP / Resend / SES) ve bu karar henüz verilmedi.
- Backend'de otomatik test yok. Express sürümünde de yoktu; sözleşme artık iki dilde birden tutulmadığı için `pytest` + FastAPI `TestClient` ile uçları kilitlemek düşük maliyetli bir kazanç olurdu.

---

## 6. Faz 2 / Faz 3 ile bağlantı (şimdi kodlanmayacak, sadece yer ayrılıyor)

- **Faz 2:** Fotoğraf bazlı AI analiz sonucu → "Test Sonuçlarım" sekmesindeki detay ekranına eklenecek (cilt haritası/skor görseli).
- **Faz 3:** Ürün kataloğu → "Ana Sayfa"daki her rutin adımına "Ürünü Gör" CTA'sı + muhtemelen ayrı bir "Mağaza" sekmesi (5. sekme). Bottom tab bar'ı şimdiden 5 sekmeye hazır tasarlamak (4 dolu + genişlemeye açık) ileride ekran değişikliğini kolaylaştırır.

---

## Özet — karar bekleyen tek açık nokta

E-posta doğrulama adımı (Bölüm 2, madde 5 altındaki not) dışında yukarıdaki liste dünkü kararlarının doğrudan sonucu. Onaylarsan:

1. Bu dokümanı `docs/adr.md`'ye ADR-009 olarak işlerim.
2. `app/(tabs)/` grubunu ve auth ekranlarının iskeletini (henüz backend'siz, sahte/mock veriyle) kodlamaya başlarım.

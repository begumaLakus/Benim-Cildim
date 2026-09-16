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

## 5. Backend etkisi (Node.js/Express — zaten kilitli stack)

Bu doküman sadece ekranları değil, arkasındaki gereksinimleri de değiştiriyor, açıkça belirtmek isterim:

- `POST /auth/sign-up`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password` uçları.
- JWT (veya benzeri) oturum token'ı üretimi + `expo-secure-store` ile cihazda saklama.
- Misafirken toplanan anket cevaplarının/rutinin, kayıt anında kullanıcı hesabına bağlanması (guest → user migration).
- Kullanıcı bazlı veri modeli: `User`, `RoutineHistory` (geçmiş sonuçlar), `RoutineProgress` (günlük checklist durumu).

---

## 6. Faz 2 / Faz 3 ile bağlantı (şimdi kodlanmayacak, sadece yer ayrılıyor)

- **Faz 2:** Fotoğraf bazlı AI analiz sonucu → "Test Sonuçlarım" sekmesindeki detay ekranına eklenecek (cilt haritası/skor görseli).
- **Faz 3:** Ürün kataloğu → "Ana Sayfa"daki her rutin adımına "Ürünü Gör" CTA'sı + muhtemelen ayrı bir "Mağaza" sekmesi (5. sekme). Bottom tab bar'ı şimdiden 5 sekmeye hazır tasarlamak (4 dolu + genişlemeye açık) ileride ekran değişikliğini kolaylaştırır.

---

## Özet — karar bekleyen tek açık nokta

E-posta doğrulama adımı (Bölüm 2, madde 5 altındaki not) dışında yukarıdaki liste dünkü kararlarının doğrudan sonucu. Onaylarsan:

1. Bu dokümanı `docs/adr.md`'ye ADR-009 olarak işlerim.
2. `app/(tabs)/` grubunu ve auth ekranlarının iskeletini (henüz backend'siz, sahte/mock veriyle) kodlamaya başlarım.

/**
 * Benim Cildim — sabit tasarım sistemi renk paleti.
 *
 * Bu değerler kilitlenmiştir; yeni bir renk eklemek veya bir hex kodunu
 * değiştirmek mimari bir karardır — sessizce değiştirme, kullanıcıya sor.
 */
export const colors = {
  /** Zemin (%60) */
  background: '#F9F8F6',
  /** Kart / yüzey (%30) */
  surface: '#EFEAE1',
  /** Aksan / CTA (%10) */
  accent: '#8C7A6B',
  /** Başlık / ana metin — açık zemin üzeri. Asla saf siyah kullanma. */
  textPrimary: '#262220',
  /** Metin — koyu/aksan zemin üzeri (örn. seçili buton) */
  textOnAccent: '#FFFFFF',
  /** Pasif / ikincil metin */
  textSecondary: '#7A7571',
  /** Küçük metinde okunabilirlik için tercih edilen ikincil metin tonu */
  textSecondarySmall: '#6E6966',
  /**
   * SONRADAN EKLENDİ (ADR-009 kapsamında, auth formlarıyla birlikte).
   * Orijinal 5 renkli palette form validasyon hatası (örn. "bu e-posta
   * zaten kayıtlı", "şifre en az 8 karakter") gibi bir durum yoktu —
   * anket sadece seçim kartlarından oluşuyordu. Paletin sıcak/toprak
   * tonlarıyla uyumlu, doygunluğu düşük bir kırmızı seçildi; parlak/saf
   * kırmızıdan kaçınıldı ki tasarım dilinden kopmasın.
   */
  error: '#A9443E',
} as const;

/**
 * SONRADAN EKLENDİ — orijinal 5 renkli palette dahil değildi. Kullanıcının
 * başta düşündüğü 3 pembe ton (proje yöneticisi de onayladı): auth
 * sonrası ana uygulama alanında (`(tabs)` grubu — Ana Sayfa/Okumalar/
 * Sonuçlarım/Profilim) DENEME amaçlı kullanılıyor. Onboarding/anket akışı
 * (kilitli 5 renkli palette) BİLİNÇLİ OLARAK BUNA DOKUNMUYOR — kullanıcı
 * "anket kısmı güzel, o değişmesin" dedi. Şu an sadece Profilim ekranında
 * deneniyor; beğenilirse diğer 3 tab ekranına da uygulanacak.
 */
export const tabColors = {
  /** En açık ton — ekran zemini. */
  background: '#F4DBD8',
  /** Orta ton — kart/yüzey (background'dan ayrışsın diye biraz daha koyu). */
  surface: '#BEA8A7',
  /** En doygun ton — rozet/avatar gibi küçük vurgu noktaları. CTA/buton
   * rengi olarak KULLANILMIYOR; marka bütünlüğü için butonlar hâlâ
   * `colors.accent` (kahve) kullanıyor. */
  highlight: '#C09891',
} as const;

export type ColorToken = keyof typeof colors;

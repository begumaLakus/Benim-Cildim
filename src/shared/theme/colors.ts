/** Sabit tasarım sistemi renk paleti — sessizce değiştirme, kullanıcıya sor. */
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
  /** Form validasyon hatası — paletin sıcak tonlarına uyumlu, doygunluğu düşük kırmızı. */
  error: '#A9443E',
} as const;

/** Auth sonrası ana uygulama alanında ((tabs) grubu) kullanılan deneme pembe palet — onboarding/anket akışını etkilemez. */
export const tabColors = {
  /** En açık ton — ekran zemini. */
  background: '#F4DBD8',
  /** Orta ton — kart/yüzey (background'dan ayrışsın diye biraz daha koyu). */
  surface: '#BEA8A7',
  /** En doygun ton — rozet/vurgu noktaları. CTA/buton rengi olarak kullanılmıyor. */
  highlight: '#C09891',
} as const;

export type ColorToken = keyof typeof colors;

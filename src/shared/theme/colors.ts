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
} as const;

export type ColorToken = keyof typeof colors;

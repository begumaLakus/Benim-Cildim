/** 4px temelli boşluk ölçeği. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Seçenek kartı yüksekliği: tasarım sistemi 48-52px olarak sabitlemiş.
 * Varsayılan olarak aralığın ortası kullanılır.
 */
export const optionCardHeight = 50;

/** Kart/seçenek köşe yarıçapı — sabit, organik/damla süsleme yok. */
export const borderRadius = {
  card: 16,
  button: 16,
} as const;

/**
 * Tasarım sisteminde gölge kullanılmaz; gerektiğinde bu düz "elevation"
 * değeri (opacity 0.04, radius 8) kullanılır, native shadow/elevation değil.
 */
export const flatElevation = {
  opacity: 0.04,
  radius: 8,
} as const;

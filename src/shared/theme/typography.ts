/** Font aileleri ve tipografi ölçeği. Cormorant Garamond SADECE başlıklarda — tıklanabilir alanlar hep Inter kullanır. */
export const fontFamily = {
  headingSemiBold: 'CormorantGaramond_600SemiBold',
  headingMedium: 'CormorantGaramond_500Medium',
  bodyRegular: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 26,
  xl: 30,
  xxl: 36,
  display: 42,
} as const;

export type FontFamilyToken = keyof typeof fontFamily;
export type FontSizeToken = keyof typeof fontSize;

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight } from '../theme';

/**
 * Tipografi varyantları.
 *
 * ÖNEMLİ: 'display' ve 'heading' varyantları Cormorant Garamond kullanır ve
 * SADECE başlıklarda kullanılmalıdır — buton, form alanı, seçenek kartı gibi
 * tıklanabilir yüzeylerin içinde asla kullanılmaz. Tıklanabilir alanlarda
 * her zaman 'body' veya 'bodyMedium' kullan.
 */
export type TextVariant = 'display' | 'heading' | 'body' | 'bodyMedium' | 'caption';

export interface AppTextProps extends RNTextProps {
  variant?: TextVariant;
  /** Aksan/koyu zemin üzerinde kullanılacaksa true yap (beyaz metin). */
  onAccent?: boolean;
  /** İkincil (pasif) metin rengi kullan. */
  secondary?: boolean;
}

const variantStyles = StyleSheet.create({
  display: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
    color: colors.textPrimary,
  },
  heading: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: fontSize.xxl,
    lineHeight: lineHeight.xxl,
    color: colors.textPrimary,
  },
  body: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.textPrimary,
  },
  bodyMedium: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.textPrimary,
  },
  caption: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textSecondarySmall,
  },
});

/**
 * Tasarım sistemine bağlı tek metin bileşeni. Başlık fontu (Cormorant
 * Garamond) ile gövde fontu (Inter) arasındaki ayrımı burada zorunlu kılar.
 */
export function Text({ variant = 'body', onAccent, secondary, style, ...rest }: AppTextProps) {
  return (
    <RNText
      style={[
        variantStyles[variant],
        onAccent && { color: colors.textOnAccent },
        secondary && !onAccent && { color: colors.textSecondary },
        style,
      ]}
      {...rest}
    />
  );
}

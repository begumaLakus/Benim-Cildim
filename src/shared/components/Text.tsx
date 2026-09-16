import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight } from '../theme';

/** 'display'/'heading' Cormorant Garamond kullanır, SADECE başlıklarda — tıklanabilir alanlarda 'body'/'bodyMedium' kullan. */
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

/** Tasarım sistemine bağlı tek metin bileşeni — başlık/gövde font ayrımını burada zorunlu kılar. */
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

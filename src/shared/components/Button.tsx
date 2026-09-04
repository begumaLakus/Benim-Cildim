import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { borderRadius, colors, fontFamily, fontSize, spacing } from '../theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  /**
   * Birincil buton dolgulu/aksan renkli olur (varsayılan). İkincil buton
   * outline'dır — tasarım sistemi kuralı: aynı ekranda iki birincil buton
   * aynı görsel ağırlıkta olmamalı.
   */
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Tasarım sistemindeki tek buton bileşeni.
 * - Birincil: dolgulu, aksan renk zemin, beyaz metin, Inter Medium.
 * - İkincil: outline, şeffaf zemin, textPrimary renginde metin.
 * Buton metni HER ZAMAN Inter kullanır — Cormorant Garamond asla.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  testID,
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.textOnAccent : colors.accent} />
      ) : (
        <Text
          variant="bodyMedium"
          onAccent={isPrimary}
          style={isPrimary ? undefined : styles.secondaryLabel}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  secondaryLabel: {
    color: colors.textPrimary,
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.md,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
});

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { borderRadius, colors, optionCardHeight, spacing } from '../theme';
import { Text } from './Text';

export interface OptionCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}

/**
 * Anket / seçim ekranlarındaki tekil seçenek satırı.
 * Tasarım sistemi kuralı: yükseklik 48-52px, borderRadius 16, düz kart —
 * gölge veya organik süsleme yok. Seçiliyken aksan zemin + beyaz metin.
 */
export function OptionCard({ label, selected, onPress, testID }: OptionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      testID={testID}
      style={[styles.base, selected ? styles.selected : styles.unselected]}
    >
      <Text variant="bodyMedium" onAccent={selected}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: optionCardHeight,
    borderRadius: borderRadius.card,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.accent,
  },
  unselected: {
    backgroundColor: colors.surface,
  },
});

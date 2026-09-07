import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';

export interface StepHeaderProps {
  stepNumber: number;
  totalSteps: number;
  onBack: () => void;
  /**
   * 'light' normal (açık zemin) soru ekranları için; 'dark' kamera gibi
   * koyu/dolu ekranların üzerine bindirilen başlık için kullanılır — aynı
   * geri + ilerleme çubuğu deseni, iki zeminde de estetik tutarlılık sağlar.
   */
  tone?: 'light' | 'dark';
}

/**
 * Tüm anket adımlarında ortak: geri oku + ilerleme çubuğu + "x/y" sayacı.
 * Kullanıcının akışta nerede olduğunu her ekranda tutarlı şekilde gösterir.
 */
export function StepHeader({ stepNumber, totalSteps, onBack, tone = 'light' }: StepHeaderProps) {
  const isDark = tone === 'dark';
  const progress = Math.min(1, Math.max(0, stepNumber / totalSteps));

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Geri"
        hitSlop={12}
        onPress={onBack}
        style={styles.backButton}
      >
        <Text variant="heading" onAccent={isDark} style={styles.backGlyph}>
          ‹
        </Text>
      </Pressable>
      <View style={[styles.track, isDark && styles.trackDark]}>
        <View style={[styles.fill, isDark && styles.fillDark, { width: `${progress * 100}%` }]} />
      </View>
      <Text variant="caption" onAccent={isDark} style={styles.count}>
        {stepNumber}/{totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: {
    lineHeight: 28,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  trackDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  fillDark: {
    backgroundColor: colors.textOnAccent,
  },
  count: {
    minWidth: 32,
    textAlign: 'right',
  },
});

import { Ionicons } from '@react-native-vector-icons/ionicons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../shared/components';
import { colors, spacing, tabColors } from '../../../shared/theme';

export interface RoutineProgressBarProps {
  completed: number;
  total: number;
  /** Tamamlanan sekmenin adı (örn. "sabah") — kutlama mesajında kullanılır. */
  slotLabel: string;
}

/** Aktif sekmedeki ilerlemeyi gösterir. `total === 0` durumunda hiçbir şey çizmez. */
export function RoutineProgressBar({ completed, total, slotLabel }: RoutineProgressBarProps) {
  if (total === 0) return null;

  const ratio = completed / total;
  const isComplete = completed === total;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text variant="caption" secondary>
          {completed}/{total} adım tamamlandı
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(ratio * 100)}%` }]} />
      </View>
      {isComplete ? (
        <View style={styles.celebration}>
          <Ionicons name="checkmark-circle" size={16} color={tabColors.highlight} />
          <Text variant="caption" style={styles.celebrationLabel}>
            Bugünkü {slotLabel} rutinini tamamladın
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const TRACK_HEIGHT = 6;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  row: {
    marginBottom: spacing.xs,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: tabColors.highlight,
  },
  celebration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  celebrationLabel: {
    color: colors.textPrimary,
  },
});

import { Ionicons } from '@react-native-vector-icons/ionicons';
import type { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from './Card';
import { Text } from './Text';
import { borderRadius, colors, spacing } from '../theme';
import { RoutineStep } from '../../types';

/** Ürün kategorisine göre temsili ikon. Bilinmeyen kategori `DEFAULT_CATEGORY_ICON`'a düşer, çökmez. */
const CATEGORY_ICONS: Record<string, IoniconsIconName> = {
  Temizleyici: 'water-outline',
  Serum: 'flask-outline',
  'Güneş koruyucu': 'sunny-outline',
  Nemlendirici: 'leaf-outline',
};

const DEFAULT_CATEGORY_ICON: IoniconsIconName = 'sparkles-outline';

export function RoutineStepRow({ step }: { step: RoutineStep }) {
  const icon = CATEGORY_ICONS[step.productCategory] ?? DEFAULT_CATEGORY_ICON;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconBadge}>
          <Ionicons name={icon} size={22} color={colors.accent} />
        </View>
        <View style={styles.content}>
          <Text variant="caption">
            {step.order}. adım · {step.productCategory}
          </Text>
          <Text variant="bodyMedium" style={styles.ingredient}>
            {step.activeIngredient}
          </Text>
          <Text variant="body" secondary>
            {step.instructions}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.card,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  ingredient: {
    marginTop: 2,
    marginBottom: spacing.xs,
  },
});

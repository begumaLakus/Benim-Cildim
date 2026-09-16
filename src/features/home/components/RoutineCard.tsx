import { Ionicons } from '@react-native-vector-icons/ionicons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AffiliatedProduct, ProductSlot } from './ProductSlot';
import { Card, Text } from '../../../shared/components';
import { colors, spacing, tabColors } from '../../../shared/theme';
import { RoutineStep } from '../../../types';

export interface RoutineCardProps {
  step: RoutineStep;
  completed: boolean;
  onToggleComplete: () => void;
  /** Dolarsa kartın altında kompakt bir ürün satırı açılır (bkz. ProductSlot). */
  affiliatedProduct?: AffiliatedProduct;
  /** Doluysa adımın altında "neden önerildi" açıklaması gösterilir. */
  reason?: string | null;
}

/** Rutinim'deki tek rutin adımı kartı. `RoutineStepRow`'dan ayrı, sadece Rutinim'e özel. */
export function RoutineCard({
  step,
  completed,
  onToggleComplete,
  affiliatedProduct,
  reason,
}: RoutineCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.info}>
          <Text variant="caption" secondary>
            {step.order}. Adım · {step.productCategory}
          </Text>
          <Text variant="bodyMedium" style={styles.ingredient}>
            {step.activeIngredient}
          </Text>
          <Text variant="body" secondary style={styles.instructions}>
            {step.instructions}
          </Text>
          {reason ? (
            <View style={styles.reasonRow}>
              <Ionicons name="sparkles-outline" size={13} color={colors.textSecondary} />
              <Text variant="caption" style={styles.reasonLabel}>
                {reason}
              </Text>
            </View>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: completed }}
          accessibilityLabel={`${step.activeIngredient} tamamlandı olarak işaretle`}
          hitSlop={8}
          onPress={onToggleComplete}
          style={[styles.checkbox, completed && styles.checkboxChecked]}
        >
          {completed ? <Ionicons name="checkmark" size={15} color={colors.textOnAccent} /> : null}
        </Pressable>
      </View>
      {affiliatedProduct ? <ProductSlot product={affiliatedProduct} /> : null}
    </Card>
  );
}

const CHECKBOX_SIZE = 26;

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  info: {
    flex: 1,
  },
  ingredient: {
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  instructions: {
    lineHeight: 20,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  reasonLabel: {
    flex: 1,
    color: colors.textSecondary,
  },
  checkbox: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderRadius: CHECKBOX_SIZE / 2,
    borderWidth: 1.5,
    borderColor: tabColors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: tabColors.highlight,
    borderColor: tabColors.highlight,
  },
});

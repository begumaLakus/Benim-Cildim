import React from 'react';
import { StyleSheet } from 'react-native';

import { Card, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { RoutineStep } from '../../../types';

export function RoutineStepRow({ step }: { step: RoutineStep }) {
  return (
    <Card style={styles.card}>
      <Text variant="caption">
        {step.order}. adım · {step.productCategory}
      </Text>
      <Text variant="bodyMedium" style={styles.ingredient}>
        {step.activeIngredient}
      </Text>
      <Text variant="body" secondary>
        {step.instructions}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  ingredient: {
    marginTop: 2,
    marginBottom: spacing.xs,
  },
});

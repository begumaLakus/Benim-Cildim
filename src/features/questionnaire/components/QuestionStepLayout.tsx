import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { StepHeader } from './StepHeader';

export interface QuestionStepLayoutProps {
  stepNumber: number;
  totalSteps: number;
  onBack: () => void;
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onCta: () => void;
}

export function QuestionStepLayout({
  stepNumber,
  totalSteps,
  onBack,
  title,
  subtitle,
  ctaLabel,
  ctaDisabled,
  onCta,
  children,
}: PropsWithChildren<QuestionStepLayoutProps>) {
  return (
    <ScreenContainer scrollable>
      <StepHeader stepNumber={stepNumber} totalSteps={totalSteps} onBack={onBack} />
      <View style={styles.body}>
        <Text variant="heading">{title}</Text>
        {subtitle ? (
          <Text variant="body" secondary style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
        <View style={styles.content}>{children}</View>
      </View>
      <Button label={ctaLabel} onPress={onCta} disabled={ctaDisabled} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  content: {
    gap: spacing.sm,
  },
});

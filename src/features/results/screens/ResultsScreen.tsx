import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { RoutineStepRow } from '../components/RoutineStepRow';

export function ResultsScreen() {
  const router = useRouter();
  const recommendation = useOnboardingStore((state) => state.recommendation);
  const reset = useOnboardingStore((state) => state.reset);

  const handleRestart = () => {
    reset();
    router.replace(routes.onboardingWelcome);
  };

  if (!recommendation) {
    return (
      <ScreenContainer>
        <Text variant="body">Bir öneri bulunamadı.</Text>
        <Button label="Baştan Başla" onPress={handleRestart} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <Text variant="heading">Rutinin hazır</Text>
      <Text variant="body" secondary style={styles.subtitle}>
        İçerik/aktif madde bazlı önerilerdir; marka önerisi Faz 1&apos;de yer almaz.
      </Text>

      <View style={styles.section}>
        <Text variant="bodyMedium" style={styles.sectionTitle}>
          Sabah Rutini
        </Text>
        {recommendation.routine.morning.map((step) => (
          <RoutineStepRow key={step.id} step={step} />
        ))}
      </View>

      <View style={styles.section}>
        <Text variant="bodyMedium" style={styles.sectionTitle}>
          Akşam Rutini
        </Text>
        {recommendation.routine.evening.map((step) => (
          <RoutineStepRow key={step.id} step={step} />
        ))}
      </View>

      <Button label="Baştan Başla" variant="secondary" onPress={handleRestart} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
});

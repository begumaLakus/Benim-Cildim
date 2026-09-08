import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, RoutineStepRow, ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { useOnboardingStore } from '../../../store/useOnboardingStore';

/**
 * NOT (ADR-009): "Rutinimi Kaydet ve Devam Et" auth kapısının tek girişidir.
 * Backend'de henüz bir `RoutineHistory` yazma ucu yok (bkz. ADR-009, madde 7)
 * — bu yüzden şu an hesap oluşturulduğunda öneri sadece bu oturumdaki
 * Zustand store'da taşınıyor, uygulama kapanıp açılırsa kaybolur. Bu uç
 * eklenince burada (ve SignUpScreen'de) rutini backend'e POST eden bir
 * çağrı eklenecek.
 */
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

      <View style={styles.actions}>
        <Button
          label="Rutinimi Kaydet ve Devam Et"
          onPress={() => router.push(routes.authSignUp)}
        />
        <Button
          label="Zaten hesabım var"
          variant="secondary"
          onPress={() => router.push(routes.authLogin)}
        />
        <Button label="Baştan Başla" variant="secondary" onPress={handleRestart} />
      </View>
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
  actions: {
    gap: spacing.sm,
  },
});

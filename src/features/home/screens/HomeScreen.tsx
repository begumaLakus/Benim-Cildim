import React from 'react';
import { StyleSheet, View } from 'react-native';

import { RoutineStepRow, ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { useOnboardingStore } from '../../../store/useOnboardingStore';

/**
 * NOT: Backend'de henüz bir "kullanıcının kayıtlı rutinini getir" ucu yok
 * (RoutineHistory sadece yazmaya hazır, okumaya değil — bkz. ADR-009).
 * Bu yüzden burada gösterilen rutin, sadece bu oturumda anketi doldurup
 * hesap açan kullanıcı için Zustand'dan geliyor — uygulama yeniden
 * başlatılırsa (örn. token'la otomatik giriş sonrası) kaybolur. O uç
 * eklenince burada bir `useEffect` ile backend'den çekilecek.
 */
export function HomeScreen() {
  const recommendation = useOnboardingStore((state) => state.recommendation);

  if (!recommendation) {
    return (
      <ScreenContainer>
        <View style={styles.emptyState}>
          <Text variant="heading">Henüz bir rutinin yok</Text>
          <Text variant="body" secondary style={styles.emptyNote}>
            Rutin geçmişini backend&apos;den getirme özelliği henüz eklenmedi — bu ekranı bu
            oturumda anketi tamamlayarak test edebilirsin.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <Text variant="heading" style={styles.title}>
        Bugünkü Rutinin
      </Text>

      <View style={styles.section}>
        <Text variant="bodyMedium" style={styles.sectionTitle}>
          Sabah
        </Text>
        {recommendation.routine.morning.map((step) => (
          <RoutineStepRow key={step.id} step={step} />
        ))}
      </View>

      <View style={styles.section}>
        <Text variant="bodyMedium" style={styles.sectionTitle}>
          Akşam
        </Text>
        {recommendation.routine.evening.map((step) => (
          <RoutineStepRow key={step.id} step={step} />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyNote: {
    marginTop: spacing.xs,
  },
});

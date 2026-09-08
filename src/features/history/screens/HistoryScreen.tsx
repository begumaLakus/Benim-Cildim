import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';

/**
 * YER TUTUCU: gecmis anket/rutin sonuclarinin listesi. Backend'de
 * `RoutineHistory` modeli var (bkz. backend/prisma/schema.prisma) ama okuma
 * ucu (GET /api/routine-history) henuz yazilmadi — ADR-009, madde 7.
 */
export function HistoryScreen() {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text variant="heading">Test Sonuçlarım</Text>
        <Text variant="body" secondary style={styles.note}>
          Geçmiş anket ve analiz sonuçların, backend&apos;deki okuma ucu eklenince burada
          listelenecek.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  note: {
    marginTop: spacing.xs,
  },
});

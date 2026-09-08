import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';

/**
 * YER TUTUCU: içerik/makale listesi ve backend ucu henüz yok (ADR-009'da
 * sekme olarak kararlaştırıldı, içerik üretimi ayrı bir iş paketi).
 */
export function ReadingsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text variant="heading">Okumalar</Text>
        <Text variant="body" secondary style={styles.note}>
          Cilt bakımı ve aktif maddeler hakkında eğitici içerikler yakında burada olacak.
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

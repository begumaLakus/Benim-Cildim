import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, tabColors } from '../theme';

export interface ScreenContainerProps {
  scrollable?: boolean;
  style?: ViewStyle;
  /** 'default' (kilitli palet) veya 'tabs' (deneme pembe palet, sadece auth sonrası ekranlar). */
  tone?: 'default' | 'tabs';
}

/** Tüm Faz 1 ekranlarının ortak zemin sarmalayıcısı — sabit background rengi ve kenar dolgusu. */
export function ScreenContainer({
  children,
  scrollable = false,
  style,
  tone = 'default',
}: PropsWithChildren<ScreenContainerProps>) {
  const backgroundColor = tone === 'tabs' ? tabColors.background : colors.background;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top', 'bottom']}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, style]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  // NOT: burada `flex: 1` değil `flexGrow: 1` kullan — flex: 1 taşan içeriğin kaydırılmasını engeller.
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
});

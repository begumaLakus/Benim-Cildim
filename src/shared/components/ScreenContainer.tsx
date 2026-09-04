import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';

export interface ScreenContainerProps {
  scrollable?: boolean;
  style?: ViewStyle;
}

/**
 * Tüm Faz 1 ekranlarının ortak zemin sarmalayıcısı: sabit `background`
 * rengi ve kenar dolgusu. Ekranlar arasında tutarlı bir yerleşim sağlar.
 */
export function ScreenContainer({
  children,
  scrollable = false,
  style,
}: PropsWithChildren<ScreenContainerProps>) {
  const Wrapper = scrollable ? ScrollView : View;
  const wrapperProps = scrollable
    ? { contentContainerStyle: [styles.content, style] }
    : { style: [styles.content, style] };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Wrapper {...wrapperProps}>{children}</Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
});

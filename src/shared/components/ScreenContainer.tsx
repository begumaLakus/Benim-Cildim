import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, tabColors } from '../theme';

export interface ScreenContainerProps {
  scrollable?: boolean;
  style?: ViewStyle;
  /**
   * 'default' (kilitli 5 renkli palette, onboarding/anket/auth) veya
   * 'tabs' (deneme aşamasındaki pembe tonlar, sadece auth sonrası ana
   * uygulama ekranlarında — bkz. `theme/colors.ts` içindeki `tabColors`
   * yorumu). Varsayılan 'default' — bilerek, mevcut ekranların hiçbiri
   * bunu belirtmeden pembeye kaymasın.
   */
  tone?: 'default' | 'tabs';
}

/**
 * Tüm Faz 1 ekranlarının ortak zemin sarmalayıcısı: sabit `background`
 * rengi ve kenar dolgusu. Ekranlar arasında tutarlı bir yerleşim sağlar.
 */
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
  // NOT: ScrollView'in contentContainerStyle'ında `flex: 1` KULLANMA — içerik
  // ekran boyuna sabitlenip taşan kısmın kaydırılmasını engeller. Kısa
  // içerikte de üstte yığılmayı önlemek için `flexGrow: 1` yeterli.
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
});

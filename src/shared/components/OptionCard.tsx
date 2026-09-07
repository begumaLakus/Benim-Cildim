import { Ionicons } from '@react-native-vector-icons/ionicons';
import type { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { borderRadius, colors, optionCardHeight, spacing } from '../theme';
import { Text } from './Text';

export interface OptionCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /**
   * Bazı sorularda (örn. cilt tipi, cilt endişeleri) seçeneği görsel olarak
   * güçlendirmek için opsiyonel bir ikon — tüm sorularda değil, sadece
   * görselin gerçekten anlam kattığı birkaçında kullanılıyor. Tasarım
   * sisteminin kilitli renk paletiyle uyumlu kalması için ikon her zaman
   * metinle aynı rengi kullanır (referans aldığımız örnekteki gibi renkli/
   * çok renkli bir ikon seti değil) — seçiliyken beyaz, değilken ana metin
   * rengi.
   */
  icon?: IoniconsIconName;
  testID?: string;
}

/**
 * Anket / seçim ekranlarındaki tekil seçenek satırı.
 * Tasarım sistemi kuralı: yükseklik 48-52px, borderRadius 16, düz kart —
 * gölge veya organik süsleme yok. Seçiliyken aksan zemin + beyaz metin.
 */
export function OptionCard({ label, selected, onPress, icon, testID }: OptionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      testID={testID}
      style={[styles.base, selected ? styles.selected : styles.unselected]}
    >
      <View style={styles.row}>
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={selected ? colors.textOnAccent : colors.textPrimary}
          />
        ) : null}
        <Text variant="bodyMedium" onAccent={selected}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: optionCardHeight,
    borderRadius: borderRadius.card,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selected: {
    backgroundColor: colors.accent,
  },
  unselected: {
    backgroundColor: colors.surface,
  },
});

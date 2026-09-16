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

  icon?: IoniconsIconName;
  testID?: string;
}

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

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../shared/components';
import { borderRadius, colors } from '../../../shared/theme';

export interface ConsentCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
}

/**
 * KVKK açık rıza onayı için kullanılan onay kutusu. Onboarding'de fotoğraf
 * çekimine geçmeden önce bu onay zorunludur.
 */
export function ConsentCheckbox({ checked, onToggle, label }: ConsentCheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? (
          <Text variant="bodyMedium" onAccent>
            ✓
          </Text>
        ) : null}
      </View>
      <Text variant="body" style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.button / 4,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  boxChecked: {
    backgroundColor: colors.accent,
  },
  label: {
    flex: 1,
  },
});

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
 * KVKK açık rıza onayı — onboarding'de fotoğraf çekimine geçmeden önce zorunlu.
 * Bilinçli olarak küçük boyutta: CTA'yı gölgede bırakmasın, metin kısaltılmadı.
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
          <Text variant="caption" onAccent>
            ✓
          </Text>
        ) : null}
      </View>
      <Text variant="caption" secondary style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: borderRadius.button / 4,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxChecked: {
    backgroundColor: colors.accent,
  },
  label: {
    flex: 1,
  },
});

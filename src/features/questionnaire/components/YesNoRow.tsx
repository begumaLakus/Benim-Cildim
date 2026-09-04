import React from 'react';
import { StyleSheet, View } from 'react-native';

import { OptionCard } from '../../../shared/components';

export interface YesNoRowProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export function YesNoRow({ value, onChange }: YesNoRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.option}>
        <OptionCard label="Evet" selected={value === true} onPress={() => onChange(true)} />
      </View>
      <View style={styles.option}>
        <OptionCard label="Hayır" selected={value === false} onPress={() => onChange(false)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
  },
});

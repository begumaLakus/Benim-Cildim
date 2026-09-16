import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { borderRadius, colors, fontFamily, fontSize, spacing } from '../theme';
import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  /** Doluysa kırmızı çerçeve + hata metni gösterir (örn. "Şifre en az 8 karakter olmalı"). */
  errorMessage?: string;
  testID?: string;
}

/** Metin girişi bileşeni — buton yüksekliği/border radius'uyla tutarlı, aynı düz/gölgesiz dil. */
export function TextField({ label, errorMessage, testID, ...inputProps }: TextFieldProps) {
  return (
    <View>
      <Text variant="caption" secondary style={styles.label}>
        {label}
      </Text>
      <TextInput
        testID={testID}
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, errorMessage ? styles.inputError : null]}
        {...inputProps}
      />
      {errorMessage ? (
        <Text variant="caption" style={styles.errorText}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    height: 52,
    borderRadius: borderRadius.button,
    borderWidth: 1.5,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamily.bodyRegular,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.xs,
  },
});

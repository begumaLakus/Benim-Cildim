import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ScreenContainer, Text, TextField } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import { routes } from '../../../navigation/routes';
import { ApiRequestError } from '../../../services';
import { useAuthStore } from '../../../store/useAuthStore';
import { validateEmail, validatePassword } from '../utils/validation';

export function SignUpScreen() {
  const router = useRouter();
  const signUp = useAuthStore((state) => state.signUp);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(undefined);
    if (nextEmailError || nextPasswordError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({ email: email.trim().toLowerCase(), password });
      router.replace(routes.tabsHome);
    } catch (error) {
      if (error instanceof ApiRequestError && error.code === 'EMAIL_TAKEN') {
        setEmailError(error.message);
      } else if (error instanceof ApiRequestError) {
        setFormError(error.message);
      } else {
        setFormError('Sunucuya ulaşılamadı — backend çalışıyor mu? (bkz. README)');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text variant="heading">Hesap Oluştur</Text>
        <Text variant="body" secondary style={styles.subtitle}>
          Rutinini kaydetmek ve ilerleyişini takip etmek için bir hesap oluştur.
        </Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          errorMessage={emailError}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="ornek@eposta.com"
        />
        <TextField
          label="Şifre"
          value={password}
          onChangeText={setPassword}
          errorMessage={passwordError}
          secureTextEntry
          autoComplete="new-password"
          placeholder="En az 8 karakter"
        />
        {formError ? (
          <Text variant="caption" style={styles.formError}>
            {formError}
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button label="Hesap Oluştur" onPress={handleSubmit} loading={isSubmitting} />
        <Button
          label="Zaten hesabım var"
          variant="secondary"
          onPress={() => router.push(routes.authLogin)}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  formError: {
    color: colors.error,
  },
  actions: {
    gap: spacing.sm,
  },
});

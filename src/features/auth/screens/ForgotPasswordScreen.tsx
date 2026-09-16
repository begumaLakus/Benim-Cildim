import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ScreenContainer, Text, TextField } from '../../../shared/components';
import { spacing } from '../../../shared/theme';
import { validateEmail } from '../utils/validation';

/**
 * Backend'de şifre sıfırlama ucu henüz yok — bu ekran şimdilik sadece
 * e-postayı doğruluyor
 */
export function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = () => {
    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);
    if (nextEmailError) {
      return;
    }
    setIsSent(true);
  };

  if (isSent) {
    return (
      <ScreenContainer>
        <View style={styles.content}>
          <Text variant="heading">E-postanı kontrol et</Text>
          <Text variant="body" secondary style={styles.note}>
            Şifre sıfırlama bağlantısını gönderdik (backend&apos;de bu uç henüz aktif değil — bu
            ekran şimdilik yer tutucu).
          </Text>
        </View>
        <Button label="Geri dön" variant="secondary" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text variant="heading">Şifremi Unuttum</Text>
        <Text variant="body" secondary style={styles.note}>
          Hesabına kayıtlı e-postayı gir, sana bir sıfırlama bağlantısı gönderelim.
        </Text>
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
      </View>
      <Button label="Bağlantı Gönder" onPress={handleSubmit} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
  },
  note: {
    marginBottom: spacing.sm,
  },
});

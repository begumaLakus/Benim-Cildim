import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ScreenContainer, Text, TextField } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import { ApiRequestError, forgotPassword } from '../../../services';
import { validateEmail } from '../utils/validation';

/**
 * GEÇİCİ: backend'de `/api/auth/forgot-password` ucu henüz yok (bkz.
 * services/authApi.ts). Bu ekran gerçek bir API çağrısı yapıyor — uç
 * eklenene kadar her denemede 404 tabanlı bir hata mesajı görünecek, ama
 * Login/SignUp ile aynı yükleniyor/hata desenini kullanıyor; uç eklenince
 * burada hiçbir değişiklik gerekmeyecek.
 */
export function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async () => {
    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);
    setFormError(undefined);
    if (nextEmailError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword({ email: email.trim().toLowerCase() });
      setIsSent(true);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setFormError(error.message);
      } else {
        setFormError('Sunucuya ulaşılamadı — backend çalışıyor mu? (bkz. README)');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <ScreenContainer>
        <View style={styles.content}>
          <Text variant="heading">E-postanı kontrol et</Text>
          <Text variant="body" secondary style={styles.note}>
            {/* Kayıtlı e-posta olup olmadığını sızdırmamak için login'deki gibi
                (bkz. backend auth.controller.ts) belirsiz/genel bir mesaj. */}
            Hesabına kayıtlıysa, şifre sıfırlama bağlantısını gönderdik.
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
        {formError ? (
          <Text variant="caption" style={styles.formError}>
            {formError}
          </Text>
        ) : null}
      </View>
      <Button label="Bağlantı Gönder" onPress={handleSubmit} loading={isSubmitting} />
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
  formError: {
    color: colors.error,
  },
});

import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ScreenContainer, Text } from '../../../shared/components';
import { spacing } from '../../../shared/theme';

/**
 * YER TUTUCU EKRAN — henüz gerçek giriş formu/backend entegrasyonu yok.
 * Amacı: karşılama ekranındaki "Zaten hesabım var" butonunun geçerli bir
 * route'a gitmesini sağlamak (Expo Router "Unmatched route" hatasını
 * önlemek için) — sitemap dokümanındaki ADR-009 onaylanıp e-posta+şifre
 * formu ve backend uçları eklendiğinde bu ekran gerçek içerikle değişecek.
 */
export function LoginScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text variant="heading">Giriş Yap</Text>
        <Text variant="body" secondary style={styles.note}>
          Bu ekran henüz tamamlanmadı — e-posta ve şifre ile giriş formu, ADR-009 onaylandıktan
          sonra buraya eklenecek.
        </Text>
      </View>
      <Button label="Geri dön" variant="secondary" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  note: {
    marginTop: spacing.sm,
  },
});

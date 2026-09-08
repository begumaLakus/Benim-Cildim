import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, ScreenContainer, Text } from '../../../shared/components';
import { routes } from '../../../navigation/routes';
import { spacing, tabColors } from '../../../shared/theme';
import { useAuthStore } from '../../../store/useAuthStore';

/**
 * DENEME: proje yöneticisinin isteğiyle eklenen soft pembe palette
 * (`tabColors`) burada ilk kez kullanılıyor — sadece bu ekranda. Beğenilirse
 * Ana Sayfa/Okumalar/Sonuçlarım'a da uygulanacak (bkz. theme/colors.ts).
 * Butonlar bilerek pembeye kaymadı — marka CTA dili (kahve aksan) tüm
 * uygulamada tek/tutarlı kalsın diye.
 */
export function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const initial = user?.email?.trim().charAt(0).toUpperCase() ?? '?';

  const handleLogout = async () => {
    await logout();
    router.replace(routes.authLogin);
  };

  return (
    <ScreenContainer tone="tabs">
      <Text variant="heading" style={styles.title}>
        Profilim
      </Text>

      <Card tone="tabs" style={styles.card}>
        <View style={styles.avatar}>
          {/* NOT: C09891 orta/açık tonlu — beyaz metin kontrastı zayıf kalıyordu,
              bu yüzden burada `onAccent` KULLANILMADI, varsayılan koyu metin rengi
              (textPrimary) okunabilirlik için daha doğru. */}
          <Text variant="heading">{initial}</Text>
        </View>
        <Text variant="bodyMedium">{user?.email ?? 'Oturum bilgisi bulunamadı'}</Text>
      </Card>

      <View style={styles.spacer} />

      <Button label="Çıkış Yap" variant="secondary" onPress={handleLogout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.lg,
  },
  card: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: tabColors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  spacer: {
    flex: 1,
  },
});

import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, ScreenContainer, Text } from '../../../shared/components';
import { routes } from '../../../navigation/routes';
import { borderRadius, colors, spacing, tabColors } from '../../../shared/theme';
import { useAuthStore } from '../../../store/useAuthStore';

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
    <ScreenContainer>
      <Text variant="heading" style={styles.title}>
        Profilim
      </Text>

      <Card style={styles.card}>
        <View style={styles.avatar}>
          <Text variant="heading" style={styles.avatarInitial}>
            {initial}
          </Text>
        </View>

        <Text variant="bodyMedium" style={styles.email}>
          {user?.email ?? 'Oturum bilgisi bulunamadı'}
        </Text>

        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={14} color={tabColors.highlight} />
          <Text variant="caption" style={styles.statusText}>
            Hesap aktif
          </Text>
        </View>
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
    gap: spacing.sm,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: tabColors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.accent,
  },
  email: {
    color: colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: tabColors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.button,
  },
  statusText: {
    color: colors.textPrimary,
  },
  spacer: {
    flex: 1,
  },
});

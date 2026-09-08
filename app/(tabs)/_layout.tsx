import { Ionicons } from '@react-native-vector-icons/ionicons';
import type { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

import { colors } from '../../src/shared/theme';

const TAB_ICONS: Record<string, IoniconsIconName> = {
  home: 'checkmark-done-outline',
  readings: 'book-outline',
  history: 'time-outline',
  profile: 'person-outline',
};

/**
 * Auth sonrasi ana uygulama iskeleti (ADR-009, madde 4) — onboarding/anket/
 * auth stack'inden AYRI bir navigasyon koku. 4 sekme: Ana Sayfa/Rutinim
 * (varsayilan), Okumalar, Test Sonuclarim, Profilim.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name] ?? 'ellipse-outline'} size={size} color={color} />
        ),
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Rutinim' }} />
      <Tabs.Screen name="readings" options={{ title: 'Okumalar' }} />
      <Tabs.Screen name="history" options={{ title: 'Sonuçlarım' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profilim' }} />
    </Tabs>
  );
}

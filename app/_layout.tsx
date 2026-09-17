import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import { Inter_400Regular, Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { routes } from '../src/navigation/routes';
import { setSessionExpiredHandler } from '../src/services';
import { colors } from '../src/shared/theme';
import { useAuthStore } from '../src/store/useAuthStore';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash zaten gizlenmişse görmezden gel.
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const isAuthHydrating = useAuthStore((state) => state.isHydrating);
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  // Kimlik doğrulamalı bir istek 401 dönerse (bkz. services/httpClient.ts —
  // sadece `token` verilen çağrılarda, yani login/signUp hatası bununla
  // karışmaz) burası tetiklenir: oturum temizlenir ve kullanıcı login'e
  // yönlendirilir. Kayıt kök seviyede yapılıyor ki tüm ekranlar için tek bir
  // yerden yönetilsin.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      logout();
      router.replace(routes.authLogin);
    });
    return () => setSessionExpiredHandler(null);
  }, [logout]);

  const isReady = (fontsLoaded || fontError) && !isAuthHydrating;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

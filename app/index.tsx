import { Redirect } from 'expo-router';
import React from 'react';

import { routes } from '../src/navigation/routes';
import { useAuthStore } from '../src/store/useAuthStore';

/**
 * NOT (ADR-009): Yarım kalmış bir anket taslağını algılayıp kaldığı yerden
 * devam ettirme henüz yok — anket cevapları sadece Zustand'da (bellekte)
 * tutuluyor, uygulama kapanınca zaten kaybolur. Bu yüzden şimdilik sadece
 * iki durum var: geçerli bir oturum token'ı -> ana uygulama, yoksa ->
 * onboarding. Taslak kalıcılığı ayrı bir iş paketi olarak eklenebilir.
 */
export default function Index() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Redirect href={routes.tabsHome} />;
  }

  return <Redirect href={routes.onboardingWelcome} />;
}

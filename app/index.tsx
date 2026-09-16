import { Redirect } from 'expo-router';
import React from 'react';

import { routes } from '../src/navigation/routes';
import { useAuthStore } from '../src/store/useAuthStore';

export default function Index() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Redirect href={routes.tabsHome} />;
  }

  return <Redirect href={routes.onboardingWelcome} />;
}

import { Redirect } from 'expo-router';
import React from 'react';

import { routes } from '../src/navigation/routes';

export default function Index() {
  return <Redirect href={routes.onboardingWelcome} />;
}

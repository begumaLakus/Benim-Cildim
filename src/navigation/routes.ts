/** `(tabs)` grubu URL'de görünmez (Expo Router grup klasörü kuralı) — `tabsHome` doğrudan `/home`'a işaret eder. */
export const routes = {
  onboardingWelcome: '/onboarding',
  authSignUp: '/auth/sign-up',
  authLogin: '/auth/login',
  authForgotPassword: '/auth/forgot-password',
  questionnaireIntro: '/questionnaire',
  questionnaireFlow: '/questionnaire/flow',
  resultsWaiting: '/results/waiting',
  results: '/results',
  tabsHome: '/home',
  tabsReadings: '/readings',
  tabsHistory: '/history',
  tabsProfile: '/profile',
} as const;

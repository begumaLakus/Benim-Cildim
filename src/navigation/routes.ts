/**
 * Anket akışı tek bir "sihirbaz" ekranında (questionnaireFlow) adım adım
 * ilerler — her soru kendi route'una sahip değildir, akış kendi içindeki
 * adım index'ini yönetir (bkz. QuestionnaireFlowScreen). Bu sayede geri tuşu
 * ve ilerleme çubuğu tek bir yerden tutarlı yönetilir.
 *
 * `(tabs)` grubu URL'de görünmez (Expo Router grup klasörü kuralı) — bu
 * yüzden `tabsHome` doğrudan `/home`'a işaret eder.
 */
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

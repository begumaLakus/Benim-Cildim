/**
 * Expo Router dosya bazlı yönlendirme kullanır (`app/` dizini); rota adları
 * orada oluşturulan dosya yoluna göre belirlenir. Bu sabitler, ekranlar
 * arasında `router.push(...)` çağrılarında string'leri elle yazmamak ve tek
 * bir yerden değiştirebilmek için tutulur.
 */
export const routes = {
  onboardingWelcome: '/onboarding',
  onboardingGender: '/onboarding/gender',
  camera: '/camera',
  questionnaire: '/questionnaire',
  resultsWaiting: '/results/waiting',
  results: '/results',
} as const;

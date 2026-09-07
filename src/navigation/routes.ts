/**
 * Anket akışı tek bir "sihirbaz" ekranında (questionnaireFlow) adım adım
 * ilerler — her soru kendi route'una sahip değildir, akış kendi içindeki
 * adım index'ini yönetir (bkz. QuestionnaireFlowScreen). Bu sayede geri tuşu
 * ve ilerleme çubuğu tek bir yerden tutarlı yönetilir.
 */
export const routes = {
  onboardingWelcome: '/onboarding',
  questionnaireIntro: '/questionnaire',
  questionnaireFlow: '/questionnaire/flow',
  resultsWaiting: '/results/waiting',
  results: '/results',
} as const;

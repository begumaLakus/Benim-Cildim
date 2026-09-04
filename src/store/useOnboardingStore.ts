import { create } from 'zustand';

import {
  CapturedPhoto,
  EMPTY_QUESTIONNAIRE_ANSWERS,
  Gender,
  QuestionnaireAnswers,
  RoutineRecommendationResponse,
} from '../types';

/**
 * NOT: Bu dosya sabit klasör yapısında ayrı bir "store" klasörü olarak
 * belirtilmemişti; onboarding akışı features/ arası (gender, camera,
 * questionnaire, results) paylaşılan tek bir durumu yönettiği için burada,
 * shared/hooks yerine kendi klasöründe tutuldu. Bu bir mimari sapma değil,
 * belirtilmemiş bir noktadaki en az müdahaleli tercih — istenirse konumu
 * değiştirilebilir.
 */
interface OnboardingState {
  gender: Gender | null;
  photoConsentGiven: boolean;
  photo: CapturedPhoto | null;
  answers: QuestionnaireAnswers;
  recommendation: RoutineRecommendationResponse | null;

  setGender: (gender: Gender) => void;
  setPhotoConsentGiven: (consentGiven: boolean) => void;
  setPhoto: (photo: CapturedPhoto | null) => void;
  setAnswers: (answers: QuestionnaireAnswers) => void;
  toggleConcern: (concern: QuestionnaireAnswers['concerns'][number]) => void;
  setRecommendation: (recommendation: RoutineRecommendationResponse | null) => void;
  reset: () => void;
}

const initialState = {
  gender: null,
  photoConsentGiven: false,
  photo: null,
  answers: EMPTY_QUESTIONNAIRE_ANSWERS,
  recommendation: null,
} satisfies Omit<
  OnboardingState,
  | 'setGender'
  | 'setPhotoConsentGiven'
  | 'setPhoto'
  | 'setAnswers'
  | 'toggleConcern'
  | 'setRecommendation'
  | 'reset'
>;

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setGender: (gender) => set({ gender }),
  setPhotoConsentGiven: (photoConsentGiven) => set({ photoConsentGiven }),
  setPhoto: (photo) => set({ photo }),
  setAnswers: (answers) => set({ answers }),
  toggleConcern: (concern) => {
    const current = get().answers;
    const alreadySelected = current.concerns.includes(concern);
    set({
      answers: {
        ...current,
        concerns: alreadySelected
          ? current.concerns.filter((item) => item !== concern)
          : [...current.concerns, concern],
      },
    });
  },
  setRecommendation: (recommendation) => set({ recommendation }),
  reset: () => set({ ...initialState }),
}));

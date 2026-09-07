import { create } from 'zustand';

import {
  CameraAngle,
  CapturedPhoto,
  CapturedPhotosByAngle,
  EMPTY_CAPTURED_PHOTOS,
  EMPTY_QUESTIONNAIRE_ANSWERS,
  Gender,
  QuestionnaireAnswers,
  RoutineRecommendationResponse,
} from '../types';

interface OnboardingState {
  gender: Gender | null;
  photoConsentGiven: boolean;
  photos: CapturedPhotosByAngle;
  answers: QuestionnaireAnswers;
  recommendation: RoutineRecommendationResponse | null;

  setGender: (gender: Gender) => void;
  setPhotoConsentGiven: (consentGiven: boolean) => void;
  setPhoto: (angle: CameraAngle, photo: CapturedPhoto | null) => void;
  resetPhotos: () => void;
  setAnswers: (answers: QuestionnaireAnswers) => void;
  toggleConcern: (concern: QuestionnaireAnswers['concerns'][number]) => void;
  setRecommendation: (recommendation: RoutineRecommendationResponse | null) => void;
  reset: () => void;
}

const initialState = {
  gender: null,
  photoConsentGiven: false,
  photos: EMPTY_CAPTURED_PHOTOS,
  answers: EMPTY_QUESTIONNAIRE_ANSWERS,
  recommendation: null,
} satisfies Omit<
  OnboardingState,
  | 'setGender'
  | 'setPhotoConsentGiven'
  | 'setPhoto'
  | 'resetPhotos'
  | 'setAnswers'
  | 'toggleConcern'
  | 'setRecommendation'
  | 'reset'
>;

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,
  setGender: (gender) => set({ gender }),
  setPhotoConsentGiven: (photoConsentGiven) => set({ photoConsentGiven }),
  setPhoto: (angle, photo) => set((state) => ({ photos: { ...state.photos, [angle]: photo } })),
  resetPhotos: () => set({ photos: EMPTY_CAPTURED_PHOTOS }),
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

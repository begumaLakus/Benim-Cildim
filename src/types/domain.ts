/** Faz 1 onboarding akışında toplanan temel alan tipleri. */

export type Gender = 'female' | 'male' | 'unspecified';

/** Cilt tipi anket sorusu seçenekleri. */
export type SkinType = 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';

/** Kullanıcının işaretleyebileceği birden fazla cilt endişesi. */
export type SkinConcern =
  'acne' | 'redness' | 'darkSpots' | 'fineLines' | 'dullness' | 'largePores';

export interface QuestionnaireAnswers {
  skinType: SkinType | null;
  concerns: SkinConcern[];
  usesActiveIngredients: boolean | null;
  hasKnownSensitivities: boolean | null;
}

export const EMPTY_QUESTIONNAIRE_ANSWERS: QuestionnaireAnswers = {
  skinType: null,
  concerns: [],
  usesActiveIngredients: null,
  hasKnownSensitivities: null,
};

/** Onboarding sırasında kayıt amaçlı çekilen fotoğrafın yerel durumu. */
export interface CapturedPhoto {
  uri: string;
  takenAt: string;
}

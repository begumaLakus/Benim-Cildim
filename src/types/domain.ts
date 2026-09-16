/** Faz 1 onboarding akışında toplanan temel alan tipleri. */

export type Gender = 'female' | 'male' | 'unspecified';

/** Anket akışının ilk sorusu: yaş aralığı. */
export type AgeRange = 'under18' | '18-24' | '25-34' | '35-44' | '45-54' | '55plus';

/** Cilt tipi anket sorusu seçenekleri. */
export type SkinType = 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';

/** Kullanıcının işaretleyebileceği birden fazla cilt endişesi. */
export type SkinConcern =
  'acne' | 'redness' | 'darkSpots' | 'fineLines' | 'dullness' | 'largePores';

export interface QuestionnaireAnswers {
  ageRange: AgeRange | null;
  skinType: SkinType | null;
  concerns: SkinConcern[];
  usesActiveIngredients: boolean | null;
  hasKnownSensitivities: boolean | null;
}

export const EMPTY_QUESTIONNAIRE_ANSWERS: QuestionnaireAnswers = {
  ageRange: null,
  skinType: null,
  concerns: [],
  usesActiveIngredients: null,
  hasKnownSensitivities: null,
};

/** Fotoğraf çekimi 3 açıdan yapılır — kullanıcı ön kamerayla başını çevirerek açıyı değiştirir. */
export type CameraAngle = 'front' | 'left' | 'right';

export const CAMERA_ANGLES: CameraAngle[] = ['front', 'left', 'right'];

/** Onboarding sırasında kayıt amaçlı çekilen fotoğrafın yerel durumu. */
export interface CapturedPhoto {
  uri: string;
  takenAt: string;
}

export type CapturedPhotosByAngle = Record<CameraAngle, CapturedPhoto | null>;

export const EMPTY_CAPTURED_PHOTOS: CapturedPhotosByAngle = {
  front: null,
  left: null,
  right: null,
};

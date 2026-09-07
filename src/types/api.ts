import { CameraAngle, Gender, QuestionnaireAnswers } from './domain';

/**
 * Backend'e gönderilen onboarding verisi.
 * NOT: Fotoğraflar, KVKK gereği ayrı ve kısa ömürlü bir uçtan (örn. imzalı
 * yükleme URL'si) gönderilmeli — bu obje yalnızca referans/consent bilgisini
 * taşır, fotoğrafların kendisini taşımaz.
 */
export interface SubmitOnboardingRequest {
  gender: Gender;
  answers: QuestionnaireAnswers;
  photoConsentGiven: boolean;
  /** Fotoğraflar yüklendiyse backend'in döndürdüğü geçici referans id'leri (açı bazında). */
  photoReferenceIds: Partial<Record<CameraAngle, string>> | null;
}

/** Sabah/akşam rutininde tek bir adım. */
export interface RoutineStep {
  id: string;
  order: number;
  /** İçerik/aktif madde adı (Faz 1: marka önerilmez). */
  activeIngredient: string;
  productCategory: string;
  instructions: string;
}

export interface RoutinePlan {
  morning: RoutineStep[];
  evening: RoutineStep[];
}

/**
 * Öneri response şeması.
 *
 * `productSuggestion` alanı KASITLI olarak Faz 1'de `null` döner — Faz 3'te
 * güzellik merkezinin ürün kataloğu bu alana bağlanacak. Bu alanı şemadan
 * çıkarma; sözleşmenin ileriye dönük genişleyebilirliği bu alana bağlı.
 */
export interface RoutineRecommendationResponse {
  routine: RoutinePlan;
  productSuggestion: null;
  generatedAt: string;
}

export interface ApiError {
  code: string;
  message: string;
}

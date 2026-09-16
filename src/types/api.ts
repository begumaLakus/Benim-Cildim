import { CameraAngle, Gender, QuestionnaireAnswers, SkinConcern, SkinType } from './domain';

/** Backend'e gönderilen onboarding verisi — fotoğrafların kendisini değil, referans/consent bilgisini taşır (KVKK). */
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

/** Rutinim'deki cilt etiketi için ham enum değerler — Türkçe formatlama `skinSummary.ts`'te. */
export interface SkinSummary {
  skinType: SkinType | null;
  concerns: SkinConcern[];
}

/**
 * Öneri response şeması. `productSuggestion` KASITLI olarak `null` döner —
 * Faz 3'teki ürün kataloğu için ayrılmış, şemadan çıkarılmamalı.
 */
export interface RoutineRecommendationResponse {
  routine: RoutinePlan;
  productSuggestion: null;
  generatedAt: string;
  skinSummary: SkinSummary | null;
}

export interface ApiError {
  code: string;
  message: string;
}

/** `POST /api/routine-history` istek/yanit sözleşmesi — backend'deki `routineHistory.types.ts` ile elle senkron. */
export interface SaveRoutineHistoryRequest {
  answers: QuestionnaireAnswers;
  routine: RoutinePlan;
}

/** Bilerek minimal — gönderilen veriyi geri yankilamaz (bkz. ADR-011). */
export interface SaveRoutineHistoryResponse {
  id: string;
  createdAt: string;
}

/** Günlük rutin tik atma sözleşmesi. `date` HER ZAMAN kullanıcının yerel gün anahtarı ("YYYY-MM-DD"), sunucunun UTC günü değil. */
export interface RoutineProgress {
  date: string;
  completedStepIds: string[];
}

export interface ToggleRoutineProgressRequest {
  date: string;
  stepId: string;
}

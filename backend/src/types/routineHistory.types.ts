/**
 * RN tarafindaki src/types/api.ts ile elle senkron tutulur (ayri paketler,
 * tip paylasimi yok). Sadece bu ucun ihtiyac duydugu alt kume burada.
 */
export const AGE_RANGES = ['under18', '18-24', '25-34', '35-44', '45-54', '55plus'] as const;
export type AgeRangeDto = (typeof AGE_RANGES)[number];

export const SKIN_TYPES = ['dry', 'oily', 'combination', 'normal', 'sensitive'] as const;
export type SkinTypeDto = (typeof SKIN_TYPES)[number];

export const SKIN_CONCERNS = [
  'acne',
  'redness',
  'darkSpots',
  'fineLines',
  'dullness',
  'largePores',
] as const;
export type SkinConcernDto = (typeof SKIN_CONCERNS)[number];

export interface QuestionnaireAnswersDto {
  ageRange: AgeRangeDto | null;
  skinType: SkinTypeDto | null;
  concerns: SkinConcernDto[];
  usesActiveIngredients: boolean | null;
  hasKnownSensitivities: boolean | null;
}

export interface RoutineStepDto {
  id: string;
  order: number;
  activeIngredient: string;
  productCategory: string;
  instructions: string;
}

export interface RoutinePlanDto {
  morning: RoutineStepDto[];
  evening: RoutineStepDto[];
}

export interface CreateRoutineHistoryRequestBody {
  answers: QuestionnaireAnswersDto;
  routine: RoutinePlanDto;
}

/** Bilerek minimal — yazma ucu sadece olusturulan kaydin kimligini/tarihini doner. */
export interface RoutineHistoryResponseBody {
  id: string;
  createdAt: string;
}

/** Rutinim'deki cilt etiketi icin — ham enum deger doner, Turkce formatlama RN tarafinda yapilir. */
export interface SkinSummaryDto {
  skinType: SkinTypeDto | null;
  concerns: SkinConcernDto[];
}

/**
 * GET /api/routine-history/latest yaniti — RN'deki `RoutineRecommendationResponse`
 * ile ayni sekilde tasarlandi, boylece HomeScreen ayri bir donusum yapmadan
 * ayni store alanina yazabiliyor. `productSuggestion` Faz 3 icin `null` doner.
 */
export interface LatestRoutineHistoryResponseBody {
  routine: RoutinePlanDto;
  productSuggestion: null;
  generatedAt: string;
  skinSummary: SkinSummaryDto | null;
}

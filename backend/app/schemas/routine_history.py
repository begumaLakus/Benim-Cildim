"""RN tarafindaki `src/types/api.ts` ile elle senkron tutulur (ayri paketler,
tip paylasimi yok). Sadece bu ucun ihtiyac duydugu alt kume burada."""

from typing import Annotated, Literal, Optional, get_args

from pydantic import AfterValidator

from app.schemas.base import CamelModel, min_value, trim_non_empty

AgeRangeDto = Literal["under18", "18-24", "25-34", "35-44", "45-54", "55plus"]
AGE_RANGES: tuple[AgeRangeDto, ...] = get_args(AgeRangeDto)

SkinTypeDto = Literal["dry", "oily", "combination", "normal", "sensitive"]
SKIN_TYPES: tuple[SkinTypeDto, ...] = get_args(SkinTypeDto)

SkinConcernDto = Literal["acne", "redness", "darkSpots", "fineLines", "dullness", "largePores"]
SKIN_CONCERNS: tuple[SkinConcernDto, ...] = get_args(SkinConcernDto)


class QuestionnaireAnswersDto(CamelModel):
    """Alanlarin hepsi ZORUNLU ama `None` olabilir (Zod'daki `.nullable()`,
    `.optional()` degil) — eksik anahtar dogrulama hatasi verir."""

    age_range: Optional[AgeRangeDto]
    skin_type: Optional[SkinTypeDto]
    concerns: list[SkinConcernDto]
    uses_active_ingredients: Optional[bool]
    has_known_sensitivities: Optional[bool]


class RoutineStepDto(CamelModel):
    id: Annotated[str, AfterValidator(trim_non_empty("Rutin adiminin id alani gerekli."))]
    order: Annotated[
        int, AfterValidator(min_value(1, "Rutin adimi sirasi 1 veya daha buyuk olmali."))
    ]
    active_ingredient: Annotated[str, AfterValidator(trim_non_empty("Aktif madde adi gerekli."))]
    product_category: Annotated[str, AfterValidator(trim_non_empty("Urun kategorisi gerekli."))]
    instructions: Annotated[str, AfterValidator(trim_non_empty("Kullanim talimati gerekli."))]


class RoutinePlanDto(CamelModel):
    morning: list[RoutineStepDto]
    evening: list[RoutineStepDto]


class CreateRoutineHistoryRequestBody(CamelModel):
    answers: QuestionnaireAnswersDto
    routine: RoutinePlanDto


class RoutineHistoryResponseBody(CamelModel):
    """Bilerek minimal — yazma ucu sadece olusturulan kaydin kimligini/tarihini doner."""

    id: str
    created_at: str


class SkinSummaryDto(CamelModel):
    """Rutinim'deki cilt etiketi icin — ham enum deger doner, Turkce
    formatlama RN tarafinda yapilir."""

    skin_type: Optional[SkinTypeDto]
    concerns: list[SkinConcernDto]


class LatestRoutineHistoryResponseBody(CamelModel):
    """`GET /api/routine-history/latest` yaniti — RN'deki
    `RoutineRecommendationResponse` ile ayni sekilde tasarlandi, boylece
    HomeScreen ayri bir donusum yapmadan ayni store alanina yazabiliyor.
    `product_suggestion` Faz 3 icin `None` doner."""

    routine: RoutinePlanDto
    product_suggestion: None = None
    generated_at: str
    skin_summary: Optional[SkinSummaryDto]

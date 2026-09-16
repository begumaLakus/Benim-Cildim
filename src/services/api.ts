import {
  RoutineProgress,
  RoutineRecommendationResponse,
  SaveRoutineHistoryRequest,
  SaveRoutineHistoryResponse,
  SubmitOnboardingRequest,
  ToggleRoutineProgressRequest,
} from '../types';
import { getJson, postJson } from './httpClient';

/** Onboarding'de toplanan anket + rıza bilgisini backend'e gönderir, rutin önerisini döner. */
export async function submitOnboarding(
  request: SubmitOnboardingRequest,
): Promise<RoutineRecommendationResponse> {
  return postJson<RoutineRecommendationResponse>('/api/onboarding', request);
}

/** Misafirken toplanan anket cevaplarını/rutin önerisini backend'e kalıcı olarak kaydeder (giriş sonrası çağrılır). */
export async function saveRoutineHistory(
  request: SaveRoutineHistoryRequest,
  token: string,
): Promise<SaveRoutineHistoryResponse> {
  return postJson<SaveRoutineHistoryResponse>('/api/routine-history', request, token);
}

/** En son kaydedilen rutini getirir. Kayıt yoksa (404) `null` döner — hata değil, boş durum. */
export async function getLatestRoutineHistory(
  token: string,
): Promise<RoutineRecommendationResponse | null> {
  return getJson<RoutineRecommendationResponse>('/api/routine-history/latest', token);
}
/** Verilen yerel gün için işaretlenmiş adım id'lerini getirir. İşaretleme yoksa 404 değil, boş dizi döner. */
export async function getRoutineProgress(
  date: string,
  token: string,
): Promise<RoutineProgress | null> {
  return getJson<RoutineProgress>(`/api/routine-progress?date=${encodeURIComponent(date)}`, token);
}

/** Bir adımın tamamlanma durumunu tersine çevirir, backend'in güncel tam listesini döner. */
export async function toggleRoutineProgress(
  request: ToggleRoutineProgressRequest,
  token: string,
): Promise<RoutineProgress> {
  return postJson<RoutineProgress>('/api/routine-progress/toggle', request, token);
}

import { RoutineRecommendationResponse, SubmitOnboardingRequest } from '../types';
import { postJson } from './httpClient';

/**
 * Onboarding'de toplanan anket + rıza bilgisini backend'e gönderir ve
 * içerik/aktif madde bazlı rutin önerisini döner.
 *
 * Backend hazır olana kadar `services/mockApi.ts` üzerinden sahte veriyle
 * geliştirme yapılabilir — bu dosyadaki sözleşmeyi (request/response tipleri)
 * değiştirmeden.
 */
export async function submitOnboarding(
  request: SubmitOnboardingRequest,
): Promise<RoutineRecommendationResponse> {
  return postJson<RoutineRecommendationResponse>('/api/onboarding', request);
}

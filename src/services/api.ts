import Constants from 'expo-constants';

import { RoutineRecommendationResponse, SubmitOnboardingRequest } from '../types';

/**
 * Backend base URL. Faz 1 backend'i (Node.js/Express) henüz ayrı bir
 * repo/servis olarak deploy edilmediği için bu değer app.json'daki `extra`
 * alanından veya ortam değişkeninden okunur; yoksa yerel geliştirme adresine
 * düşer.
 */
const API_BASE_URL: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? 'http://localhost:3000';

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API isteği başarısız: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TResponse;
}

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

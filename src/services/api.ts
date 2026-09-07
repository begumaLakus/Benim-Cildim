import { RoutineRecommendationResponse, SubmitOnboardingRequest } from '../types';

/**
 * Backend base URL. `.env` dosyasındaki `EXPO_PUBLIC_API_BASE_URL` Expo
 * tarafından otomatik olarak inline edilir (ek bir babel eklentisi
 * gerekmez) — bkz. `.env.example`. Tanımlı değilse yerel geliştirme
 * adresine düşer.
 *
 * NOT: `EXPO_PUBLIC_` önekli değişkenler derlenmiş uygulama içinde açık
 * metin olarak durur — buraya asla gizli/hassas bir anahtar konulmaz.
 */
const API_BASE_URL: string = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

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

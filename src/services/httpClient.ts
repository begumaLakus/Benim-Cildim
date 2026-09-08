import { ApiErrorBody } from '../types';

/**
 * Backend base URL. `.env` dosyasındaki `EXPO_PUBLIC_API_BASE_URL` Expo
 * tarafından otomatik olarak inline edilir (ek bir babel eklentisi
 * gerekmez) — bkz. `.env.example`. Tanımlı değilse yerel geliştirme
 * adresine düşer.
 *
 * NOT: `EXPO_PUBLIC_` önekli değişkenler derlenmiş uygulama içinde açık
 * metin olarak durur — buraya asla gizli/hassas bir anahtar konulmaz.
 */
export const API_BASE_URL: string = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

/**
 * Backend'in döndürdüğü `{ code, message }` gövdesini taşıyan hata tipi —
 * ekranlar bunu yakalayıp `message`'ı doğrudan kullanıcıya gösterebilir
 * (örn. "Bu e-posta ile zaten bir hesap var").
 */
export class ApiRequestError extends Error {
  code: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiRequestError';
    this.code = body.code;
  }
}

export async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null;
    if (errorBody?.message) {
      throw new ApiRequestError(errorBody);
    }
    throw new Error(`API isteği başarısız: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TResponse;
}

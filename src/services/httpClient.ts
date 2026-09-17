import Constants from 'expo-constants';

import { ApiErrorBody } from '../types';

/**
 * Gerçek cihazda `localhost` telefonun kendisine işaret eder, geliştirme
 * makinesine değil — bu yüzden `.env`'e LAN IP'sini elle yazmak (ve Wi-Fi
 * değiştikçe güncellemek) zorunda kalmamak için: Expo Go/dev client zaten
 * JS bundle'ını hangi host:port'tan sunduğunu biliyor (`hostUri`, örn.
 * "192.168.9.155:8081") — backend'in varsayılan 3000 portunda aynı makinede
 * çalıştığını varsayıp buradan türetiyoruz. `EXPO_PUBLIC_API_BASE_URL` açıkça
 * set edilmişse (örn. ngrok tüneli ya da backend başka bir makinede/portta)
 * HER ZAMAN önceliklidir — bkz. .env.example.
 */
function inferLanApiBaseUrl(): string | null {
  if (!__DEV__) {
    return null;
  }
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return host ? `http://${host}:3000` : null;
}

export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? inferLanApiBaseUrl() ?? 'http://localhost:3000';

export class ApiRequestError extends Error {
  code: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiRequestError';
    this.code = body.code;
  }
}

type SessionExpiredHandler = () => void;
let sessionExpiredHandler: SessionExpiredHandler | null = null;

/**
 * Kök seviyede (app/_layout.tsx) bir kere kaydedilir — orada zaten
 * `useAuthStore` ve router import edildiği için, otomatik çıkış + yönlendirme
 * mantığı orada durur. Bu dosya BİLEREK store'u import etmiyor: services/api.ts
 * ve services/authApi.ts zaten `postJson`/`getJson`'ı kullanıyor, useAuthStore.ts
 * da services'i import ediyor — burada store'u import etmek döngüsel bağımlılık
 * yaratırdı.
 */
export function setSessionExpiredHandler(handler: SessionExpiredHandler | null): void {
  sessionExpiredHandler = handler;
}

/**
 * `token` VERİLMİŞ bir istek 401 dönerse, bu login/sign-up'taki "e-posta veya
 * şifre hatalı" 401'i değildir — geçerli bir oturumun artık kabul edilmediği
 * anlamına gelir (süresi dolmuş/geçersiz token). `token` verilmeyen çağrılarda
 * (login/signUp/forgotPassword) hiçbir şey tetiklenmez.
 */
function notifySessionExpiredIfNeeded(status: number, token?: string): void {
  if (token && status === 401) {
    sessionExpiredHandler?.();
  }
}

export async function postJson<TResponse>(
  path: string,
  body: unknown,
  token?: string,
): Promise<TResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    notifySessionExpiredIfNeeded(response.status, token);
    const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null;
    if (errorBody?.message) {
      throw new ApiRequestError(errorBody);
    }
    throw new Error(`API isteği başarısız: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TResponse;
}

export async function getJson<TResponse>(path: string, token?: string): Promise<TResponse | null> {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { method: 'GET', headers });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    notifySessionExpiredIfNeeded(response.status, token);
    const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null;
    if (errorBody?.message) {
      throw new ApiRequestError(errorBody);
    }
    throw new Error(`API isteği başarısız: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TResponse;
}

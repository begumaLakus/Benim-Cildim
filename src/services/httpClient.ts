import { ApiErrorBody } from '../types';

export const API_BASE_URL: string = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export class ApiRequestError extends Error {
  code: string;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiRequestError';
    this.code = body.code;
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
    const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null;
    if (errorBody?.message) {
      throw new ApiRequestError(errorBody);
    }
    throw new Error(`API isteği başarısız: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TResponse;
}

import { AuthCredentials, AuthResponse } from '../types';
import { postJson } from './httpClient';

/**
 * `mockApi.ts` deseni burada bilerek tekrarlanmadı (bkz. ADR-009, madde 5):
 * auth mock veriyle anlamlı test edilemez, bu yüzden doğrudan gerçek
 * backend'e (`backend/`) bağlanıyor. Backend'i çalıştırmadan bu ekranlar
 * "E-posta veya şifre hatalı" değil, ağ hatası verir — bu beklenen bir
 * durumdur, bkz. README.md "Backend'i çalıştırma".
 */
export async function signUp(credentials: AuthCredentials): Promise<AuthResponse> {
  return postJson<AuthResponse>('/api/auth/sign-up', credentials);
}

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  return postJson<AuthResponse>('/api/auth/login', credentials);
}

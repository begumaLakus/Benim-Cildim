import {
  AuthCredentials,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from '../types';
import { postJson } from './httpClient';

/** Auth mock veriyle test edilemediği için doğrudan gerçek backend'e bağlanır (bkz. README "Backend'i çalıştırma"). */
export async function signUp(credentials: AuthCredentials): Promise<AuthResponse> {
  return postJson<AuthResponse>('/api/auth/sign-up', credentials);
}

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  return postJson<AuthResponse>('/api/auth/login', credentials);
}

/**
 * GEÇİCİ: backend'de `/api/auth/forgot-password` ucu henüz yok — teammate
 * ekleyene kadar bu çağrı 404 ("Route bulunamadi.") ile başarısız olur.
 * `ForgotPasswordScreen` bunu sıradan bir `ApiRequestError` gibi gösterir,
 * uç eklenince burada değişiklik gerekmez.
 */
export async function forgotPassword(
  request: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  return postJson<ForgotPasswordResponse>('/api/auth/forgot-password', request);
}

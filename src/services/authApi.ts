import { AuthCredentials, AuthResponse } from '../types';
import { postJson } from './httpClient';

/** Auth mock veriyle test edilemediği için doğrudan gerçek backend'e bağlanır (bkz. README "Backend'i çalıştırma"). */
export async function signUp(credentials: AuthCredentials): Promise<AuthResponse> {
  return postJson<AuthResponse>('/api/auth/sign-up', credentials);
}

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  return postJson<AuthResponse>('/api/auth/login', credentials);
}

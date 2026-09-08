/**
 * Backend'deki (backend/src/types/auth.types.ts) sözleşmeyle birebir
 * eşleşecek şekilde tasarlandı — iki taraf da bağımsız paketler olduğu için
 * (RN app ayrı, backend ayrı) tip paylaşımı yapılamıyor, elle senkron
 * tutuluyor. İkisinden biri değişirse diğeri de güncellenmeli.
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ApiErrorBody {
  code: string;
  message: string;
}

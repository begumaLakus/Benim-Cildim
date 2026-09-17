/** Backend'deki auth.types.ts ile elle senkron tutulur (ayrı paketler, tip paylaşımı yok). */
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

/**
 * Backend'de bu uç için henüz bir route/controller YOK (bkz.
 * backend/src/routes/auth.routes.ts — şu an sadece sign-up ve login var).
 * Sözleşme burada, teammate `POST /api/auth/forgot-password` ucunu backend'e
 * eklerken referans olması için önceden tanımlandı; uç eklenince frontend'de
 * ek bir değişiklik gerekmeden çalışmaya başlayacak.
 */
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

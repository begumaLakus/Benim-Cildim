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

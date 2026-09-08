/**
 * RN tarafindaki (gelecek) src/types/auth.ts ile birebir eslesecek sekilde
 * tasarlandi — sozlesme iki tarafta da ayni.
 */
export interface AuthUserDto {
  id: string;
  email: string;
}

export interface AuthResponseBody {
  token: string;
  user: AuthUserDto;
}

export interface ApiErrorBody {
  code: string;
  message: string;
}

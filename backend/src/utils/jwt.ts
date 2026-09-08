import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Sunucu ayaga kalkarken hemen patlar — yanlislikla secretsiz calismayi
  // engeller (uretimde sessizce zayif/varsayilan bir secret kullanmaktan
  // cok daha iyi).
  throw new Error('JWT_SECRET ortam degiskeni tanimli degil — .env dosyasini kontrol et.');
}

export interface AuthTokenPayload {
  userId: string;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}

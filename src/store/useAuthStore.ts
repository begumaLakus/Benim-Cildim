import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { login as loginRequest, signUp as signUpRequest } from '../services/authApi';
import { AuthCredentials, AuthResponse, AuthUser } from '../types';

/**
 * NOT: Bu dosya `expo-secure-store` paketine ihtiyaç duyuyor — henüz
 * `package.json`'a eklenmedi. Çalıştırmadan önce:
 *
 *   npx expo install expo-secure-store
 *
 * (Kurulumu kasıtlı olarak burada, elle çalıştırmıyorum — bkz. daha önceki
 * npm install/Windows sembolik link sorunu; bkz. proje geçmişi.)
 */
const SESSION_STORAGE_KEY = 'benim-cildim-auth-session';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  /** Uygulama açılışında secure-store'dan oturum okunurken true. */
  isHydrating: boolean;

  hydrate: () => Promise<void>;
  signUp: (credentials: AuthCredentials) => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

async function persistSession(session: AuthResponse | null): Promise<void> {
  if (session) {
    await SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(session));
  } else {
    await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrating: true,

  hydrate: async () => {
    try {
      const raw = await SecureStore.getItemAsync(SESSION_STORAGE_KEY);
      if (raw) {
        const session = JSON.parse(raw) as AuthResponse;
        set({ token: session.token, user: session.user });
      }
    } catch {
      // Bozuk/okunamayan bir oturum kaydı varsa sessizce misafir moduna düş —
      // kullanıcıyı bir hata ekranında sıkıştırmaktansa tekrar giriş yapması
      // istenir.
    } finally {
      set({ isHydrating: false });
    }
  },

  signUp: async (credentials) => {
    const session = await signUpRequest(credentials);
    await persistSession(session);
    set({ token: session.token, user: session.user });
  },

  login: async (credentials) => {
    const session = await loginRequest(credentials);
    await persistSession(session);
    set({ token: session.token, user: session.user });
  },

  logout: async () => {
    await persistSession(null);
    set({ token: null, user: null });
  },
}));

import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { login as loginRequest, signUp as signUpRequest } from '../services/authApi';
import { saveRoutineHistory } from '../services/api';
import { AuthCredentials, AuthResponse, AuthUser } from '../types';
import { useOnboardingStore } from './useOnboardingStore';

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

/**
 * Misafirken toplanan rutin onerisi varsa, giris/kayittan hemen sonra
 * backend'e yazar. `recommendationSynced` tekrar yazmayi engeller; hata
 * olursa sessizce yutulur (kullaniciyi giristen sonra engellememek icin).
 */
async function syncGuestRoutineIfPresent(token: string): Promise<void> {
  const { recommendation, recommendationSynced, answers, markRecommendationSynced } =
    useOnboardingStore.getState();
  if (!recommendation || recommendationSynced) {
    return;
  }

  try {
    await saveRoutineHistory({ answers, routine: recommendation.routine }, token);
    markRecommendationSynced();
  } catch {
    // bkz. yukaridaki not — sessizce yut, akisi kesme.
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
    await syncGuestRoutineIfPresent(session.token);
  },

  login: async (credentials) => {
    const session = await loginRequest(credentials);
    await persistSession(session);
    set({ token: session.token, user: session.user });
    await syncGuestRoutineIfPresent(session.token);
  },

  logout: async () => {
    await persistSession(null);
    set({ token: null, user: null });
  },
}));

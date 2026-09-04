import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Yalnızca hassas olmayan, kalıcı UI durumu için kullanılır (örn. KVKK rıza
 * onayının daha önce verildiği bilgisi). Fotoğraf gibi hassas verilerin
 * kalıcı depoda tutulması KVKK gereği yasak — bunun için `services/camera.ts`
 * içindeki `deleteLocalPhoto` kullanılır.
 */
const PHOTO_CONSENT_KEY = '@benim-cildim/photo-consent-given';

export async function getStoredPhotoConsent(): Promise<boolean> {
  const value = await AsyncStorage.getItem(PHOTO_CONSENT_KEY);
  return value === 'true';
}

export async function setStoredPhotoConsent(consentGiven: boolean): Promise<void> {
  await AsyncStorage.setItem(PHOTO_CONSENT_KEY, consentGiven ? 'true' : 'false');
}

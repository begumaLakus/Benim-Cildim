import * as FileSystem from 'expo-file-system';

/**
 * KVKK gereği: fotoğraf işlendikten (backend'e gönderildikten) hemen sonra
 * ya da kullanıcı akıştan çıktığında yerel kopya silinmelidir. Bu yardımcı
 * fonksiyonu her iki durumda da çağır — sessizce başarısız olur, akışı
 * bloklamaz.
 */
export async function deleteLocalPhoto(uri: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch {
    // Silme başarısız olsa bile kullanıcı akışını bloklamayız; dosya zaten
    // uygulamanın sandbox'lı önbelleğinde olduğundan risk sınırlıdır.
  }
}

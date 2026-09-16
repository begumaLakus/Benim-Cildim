import { File } from 'expo-file-system';

/**
 * KVKK gereği: fotoğraf işlendikten hemen sonra ya da kullanıcı akıştan
 * çıktığında yerel kopya silinmelidir. Sessizce başarısız olur, akışı bloklamaz.
 * Not: `expo-file-system`'in eski API'si yerine `File` sınıfı kullanılıyor.
 */
export async function deleteLocalPhoto(uri: string): Promise<void> {
  try {
    const file = new File(uri);
    if (file.exists) {
      file.delete();
    }
  } catch {
    // Silme başarısız olsa bile kullanıcı akışını bloklamayız; dosya zaten
    // uygulamanın sandbox'lı önbelleğinde olduğundan risk sınırlıdır.
  }
}

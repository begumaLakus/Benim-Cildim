import { File } from 'expo-file-system';

/**
 * KVKK gereği: fotoğraf işlendikten (backend'e gönderildikten) hemen sonra
 * ya da kullanıcı akıştan çıktığında yerel kopya silinmelidir. Bu yardımcı
 * fonksiyonu her iki durumda da çağır — sessizce başarısız olur, akışı
 * bloklamaz.
 *
 * NOT: `expo-file-system`'in eski `getInfoAsync`/`deleteAsync` API'si SDK
 * 57'de deprecated oldu (yeni proje kuruluyorsa `expo-file-system/legacy`
 * import etmeye gerek yok) — bunun yerine `File` sınıfı kullanılıyor.
 * `new File(uri)` tam bir dosya URI'si ile doğrudan oluşturulabilir, dosya
 * sistemde var olmak zorunda değil; `exists`/`delete()` senkron çalışır.
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

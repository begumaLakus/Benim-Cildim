/** Kullanıcının YEREL gün anahtarı — `toISOString()` bilerek kullanılmıyor, o UTC'ye çevirip gece yarısı yakınında yanlış güne yazdırabilirdi. */
export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

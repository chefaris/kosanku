/**
 * Utility generator ID yang aman dan kompatibel dengan standar cloud database (UUID / CUID format).
 * Mencegah tabrakan ID (ID collision) saat berjalan di lingkungan multi-user atau saat disinkronkan ke PostgreSQL.
 */

export function generateSafeId(prefix: string = 'id'): string {
  // 1. Gunakan crypto.randomUUID jika didukung oleh peramban/Node environment
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return `${prefix}_${crypto.randomUUID()}`;
    } catch {
      // Fallback jika crypto.randomUUID gagal pada context tertentu
    }
  }

  // 2. High-entropy fallback berbasis timestamp + random entropy
  const timestamp = Date.now().toString(36);
  const entropy = Math.random().toString(36).substring(2, 10);
  const counter = (Math.floor(Math.random() * 9000) + 1000).toString(36);
  
  return `${prefix}_${timestamp}_${entropy}${counter}`;
}

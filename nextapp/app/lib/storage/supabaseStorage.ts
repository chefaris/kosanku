import { supabase } from '../supabase';
import { generateSafeId } from '../utils/idGenerator';

/**
 * Konversi Data URL Base64 menjadi Blob biner agar ringan saat diunggah ke Supabase Storage.
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Mengunggah foto ke Supabase Storage (Bucket 'kos-photos') dan mengembalikan URL CDN publik.
 * Jika koneksi offline atau kredensial Supabase belum terkonfigurasi,
 * sistem akan secara otomatis kembali (fallback) ke Data URL lokal tanpa error.
 */
export async function uploadPhotoToSupabase(
  fileOrDataUrl: File | string,
  folderPrefix: string = 'properties'
): Promise<string> {
  // Jika placeholder atau offline, kembalikan langsung
  if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://'))) {
    return fileOrDataUrl;
  }

  try {
    let blob: Blob;
    let fileExt = 'jpg';

    if (fileOrDataUrl instanceof File) {
      blob = fileOrDataUrl;
      const parts = fileOrDataUrl.name.split('.');
      if (parts.length > 1) {
        fileExt = parts.pop()?.toLowerCase() || 'jpg';
      }
    } else {
      blob = dataUrlToBlob(fileOrDataUrl);
    }

    const uniqueFileName = `${generateSafeId('img')}.${fileExt}`;
    const filePath = `${folderPrefix}/${uniqueFileName}`;

    const { data, error } = await supabase.storage
      .from('kos-photos')
      .upload(filePath, blob, {
        contentType: blob.type || 'image/jpeg',
        cacheControl: '31536000', // 1 tahun cache di CDN browser
        upsert: true
      });

    if (error) {
      console.warn('💡 Supabase Storage upload fallback (menggunakan penyimpanan lokal):', error.message);
      // Fallback: kembalikan data URL jika upload cloud gagal
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : URL.createObjectURL(blob);
    }

    // Ambil URL CDN publik
    const { data: urlData } = supabase.storage
      .from('kos-photos')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err) {
    console.warn('💡 Error upload photo to cloud storage, fallback to local:', err);
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
  }
}

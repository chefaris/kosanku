'use client';

import React, { useState } from 'react';
import { Camera, Upload, Loader2, ImagePlus } from 'lucide-react';
import { uploadPhotoToSupabase } from '../../lib/storage/supabaseStorage';

interface ImageCompressorUploaderProps {
  onImagesCompressed: (dataUrls: string[]) => void;
  maxDimension?: number;
  quality?: number;
  label?: string;
  sublabel?: string;
  id?: string;
  multiple?: boolean;
  className?: string;
}

/**
 * Komponen Reusable untuk Pengunggahan & Kompresi Foto Offline (HTML5 Canvas).
 * Mengurangi ukuran gambar hingga ~98% (dari 5-15MB menjadi ~60-100KB)
 * sebelum disimpan ke memori/localStorage peramban tanpa membebani kuota.
 */
export const ImageCompressorUploader: React.FC<ImageCompressorUploaderProps> = ({
  onImagesCompressed,
  maxDimension = 1200,
  quality = 0.78,
  label = 'Unggah Foto dari HP / Komputer',
  sublabel = 'Ambil foto kamera HP atau pilih dari galeri. Otomatis dikompres & tersimpan di perangkat lokal.',
  id = 'local-image-compressor-input',
  multiple = true,
  className = ''
}) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const compressSingleFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    setErrorMsg(null);

    try {
      const compressedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const localDataUrl = await compressSingleFile(file);
        // Unggah ke Supabase Cloud Storage (CDN) atau fallback ke localDataUrl jika offline
        const finalUrl = await uploadPhotoToSupabase(localDataUrl, 'properties');
        compressedList.push(finalUrl);
      }

      if (compressedList.length > 0) {
        onImagesCompressed(compressedList);
      }
    } catch (err) {
      console.error('Gagal mengompresi gambar:', err);
      setErrorMsg('Gagal memproses foto. Silakan coba lagi dengan format gambar standar.');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  return (
    <div
      className={`p-3.5 bg-peach-50/60 rounded-2xl border-2 border-dashed border-peach-300 hover:border-peach-500 transition-colors text-center ${className}`}
    >
      <input
        type="file"
        id={id}
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        disabled={isCompressing}
        className="hidden"
      />
      <label
        htmlFor={id}
        className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-1.5"
      >
        <div className="w-10 h-10 rounded-2xl bg-peach-100 text-peach-700 flex items-center justify-center shadow-xs">
          {isCompressing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </div>
        <div>
          <span className="text-xs font-heading font-extrabold text-peach-800 hover:text-peach-900 underline flex items-center justify-center gap-1">
            <Upload className="w-3.5 h-3.5" />
            <span>{isCompressing ? 'Sedang Mengompres Foto...' : label}</span>
          </span>
          {sublabel && (
            <p className="text-[10px] text-softgray font-medium mt-0.5 max-w-sm mx-auto">
              {sublabel}
            </p>
          )}
        </div>
      </label>
      {errorMsg && (
        <p className="text-[10px] text-rose-600 font-bold mt-1">{errorMsg}</p>
      )}
    </div>
  );
};

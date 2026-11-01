'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, Check, User, Sparkles, Shuffle } from 'lucide-react';

export interface AvatarPickerProps {
  currentPhoto: string | null;
  onSelectPhoto: (photo: string) => void;
  label?: string;
}

// 5 Karakter Kucing 3D pawskost Bawaan + Mimi Maskot Resmi
export const defaultTenantAvatars = [
  {
    id: 'mimi-gamer',
    name: 'Mimi Gamer 🎮',
    url: '/cat-avatar-gamer.jpg',
    description: 'Kucing Oren main game retro & headphone'
  },
  {
    id: 'mimi-groceries',
    name: 'Mimi Belanja 🥖',
    url: '/cat-avatar-groceries.jpg',
    description: 'Kucing Oren belanja roti & sayuran segar'
  },
  {
    id: 'mimi-gym',
    name: 'Mimi Olahraga 🏋️',
    url: '/cat-avatar-gym.jpg',
    description: 'Kucing Abu-Putih angkat barbel pink & celemek'
  },
  {
    id: 'mimi-laundry',
    name: 'Mimi Laundry 🧺',
    url: '/cat-avatar-laundry.jpg',
    description: 'Kucing Calico 3 warna cuci baju & mesin cuci'
  },
  {
    id: 'mimi-music',
    name: 'Mimi Musik 🎧',
    url: '/cat-avatar-music.jpg',
    description: 'Kucing Fold abu-abu dengerin musik & baca komik'
  },
  {
    id: 'mimi-mascot',
    name: 'Mimi Maskot 🐾',
    url: '/mimi-mascot.jpg',
    description: 'Maskot resmi pawskost yang ramah & ceria'
  }
];

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  currentPhoto,
  onSelectPhoto,
  label = 'Pilih Karakter Maskot atau Foto Penghuni'
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto terlalu besar, maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelectPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectRandom = () => {
    const randomIdx = Math.floor(Math.random() * defaultTenantAvatars.length);
    onSelectPhoto(defaultTenantAvatars[randomIdx].url);
  };

  const selectedAvatarObj = defaultTenantAvatars.find((a) => a.url === currentPhoto);

  return (
    <div className="space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-darkcocoa flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-peach-500" />
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectRandom}
            className="text-[11px] text-peach-600 hover:text-peach-700 font-bold flex items-center gap-1 bg-peach-50 px-2 py-0.5 rounded-lg border border-peach-200 transition-colors"
            title="Pilih karakter kucing acak"
          >
            <Shuffle className="w-3 h-3" />
            <span>Pilih Acak 🎲</span>
          </button>
          {currentPhoto && (
            <button
              type="button"
              onClick={() => onSelectPhoto('')}
              className="text-[10px] text-red-500 font-bold hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col sm:flex-row items-start gap-4 p-3 bg-white/80 rounded-2xl border border-cream-200 shadow-xs">
        {/* Active Photo Preview */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 self-center sm:self-start">
          <div className="relative w-20 h-20 rounded-2xl bg-cream-100 border-2 border-peach-400 overflow-hidden flex items-center justify-center shadow-cute group">
            {currentPhoto ? (
              <img
                src={currentPhoto}
                alt="Foto Profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-softgray">
                <User className="w-8 h-8 text-peach-400" />
                <span className="text-[9px] font-bold mt-0.5">Belum Dipilih</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-darkcocoa/60 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer gap-1"
              title="Unggah foto kustom"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ganti</span>
            </button>
          </div>
          {selectedAvatarObj ? (
            <span className="text-[10px] font-extrabold text-peach-600 text-center max-w-[90px] leading-tight">
              {selectedAvatarObj.name}
            </span>
          ) : currentPhoto ? (
            <span className="text-[10px] font-bold text-softgray text-center">Foto Kustom</span>
          ) : null}
        </div>

        {/* 5 Karakter Kucing 3D Default Pilihan */}
        <div className="flex-1 min-w-0 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-softgray uppercase tracking-wider">
              Karakter Kucing 3D pawskost (Default):
            </span>
            <span className="text-[10px] text-peach-500 font-semibold">Klik salah satu</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {defaultTenantAvatars.map((avatar) => {
              const isSelected = currentPhoto === avatar.url;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => onSelectPhoto(avatar.url)}
                  className={`relative flex flex-col items-center p-1 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 group ${
                    isSelected
                      ? 'border-peach-500 bg-peach-50/60 ring-2 ring-peach-300 shadow-sm'
                      : 'border-cream-200 bg-cream-50/50 hover:border-peach-300 hover:bg-cream-100'
                  }`}
                  title={`${avatar.name}: ${avatar.description}`}
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-xs">
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-peach-500/25 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-darkcocoa text-center mt-1 truncate w-full">
                    {avatar.name.split(' ')[1] || avatar.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Upload Button */}
          <div className="pt-1 flex items-center justify-between gap-2 border-t border-cream-100 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-darkcocoa border border-cream-200 text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-peach-500" />
              <span>Unggah Foto Sendiri</span>
            </button>
            <span className="text-[10px] text-softgray">Mendukung format JPG, PNG maks. 2MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};


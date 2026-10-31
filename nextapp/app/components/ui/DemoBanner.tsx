'use client';

import React, { useState } from 'react';
import { useKosStore } from '../../lib/store/useKosStore';
import { RotateCcw, UserPlus, ChevronUp, ChevronDown, Gamepad2 } from 'lucide-react';

interface DemoBannerProps {
  onOpenRegisterModal: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenRegisterModal }) => {
  const { currentUser, resetDemoData } = useKosStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // If logged in as real owner, don't show the demo banner
  if (!currentUser?.isDemo) {
    return null;
  }

  const handleReset = () => {
    resetDemoData();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 animate-in fade-in duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-peach-500 to-sakura-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95 transition-all"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Mode Demo Aktif</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Informasi Mode Demo" className="relative mb-4 md:mb-6 animate-in slide-in-from-top-2 duration-200">
      <div className="bg-gradient-to-r from-peach-100/90 via-sakura-100/80 to-cream-100 rounded-3xl p-4 md:p-4.5 border border-peach-200/90 shadow-cute flex flex-col md:flex-row md:items-center justify-between gap-3 text-darkcocoa">
        {/* Left Side: Badge & Info */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-peach-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 md:mt-0">
            <Gamepad2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-peach-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wide uppercase shadow-sm">
                Akun Demo Interaktif
              </span>
              <span className="text-xs text-softgray font-medium">
                • Mode Sandbox
              </span>
            </div>
            <p className="text-xs font-body text-darkcocoa/90 mt-1 leading-snug">
              Hai Kak! Anda sedang menjelajahi simulasi KosanKu. Bebas coba tambah kamar, ubah tagihan, hingga hapus lantai tanpa batas.
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto flex-shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-cream-50 text-darkcocoa text-xs font-bold border border-cream-200 shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
            title="Kembalikan data kamar & tagihan ke kondisi awal bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5 text-peach-500" />
            <span>Reset Data</span>
          </button>

          <button
            type="button"
            onClick={onOpenRegisterModal}
            className="px-4 py-2 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white text-xs font-bold shadow-cute flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Buat Akun Kos Saya</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-xl text-softgray hover:text-darkcocoa hover:bg-white/60 transition-colors ml-1"
            title="Ciutkan banner ini"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating notification when reset */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-darkcocoa text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <RotateCcw className="w-4 h-4 text-peach-300" />
          <span>Data simulasi demo berhasil dikembalikan ke kondisi awal!</span>
        </div>
      )}
    </aside>
  );
};

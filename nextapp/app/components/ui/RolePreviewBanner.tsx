'use client';

import React from 'react';
import { useKosStore } from '../../lib/store/useKosStore';
import { Eye, ShieldAlert, ArrowLeft, Crown } from 'lucide-react';

export const RolePreviewBanner: React.FC = () => {
  const { previewRole, setPreviewRole } = useKosStore();

  if (!previewRole) return null;

  const roleLabels: Record<string, { title: string; desc: string; color: string }> = {
    cashier: {
      title: 'Mode Simulasi: Staf Kasir & Resepsionis 💳',
      desc: 'Hanya bisa update pembayaran sewa (/billing) & cek ketersediaan kamar (/rooms). Menu keuangan rahasia pemilik disembunyikan.',
      color: 'bg-amber-600'
    },
    manager: {
      title: 'Mode Simulasi: Pengelola / Manajer Kos 👔',
      desc: 'Operasional kos aktif. Rekening pencairan & langganan SaaS pemilik terproteksi.',
      color: 'bg-matcha-600'
    },
    staff_ops: {
      title: 'Mode Simulasi: Penjaga Kos & Teknisi 🛠️',
      desc: 'Hanya bisa melihat kondisi kamar & tiket komplain perawatan (/maintenance). Terisolasi dari data keuangan.',
      color: 'bg-blue-600'
    }
  };

  const currentInfo = roleLabels[previewRole] || {
    title: 'Mode Simulasi Hak Akses',
    desc: 'Sedang menguji tampilan peran staf.',
    color: 'bg-peach-600'
  };

  return (
    <aside aria-label="Mode Simulasi Hak Akses Staf" className={`${currentInfo.color} text-white px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md z-[999]`}>
      <div className="flex items-center gap-2 text-center sm:text-left">
        <span className="p-1 rounded-lg bg-white/20">
          <Eye className="w-3.5 h-3.5" />
        </span>
        <div>
          <span className="font-extrabold">{currentInfo.title}</span>
          <span className="hidden md:inline text-[11px] opacity-90 ml-2">
            — {currentInfo.desc}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPreviewRole(null)}
        className="py-1 px-3 rounded-xl bg-white text-darkcocoa hover:bg-cream-100 font-extrabold text-[11px] shadow-sm flex items-center gap-1.5 transition-transform active:scale-95 flex-shrink-0"
      >
        <Crown className="w-3.5 h-3.5 text-peach-600" />
        <span>Kembali ke Akun Pemilik 👑</span>
      </button>
    </aside>
  );
};

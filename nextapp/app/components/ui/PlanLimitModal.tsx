'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Building2,
  DoorOpen
} from 'lucide-react';

export interface PlanLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'room' | 'property';
  current: number;
  max: number;
  planName: string;
}

export const PlanLimitModal: React.FC<PlanLimitModalProps> = ({
  isOpen,
  onClose,
  type,
  current,
  max,
  planName
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const isRoom = type === 'room';
  const entityLabel = isRoom ? 'Kamar' : 'Cabang Kos';
  const IconComponent = isRoom ? DoorOpen : Building2;

  const handleGoToSubscription = () => {
    onClose();
    router.push('/subscription');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col"
      >
        {/* Header Ribbon */}
        <div className="p-6 bg-gradient-to-br from-peach-100 via-sakura-50 to-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/60 hover:bg-white text-softgray hover:text-darkcocoa transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-3xl bg-peach-500 text-white flex items-center justify-center shadow-cute mb-3 text-2xl">
            <IconComponent className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full bg-peach-200/60 text-peach-700 text-[11px] font-bold uppercase tracking-wider">
            Batas Kuota Tercapai
          </span>

          <h3 className="text-xl font-heading font-extrabold text-darkcocoa mt-2">
            Kuota {entityLabel} Sudah Penuh!
          </h3>
          <p className="text-xs text-softgray mt-1 max-w-xs mx-auto">
            {planName} kamu saat ini sudah mencapai kapasitas maksimal.
          </p>
        </div>

        {/* Quota Gauge */}
        <div className="px-6 py-4 bg-cream-50 border-y border-cream-200">
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span className="text-darkcocoa">Penggunaan {entityLabel}:</span>
            <span className="text-peach-600 font-mono">
              {current} dari {max} {entityLabel} (100%)
            </span>
          </div>
          <div className="w-full h-3 bg-cream-200 rounded-full overflow-hidden">
            <div className="h-full bg-peach-500 rounded-full w-full" />
          </div>
        </div>

        {/* Benefits list */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-bold text-darkcocoa">
            Upgrade ke <strong>Paket Juragan Pro</strong> untuk membuka:
          </p>

          <ul className="space-y-2 text-xs text-softgray">
            <li className="flex items-center gap-2 text-darkcocoa">
              <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
              <span>Kelola hingga <strong>50 Kamar</strong> &amp; <strong>3 Cabang</strong></span>
            </li>
            <li className="flex items-center gap-2 text-darkcocoa">
              <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
              <span>Master Fasilitas &amp; Kelola Lantai Dinamis</span>
            </li>
            <li className="flex items-center gap-2 text-darkcocoa">
              <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
              <span>Arsip KTP Penghuni dengan Watermark Resmi</span>
            </li>
            <li className="flex items-center gap-2 text-darkcocoa">
              <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
              <span>Prioritas Customer Support WhatsApp 24/7</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="p-5 bg-cream-50 border-t border-cream-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-2xl bg-white border border-cream-200 text-softgray hover:text-darkcocoa text-xs font-bold transition-colors"
          >
            Nanti Saja
          </button>

          <button
            type="button"
            onClick={handleGoToSubscription}
            className="flex-1 py-2.5 px-5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white text-xs font-bold shadow-cute transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lihat Paket &amp; Upgrade</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileCheck2,
  CheckCircle2,
  Clock,
  Building2,
  User,
  CreditCard,
  ArrowRight,
  Download
} from 'lucide-react';
import { SaaSUserAccount } from '../../lib/store/useKosStore';

export interface ProofViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: SaaSUserAccount | null;
  onOpenApproval?: (account: SaaSUserAccount) => void;
}

export const ProofViewerModal: React.FC<ProofViewerModalProps> = ({
  isOpen,
  onClose,
  account,
  onOpenApproval
}) => {
  if (!isOpen || !account) return null;

  const handleProceedToApproval = () => {
    onClose();
    if (onOpenApproval) {
      onOpenApproval(account);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-body">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-peach-500 to-peach-400 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  Struk Bukti Transfer Bank
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  account.status === 'pending_approval'
                    ? 'bg-amber-400 text-amber-950'
                    : 'bg-white/20 text-white'
                }`}>
                  {account.status === 'pending_approval' ? 'Perlu Konfirmasi' : 'Terverifikasi'}
                </span>
              </div>
              <p className="text-[11px] text-white/90">
                Pendaftar: <strong>{account.name}</strong> • {account.kosName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-cream-50/50">
          {account.proofUrl ? (
            <div className="w-full flex flex-col items-center space-y-3">
              <div className="w-full max-w-md rounded-2xl overflow-hidden border-2 border-cream-300 bg-white shadow-md p-2 flex items-center justify-center">
                <img
                  src={account.proofUrl}
                  alt={`Bukti transfer dari ${account.name}`}
                  className="w-full h-auto max-h-[52vh] object-contain rounded-xl"
                />
              </div>

              {/* Sender Details Box */}
              <div className="w-full max-w-md p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5 text-darkcocoa">
                <p className="font-bold text-amber-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Catatan Pengirim / Mutasi Transfer:</span>
                </p>
                <p className="text-amber-950 font-semibold bg-white p-2 rounded-xl border border-amber-200/80 font-mono text-[11px]">
                  {account.proofNotes || 'Tidak ada catatan pengirim yang dilampirkan.'}
                </p>
                <div className="flex items-center justify-between text-[11px] text-softgray pt-1">
                  <span>Paket: <strong className="text-darkcocoa">{account.planName}</strong></span>
                  <span>Terdaftar: <strong className="text-darkcocoa">{account.registeredAt}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-cream-200 text-softgray flex items-center justify-center mx-auto">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <p className="font-bold text-darkcocoa text-sm">Belum Ada Struk Bukti Digital</p>
              <p className="text-xs text-softgray max-w-xs mx-auto">
                Calon penyewa belum mengunggah foto struk transfer. Anda dapat menghubungi via WhatsApp untuk meminta bukti transfer.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-cream-200 flex items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa font-bold text-xs transition-colors"
          >
            Tutup
          </button>

          {account.status === 'pending_approval' && onOpenApproval && (
            <button
              type="button"
              onClick={handleProceedToApproval}
              className="py-2.5 px-5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verifikasi Sah &amp; Buka Akses Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

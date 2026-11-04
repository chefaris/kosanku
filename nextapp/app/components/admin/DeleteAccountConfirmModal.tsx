'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, X, ShieldAlert, Building2, User, Mail, Sparkles } from 'lucide-react';
import { SaaSUserAccount } from '../../lib/store/useKosStore';

export interface DeleteAccountConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: SaaSUserAccount | null;
  onConfirmDelete: (accountId: string) => Promise<void> | void;
}

export const DeleteAccountConfirmModal: React.FC<DeleteAccountConfirmModalProps> = ({
  isOpen,
  onClose,
  account,
  onConfirmDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !account) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(account.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-body">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-white">
                Hapus Akun Tenant Permanen
              </h3>
              <p className="text-[11px] text-rose-100">
                Pembersihan tuntas sistem &amp; cloud database
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Warning Banner */}
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-xs text-red-800">
                Apakah Anda yakin ingin menghapus akun ini?
              </p>
              <p className="text-[11px] text-red-600 leading-relaxed">
                Tindakan ini bersifat <strong>permanen</strong>. Seluruh data properti, kamar, tagihan, serta profil di cloud database akan dihapus dan <strong>tidak akan pernah muncul kembali</strong>.
              </p>
            </div>
          </div>

          {/* Account Detail Card */}
          <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200/80 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200/60">
              <span className="text-softgray font-semibold text-[11px]">ID Tenant:</span>
              <span className="font-mono text-[11px] font-bold text-darkcocoa">{account.id}</span>
            </div>

            <div className="flex items-center gap-2 text-darkcocoa">
              <User className="w-3.5 h-3.5 text-peach-500 flex-shrink-0" />
              <span className="font-bold">{account.name}</span>
            </div>

            <div className="flex items-center gap-2 text-darkcocoa">
              <Building2 className="w-3.5 h-3.5 text-peach-500 flex-shrink-0" />
              <span className="font-semibold text-softgray">{account.kosName}</span>
            </div>

            <div className="flex items-center gap-2 text-darkcocoa">
              <Mail className="w-3.5 h-3.5 text-peach-500 flex-shrink-0" />
              <span className="font-mono text-[11px]">{account.email}</span>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-softgray">Paket Lisensi:</span>
              <span className="font-bold text-peach-600">{account.planName}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isDeleting}
              onClick={onClose}
              className="py-2.5 px-4 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa font-bold text-xs transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirm}
              className="py-2.5 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-cute flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Ya, Hapus Permanen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

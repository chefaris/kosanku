'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Calendar,
  X,
  AlertCircle,
  Building2,
  Phone,
  User,
  ArrowRight,
  FileCheck2,
  ExternalLink,
  ZoomIn,
  Clock
} from 'lucide-react';
import { useKosStore, SaaSUserAccount } from '../../lib/store/useKosStore';

export interface ManualApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: SaaSUserAccount | null;
  onApproved?: () => void;
}

export const ManualApprovalModal: React.FC<ManualApprovalModalProps> = ({
  isOpen,
  onClose,
  account,
  onApproved
}) => {
  const { approveUserSubscriptionManual } = useKosStore();

  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [durationDays, setDurationDays] = useState<number>(30);
  const [amount, setAmount] = useState<number>(99000);
  const [paymentMethod, setPaymentMethod] = useState<string>('Transfer Bank BCA Pribadi');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isZoomingProof, setIsZoomingProof] = useState(false);

  // Sync state when account opens
  useEffect(() => {
    if (account) {
      if (account.plan === 'starter' || account.plan === 'pro' || account.plan === 'enterprise') {
        setSelectedPlan(account.plan);
      } else {
        setSelectedPlan('pro');
      }
      setDurationDays(30);
      setAmount(account.plan === 'enterprise' ? 199000 : account.plan === 'starter' ? 49000 : 99000);
      setPaymentMethod('Transfer Bank BCA Pribadi');
      setAdminNotes(account.proofNotes ? `Verifikasi bukti: ${account.proofNotes}` : '');
      setIsZoomingProof(false);
    }
  }, [account, isOpen]);

  // Update default amount when plan or duration changes
  const handlePlanChange = (plan: 'starter' | 'pro' | 'enterprise') => {
    setSelectedPlan(plan);
    recalcAmount(plan, durationDays);
  };

  const handleDurationChange = (days: number) => {
    setDurationDays(days);
    recalcAmount(selectedPlan, days);
  };

  const recalcAmount = (plan: 'starter' | 'pro' | 'enterprise', days: number) => {
    const prices: Record<string, { monthly: number; annual: number }> = {
      starter: { monthly: 49000, annual: 470000 },
      pro: { monthly: 99000, annual: 950000 },
      enterprise: { monthly: 199000, annual: 1900000 }
    };
    if (days >= 365) {
      setAmount(prices[plan].annual);
    } else if (days >= 90) {
      setAmount(prices[plan].monthly * 3);
    } else {
      setAmount(prices[plan].monthly);
    }
  };

  if (!isOpen || !account) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      approveUserSubscriptionManual(
        account.id,
        selectedPlan,
        durationDays,
        amount,
        paymentMethod,
        adminNotes
      );
      setIsSubmitting(false);
      if (onApproved) onApproved();
      onClose();
    }, 500);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[92vh] font-body"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-peach-500 to-peach-400 text-white relative flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                Verifikasi Transfer Manual Super Admin
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-heading font-extrabold flex items-center gap-2">
              <span>Periksa Bukti &amp; Buka Akses Akun</span>
              <ShieldCheck className="w-5 h-5 text-sakura-100" />
            </h2>
            <p className="text-xs text-white/90 mt-1">
              Verifikasi bukti transfer bank pendaftar dan aktifkan akun pemilik kos.
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
            {/* Subscriber info preview card */}
            <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-softgray font-medium">Pemilik Kos:</span>
                <span className="font-bold text-darkcocoa text-sm">{account.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-softgray font-medium">Properti Kos:</span>
                <span className="font-bold text-darkcocoa">{account.kosName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-softgray font-medium">No. WhatsApp &amp; Email:</span>
                <span className="font-mono font-bold text-darkcocoa">{account.phone} • {account.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-softgray font-medium">Status Saat Ini:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                  account.status === 'pending_approval'
                    ? 'bg-amber-100 text-amber-800'
                    : account.status === 'active'
                    ? 'bg-matcha-100 text-matcha-700'
                    : 'bg-peach-100 text-peach-600'
                }`}>
                  {account.status === 'pending_approval' && <Clock className="w-3 h-3" />}
                  {account.status === 'pending_approval'
                    ? 'Menunggu Verifikasi Bukti'
                    : account.status === 'active'
                    ? 'Aktif'
                    : account.status === 'trial'
                    ? 'Trial 14 Hari'
                    : 'Kedaluwarsa'}
                </span>
              </div>
            </div>

            {/* Bukti Pembayaran Preview Section */}
            <div className="space-y-2">
              <label className="font-bold text-darkcocoa flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-peach-500" />
                  <span>Bukti Transfer yang Diunggah:</span>
                </span>
                {account.proofUrl && (
                  <span className="text-[10px] bg-matcha-100 text-matcha-700 font-bold px-2 py-0.5 rounded-full">
                    Ada Struk 📎
                  </span>
                )}
              </label>

              {account.proofUrl ? (
                <div className="p-3 bg-white rounded-2xl border border-cream-200 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => setIsZoomingProof(true)}
                      className="w-20 h-24 rounded-xl border border-cream-300 bg-cream-50 overflow-hidden cursor-pointer hover:opacity-90 relative group flex-shrink-0"
                      title="Klik untuk memperbesar struk"
                    >
                      <img
                        src={account.proofUrl}
                        alt="Bukti Transfer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-darkcocoa/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <p className="font-bold text-darkcocoa text-xs">
                        Struk Transfer Pembayaran
                      </p>
                      {account.proofNotes ? (
                        <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200 font-medium">
                          &quot;{account.proofNotes}&quot;
                        </p>
                      ) : (
                        <p className="text-[11px] text-softgray italic">
                          Tidak ada catatan pengirim tambahan.
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsZoomingProof(true)}
                        className="text-[11px] font-bold text-peach-600 hover:text-peach-700 flex items-center gap-1 underline pt-0.5"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Perbesar Foto Struk Pembayaran</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-cream-50 border border-dashed border-cream-300 text-center text-softgray">
                  <p className="text-[11px]">Belum ada bukti transfer digital yang diunggah.</p>
                  <p className="text-[10px] text-softgray/80 mt-0.5">
                    Anda tetap bisa membuka akses jika calon penyewa telah transfer atau membayar tunai secara langsung.
                  </p>
                </div>
              )}
            </div>

            {/* Plan Selector */}
            <div className="space-y-1.5">
              <label className="block font-bold text-darkcocoa">
                Pilih Paket yang Diaktifkan:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePlanChange('starter')}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    selectedPlan === 'starter'
                      ? 'bg-peach-50 border-peach-400 text-peach-600 font-bold shadow-sm'
                      : 'bg-white border-cream-200 text-softgray hover:border-peach-200'
                  }`}
                >
                  <p className="font-bold text-[11px]">Paket Mungil</p>
                  <p className="text-[9px] text-softgray mt-0.5">1 Cabang • 10 Kamar</p>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlanChange('pro')}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    selectedPlan === 'pro'
                      ? 'bg-peach-50 border-peach-400 text-peach-600 font-bold shadow-sm'
                      : 'bg-white border-cream-200 text-softgray hover:border-peach-200'
                  }`}
                >
                  <p className="font-bold text-[11px] flex items-center justify-center gap-1">
                    <span>Juragan Pro</span>
                    <Sparkles className="w-3 h-3 text-peach-500" />
                  </p>
                  <p className="text-[9px] text-softgray mt-0.5">3 Cabang • 50 Kamar</p>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlanChange('enterprise')}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    selectedPlan === 'enterprise'
                      ? 'bg-peach-50 border-peach-400 text-peach-600 font-bold shadow-sm'
                      : 'bg-white border-cream-200 text-softgray hover:border-peach-200'
                  }`}
                >
                  <p className="font-bold text-[11px]">Konglomerat</p>
                  <p className="text-[9px] text-softgray mt-0.5">Unlimited Cabang</p>
                </button>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="space-y-1.5">
              <label className="block font-bold text-darkcocoa">
                Masa Aktif Lisensi yang Diberikan:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDurationChange(30)}
                  className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-all text-xs ${
                    durationDays === 30
                      ? 'bg-peach-50 border-peach-400 text-peach-600 shadow-sm'
                      : 'bg-white border-cream-200 text-softgray'
                  }`}
                >
                  +30 Hari (1 Bulan)
                </button>
                <button
                  type="button"
                  onClick={() => handleDurationChange(90)}
                  className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-all text-xs ${
                    durationDays === 90
                      ? 'bg-peach-50 border-peach-400 text-peach-600 shadow-sm'
                      : 'bg-white border-cream-200 text-softgray'
                  }`}
                >
                  +90 Hari (3 Bulan)
                </button>
                <button
                  type="button"
                  onClick={() => handleDurationChange(365)}
                  className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-all text-xs ${
                    durationDays === 365
                      ? 'bg-peach-50 border-peach-400 text-peach-600 shadow-sm'
                      : 'bg-white border-cream-200 text-softgray'
                  }`}
                >
                  +365 Hari (1 Tahun)
                </button>
              </div>
            </div>

            {/* Amount and Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-darkcocoa">
                  Nominal Diterima (Rp):
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-cream-200 focus:outline-none focus:ring-2 focus:ring-peach-300 font-mono font-bold text-darkcocoa text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-darkcocoa">
                  Rekening Penerima:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-200 focus:outline-none focus:ring-2 focus:ring-peach-300 font-semibold text-darkcocoa bg-white text-xs"
                >
                  <option value="Transfer Bank BCA Pribadi">BCA - 8420-1928-31</option>
                  <option value="Transfer Bank Mandiri">Mandiri - 1370-0192-8381</option>
                  <option value="QRIS Statis KosanKu">QRIS Statis KosanKu</option>
                  <option value="Tunai / Cash Langsung">Tunai / Cash Langsung</option>
                </select>
              </div>
            </div>

            {/* Admin Note */}
            <div className="space-y-1">
              <label className="block font-bold text-darkcocoa">
                Catatan Verifikasi Super Admin (Opsional):
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Contoh: Bukti transfer BCA diverifikasi via m-BCA mutasi masuk."
                className="w-full px-3 py-2 rounded-xl border border-cream-200 focus:outline-none focus:ring-2 focus:ring-peach-300 text-darkcocoa text-xs"
              />
            </div>

            {/* Buttons */}
            <div className="pt-2 border-t border-cream-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa font-bold transition-colors"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold shadow-cute transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✅ Verifikasi Sah &amp; Buka Akses Akun</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Lightbox Modal: Perbesar Bukti Transfer */}
      {isZoomingProof && account.proofUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-cream-200 pb-2">
              <span className="font-heading font-black text-sm text-darkcocoa">
                Foto Bukti Transfer ({account.name})
              </span>
              <button
                type="button"
                onClick={() => setIsZoomingProof(false)}
                className="p-1 rounded-xl text-softgray hover:text-darkcocoa hover:bg-cream-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-cream-200 bg-cream-50 flex items-center justify-center max-h-[65vh]">
              <img
                src={account.proofUrl}
                alt="Bukti Transfer Penuh"
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>

            {account.proofNotes && (
              <p className="text-xs text-darkcocoa bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <strong>Catatan Pengirim:</strong> {account.proofNotes}
              </p>
            )}

            <button
              type="button"
              onClick={() => setIsZoomingProof(false)}
              className="w-full py-2 rounded-xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs"
            >
              Kembali ke Konfirmasi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

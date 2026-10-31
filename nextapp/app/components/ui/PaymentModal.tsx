'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  CreditCard,
  Store,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  AlertCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { useKosStore } from '../../lib/store/useKosStore';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: 'starter' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  onSuccess?: () => void;
}

const PLAN_META = {
  starter: {
    name: 'Paket Kos Mungil',
    monthlyPrice: 49000,
    annualPrice: 470000,
    rooms: '10 Kamar',
    properties: '1 Cabang Kos',
    badge: 'Pemula'
  },
  pro: {
    name: 'Paket Juragan Pro',
    monthlyPrice: 99000,
    annualPrice: 950000,
    rooms: '50 Kamar',
    properties: '3 Cabang Kos',
    badge: 'Terfavorit ⭐'
  },
  enterprise: {
    name: 'Paket Konglomerat',
    monthlyPrice: 199000,
    annualPrice: 1900000,
    rooms: 'Kamar Tanpa Batas',
    properties: 'Cabang Tanpa Batas',
    badge: 'Sultan'
  }
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  billingCycle,
  onSuccess
}) => {
  const { upgradeSubscription } = useKosStore();

  const [activeTab, setActiveTab] = useState<'qris' | 'va' | 'retail'>('qris');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bri' | 'bni'>('bca');
  const [selectedRetail, setSelectedRetail] = useState<'indomaret' | 'alfamart'>('indomaret');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(899); // 14:59

  const planInfo = PLAN_META[selectedPlan] || PLAN_META.pro;
  const amount = billingCycle === 'annual' ? planInfo.annualPrice : planInfo.monthlyPrice;

  // Countdown timer for realistic payment window
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Reset states on open/close
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsProcessing(false);
      setCopied(false);
      setCountdown(899);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const vaNumbers = {
    bca: '8277 0812 3456 7890',
    mandiri: '8890 0812 3456 7890',
    bri: '1280 0812 3456 7890',
    bni: '9880 0812 3456 7890'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    const paymentMethodLabel =
      activeTab === 'qris'
        ? 'QRIS Mandiri/BCA/E-Wallet'
        : activeTab === 'va'
        ? `Virtual Account ${selectedBank.toUpperCase()}`
        : `Gerai ${selectedRetail === 'indomaret' ? 'Indomaret' : 'Alfamart'}`;

    setTimeout(() => {
      upgradeSubscription(selectedPlan, billingCycle, paymentMethodLabel, amount);
      setIsProcessing(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-peach-500 to-peach-400 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider">
              {planInfo.badge}
            </span>
            <span className="text-xs text-white/90">
              Periode {billingCycle === 'annual' ? '1 Tahun Penuh' : '1 Bulan'}
            </span>
          </div>

          <h2 className="text-2xl font-heading font-extrabold">
            {planInfo.name}
          </h2>

          <div className="mt-3 flex items-baseline justify-between border-t border-white/20 pt-3">
            <div>
              <p className="text-xs text-white/80">Total Tagihan Pembayaran:</p>
              <p className="text-3xl font-heading font-black">
                Rp {amount.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-sakura-200" />
              <span>Sisa Waktu: {timeFormatted}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSuccess ? (
            /* Success Celebration View */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-5"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-matcha-100 text-matcha-500 flex items-center justify-center shadow-cute animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-heading font-black text-darkcocoa">
                  Hore! Pembayaran Diterima!
                </h3>
                <p className="text-sm text-softgray max-w-md mx-auto">
                  Paket <strong>{planInfo.name}</strong> kamu kini telah aktif! Kuitansi resmi SaaS telah dicatat di riwayat langganan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-left max-w-sm mx-auto space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-softgray">Paket Baru:</span>
                  <span className="font-bold text-darkcocoa">{planInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softgray">Kapasitas Kamar:</span>
                  <span className="font-bold text-matcha-600">{planInfo.rooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softgray">Kapasitas Cabang:</span>
                  <span className="font-bold text-matcha-600">{planInfo.properties}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softgray">Status Lisensi:</span>
                  <span className="font-bold text-matcha-600">Aktif Terverifikasi ✅</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full max-w-sm mx-auto py-3.5 px-6 rounded-2xl bg-matcha-500 hover:bg-matcha-400 text-white font-bold text-sm shadow-cute transition-all flex items-center justify-center gap-2"
              >
                <span>Mulai Kelola Kos Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <>
              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-cream-100 border border-cream-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('qris')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'qris'
                      ? 'bg-white text-peach-500 shadow-sm'
                      : 'text-softgray hover:text-darkcocoa'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QRIS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('va')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'va'
                      ? 'bg-white text-peach-500 shadow-sm'
                      : 'text-softgray hover:text-darkcocoa'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Virtual Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('retail')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'retail'
                      ? 'bg-white text-peach-500 shadow-sm'
                      : 'text-softgray hover:text-darkcocoa'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Gerai Retail</span>
                </button>
              </div>

              {/* TAB 1: QRIS */}
              {activeTab === 'qris' && (
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-peach-300 inline-block shadow-sm">
                    {/* Cute Stylized QR Code SVG */}
                    <div className="w-48 h-48 mx-auto relative bg-white p-2 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-full h-full text-darkcocoa"
                        viewBox="0 0 100 100"
                        fill="currentColor"
                      >
                        {/* QR Corners */}
                        <rect x="0" y="0" width="28" height="28" rx="4" fill="#2D283E" />
                        <rect x="4" y="4" width="20" height="20" rx="2" fill="#FFFFFF" />
                        <rect x="8" y="8" width="12" height="12" rx="2" fill="#FF8BA7" />

                        <rect x="72" y="0" width="28" height="28" rx="4" fill="#2D283E" />
                        <rect x="76" y="4" width="20" height="20" rx="2" fill="#FFFFFF" />
                        <rect x="80" y="8" width="12" height="12" rx="2" fill="#FF8BA7" />

                        <rect x="0" y="72" width="28" height="28" rx="4" fill="#2D283E" />
                        <rect x="4" y="76" width="20" height="20" rx="2" fill="#FFFFFF" />
                        <rect x="8" y="80" width="12" height="12" rx="2" fill="#FF8BA7" />

                        {/* QR Matrix Mock Bits */}
                        <rect x="36" y="6" width="6" height="6" />
                        <rect x="48" y="6" width="6" height="6" />
                        <rect x="58" y="10" width="6" height="6" />
                        <rect x="6" y="36" width="6" height="6" />
                        <rect x="18" y="40" width="6" height="6" />
                        <rect x="34" y="34" width="6" height="6" />
                        <rect x="44" y="40" width="6" height="6" />
                        <rect x="54" y="34" width="6" height="6" />
                        <rect x="64" y="42" width="6" height="6" />
                        <rect x="76" y="36" width="6" height="6" />
                        <rect x="88" y="40" width="6" height="6" />

                        <rect x="36" y="60" width="6" height="6" />
                        <rect x="48" y="54" width="6" height="6" />
                        <rect x="60" y="62" width="6" height="6" />
                        <rect x="74" y="58" width="6" height="6" />
                        <rect x="88" y="66" width="6" height="6" />

                        <rect x="36" y="76" width="6" height="6" />
                        <rect x="46" y="84" width="6" height="6" />
                        <rect x="58" y="76" width="6" height="6" />
                        <rect x="68" y="84" width="6" height="6" />
                        <rect x="82" y="78" width="6" height="6" />
                      </svg>

                      {/* Center Mascot Badge */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-11 h-11 bg-white rounded-xl shadow-md border-2 border-peach-400 p-0.5 flex items-center justify-center overflow-hidden">
                          <Image
                            src="/app-logo.jpg"
                            alt="Logo"
                            width={36}
                            height={36}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-darkcocoa">
                      NMID: ID1020304050607 • KOSANKU SAAS
                    </p>
                    <p className="text-[11px] text-softgray">
                      Dapat dipindai melalui GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin Mandiri, BRImo, dll.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: VIRTUAL ACCOUNT */}
              {activeTab === 'va' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-darkcocoa mb-2">
                      Pilih Bank Virtual Account:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['bca', 'mandiri', 'bri', 'bni'] as const).map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`py-2 px-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                            selectedBank === bank
                              ? 'bg-peach-50 border-peach-400 text-peach-500 shadow-sm'
                              : 'bg-white border-cream-200 text-softgray hover:border-peach-200'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                    <p className="text-xs text-softgray">Nomor Virtual Account {selectedBank.toUpperCase()}:</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-black text-darkcocoa">
                        {vaNumbers[selectedBank]}
                      </span>
                      <button
                        onClick={() => copyToClipboard(vaNumbers[selectedBank])}
                        className="p-2 rounded-xl bg-white border border-cream-200 text-peach-500 hover:bg-peach-50 transition-colors flex items-center gap-1 text-xs font-bold"
                      >
                        {copied ? <Check className="w-4 h-4 text-matcha-500" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'Disalin!' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-[11px] text-blue-900 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Petunjuk Pembayaran:
                    </p>
                    <p>1. Buka Mobile Banking / ATM {selectedBank.toUpperCase()} Anda.</p>
                    <p>2. Pilih menu <strong>Transfer &gt; Virtual Account</strong>.</p>
                    <p>3. Masukkan nomor VA di atas, cek nominal tagihan Rp {amount.toLocaleString('id-ID')}.</p>
                  </div>
                </div>
              )}

              {/* TAB 3: GERAI RETAIL */}
              {activeTab === 'retail' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRetail('indomaret')}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        selectedRetail === 'indomaret'
                          ? 'bg-peach-50 border-peach-400 text-peach-500 font-bold shadow-sm'
                          : 'bg-white border-cream-200 text-softgray'
                      }`}
                    >
                      <Store className="w-5 h-5 mx-auto mb-1 text-peach-500" />
                      <p className="text-xs font-bold">Indomaret</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRetail('alfamart')}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        selectedRetail === 'alfamart'
                          ? 'bg-peach-50 border-peach-400 text-peach-500 font-bold shadow-sm'
                          : 'bg-white border-cream-200 text-softgray'
                      }`}
                    >
                      <Store className="w-5 h-5 mx-auto mb-1 text-peach-500" />
                      <p className="text-xs font-bold">Alfamart / Alfamidi</p>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                    <p className="text-xs text-softgray">Kode Pembayaran Kasir:</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl font-black text-peach-500 tracking-wider">
                        KSK-892401
                      </span>
                      <button
                        onClick={() => copyToClipboard('KSK-892401')}
                        className="p-2 rounded-xl bg-white border border-cream-200 text-peach-500 hover:bg-peach-50 transition-colors flex items-center gap-1 text-xs font-bold"
                      >
                        {copied ? <Check className="w-4 h-4 text-matcha-500" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'Disalin!' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-softgray text-center">
                    Tunjukkan kode pembayaran di atas ke kasir dan sebutkan pembayaran SaaS KosanKu.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="p-5 bg-cream-50 border-t border-cream-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-softgray">
              <ShieldCheck className="w-4 h-4 text-matcha-500 flex-shrink-0" />
              <span>Simulasi Aman • Akun Langsung Aktif</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none py-2.5 px-4 rounded-2xl bg-white border border-cream-200 text-softgray hover:text-darkcocoa text-xs font-bold transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="flex-1 sm:flex-none py-2.5 px-5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white text-xs font-bold shadow-cute transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifikasi Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bayar Sekarang (Simulasi)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

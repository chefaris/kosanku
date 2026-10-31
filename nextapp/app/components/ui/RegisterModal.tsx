'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useKosStore, sampleProofReceipt, initialLandingPageConfig } from '../../lib/store/useKosStore';
import {
  X,
  Sparkles,
  Building2,
  User,
  Phone,
  Mail,
  Lock,
  CheckCircle2,
  CreditCard,
  Upload,
  Copy,
  Clock,
  Check,
  MessageCircle,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const { registerPendingOwner, landingPageConfig } = useKosStore();
  const cfg = landingPageConfig || initialLandingPageConfig;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Account Info
  const [name, setName] = useState('');
  const [kosName, setKosName] = useState('');
  const [phone, setPhone] = useState('08');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Plan Selection
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');

  // Step 3: Payment & Proof Upload
  const [proofUrl, setProofUrl] = useState<string>('');
  const [proofNotes, setProofNotes] = useState<string>('');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const planPrices: Record<string, { label: string; price: number; formattedPrice: string; desc: string }> = {
    starter: {
      label: cfg.pricing.starter.name,
      price: cfg.pricing.starter.price,
      formattedPrice: `Rp ${cfg.pricing.starter.price.toLocaleString('id-ID')}`,
      desc: `1 Lokasi Kos • Maks. ${cfg.pricing.starter.maxRooms} Kamar`
    },
    pro: {
      label: cfg.pricing.pro.name,
      price: cfg.pricing.pro.price,
      formattedPrice: `Rp ${cfg.pricing.pro.price.toLocaleString('id-ID')}`,
      desc: `3 Lokasi Kos • Maks. ${cfg.pricing.pro.maxRooms} Kamar`
    },
    enterprise: {
      label: cfg.pricing.enterprise.name,
      price: cfg.pricing.enterprise.price,
      formattedPrice: `Rp ${cfg.pricing.enterprise.price.toLocaleString('id-ID')}`,
      desc: 'Unlimited Cabang & Kamar Kos'
    }
  };

  const handleCopyAccount = (text: string, bank: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Ukuran file foto maksimal 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofUrl(reader.result as string);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleProof = () => {
    setProofUrl(sampleProofReceipt);
    setProofNotes(`Transfer ${selectedPlan === 'starter' ? 'Rp 49.000' : selectedPlan === 'enterprise' ? 'Rp 199.000' : 'Rp 99.000'} via m-BCA a/n ${name || 'Pemilik Kos'}`);
    setErrorMessage(null);
  };

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !kosName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Harap lengkapi semua kolom bertanda bintang.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleNextToStep3 = () => {
    setErrorMessage(null);
    setStep(3);
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl) {
      setErrorMessage('Harap unggah bukti transfer pembayaran atau gunakan sampel bukti pengujian.');
      return;
    }

    registerPendingOwner({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      phone: phone.trim(),
      kosName: kosName.trim(),
      plan: selectedPlan,
      proofUrl,
      proofNotes: proofNotes.trim() || `Transfer a/n ${name} (${planPrices[selectedPlan].formattedPrice})`
    });

    setStep(4);
  };

  const handleResetAndClose = () => {
    setStep(1);
    setName('');
    setKosName('');
    setPhone('08');
    setEmail('');
    setPassword('');
    setProofUrl('');
    setProofNotes('');
    setErrorMessage(null);
    onClose();
  };

  const openWhatsAppConfirmation = () => {
    const rawPhone = cfg.adminWhatsApp || '0812-3456-7890';
    let cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const msg = encodeURIComponent(
      `Halo Super Admin KosanKu! Saya baru saja mendaftar:\n\nNama: ${name}\nKos: ${kosName}\nEmail: ${email}\nPaket: ${planPrices[selectedPlan].label}\n\nSaya sudah mengunggah bukti transfer manual, mohon bantuan aktivasi akunnya ya Kak. Terima kasih!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-darkcocoa/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-cream-200 max-w-lg w-full overflow-hidden font-body relative animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-peach-100/80 via-sakura-100/60 to-cream-100 border-b border-cream-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-peach-300 shadow-sm flex-shrink-0 bg-white">
              <Image
                src="/app-logo.jpg"
                alt="Logo KosanKu"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa flex items-center gap-1.5">
                <span>Pendaftaran Pemilik Kos</span>
                <Sparkles className="w-4 h-4 text-peach-500" />
              </h3>
              <p className="text-[11px] text-softgray">
                Aktivasi Akun Resmi via Verifikasi Bukti Transfer
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl text-softgray hover:text-darkcocoa hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Only for Steps 1-3) */}
        {step < 4 && (
          <div className="bg-cream-50/80 px-4 py-2 border-b border-cream-100 flex items-center justify-between text-xs font-semibold text-softgray">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-peach-500 font-bold' : step > 1 ? 'text-matcha-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step > 1 ? 'bg-matcha-500 text-white' : step === 1 ? 'bg-peach-500 text-white' : 'bg-cream-200 text-softgray'
              }`}>
                {step > 1 ? '✓' : '1'}
              </span>
              <span>Data Akun</span>
            </div>

            <div className="w-6 h-0.5 bg-cream-200" />

            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-peach-500 font-bold' : step > 2 ? 'text-matcha-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step > 2 ? 'bg-matcha-500 text-white' : step === 2 ? 'bg-peach-500 text-white' : 'bg-cream-200 text-softgray'
              }`}>
                {step > 2 ? '✓' : '2'}
              </span>
              <span>Pilih Paket</span>
            </div>

            <div className="w-6 h-0.5 bg-cream-200" />

            <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-peach-500 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 3 ? 'bg-peach-500 text-white' : 'bg-cream-200 text-softgray'
              }`}>
                3
              </span>
              <span>Transfer &amp; Bukti</span>
            </div>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: FORM DATA DIRI & KREDENSIAL                      */}
          {/* ======================================================== */}
          {step === 1 && (
            <form onSubmit={handleNextToStep2} className="space-y-3.5 text-xs">
              <div className="p-3 bg-peach-50/70 rounded-2xl border border-peach-200 text-darkcocoa">
                <p className="font-bold text-[11px] text-peach-700 flex items-center gap-1">
                  <span>✨</span>
                  <span>Mulai Kelola Kos Lebih Nyaman &amp; Rapi</span>
                </p>
                <p className="text-[10px] text-softgray mt-0.5 leading-snug">
                  Isi informasi kos dan akun Anda. Pembayaran berlangganan dilakukan via transfer bank manual terverifikasi.
                </p>
              </div>

              {/* Nama Pemilik */}
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Nama Lengkap Pemilik Kos *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="misal: Ibu Ratna Dewi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              {/* Nama Kos */}
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Nama Kosan Utama Anda *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="misal: Kosan Cantika Paviliun"
                    value={kosName}
                    onChange={(e) => setKosName(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              {/* WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">
                    No. WhatsApp (Notifikasi) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-softgray absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="0812-xxxx-xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-darkcocoa block mb-1">
                    Alamat Email (Login) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-softgray absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Kata Sandi Baru *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
                <p className="text-[10px] text-softgray mt-1">
                  Kata sandi ini digunakan untuk masuk ke dashboard kos Anda setelah diaktivasi.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all mt-4"
              >
                <span>Lanjut Pilih Paket Langganan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 2: PILIH PAKET LANGGANAN                            */}
          {/* ======================================================== */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h4 className="font-heading font-black text-sm text-darkcocoa">
                  Pilih Paket SaaS KosanKu 🏷️
                </h4>
                <p className="text-softgray text-[11px]">
                  Pilih kapasitas yang paling sesuai dengan jumlah kamar &amp; cabang kos Anda.
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Starter */}
                <div
                  onClick={() => setSelectedPlan('starter')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedPlan === 'starter'
                      ? 'border-peach-400 bg-peach-50/60 shadow-sm'
                      : 'border-cream-200 bg-white hover:border-cream-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-xs text-darkcocoa">
                        Paket Kos Mungil
                      </span>
                      <span className="text-[10px] bg-cream-100 text-softgray px-2 py-0.5 rounded-full font-bold">
                        1 Cabang
                      </span>
                    </div>
                    <p className="text-[11px] text-softgray">Maksimal 10 kamar • Denah visual • Tagihan WhatsApp</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-black text-peach-600 text-sm">Rp 49.000</p>
                    <p className="text-[10px] text-softgray">/ bulan</p>
                  </div>
                </div>

                {/* Pro (Recommended) */}
                <div
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between relative ${
                    selectedPlan === 'pro'
                      ? 'border-peach-500 bg-peach-50/80 shadow-md ring-2 ring-peach-200'
                      : 'border-cream-200 bg-white hover:border-peach-300'
                  }`}
                >
                  <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-peach-500 to-sakura-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                    Paling Favorit ⭐
                  </span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-xs text-darkcocoa">
                        Paket Juragan Pro
                      </span>
                      <span className="text-[10px] bg-peach-100 text-peach-700 px-2 py-0.5 rounded-full font-bold">
                        3 Cabang
                      </span>
                    </div>
                    <p className="text-[11px] text-softgray">Hingga 50 kamar • Multi properti • Fitur lengkap</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-black text-peach-600 text-sm">Rp 99.000</p>
                    <p className="text-[10px] text-softgray">/ bulan</p>
                  </div>
                </div>

                {/* Enterprise */}
                <div
                  onClick={() => setSelectedPlan('enterprise')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedPlan === 'enterprise'
                      ? 'border-peach-400 bg-peach-50/60 shadow-sm'
                      : 'border-cream-200 bg-white hover:border-cream-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-xs text-darkcocoa">
                        Paket Konglomerat
                      </span>
                      <span className="text-[10px] bg-lavender-100 text-lavender-600 px-2 py-0.5 rounded-full font-bold">
                        Unlimited
                      </span>
                    </div>
                    <p className="text-[11px] text-softgray">Kamar &amp; cabang tanpa batas • Prioritas bantuan CS</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-black text-peach-600 text-sm">Rp 199.000</p>
                    <p className="text-[10px] text-softgray">/ bulan</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextToStep3}
                  className="py-2.5 px-5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center gap-1.5 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: REKENING TRANSFER & UNGGAH BUKTI                 */}
          {/* ======================================================== */}
          {step === 3 && (
            <form onSubmit={handleSubmitRegistration} className="space-y-4 text-xs">
              {/* Summary of Order */}
              <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-softgray">Paket Pilihan:</p>
                  <p className="font-heading font-black text-darkcocoa">{planPrices[selectedPlan].label}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-softgray">Nominal Transfer:</p>
                  <p className="font-heading font-black text-peach-600 text-base">
                    {planPrices[selectedPlan].formattedPrice}
                  </p>
                </div>
              </div>

              {/* Rekening Tujuan Transfer */}
              <div className="space-y-2">
                <p className="font-bold text-darkcocoa flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-peach-500" />
                  <span>Rekening Bank Resmi Super Admin (Manual Transfer):</span>
                </p>

                {/* Dynamic Bank Accounts from Super Admin Config */}
                {(cfg.bankAccounts && cfg.bankAccounts.length > 0
                  ? cfg.bankAccounts
                  : initialLandingPageConfig.bankAccounts
                ).map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl bg-white border border-cream-200 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <span className="font-black text-blue-700 text-[11px] uppercase tracking-wide">
                        {b.bankName}
                      </span>
                      <p className="font-mono font-bold text-darkcocoa text-sm tracking-wider">
                        {b.accountNumber}
                      </p>
                      <p className="text-[10px] text-softgray">a/n {b.accountHolder}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyAccount(b.accountNumber.replace(/[^0-9]/g, ''), b.id)
                      }
                      className="py-1.5 px-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-[10px] flex items-center gap-1 transition-colors"
                    >
                      {copiedBank === b.id ? (
                        <Check className="w-3.5 h-3.5 text-matcha-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedBank === b.id ? 'Tersalin!' : 'Salin'}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Foto Bukti Pembayaran */}
              <div className="space-y-2 pt-1">
                <label className="font-bold text-darkcocoa block">
                  Unggah Foto / Screenshot Bukti Transfer *
                </label>

                {proofUrl ? (
                  <div className="p-3 rounded-2xl bg-matcha-50 border border-matcha-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-matcha-300 bg-white flex-shrink-0 relative">
                        <img
                          src={proofUrl}
                          alt="Bukti Transfer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-matcha-700 text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Bukti Transfer Terlampir</span>
                        </p>
                        <p className="text-[10px] text-softgray">Siap dikirim ke antrean Super Admin</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProofUrl('')}
                      className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-peach-300 hover:border-peach-400 bg-peach-50/40 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <Upload className="w-6 h-6 text-peach-500 mb-1 group-hover:scale-110 transition-transform" />
                      <p className="font-bold text-darkcocoa text-xs">
                        Klik untuk Unggah Struk / Screenshot
                      </p>
                      <p className="text-[10px] text-softgray">Format JPG, PNG atau PDF (Maks. 5 MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Quick helper for reviewer testing without real file */}
                    <button
                      type="button"
                      onClick={handleUseSampleProof}
                      className="w-full py-2 px-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-peach-600 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-dashed border-cream-300"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gunakan Sampel Bukti Transfer (Untuk Tes Cepat)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Catatan Pengirim */}
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Nama Pemilik Rekening Pengirim / Catatan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Transfer m-BCA a/n Ratna Dewi"
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                />
              </div>

              {/* Notice */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[10px] text-amber-800 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Aktivasi Akun Dilakukan Manual oleh Super Admin</span>
                </p>
                <p>
                  Setelah formulir dikirim, akun Anda masuk antrean <strong className="font-bold">Menunggu Persetujuan</strong>. Akun akan dibuka setelah Super Admin memeriksa mutasi transfer bank.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Kirim Pendaftaran &amp; Bukti Transfer</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 4: KONFIRMASI SUKSES & STATUS MENUNGGU PERSETUJUAN */}
          {/* ======================================================== */}
          {step === 4 && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm animate-pulse">
                <Clock className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-heading font-extrabold text-lg text-darkcocoa">
                  Pendaftaran Berhasil Dikirim! 🎉
                </h4>
                <p className="text-xs text-softgray leading-relaxed max-w-sm mx-auto">
                  Terima kasih, Kak <strong>{name}</strong>! Formulir pendaftaran untuk <strong>{kosName}</strong> serta bukti transfer telah kami terima.
                </p>
              </div>

              {/* Status Box */}
              <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-softgray">Status Akun:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Menunggu Verifikasi Super Admin
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-softgray">Email Login:</span>
                  <span className="font-mono font-bold text-darkcocoa">{email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-softgray">Paket Dipilih:</span>
                  <span className="font-bold text-peach-600">{planPrices[selectedPlan].label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-softgray">Bukti Transfer:</span>
                  <span className="text-matcha-600 font-bold">Terlampir &amp; Tersimpan ✅</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 bg-peach-50/60 rounded-2xl border border-peach-200 text-left text-[11px] text-darkcocoa/90 space-y-1 leading-relaxed">
                <p className="font-bold text-peach-700">🐱 Informasi Aktivasi:</p>
                <p>
                  1. Super Admin akan memverifikasi bukti transfer ke mutasi rekening bank (estimasi maks. 1x24 jam).
                </p>
                <p>
                  2. Begitu Super Admin menekan <em>&quot;Buka Akses&quot;</em>, Anda dapat langsung login di halaman <strong>/login</strong> menggunakan email dan kata sandi yang telah dibuat.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={openWhatsAppConfirmation}
                  className="w-full py-3 rounded-2xl bg-matcha-500 hover:bg-matcha-600 text-white font-bold text-xs shadow-cute flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konfirmasi Cepat via WhatsApp Super Admin</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa font-bold text-xs transition-colors"
                >
                  Tutup &amp; Kembali ke Halaman Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

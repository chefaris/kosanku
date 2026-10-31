'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useKosStore, SaaSUserAccount } from '../lib/store/useKosStore';
import { RegisterModal } from '../components/ui/RegisterModal';
import {
  Gamepad2,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DoorOpen,
  Receipt,
  FileCheck2,
  Clock,
  MessageCircle,
  X,
  AlertCircle,
  KeyRound,
  UserCheck
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsDemo, authenticateUser } = useKosStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pending Approval Modal State
  const [pendingAccount, setPendingAccount] = useState<SaaSUserAccount | null>(null);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const handleDemoLogin = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Harap masukkan alamat email dan kata sandi.');
      return;
    }

    const authResult = authenticateUser(email.trim(), password.trim());

    if (authResult.success) {
      if (authResult.role === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    // Handle authentication failures
    if (authResult.error === 'pending_approval') {
      setPendingAccount(authResult.user || null);
      setShowPendingModal(true);
      setErrorMessage(null);
    } else if (authResult.error === 'wrong_password') {
      setErrorMessage('Kata sandi salah. Harap periksa kembali kata sandi Anda.');
    } else if (authResult.error === 'not_found') {
      setErrorMessage('Email ini belum terdaftar di KosanKu. Silakan klik "Daftar Akun Baru" di bawah.');
    } else if (authResult.error === 'suspended') {
      setErrorMessage('Akun Anda sedang dinonaktifkan oleh administrator. Silakan hubungi CS.');
    } else {
      setErrorMessage(authResult.message || 'Login gagal. Silakan coba kembali.');
    }
  };

  const fillQuickAccount = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setErrorMessage(null);
  };

  const openWhatsAppToAdmin = () => {
    const adminPhone = '6281234567890';
    const msg = encodeURIComponent(
      `Halo Super Admin KosanKu! Saya pemilik akun ${pendingAccount?.name || email} (${pendingAccount?.kosName || 'Kosan'}). Pendaftaran saya sedang menunggu verifikasi bukti transfer. Mohon bantuannya untuk aktivasi ya Kak. Terima kasih!`
    );
    window.open(`https://wa.me/${adminPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100/80 via-peach-50/50 to-sakura-50/60 flex flex-col justify-center items-center p-3.5 sm:p-6 font-body text-darkcocoa selection:bg-peach-100 selection:text-peach-500">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center">
        {/* Left Side: Branding & Feature Highlights (Desktop) */}
        <div className="md:col-span-6 space-y-4 sm:space-y-6 text-center md:text-left">
          {/* Logo & Mimi Mascot */}
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-sm border border-cream-200">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden ring-2 ring-peach-300 shadow-sm flex-shrink-0">
              <Image
                src="/app-logo.jpg"
                alt="Logo KosanKu"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="text-left">
              <h1 className="font-heading font-extrabold text-lg sm:text-xl text-peach-500 tracking-tight leading-none">
                KosanKu
              </h1>
              <p className="text-[10px] sm:text-[11px] text-softgray font-medium flex items-center gap-1">
                <span>🐱</span>
                <span>Kelola Kos Jadi Menyenangkan</span>
              </p>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight leading-tight">
              Aplikasi Manajemen Kos Paling Imut &amp; Praktis ✨
            </h2>
            <p className="text-xs sm:text-sm text-softgray leading-relaxed max-w-md mx-auto md:mx-0">
              Tinggalkan pencatatan buku manual. Pantau okupansi kamar, tagihan sewa bulanan, dan arsip dokumen KTP dalam satu dashboard terpadu.
            </p>
          </div>

          {/* Highlights Grid (Visible on tablet & desktop) */}
          <div className="hidden sm:grid grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-left">
            <div className="p-3 bg-white/90 rounded-2xl border border-cream-200 shadow-sm space-y-1">
              <div className="w-7 h-7 rounded-xl bg-peach-100 text-peach-500 flex items-center justify-center">
                <DoorOpen className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-xs text-darkcocoa">Denah Visual</h4>
              <p className="text-[10px] text-softgray leading-tight">Pantau kamar terisi &amp; kosong per lantai.</p>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-cream-200 shadow-sm space-y-1">
              <div className="w-7 h-7 rounded-xl bg-sakura-100 text-sakura-500 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-xs text-darkcocoa">Tagihan &amp; WA</h4>
              <p className="text-[10px] text-softgray leading-tight">Kirim pengingat sewa instan ke WhatsApp.</p>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-cream-200 shadow-sm space-y-1">
              <div className="w-7 h-7 rounded-xl bg-matcha-100 text-matcha-600 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-xs text-darkcocoa">Arsip Dokumen</h4>
              <p className="text-[10px] text-softgray leading-tight">Unggah pas foto &amp; KTP ber-watermark.</p>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-cream-200 shadow-sm space-y-1">
              <div className="w-7 h-7 rounded-xl bg-lavender-100 text-lavender-500 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-xs text-darkcocoa">Akses Terisolasi</h4>
              <p className="text-[10px] text-softgray leading-tight">Keamanan ketat Super Admin &amp; Tenant.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card (Demo + Login) */}
        <div className="md:col-span-6 w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-cream-200 p-4 sm:p-7 space-y-4 sm:space-y-5 relative overflow-hidden">
            {/* Top Badge: 1-Click Interactive Demo */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-peach-100/90 to-sakura-100/90 border border-peach-200/80 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-peach-500 animate-ping" />
                <span className="font-heading font-extrabold text-xs text-peach-700 uppercase tracking-wider">
                  Coba Dulu Tanpa Daftar
                </span>
              </div>
              <p className="text-xs text-darkcocoa/80 leading-snug">
                Langsung coba seluruh fitur aplikasi dengan data sampel kosan nyata secara instan!
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Masuk Sebagai Akun Demo (1-Klik)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-cream-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-softgray uppercase tracking-wider">
                atau masuk dengan akun terdaftar
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleUserLogin} className="space-y-3.5 text-xs">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-darkcocoa hover:bg-darkcocoa/90 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 mt-1"
              >
                <span>Masuk ke Akun Saya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Test Accounts Accordion Card */}
            <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
              <p className="text-[11px] font-bold text-darkcocoa flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-peach-500" />
                <span>Akun Uji Coba Cepat (Klik untuk Otomatis Mengisi):</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {/* Super Admin */}
                <button
                  type="button"
                  onClick={() => fillQuickAccount('admin@kosanku.id', 'admin123')}
                  className="p-2 rounded-xl bg-white border border-cream-200 hover:border-peach-300 text-left transition-colors group"
                >
                  <p className="font-bold text-[10px] text-peach-600 group-hover:underline">👑 Super Admin</p>
                  <p className="text-[9px] text-softgray font-mono truncate">admin@kosanku.id</p>
                  <p className="text-[9px] text-darkcocoa font-mono">admin123</p>
                </button>

                {/* Tenant Aktif */}
                <button
                  type="button"
                  onClick={() => fillQuickAccount('hendra.jaksel@yahoo.com', 'password123')}
                  className="p-2 rounded-xl bg-white border border-cream-200 hover:border-matcha-300 text-left transition-colors group"
                >
                  <p className="font-bold text-[10px] text-matcha-600 group-hover:underline">✅ Tenant Aktif</p>
                  <p className="text-[9px] text-softgray font-mono truncate">hendra.jaksel...</p>
                  <p className="text-[9px] text-darkcocoa font-mono">password123</p>
                </button>

                {/* Tenant Pending Approval */}
                <button
                  type="button"
                  onClick={() => fillQuickAccount('ratna.dago@gmail.com', 'password123')}
                  className="p-2 rounded-xl bg-white border border-cream-200 hover:border-amber-300 text-left transition-colors group"
                >
                  <p className="font-bold text-[10px] text-amber-600 group-hover:underline">⏳ Menunggu Bukti</p>
                  <p className="text-[9px] text-softgray font-mono truncate">ratna.dago...</p>
                  <p className="text-[9px] text-darkcocoa font-mono">password123</p>
                </button>
              </div>
            </div>

            {/* Footer: Register Trigger */}
            <div className="pt-2 border-t border-cream-100 text-center space-y-2">
              <p className="text-xs text-softgray">
                Belum punya akun KosanKu?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="font-bold text-peach-500 hover:text-peach-600 underline"
                >
                  Daftar Akun Baru (Transfer Manual)
                </button>
              </p>

              <div className="pt-1.5 border-t border-cream-100/70">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[11px] text-softgray hover:text-darkcocoa hover:underline font-semibold transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-peach-500" />
                  <span>Portal Khusus Pemilik SaaS (Super Admin)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Akun Pending Approval (Menunggu Verifikasi Super Admin) */}
      {showPendingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-cream-200 max-w-md w-full overflow-hidden font-body relative animate-in zoom-in-95 duration-150 p-6 space-y-4">
            <button
              onClick={() => setShowPendingModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-softgray hover:text-darkcocoa hover:bg-cream-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                Akun Sedang Dalam Antrean Verifikasi ⏳
              </h3>
              <p className="text-xs text-softgray leading-relaxed">
                Halo Kak <strong>{pendingAccount?.name}</strong> ({pendingAccount?.kosName})! Pendaftaran Anda telah tercatat beserta bukti transfer.
              </p>
            </div>

            {/* Account Details Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2 text-darkcocoa">
              <div className="flex items-center justify-between">
                <span className="text-softgray">Status Lisensi:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px]">
                  Menunggu Persetujuan Super Admin
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-softgray">Paket Pilihan:</span>
                <span className="font-bold text-darkcocoa">{pendingAccount?.planName || 'Paket Juragan Pro'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-softgray">Bukti Transfer:</span>
                <span className="text-matcha-600 font-bold">Terunggah di Sistem ✅</span>
              </div>
              {pendingAccount?.proofNotes && (
                <div className="pt-1 border-t border-amber-200/60 text-[11px] text-amber-800">
                  <span className="font-semibold">Catatan:</span> {pendingAccount.proofNotes}
                </div>
              )}
            </div>

            <p className="text-[11px] text-softgray leading-relaxed text-center">
              Akses dashboard akan otomatis terbuka setelah Super Admin memverifikasi mutasi pembayaran di rekening bank (maksimal 1x24 jam).
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={openWhatsAppToAdmin}
                className="w-full py-2.5 rounded-2xl bg-matcha-500 hover:bg-matcha-600 text-white font-bold text-xs shadow-cute flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi via WhatsApp Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPendingModal(false)}
                className="w-full py-2 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa font-bold text-xs transition-colors"
              >
                Mengerti &amp; Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}

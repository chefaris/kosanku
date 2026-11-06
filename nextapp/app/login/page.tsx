'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useKosStore, SaaSUserAccount } from '../lib/store/useKosStore';
import { supabase } from '../lib/supabase';
import { RegisterModal } from '../components/ui/RegisterModal';
import { PawskostLogo } from '../components/ui/PawskostLogo';
import {
  Gamepad2,
  Star,
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
  UserCheck,
  Building2,
  Compass,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsDemo, authenticateUser, loginAsUser } = useKosStore();

  // Active persona tab: 'owner' | 'demo' | 'superadmin'
  const [activeTab, setActiveTab] = useState<'owner' | 'demo' | 'superadmin'>('owner');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pending Approval Modal State
  const [pendingAccount, setPendingAccount] = useState<SaaSUserAccount | null>(null);
  const [showPendingModal, setShowPendingModal] = useState(false);

  // Auto-switch tab based on URL query parameter ?tab=demo or ?tab=admin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'demo') {
        setActiveTab('demo');
      } else if (tabParam === 'admin' || tabParam === 'superadmin') {
        setActiveTab('superadmin');
      } else if (tabParam === 'owner') {
        setActiveTab('owner');
      }
    }
  }, []);

  const handleDemoLogin = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  const handleSuperAdminInstantLogin = () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const authResult = authenticateUser('admin@pawskost.id', 'admin123');
    if (authResult.success) {
      if (typeof document !== 'undefined') {
        document.cookie = 'pawskost_admin_session=active; path=/; max-age=86400; SameSite=Lax';
      }
      setIsSubmitting(false);
      router.push('/admin');
    } else {
      setIsSubmitting(false);
      setErrorMessage('Gagal masuk ke akun Super Admin.');
    }
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Harap masukkan alamat email dan kata sandi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // 1. Cek autentikasi lokal / Super Admin
    const authResult = authenticateUser(email.trim(), password.trim());

    if (authResult.success) {
      setIsSubmitting(false);
      if (typeof document !== 'undefined') {
        if (authResult.role === 'superadmin') {
          document.cookie = 'pawskost_admin_session=active; path=/; max-age=86400; SameSite=Lax';
        } else {
          document.cookie = 'sb-access-token=active; path=/; max-age=86400; SameSite=Lax';
        }
      }
      if (authResult.role === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    // 2. Cek autentikasi cloud Supabase Auth (Bcrypt terenkripsi)
    try {
      const { data: supaAuth, error: supaErr } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim()
      });

      if (!supaErr && supaAuth?.user) {
        // Ambil profil dari database PostgreSQL
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supaAuth.user.id)
          .single();

        if (profile?.status === 'pending_approval') {
          setIsSubmitting(false);
          setPendingAccount({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone || '-',
            kosName: profile.kos_name || 'Kosan Saya',
            plan: profile.plan || 'pro',
            planName: profile.plan_name || 'Paket Juragan Pro',
            status: profile.status,
            registeredAt: profile.created_at,
            expiresAt: profile.expires_at,
            daysRemaining: profile.days_remaining || 30,
            totalPaid: profile.total_paid || 0
          });
          setShowPendingModal(true);
          return;
        }

        if (profile?.status === 'suspended') {
          setIsSubmitting(false);
          setErrorMessage('Akun Anda sedang dinonaktifkan oleh administrator. Silakan hubungi CS.');
          return;
        }

        // Set session cookie untuk middleware
        if (typeof document !== 'undefined') {
          if (profile?.role === 'superadmin') {
            document.cookie = 'pawskost_admin_session=active; path=/; max-age=86400; SameSite=Lax';
          } else {
            document.cookie = 'sb-access-token=active; path=/; max-age=86400; SameSite=Lax';
          }
        }

        if (profile?.role === 'superadmin') {
          useKosStore.setState({
            currentUser: {
              id: profile.id || 'usr-admin-root',
              name: profile.name || 'Super Admin pawskost',
              email: supaAuth.user.email || 'admin@pawskost.id',
              kosName: profile.kos_name || 'pawskost Platform',
              role: 'superadmin',
              plan: 'enterprise',
              isDemo: false
            },
            authMode: 'user',
            impersonatingFromAdmin: false
          });
          setIsSubmitting(false);
          router.push('/admin');
          return;
        }

        loginAsUser({
          name: profile?.name || supaAuth.user.email?.split('@')[0] || 'Pemilik Kos',
          email: supaAuth.user.email || '',
          kosName: profile?.kos_name || 'Kosan Saya',
          plan: profile?.plan || 'pro'
        });

        setIsSubmitting(false);
        router.push('/dashboard');
        return;
      }
    } catch (err) {
      console.warn('Supabase auth attempt:', err);
    }

    setIsSubmitting(false);

    // Tangani pesan gagal
    if (authResult.error === 'pending_approval') {
      setPendingAccount(authResult.user || null);
      setShowPendingModal(true);
      setErrorMessage(null);
    } else if (authResult.error === 'wrong_password') {
      setErrorMessage('Kata sandi salah. Harap periksa kembali kata sandi Anda.');
    } else if (authResult.error === 'not_found') {
      setErrorMessage('Email ini belum terdaftar di pawskost. Silakan klik "Daftar Akun Baru" di bawah.');
    } else if (authResult.error === 'suspended') {
      setErrorMessage('Akun Anda sedang dinonaktifkan oleh administrator. Silakan hubungi CS.');
    } else {
      setErrorMessage('Email atau kata sandi tidak cocok. Harap periksa kembali.');
    }
  };

  const openWhatsAppToAdmin = () => {
    const adminPhone = '6281234567890';
    const msg = encodeURIComponent(
      `Halo Admin pawskost! Saya pemilik akun ${pendingAccount?.name || email} (${pendingAccount?.kosName || 'Kosan'}). Pendaftaran saya sedang menunggu verifikasi bukti transfer. Mohon bantuannya untuk aktivasi ya Kak. Terima kasih!`
    );
    window.open(`https://wa.me/${adminPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100/90 via-peach-50/40 to-sakura-50/50 flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-body text-darkcocoa selection:bg-peach-100 selection:text-peach-500">
      {/* Top Banner: Persona Clarification for Renters vs Owners */}
      <div className="w-full max-w-5xl lg:max-w-6xl mx-auto mb-4">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-cream-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-darkcocoa/80 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-peach-500 flex-shrink-0" />
            <span>
              Sedang mencari sewa kamar kos? Halaman ini khusus untuk pengelola &amp; pemilik kos.
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-peach-50 hover:bg-peach-100 text-peach-600 font-bold transition-colors border border-peach-200/80 flex-shrink-0"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Buka Katalog Pencari Kos</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="w-full max-w-5xl lg:max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto">
        {/* Left Side: Branding & Feature Highlights */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Logo & Brand */}
          <Link href="/" className="inline-flex items-center gap-3.5 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm border border-cream-200 hover:scale-[1.02] transition-transform">
            <PawskostLogo size="md" />
            <div className="text-left">
              <h1 className="font-heading font-black text-xl text-peach-500 tracking-tight leading-none">
                pawskost
              </h1>
              <p className="text-xs text-softgray font-medium mt-1">
                Sistem Manajemen Kos Modern
              </p>
            </div>
          </Link>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-heading font-extrabold text-darkcocoa tracking-tight leading-[1.2]">
              Portal Masuk Pengelola <span className="text-peach-500">pawskost</span>
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-softgray leading-relaxed max-w-xl mx-auto lg:mx-0">
              Pilih portal akses sesuai peran Anda: login sebagai pemilik kos terdaftar, coba fitur simulasi di mode demo sandbox, atau akses konsol super admin platform.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-left">
            <div className="p-4 bg-white/95 rounded-2xl border border-cream-200/90 shadow-sm hover:shadow-cute transition-all space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-peach-100 text-peach-500 flex items-center justify-center">
                <DoorOpen className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-sm text-darkcocoa">Denah Visual Kamar</h4>
              <p className="text-xs text-softgray leading-relaxed">Pantau kamar terisi &amp; kosong per lantai secara real-time.</p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border border-cream-200/90 shadow-sm hover:shadow-cute transition-all space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-sakura-100 text-sakura-500 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-sm text-darkcocoa">Tagihan &amp; WhatsApp</h4>
              <p className="text-xs text-softgray leading-relaxed">Kirim pengingat jatuh tempo sewa instan langsung ke WhatsApp.</p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border border-cream-200/90 shadow-sm hover:shadow-cute transition-all space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-matcha-100 text-matcha-600 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-sm text-darkcocoa">Arsip Dokumen KTP</h4>
              <p className="text-xs text-softgray leading-relaxed">Unggah pas foto &amp; dokumen identitas ber-watermark otomatis.</p>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border border-cream-200/90 shadow-sm hover:shadow-cute transition-all space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-lavender-100 text-lavender-500 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-heading font-bold text-sm text-darkcocoa">Multi-Device Cloud Sync</h4>
              <p className="text-xs text-softgray leading-relaxed">Akses tersinkronisasi mulus di HP, laptop, dan tablet juragan.</p>
            </div>
          </div>

          {/* Social Proof & Trust */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-softgray">
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <strong className="text-darkcocoa">4.9/5</strong> Rating Pemilik Kos
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-peach-500" />
              <strong className="text-darkcocoa">Terverifikasi</strong> Resmi
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-matcha-500" />
              <strong className="text-darkcocoa">100%</strong> Data Terproteksi
            </span>
          </div>
        </div>

        {/* Right Side: Tabbed Auth Card */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-cream-200 p-6 sm:p-7 space-y-5 relative overflow-hidden">
            {/* Persona Switcher Tabs */}
            <div className="p-1 bg-cream-100 rounded-2xl grid grid-cols-3 gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('owner');
                  setErrorMessage(null);
                }}
                className={`py-2 px-1.5 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'owner'
                    ? 'bg-white text-darkcocoa shadow-xs font-extrabold'
                    : 'text-softgray hover:text-darkcocoa'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${activeTab === 'owner' ? 'text-peach-500' : ''}`} />
                <span className="truncate">Pemilik Kos</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('demo');
                  setErrorMessage(null);
                }}
                className={`py-2 px-1.5 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'demo'
                    ? 'bg-white text-darkcocoa shadow-xs font-extrabold'
                    : 'text-softgray hover:text-darkcocoa'
                }`}
              >
                <Gamepad2 className={`w-3.5 h-3.5 ${activeTab === 'demo' ? 'text-peach-500' : ''}`} />
                <span className="truncate">Coba Demo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('superadmin');
                  setErrorMessage(null);
                }}
                className={`py-2 px-1.5 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'superadmin'
                    ? 'bg-white text-darkcocoa shadow-xs font-extrabold'
                    : 'text-softgray hover:text-darkcocoa'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'superadmin' ? 'text-peach-500' : ''}`} />
                <span className="truncate">Super Admin</span>
              </button>
            </div>

            {/* TAB 1: PEMILIK KOS & TIM */}
            {activeTab === 'owner' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa">
                    Masuk Akun Juragan / Staf
                  </h3>
                  <p className="text-xs text-softgray">
                    Untuk pemilik kos, manajer, kasir, dan pengelola kos terdaftar.
                  </p>
                </div>

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
                      <Mail className="w-4 h-4 text-softgray absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="juragan@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrorMessage(null);
                        }}
                        className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-darkcocoa focus:outline-none focus:border-peach-400 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-softgray absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrorMessage(null);
                        }}
                        className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-darkcocoa focus:outline-none focus:border-peach-400 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-darkcocoa hover:bg-darkcocoa/90 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 mt-1"
                  >
                    <span>{isSubmitting ? 'Memeriksa Kredensial...' : 'Masuk ke Dashboard Kos'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-3 border-t border-cream-100 text-center">
                  <p className="text-xs text-softgray">
                    Belum punya akun pawskost?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="font-bold text-peach-500 hover:text-peach-600 underline"
                    >
                      Daftar Uji Coba 14 Hari
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: COBA DEMO SANDBOX */}
            {activeTab === 'demo' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-700 text-[10px] font-extrabold uppercase tracking-wide">
                    <Sparkles className="w-3 h-3 text-peach-500" />
                    <span>Mode Sandbox Instan</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa">
                    Coba Bebas Tanpa Perlu Daftar
                  </h3>
                  <p className="text-xs text-softgray leading-relaxed">
                    Rasakan langsung kemudahan kelola kos dengan data simulasi yang telah disiapkan secara lengkap.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-cream-50/90 border border-cream-200 text-xs space-y-2 text-darkcocoa/90">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>2 Properti Kos Sampel Siap Pakai (Dago &amp; Sukajadi)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>20 Kamar dengan visual denah interaktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Kirim pengingat tagihan sewa ke WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Tombol reset data demo kapan saja</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-extrabold text-xs sm:text-sm shadow-cute flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Mulai Demo Sandbox Sekarang (1-Klik)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-softgray text-center leading-relaxed">
                  Data simulasi demo disimpan di browser lokal Anda. Tidak ada biaya atau kewajiban apapun.
                </p>
              </div>
            )}

            {/* TAB 3: SUPER ADMIN SAAS */}
            {activeTab === 'superadmin' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-darkcocoa text-peach-300 text-[10px] font-extrabold uppercase tracking-wide">
                    <ShieldCheck className="w-3 h-3 text-peach-400" />
                    <span>Portal Pemilik Platform</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa">
                    Konsol Super Admin SaaS
                  </h3>
                  <p className="text-xs text-softgray leading-relaxed">
                    Khusus manajemen platform: verifikasi pendaftaran akun, approval bukti transfer, dan pengaturan CMS.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-softgray font-medium">Email Root:</span>
                    <span className="font-mono font-bold text-darkcocoa bg-white px-2 py-0.5 rounded-lg border border-cream-200">
                      admin@pawskost.id
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-softgray font-medium">Kata Sandi:</span>
                    <span className="font-mono font-bold text-darkcocoa bg-white px-2 py-0.5 rounded-lg border border-cream-200">
                      admin123
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSuperAdminInstantLogin}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-peach-500 to-sakura-500 hover:from-peach-600 hover:to-sakura-600 text-white font-extrabold text-xs sm:text-sm shadow-cute flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masuk Sebagai Super Admin (1-Klik)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-softgray text-center leading-relaxed">
                  Akan langsung membuka dashboard kendali Super Admin di tautan <code className="bg-cream-100 px-1 py-0.5 rounded text-darkcocoa font-mono">/admin</code>.
                </p>
              </div>
            )}
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

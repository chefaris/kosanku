'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DoorOpen, LogOut, ShieldCheck, ArrowRight, Lock, KeyRound, Sparkles } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { DemoBanner } from '../ui/DemoBanner';
import { RegisterModal } from '../ui/RegisterModal';
import { useKosStore } from '../../lib/store/useKosStore';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { currentUser, authenticateUser, logout } = useKosStore();

  const isPublicPage = pathname === '/login' || pathname === '/';
  const isAdminPage = pathname.startsWith('/admin');

  // 1. Halaman Publik (Landing Page & Login)
  if (isPublicPage) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  // 2. Halaman Super Admin (Console Terpisah Khusus Pemilik Platform SaaS)
  if (isAdminPage) {
    // Access Gate: Jika pengguna belum login sebagai superadmin
    const isSuperAdmin = currentUser?.role === 'superadmin';

    if (!isSuperAdmin) {
      return (
        <div className="min-h-screen bg-cream-50 font-body text-darkcocoa flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-cream-200 p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-peach-100 text-peach-500 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-heading font-black text-darkcocoa">
                Akses Terbatas: Super Admin 👑
              </h2>
              <p className="text-xs text-softgray leading-relaxed">
                Halaman ini khusus untuk pemilik software SaaS KosanKu untuk memverifikasi bukti transfer dan mengelola langganan pelanggan.
              </p>
            </div>

            <div className="p-3 bg-peach-50 rounded-2xl border border-peach-200 text-left text-xs text-darkcocoa space-y-1">
              <p className="font-bold text-peach-700">Kredensial Super Admin Bawaan:</p>
              <p className="font-mono text-[11px] text-softgray">Email: admin@kosanku.id</p>
              <p className="font-mono text-[11px] text-softgray">Password: admin123</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  authenticateUser('admin@kosanku.id', 'admin123');
                }}
                className="w-full py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
              >
                <KeyRound className="w-4 h-4" />
                <span>Masuk Otomatis Sebagai Super Admin</span>
              </button>

              <Link
                href="/login"
                className="block w-full py-2 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa font-bold text-xs transition-colors"
              >
                Kembali ke Halaman Login
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-cream-50 font-body text-darkcocoa flex flex-col">
        {/* Dedicated Super Admin Topbar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Left: Brand Super Admin */}
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2.5 group">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-2 ring-peach-400 shadow-sm bg-peach-50 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Image
                    src="/app-logo.jpg"
                    alt="Logo KosanKu"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-black text-lg text-peach-500 tracking-tight">
                      KosanKu
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-peach-500 text-white text-[10px] font-black uppercase tracking-wider">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-[10px] text-softgray font-medium">
                    SaaS Management Console • Khusus Pemilik Software
                  </p>
                </div>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="hidden md:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-darkcocoa text-xs font-bold transition-colors"
                title="Lihat Landing Page Publik"
              >
                <span>🌐 Landing Page</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-peach-50 hover:bg-peach-100 text-peach-600 text-xs font-bold transition-colors border border-peach-200"
                title="Buka Aplikasi Sisi Tenant Kos"
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>Buka App Tenant</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-white border border-cream-200 hover:border-red-300 text-softgray hover:text-red-500 text-xs font-bold transition-colors"
                title="Keluar dari Super Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content Area (Full Width, No Tenant Sidebar or Property Selector) */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    );
  }

  // 3. Halaman Aplikasi Tenant / Pemilik Kos
  const isSuperAdminViewingTenant = currentUser?.role === 'superadmin';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for Desktop & Mobile Header Drawer */}
      <Sidebar onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top Banner when Super Admin is viewing tenant app */}
        {isSuperAdminViewingTenant && (
          <div className="bg-peach-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Anda sedang login sebagai Super Admin di dalam dashboard tenant.</span>
            </div>
            <Link
              href="/admin"
              className="py-1 px-3 bg-white text-peach-600 hover:bg-cream-100 rounded-xl text-[11px] font-black transition-colors"
            >
              Kembali ke Panel Super Admin ➔
            </Link>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {/* Interactive Demo Banner (active in demo mode) */}
          <DemoBanner onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />

          {children}
        </main>
      </div>

      {/* Fixed Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Register Modal for converting demo users to real owners */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

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
import { VideoBumperOverlay } from '../ui/VideoBumperOverlay';
import { useKosStore } from '../../lib/store/useKosStore';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { currentUser, logout, appTheme } = useKosStore();

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', appTheme || 'paw-peach');
      document.body.setAttribute('data-theme', appTheme || 'paw-peach');
    }
  }, [appTheme]);

  const isPublicPage = pathname === '/login' || pathname === '/';
  const isAdminPage = pathname.startsWith('/admin');

  // 1. Halaman Publik (Landing Page & Login)
  if (isPublicPage) {
    return (
      <main className="min-h-screen w-full">
        {children}
        <VideoBumperOverlay />
      </main>
    );
  }

  // 2. Halaman Super Admin (Console Terpisah Khusus Pemilik Platform)
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

            <div className="space-y-1.5">
              <h2 className="text-xl font-heading font-black text-darkcocoa">
                Akses Terbatas: Super Admin
              </h2>
              <p className="text-xs text-softgray leading-relaxed">
                Halaman ini dilindungi dan khusus untuk administrator sistem pawskost. Silakan masuk melalui portal login dengan akun terotorisasi.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-darkcocoa hover:bg-darkcocoa/90 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <span>Menuju Halaman Login</span>
                <ArrowRight className="w-4 h-4" />
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
                    alt="Logo pawskost"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-black text-lg text-peach-500 tracking-tight">
                      pawskost
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-peach-500 text-white text-[10px] font-black uppercase tracking-wider">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-[10px] text-softgray font-medium hidden sm:block">
                    Management Console • Khusus Pemilik Software
                  </p>
                </div>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Link
                href="/"
                className="hidden md:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-darkcocoa text-xs font-bold transition-colors"
                title="Lihat Landing Page Publik"
              >
                <span>Landing Page</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl bg-peach-50 hover:bg-peach-100 text-peach-600 text-xs font-bold transition-colors border border-peach-200"
                title="Buka Aplikasi Sisi Tenant Kos"
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Buka App</span>
                <span className="xs:hidden">App</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="inline-flex items-center gap-1 py-1.5 px-2 sm:px-3 rounded-xl bg-white border border-cream-200 hover:border-red-300 text-softgray hover:text-red-500 text-xs font-bold transition-colors"
                title="Keluar dari Super Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content Area (Full Width, No Tenant Sidebar or Property Selector) */}
        <main className="flex-1 p-3 sm:p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    );
  }

  // 3. Halaman Aplikasi Tenant / Pemilik Kos
  const isSuperAdminViewingTenant = currentUser?.role === 'superadmin';

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden print:min-h-0 print:block">
      {/* Sidebar for Desktop & Mobile Header Drawer */}
      <div className="print:hidden">
        <Sidebar onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 w-full print:pl-0 print:block">
        {/* Top Banner when Super Admin is viewing tenant app */}
        {isSuperAdminViewingTenant && (
          <div className="print:hidden bg-peach-500 text-white px-3 sm:px-4 py-2 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span className="text-[11px] sm:text-xs">Login sebagai Super Admin di dalam dashboard tenant.</span>
            </div>
            <Link
              href="/admin"
              className="py-1 px-2.5 bg-white text-peach-600 hover:bg-cream-100 rounded-xl text-[10px] sm:text-[11px] font-black transition-colors self-end sm:self-auto"
            >
              Kembali ke Panel Super Admin
            </Link>
          </div>
        )}

        <main className="flex-1 w-full min-w-0 pb-20 md:pb-8 print:p-0 print:m-0 print:block">
          {/* Interactive Demo Banner (active in demo mode) */}
          <div className="print:hidden px-3 sm:px-4 md:px-8 pt-3 sm:pt-4 md:pt-6 max-w-7xl mx-auto">
            <DemoBanner onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />
          </div>

          {children}
        </main>
      </div>

      {/* Fixed Mobile Bottom Navigation */}
      <div className="print:hidden">
        <MobileNav />
      </div>

      {/* Global Register Modal for converting demo users to real owners */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Cinematic Opening Video Bumper Overlay */}
      <VideoBumperOverlay />
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  DoorOpen,
  Receipt,
  Users,
  Wrench,
  BarChart3,
  Settings,
  Menu,
  X,
  Sparkles,
  LucideIcon,
  LogIn,
  LogOut,
  UserPlus,
  Gamepad2,
  Crown,
  ShieldCheck,
} from 'lucide-react';
import { PropertySelector } from '../ui/PropertySelector';
import { useKosStore } from '../../lib/store/useKosStore';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Kamar', href: '/rooms', icon: DoorOpen },
  { label: 'Tagihan', href: '/billing', icon: Receipt },
  { label: 'Penghuni', href: '/tenants', icon: Users },
  { label: 'Perawatan', href: '/maintenance', icon: Wrench },
  { label: 'Keuangan', href: '/finance', icon: BarChart3 },
  { label: 'Langganan', href: '/subscription', icon: Crown },
  { label: 'Pengaturan', href: '/settings', icon: Settings },
];

export interface SidebarProps {
  className?: string;
  onOpenRegisterModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onOpenRegisterModal }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, subscription, logout, impersonatingFromAdmin, stopImpersonating } = useKosStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  const isLinkActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/') return true;
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Header / Brand */}
      <div>
        <div className="px-5 py-4 border-b border-cream-100">
          <Link
            href="/dashboard"
            onClick={closeMobile}
            className="group flex items-center gap-3 focus:outline-none"
          >
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-peach-300 shadow-cute bg-peach-50 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/app-logo.jpg"
                alt="Logo pawskost"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-peach-500">
                  pawskost
                </span>
                <span className="text-xs">🐾</span>
              </div>
              <p className="font-body text-[11px] text-softgray font-medium truncate">
                Mimi si Kucing Kos
              </p>
            </div>
          </Link>

          {/* Logo Status Tenant (Jenis Paket yang Dibeli & Tulisan Jenis Langganan) */}
          <div className="mt-3.5 p-2.5 rounded-2xl bg-gradient-to-r from-peach-50/90 to-sakura-50/80 border border-peach-200/70 shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-peach-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Crown className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-softgray block leading-none">
                  Jenis Langganan
                </span>
                <span className="font-heading font-extrabold text-xs text-darkcocoa truncate block mt-0.5">
                  {subscription?.planName || 'Paket Juragan Pro'}
                </span>
              </div>
            </div>
            <Link
              href="/subscription"
              onClick={closeMobile}
              className="px-2 py-1 rounded-lg bg-white/90 hover:bg-white text-[10px] font-bold text-peach-600 border border-peach-200 shadow-2xs flex-shrink-0 transition-colors"
              title="Kelola Paket Langganan"
            >
              <span>{subscription?.status === 'trial' ? 'Trial' : 'Aktif'}</span>
            </Link>
          </div>
        </div>

        {/* Multi-Property Switcher */}
        <PropertySelector />

        {/* Navigation Items */}
        <nav className="px-3 space-y-1.5 mt-2" aria-label="Menu Utama">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`
                  relative flex items-center gap-3.5 px-4 py-3
                  rounded-2xl text-sm font-semibold transition-all duration-200
                  ${
                    active
                      ? 'bg-peach-50 text-peach-500 font-bold shadow-sm'
                      : 'text-softgray hover:text-darkcocoa hover:bg-cream-100'
                  }
                `}
              >
                {active && (
                  <motion.span
                    layoutId="activePill"
                    className="absolute left-0 top-2 bottom-2 w-1.5 bg-peach-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    active ? 'text-peach-500' : 'text-softgray group-hover:text-darkcocoa'
                  }`}
                  strokeWidth={1.75}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile / Role Footer */}
      <div className="p-3.5 border-t border-cream-200 bg-cream-50/70 rounded-2xl m-3 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-peach-300 to-sakura-300 text-white flex items-center justify-center font-heading font-bold shadow-sm text-xs flex-shrink-0">
            {currentUser?.isDemo ? '🎮' : (currentUser?.name?.slice(0, 2).toUpperCase() || 'PK')}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-matcha-400 border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading font-bold text-xs text-darkcocoa truncate">
              {currentUser?.name || 'Tamu Demo'}
            </p>
            <p className="font-body text-[10px] text-softgray flex items-center gap-1 truncate">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-peach-400" />
              <span>{currentUser?.isDemo ? 'Mode Sandbox' : (currentUser?.kosName || 'Pemilik Kos')}</span>
            </p>
          </div>
        </div>

        {/* Actions in footer */}
        <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-cream-200/80 text-[10px]">
          {currentUser?.isDemo ? (
            <>
              <Link
                href="/login"
                onClick={closeMobile}
                className="text-peach-600 hover:text-peach-700 font-bold flex items-center gap-1 hover:underline"
              >
                <LogIn className="w-3 h-3" />
                <span>Ganti Akun</span>
              </Link>
              {onOpenRegisterModal && (
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    onOpenRegisterModal();
                  }}
                  className="text-softgray hover:text-darkcocoa font-semibold flex items-center gap-1 hover:underline"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Daftar Baru</span>
                </button>
              )}
            </>
          ) : (
            <>
              <Link
                href="/subscription"
                onClick={closeMobile}
                className="px-2 py-0.5 rounded-full bg-peach-100 hover:bg-peach-200 text-peach-600 font-bold text-[9px] flex items-center gap-1 transition-colors"
                title="Kelola Paket Langganan"
              >
                <Crown className="w-2.5 h-2.5" />
                <span>
                  {currentUser?.plan === 'trial_14_days'
                    ? 'Trial 14 Hari'
                    : currentUser?.plan === 'starter'
                    ? 'Paket Mungil'
                    : currentUser?.plan === 'enterprise'
                    ? 'Konglomerat'
                    : 'Juragan Pro'}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  logout();
                  router.push('/login');
                }}
                className="text-softgray hover:text-red-500 font-bold flex items-center gap-1 hover:underline"
                title="Keluar dari akun pemilik kos"
              >
                <LogOut className="w-3 h-3" />
                <span>Keluar</span>
              </button>
            </>
          )}
        </div>

        {/* Impersonation Indicator if active */}
        {impersonatingFromAdmin && (
          <div className="pt-2 border-t border-amber-200">
            <button
              onClick={() => {
                closeMobile();
                stopImpersonating();
                router.push('/admin');
              }}
              className="w-full py-1.5 px-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-between transition-colors"
            >
              <span>Mode Pantau</span>
              <span className="underline">Kembali ke Admin</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header with Hamburger Toggle */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-cream-200 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-sm w-full">
        <Link href="/dashboard" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-2 ring-peach-300 shadow-sm flex-shrink-0">
            <Image
              src="/app-logo.jpg"
              alt="Logo KosanKu"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-heading font-extrabold text-base sm:text-lg leading-tight text-peach-500">
              KosanKu
            </span>
            <span className="text-[9px] sm:text-[10px] text-softgray font-medium hidden xs:inline truncate">Mimi si Kucing Kos</span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <PropertySelector compact />
          <button
            type="button"
            onClick={toggleMobile}
            aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
            className="
              inline-flex items-center justify-center
              w-9 h-9 sm:w-10 sm:h-10 rounded-2xl
              bg-cream-100 hover:bg-cream-200
              text-darkcocoa transition-colors
            "
          >
            {isMobileOpen ? (
              <X className="w-5 h-5 text-darkcocoa" strokeWidth={1.75} />
            ) : (
              <Menu className="w-5 h-5 text-darkcocoa" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/50"
              aria-hidden="true"
            />

            {/* Slide-in sidebar drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col z-10 border-r border-cream-200"
            >
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  onClick={closeMobile}
                  className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
              <div className="h-full overflow-y-auto">
                {navContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Fixed Left Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col fixed top-0 left-0 bottom-0
          w-64 bg-white border-r border-cream-200 z-30
          shadow-cute/50
          ${className}
        `}
      >
        {navContent}
      </aside>
    </>
  );
};

export default Sidebar;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  DoorOpen,
  Receipt,
  Users,
  MoreHorizontal,
  Wrench,
  BarChart3,
  Settings,
  X,
  LucideIcon,
  Crown,
} from 'lucide-react';

interface MobileNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  matchPrefix?: string;
}

const mainNavItems: MobileNavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, matchPrefix: '/dashboard' },
  { label: 'Kamar', href: '/rooms', icon: DoorOpen, matchPrefix: '/rooms' },
  { label: 'Tagihan', href: '/billing', icon: Receipt, matchPrefix: '/billing' },
  { label: 'Penghuni', href: '/tenants', icon: Users, matchPrefix: '/tenants' },
];

const moreNavItems: MobileNavItem[] = [
  { label: 'Perawatan', href: '/maintenance', icon: Wrench, matchPrefix: '/maintenance' },
  { label: 'Keuangan', href: '/finance', icon: BarChart3, matchPrefix: '/finance' },
  { label: 'Langganan', href: '/subscription', icon: Crown, matchPrefix: '/subscription' },
  { label: 'Pengaturan', href: '/settings', icon: Settings, matchPrefix: '/settings' },
];

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isMoreActive = moreNavItems.some(
    (item) => item.matchPrefix && pathname.startsWith(item.matchPrefix)
  );

  const isItemActive = (item: MobileNavItem) => {
    if (item.href === '/dashboard' && pathname === '/') return true;
    return Boolean(item.matchPrefix && pathname.startsWith(item.matchPrefix));
  };

  return (
    <>
      {/* More Options Bottom Sheet */}
      <AnimatePresence>
        {showMoreMenu && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoreMenu(false)}
              className="fixed inset-0 bg-black/50"
              aria-hidden="true"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative bg-white rounded-t-3xl p-5 shadow-2xl z-10 border-t border-cream-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-cream-100 mb-3">
                <span className="font-heading font-bold text-base text-darkcocoa">
                  Menu Lainnya
                </span>
                <button
                  type="button"
                  onClick={() => setShowMoreMenu(false)}
                  className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 py-2">
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMoreMenu(false)}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-2xl transition-colors
                        ${
                          active
                            ? 'bg-peach-50 text-peach-500 font-bold'
                            : 'bg-cream-50 text-softgray hover:text-darkcocoa hover:bg-cream-100'
                        }
                      `}
                    >
                      <Icon
                        className={`w-6 h-6 mb-1.5 ${
                          active ? 'text-peach-500' : 'text-softgray'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span className="text-xs">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Bar on Mobile */}
      <nav
        aria-label="Navigasi Bawah"
        className="
          fixed bottom-0 left-0 right-0 z-40
          bg-white border-t border-cream-200 shadow-lg
          rounded-t-2xl md:hidden
          px-3 py-2
        "
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center
                  min-w-[56px] py-1 px-2 rounded-xl transition-all
                  ${
                    active
                      ? 'text-peach-500 font-bold'
                      : 'text-softgray hover:text-darkcocoa'
                  }
                `}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      active ? 'scale-110 text-peach-500' : 'text-softgray'
                    }`}
                    strokeWidth={1.75}
                  />
                  {active && (
                    <motion.div
                      layoutId="mobileNavDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-peach-500 rounded-full"
                    />
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[60px]">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More (...) Button */}
          <button
            type="button"
            onClick={() => setShowMoreMenu((prev) => !prev)}
            className={`
              flex flex-col items-center justify-center
              min-w-[56px] py-1 px-2 rounded-xl transition-all
              ${
                isMoreActive || showMoreMenu
                  ? 'text-peach-500 font-bold'
                  : 'text-softgray hover:text-darkcocoa'
              }
            `}
            aria-label="Menu lainnya"
          >
            <div className="relative">
              <MoreHorizontal
                className={`w-5 h-5 transition-transform ${
                  isMoreActive || showMoreMenu ? 'scale-110 text-peach-500' : 'text-softgray'
                }`}
                strokeWidth={1.75}
              />
              {isMoreActive && (
                <motion.div
                  layoutId="mobileNavDot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-peach-500 rounded-full"
                />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Lainnya</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;

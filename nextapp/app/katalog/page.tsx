'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Home, Sparkles, Gamepad2, ShieldCheck } from 'lucide-react';
import { KosCatalogSection } from '../components/catalog/KosCatalogSection';
import { RegisterModal } from '../components/ui/RegisterModal';
import { useKosStore } from '../lib/store/useKosStore';
import { useRouter } from 'next/navigation';

export default function KatalogPage() {
  const router = useRouter();
  const { currentUser, loginAsDemo } = useKosStore();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleStartDemo = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream-50 font-body text-darkcocoa selection:bg-peach-100 selection:text-peach-500 flex flex-col justify-between">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200/90 shadow-xs py-3.5 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-peach-300 shadow-sm bg-peach-50 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/app-logo.jpg"
                alt="Logo pawskost"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-peach-600">
                  pawskost
                </span>
              </div>
              <p className="text-[10px] text-darkcocoa/70 font-semibold -mt-0.5">
                Katalog Kosan Indonesia
              </p>
            </div>
          </Link>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-2xl text-xs font-bold text-softgray hover:text-darkcocoa hover:bg-cream-100 border border-cream-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Halaman Depan</span>
            </Link>

            {!currentUser && (
              <button
                type="button"
                onClick={handleStartDemo}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa text-xs font-bold border border-cream-200 transition-all hover:scale-105"
              >
                <Gamepad2 className="w-4 h-4 text-peach-600" />
                <span>Coba Demo Aplikasi</span>
              </button>
            )}

            {currentUser ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-2xl bg-peach-600 hover:bg-peach-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-2xl bg-darkcocoa hover:bg-darkcocoa/90 text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
              >
                Masuk Pemilik
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Catalog */}
      <main className="flex-1">
        <KosCatalogSection
          onOpenRegister={() => setIsRegisterModalOpen(true)}
          showOwnerCta={true}
        />
      </main>

      {/* Footer */}
      <footer className="bg-darkcocoa text-cream-100 py-8 border-t border-darkcocoa/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-base text-peach-400">pawskost</span>
            <span>• Platform Manajemen &amp; Katalog Kos Indonesia</span>
          </div>
          <p className="text-softgray text-center sm:text-right">
            &copy; {new Date().getFullYear()} pawskost. Seluruh hak cipta dilindungi undang-undang.
          </p>
        </div>
      </footer>

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}

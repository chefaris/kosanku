'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  Crown,
  Search,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Star,
  CheckCircle2,
  Building2,
  PhoneCall,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  ClipboardCheck,
  Receipt,
  HeartHandshake,
  CalendarCheck,
  Gamepad2
} from 'lucide-react';
import { KosCatalogSection } from './components/catalog/KosCatalogSection';
import { RegisterModal } from './components/ui/RegisterModal';
import { PawskostLogo } from './components/ui/PawskostLogo';

export default function PublicMarketplacePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50 font-body text-darkcocoa selection:bg-peach-100 selection:text-peach-500 overflow-x-hidden flex flex-col justify-between">
      {/* ======================================================== */}
      {/* 1. TOP ANNOUNCEMENT BANNER FOR KOS OWNERS                 */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-darkcocoa via-[#3d271d] to-darkcocoa text-white text-[11px] sm:text-xs py-2 px-4 border-b border-darkcocoa/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded-full bg-peach-500/20 text-peach-300 font-bold text-[10px] uppercase tracking-wider flex-shrink-0">
              Mitra Juragan
            </span>
            <span className="truncate opacity-90">
              Punya bisnis kost? Kelola kamar &amp; tagihan sewa otomatis di pawskost.
            </span>
          </div>

          <Link
            href="/mitra"
            className="flex-shrink-0 font-bold text-peach-300 hover:text-white flex items-center gap-1 transition-colors hover:underline"
          >
            <span>Pelajari Selengkapnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PUBLIC MARKETPLACE NAVBAR                             */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200/90 shadow-xs py-3 sm:py-3.5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <PawskostLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-peach-600">
                  pawskost
                </span>
              </div>
              <p className="text-[11px] text-darkcocoa/70 font-semibold -mt-0.5">
                Cari Kos Mudah &amp; Cepat
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold text-darkcocoa/75">
            <a href="#hasil-katalog" className="text-peach-600 hover:text-peach-700 font-extrabold flex items-center gap-1">
              <Compass className="w-4 h-4" />
              <span>Cari Kosan</span>
            </a>
            <a href="#cara-sewa" className="hover:text-peach-600 transition-colors">
              Cara Sewa
            </a>
            <a href="#keunggulan" className="hover:text-peach-600 transition-colors">
              Keunggulan
            </a>
          </nav>

          {/* Action Buttons: 2 Tombol Menonjol untuk Mitra */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Tombol Menonjol 1: Mitra Juragan (Peach Solid) */}
            <Link
              href="/mitra"
              className="px-4 py-2 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white text-xs sm:text-sm font-heading font-extrabold shadow-cute flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              <Building2 className="w-4 h-4" />
              <span>Mitra Juragan</span>
            </Link>

            {/* Tombol Menonjol 2: Login Mitra (Dark Cocoa Solid) */}
            <Link
              href="/login"
              className="px-4 py-2 rounded-2xl bg-darkcocoa hover:bg-darkcocoa/90 text-white text-xs sm:text-sm font-bold shadow-2xs transition-all hover:scale-105 active:scale-95"
            >
              Login Mitra
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-cream-100 text-darkcocoa hover:bg-cream-200 transition-colors"
            aria-label="Buka navigasi"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-cream-200 px-4 py-4 space-y-3 text-xs font-bold text-softgray animate-in slide-in-from-top-2 duration-150">
            <a
              href="#hasil-katalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 text-peach-600 font-extrabold flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Cari Kosan</span>
            </a>
            <a
              href="#cara-sewa"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-600"
            >
              Cara Sewa Mudah
            </a>
            <a
              href="#keunggulan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-600"
            >
              Keunggulan pawskost
            </a>

            <div className="pt-3 border-t border-cream-100 flex flex-col gap-2">
              <Link
                href="/mitra"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-peach-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-cute text-center"
              >
                <Building2 className="w-4 h-4" />
                <span>Mitra Juragan</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-darkcocoa text-white font-bold text-xs text-center"
              >
                Login Mitra
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* 3. MAIN KOS CATALOG & MASTER SEARCH SECTION               */}
      {/* ======================================================== */}
      <main className="flex-1">
        <KosCatalogSection
          onOpenRegister={() => setIsRegisterModalOpen(true)}
          showOwnerCta={false}
        />

        {/* ======================================================== */}
        {/* 4. CARA MUDAH SEWA KOS DI PAWSKOST (3 LANGKAH CEPAT)    */}
        {/* ======================================================== */}
        <section id="cara-sewa" className="py-6 sm:py-8 bg-white border-t border-cream-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="text-center space-y-0.5">
              <h2 className="text-base sm:text-xl font-heading font-extrabold text-darkcocoa">
                3 Langkah Mudah Sewa Kos
              </h2>
              <p className="text-xs text-softgray">
                Cepat, aman, dan langsung terhubung dengan pemilik kos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 sm:p-3.5 bg-cream-50/70 rounded-2xl border border-cream-200 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-peach-100 text-peach-600 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  01
                </span>
                <div className="text-left min-w-0">
                  <h3 className="font-heading font-bold text-xs text-darkcocoa">Cari &amp; Pilih Kos</h3>
                  <p className="text-[11px] text-softgray truncate">Filter kota, fasilitas &amp; budget</p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 bg-cream-50/70 rounded-2xl border border-cream-200 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-matcha-100 text-matcha-600 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  02
                </span>
                <div className="text-left min-w-0">
                  <h3 className="font-heading font-bold text-xs text-darkcocoa">Chat WhatsApp</h3>
                  <p className="text-[11px] text-softgray truncate">Langsung tanya kamar ke pemilik</p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 bg-cream-50/70 rounded-2xl border border-cream-200 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-sakura-100 text-sakura-600 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  03
                </span>
                <div className="text-left min-w-0">
                  <h3 className="font-heading font-bold text-xs text-darkcocoa">Siap Huni Resmi</h3>
                  <p className="text-[11px] text-softgray truncate">Bayar sewa &amp; kuitansi otomatis</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. KEUNGGULAN CARI KOS DI PAWSKOST                       */}
        {/* ======================================================== */}
        <section id="keunggulan" className="py-6 sm:py-8 bg-cream-50/50 border-t border-cream-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="text-center">
              <h2 className="text-base sm:text-xl font-heading font-extrabold text-darkcocoa">
                Keunggulan pawskost
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 sm:p-3.5 bg-white rounded-2xl border border-cream-200 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-matcha-100 text-matcha-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <h3 className="font-heading font-bold text-xs text-darkcocoa">Kontak Pemilik Langsung</h3>
                  <p className="text-[11px] text-softgray truncate">Tanpa calo &amp; bebas perantara</p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 bg-white rounded-2xl border border-cream-200 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-peach-100 text-peach-500 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <h3 className="font-heading font-bold text-xs text-darkcocoa">WhatsApp 1-Klik</h3>
                  <p className="text-[11px] text-softgray truncate">Tanya &amp; survei lokasi cepat</p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 bg-white rounded-2xl border border-cream-200 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sakura-100 text-sakura-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <h3 className="font-heading font-bold text-xs text-darkcocoa">Kamar Kosong Akurat</h3>
                  <p className="text-[11px] text-softgray truncate">Sinkron sistem software juragan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. CALLOUT UNTUK PEMILIK KOS (MERCHANT PROMOTION)        */}
        {/* ======================================================== */}
        <section id="tentang" className="py-6 sm:py-8 bg-gradient-to-r from-darkcocoa via-[#321e14] to-darkcocoa text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-peach-300 text-[10px] font-bold">
              <Crown className="w-3 h-3" />
              <span>Khusus Pemilik Kos</span>
            </span>

            <h2 className="text-lg sm:text-2xl font-heading font-extrabold tracking-tight">
              Punya Kosan? Kelola Otomatis &amp; Promosikan di Sini!
            </h2>

            <p className="text-[11px] sm:text-xs text-cream-200/80 max-w-md mx-auto">
              Denah kamar visual, pengingat tagihan sewa WhatsApp otomatis, dan listing kos gratis tanpa potongan komisi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
              <Link
                href="/mitra"
                className="w-full sm:w-auto px-5 py-2 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-heading font-bold text-xs shadow-cute flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Pelajari Software pawskost</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
              >
                Coba Gratis 14 Hari
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 7. FOOTER                                                */}
      {/* ======================================================== */}
      <footer className="bg-[#1f1510] text-cream-200/70 py-12 text-xs border-t border-darkcocoa">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <PawskostLogo size="sm" />
              <span className="font-heading font-extrabold text-base text-white">
                pawskost
              </span>
            </div>
            <p className="text-[11px] text-cream-200/60 leading-relaxed">
              Platform katalog pencarian kos dan software manajemen kos-kosan modern untuk kenyamanan juragan dan pencari kos Indonesia.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-3">Pencarian Populer</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#hasil-katalog" className="hover:text-peach-400">Kost Bandung</a></li>
              <li><a href="#hasil-katalog" className="hover:text-peach-400">Kost Khusus Putri</a></li>
              <li><a href="#hasil-katalog" className="hover:text-peach-400">Kost Khusus Putra</a></li>
              <li><a href="#hasil-katalog" className="hover:text-peach-400">Kost Dekat Kampus ITB &amp; Unpad</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-3">Untuk Pemilik Kos (SaaS)</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/mitra" className="hover:text-peach-400 font-bold text-peach-300">Software Manajemen Kos</Link></li>
              <li><Link href="/mitra#harga" className="hover:text-peach-400">Paket Langganan</Link></li>
              <li><Link href="/login" className="hover:text-peach-400">Masuk Akun Pemilik</Link></li>
              <li><button onClick={() => setIsRegisterModalOpen(true)} className="hover:text-peach-400 text-left">Daftar Akun Baru (14 Hari)</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs mb-3">Kontak Layanan</h4>
            <p className="text-[11px] text-cream-200/60">
              Pertanyaan seputar iklan kos atau aplikasi pawskost:
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20pawskost,%20saya%20mau%20tanya%20tentang%20katalog%20kos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-matcha-400 font-bold hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Support Resmi</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-white/10 text-center text-[10px] text-white/50">
          © {new Date().getFullYear()} pawskost • Platform Manajemen &amp; Katalog Kos Indonesia
        </div>
      </footer>

      {/* Global Registration Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}

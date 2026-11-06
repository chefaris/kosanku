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
  CalendarCheck
} from 'lucide-react';
import { KosCatalogSection } from './components/catalog/KosCatalogSection';
import { RegisterModal } from './components/ui/RegisterModal';

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
            <span>Pelajari Software pawskost</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PUBLIC MARKETPLACE NAVBAR                             */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200/90 shadow-xs py-3.5 sm:py-4 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-peach-400 shadow-sm bg-peach-50 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/app-logo.jpg"
                alt="Logo pawskost"
                width={44}
                height={44}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-peach-600">
                  pawskost
                </span>
              </div>
              <p className="text-[11px] text-darkcocoa/70 font-semibold -mt-0.5">
                Katalog Kosan Indonesia
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
            <a href="#tentang" className="hover:text-peach-600 transition-colors">
              Untuk Pemilik Kos
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Tombol ke Landing Page Merchant / Pemilik Kos */}
            <Link
              href="/mitra"
              className="px-4 py-2.5 rounded-2xl bg-peach-600 hover:bg-peach-700 text-white text-xs sm:text-sm font-heading font-extrabold shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              <Building2 className="w-4 h-4" />
              <span>Untuk Pemilik Kos</span>
            </Link>

            <Link
              href="/login"
              className="px-4 py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa text-xs sm:text-sm font-bold border border-cream-200 transition-colors"
            >
              Masuk Pemilik
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
            <a
              href="#tentang"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-600"
            >
              Tentang pawskost
            </a>

            <div className="pt-3 border-t border-cream-100 flex flex-col gap-2">
              <Link
                href="/mitra"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-peach-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm text-center"
              >
                <Building2 className="w-4 h-4" />
                <span>Halaman Pemilik Kos</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-darkcocoa text-white font-bold text-xs text-center"
              >
                Masuk Akun Pemilik
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
        <section id="cara-sewa" className="py-16 md:py-20 bg-white border-t border-cream-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-peach-600 uppercase tracking-wider">
                Panduan Praktis
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-darkcocoa">
                3 Langkah Mudah Sewa Kos di pawskost
              </h2>
              <p className="text-xs sm:text-sm text-softgray">
                Tak perlu bingung mencari tempat tinggal idaman. Prosesnya simpel, aman, dan tanpa biaya perantara!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="relative p-6 sm:p-8 bg-cream-50/70 rounded-3xl border border-cream-200 shadow-2xs space-y-4 hover:shadow-cute hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-peach-100 text-peach-600 flex items-center justify-center font-heading font-extrabold text-lg shadow-2xs">
                    01
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-darkcocoa text-[11px] font-bold border border-cream-200">
                    Pilih &amp; Cek
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-darkcocoa">
                  Cari &amp; Bandingkan Kos
                </h3>
                <p className="text-xs text-softgray leading-relaxed">
                  Gunakan filter kota, kategori kamar (Putri/Putra/Campur), fasilitas AC/WiFi, dan rentang budget yang paling pas buat kamu.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative p-6 sm:p-8 bg-cream-50/70 rounded-3xl border border-cream-200 shadow-2xs space-y-4 hover:shadow-cute hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-matcha-100 text-matcha-600 flex items-center justify-center font-heading font-extrabold text-lg shadow-2xs">
                    02
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-darkcocoa text-[11px] font-bold border border-cream-200">
                    Chat Langsung
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-darkcocoa">
                  Hubungi Pemilik via WhatsApp
                </h3>
                <p className="text-xs text-softgray leading-relaxed">
                  Klik tombol <strong>Chat WA</strong> untuk langsung terhubung dengan pengelola resmi. Tanyakan ketersediaan kamar dan atur jadwal survei lokasi.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative p-6 sm:p-8 bg-cream-50/70 rounded-3xl border border-cream-200 shadow-2xs space-y-4 hover:shadow-cute hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sakura-100 text-sakura-600 flex items-center justify-center font-heading font-extrabold text-lg shadow-2xs">
                    03
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-darkcocoa text-[11px] font-bold border border-cream-200">
                    Resmi &amp; Nyaman
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-darkcocoa">
                  Siap Huni &amp; Kwitansi Digital
                </h3>
                <p className="text-xs text-softgray leading-relaxed">
                  Bayar sewa secara transparan langsung ke rekening pengelola kos. Dapatkan bukti pembayaran dan kwitansi sewa resmi dari sistem pawskost!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. KEUNGGULAN CARI KOS DI PAWSKOST                       */}
        {/* ======================================================== */}
        <section id="keunggulan" className="py-16 md:py-20 bg-cream-50/70 border-t border-cream-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-peach-500 uppercase tracking-wider">
                Kenapa Cari Kos di pawskost?
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-darkcocoa">
                Pengalaman Sewa Kos yang Mudah, Cepat, dan Aman
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 sm:p-7 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-matcha-100 text-matcha-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-base text-darkcocoa">
                  100% Terverifikasi Langsung Pemilik
                </h3>
                <p className="text-xs text-softgray leading-relaxed">
                  Setiap kosan yang tayang dikelola langsung oleh mitra pemilik kos terdaftar di software pawskost. Bebas dari calo atau iklan palsu.
                </p>
              </div>

              <div className="p-6 sm:p-7 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-peach-100 text-peach-500 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-base text-darkcocoa">
                  Direct WhatsApp Tanpa Biaya Calo
                </h3>
                <p className="text-xs text-softgray leading-relaxed">
                  Hubungi pengelola kos langsung lewat nomor WhatsApp resmi. Jadwalkan survei dan tanyakan ketersediaan kamar tanpa perantara.
                </p>
              </div>

              <div className="p-6 sm:p-7 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sakura-100 text-sakura-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-base text-darkcocoa">
                  Status Kamar Kosong Real-Time
                </h3>
                <p className="text-xs text-softgray leading-relaxed">
                  Katalog terhubung langsung ke sistem database kamar pemilik kos, sehingga jumlah sisa kamar kosong selalu akurat dan terbarui.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. CALLOUT UNTUK PEMILIK KOS (MERCHANT PROMOTION)        */}
        {/* ======================================================== */}
        <section id="tentang" className="py-16 md:py-20 bg-gradient-to-r from-darkcocoa via-[#321e14] to-darkcocoa text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-peach-300 text-xs font-bold border border-white/10">
              <Crown className="w-3.5 h-3.5" />
              <span>Khusus Juragan &amp; Pemilik Kos Indonesia</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold tracking-tight">
              Punya Kosan? Kelola Lebih Praktis &amp; Promosikan di Sini!
            </h2>

            <p className="text-xs sm:text-sm text-cream-200/80 max-w-xl mx-auto leading-relaxed">
              Tinggalkan buku tulis manual. Gunakan software pawskost untuk denah kamar visual, pengingat tagihan sewa WhatsApp 1-klik, dan properti Anda otomatis tampil di katalog ini!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/mitra"
                className="w-full sm:w-auto px-7 py-3.5 rounded-3xl bg-peach-500 hover:bg-peach-400 text-white font-heading font-bold text-xs sm:text-sm shadow-cute flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Pelajari Software Manajemen Kos pawskost</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-3xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                Daftar Uji Coba Gratis 14 Hari
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
              <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/30 flex-shrink-0">
                <Image
                  src="/app-logo.jpg"
                  alt="Logo pawskost"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
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

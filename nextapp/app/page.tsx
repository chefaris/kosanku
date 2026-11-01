'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useKosStore, initialLandingPageConfig } from './lib/store/useKosStore';
import { RegisterModal } from './components/ui/RegisterModal';
import {
  Gamepad2,
  Sparkles,
  CheckCircle2,
  XCircle,
  DoorOpen,
  Receipt,
  FileCheck2,
  Building2,
  Wrench,
  BarChart3,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Menu,
  X,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { loginAsDemo, landingPageConfig } = useKosStore();
  const cfg = landingPageConfig || initialLandingPageConfig;

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStartDemo = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-cream-50 font-body text-darkcocoa selection:bg-peach-100 selection:text-peach-500 overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. NAVBAR PUBLIK                                         */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200/90 shadow-xs py-3.5 sm:py-4 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-peach-300 shadow-cute bg-peach-50 flex-shrink-0 group-hover:scale-105 transition-transform">
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
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-peach-500">
                  pawskost
                </span>
                <span className="text-xs">🐾</span>
              </div>
              <p className="text-[11px] text-softgray font-semibold -mt-0.5">
                Kelola Kos Jadi Menyenangkan
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Proportional & Elegant) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-softgray tracking-normal">
            <a href="#solusi" className="hover:text-peach-500 transition-colors py-1">Masalah vs Solusi</a>
            <a href="#fitur" className="hover:text-peach-500 transition-colors py-1">Fitur Unggulan</a>
            <a href="#harga" className="hover:text-peach-500 transition-colors py-1">Paket Harga</a>
            <a href="#testimoni" className="hover:text-peach-500 transition-colors py-1">Testimoni</a>
            <a href="#faq" className="hover:text-peach-500 transition-colors py-1">Tanya Jawab</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleStartDemo}
              className="px-4 py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa text-xs sm:text-sm font-bold border border-cream-200 shadow-xs flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Gamepad2 className="w-4 h-4 text-peach-500" />
              <span>Coba Demo</span>
            </button>

            <Link
              href="/login"
              className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-softgray hover:text-darkcocoa transition-colors"
            >
              Masuk
            </Link>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white text-xs sm:text-sm font-bold shadow-cute flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>Uji Coba 14 Hari</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
              href="#solusi"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-500"
            >
              Masalah vs Solusi
            </a>
            <a
              href="#fitur"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-500"
            >
              Fitur Unggulan
            </a>
            <a
              href="#harga"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-500"
            >
              Paket Harga
            </a>
            <a
              href="#testimoni"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-500"
            >
              Testimoni
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-500"
            >
              Tanya Jawab
            </a>

            <div className="pt-3 border-t border-cream-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleStartDemo();
                }}
                className="w-full py-2.5 rounded-2xl bg-cream-100 text-darkcocoa text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Gamepad2 className="w-4 h-4 text-peach-500" />
                <span>Coba Demo Gratis (1-Klik)</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsRegisterModalOpen(true);
                }}
                className="w-full py-2.5 rounded-2xl bg-peach-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-cute"
              >
                <span>Daftar Akun (Gratis 14 Hari)</span>
              </button>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2 text-xs text-softgray"
              >
                Sudah punya akun? Masuk di sini
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Soft Background Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-peach-200/40 via-sakura-200/30 to-matcha-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 border border-peach-200 shadow-sm px-4 py-1.5 rounded-full text-xs font-extrabold text-peach-600">
            <span className="w-2 h-2 rounded-full bg-peach-500 animate-ping" />
            <span>{cfg.heroBadge}</span>
          </div>

          {/* Heading */}
          <div className="max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-darkcocoa tracking-tight leading-tight">
              {cfg.heroHeadline}
            </h1>
            <p className="text-sm sm:text-base text-softgray max-w-2xl mx-auto leading-relaxed">
              {cfg.heroSubheadline}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={handleStartDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-3xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-sm shadow-cute flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95 transition-all"
            >
              <Gamepad2 className="w-5 h-5 animate-pulse" />
              <span>{cfg.heroCtaText}</span>
            </button>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-3xl bg-white hover:bg-cream-100 text-darkcocoa font-bold text-sm border-2 border-cream-200 shadow-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-peach-500" />
              <span>{cfg.heroCtaSecondaryText}</span>
            </button>
          </div>

          <p className="text-[11px] text-softgray flex items-center justify-center gap-4 flex-wrap">
            <span>✓ Tanpa Kartu Kredit</span>
            <span>•</span>
            <span>✓ Setup 2 Menit Selesai</span>
            <span>•</span>
            <span>✓ Batal Kapan Saja</span>
          </p>

          {/* Live Mock Dashboard Preview */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="relative rounded-3xl p-3 sm:p-5 bg-white/90 shadow-2xl border border-cream-200/90">
              {/* Fake Window Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-cream-100 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-matcha-400" />
                </div>
                <span className="text-[11px] font-bold text-softgray">
                  app.pawskost.id • Dashboard Juragan Kos
                </span>
                <span className="text-xs">🐾</span>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                <div className="p-4 bg-sakura-50/70 rounded-2xl border border-sakura-200 space-y-1">
                  <p className="text-[10px] font-bold text-sakura-600 uppercase tracking-wide">Okupansi Kamar</p>
                  <p className="text-xl sm:text-2xl font-heading font-extrabold text-darkcocoa">18/20 Terisi</p>
                  <p className="text-[10px] text-matcha-600 font-bold">● 90% Terisi Penuh</p>
                </div>

                <div className="p-4 bg-matcha-50/70 rounded-2xl border border-matcha-200 space-y-1">
                  <p className="text-[10px] font-bold text-matcha-600 uppercase tracking-wide">Sewa Terkumpul</p>
                  <p className="text-xl sm:text-2xl font-heading font-extrabold text-darkcocoa">Rp 45.000.000</p>
                  <p className="text-[10px] text-softgray font-medium">dari target Rp 50jt</p>
                </div>

                <div className="p-4 bg-peach-50/70 rounded-2xl border border-peach-200 space-y-1">
                  <p className="text-[10px] font-bold text-peach-600 uppercase tracking-wide">Pengingat WhatsApp</p>
                  <p className="text-xl sm:text-2xl font-heading font-extrabold text-darkcocoa">3 Terkirim</p>
                  <p className="text-[10px] text-peach-600 font-bold">1-Klik ke Penghuni</p>
                </div>

                <div className="p-4 bg-lavender-50/70 rounded-2xl border border-lavender-200 space-y-1">
                  <p className="text-[10px] font-bold text-lavender-600 uppercase tracking-wide">Kas Bersih Bulan Ini</p>
                  <p className="text-xl sm:text-2xl font-heading font-extrabold text-darkcocoa">Rp 32.500.000</p>
                  <p className="text-[10px] text-matcha-600 font-bold">Arus Kas Positif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. MASALAH VS SOLUSI                                     */}
      {/* ======================================================== */}
      <section id="solusi" className="py-16 md:py-24 bg-white border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-peach-500 uppercase tracking-wider">
              Mengapa Harus Pindah ke pawskost?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa">
              Bandingkan Hidup Anda Sebelum &amp; Sesudah pawskost
            </h2>
            <p className="text-xs sm:text-sm text-softgray">
              Sudah saatnya pemilik kos modern beristirahat dengan tenang tanpa drama penagihan sewa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Cara Lama */}
            <div className="p-6 md:p-8 rounded-3xl bg-red-50/40 border-2 border-red-200 space-y-4">
              <div className="flex items-center gap-2.5 text-red-500">
                <XCircle className="w-6 h-6" />
                <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                  Cara Tradisional (Bikin Pusing)
                </h3>
              </div>
              <ul className="space-y-3 text-xs text-softgray">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Catat di buku atau Excel rumit yang gampang hilang atau tidak sinkron.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Sering lupa tanggal jatuh tempo, penghuni menunggak sewa berbulan-bulan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Kuitansi kertas berserakan, tidak ada bukti transfer yang terorganisir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Foto KTP penghuni tercecer di galeri HP pribadi, berisiko bocor atau hilang.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Punya 2 lokasi kosan harus bolak-balik buku catatan yang berbeda.</span>
                </li>
              </ul>
            </div>

            {/* Cara pawskost */}
            <div className="p-6 md:p-8 rounded-3xl bg-matcha-50/50 border-2 border-matcha-300 shadow-cute space-y-4">
              <div className="flex items-center gap-2.5 text-matcha-600">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                  Dengan pawskost (Rapi &amp; Menyenangkan)
                </h3>
              </div>
              <ul className="space-y-3 text-xs text-darkcocoa/90">
                <li className="flex items-start gap-2">
                  <span className="text-matcha-600 font-bold">✓</span>
                  <span>Denah visual interaktif per lantai, tahu persis kamar terisi dan kosong.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-matcha-600 font-bold">✓</span>
                  <span>Pengingat WhatsApp 1-klik dengan template sopan otomatis siap kirim.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-matcha-600 font-bold">✓</span>
                  <span>Kuitansi digital instan berstempel lunas yang dapat dikirim langsung ke penghuni.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-matcha-600 font-bold">✓</span>
                  <span>Arsip foto profil &amp; KTP aman berstempel watermark resmi &quot;ARSIP RESMI PAWSKOST&quot;.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-matcha-600 font-bold">✓</span>
                  <span>Kelola banyak cabang kos sekaligus hanya dengan satu tombol switcher dropdown.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SHOWCASE FITUR UNGGULAN                               */}
      {/* ======================================================== */}
      <section id="fitur" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-peach-500 uppercase tracking-wider">
              Fitur Dirancang Sesuai Kebutuhan Anda
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa">
              Semua Fitur Esensial Kosan dalam Satu Genggaman
            </h2>
            <p className="text-xs sm:text-sm text-softgray">
              Dibuat spesifik untuk pemilik kos di Indonesia dengan alur kerja yang mudah dimengerti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fitur 1 */}
            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-cute hover:-translate-y-1 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-peach-100 text-peach-500 flex items-center justify-center">
                <DoorOpen className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                Denah Kamar Visual &amp; Kelola Lantai
              </h3>
              <p className="text-xs text-softgray leading-relaxed">
                Tampilan kotak-kotak kamar warna-warni yang intuitif. Tambah lantai baru, hapus lantai yang tidak dipakai, dan tentukan fasilitas kamar secara fleksibel.
              </p>
            </div>

            {/* Fitur 2 */}
            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-cute hover:-translate-y-1 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sakura-100 text-sakura-500 flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                Kasir &amp; Pengingat WhatsApp 1-Klik
              </h3>
              <p className="text-xs text-softgray leading-relaxed">
                Tandai lunas pembayaran sewa, terbitkan kuitansi digital, dan kirim pesan tagihan WhatsApp otomatis tanpa perlu mengetik ulang nominal.
              </p>
            </div>

            {/* Fitur 3 */}
            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-cute hover:-translate-y-1 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-matcha-100 text-matcha-600 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                Arsip Pas Foto &amp; Dokumen KTP Aman
              </h3>
              <p className="text-xs text-softgray leading-relaxed">
                Unggah foto profil dan foto KTP penghuni kos dengan aman. Dokumen dilengkapi stempel tanda air pengaman otomatis untuk privasi data.
              </p>
            </div>

            {/* Fitur 4 */}
            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-cute hover:-translate-y-1 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-lavender-100 text-lavender-500 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                Manajemen Multi-Cabang / Area Kos
              </h3>
              <p className="text-xs text-softgray leading-relaxed">
                Punya kos di Dago dan Sukajadi? Kelola keduanya dalam satu akun. Saring data per cabang atau pantau konsolidasi performa keduanya sekaligus.
              </p>
            </div>

            {/* Fitur 5 */}
            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-cute hover:-translate-y-1 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-peach-100 text-peach-500 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                Tiket Keluhan &amp; Perawatan Kamar
              </h3>
              <p className="text-xs text-softgray leading-relaxed">
                Papan Kanban interaktif untuk mencatat keluhan AC bocor, genteng bocor, atau lampu mati. Pantau perbaikan mulai dari laporan hingga selesai.
              </p>
            </div>

            {/* Fitur 6 */}
            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-cute hover:-translate-y-1 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sakura-100 text-sakura-500 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                Arus Kas &amp; Ekspor Laporan CSV
              </h3>
              <p className="text-xs text-softgray leading-relaxed">
                Ketahui keuntungan bersih bulanan setelah dikurangi tagihan listrik, air, dan gaji penjaga kos. Laporan dapat diekspor ke file CSV kapan saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. PRICING TABLE (PAKET HARGA SAAS)                      */}
      {/* ======================================================== */}
      <section id="harga" className="py-16 md:py-24 bg-gradient-to-b from-white via-cream-50 to-white border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-peach-500 uppercase tracking-wider">
              Investasi Terjangkau untuk Bisnis Kos Anda
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa">
              Pilihan Paket Langganan KosanKu
            </h2>
            <p className="text-xs sm:text-sm text-softgray">
              Pilih paket yang paling sesuai dengan jumlah kamar kos Anda. Dapatkan 14 Hari Uji Coba Gratis!
            </p>

            {/* Monthly vs Annual Toggle */}
            <div className="inline-flex items-center gap-3 bg-cream-100 p-1 rounded-full border border-cream-200 shadow-sm mt-3">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-peach-500 text-white shadow-sm'
                    : 'text-softgray hover:text-darkcocoa'
                }`}
              >
                Bayar Bulanan
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingPeriod === 'annual'
                    ? 'bg-peach-500 text-white shadow-sm'
                    : 'text-softgray hover:text-darkcocoa'
                }`}
              >
                <span>Bayar Tahunan</span>
                <span className="px-2 py-0.2 rounded-full bg-matcha-400 text-white text-[9px] font-black uppercase tracking-wide">
                  Hemat 2 Bulan
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {/* Paket 1: Kos Mungil */}
            <div className="p-6 md:p-7 rounded-3xl bg-white border border-cream-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-darkcocoa">{cfg.pricing.starter.name}</h3>
                  <p className="text-xs text-softgray">{cfg.pricing.starter.desc}</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-heading font-extrabold text-darkcocoa">
                    {billingPeriod === 'monthly'
                      ? `Rp ${cfg.pricing.starter.price.toLocaleString('id-ID')}`
                      : `Rp ${Math.round(cfg.pricing.starter.price * 0.8).toLocaleString('id-ID')}`}
                  </span>
                  <span className="text-xs text-softgray"> / bulan</span>
                  {billingPeriod === 'annual' && (
                    <p className="text-[11px] text-matcha-600 font-bold mt-0.5">
                      Ditagih Rp {(cfg.pricing.starter.price * 10).toLocaleString('id-ID')}/tahun
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 text-xs text-softgray pt-4 border-t border-cream-100">
                  <li className="flex items-center gap-2 text-darkcocoa">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Maksimal <strong>{cfg.pricing.starter.maxProperties} Cabang Kos</strong></span>
                  </li>
                  <li className="flex items-center gap-2 text-darkcocoa">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Hingga <strong>{cfg.pricing.starter.maxRooms} Kamar</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Denah Visual Kamar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Pengingat WhatsApp 1-Klik</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Kuitansi Pembayaran Digital</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs border border-cream-200 transition-all hover:scale-[1.01]"
              >
                Coba 14 Hari Gratis
              </button>
            </div>

            {/* Paket 2: Juragan Pro (Best Seller) */}
            <div className="p-6 md:p-7 rounded-3xl bg-white border-2 border-peach-400 shadow-cute flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-peach-500 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-2xl tracking-wider">
                Paling Populer ⭐
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-darkcocoa flex items-center gap-1.5">
                    <span>{cfg.pricing.pro.name}</span>
                    <Sparkles className="w-4 h-4 text-peach-500" />
                  </h3>
                  <p className="text-xs text-softgray">{cfg.pricing.pro.desc}</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl sm:text-4xl font-heading font-extrabold text-peach-500">
                    {billingPeriod === 'monthly'
                      ? `Rp ${cfg.pricing.pro.price.toLocaleString('id-ID')}`
                      : `Rp ${Math.round(cfg.pricing.pro.price * 0.8).toLocaleString('id-ID')}`}
                  </span>
                  <span className="text-xs text-softgray"> / bulan</span>
                  {billingPeriod === 'annual' && (
                    <p className="text-[11px] text-matcha-600 font-bold mt-0.5">
                      Ditagih Rp {(cfg.pricing.pro.price * 10).toLocaleString('id-ID')}/tahun
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 text-xs text-darkcocoa/90 pt-4 border-t border-cream-100">
                  <li className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Hingga <strong>{cfg.pricing.pro.maxProperties} Cabang / Area Kos</strong></span>
                  </li>
                  <li className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Hingga <strong>{cfg.pricing.pro.maxRooms} Kamar</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Kelola Lantai &amp; Master Fasilitas Kustom</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Arsip Foto Profil &amp; KTP Ber-Watermark</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Multi-Rekening Bank per Cabang</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Laporan Arus Kas &amp; Ekspor CSV</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute transition-all hover:scale-[1.02] active:scale-95"
              >
                Pilih Juragan Pro (Trial 14 Hari)
              </button>
            </div>

            {/* Paket 3: Konglomerat Kos */}
            <div className="p-6 md:p-7 rounded-3xl bg-white border border-cream-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-darkcocoa">{cfg.pricing.enterprise.name}</h3>
                  <p className="text-xs text-softgray">{cfg.pricing.enterprise.desc}</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-heading font-extrabold text-darkcocoa">
                    {billingPeriod === 'monthly'
                      ? `Rp ${cfg.pricing.enterprise.price.toLocaleString('id-ID')}`
                      : `Rp ${Math.round(cfg.pricing.enterprise.price * 0.8).toLocaleString('id-ID')}`}
                  </span>
                  <span className="text-xs text-softgray"> / bulan</span>
                  {billingPeriod === 'annual' && (
                    <p className="text-[11px] text-matcha-600 font-bold mt-0.5">
                      Ditagih Rp {(cfg.pricing.enterprise.price * 10).toLocaleString('id-ID')}/tahun
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 text-xs text-softgray pt-4 border-t border-cream-100">
                  <li className="flex items-center gap-2 text-darkcocoa font-bold">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span><strong>Unlimited Cabang Kos</strong></span>
                  </li>
                  <li className="flex items-center gap-2 text-darkcocoa font-bold">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span><strong>Unlimited Kamar</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Multi-Akun Staf Penjaga Kos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Semua Fitur Juragan Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Dukungan Prioritas WhatsApp 24/7</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs border border-cream-200 transition-all hover:scale-[1.01]"
              >
                Coba 14 Hari Gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TESTIMONI PEMILIK KOS                                 */}
      {/* ======================================================== */}
      <section id="testimoni" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-peach-500 uppercase tracking-wider">
              Cerita Sukses Pemilik Kos
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa">
              Dipercaya Ratusan Juragan Kos di Seluruh Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-softgray">
              Inilah alasan mengapa mereka tidak pernah mau kembali ke cara pencatatan manual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-cute space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-softgray leading-relaxed italic">
                &ldquo;Dulu saya sering canggung saat mau menagih uang kos ke anak-anak mahasiswa. Semenjak pakai KosanKu, tinggal klik tombol WA pengingat sewa, template sopannya sudah rapi lengkap dengan rekening! Sangat membantu.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-cream-100">
                <div className="w-9 h-9 rounded-full bg-peach-100 text-peach-600 flex items-center justify-center font-bold text-xs">
                  BR
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-darkcocoa">Ibu Ratna Dewi</h4>
                  <p className="text-[10px] text-softgray">Pemilik Kos Putri Dago (22 Kamar), Bandung</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-cute space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-softgray leading-relaxed italic">
                &ldquo;Fitur arsip KTP-nya sangat profesional karena langsung ditempel watermark otomatis. Saya tidak khawatir lagi foto identitas anak kos disalahgunakan. Denah per lantainya juga sangat mudah dipahami penjaga kos saya.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-cream-100">
                <div className="w-9 h-9 rounded-full bg-sakura-100 text-sakura-600 flex items-center justify-center font-bold text-xs">
                  PH
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-darkcocoa">Pak Hendra Wijaya</h4>
                  <p className="text-[10px] text-softgray">Pemilik Kos Pasutri Tebet (35 Kamar), Jakarta</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-cute space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-softgray leading-relaxed italic">
                &ldquo;Saya punya 2 kosan di area kampus UGM. Dulu pusing harus buka 2 buku terpisah. Sekarang tinggal ganti cabang di menu kiri atas, pembukuan kas dan tagihan langsung terpisah rapi. Luar biasa!&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-cream-100">
                <div className="w-9 h-9 rounded-full bg-matcha-100 text-matcha-600 flex items-center justify-center font-bold text-xs">
                  DA
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-darkcocoa">Dimas Anugrah</h4>
                  <p className="text-[10px] text-softgray">Pemilik 2 Cabang Kos (40 Kamar), Yogyakarta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FAQ ACCORDION                                         */}
      {/* ======================================================== */}
      <section id="faq" className="py-16 md:py-24 bg-white border-t border-cream-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-peach-500 uppercase tracking-wider">
              Pertanyaan yang Sering Diajukan
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa">
              Ada Pertanyaan? Kami Punya Jawabannya
            </h2>
          </div>

          <div className="space-y-3">
            {cfg.faqs.map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="rounded-2xl border border-cream-200 bg-cream-50/50 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-darkcocoa hover:text-peach-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-peach-500 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-softgray transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-peach-500' : ''
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-softgray leading-relaxed border-t border-cream-200/50 pt-2 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. FINAL CTA BANNER                                      */}
      {/* ======================================================== */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-peach-500 via-peach-400 to-sakura-400 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold tracking-tight">
            Siap Mengelola Kos Jadi Lebih Menyenangkan?
          </h2>

          <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto leading-relaxed">
            Gabung bersama ratusan pemilik kos lainnya yang telah menghemat waktu dan terbebas dari stres penagihan sewa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-3xl bg-white text-darkcocoa font-bold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-peach-500" />
              <span>Coba Demo Gratis Dulu</span>
            </button>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-3xl bg-darkcocoa hover:bg-darkcocoa/90 text-white font-bold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Daftar Uji Coba 14 Hari
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FOOTER                                                */}
      {/* ======================================================== */}
      <footer className="bg-darkcocoa text-white/70 py-12 text-xs border-t border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/30 flex-shrink-0">
                <Image
                  src="/app-logo.jpg"
                  alt="Logo KosanKu"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-heading font-extrabold text-base text-white">
                pawskost
              </span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Platform perangkat lunak manajemen kos-kosan modern dengan nuansa pastel imut untuk kenyamanan juragan kos Indonesia.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-3">Navigasi Cepat</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#fitur" className="hover:text-peach-400">Fitur Unggulan</a></li>
              <li><a href="#harga" className="hover:text-peach-400">Paket Langganan</a></li>
              <li><a href="#testimoni" className="hover:text-peach-400">Testimoni Juragan</a></li>
              <li><a href="#faq" className="hover:text-peach-400">Pertanyaan Umum</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-3">Akses Aplikasi</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={handleStartDemo} className="hover:text-peach-400 text-left">Mode Demo Sandbox</button></li>
              <li><Link href="/login" className="hover:text-peach-400">Masuk Akun Pemilik</Link></li>
              <li><button onClick={() => setIsRegisterModalOpen(true)} className="hover:text-peach-400 text-left">Daftar Akun Baru (14 Hari)</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs mb-3">Butuh Bantuan?</h4>
            <p className="text-[11px] text-white/60">
              Tim Mimi siap membantu pengaturan kosan Anda:
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Mimi%20pawskost,%20saya%20mau%20tanya%20tentang%20aplikasi%20pawskost"
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
          © {new Date().getFullYear()} pawskost • Dibuat dengan cinta untuk Pemilik Kos Indonesia 🐾
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

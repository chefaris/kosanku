'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useKosStore, initialLandingPageConfig } from '../lib/store/useKosStore';
import { RegisterModal } from '../components/ui/RegisterModal';
import { PawskostLogo } from '../components/ui/PawskostLogo';
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
  PhoneCall,
  Compass
} from 'lucide-react';

export default function MitraLandingPage() {
  const router = useRouter();
  const { currentUser, loginAsDemo, landingPageConfig } = useKosStore();
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
      {/* 1. NAVBAR MERCHANT SAAS                                  */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200/90 shadow-xs py-3.5 sm:py-4 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/mitra" className="flex items-center gap-3 group focus:outline-none">
            <PawskostLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-peach-600">
                  pawskost
                </span>
              </div>
              <p className="text-[11px] text-darkcocoa/70 font-semibold -mt-0.5">
                Software Manajemen Kos No. 1
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-semibold text-softgray tracking-normal">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-peach-600 font-extrabold flex items-center gap-1.5 transition-colors border border-cream-200"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Buka Katalog Kos</span>
            </Link>
            <a href="#solusi" className="hover:text-peach-600 transition-colors py-1">Masalah vs Solusi</a>
            <a href="#fitur" className="hover:text-peach-600 transition-colors py-1">Fitur Unggulan</a>
            <a href="#harga" className="hover:text-peach-600 transition-colors py-1">Paket Harga</a>
            <a href="#testimoni" className="hover:text-peach-600 transition-colors py-1">Testimoni</a>
            <a href="#faq" className="hover:text-peach-600 transition-colors py-1">Tanya Jawab</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {currentUser ? (
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-2xl bg-peach-600 hover:bg-peach-700 text-white text-xs sm:text-sm font-heading font-extrabold shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Building2 className="w-4 h-4" />
                <span>Ke Dashboard Saya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartDemo}
                  className="px-4 py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa text-xs sm:text-sm font-bold border border-cream-200 shadow-xs flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Gamepad2 className="w-4 h-4 text-peach-600" />
                  <span>Coba Demo</span>
                </button>

                <Link
                  href="/login"
                  className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-softgray hover:text-darkcocoa transition-colors"
                >
                  Masuk
                </Link>

                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-peach-600 hover:bg-peach-700 text-white text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Uji Coba 14 Hari</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
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
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-peach-600 font-extrabold flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Buka Katalog Kos</span>
            </Link>
            <a
              href="#solusi"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-600"
            >
              Masalah vs Solusi
            </a>
            <a
              href="#fitur"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-600"
            >
              Fitur Unggulan
            </a>
            <a
              href="#harga"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-600"
            >
              Paket Harga
            </a>
            <a
              href="#testimoni"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-600"
            >
              Testimoni
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 hover:text-peach-600"
            >
              Tanya Jawab
            </a>

            <div className="pt-3 border-t border-cream-100 flex flex-col gap-2">
              {currentUser ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-peach-600 text-white font-heading font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Ke Dashboard Saya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleStartDemo();
                    }}
                    className="w-full py-2.5 rounded-xl bg-cream-100 text-darkcocoa font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Gamepad2 className="w-4 h-4 text-peach-600" />
                    <span>Coba Demo Interaktif (1-Klik)</span>
                  </button>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-darkcocoa text-white font-bold text-xs text-center"
                  >
                    Masuk Akun Pemilik
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsRegisterModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-peach-600 text-white font-bold text-xs text-center shadow-sm"
                  >
                    Daftar Uji Coba 14 Hari
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION MERCHANT SAAS                            */}
      {/* ======================================================== */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-cream-50 via-white to-cream-50">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-peach-200/30 blur-[120px] rounded-full pointer-events-none -z-10" />

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

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-3xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-sm border border-cream-200 shadow-xs flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Compass className="w-4 h-4 text-peach-500" />
              <span>Katalog Kos Publik &rarr;</span>
            </Link>
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
              <ul className="space-y-3 text-xs sm:text-sm text-softgray">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Catat tagihan di buku tulis atau Excel manual yang gampang hilang.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Ragu menagih sewa karena sungkan atau lupa siapa saja yang telat bayar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Foto KTP penyewa menumpuk berantakan di galeri HP tanpa enkripsi privasi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Keluhan AC rusak atau keran bocor sering terlupakan dan bikin penyewa kecewa.</span>
                </li>
              </ul>
            </div>

            {/* Cara pawskost */}
            <div className="p-6 md:p-8 rounded-3xl bg-matcha-50/40 border-2 border-matcha-200 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5 text-matcha-600">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                  Dengan pawskost (Serba Praktis &amp; Imut)
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-darkcocoa/80 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0 mt-0.5" />
                  <span>Denah visual lantai interaktif. Status kamar terisi &amp; kosong terpantau real-time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0 mt-0.5" />
                  <span>Kirim pengingat WhatsApp otomatis 1-klik dengan sapaan ramah dan nomor rekening.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0 mt-0.5" />
                  <span>Arsip KTP digital otomatis ber-watermark untuk melindungi kerahasiaan identitas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0 mt-0.5" />
                  <span>Tiket komplain &amp; perbaikan transparan dengan pantauan biaya tukang.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FITUR UNGGULAN                                        */}
      {/* ======================================================== */}
      <section id="fitur" className="py-16 md:py-24 bg-cream-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-peach-500 uppercase tracking-wider">
              Solusi Lengkap Bisnis Kos
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa">
              Semua Fitur yang Anda Butuhkan Ada di Sini
            </h2>
            <p className="text-xs sm:text-sm text-softgray">
              Dirancang khusus untuk mempermudah pemilik kos mengelola operasional harian dalam genggaman.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-cute transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-peach-100 text-peach-500 flex items-center justify-center">
                <DoorOpen className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-darkcocoa">Denah Visual Kamar</h3>
              <p className="text-xs text-softgray leading-relaxed">
                Kelola kamar per lantai dengan warna visual status: Hijau (Kosong), Merah (Terisi), Ungu (Perbaikan).
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-cute transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sakura-100 text-sakura-500 flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-darkcocoa">Tagihan &amp; Resi Thermal</h3>
              <p className="text-xs text-softgray leading-relaxed">
                Kirim pesan tagihan sewa ke WhatsApp dalam 1 klik dan cetak kwitansi struk printer thermal 58mm.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-cute transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-matcha-100 text-matcha-600 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-darkcocoa">Arsip KTP Ber-Watermark</h3>
              <p className="text-xs text-softgray leading-relaxed">
                Amankan dokumen identitas penyewa dengan watermark otomatis untuk mencegah penyalahgunaan data KTP.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-cute transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-lavender-100 text-lavender-500 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-darkcocoa">Manajemen Multi-Cabang</h3>
              <p className="text-xs text-softgray leading-relaxed">
                Punya kos di Dago dan Sukajadi? Pantau seluruh cabang kosan Anda dalam satu akun terpusat.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-cute transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-peach-100 text-peach-500 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-darkcocoa">Multi-User Hak Akses Staf</h3>
              <p className="text-xs text-softgray leading-relaxed">
                Beri akun khusus Kasir atau Penjaga Kos. Data margin laba bersih &amp; rekening pemilik tetap aman terlindungi.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm hover:shadow-cute transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-matcha-100 text-matcha-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-darkcocoa">Laporan Arus Kas &amp; Laba</h3>
              <p className="text-xs text-softgray leading-relaxed">
                Ketahui secara pasti berapa keuntungan bersih kosan Anda setiap bulan dengan grafik analitik transparan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. PAKET HARGA LANGGANAN (PRICING)                       */}
      {/* ======================================================== */}
      <section id="harga" className="py-16 md:py-24 bg-white border-t border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-peach-500 uppercase tracking-wider">
              Investasi Terjangkau
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa">
              Pilihan Paket Langganan Sesuai Skala Kos
            </h2>
            <p className="text-xs sm:text-sm text-softgray">
              Tanpa biaya tersembunyi. Mulai gratis 14 hari penuh tanpa komitmen kartu kredit.
            </p>

            {/* Toggle Bulanan / Tahunan */}
            <div className="pt-2 flex items-center justify-center gap-2">
              <div className="p-1 bg-cream-100 rounded-2xl inline-flex items-center gap-1 border border-cream-200">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    billingPeriod === 'monthly'
                      ? 'bg-peach-500 text-white shadow-cute'
                      : 'text-softgray hover:text-darkcocoa'
                  }`}
                >
                  Bulanan
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    billingPeriod === 'annual'
                      ? 'bg-peach-500 text-white shadow-cute'
                      : 'text-softgray hover:text-darkcocoa'
                  }`}
                >
                  <span>Tahunan</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-matcha-500 text-white text-[9px]">Hemat 20%</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Paket Starter */}
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-cream-200 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-cute transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-lg text-darkcocoa">{cfg.pricing.starter.name}</h3>
                  <p className="text-xs text-softgray">{cfg.pricing.starter.desc}</p>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-3xl text-darkcocoa">
                    Rp {billingPeriod === 'annual' ? (cfg.pricing.starter.price * 10).toLocaleString('id-ID') : cfg.pricing.starter.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-softgray font-medium">/{billingPeriod === 'annual' ? 'tahun' : 'bulan'}</span>
                </div>
                <ul className="space-y-2.5 text-xs text-softgray pt-4 border-t border-cream-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Hingga <strong>{cfg.pricing.starter.maxRooms} Kamar</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span><strong>1 Lokasi</strong> Cabang Kos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Pengingat WhatsApp 1-Klik</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Kwitansi Struk Thermal 58mm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Otomatis Tayang di Katalog Promosi</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs transition-colors"
              >
                Pilih Paket Ini
              </button>
            </div>

            {/* Paket Pro (Featured) */}
            <div className="p-6 md:p-8 rounded-3xl bg-white border-2 border-peach-400 shadow-cute space-y-6 flex flex-col justify-between relative hover:scale-[1.02] transition-all">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-peach-500 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm">
                Paling Favorit ⭐
              </span>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-lg text-darkcocoa">{cfg.pricing.pro.name}</h3>
                  <p className="text-xs text-softgray">{cfg.pricing.pro.desc}</p>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-3xl text-peach-500">
                    Rp {billingPeriod === 'annual' ? (cfg.pricing.pro.price * 10).toLocaleString('id-ID') : cfg.pricing.pro.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-softgray font-medium">/{billingPeriod === 'annual' ? 'tahun' : 'bulan'}</span>
                </div>
                <ul className="space-y-2.5 text-xs text-darkcocoa/80 font-medium pt-4 border-t border-cream-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-peach-500 flex-shrink-0" />
                    <span>Hingga <strong>{cfg.pricing.pro.maxRooms} Kamar</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-peach-500 flex-shrink-0" />
                    <span>Hingga <strong>{cfg.pricing.pro.maxProperties} Cabang Kos</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-peach-500 flex-shrink-0" />
                    <span>Semua Fitur Paket Mungil</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-peach-500 flex-shrink-0" />
                    <span>Multi-User Akun Kasir &amp; Penjaga</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-peach-500 flex-shrink-0" />
                    <span>Prioritas Listing di Katalog Promosi</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute transition-colors"
              >
                Mulai Uji Coba 14 Hari
              </button>
            </div>

            {/* Paket Enterprise */}
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-cream-200 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-cute transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-lg text-darkcocoa">{cfg.pricing.enterprise.name}</h3>
                  <p className="text-xs text-softgray">{cfg.pricing.enterprise.desc}</p>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-3xl text-darkcocoa">
                    Rp {billingPeriod === 'annual' ? (cfg.pricing.enterprise.price * 10).toLocaleString('id-ID') : cfg.pricing.enterprise.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-softgray font-medium">/{billingPeriod === 'annual' ? 'tahun' : 'bulan'}</span>
                </div>
                <ul className="space-y-2.5 text-xs text-softgray pt-4 border-t border-cream-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span><strong>Kamar Tanpa Batas</strong> (Unlimited)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span><strong>Cabang Tanpa Batas</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Dukungan VIP &amp; Onboarding Eksklusif</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                    <span>Badge Verified Platinum di Katalog</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs transition-colors"
              >
                Pilih Paket Ini
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TESTIMONI JURAGAN KOS                                 */}
      {/* ======================================================== */}
      <section id="testimoni" className="py-16 md:py-24 bg-cream-50/50 border-t border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-peach-500 uppercase tracking-wider">
              Cerita Sukses Mitra
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa">
              Dipercaya Lebih dari 500+ Pemilik Kos di Seluruh Indonesia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-softgray leading-relaxed italic">
                &quot;Dulu setiap tanggal 1 selalu stres buka catatan buku tebal untuk tahu siapa yang belum bayar. Sekarang tinggal 1 klik kirim WhatsApp lewat pawskost, sewa langsung beres!&quot;
              </p>
              <div className="pt-2 border-t border-cream-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-peach-100 text-peach-600 flex items-center justify-center font-bold text-xs">
                  HS
                </div>
                <div>
                  <h4 className="font-bold text-xs text-darkcocoa">Hj. Siti Rohmah</h4>
                  <p className="text-[11px] text-softgray">Pemilik Kos Melati (28 Kamar), Bandung</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-softgray leading-relaxed italic">
                &quot;Fitur multi-user stafnya luar biasa. Kasir saya bisa input pembayaran dan cetak resi thermal di pos depan tanpa bisa melihat saldo rekening pribadi saya.&quot;
              </p>
              <div className="pt-2 border-t border-cream-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-matcha-100 text-matcha-700 flex items-center justify-center font-bold text-xs">
                  BA
                </div>
                <div>
                  <h4 className="font-bold text-xs text-darkcocoa">Bambang Ardianto</h4>
                  <p className="text-[11px] text-softgray">Juragan Kos Dago Paviliun, Bandung</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-softgray leading-relaxed italic">
                &quot;Watermark KTP otomatisnya memberi rasa aman bagi anak-anak kos saya. Tampilan aplikasinya juga lucu dan segar, tidak membosankan seperti spreadsheet jadul.&quot;
              </p>
              <div className="pt-2 border-t border-cream-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sakura-100 text-sakura-600 flex items-center justify-center font-bold text-xs">
                  DW
                </div>
                <div>
                  <h4 className="font-bold text-xs text-darkcocoa">dr. Dian Wulandari</h4>
                  <p className="text-[11px] text-softgray">Pemilik Kos Putri Asri, Sukajadi</p>
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
              <PawskostLogo size="sm" />
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
              <li><Link href="/" className="hover:text-peach-400 font-bold text-peach-300">Katalog Kos Publik</Link></li>
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
              Tim Support Pawskost siap membantu pengaturan kosan Anda:
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20pawskost,%20saya%20mau%20tanya%20tentang%20aplikasi%20pawskost"
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

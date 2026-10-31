'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
  DoorOpen,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
  Download,
  Printer,
  X,
  CreditCard,
  Zap,
  Clock
} from 'lucide-react';
import { useKosStore, SaaSInvoice } from '../lib/store/useKosStore';
import { PaymentModal } from '../components/ui/PaymentModal';

export default function SubscriptionPage() {
  const { subscription, saasInvoices, rooms, properties, currentUser } = useKosStore();

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<SaaSInvoice | null>(null);

  const currentRoomsCount = rooms.length;
  const maxRoomsCount = subscription?.maxRooms || 999;
  const roomPercentage = Math.min(100, Math.round((currentRoomsCount / maxRoomsCount) * 100));

  const currentPropsCount = properties.length;
  const maxPropsCount = subscription?.maxProperties || 999;
  const propPercentage = Math.min(100, Math.round((currentPropsCount / maxPropsCount) * 100));

  const handleOpenPayment = (plan: 'starter' | 'pro' | 'enterprise') => {
    setSelectedPlanForPayment(plan);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-peach-100 text-peach-600 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              SaaS Billing Center
            </span>
            <span className="text-xs text-softgray">• Lisensi Resmi Pemilik Kos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-darkcocoa">
            Langganan &amp; Lisensi KosanKu 👑
          </h1>
          <p className="text-sm text-softgray mt-1">
            Kelola paket langganan aktif, pantau kuota kamar &amp; cabang kos, serta arsip kuitansi pembayaran resmi.
          </p>
        </div>

        <button
          onClick={() => handleOpenPayment('pro')}
          className="self-start sm:self-auto py-2.5 px-5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Upgrade / Perpanjang Paket</span>
        </button>
      </div>

      {/* SECTION 1: Active Subscription Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Plan Card */}
        <div className="lg:col-span-1 rounded-3xl bg-gradient-to-br from-peach-500 via-peach-400 to-sakura-400 p-6 text-white shadow-cute relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider">
                {subscription?.status === 'trial' ? 'Masa Percobaan' : 'Paket Aktif'}
              </span>
              <Crown className="w-6 h-6 text-yellow-200" />
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-heading font-black">
                {subscription?.planName || 'Paket Juragan Pro'}
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                Pemilik: {currentUser?.name} ({currentUser?.kosName})
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-white/80 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Berlaku Hingga:
              </span>
              <span className="font-bold">{subscription?.expiresAt || '14 Nov 2026'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Sisa Masa Aktif:
              </span>
              <span className="font-bold bg-white/20 px-2 py-0.5 rounded-lg">
                {subscription?.daysRemaining ?? 14} Hari Lagi
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Siklus Tagihan:
              </span>
              <span className="font-bold capitalize">{subscription?.billingCycle || 'Bulanan'}</span>
            </div>
          </div>
        </div>

        {/* Quota Progress Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quota Kamar */}
          <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-peach-50 text-peach-500 flex items-center justify-center">
                  <DoorOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-softgray">
                  Kuota Kamar
                </span>
              </div>
              <h3 className="text-xl font-heading font-black text-darkcocoa">
                {currentRoomsCount}{' '}
                <span className="text-xs font-normal text-softgray">
                  / {maxRoomsCount >= 999 ? 'Tak Terbatas' : `${maxRoomsCount} Kamar`}
                </span>
              </h3>
              <p className="text-xs text-softgray mt-1">
                {maxRoomsCount >= 999
                  ? 'Bebas tambah kamar tanpa batas limit!'
                  : `${maxRoomsCount - currentRoomsCount} slot kamar tersisa pada paket saat ini.`}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-cream-100">
              <div className="flex justify-between text-[11px] font-bold text-softgray mb-1.5">
                <span>Penggunaan Kapasitas</span>
                <span>{maxRoomsCount >= 999 ? 'Unlimited' : `${roomPercentage}%`}</span>
              </div>
              <div className="w-full h-2.5 bg-cream-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    roomPercentage >= 90 ? 'bg-peach-500' : 'bg-matcha-400'
                  }`}
                  style={{ width: `${maxRoomsCount >= 999 ? 20 : roomPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quota Cabang Kos */}
          <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-matcha-50 text-matcha-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-softgray">
                  Kuota Cabang Kos
                </span>
              </div>
              <h3 className="text-xl font-heading font-black text-darkcocoa">
                {currentPropsCount}{' '}
                <span className="text-xs font-normal text-softgray">
                  / {maxPropsCount >= 999 ? 'Tak Terbatas' : `${maxPropsCount} Cabang`}
                </span>
              </h3>
              <p className="text-xs text-softgray mt-1">
                {maxPropsCount >= 999
                  ? 'Bebas tambah cabang/area kos tanpa batas.'
                  : `${maxPropsCount - currentPropsCount} slot cabang kos tersisa.`}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-cream-100">
              <div className="flex justify-between text-[11px] font-bold text-softgray mb-1.5">
                <span>Penggunaan Kapasitas</span>
                <span>{maxPropsCount >= 999 ? 'Unlimited' : `${propPercentage}%`}</span>
              </div>
              <div className="w-full h-2.5 bg-cream-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    propPercentage >= 90 ? 'bg-peach-500' : 'bg-matcha-400'
                  }`}
                  style={{ width: `${maxPropsCount >= 999 ? 35 : propPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Upgrade & Renewal Catalog */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-2xl font-heading font-black text-darkcocoa">
            Pilihan Paket SaaS KosanKu 🚀
          </h2>
          <p className="text-xs text-softgray">
            Pilih paket yang paling pas dengan skala bisnis kosan Kakak. Transaksi diproses instan dengan simulasi payment gateway.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex p-1 rounded-full bg-cream-100 border border-cream-200">
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
                Hemat 2 Bulan 🔥
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* 1. Paket Kos Mungil */}
          <div className={`p-6 md:p-7 rounded-3xl bg-white border flex flex-col justify-between space-y-6 transition-all ${
            subscription?.plan === 'starter'
              ? 'border-peach-300 ring-2 ring-peach-200'
              : 'border-cream-200 shadow-sm'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-darkcocoa">Paket Kos Mungil</h3>
                  <p className="text-xs text-softgray">Cocok untuk pemula 1 lokasi kos.</p>
                </div>
                {subscription?.plan === 'starter' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-600 text-[10px] font-bold">
                    Paket Kamu
                  </span>
                )}
              </div>

              <div className="pt-2">
                <span className="text-3xl font-heading font-extrabold text-darkcocoa">
                  {billingPeriod === 'monthly' ? 'Rp 49.000' : 'Rp 39.000'}
                </span>
                <span className="text-xs text-softgray"> / bulan</span>
                {billingPeriod === 'annual' && (
                  <p className="text-[11px] text-matcha-600 font-bold mt-0.5">Ditagih Rp 470.000 / tahun</p>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-softgray pt-4 border-t border-cream-100">
                <li className="flex items-center gap-2 text-darkcocoa font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                  <span>Maksimal <strong>1 Cabang Kos</strong></span>
                </li>
                <li className="flex items-center gap-2 text-darkcocoa font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                  <span>Hingga <strong>10 Kamar</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                  <span>Denah Visual Kamar Lengkap</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                  <span>Simulasi Pengingat WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                  <span>Kuitansi Digital Otomatis</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenPayment('starter')}
              className="w-full py-3 rounded-2xl bg-cream-100 hover:bg-peach-50 text-darkcocoa hover:text-peach-600 font-bold text-xs border border-cream-200 transition-all hover:scale-[1.01]"
            >
              {subscription?.plan === 'starter' ? 'Perpanjang Masa Aktif' : 'Pilih Paket Mungil'}
            </button>
          </div>

          {/* 2. Paket Juragan Pro (Highlighted) */}
          <div className="p-6 md:p-7 rounded-3xl bg-white border-2 border-peach-400 shadow-cute flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-peach-500 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-2xl tracking-wider">
              Paling Populer ⭐
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-darkcocoa flex items-center gap-1.5">
                    <span>Paket Juragan Pro</span>
                    <Sparkles className="w-4 h-4 text-peach-500" />
                  </h3>
                  <p className="text-xs text-softgray">Pilihan favorit pengusaha 1-3 lokasi.</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-heading font-black text-peach-500">
                  {billingPeriod === 'monthly' ? 'Rp 99.000' : 'Rp 79.000'}
                </span>
                <span className="text-xs text-softgray"> / bulan</span>
                {billingPeriod === 'annual' && (
                  <p className="text-[11px] text-matcha-600 font-bold mt-0.5">Ditagih Rp 950.000 / tahun</p>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-darkcocoa pt-4 border-t border-cream-100">
                <li className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                  <span>Hingga <strong>3 Cabang / Area Kos</strong></span>
                </li>
                <li className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                  <span>Hingga <strong>50 Kamar</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                  <span>Master Fasilitas &amp; Kelola Lantai</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                  <span>Arsip KTP Penghuni dengan Watermark</span>
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
              onClick={() => handleOpenPayment('pro')}
              className="w-full py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{subscription?.plan === 'pro' ? 'Perpanjang Juragan Pro' : 'Pilih Juragan Pro'}</span>
            </button>
          </div>

          {/* 3. Paket Konglomerat */}
          <div className="p-6 md:p-7 rounded-3xl bg-white border border-cream-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-darkcocoa">Paket Konglomerat</h3>
                <p className="text-xs text-softgray">Untuk bisnis kos skala besar / co-living.</p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-heading font-extrabold text-darkcocoa">
                  {billingPeriod === 'monthly' ? 'Rp 199.000' : 'Rp 159.000'}
                </span>
                <span className="text-xs text-softgray"> / bulan</span>
                {billingPeriod === 'annual' && (
                  <p className="text-[11px] text-matcha-600 font-bold mt-0.5">Ditagih Rp 1.900.000 / tahun</p>
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
                  <span>Prioritas Dukungan Teknis 24/7 VIP</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500 flex-shrink-0" />
                  <span>Backup Database Otomatis Cloud</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenPayment('enterprise')}
              className="w-full py-3 rounded-2xl bg-cream-100 hover:bg-peach-50 text-darkcocoa hover:text-peach-600 font-bold text-xs border border-cream-200 transition-all hover:scale-[1.01]"
            >
              {subscription?.plan === 'enterprise' ? 'Perpanjang Konglomerat' : 'Pilih Konglomerat'}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: SaaS Invoice History Table */}
      <div className="rounded-3xl bg-white border border-cream-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-heading font-extrabold text-darkcocoa flex items-center gap-2">
              <Receipt className="w-5 h-5 text-peach-500" />
              <span>Riwayat Kuitansi &amp; Faktur SaaS</span>
            </h3>
            <p className="text-xs text-softgray">
              Bukti pembayaran resmi langganan software aplikasi KosanKu.
            </p>
          </div>

          <span className="text-xs font-bold text-softgray bg-cream-50 px-3 py-1.5 rounded-xl border border-cream-200 self-start sm:self-auto">
            Total {saasInvoices?.length || 0} Faktur
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cream-200 text-softgray uppercase tracking-wider font-bold">
                <th className="py-3 px-3">No. Faktur</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Paket</th>
                <th className="py-3 px-3">Siklus</th>
                <th className="py-3 px-3">Nominal</th>
                <th className="py-3 px-3">Metode Bayar</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {saasInvoices && saasInvoices.length > 0 ? (
                saasInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-darkcocoa">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-3 text-softgray">{inv.date}</td>
                    <td className="py-3.5 px-3 font-bold text-darkcocoa">{inv.planName}</td>
                    <td className="py-3.5 px-3 text-softgray">{inv.cycle}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-darkcocoa">
                      {inv.amount === 0 ? 'Gratis (Trial)' : `Rp ${inv.amount.toLocaleString('id-ID')}`}
                    </td>
                    <td className="py-3.5 px-3 text-softgray">{inv.paymentMethod}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-matcha-100 text-matcha-600 font-bold text-[11px] flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        Lunas
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="py-1 px-3 rounded-xl bg-peach-50 text-peach-600 hover:bg-peach-100 font-bold transition-colors text-[11px] inline-flex items-center gap-1"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Kuitansi</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-softgray">
                    Belum ada riwayat faktur pembayaran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPlan={selectedPlanForPayment}
        billingCycle={billingPeriod}
      />

      {/* View Printable Receipt Modal */}
      <AnimatePresence>
        {viewingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden p-6 sm:p-8 space-y-6"
            >
              <button
                onClick={() => setViewingInvoice(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-cream-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🐱</span>
                    <h4 className="font-heading font-black text-xl text-peach-500">KosanKu SaaS</h4>
                  </div>
                  <p className="text-[11px] text-softgray">PT KosanKu Digital Nusantara</p>
                  <p className="text-[11px] text-softgray">Dago Asri No. 12, Bandung • support@kosanku.id</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-darkcocoa block">
                    {viewingInvoice.invoiceNumber}
                  </span>
                  <span className="text-[11px] text-softgray">{viewingInvoice.date}</span>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-cream-100">
                  <span className="text-softgray">Pelanggan / Pemilik:</span>
                  <span className="font-bold text-darkcocoa">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-cream-100">
                  <span className="text-softgray">Properti Kos:</span>
                  <span className="font-bold text-darkcocoa">{currentUser?.kosName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-cream-100">
                  <span className="text-softgray">Deskripsi Lisensi:</span>
                  <span className="font-bold text-darkcocoa">
                    Langganan {viewingInvoice.planName} ({viewingInvoice.cycle})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-cream-100">
                  <span className="text-softgray">Metode Pembayaran:</span>
                  <span className="font-bold text-darkcocoa">{viewingInvoice.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-black border-t-2 border-cream-200">
                  <span className="text-darkcocoa">Total Dibayar:</span>
                  <span className="text-peach-500">
                    {viewingInvoice.amount === 0 ? 'Rp 0 (Trial)' : `Rp ${viewingInvoice.amount.toLocaleString('id-ID')}`}
                  </span>
                </div>
              </div>

              {/* Cute Paid Stamp */}
              <div className="p-4 rounded-2xl bg-matcha-50 border border-matcha-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-matcha-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-matcha-800">STATUS: LUNAS TERVERIFIKASI</p>
                    <p className="text-[10px] text-matcha-600">Terima kasih telah mempercayai KosanKu!</p>
                  </div>
                </div>
                <span className="text-2xl">💮</span>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 px-4 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Kuitansi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingInvoice(null)}
                  className="py-2.5 px-5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white text-xs font-bold transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

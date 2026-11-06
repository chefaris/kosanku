'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Wallet,
  AlertCircle,
  TrendingUp,
  MessageCircle,
  Plus,
  FileSpreadsheet,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Send,
  X,
  ExternalLink,
  ChevronRight,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useKosStore, Invoice, Tenant } from '../lib/store/useKosStore';
import { MimiLoader } from '../components/ui/MimiLoader';

export default function DashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const {
    properties,
    activePropertyId,
    setActivePropertyId,
    rooms,
    tenants,
    invoices,
    expenses,
    maintenanceTickets,
    settings,
    currentUser
  } = useKosStore();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const [waModalOpen, setWaModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeProperty = properties.find((p) => p.id === activePropertyId);

  // Filter entities by activePropertyId
  const currentRooms = activePropertyId === 'all'
    ? rooms
    : rooms.filter((r) => r.propertyId === activePropertyId);

  const currentTenants = activePropertyId === 'all'
    ? tenants
    : tenants.filter((t) => t.propertyId === activePropertyId);

  const currentInvoices = activePropertyId === 'all'
    ? invoices
    : invoices.filter((i) => i.propertyId === activePropertyId);

  const currentExpenses = activePropertyId === 'all'
    ? expenses
    : expenses.filter((e) => e.propertyId === activePropertyId);

  const currentTickets = activePropertyId === 'all'
    ? maintenanceTickets
    : maintenanceTickets.filter((t) => t.propertyId === activePropertyId);

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  // --- Dynamic Calculations from Filtered Store ---
  const totalRooms = currentRooms.length;
  const occupiedRooms = currentRooms.filter((r) => r.status === 'occupied').length;
  const vacantRooms = currentRooms.filter((r) => r.status === 'vacant').length;
  const occupancyPercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const collectedRent = currentInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalTargetRent =
    currentInvoices.reduce((sum, inv) => sum + inv.amount, 0) ||
    currentRooms.reduce((sum, r) => sum + r.price, 0);

  const activeTickets = currentTickets.filter((t) => t.status !== 'resolved');
  const urgentTickets = activeTickets.filter((t) => t.priority === 'urgent');

  const totalExpenseAmount = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netCashFlow = collectedRent - totalExpenseAmount;

  // Upcoming dues list (unpaid or overdue invoices)
  const upcomingInvoices = currentInvoices
    .filter((inv) => inv.status !== 'paid')
    .slice(0, 4);

  const candidateInvoices = currentInvoices.filter((inv) => inv.status !== 'paid').length > 0
    ? currentInvoices.filter((inv) => inv.status !== 'paid')
    : currentInvoices;

  const handleOpenWaModal = (invoice?: Invoice) => {
    const inv = invoice || upcomingInvoices[0] || candidateInvoices[0] || currentInvoices[0] || null;
    setSelectedInvoice(inv);
    if (inv) {
      const tenant = tenants.find((t) => t.id === inv.tenantId || t.name === inv.tenantName);
      setRecipientPhone(tenant?.phone || '');
    } else {
      setRecipientPhone('');
    }
    setWaModalOpen(true);
  };

  const handleInvoiceChange = (invId: string) => {
    const inv = currentInvoices.find((i) => i.id === invId) || null;
    setSelectedInvoice(inv);
    if (inv) {
      const tenant = tenants.find((t) => t.id === inv.tenantId || t.name === inv.tenantName);
      setRecipientPhone(tenant?.phone || '');
    }
  };

  const targetProperty = selectedInvoice
    ? properties.find((p) => p.id === selectedInvoice.propertyId)
    : activeProperty;

  const realKosName = targetProperty ? targetProperty.name : (settings.kosName || 'pawskost Living');
  const bankName = targetProperty?.bankName || settings.bankName || 'BCA (Bank Central Asia)';
  const accountNumber = targetProperty?.accountNumber || settings.accountNumber || '-';
  const accountHolder = targetProperty?.accountHolder || settings.accountHolder || targetProperty?.managerName || 'Pengelola Kos';

  const generateWaText = () => {
    if (!selectedInvoice) return '';
    return (
      `Halo Kak ${selectedInvoice.tenantName}! 👋\n\n` +
      `Pemberitahuan tagihan sewa kamar *${selectedInvoice.roomNumber}* di *${realKosName}*:\n\n` +
      `📌 *Rincian Tagihan:*\n` +
      `• Properti: *${realKosName}*\n` +
      `• Kamar: *${selectedInvoice.roomNumber}*\n` +
      `• Periode: *${selectedInvoice.periodMonth}*\n` +
      `• Total Tagihan: *${formatRupiah(selectedInvoice.amount)}*\n` +
      `• Jatuh Tempo: *${selectedInvoice.dueDate}*\n\n` +
      `💳 *Rekening Pembayaran:*\n` +
      `Bank: ${bankName}\n` +
      `No. Rekening: *${accountNumber}*\n` +
      `Atas Nama: *${accountHolder}*\n\n` +
      `Mohon konfirmasi dengan mengirimkan bukti transfer jika pembayaran telah dilakukan. Terima kasih atas kerja samanya dalam menjaga kenyamanan bersama di ${realKosName}! 🙏`
    );
  };

  const handleSendWa = () => {
    if (!selectedInvoice) return;
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '').replace(/^0/, '62');
    if (!cleanPhone || cleanPhone.length < 8) {
      alert('Mohon masukkan nomor WhatsApp penerima yang valid (minimal 8-9 digit).');
      return;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generateWaText())}`;
    window.open(waUrl, '_blank');
    setWaModalOpen(false);

    setToastMessage(`Pesan pengingat WhatsApp siap dikirim ke ${selectedInvoice.tenantName} (${realKosName})!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <MimiLoader message="Menyiapkan data operasional kos..." />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 font-body text-darkcocoa">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-peach-600 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center gap-3 font-semibold text-sm"
          >
            <Sparkles className="w-5 h-5 text-peach-100 animate-spin" strokeWidth={1.75} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Professional Property Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-gradient-to-r from-peach-100/90 via-sakura-50 to-cream-100 rounded-3xl p-4 sm:p-6 md:p-8 border border-peach-200 shadow-sm"
      >
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-peach-600 text-xs font-bold shadow-sm border border-peach-200/60">
              <Building2 className="w-3.5 h-3.5" />
              <span>Dashboard Operasional Properti</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight leading-snug">
              Selamat Datang di <span className="text-peach-600">{activeProperty ? activeProperty.name : (settings.kosName || 'pawskost Living')}</span>
            </h1>
            <p className="text-softgray text-xs sm:text-sm md:text-base leading-relaxed">
              {activeProperty
                ? `Ringkasan operasional area ${activeProperty.name} (${activeProperty.address}). Tipe: ${activeProperty.type}.`
                : 'Ringkasan operasional gabungan seluruh area cabang kosan Anda.'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-matcha-100 text-matcha-700 border border-matcha-200">
                {occupancyPercentage}% Okupansi ({occupiedRooms}/{totalRooms} Terisi)
              </span>
              {activeProperty ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-sakura-100 text-sakura-700 border border-sakura-200">
                  {activeProperty.type} • {activeProperty.floors || 2} Lantai
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-lavender-100 text-lavender-700 border border-lavender-200">
                  Konsolidasi {properties.length} Cabang Aktif
                </span>
              )}
            </div>
          </div>

          {/* Property Overview Card Widget */}
          <div className="relative group flex-shrink-0">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-peach-200/80 shadow-sm flex flex-col justify-between w-64 sm:w-72 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-peach-100 text-peach-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-matcha-100 text-matcha-700 border border-matcha-200">
                  {activeProperty ? activeProperty.type : 'Multi-Cabang'}
                </span>
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-sm text-darkcocoa truncate">
                  {activeProperty ? activeProperty.name : (settings.kosName || 'pawskost Living')}
                </h4>
                <p className="text-[11px] text-softgray truncate mt-0.5">
                  {activeProperty ? activeProperty.address : 'Konsolidasi seluruh unit kosan'}
                </p>
              </div>
              <div className="pt-2 border-t border-cream-100 flex items-center justify-between text-xs">
                <span className="text-softgray font-medium">Pengelola:</span>
                <span className="font-bold text-darkcocoa truncate max-w-[140px]">
                  {activeProperty?.managerName || currentUser?.name || 'Pak Hendra'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4 KPI Cards (Dynamic Calculations & Clickable) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {/* KPI 1: Okupansi Kamar (Clickable -> /rooms) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          onClick={() => router.push('/rooms')}
          className="bg-white rounded-3xl shadow-cute p-5 border-l-4 border-sakura-400 flex flex-col justify-between cursor-pointer group hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softgray group-hover:text-darkcocoa transition-colors">Okupansi Kamar</span>
            <div className="w-10 h-10 rounded-2xl bg-sakura-50 flex items-center justify-center text-sakura-500 group-hover:bg-sakura-100 transition-colors">
              <Building2 className="w-5 h-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-2xl font-extrabold font-heading text-darkcocoa">
              {occupiedRooms}/{totalRooms} Terisi
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-cream-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-sakura-400 h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
            <p className="text-xs text-softgray flex justify-between font-medium">
              <span>{occupancyPercentage}% terisi</span>
              <span className="text-sakura-500 font-bold">{vacantRooms} kosong</span>
            </p>
            <div className="pt-1 flex items-center gap-1 text-[11px] text-sakura-500 font-bold group-hover:translate-x-1 transition-transform">
              <span>Kelola Kamar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>

        {/* KPI 2: Sewa Terkumpul (Clickable -> /billing) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          onClick={() => router.push('/billing')}
          className="bg-white rounded-3xl shadow-cute p-5 border-l-4 border-matcha-400 flex flex-col justify-between cursor-pointer group hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softgray group-hover:text-darkcocoa transition-colors">Sewa Terkumpul</span>
            <div className="w-10 h-10 rounded-2xl bg-matcha-50 flex items-center justify-center text-matcha-500 group-hover:bg-matcha-100 transition-colors">
              <Wallet className="w-5 h-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-2xl font-extrabold font-heading text-darkcocoa">
              {formatRupiah(collectedRent)}
            </div>
            <p className="text-xs text-softgray font-medium">
              dari target {formatRupiah(totalTargetRent)}
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-xs text-matcha-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-matcha-500" />
              <span>
                {totalTargetRent > 0
                  ? `${Math.round((collectedRent / totalTargetRent) * 100)}% tercapai`
                  : '0%'}
              </span>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] text-matcha-600 font-bold group-hover:translate-x-1 transition-transform">
              <span>Buka Tagihan &amp; Kasir</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>

        {/* KPI 3: Keluhan Aktif (Clickable -> /maintenance) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          onClick={() => router.push('/maintenance')}
          className="bg-white rounded-3xl shadow-cute p-5 border-l-4 border-peach-400 flex flex-col justify-between cursor-pointer group hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softgray group-hover:text-darkcocoa transition-colors">Keluhan Fasilitas</span>
            <div className="w-10 h-10 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-500 group-hover:bg-peach-100 transition-colors">
              <AlertCircle className="w-5 h-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-2xl font-extrabold font-heading text-darkcocoa">
              {activeTickets.length} Tiket
            </div>
            <p className="text-xs text-softgray font-medium">
              {urgentTickets.length > 0 ? (
                <span className="text-peach-600 font-bold">
                  {urgentTickets.length} urgent perlu ditangani
                </span>
              ) : (
                'Semua terkendali rapi'
              )}
            </p>
            <div className="pt-2 flex items-center gap-1 text-[11px] text-peach-500 font-bold group-hover:translate-x-1 transition-transform">
              <span>Papan Perawatan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>

        {/* KPI 4: Estimasi Kas Bersih (Clickable -> /finance) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          onClick={() => router.push('/finance')}
          className="bg-white rounded-3xl shadow-cute p-5 border-l-4 border-lavender-400 flex flex-col justify-between cursor-pointer group hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softgray group-hover:text-darkcocoa transition-colors">Estimasi Kas Bersih</span>
            <div className="w-10 h-10 rounded-2xl bg-lavender-50 flex items-center justify-center text-lavender-500 group-hover:bg-lavender-100 transition-colors">
              <TrendingUp className="w-5 h-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-2xl font-extrabold font-heading text-darkcocoa">
              {formatRupiah(netCashFlow)}
            </div>
            <p className="text-xs text-softgray font-medium">
              Total Pengeluaran: {formatRupiah(totalExpenseAmount)}
            </p>
            <div className="pt-2 flex items-center gap-1 text-[11px] text-lavender-600 font-bold group-hover:translate-x-1 transition-transform">
              <span>Laporan Keuangan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1"
      >
        <button
          onClick={() => handleOpenWaModal()}
          className="w-full sm:w-auto justify-center bg-peach-500 hover:bg-peach-400 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-cute flex items-center gap-2 transition-all transform active:scale-95"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
          <span>Kirim Pengingat WA</span>
        </button>

        <Link
          href="/rooms"
          className="flex-1 sm:flex-none justify-center bg-sakura-100 hover:bg-sakura-200 text-darkcocoa px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 transition-all border border-sakura-200"
        >
          <Plus className="w-4 h-4 text-peach-500 flex-shrink-0" strokeWidth={2.5} />
          <span className="whitespace-nowrap">Tambah Kamar</span>
        </Link>

        <Link
          href="/finance"
          className="flex-1 sm:flex-none justify-center bg-white hover:bg-cream-100 text-darkcocoa px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 transition-all border border-cream-200"
        >
          <FileSpreadsheet className="w-4 h-4 text-softgray flex-shrink-0" strokeWidth={1.75} />
          <span className="whitespace-nowrap">Catat Kas</span>
        </Link>
      </motion.div>

      {/* Section: Ringkasan Antar Cabang Kos (Tampil saat mode Semua Cabang aktif) */}
      {activePropertyId === 'all' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4 pt-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-peach-500" strokeWidth={1.75} />
              <h2 className="text-xl font-heading font-extrabold text-darkcocoa">
                Performa Antar Cabang Kos
              </h2>
            </div>
            <span className="text-xs text-softgray font-medium">
              {properties.length} Cabang Terdaftar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((prop) => {
              const propRooms = rooms.filter((r) => r.propertyId === prop.id);
              const propOccupied = propRooms.filter((r) => r.status === 'occupied').length;
              const propPct = propRooms.length > 0 ? Math.round((propOccupied / propRooms.length) * 100) : 0;
              const propIncome = invoices
                .filter((inv) => inv.propertyId === prop.id && inv.status === 'paid')
                .reduce((s, i) => s + i.amount, 0);
              const propTickets = maintenanceTickets.filter(
                (t) => t.propertyId === prop.id && t.status !== 'resolved'
              ).length;

              return (
                <div
                  key={prop.id}
                  className="bg-white rounded-3xl p-5 shadow-cute border border-cream-200 hover:border-peach-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                          {prop.name}
                        </h3>
                        <p className="text-[11px] text-softgray line-clamp-1">{prop.address}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-600 border border-peach-200 flex-shrink-0">
                        {prop.type}
                      </span>
                    </div>

                    {/* Occupancy bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-softgray">Okupansi:</span>
                        <span className="text-darkcocoa font-bold">
                          {propOccupied}/{propRooms.length} ({propPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-cream-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-matcha-400 h-2 rounded-full"
                          style={{ width: `${propPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                      <div className="bg-cream-50 p-2.5 rounded-2xl border border-cream-100">
                        <span className="text-[10px] text-softgray block">Sewa Terkumpul</span>
                        <span className="font-bold text-darkcocoa text-xs">{formatRupiah(propIncome)}</span>
                      </div>
                      <div className="bg-cream-50 p-2.5 rounded-2xl border border-cream-100">
                        <span className="text-[10px] text-softgray block">Keluhan Aktif</span>
                        <span className="font-bold text-peach-600 text-xs">{propTickets} Tiket</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePropertyId(prop.id)}
                    className="w-full py-2.5 rounded-2xl bg-peach-50 hover:bg-peach-500 hover:text-white text-peach-600 font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Kelola Cabang Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Section: Jatuh Tempo Terdekat */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 pt-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-peach-500" strokeWidth={1.75} />
            <h2 className="text-xl font-heading font-extrabold text-darkcocoa">
              Tagihan &amp; Jatuh Tempo Terdekat
            </h2>
          </div>
          <Link
            href="/billing"
            className="text-xs sm:text-sm font-bold text-peach-500 hover:text-peach-600 flex items-center gap-1 group"
          >
            <span>Semua Tagihan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {upcomingInvoices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingInvoices.map((inv) => (
              <motion.div
                key={inv.id}
                whileHover={{ y: -3 }}
                className={`bg-white rounded-3xl p-5 shadow-cute border transition-all flex flex-col justify-between ${
                  inv.status === 'overdue' ? 'border-peach-400 bg-peach-50/30' : 'border-cream-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-extrabold text-sm text-darkcocoa px-2 py-0.5 rounded-lg bg-cream-100">
                      {inv.roomNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === 'overdue'
                          ? 'bg-peach-100 text-peach-600 border border-peach-300'
                          : 'bg-sakura-100 text-sakura-600 border border-sakura-200'
                      }`}
                    >
                      {inv.status === 'overdue' ? 'Jatuh Tempo!' : 'Belum Bayar'}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-darkcocoa truncate">
                    {inv.tenantName}
                  </h3>

                  <div className="mt-3 pt-2 border-t border-cream-100 space-y-1 text-xs">
                    <div className="flex justify-between text-softgray">
                      <span>Tarif Sewa:</span>
                      <span className="font-bold text-darkcocoa">{formatRupiah(inv.amount)}</span>
                    </div>
                    <div className="flex justify-between text-softgray">
                      <span>Jatuh Tempo:</span>
                      <span className="font-bold text-peach-600">{inv.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cream-100">
                  <button
                    onClick={() => handleOpenWaModal(inv)}
                    className="w-full bg-peach-50 hover:bg-peach-100 text-peach-600 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-peach-200"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Kirim WA Pengingat</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-3xl border border-cream-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-matcha-500 mx-auto" />
            <p className="font-bold text-darkcocoa">Semua tagihan sewa bulan ini sudah lunas!</p>
            <p className="text-xs text-softgray">Tidak ada tagihan tertunggak saat ini.</p>
          </div>
        )}
      </motion.div>

      {/* Professional WA Reminder Modal */}
      {waModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-6 max-w-lg w-full space-y-4 font-body animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-darkcocoa text-base leading-tight">
                    Kirim Pengingat Tagihan WhatsApp
                  </h3>
                  <p className="text-[11px] text-softgray">Pemberitahuan resmi dan santun untuk penyewa</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWaModalOpen(false)}
                className="text-softgray hover:text-darkcocoa p-1 rounded-lg transition-colors"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Dropdown Selector: Pilih Tagihan / Penyewa */}
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Pilih Penyewa / Tagihan:
                </label>
                <select
                  value={selectedInvoice.id}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs font-semibold text-darkcocoa focus:outline-none focus:ring-2 focus:ring-peach-500 shadow-2xs"
                >
                  {candidateInvoices.map((inv) => {
                    const invProp = properties.find((p) => p.id === inv.propertyId);
                    return (
                      <option key={inv.id} value={inv.id}>
                        {inv.tenantName} — Kamar {inv.roomNumber} ({formatRupiah(inv.amount)}) • {invProp?.name || realKosName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Info Ringkas Properti Riil & Penerima */}
              <div className="bg-peach-50/70 p-3.5 rounded-2xl border border-peach-200/80 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-softgray font-medium">Properti Kos:</span>
                  <span className="font-extrabold text-peach-600 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {realKosName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-softgray font-medium">Penyewa &amp; Unit:</span>
                  <span className="font-bold text-darkcocoa">
                    {selectedInvoice.tenantName} ({selectedInvoice.roomNumber})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-softgray font-medium">Periode &amp; Jatuh Tempo:</span>
                  <span className="font-medium text-darkcocoa">
                    {selectedInvoice.periodMonth} • <span className="font-bold text-peach-600">{selectedInvoice.dueDate}</span>
                  </span>
                </div>
              </div>

              {/* Input Nomor WhatsApp Tujuan */}
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Nomor WhatsApp Tujuan:
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2 pl-9 text-xs font-semibold text-darkcocoa focus:outline-none focus:ring-2 focus:ring-peach-500 shadow-2xs"
                  />
                  <Phone className="w-4 h-4 text-softgray absolute left-3 top-2.5" />
                </div>
                <p className="text-[10px] text-softgray mt-1">
                  Nomor otomatis sinkron dari database penyewa. Anda dapat menyesuaikannya bila nomor kontak berganti.
                </p>
              </div>

              {/* Pratinjau Pesan WA Resmi */}
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Pratinjau Pesan Santun Otomatis:
                </label>
                <div className="bg-white border border-cream-200 rounded-2xl p-3.5 text-xs text-darkcocoa leading-relaxed shadow-inner space-y-2 font-sans">
                  <p>
                    Halo Kak <strong>{selectedInvoice.tenantName}</strong>! 👋
                  </p>
                  <p>
                    Pemberitahuan tagihan sewa kamar <strong>{selectedInvoice.roomNumber}</strong> di <strong>{realKosName}</strong>:
                  </p>
                  <div className="p-2.5 rounded-xl bg-cream-50 text-[11px] space-y-0.5 border border-cream-100">
                    <p>• Properti: <strong>{realKosName}</strong></p>
                    <p>• Kamar: <strong>{selectedInvoice.roomNumber}</strong></p>
                    <p>• Periode: <strong>{selectedInvoice.periodMonth}</strong></p>
                    <p>• Total Tagihan: <strong className="text-peach-600">{formatRupiah(selectedInvoice.amount)}</strong></p>
                    <p>• Jatuh Tempo: <strong>{selectedInvoice.dueDate}</strong></p>
                  </div>
                  <div className="text-[11px] pt-1 border-t border-cream-100 text-softgray">
                    💳 Pembayaran dapat ditransfer ke:
                    <br />
                    <strong>{bankName}</strong>: <strong>{accountNumber}</strong> (a.n <strong>{accountHolder}</strong>)
                    <br />
                    <span className="text-darkcocoa/80 italic mt-1 block">
                      Mohon konfirmasi dengan mengirimkan bukti transfer jika pembayaran telah dilakukan. Terima kasih atas kerja samanya dalam menjaga kenyamanan bersama di {realKosName}! 🙏
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-cream-100">
              <button
                type="button"
                onClick={() => setWaModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-softgray hover:bg-cream-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSendWa}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Buka WhatsApp &amp; Kirim</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

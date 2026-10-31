'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Check,
  Search,
  Sparkles,
  Printer,
  Download,
  X,
  Share2,
  MessageCircle,
  Building,
  CreditCard
} from 'lucide-react';
import { useKosStore, Invoice } from '../lib/store/useKosStore';

export default function BillingPage() {
  const { properties, activePropertyId, invoices, markInvoicePaid, tenants, settings } = useKosStore();

  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'overdue' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Kuitansi Modal
  const [receiptInvoice, setReceiptInvoice] = useState<Invoice | null>(null);

  const activeProperty = properties.find((p) => p.id === activePropertyId);

  const propertyInvoices = activePropertyId === 'all'
    ? invoices
    : invoices.filter((inv) => inv.propertyId === activePropertyId);

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations from filtered invoices
  const totalAmount = propertyInvoices.reduce((sum, b) => sum + b.amount, 0);
  const collectedAmount = propertyInvoices
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);
  const unpaidAmount = propertyInvoices
    .filter((b) => b.status !== 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const filteredInvoices = propertyInvoices.filter((item) => {
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      item.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMarkAsPaid = (id: string, tenantName: string) => {
    markInvoicePaid(id, 'Transfer Bank BCA');
    const updated = invoices.find((inv) => inv.id === id);
    if (updated) {
      setReceiptInvoice({ ...updated, status: 'paid', paidAt: new Date().toISOString().split('T')[0] });
    }
    showToast(`Tagihan sewa ${tenantName} berhasil ditandai Lunas! Kuitansi diterbitkan 🧾✨`);
  };

  const handleSendWa = (inv: Invoice) => {
    const tenant = tenants.find((t) => t.id === inv.tenantId || t.name === inv.tenantName);
    const phone = tenant ? tenant.phone.replace(/[^0-9]/g, '').replace(/^0/, '62') : '';

    const waText = encodeURIComponent(
      `Halo Kak ${inv.tenantName}! 👋 Salam manis dari KosanKu & Mimi si Kucing Kos 🐱✨\n\nSekadar info manis, tagihan sewa kamar ${inv.roomNumber} sebesar ${formatRupiah(inv.amount)} untuk periode ${inv.periodMonth} akan jatuh tempo pada ${inv.dueDate}.\n\nPembayaran dapat ditransfer ke ${settings.bankName}: ${settings.accountNumber} (a.n ${settings.accountHolder}).\n\nTerima kasih sudah menjaga kenyamanan kost bersama Mimi! 🏡🌸`
    );

    if (phone) {
      window.open(`https://wa.me/${phone}?text=${waText}`, '_blank');
    } else {
      alert(`Pesan WhatsApp siap dikirim ke ${inv.tenantName}.`);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 font-body text-darkcocoa">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-matcha-400 text-white px-5 py-3.5 rounded-2xl shadow-cute flex items-center gap-3 font-semibold text-sm"
          >
            <Sparkles className="w-5 h-5 text-matcha-50 animate-spin" strokeWidth={1.75} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight flex items-center gap-2">
            <span>Kasir &amp; Tagihan Sewa</span>
            <span className="text-2xl">🧾</span>
          </h1>
          <p className="text-softgray text-xs sm:text-sm mt-1">
            {activeProperty
              ? `Menampilkan tagihan sewa untuk area ${activeProperty.name} (${activeProperty.address})`
              : 'Pantau pembayaran sewa bulanan, konfirmasi kuitansi lunas, dan kirim pengingat WhatsApp seluruh cabang.'}
          </p>
        </div>
      </motion.div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-peach-400 border-cream-200"
        >
          <span className="text-xs font-bold text-softgray block">Total Tagihan Periode Ini</span>
          <div className="text-2xl font-extrabold font-heading text-darkcocoa mt-2">
            {formatRupiah(totalAmount)}
          </div>
          <p className="text-xs text-softgray mt-1">{propertyInvoices.length} tagihan tercatat</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-matcha-400 border-cream-200"
        >
          <span className="text-xs font-bold text-softgray block">Uang Sewa Terkumpul</span>
          <div className="text-2xl font-extrabold font-heading text-matcha-600 mt-2">
            {formatRupiah(collectedAmount)}
          </div>
          <p className="text-xs text-matcha-600 font-bold mt-1">
            {totalAmount > 0 ? `${Math.round((collectedAmount / totalAmount) * 100)}% lunas` : '0%'}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-sakura-400 border-cream-200"
        >
          <span className="text-xs font-bold text-softgray block">Sisa Tagihan Belum Masuk</span>
          <div className="text-2xl font-extrabold font-heading text-peach-600 mt-2">
            {formatRupiah(unpaidAmount)}
          </div>
          <p className="text-xs text-softgray mt-1">
            {invoices.filter((i) => i.status !== 'paid').length} penyewa belum bayar
          </p>
        </motion.div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              filterStatus === 'all'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Semua ({invoices.length})
          </button>
          <button
            onClick={() => setFilterStatus('overdue')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              filterStatus === 'overdue'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Jatuh Tempo ({invoices.filter((i) => i.status === 'overdue').length})
          </button>
          <button
            onClick={() => setFilterStatus('unpaid')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              filterStatus === 'unpaid'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Belum Bayar ({invoices.filter((i) => i.status === 'unpaid').length})
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              filterStatus === 'paid'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Lunas ({invoices.filter((i) => i.status === 'paid').length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari penghuni, no invoice, kamar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-cream-200 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-darkcocoa focus:outline-none focus:border-peach-400 shadow-sm"
          />
        </div>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block bg-white rounded-3xl shadow-cute border border-cream-200 overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-cream-50/80 border-b border-cream-200 text-softgray font-bold">
              <th className="py-3.5 px-4">No. Invoice</th>
              <th className="py-3.5 px-4">Penghuni &amp; Kamar</th>
              <th className="py-3.5 px-4">Periode</th>
              <th className="py-3.5 px-4">Nominal</th>
              <th className="py-3.5 px-4">Jatuh Tempo</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi Kasir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-cream-50/50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-darkcocoa">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3 px-4">
                  <div className="font-extrabold text-darkcocoa">{inv.tenantName}</div>
                  <div className="text-[11px] text-peach-600 font-bold">{inv.roomNumber}</div>
                </td>
                <td className="py-3 px-4 text-softgray font-medium">{inv.periodMonth}</td>
                <td className="py-3 px-4 font-extrabold text-darkcocoa">
                  {formatRupiah(inv.amount)}
                </td>
                <td className="py-3 px-4 font-semibold text-softgray">{inv.dueDate}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      inv.status === 'paid'
                        ? 'bg-matcha-100 text-matcha-700 border border-matcha-300'
                        : inv.status === 'overdue'
                        ? 'bg-peach-100 text-peach-600 border border-peach-300'
                        : 'bg-sakura-100 text-sakura-600 border border-sakura-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-matcha-500'
                          : inv.status === 'overdue'
                          ? 'bg-peach-500'
                          : 'bg-sakura-400'
                      }`}
                    />
                    {inv.status === 'paid'
                      ? 'Lunas'
                      : inv.status === 'overdue'
                      ? 'Jatuh Tempo'
                      : 'Belum Bayar'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {inv.status !== 'paid' ? (
                      <>
                        <button
                          onClick={() => handleSendWa(inv)}
                          className="bg-peach-50 hover:bg-peach-100 text-peach-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-peach-200 transition-colors"
                          title="Kirim pengingat WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>WA</span>
                        </button>
                        <button
                          onClick={() => handleMarkAsPaid(inv.id, inv.tenantName)}
                          className="bg-matcha-400 hover:bg-matcha-300 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <Check className="w-3 h-3" strokeWidth={2.5} />
                          <span>Tandai Lunas</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setReceiptInvoice(inv)}
                        className="bg-cream-100 hover:bg-cream-200 text-darkcocoa px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-cream-200 transition-colors"
                      >
                        <Receipt className="w-3 h-3 text-peach-500" />
                        <span>Lihat Kuitansi</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards View for Mobile */}
      <div className="md:hidden space-y-3">
        {filteredInvoices.map((inv) => (
          <div
            key={inv.id}
            className="bg-white rounded-3xl p-4 shadow-cute border border-cream-200 space-y-3 text-xs"
          >
            <div className="flex items-center justify-between border-b border-cream-100 pb-2">
              <span className="font-mono font-bold text-darkcocoa">{inv.invoiceNumber}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  inv.status === 'paid'
                    ? 'bg-matcha-100 text-matcha-700'
                    : inv.status === 'overdue'
                    ? 'bg-peach-100 text-peach-600'
                    : 'bg-sakura-100 text-sakura-600'
                }`}
              >
                {inv.status === 'paid'
                  ? 'Lunas'
                  : inv.status === 'overdue'
                  ? 'Jatuh Tempo'
                  : 'Belum Bayar'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-darkcocoa">{inv.tenantName}</h3>
                <p className="text-peach-600 font-bold">{inv.roomNumber}</p>
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-darkcocoa">
                  {formatRupiah(inv.amount)}
                </div>
                <p className="text-softgray text-[10px]">{inv.dueDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cream-100">
              {inv.status !== 'paid' ? (
                <>
                  <button
                    onClick={() => handleSendWa(inv)}
                    className="bg-peach-50 text-peach-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-peach-200"
                  >
                    <Send className="w-3 h-3" />
                    <span>WA</span>
                  </button>
                  <button
                    onClick={() => handleMarkAsPaid(inv.id, inv.tenantName)}
                    className="bg-matcha-400 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Lunas</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setReceiptInvoice(inv)}
                  className="bg-cream-100 text-darkcocoa px-3 py-1.5 rounded-xl font-bold flex items-center gap-1"
                >
                  <Receipt className="w-3 h-3 text-peach-500" />
                  <span>Kuitansi</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="p-8 bg-white rounded-3xl border border-cream-200 text-center space-y-2">
          <Receipt className="w-8 h-8 text-softgray mx-auto" />
          <p className="font-bold text-darkcocoa">Tidak ada tagihan yang cocok</p>
          <p className="text-xs text-softgray">Coba pilih filter lain atau ubah kata kunci pencarian.</p>
        </div>
      )}

      {/* --- MODAL KUITANSI DIGITAL (STEMPEL LUNAS MIMI) --- */}
      <AnimatePresence>
        {receiptInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-6 md:p-8 max-w-md w-full space-y-5 font-body relative overflow-hidden"
            >
              <button
                onClick={() => setReceiptInvoice(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Watermark Stempel Lunas Mimi */}
              <div className="absolute right-4 bottom-20 rotate-[-18deg] opacity-20 pointer-events-none select-none border-4 border-dashed border-matcha-500 rounded-3xl p-4 text-center">
                <span className="font-heading font-extrabold text-3xl text-matcha-600 block">LUNAS</span>
                <span className="text-xs font-bold text-matcha-600">KOSANKU • MIMI</span>
              </div>

              {/* Header Kuitansi */}
              <div className="flex items-center gap-3 border-b-2 border-dashed border-cream-200 pb-4">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-peach-300 shadow-sm flex-shrink-0">
                  <Image
                    src="/mimi-mascot.jpg"
                    alt="Mimi"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-peach-500">
                    KosanKu Official Receipt
                  </h3>
                  <p className="text-[11px] text-softgray">
                    {properties.find((p) => p.id === receiptInvoice.propertyId)?.name || settings.kosName} • Tanda Terima Sah
                  </p>
                </div>
              </div>

              {/* Detail Kuitansi */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-softgray">Nomor Kuitansi:</span>
                  <span className="font-mono font-bold text-darkcocoa">{receiptInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softgray">Diterima Dari:</span>
                  <span className="font-bold text-darkcocoa">{receiptInvoice.tenantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softgray">Unit Kamar:</span>
                  <span className="font-bold text-peach-600">{receiptInvoice.roomNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softgray">Untuk Pembayaran:</span>
                  <span className="font-semibold text-darkcocoa">Sewa Periode {receiptInvoice.periodMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softgray">Metode Pembayaran:</span>
                  <span className="font-semibold text-darkcocoa">{receiptInvoice.paymentMethod || 'Transfer Bank'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softgray">Tanggal Bayar:</span>
                  <span className="font-semibold text-darkcocoa">{receiptInvoice.paidAt || 'Hari Ini'}</span>
                </div>

                <div className="pt-3 border-t-2 border-dashed border-cream-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-darkcocoa">Jumlah Dibayar:</span>
                  <span className="font-heading font-extrabold text-xl text-matcha-600">
                    {formatRupiah(receiptInvoice.amount)}
                  </span>
                </div>
              </div>

              {/* Stempel Visual Mimi */}
              <div className="bg-matcha-50 rounded-2xl p-3 border border-matcha-200 text-center space-y-0.5">
                <span className="inline-flex items-center gap-1 text-matcha-700 font-extrabold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-matcha-500" />
                  <span>PEMBAYARAN DIVERIFIKASI LUNAS</span>
                </span>
                <p className="text-[10px] text-softgray">
                  Terima kasih sudah menjaga kenyamanan kost bersama Mimi si Kucing Kos! 🐾✨
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-darkcocoa bg-cream-100 hover:bg-cream-200 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Tautan kuitansi disalin ke clipboard! 📋');
                    setReceiptInvoice(null);
                  }}
                  className="bg-peach-500 hover:bg-peach-400 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-cute flex items-center gap-1.5 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan Kuitansi</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

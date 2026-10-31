'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Users,
  Wifi,
  Droplets,
  Wrench,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { useKosStore, Expense } from '../lib/store/useKosStore';

export default function FinancePage() {
  const { properties, activePropertyId, invoices, expenses, addExpense, deleteExpense } = useKosStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeProperty = properties.find((p) => p.id === activePropertyId);

  // Form state
  const [targetPropertyId, setTargetPropertyId] = useState(
    activePropertyId !== 'all' ? activePropertyId : (properties[0]?.id || 'prop-1')
  );
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<Expense['category']>('listrik');
  const [expenseAmount, setExpenseAmount] = useState(150000);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseNotes, setExpenseNotes] = useState('');

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered lists
  const propertyInvoices = activePropertyId === 'all'
    ? invoices
    : invoices.filter((i) => i.propertyId === activePropertyId);

  const propertyExpenses = activePropertyId === 'all'
    ? expenses
    : expenses.filter((e) => e.propertyId === activePropertyId);

  // Dynamic calculations from filtered store
  const totalIncome = propertyInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalExpense = propertyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netCashFlow = totalIncome - totalExpense;

  const handleSaveAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || expenseAmount <= 0) return;

    addExpense({
      propertyId: targetPropertyId,
      title: expenseTitle.trim(),
      category: expenseCategory,
      amount: Number(expenseAmount),
      date: expenseDate,
      notes: expenseNotes.trim() || undefined
    });

    setIsAddModalOpen(false);
    setExpenseTitle('');
    setExpenseAmount(150000);
    showToast(`Pengeluaran "${expenseTitle}" berhasil dicatat ke buku kas! 📝✨`);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Cabang', 'Kategori', 'Keterangan', 'Tanggal', 'Nominal (Rp)'];
    const rows = propertyExpenses.map((e) => [
      e.id,
      properties.find((p) => p.id === e.propertyId)?.name || 'Semua Cabang',
      e.category.toUpperCase(),
      `"${e.title}"`,
      e.date,
      e.amount
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Kas_KosanKu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Laporan CSV berhasil diunduh ke perangkat Anda! 📊');
  };

  const getCategoryIcon = (cat: Expense['category']) => {
    switch (cat) {
      case 'listrik':
        return <Zap className="w-4 h-4 text-peach-500" />;
      case 'gaji':
        return <Users className="w-4 h-4 text-sakura-500" />;
      case 'internet':
        return <Wifi className="w-4 h-4 text-matcha-500" />;
      case 'air':
        return <Droplets className="w-4 h-4 text-lavender-500" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-peach-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-softgray" />;
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 font-body text-darkcocoa">
      {/* Toast Notification */}
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight">
            Arus Kas &amp; Pembukuan
          </h1>
          <p className="text-softgray text-xs sm:text-sm mt-1">
            {activeProperty
              ? `Laporan arus kas dan operasional untuk area ${activeProperty.name}`
              : 'Rekap pendapatan sewa kamar, pengeluaran listrik, gaji, dan estimasi laba bersih seluruh cabang.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none justify-center bg-peach-500 hover:bg-peach-400 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-cute flex items-center gap-1.5 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="whitespace-nowrap">Catat Pengeluaran</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none justify-center bg-white hover:bg-cream-100 text-darkcocoa px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-1.5 transition-all border border-cream-200"
          >
            <Download className="w-4 h-4 text-peach-500" strokeWidth={2} />
            <span className="whitespace-nowrap">Export CSV</span>
          </button>
        </div>
      </motion.div>

      {/* Summary 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-matcha-400 border-cream-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softgray">Total Pemasukan Sewa</span>
            <div className="w-9 h-9 rounded-2xl bg-matcha-50 flex items-center justify-center text-matcha-500">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-heading text-matcha-600 mt-3">
            {formatRupiah(totalIncome)}
          </div>
          <p className="text-xs text-softgray mt-1">Dari tagihan sewa berstatus lunas</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-peach-400 border-cream-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softgray">Total Beban Operasional</span>
            <div className="w-9 h-9 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-500">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-heading text-peach-600 mt-3">
            {formatRupiah(totalExpense)}
          </div>
          <p className="text-xs text-softgray mt-1">{expenses.length} pos biaya tercatat</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-lavender-400 border-cream-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softgray">Estimasi Kas Bersih</span>
            <div className="w-9 h-9 rounded-2xl bg-lavender-50 flex items-center justify-center text-lavender-500">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-heading text-darkcocoa mt-3">
            {formatRupiah(netCashFlow)}
          </div>
          <p className="text-xs text-softgray mt-1">Pemasukan dikurangi seluruh operasional</p>
        </motion.div>
      </div>

      {/* Expense Breakdown List */}
      <div className="bg-white rounded-3xl p-6 shadow-cute border border-cream-200 space-y-4">
        <div className="flex items-center justify-between border-b border-cream-100 pb-3">
          <h2 className="font-heading font-extrabold text-lg text-darkcocoa">
            Rincian Pos Pengeluaran Operasional
          </h2>
          <span className="text-xs text-softgray font-semibold">
            Total {propertyExpenses.length} Transaksi
          </span>
        </div>

        <div className="divide-y divide-cream-100">
          {propertyExpenses.map((exp) => (
            <div
              key={exp.id}
              className="py-3.5 flex items-center justify-between hover:bg-cream-50/50 px-2 rounded-2xl transition-colors text-xs"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                <div className="w-10 h-10 rounded-2xl bg-cream-100 flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(exp.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-darkcocoa text-xs sm:text-sm truncate">{exp.title}</h3>
                  <p className="text-softgray text-[10px] sm:text-[11px] capitalize truncate">
                    Kategori: {exp.category} • {exp.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-heading font-extrabold text-sm text-peach-600">
                  - {formatRupiah(exp.amount)}
                </span>
                <button
                  onClick={() => {
                    if (confirm(`Hapus pengeluaran "${exp.title}"?`)) {
                      deleteExpense(exp.id);
                      showToast('Pos pengeluaran dihapus.');
                    }
                  }}
                  className="p-1 text-softgray hover:text-peach-500 rounded-lg transition-colors"
                  title="Hapus Pengeluaran"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL TAMBAH PENGELUARAN --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-6 max-w-md w-full space-y-4 font-body"
            >
              <div className="flex items-center justify-between border-b border-cream-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-peach-100 flex items-center justify-center text-peach-500">
                    <Plus className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                      Catat Pengeluaran Kas
                    </h3>
                    <p className="text-xs text-softgray">Input biaya listrik, internet, gaji, atau perbaikan</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAddExpense} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Keterangan Pengeluaran</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Token listrik pompa air & wifi"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Kategori</label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as Expense['category'])}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-semibold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                    >
                      <option value="listrik">Listrik & Token</option>
                      <option value="gaji">Gaji Penjaga / Kebersihan</option>
                      <option value="internet">Internet Fiber</option>
                      <option value="air">Air PDAM</option>
                      <option value="maintenance">Perawatan / AC</option>
                      <option value="lainnya">Lain-lain</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Nominal (Rp)</label>
                    <input
                      type="number"
                      step={10000}
                      required
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(Number(e.target.value))}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-softgray hover:bg-cream-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-peach-500 hover:bg-peach-400 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-cute"
                  >
                    Simpan Pengeluaran
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

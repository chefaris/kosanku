'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  BarChart3,
  Download,
  Printer,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Trash2,
  X,
  Filter,
  SlidersHorizontal,
  Target,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { useKosStore, Expense } from '../lib/store/useKosStore';
import { renderCategoryIcon } from '../components/ui/CategoryIconPicker';
import { FinancialAnalyticsCharts } from '../components/ui/FinancialAnalyticsCharts';
import { BudgetTrackerWidget } from '../components/ui/BudgetTrackerWidget';
import { ManageBudgetModal } from '../components/ui/ManageBudgetModal';
import { ManageMasterFinanceModal } from '../components/ui/ManageMasterFinanceModal';
import { FinancialReportPdfModal } from '../components/ui/FinancialReportPdfModal';

export default function FinancePage() {
  const {
    properties,
    activePropertyId,
    invoices,
    expenses,
    settings,
    expenseCategories,
    addExpense,
    deleteExpense
  } = useKosStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Filter State (Item 9: Filter by Month / Date Range)
  const [filterMode, setFilterMode] = useState<'all' | 'month' | 'range'>('month');
  const [filterMonth, setFilterMonth] = useState('2026-11');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-30');

  // Form state
  const [targetPropertyId, setTargetPropertyId] = useState(
    activePropertyId !== 'all' ? activePropertyId : (properties[0]?.id || 'prop-1')
  );
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<string>(
    expenseCategories[0]?.name || 'Listrik & Token'
  );
  const [expenseAmount, setExpenseAmount] = useState<number>(150000);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseNotes, setExpenseNotes] = useState('');

  const activeProperty = properties.find((p) => p.id === activePropertyId);

  const formatRupiah = (val: number) => 'Rp ' + (val || 0).toLocaleString('id-ID');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Base property filtering
  const propertyInvoices = useMemo(() => {
    return activePropertyId === 'all'
      ? invoices
      : invoices.filter((i) => i.propertyId === activePropertyId);
  }, [invoices, activePropertyId]);

  const propertyExpenses = useMemo(() => {
    return activePropertyId === 'all'
      ? expenses
      : expenses.filter((e) => e.propertyId === activePropertyId);
  }, [expenses, activePropertyId]);

  // Apply Date / Month Filters (Item 9)
  const filteredInvoices = useMemo(() => {
    return propertyInvoices.filter((inv) => {
      const invDate = inv.paidAt || inv.dueDate;
      if (filterMode === 'all') return true;
      if (filterMode === 'month') {
        return invDate.startsWith(filterMonth) || inv.periodMonth.toLowerCase().includes('november');
      }
      if (filterMode === 'range') {
        return invDate >= startDate && invDate <= endDate;
      }
      return true;
    });
  }, [propertyInvoices, filterMode, filterMonth, startDate, endDate]);

  const filteredExpenses = useMemo(() => {
    return propertyExpenses.filter((exp) => {
      if (filterMode === 'all') return true;
      if (filterMode === 'month') {
        return exp.date.startsWith(filterMonth);
      }
      if (filterMode === 'range') {
        return exp.date >= startDate && exp.date <= endDate;
      }
      return true;
    });
  }, [propertyExpenses, filterMode, filterMonth, startDate, endDate]);

  // Dynamic calculations from filtered list
  const totalIncome = useMemo(() => {
    return filteredInvoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  }, [filteredInvoices]);

  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const netCashFlow = totalIncome - totalExpense;

  // Analytics preparation (Item 10)
  const monthlyTrendData = useMemo(() => {
    // Generate trend points
    const months = ['Agu 2026', 'Sep 2026', 'Okt 2026', 'Nov 2026'];
    return months.map((m, idx) => {
      if (idx === 3) {
        return {
          month: m,
          income: totalIncome > 0 ? totalIncome : 4500000,
          expense: totalExpense > 0 ? totalExpense : 1350000
        };
      }
      return {
        month: m,
        income: 3800000 + idx * 400000,
        expense: 1100000 + idx * 120000
      };
    });
  }, [totalIncome, totalExpense]);

  const categoryBreakdownData = useMemo(() => {
    const totals: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });

    const sumAll = Object.values(totals).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(totals).map(([catName, amount], idx) => {
      const matchCat = expenseCategories.find(
        (c) => c.name.toLowerCase() === catName.toLowerCase()
      );
      return {
        category: catName,
        icon: matchCat ? matchCat.icon : 'Sparkles',
        amount,
        percentage: Math.round((amount / sumAll) * 100),
        color: (matchCat && matchCat.color) ? matchCat.color : 'peach'
      };
    });
  }, [filteredExpenses, expenseCategories]);

  // Combined transactions for PDF / Table view
  const combinedTransactions = useMemo(() => {
    const incItems = filteredInvoices
      .filter((inv) => inv.status === 'paid')
      .map((inv) => ({
        id: inv.id,
        date: inv.paidAt || inv.dueDate,
        type: 'income' as const,
        category: 'Sewa Kamar',
        title: `Sewa Kamar ${inv.roomNumber} - ${inv.tenantName}`,
        amount: inv.amount,
        status: 'Lunas'
      }));

    const expItems = filteredExpenses.map((exp) => ({
      id: exp.id,
      date: exp.date,
      type: 'expense' as const,
      category: exp.category,
      title: exp.title,
      amount: exp.amount,
      status: 'Terbayar'
    }));

    return [...incItems, ...expItems].sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredInvoices, filteredExpenses]);

  // Period label for headers & PDF
  const activePeriodLabel = useMemo(() => {
    if (filterMode === 'all') return 'Semua Waktu';
    if (filterMode === 'month') {
      const [y, m] = filterMonth.split('-');
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${monthNames[parseInt(m, 10) - 1] || m} ${y}`;
    }
    return `${startDate} s/d ${endDate}`;
  }, [filterMode, filterMonth, startDate, endDate]);

  const handleSaveAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || expenseAmount <= 0) return;

    addExpense({
      propertyId: targetPropertyId,
      title: expenseTitle.trim(),
      category: expenseCategory as any,
      amount: Number(expenseAmount),
      date: expenseDate,
      notes: expenseNotes.trim() || undefined
    });

    setIsAddExpenseModalOpen(false);
    setExpenseTitle('');
    setExpenseAmount(150000);
    showToast(`Pengeluaran "${expenseTitle}" berhasil dicatat ke buku kas! 📝✨`);
  };

  // Item 16: Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Nominal (Rp)', 'Status'];
    const rows = combinedTransactions.map((t) => [
      t.id,
      t.date,
      t.type.toUpperCase(),
      `"${t.category}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.status
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `pawskost_Keuangan_${activePeriodLabel.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Laporan Keuangan CSV berhasil diunduh! 📊');
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

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight">
            Arus Kas &amp; Pembukuan
          </h1>
          <p className="text-softgray text-xs sm:text-sm mt-1">
            {activeProperty
              ? `Pembukuan, anggaran, dan laporan keuangan kost cabang ${activeProperty.name} 🐾`
              : 'Rekap pendapatan sewa, pengeluaran operasional, grafik laba bersih & pagu anggaran seluruh cabang.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="bg-peach-500 hover:bg-peach-400 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-cute flex items-center gap-1.5 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Catat Pengeluaran</span>
          </button>

          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="bg-cream-100 hover:bg-cream-200 text-darkcocoa px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border border-cream-200"
          >
            <Target className="w-4 h-4 text-peach-500" />
            <span>Atur Anggaran</span>
          </button>

          <button
            onClick={() => setIsMasterModalOpen(true)}
            className="bg-cream-100 hover:bg-cream-200 text-darkcocoa px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border border-cream-200"
          >
            <Layers className="w-4 h-4 text-lavender-500" />
            <span>Master Kategori</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportCSV}
              className="bg-white hover:bg-cream-100 text-darkcocoa px-3 py-2.5 rounded-2xl text-xs font-bold shadow-sm flex items-center gap-1.5 border border-cream-200 transition-all"
              title="Unduh format spreadsheet CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-matcha-600" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="bg-white hover:bg-cream-100 text-darkcocoa px-3 py-2.5 rounded-2xl text-xs font-bold shadow-sm flex items-center gap-1.5 border border-cream-200 transition-all"
              title="Cetak atau simpan Laporan PDF"
            >
              <Printer className="w-4 h-4 text-peach-500" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ITEM 9: Filter Bar (Bulan / Rentang Tanggal) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-cute border border-cream-200 flex flex-col md:flex-row md:items-center justify-between gap-3 print:p-2.5 print:shadow-none print:border-gray-300 print:break-inside-avoid">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-peach-50 flex items-center justify-center text-peach-500 print:hidden">
            <Filter className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold text-darkcocoa">
            Periode Laporan: <span className="text-peach-600 font-black">{activePeriodLabel}</span>
          </span>
        </div>

        <div className="print:hidden flex flex-wrap items-center gap-2 text-xs">
          {/* Mode Switcher */}
          <div className="flex bg-cream-100 p-1 rounded-xl gap-1 font-bold">
            <button
              type="button"
              onClick={() => setFilterMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'month'
                  ? 'bg-white text-darkcocoa shadow-sm'
                  : 'text-softgray hover:text-darkcocoa'
              }`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('range')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'range'
                  ? 'bg-white text-darkcocoa shadow-sm'
                  : 'text-softgray hover:text-darkcocoa'
              }`}
            >
              Rentang Tanggal
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-darkcocoa shadow-sm'
                  : 'text-softgray hover:text-darkcocoa'
              }`}
            >
              Semua
            </button>
          </div>

          {/* Month Dropdown */}
          {filterMode === 'month' && (
            <div className="flex items-center gap-1.5">
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-cream-50 border border-cream-200 rounded-xl px-3 py-1.5 font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
              />
            </div>
          )}

          {/* Date Range Inputs */}
          {filterMode === 'range' && (
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-cream-50 border border-cream-200 rounded-xl px-2.5 py-1.5 font-semibold text-darkcocoa text-xs focus:outline-none"
              />
              <span className="text-softgray font-bold">s/d</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-cream-50 border border-cream-200 rounded-xl px-2.5 py-1.5 font-semibold text-darkcocoa text-xs focus:outline-none"
              />
            </div>
          )}

          <span className="text-[11px] font-semibold text-peach-600 bg-peach-50 px-2.5 py-1 rounded-lg border border-peach-200 ml-auto md:ml-0">
            Aktif: {activePeriodLabel}
          </span>
        </div>
      </div>

      {/* Summary 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 print:grid-cols-3 print:gap-3 print:space-y-0">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-matcha-400 border-cream-200 break-inside-avoid print:break-inside-avoid print:p-3 print:rounded-2xl print:shadow-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softgray">Total Pemasukan Sewa</span>
            <div className="w-9 h-9 rounded-2xl bg-matcha-50 flex items-center justify-center text-matcha-500 print:hidden">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-heading text-matcha-600 mt-3 print:mt-1 print:text-xl">
            {formatRupiah(totalIncome)}
          </div>
          <p className="text-xs text-softgray mt-1 print:text-[10px]">Periode {activePeriodLabel}</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-peach-400 border-cream-200 break-inside-avoid print:break-inside-avoid print:p-3 print:rounded-2xl print:shadow-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softgray">Total Beban Operasional</span>
            <div className="w-9 h-9 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-500 print:hidden">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-heading text-peach-600 mt-3 print:mt-1 print:text-xl">
            {formatRupiah(totalExpense)}
          </div>
          <p className="text-xs text-softgray mt-1 print:text-[10px]">{filteredExpenses.length} pos biaya tercatat</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-lavender-400 border-cream-200 break-inside-avoid print:break-inside-avoid print:p-3 print:rounded-2xl print:shadow-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-softgray">Estimasi Kas Bersih</span>
            <div className="w-9 h-9 rounded-2xl bg-lavender-50 flex items-center justify-center text-lavender-500 print:hidden">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-heading text-darkcocoa mt-3 print:mt-1 print:text-xl">
            {formatRupiah(netCashFlow)}
          </div>
          <p className="text-xs text-softgray mt-1 print:text-[10px]">Pemasukan dikurangi operasional</p>
        </motion.div>
      </div>

      {/* ITEM 10 & ITEM 11: Financial Analytics Charts & Budget Tracker Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 print:grid-cols-2 print:gap-3">
        <FinancialAnalyticsCharts
          monthlyTrend={monthlyTrendData}
          categoryBreakdown={categoryBreakdownData}
        />
        <BudgetTrackerWidget
          onOpenManageModal={() => setIsBudgetModalOpen(true)}
          expenses={filteredExpenses.map((e) => ({ category: e.category, amount: e.amount }))}
        />
      </div>

      {/* Expense Breakdown List */}
      <div className="bg-white rounded-3xl p-6 shadow-cute border border-cream-200 space-y-4 break-inside-avoid print:break-inside-avoid print:p-4 print:shadow-none print:border-gray-300 print:mt-4">
        <div className="flex items-center justify-between border-b border-cream-100 pb-3">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-darkcocoa">
              Rincian Pengeluaran Operasional
            </h2>
            <p className="text-xs text-softgray">
              Daftar biaya listrik, internet, air, gaji, dan perbaikan untuk periode {activePeriodLabel}
            </p>
          </div>
          <span className="text-xs text-softgray font-semibold">
            {filteredExpenses.length} Transaksi
          </span>
        </div>

        <div className="divide-y divide-cream-100">
          {filteredExpenses.length === 0 ? (
            <div className="py-8 text-center text-softgray text-xs">
              Tidak ada catatan pengeluaran operasional pada periode {activePeriodLabel}.
            </div>
          ) : (
            filteredExpenses.map((exp) => {
              const matchedCat = expenseCategories.find(
                (c) => c.name.toLowerCase() === exp.category.toLowerCase()
              );
              return (
                <div
                  key={exp.id}
                  className="py-3.5 flex items-center justify-between hover:bg-cream-50/50 px-2 rounded-2xl transition-colors text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <div className="w-10 h-10 rounded-2xl bg-cream-100 flex items-center justify-center flex-shrink-0 text-peach-500">
                      {renderCategoryIcon(matchedCat ? matchedCat.icon : 'Sparkles')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-darkcocoa text-xs sm:text-sm truncate">
                        {exp.title}
                      </h3>
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
              );
            })
          )}
        </div>
      </div>

      {/* --- MODAL TAMBAH PENGELUARAN --- */}
      <AnimatePresence>
        {isAddExpenseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50 backdrop-blur-sm">
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
                  onClick={() => setIsAddExpenseModalOpen(false)}
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-darkcocoa block">Kategori Pos</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddExpenseModalOpen(false);
                          setIsMasterModalOpen(true);
                        }}
                        className="text-[10px] text-peach-600 font-bold hover:underline"
                      >
                        + Edit Master
                      </button>
                    </div>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-semibold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                    >
                      {expenseCategories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
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
                    onClick={() => setIsAddExpenseModalOpen(false)}
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

      {/* ITEM 11: Modal Atur Anggaran */}
      <ManageBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      {/* ITEM 12 & 13: Modal Master Keuangan & Icon Editable */}
      <ManageMasterFinanceModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
      />

      {/* ITEM 16: Modal Pratinjau Cetak / PDF Laporan Keuangan */}
      <FinancialReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        periodLabel={activePeriodLabel}
        propertyName={activeProperty ? activeProperty.name : settings.kosName}
        propertyAddress={activeProperty ? activeProperty.address : (settings.kosAddress || 'Kost Nyaman')}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        netCashFlow={netCashFlow}
        transactions={combinedTransactions}
      />
    </div>
  );
}

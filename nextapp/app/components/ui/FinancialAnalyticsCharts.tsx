'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Table,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { renderCategoryIcon } from './CategoryIconPicker';

export interface MonthlyDataPoint {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryExpenseData {
  category: string;
  icon: string;
  amount: number;
  percentage: number;
  color: string;
}

interface FinancialAnalyticsChartsProps {
  monthlyTrend: MonthlyDataPoint[];
  categoryBreakdown: CategoryExpenseData[];
}

export function FinancialAnalyticsCharts({
  monthlyTrend,
  categoryBreakdown
}: FinancialAnalyticsChartsProps) {
  const [activeTab, setActiveTab] = useState<'trend' | 'table' | 'breakdown'>('trend');

  const formatRupiah = (val: number) => {
    if (Math.abs(val) >= 1000000) {
      return (val / 1000000).toFixed(1) + ' jt';
    }
    if (Math.abs(val) >= 1000) {
      return (val / 1000).toFixed(0) + ' rb';
    }
    return val.toString();
  };

  const formatRupiahFull = (val: number) => 'Rp ' + (val || 0).toLocaleString('id-ID');

  // Compute aggregate statistics
  const totalIncomeAll = monthlyTrend.reduce((sum, d) => sum + d.income, 0);
  const totalExpenseAll = monthlyTrend.reduce((sum, d) => sum + d.expense, 0);
  const totalNetAll = totalIncomeAll - totalExpenseAll;
  const overallMargin = totalIncomeAll > 0 ? Math.round((totalNetAll / totalIncomeAll) * 100) : 0;
  const avgMonthlyProfit = monthlyTrend.length > 0 ? Math.round(totalNetAll / monthlyTrend.length) : 0;

  // Find max value for chart scaling (round up to next nice round number)
  const rawMax = Math.max(
    ...monthlyTrend.map((d) => Math.max(d.income, d.expense)),
    1000000
  );
  // Round maxVal to a clean step (e.g. 5jt, 10jt)
  const step = rawMax > 10000000 ? 5000000 : rawMax > 5000000 ? 2000000 : 1000000;
  const maxVal = Math.ceil(rawMax / step) * step;

  // Grid steps (4 intervals: 100%, 75%, 50%, 25%)
  const gridSteps = [1, 0.75, 0.5, 0.25];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-cute border border-cream-200 space-y-4 break-inside-avoid print:break-inside-avoid print:p-4 print:shadow-none print:border-gray-300">
      {/* Top Header & Chart Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-peach-100 flex items-center justify-center text-peach-600 flex-shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa flex items-center gap-2">
              <span>Grafik &amp; Analisis Finansial Kost</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-matcha-100 text-matcha-700 text-[10px] font-black uppercase">
                Aktif
              </span>
            </h3>
            <p className="text-xs text-softgray">
              Visualisasi tren pemasukan vs operasional &amp; rasio profitabilitas bulanan
            </p>
          </div>
        </div>

        {/* Tab Switcher (Hidden in Print) */}
        <div className="print:hidden flex bg-cream-100 p-1 rounded-2xl gap-1 text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('trend')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'trend'
                ? 'bg-white text-darkcocoa shadow-sm'
                : 'text-softgray hover:text-darkcocoa'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-matcha-500" />
            <span>Grafik</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'table'
                ? 'bg-white text-darkcocoa shadow-sm'
                : 'text-softgray hover:text-darkcocoa'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-lavender-500" />
            <span>Tabel Detail</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'breakdown'
                ? 'bg-white text-darkcocoa shadow-sm'
                : 'text-softgray hover:text-darkcocoa'
            }`}
          >
            <PieChart className="w-3.5 h-3.5 text-peach-500" />
            <span>Pos Biaya</span>
          </button>
        </div>
      </div>

      {/* Mini KPI Summary Cards inside Chart Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-cream-50/80 rounded-2xl p-2.5 border border-cream-200/80">
          <span className="text-[10px] font-bold text-softgray block">Total Pemasukan</span>
          <span className="font-heading font-extrabold text-matcha-600 text-xs sm:text-sm">
            {formatRupiah(totalIncomeAll)}
          </span>
        </div>
        <div className="bg-cream-50/80 rounded-2xl p-2.5 border border-cream-200/80">
          <span className="text-[10px] font-bold text-softgray block">Total Beban</span>
          <span className="font-heading font-extrabold text-peach-600 text-xs sm:text-sm">
            {formatRupiah(totalExpenseAll)}
          </span>
        </div>
        <div className="bg-cream-50/80 rounded-2xl p-2.5 border border-cream-200/80">
          <span className="text-[10px] font-bold text-softgray block">Laba Bersih</span>
          <div className="flex items-center gap-1">
            <span className="font-heading font-extrabold text-darkcocoa text-xs sm:text-sm">
              +{formatRupiah(totalNetAll)}
            </span>
            <span className="text-[9px] font-black text-matcha-700 bg-matcha-100 px-1 py-0.2 rounded">
              {overallMargin}%
            </span>
          </div>
        </div>
        <div className="bg-cream-50/80 rounded-2xl p-2.5 border border-cream-200/80">
          <span className="text-[10px] font-bold text-softgray block">Rata-rata / Bln</span>
          <span className="font-heading font-extrabold text-lavender-600 text-xs sm:text-sm">
            +{formatRupiah(avgMonthlyProfit)}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'trend' ? (
        /* ================= DETAILED BAR CHART WITH Y-AXIS & GRIDLINES ================= */
        <div className="space-y-3">
          {/* Legend */}
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-matcha-500 shadow-xs" />
                <span className="text-darkcocoa text-[11px] sm:text-xs">Pemasukan Sewa</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-peach-400 shadow-xs" />
                <span className="text-darkcocoa text-[11px] sm:text-xs">Beban Operasional</span>
              </div>
            </div>

            <div className="text-[11px] text-softgray font-semibold hidden sm:block">
              Skala Max: {formatRupiahFull(maxVal)}
            </div>
          </div>

          {/* Chart Wrapper with Y-Axis and Gridlines */}
          <div className="relative pt-6 pb-2">
            {/* Grid Lines & Y-Axis Labels */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12 sm:pb-14 pr-2">
              {gridSteps.map((fraction, i) => (
                <div key={i} className="flex items-center gap-2 w-full text-[9px] font-mono font-bold text-softgray/70">
                  <span className="w-9 text-right tabular-nums">
                    {formatRupiah(maxVal * fraction)}
                  </span>
                  <div className="flex-1 border-b border-dashed border-cream-200/80" />
                </div>
              ))}
              <div className="flex items-center gap-2 w-full text-[9px] font-mono font-bold text-softgray/70">
                <span className="w-9 text-right tabular-nums">0</span>
                <div className="flex-1 border-b border-cream-300" />
              </div>
            </div>

            {/* Bars Area */}
            <div className="h-52 sm:h-56 flex items-end justify-between gap-2 sm:gap-4 pl-11 pr-2 relative z-10 pb-2">
              {monthlyTrend.map((item, idx) => {
                const incomeHeight = Math.max(8, Math.min(100, (item.income / maxVal) * 100));
                const expenseHeight = Math.max(8, Math.min(100, (item.expense / maxVal) * 100));
                const net = item.income - item.expense;
                const margin = item.income > 0 ? Math.round((net / item.income) * 100) : 0;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full relative">
                      {/* Income Bar */}
                      <div className="flex flex-col items-center justify-end w-1/2 max-w-[34px] h-full">
                        {/* Always-visible Value Badge Above Income Bar */}
                        <span className="text-[9px] sm:text-[10px] font-extrabold text-matcha-700 bg-matcha-50 px-1 py-0.5 rounded border border-matcha-200 shadow-xs mb-1 whitespace-nowrap tabular-nums">
                          {formatRupiah(item.income)}
                        </span>
                        <div
                          style={{ height: `${incomeHeight}%` }}
                          className="w-full bg-gradient-to-t from-matcha-500 to-matcha-400 hover:from-matcha-600 hover:to-matcha-500 rounded-t-xl transition-all shadow-sm cursor-pointer"
                          title={`Pemasukan: ${formatRupiahFull(item.income)}`}
                        />
                      </div>

                      {/* Expense Bar */}
                      <div className="flex flex-col items-center justify-end w-1/2 max-w-[34px] h-full">
                        {/* Always-visible Value Badge Above Expense Bar */}
                        <span className="text-[9px] sm:text-[10px] font-extrabold text-peach-700 bg-peach-50 px-1 py-0.5 rounded border border-peach-200 shadow-xs mb-1 whitespace-nowrap tabular-nums">
                          {formatRupiah(item.expense)}
                        </span>
                        <div
                          style={{ height: `${expenseHeight}%` }}
                          className="w-full bg-gradient-to-t from-peach-500 to-peach-400 hover:from-peach-600 hover:to-peach-500 rounded-t-xl transition-all shadow-sm cursor-pointer"
                          title={`Beban Biaya: ${formatRupiahFull(item.expense)}`}
                        />
                      </div>
                    </div>

                    {/* Month Label & Net Profit Pill */}
                    <div className="mt-2 text-center space-y-0.5">
                      <span className="text-[11px] font-extrabold text-darkcocoa block leading-tight">
                        {item.month}
                      </span>
                      <span
                        className={`inline-block text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md leading-tight ${
                          net >= 0
                            ? 'bg-matcha-100 text-matcha-800 border border-matcha-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                        title={`Laba Bersih: ${formatRupiahFull(net)} (Margin: ${margin}%)`}
                      >
                        +{formatRupiah(net)} <span className="opacity-75">({margin}%)</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtext info */}
          <div className="flex items-center justify-between text-[11px] text-softgray pt-1 border-t border-cream-100 flex-wrap gap-2">
            <span>💡 Nilai nominal pemasukan &amp; beban ditampilkan permanen di atas tiap batang.</span>
            <span className="font-bold text-darkcocoa">Laba Bersih = Pemasukan - Operasional</span>
          </div>

          {/* Compact Mini Table in Print Mode so printed reports have exact numbers */}
          <div className="hidden print:block pt-2">
            <table className="w-full text-[10px] border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-darkcocoa font-bold">
                  <th className="border border-gray-300 p-1 text-left">Bulan</th>
                  <th className="border border-gray-300 p-1 text-right">Pemasukan</th>
                  <th className="border border-gray-300 p-1 text-right">Beban Operasional</th>
                  <th className="border border-gray-300 p-1 text-right">Laba Bersih</th>
                  <th className="border border-gray-300 p-1 text-center">Margin</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTrend.map((row, i) => {
                  const net = row.income - row.expense;
                  const margin = row.income > 0 ? Math.round((net / row.income) * 100) : 0;
                  return (
                    <tr key={i}>
                      <td className="border border-gray-300 p-1 font-bold">{row.month}</td>
                      <td className="border border-gray-300 p-1 text-right text-emerald-700 font-semibold">{formatRupiahFull(row.income)}</td>
                      <td className="border border-gray-300 p-1 text-right text-amber-700 font-semibold">{formatRupiahFull(row.expense)}</td>
                      <td className="border border-gray-300 p-1 text-right font-bold text-darkcocoa">{formatRupiahFull(net)}</td>
                      <td className="border border-gray-300 p-1 text-center font-bold">{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'table' ? (
        /* ================= NUMERIC SUMMARY TABLE TAB ================= */
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-2xl border border-cream-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-cream-100/70 text-darkcocoa font-extrabold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Periode Bulan</th>
                  <th className="p-3 text-right">Pemasukan Sewa</th>
                  <th className="p-3 text-right">Beban Operasional</th>
                  <th className="p-3 text-right">Laba Bersih</th>
                  <th className="p-3 text-center">Margin (%)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {monthlyTrend.map((row, idx) => {
                  const net = row.income - row.expense;
                  const margin = row.income > 0 ? Math.round((net / row.income) * 100) : 0;
                  return (
                    <tr key={idx} className="hover:bg-cream-50/60 transition-colors font-medium">
                      <td className="p-3 font-bold text-darkcocoa flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-peach-500" />
                        {row.month}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-matcha-600">
                        {formatRupiahFull(row.income)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-peach-600">
                        {formatRupiahFull(row.expense)}
                      </td>
                      <td className="p-3 text-right font-mono font-extrabold text-darkcocoa">
                        +{formatRupiahFull(net)}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-matcha-100 text-matcha-700 text-[10px] font-black">
                          {margin}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-matcha-700 bg-matcha-50 px-2 py-0.5 rounded-lg border border-matcha-200">
                          <CheckCircle2 className="w-3 h-3 text-matcha-500" />
                          <span>Surplus</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= CATEGORY BREAKDOWN BARS ================= */
        <div className="space-y-3">
          {categoryBreakdown.length === 0 ? (
            <div className="p-8 text-center text-softgray text-xs">
              Belum ada data pengeluaran operasional yang tercatat.
            </div>
          ) : (
            <div className="space-y-3">
              {categoryBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-cream-100 flex items-center justify-center text-peach-600">
                        {renderCategoryIcon(item.icon, 'w-3.5 h-3.5')}
                      </div>
                      <span className="text-darkcocoa capitalize">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-softgray font-semibold text-[11px]">
                        {item.percentage}%
                      </span>
                      <span className="text-peach-600 font-extrabold font-heading">
                        {formatRupiahFull(item.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-cream-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? 'bg-peach-500'
                          : idx === 1
                          ? 'bg-matcha-500'
                          : idx === 2
                          ? 'bg-lavender-500'
                          : idx === 3
                          ? 'bg-sakura-500'
                          : 'bg-ocean-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

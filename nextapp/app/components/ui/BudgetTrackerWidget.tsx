'use client';

import React from 'react';
import { Target, AlertTriangle, CheckCircle, Settings, Plus } from 'lucide-react';
import { useKosStore } from '../../lib/store/useKosStore';
import { renderCategoryIcon } from './CategoryIconPicker';

interface BudgetTrackerWidgetProps {
  onOpenManageModal: () => void;
  expenses: { category: string; amount: number }[];
}

export function BudgetTrackerWidget({ onOpenManageModal, expenses }: BudgetTrackerWidgetProps) {
  const { expenseCategories, monthlyBudgets } = useKosStore();

  const formatRupiah = (val: number) => 'Rp ' + (val || 0).toLocaleString('id-ID');

  // Compute spent per category
  const spentByCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    // Match either category name or standard key
    const foundCat = expenseCategories.find(
      (c) => c.name.toLowerCase() === e.category.toLowerCase() || c.id === e.category
    );
    const catKey = foundCat ? foundCat.name : e.category;
    spentByCategory[catKey] = (spentByCategory[catKey] || 0) + e.amount;
  });

  const totalBudget = Object.values(monthlyBudgets).reduce((sum, v) => sum + (v || 0), 0);
  const totalSpent = Object.values(spentByCategory).reduce((sum, v) => sum + (v || 0), 0);
  const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-cute border border-cream-200 space-y-4 break-inside-avoid print:break-inside-avoid print:p-4 print:shadow-none print:border-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cream-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-peach-100 flex items-center justify-center text-peach-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa">
              Monitoring Anggaran (Budgeting)
            </h3>
            <p className="text-xs text-softgray">
              Realisasi pengeluaran kas terhadap pagu anggaran bulanan
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenManageModal}
          className="px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-darkcocoa text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-peach-500" />
          <span>Atur Anggaran</span>
        </button>
      </div>

      {/* Global Progress Bar */}
      <div className="bg-cream-50 p-3.5 rounded-2xl border border-cream-200 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-softgray">Total Terpakai Bulan Ini:</span>
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-darkcocoa">
              {formatRupiah(totalSpent)}
            </span>
            <span className="text-softgray">/ {formatRupiah(totalBudget)}</span>
            <span
              className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                totalPercentage > 100
                  ? 'bg-red-100 text-red-600'
                  : totalPercentage >= 80
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-matcha-100 text-matcha-700'
              }`}
            >
              {totalPercentage}%
            </span>
          </div>
        </div>
        <div className="w-full h-3 bg-cream-200 rounded-full overflow-hidden">
          <div
            style={{ width: `${Math.min(100, totalPercentage)}%` }}
            className={`h-full rounded-full transition-all duration-500 ${
              totalPercentage > 100
                ? 'bg-red-500'
                : totalPercentage >= 80
                ? 'bg-amber-400'
                : 'bg-matcha-500'
            }`}
          />
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {expenseCategories.map((cat) => {
          const budget = monthlyBudgets[cat.name] || 0;
          const spent = spentByCategory[cat.name] || 0;
          const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
          const isOver = budget > 0 && spent > budget;
          const isWarning = budget > 0 && pct >= 75 && pct <= 100;

          return (
            <div
              key={cat.id}
              className="p-3 rounded-2xl bg-cream-50/60 border border-cream-200/70 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-white border border-cream-200 flex items-center justify-center text-peach-600">
                    {renderCategoryIcon(cat.icon, 'w-3.5 h-3.5')}
                  </div>
                  <div>
                    <span className="font-extrabold text-darkcocoa">{cat.name}</span>
                    {budget === 0 && (
                      <span className="text-[10px] text-softgray ml-2 italic">Belum diatur</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isOver && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Over Budget!
                    </span>
                  )}
                  {isWarning && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Mendekati Batas ({pct}%)
                    </span>
                  )}
                  <span className="font-mono font-bold text-darkcocoa">
                    {formatRupiah(spent)}{' '}
                    <span className="text-softgray font-normal">/ {formatRupiah(budget)}</span>
                  </span>
                </div>
              </div>

              {budget > 0 && (
                <div className="w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, pct)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-matcha-500'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Target, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { useKosStore } from '../../lib/store/useKosStore';
import { renderCategoryIcon } from './CategoryIconPicker';

interface ManageBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageBudgetModal({ isOpen, onClose }: ManageBudgetModalProps) {
  const { expenseCategories, monthlyBudgets, setMonthlyBudget } = useKosStore();
  const [localBudgets, setLocalBudgets] = useState<Record<string, number>>({ ...monthlyBudgets });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(localBudgets).forEach(([cat, amount]) => {
      setMonthlyBudget(cat, amount);
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const formatRupiah = (val: number) => 'Rp ' + (val || 0).toLocaleString('id-ID');

  const totalMonthlyBudget = Object.values(localBudgets).reduce((sum, val) => sum + (val || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-darkcocoa/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-5 sm:p-7 max-w-lg w-full space-y-5 font-body text-darkcocoa my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-peach-100 flex items-center justify-center text-peach-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                Anggaran Biaya Bulanan (Budgeting)
              </h3>
              <p className="text-xs text-softgray">
                Tentukan batas pagu biaya operasional kost setiap bulan 🎯
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Overview Card */}
        <div className="bg-peach-50 rounded-2xl p-4 border border-peach-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-peach-700">Total Plafon Anggaran Operasional</span>
            <p className="text-xl font-heading font-extrabold text-peach-600 mt-0.5">
              {formatRupiah(totalMonthlyBudget)}
            </p>
          </div>
          <span className="text-xs font-semibold text-peach-700 bg-white/80 px-2.5 py-1 rounded-full border border-peach-200">
            {expenseCategories.length} Pos Biaya
          </span>
        </div>

        {/* Form Inputs per category */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {expenseCategories.map((cat) => {
              const currentVal = localBudgets[cat.name] || 0;
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-cream-50 border border-cream-200 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-white border border-cream-200 flex items-center justify-center text-peach-500 flex-shrink-0">
                      {renderCategoryIcon(cat.icon, 'w-4 h-4')}
                    </div>
                    <span className="font-bold text-darkcocoa truncate">{cat.name}</span>
                  </div>

                  <div className="w-40 flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-softgray">Rp</span>
                    <input
                      type="number"
                      step={50000}
                      value={currentVal || ''}
                      placeholder="0"
                      onChange={(e) =>
                        setLocalBudgets({
                          ...localBudgets,
                          [cat.name]: Number(e.target.value) || 0
                        })
                      }
                      className="w-full bg-white border border-cream-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-right text-darkcocoa focus:outline-none focus:border-peach-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-cream-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-softgray hover:bg-cream-100"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={savedSuccess}
              className="bg-peach-500 hover:bg-peach-400 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-cute flex items-center gap-1.5 transition-all"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Tersimpan! ✨</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Anggaran</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

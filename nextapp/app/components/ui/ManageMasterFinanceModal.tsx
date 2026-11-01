'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { useKosStore, TransactionCategoryItem, CashAccountItem } from '../../lib/store/useKosStore';
import { CategoryIconPicker, renderCategoryIcon } from './CategoryIconPicker';

interface ManageMasterFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'expense' | 'income' | 'account';
}

export function ManageMasterFinanceModal({
  isOpen,
  onClose,
  initialTab = 'expense'
}: ManageMasterFinanceModalProps) {
  const {
    incomeCategories,
    expenseCategories,
    cashAccounts,
    addCategory,
    updateCategory,
    deleteCategory,
    addCashAccount,
    updateCashAccount,
    deleteCashAccount
  } = useKosStore();

  const [activeTab, setActiveTab] = useState<'expense' | 'income' | 'account'>(initialTab);

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sparkles');
  const [newCatColor, setNewCatColor] = useState('peach');

  // Editing Category
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('Sparkles');
  const [showEditIconPicker, setShowEditIconPicker] = useState(false);

  // Cash Account Form State
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newAccountType, setNewAccountType] = useState<'bank' | 'cash' | 'ewallet'>('bank');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      type: activeTab === 'expense' ? 'expense' : 'income',
      icon: newCatIcon,
      color: newCatColor
    });
    setNewCatName('');
    setNewCatIcon('Sparkles');
  };

  const handleSaveEditCategory = (id: string) => {
    if (!editCatName.trim()) return;
    updateCategory(id, {
      name: editCatName.trim(),
      icon: editCatIcon
    });
    setEditingCatId(null);
    setShowEditIconPicker(false);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName.trim()) return;
    addCashAccount({
      name: newAccountName.trim(),
      accountNumber: newAccountNumber.trim() || undefined,
      type: newAccountType,
      balance: 0
    });
    setNewAccountName('');
    setNewAccountNumber('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-darkcocoa/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-5 sm:p-7 max-w-2xl w-full space-y-5 font-body text-darkcocoa my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 pb-3">
          <div>
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-darkcocoa flex items-center gap-2">
              <Layers className="w-5 h-5 text-peach-500" />
              <span>Master Kategori &amp; Kas Keuangan</span>
            </h3>
            <p className="text-xs text-softgray">
              Sesuaikan nama pos pendapatan, beban operasional, serta icon jenis transaksi 🐾
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-cream-100 p-1.5 rounded-2xl gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('expense')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'expense'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'text-softgray hover:text-darkcocoa'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Kategori Pengeluaran</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('income')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'income'
                ? 'bg-matcha-500 text-white shadow-cute'
                : 'text-softgray hover:text-darkcocoa'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Kategori Pendapatan</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'account'
                ? 'bg-lavender-500 text-white shadow-cute'
                : 'text-softgray hover:text-darkcocoa'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Akun Kas &amp; Bank</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab !== 'account' ? (
          <div className="space-y-4">
            {/* List of Categories */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {(activeTab === 'expense' ? expenseCategories : incomeCategories).map((cat) => {
                const isEditing = editingCatId === cat.id;

                if (isEditing) {
                  return (
                    <div
                      key={cat.id}
                      className="p-3 bg-cream-50 rounded-2xl border border-peach-300 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowEditIconPicker(!showEditIconPicker)}
                          className="w-10 h-10 rounded-xl bg-white border border-cream-200 flex items-center justify-center text-peach-500 hover:border-peach-400"
                          title="Ubah Icon"
                        >
                          {renderCategoryIcon(editCatIcon, 'w-5 h-5')}
                        </button>
                        <input
                          type="text"
                          value={editCatName}
                          onChange={(e) => setEditCatName(e.target.value)}
                          className="flex-1 bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs font-bold text-darkcocoa"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditCategory(cat.id)}
                          className="bg-matcha-500 hover:bg-matcha-400 text-white p-2 rounded-xl text-xs font-bold shadow-sm"
                          title="Simpan"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="bg-cream-200 text-softgray p-2 rounded-xl text-xs font-bold"
                          title="Batal"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {showEditIconPicker && (
                        <CategoryIconPicker
                          selectedIcon={editCatIcon}
                          onSelectIcon={(icon) => {
                            setEditCatIcon(icon);
                            setShowEditIconPicker(false);
                          }}
                        />
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-cream-50/70 hover:bg-cream-100/60 transition-colors border border-cream-200/60 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-cream-200 shadow-sm flex items-center justify-center text-peach-600">
                        {renderCategoryIcon(cat.icon, 'w-4 h-4')}
                      </div>
                      <span className="font-extrabold text-darkcocoa text-sm">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setEditCatName(cat.name);
                          setEditCatIcon(cat.icon);
                          setShowEditIconPicker(false);
                        }}
                        className="p-1.5 text-softgray hover:text-darkcocoa hover:bg-white rounded-lg transition-colors"
                        title="Edit Kategori & Icon"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus kategori "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1.5 text-softgray hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Category Form */}
            <form
              onSubmit={handleAddCategory}
              className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 space-y-3"
            >
              <span className="text-xs font-bold text-darkcocoa block">
                + Tambah Kategori {activeTab === 'expense' ? 'Pengeluaran' : 'Pendapatan'} Baru
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nama pos / kategori (misal: Gas LPG, Sampah)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
                />
                <button
                  type="submit"
                  className="bg-peach-500 hover:bg-peach-400 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-cute flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>

              <CategoryIconPicker selectedIcon={newCatIcon} onSelectIcon={setNewCatIcon} />
            </form>
          </div>
        ) : (
          /* Accounts Tab */
          <div className="space-y-4">
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {cashAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-cream-50/70 border border-cream-200/60 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-lavender-100 flex items-center justify-center text-lavender-600 font-bold">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-darkcocoa text-sm block">
                        {acc.name}
                      </span>
                      {acc.accountNumber && (
                        <span className="text-[11px] font-mono text-softgray">
                          No. Rek: {acc.accountNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-200 text-darkcocoa uppercase">
                      {acc.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus akun kas "${acc.name}"?`)) {
                          deleteCashAccount(acc.id);
                        }
                      }}
                      className="p-1.5 text-softgray hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                      title="Hapus Akun"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Cash Account Form */}
            <form
              onSubmit={handleAddAccount}
              className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 space-y-3 text-xs"
            >
              <span className="text-xs font-bold text-darkcocoa block">+ Tambah Rekening / Akun Kas Baru</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nama Akun (mis: BCA Operasional)"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className="sm:col-span-2 bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
                />
                <select
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value as any)}
                  className="bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
                >
                  <option value="bank">Bank</option>
                  <option value="cash">Kas Tunai</option>
                  <option value="ewallet">E-Wallet / QRIS</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nomor Rekening / Catatan (opsional)"
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  className="flex-1 bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                />
                <button
                  type="submit"
                  className="bg-lavender-500 hover:bg-lavender-400 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-cute flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Akun</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-cream-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs transition-colors"
          >
            Selesai
          </button>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Building2,
  Phone,
  Mail,
  Lock,
  Calendar,
  DollarSign,
  ShieldAlert,
  Save,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useKosStore, SaaSUserAccount } from '../../lib/store/useKosStore';

export interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: SaaSUserAccount | null;
  onSaved?: (message: string) => void;
}

export const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSaved
}) => {
  const { updateSaaSAccount, deleteSaaSAccount } = useKosStore();

  const [name, setName] = useState('');
  const [kosName, setKosName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<'starter' | 'pro' | 'enterprise' | 'trial_14_days'>('pro');
  const [status, setStatus] = useState<SaaSUserAccount['status']>('active');
  const [expiresAt, setExpiresAt] = useState('');
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setName(account.name || '');
      setKosName(account.kosName || '');
      setPhone(account.phone || '');
      setEmail(account.email || '');
      setPassword(account.password || 'password123');
      setPlan(account.plan || 'pro');
      setStatus(account.status || 'active');
      setExpiresAt(account.expiresAt || new Date().toISOString().split('T')[0]);
      setTotalPaid(account.totalPaid || 0);
      setNotes(account.notes || '');
      setIsDeleting(false);
      setErrorMessage(null);
    }
  }, [account, isOpen]);

  if (!isOpen || !account) return null;

  const planNames: Record<string, string> = {
    starter: 'Paket Kos Mungil',
    pro: 'Paket Juragan Pro',
    enterprise: 'Paket Konglomerat',
    trial_14_days: 'Trial Gratis 14 Hari'
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Nama dan Email wajib diisi.');
      return;
    }

    const diffDays = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    updateSaaSAccount(account.id, {
      name: name.trim(),
      kosName: kosName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      plan,
      planName: planNames[plan] || 'Paket Juragan Pro',
      status,
      expiresAt,
      daysRemaining: diffDays,
      totalPaid: Number(totalPaid),
      notes: notes.trim()
    });

    if (onSaved) onSaved(`Perubahan akun ${name} berhasil disimpan! ✨`);
    onClose();
  };

  const handleDelete = () => {
    if (account.id === 'usr-admin-root') {
      setErrorMessage('Akun Super Admin Utama tidak boleh dihapus.');
      return;
    }

    const success = deleteSaaSAccount(account.id);
    if (success) {
      if (onSaved) onSaved(`Akun ${account.name} telah berhasil dihapus dari sistem.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-body">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-darkcocoa to-darkcocoa/90 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-peach-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                Edit Data Pelanggan SaaS ✏️
              </h3>
              <p className="text-[11px] text-cream-200">
                Ubah profil, paket lisensi, status, masa aktif, dan kredensial akun
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-bold">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Section 1: Profil & Identitas */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-xs text-peach-600 uppercase tracking-wider">
              1. Identitas Akun Pemilik Kos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Nama Pemilik Kos *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Nama Properti Kosan *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={kosName}
                    onChange={(e) => setKosName(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Nomor WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Alamat Email (Login) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-darkcocoa block mb-1">
                Kata Sandi Baru (Reset Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-softgray absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password untuk login tenant"
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa font-mono focus:outline-none focus:border-peach-400"
                />
              </div>
              <p className="text-[10px] text-softgray mt-0.5">
                Super Admin dapat langsung mereset kata sandi jika pemilik kos lupa kata sandi mereka.
              </p>
            </div>
          </div>

          <div className="border-t border-cream-100 my-2" />

          {/* Section 2: Paket Lisensi & Status */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-xs text-peach-600 uppercase tracking-wider">
              2. Lisensi Paket &amp; Status Akses
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Paket Langganan
                </label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as any)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa font-bold focus:outline-none focus:border-peach-400"
                >
                  <option value="starter">Paket Kos Mungil (1 Cabang, 10 Kamar)</option>
                  <option value="pro">Paket Juragan Pro (3 Cabang, 50 Kamar)</option>
                  <option value="enterprise">Paket Konglomerat (Unlimited)</option>
                  <option value="trial_14_days">Trial Gratis 14 Hari</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Status Akun
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa font-bold focus:outline-none focus:border-peach-400"
                >
                  <option value="active">🟢 Aktif Berbayar (Dapat Login)</option>
                  <option value="pending_approval">🟡 Menunggu Verifikasi Bukti (Terkunci)</option>
                  <option value="trial">🔵 Masa Trial 14 Hari</option>
                  <option value="expired">🔴 Kedaluwarsa</option>
                  <option value="suspended">⛔ Dinonaktifkan (Suspended)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Tanggal Berakhir Lisensi
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Total Penerimaan Diterima (Rp)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-softgray absolute left-3 top-3" />
                  <input
                    type="number"
                    value={totalPaid}
                    onChange={(e) => setTotalPaid(Number(e.target.value))}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa font-mono font-bold focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-darkcocoa block mb-1">
                Catatan Super Admin
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan verifikasi transfer, memo khusus pelanggan, dll."
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
              />
            </div>
          </div>

          {/* Section 3: Danger Zone */}
          {account.id !== 'usr-admin-root' && (
            <div className="pt-3 border-t border-red-100">
              {isDeleting ? (
                <div className="p-3 bg-red-50 rounded-2xl border border-red-200 space-y-2">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Yakin ingin menghapus akun ini secara permanen?</span>
                  </div>
                  <p className="text-[11px] text-red-600">
                    Tindakan ini tidak dapat dibatalkan. Seluruh data akun akan dihapus dari sistem.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors"
                    >
                      Ya, Hapus Akun Ini
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeleting(false)}
                      className="py-1.5 px-3 rounded-xl bg-white border border-red-200 text-red-700 font-bold text-[11px]"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="text-red-500 hover:text-red-700 font-bold text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Akun Pelanggan Ini...</span>
                </button>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-cream-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa font-bold text-xs transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              className="py-2.5 px-5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center gap-1.5 hover:scale-[1.01] active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Akun</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

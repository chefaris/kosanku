'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Wrench,
  CheckCircle2,
  Dice5,
  Eye,
  EyeOff
} from 'lucide-react';
import { TenantStaffUser, TenantStaffRole, Property } from '../../lib/store/useKosStore';

export interface StaffUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: TenantStaffUser | null;
  properties: Property[];
  onSave: (data: {
    name: string;
    email: string;
    phone: string;
    role: TenantStaffRole;
    password: string;
    assignedPropertyId: string;
    isActive: boolean;
  }) => void;
}

export const StaffUserModal: React.FC<StaffUserModalProps> = ({
  isOpen,
  onClose,
  staff,
  properties,
  onSave
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<TenantStaffRole>('cashier');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [assignedPropertyId, setAssignedPropertyId] = useState('all');
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (staff) {
      setName(staff.name || '');
      setEmail(staff.email || '');
      setPhone(staff.phone || '');
      setRole(staff.role || 'cashier');
      setPassword(staff.password || 'password123');
      setAssignedPropertyId(staff.assignedPropertyId || 'all');
      setIsActive(staff.isActive ?? true);
      setErrorMessage(null);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setRole('cashier');
      setPassword('staff' + Math.floor(1000 + Math.random() * 9000));
      setAssignedPropertyId('all');
      setIsActive(true);
      setErrorMessage(null);
    }
  }, [staff, isOpen]);

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let randomPass = 'pawskost';
    for (let i = 0; i < 4; i++) {
      randomPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(randomPass + '!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Nama staf dan alamat email wajib diisi.');
      return;
    }
    if (password.trim().length < 6) {
      setErrorMessage('Kata sandi staf minimal harus 6 karakter.');
      return;
    }

    onSave({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || '-',
      role,
      password: password.trim(),
      assignedPropertyId,
      isActive
    });

    onClose();
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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                {staff ? 'Edit Data & Hak Akses Staf' : 'Tambah Staf Operasional Kos Baru'}
              </h3>
              <p className="text-[11px] text-cream-200">
                Tentukan hak akses terukur agar operasional kos tetap aman &amp; terkendali
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-bold">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* 1. Pilih Hak Akses / Peran */}
          <div className="space-y-2">
            <label className="font-bold text-darkcocoa block text-xs">
              1. Pilih Peran &amp; Hak Akses Staf *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Kasir */}
              <button
                type="button"
                onClick={() => setRole('cashier')}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  role === 'cashier'
                    ? 'border-peach-500 bg-peach-50/50 ring-2 ring-peach-200'
                    : 'border-cream-200 bg-cream-50/40 hover:bg-cream-100/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-7 h-7 rounded-xl bg-peach-100 text-peach-600 flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5" />
                    </span>
                    {role === 'cashier' && <CheckCircle2 className="w-4 h-4 text-peach-500" />}
                  </div>
                  <h4 className="font-bold text-darkcocoa text-xs">Staf Kasir</h4>
                  <p className="text-[10px] text-softgray leading-tight mt-1">
                    Bisa update status bayar sewa, cetak kwitansi/struk thermal, &amp; cek ketersediaan kamar kosong.
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-cream-200/60 text-[9px] text-peach-700 font-semibold">
                  🔒 Keuangan rahasia &amp; setting terkunci
                </div>
              </button>

              {/* Option 2: Manajer */}
              <button
                type="button"
                onClick={() => setRole('manager')}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  role === 'manager'
                    ? 'border-matcha-500 bg-matcha-50/50 ring-2 ring-matcha-200'
                    : 'border-cream-200 bg-cream-50/40 hover:bg-cream-100/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-7 h-7 rounded-xl bg-matcha-100 text-matcha-600 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                    {role === 'manager' && <CheckCircle2 className="w-4 h-4 text-matcha-500" />}
                  </div>
                  <h4 className="font-bold text-darkcocoa text-xs">Manajer Kos</h4>
                  <p className="text-[10px] text-softgray leading-tight mt-1">
                    Operasional harian penuh: kelola kamar, check-in anak kos, buat tagihan, &amp; input beban rutin.
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-cream-200/60 text-[9px] text-matcha-700 font-semibold">
                  🔒 Rekening pemilik &amp; SaaS aman
                </div>
              </button>

              {/* Option 3: Penjaga Kos */}
              <button
                type="button"
                onClick={() => setRole('staff_ops')}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  role === 'staff_ops'
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-200'
                    : 'border-cream-200 bg-cream-50/40 hover:bg-cream-100/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Wrench className="w-3.5 h-3.5" />
                    </span>
                    {role === 'staff_ops' && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  </div>
                  <h4 className="font-bold text-darkcocoa text-xs">Penjaga Kos</h4>
                  <p className="text-[10px] text-softgray leading-tight mt-1">
                    Fokus fisik: cek kamar kotor/perbaikan &amp; kelola komplain fasilitas anak kos.
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-cream-200/60 text-[9px] text-blue-700 font-semibold">
                  🔒 Bebas dari seluruh data uang
                </div>
              </button>
            </div>
          </div>

          {/* 2. Identitas Staf */}
          <div className="space-y-3 pt-2">
            <h4 className="font-heading font-black text-xs text-peach-600 uppercase tracking-wider">
              2. Data Identitas &amp; Kontak Staf
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Nama Lengkap Staf *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-softgray absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Nomor WhatsApp Staf
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-softgray absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="0812-3456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Alamat Email (Username Login) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-softgray absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="staf.dago@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-darkcocoa block">
                    Kata Sandi Login *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] font-bold text-peach-600 hover:text-peach-700 flex items-center gap-1"
                  >
                    <Dice5 className="w-3 h-3" />
                    <span>Acak Sandi</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-softgray absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-9 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-softgray hover:text-darkcocoa"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-softgray" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Penugasan Cabang & Status */}
          <div className="space-y-3 pt-2">
            <h4 className="font-heading font-black text-xs text-peach-600 uppercase tracking-wider">
              3. Penugasan Cabang Kos &amp; Status Akun
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Cabang Kos yang Ditugaskan
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-softgray absolute left-3 top-2.5 pointer-events-none" />
                  <select
                    value={assignedPropertyId}
                    onChange={(e) => setAssignedPropertyId(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl pl-9 pr-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  >
                    <option value="all">🏢 Semua Cabang Kos (Global)</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        📍 {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-darkcocoa block mb-1">
                  Status Keaktifan Akun
                </label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full py-2 px-3.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-matcha-50 border-matcha-200 text-matcha-700'
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-matcha-500' : 'bg-red-500'}`} />
                    <span>{isActive ? 'Akun Aktif (Bisa Login)' : 'Akun Dinonaktifkan (Diblokir)'}</span>
                  </span>
                  <span className="text-[10px] text-softgray underline">Klik ubah</span>
                </button>
              </div>
            </div>
          </div>

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
              <Sparkles className="w-4 h-4" />
              <span>{staff ? 'Simpan Perubahan Staf' : 'Buat Akun Staf Sekarang'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

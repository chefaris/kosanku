'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  KeyRound,
  X,
  Dice5,
  Copy,
  Check,
  MessageCircle,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  CreditCard,
  Wrench
} from 'lucide-react';
import { TenantStaffUser } from '../../lib/store/useKosStore';

export interface ResetStaffPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: TenantStaffUser | null;
  onSaved: (message: string) => void;
  onUpdatePassword: (staffId: string, newPass: string) => void;
}

export const ResetStaffPasswordModal: React.FC<ResetStaffPasswordModalProps> = ({
  isOpen,
  onClose,
  staff,
  onSaved,
  onUpdatePassword
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateCutePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let randomStr = 'paws';
    for (let i = 0; i < 4; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const finalPass = `${randomStr}!`;
    setNewPassword(finalPass);
    setCopied(false);
  };

  useEffect(() => {
    if (isOpen && staff) {
      generateCutePassword();
      setErrorMessage(null);
      setCopied(false);
    }
  }, [isOpen, staff]);

  if (!isOpen || !staff) return null;

  const handleCopy = () => {
    if (!newPassword.trim()) return;
    navigator.clipboard.writeText(newPassword.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveAndClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.trim().length < 6) {
      setErrorMessage('Kata sandi staf minimal harus 6 karakter.');
      return;
    }

    onUpdatePassword(staff.id, newPassword.trim());
    onSaved(`Kata sandi untuk staf ${staff.name} berhasil diperbarui! 🔑`);
    onClose();
  };

  const handleSendWhatsApp = () => {
    if (!newPassword.trim() || newPassword.trim().length < 6) {
      setErrorMessage('Kata sandi staf minimal harus 6 karakter.');
      return;
    }

    onUpdatePassword(staff.id, newPassword.trim());

    const cleanPhone = staff.phone.replace(/\D/g, '').replace(/^0/, '62');
    const roleLabel =
      staff.role === 'cashier'
        ? 'Staf Kasir & Resepsionis'
        : staff.role === 'manager'
        ? 'Manajer Kos'
        : 'Penjaga Kos';

    const msg = encodeURIComponent(
      `Halo Kak ${staff.name} 👋,\n\nBerikut adalah akses login akun ${roleLabel} Anda di portal pawskost 🐾:\n` +
      `📧 Email: ${staff.email}\n` +
      `🔑 Password Baru: ${newPassword.trim()}\n\n` +
      `Silakan masuk melalui halaman login aplikasi. Terima kasih!`
    );

    if (cleanPhone && cleanPhone.length > 5) {
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    }
    onSaved(`Kata sandi ${staff.name} diperbarui & tautan WhatsApp disiapkan! 💬`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-body">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-darkcocoa to-darkcocoa/90 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-peach-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-white">
                Ubah Sandi Akun Staf
              </h3>
              <p className="text-[11px] text-cream-200">
                Reset kata sandi staf dan kirimkan langsung via WhatsApp
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

        {/* Body */}
        <form onSubmit={handleSaveAndClose} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Staff Info Card */}
          <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-darkcocoa flex items-center gap-1.5 text-xs">
                <User className="w-3.5 h-3.5 text-peach-500" />
                {staff.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-peach-100 text-peach-700">
                {staff.role === 'cashier' ? 'Staf Kasir' : staff.role === 'manager' ? 'Manajer Kos' : 'Penjaga Kos'}
              </span>
            </div>
            <p className="text-[11px] text-softgray font-mono">{staff.email}</p>
            <p className="text-[11px] text-softgray font-semibold">WA: {staff.phone}</p>
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 font-bold text-xs">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* New Password Input with Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-darkcocoa block text-xs">
                Kata Sandi Baru Staf *
              </label>
              <button
                type="button"
                onClick={generateCutePassword}
                className="text-[11px] font-bold text-peach-600 hover:text-peach-700 flex items-center gap-1 hover:underline transition-all"
              >
                <Dice5 className="w-3.5 h-3.5" />
                <span>Buat Sandi Acak</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-cream-50 border border-cream-200 rounded-2xl pl-4 pr-20 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400 font-mono tracking-wider font-bold"
              />
              <div className="absolute right-2.5 top-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded-lg hover:bg-cream-200 text-softgray hover:text-darkcocoa transition-colors"
                  title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded-lg hover:bg-cream-200 text-peach-600 hover:text-peach-700 transition-colors"
                  title="Salin ke clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-matcha-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {copied && (
              <p className="text-[10px] text-matcha-700 font-bold mt-1 flex items-center gap-1 animate-in fade-in">
                <Check className="w-3 h-3" /> Kata sandi berhasil disalin ke clipboard!
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Simpan Kata Sandi Baru</span>
            </button>

            {staff.phone && staff.phone !== '-' && (
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full py-2.5 px-4 rounded-2xl bg-matcha-50 hover:bg-matcha-100 text-matcha-700 border border-matcha-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-matcha-600" />
                <span>Simpan &amp; Kirim Info via WhatsApp</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl text-softgray hover:text-darkcocoa font-bold text-[11px] transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

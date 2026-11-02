'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  ShieldCheck,
  Building2,
  Mail,
  Phone
} from 'lucide-react';
import { useKosStore, SaaSUserAccount } from '../../lib/store/useKosStore';

export interface ResetTenantPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: SaaSUserAccount | null;
  onSaved?: (message: string) => void;
}

export const ResetTenantPasswordModal: React.FC<ResetTenantPasswordModalProps> = ({
  isOpen,
  onClose,
  account,
  onSaved
}) => {
  const { resetTenantPassword } = useKosStore();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate a friendly, secure random password
  const generateRandomPassword = () => {
    const prefixes = ['paws', 'mimi', 'kosan', 'juragan', 'cantik', 'kucing'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const symbols = ['!', '@', '#', '*'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const gen = `${randomPrefix}${randomDigits}${randomSymbol}`;
    setPassword(gen);
    setErrorMessage(null);
  };

  useEffect(() => {
    if (account && isOpen) {
      // Default to existing password if available, or generate a fresh suggestion
      setPassword(account.password || 'pawskost123!');
      setShowPassword(true);
      setCopied(false);
      setErrorMessage(null);
    }
  }, [account, isOpen]);

  if (!isOpen || !account) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    const res = resetTenantPassword(account.id, password.trim());
    if (res.success) {
      if (onSaved) {
        onSaved(res.message);
      }
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleSaveAndCopy = () => {
    if (password.trim().length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    const res = resetTenantPassword(account.id, password.trim());
    if (res.success) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(password.trim());
        setCopied(true);
      }
      if (onSaved) {
        onSaved(`Kata sandi ${account.name} berhasil diubah & disalin ke clipboard! 📋`);
      }
      setTimeout(() => {
        onClose();
      }, 600);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleSendWhatsApp = () => {
    if (password.trim().length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    resetTenantPassword(account.id, password.trim());

    const cleanPhone = account.phone.replace(/\D/g, '').replace(/^0/, '62');
    const msg = encodeURIComponent(
      `Halo Bu/Pak *${account.name}* (${account.kosName}),\n\nKata sandi akun *pawskost* Anda telah diperbarui oleh Super Admin:\n\n📧 *Email:* ${account.email}\n🔑 *Kata Sandi Baru:* ${password.trim()}\n\nSilakan masuk kembali ke dashboard Anda di:\nhttps://pawskost.rumahsoftware.site/login\n\nTerima kasih! 🐾`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    if (onSaved) {
      onSaved(`Kata sandi diperbarui dan diarahkan ke WhatsApp ${account.name}! 💬`);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-cream-200 overflow-hidden text-darkcocoa"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-cream-100 flex items-center justify-between bg-gradient-to-r from-peach-50/60 to-cream-50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-peach-500 text-white flex items-center justify-center shadow-cute">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-heading font-black text-darkcocoa">
                  Ubah Kata Sandi Tenant
                </h3>
                <p className="text-xs text-softgray">
                  Atur ulang akses login pemilik kos
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-softgray hover:text-darkcocoa hover:bg-cream-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-bold">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Account Card Summary */}
            <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-darkcocoa">{account.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-peach-100 text-peach-700 font-bold">
                  {account.planName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-softgray text-[11px]">
                <Building2 className="w-3.5 h-3.5 text-peach-500 flex-shrink-0" />
                <span className="truncate">{account.kosName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-softgray text-[11px]">
                <Mail className="w-3.5 h-3.5 text-peach-500 flex-shrink-0" />
                <span className="truncate font-mono">{account.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-softgray text-[11px]">
                <Phone className="w-3.5 h-3.5 text-matcha-600 flex-shrink-0" />
                <span className="font-mono">{account.phone}</span>
              </div>
            </div>

            {/* Password Input & Generator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-darkcocoa">
                  Kata Sandi Baru *
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-[11px] font-bold text-peach-600 hover:text-peach-700 flex items-center gap-1 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Buat Sandi Acak 🎲</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-cream-50 border border-cream-200 rounded-2xl pl-3.5 pr-10 py-3 text-xs sm:text-sm text-darkcocoa font-mono font-bold focus:outline-none focus:border-peach-400 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-softgray hover:text-darkcocoa transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-softgray mt-1">
                Kata sandi baru akan langsung aktif dan dapat digunakan tenant untuk login.
              </p>
            </div>

            {/* Quick Actions Row */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSaveAndCopy}
                className="w-full py-2.5 px-4 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersimpan & Disalin! ✨' : 'Simpan & Salin Password 📋'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full py-2.5 px-4 rounded-2xl bg-matcha-500 hover:bg-matcha-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Simpan &amp; Kirim via WhatsApp 💬</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  MapPin,
  Users2,
  Phone,
  Layers,
  CreditCard,
  Sparkles,
  Save
} from 'lucide-react';
import { Property, useKosStore } from '../../lib/store/useKosStore';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProperty?: Property | null;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  isOpen,
  onClose,
  editingProperty
}) => {
  const { addProperty, updateProperty } = useKosStore();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<Property['type']>('Campur');
  const [floors, setFloors] = useState<number>(2);
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  useEffect(() => {
    if (editingProperty) {
      setName(editingProperty.name);
      setAddress(editingProperty.address);
      setType(editingProperty.type);
      setFloors(editingProperty.floors || 2);
      setManagerName(editingProperty.managerName || '');
      setManagerPhone(editingProperty.managerPhone || '');
      setBankName(editingProperty.bankName || '');
      setAccountNumber(editingProperty.accountNumber || '');
      setAccountHolder(editingProperty.accountHolder || '');
    } else {
      setName('');
      setAddress('');
      setType('Campur');
      setFloors(2);
      setManagerName('');
      setManagerPhone('');
      setBankName('BCA');
      setAccountNumber('');
      setAccountHolder('');
    }
  }, [editingProperty, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    if (editingProperty) {
      updateProperty(editingProperty.id, {
        name,
        address,
        type,
        floors: Number(floors) || 1,
        managerName: managerName.trim() || undefined,
        managerPhone: managerPhone.trim() || undefined,
        bankName: bankName.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
        accountHolder: accountHolder.trim() || undefined
      });
    } else {
      addProperty({
        name,
        address,
        type,
        floors: Number(floors) || 1,
        managerName: managerName.trim() || undefined,
        managerPhone: managerPhone.trim() || undefined,
        bankName: bankName.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
        accountHolder: accountHolder.trim() || undefined
      });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-darkcocoa/50"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-cute overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 md:p-6 bg-gradient-to-r from-peach-100/60 to-sakura-100/60 border-b border-cream-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-peach-500 text-white flex items-center justify-center shadow-cute">
                <Building2 className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                  {editingProperty ? 'Edit Cabang Kos' : 'Tambah Cabang Kos Baru'} 🏢
                </h3>
                <p className="font-body text-xs text-softgray">
                  {editingProperty
                    ? 'Perbarui detail data cabang kos ini'
                    : 'Daftarkan cabang atau area kos-kosan baru Anda'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-softgray hover:text-darkcocoa hover:bg-cream-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 md:p-6 overflow-y-auto space-y-4 font-body">
            {/* Nama Cabang */}
            <div>
              <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                Nama Cabang Kos <span className="text-peach-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: KosanKu Putri Sukajadi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                />
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div>
              <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                Alamat Lokasi Kos <span className="text-peach-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-softgray absolute left-3.5 top-3" />
                <textarea
                  required
                  rows={2}
                  placeholder="Jl. Sukajadi No. 88, Bandung..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium resize-none"
                />
              </div>
            </div>

            {/* Grid: Tipe Kos & Jumlah Lantai */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                  Tipe Kos
                </label>
                <div className="relative">
                  <Users2 className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Property['type'])}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                  >
                    <option value="Campur">Campur (Putra & Putri)</option>
                    <option value="Putri">Khusus Putri</option>
                    <option value="Putra">Khusus Putra</option>
                    <option value="Pasutri">Pasutri (Pasangan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                  Jumlah Lantai
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section: Penjaga / Pengelola Kos */}
            <div className="pt-2 border-t border-cream-100">
              <h4 className="text-xs font-extrabold text-softgray uppercase tracking-wider mb-3">
                Kontak Penjaga / Admin Cabang (Opsional)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama Penjaga (cth: Pak Asep)"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                />
                <div className="relative">
                  <Phone className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="No. WA Penjaga"
                    value={managerPhone}
                    onChange={(e) => setManagerPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section: Rekening Bank Khusus Cabang */}
            <div className="pt-2 border-t border-cream-100">
              <h4 className="text-xs font-extrabold text-softgray uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-peach-500" />
                <span>Rekening Bank Pembayaran Cabang (Opsional)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Bank (BCA/Mandiri/BRI)"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-xs font-medium"
                />
                <input
                  type="text"
                  placeholder="No. Rekening"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-xs font-medium"
                />
                <input
                  type="text"
                  placeholder="Atas Nama"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-xs font-medium"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-cream-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-softgray hover:bg-cream-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-heading font-bold text-sm shadow-cute flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                <span>{editingProperty ? 'Simpan Perubahan' : 'Daftarkan Cabang'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

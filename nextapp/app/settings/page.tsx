'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  MessageSquare,
  Home,
  Save,
  CheckCircle2,
  Sparkles,
  Building,
  MapPin,
  Phone,
  User,
  Hash,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Building2,
  Tag,
  Check
} from 'lucide-react';
import Image from 'next/image';
import { useKosStore, Property } from '../lib/store/useKosStore';
import { PropertyModal } from '../components/ui/PropertyModal';
import { PlanLimitModal } from '../components/ui/PlanLimitModal';

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    resetToDefaultData,
    properties,
    deleteProperty,
    rooms,
    availableFacilities,
    addFacility,
    deleteFacility,
    canAddProperty
  } = useKosStore();

  const [bankName, setBankName] = useState(settings.bankName);
  const [accountNumber, setAccountNumber] = useState(settings.accountNumber);
  const [accountHolder, setAccountHolder] = useState(settings.accountHolder);
  const [waTemplate, setWaTemplate] = useState(settings.waTemplate);
  const [kosName, setKosName] = useState(settings.kosName);
  const [kosAddress, setKosAddress] = useState(settings.kosAddress);
  const [kosPhone, setKosPhone] = useState(settings.kosPhone);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Property Modal State
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // SaaS Quota Limit Modal State
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  const [planLimitData, setPlanLimitData] = useState<{ current: number; max: number; planName: string } | null>(null);

  // New facility input state
  const [newFacilityName, setNewFacilityName] = useState('');

  useEffect(() => {
    setBankName(settings.bankName);
    setAccountNumber(settings.accountNumber);
    setAccountHolder(settings.accountHolder);
    setWaTemplate(settings.waTemplate);
    setKosName(settings.kosName);
    setKosAddress(settings.kosAddress);
    setKosPhone(settings.kosPhone);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    updateSettings({
      bankName,
      accountNumber,
      accountHolder,
      waTemplate,
      kosName,
      kosAddress,
      kosPhone
    });

    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('Pengaturan berhasil disimpan dengan rapi! ✨');
      setTimeout(() => setToastMessage(null), 3000);
    }, 400);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data kamar, penghuni, dan tagihan kembali ke data percontohan default?')) {
      resetToDefaultData();
      setToastMessage('Seluruh data berhasil direset ke data percontohan awal! 🔄');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleAddFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityName.trim()) return;
    addFacility(newFacilityName.trim());
    setNewFacilityName('');
    setToastMessage(`Fasilitas "${newFacilityName.trim()}" ditambahkan! 🌸`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDeleteFacility = (fac: string) => {
    if (confirm(`Hapus fasilitas "${fac}" dari master daftar fasilitas?`)) {
      deleteFacility(fac);
      setToastMessage(`Fasilitas "${fac}" dihapus.`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleDeletePropertyConfirm = (prop: Property) => {
    if (properties.length <= 1) {
      alert('Anda minimal harus memiliki 1 cabang kos.');
      return;
    }
    if (confirm(`Hapus cabang "${prop.name}" beserta seluruh data kamar dan tagihan di dalamnya? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteProperty(prop.id);
      setToastMessage(`Cabang "${prop.name}" berhasil dihapus.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-8 max-w-5xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 font-body text-darkcocoa">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-5 right-5 z-50 bg-matcha-400 text-white px-5 py-3 rounded-2xl shadow-cute flex items-center gap-3 text-sm font-semibold"
          >
            <Sparkles className="w-5 h-5 text-matcha-50 animate-spin" strokeWidth={1.75} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight flex items-center gap-2">
          <span>Pengaturan KosanKu</span>
          <span className="text-2xl">⚙️</span>
        </h1>
        <p className="text-softgray text-xs sm:text-sm">
          Kelola cabang/area kos, master fasilitas yang dapat ditambah &amp; dihapus, rekening bank, dan pesan pengingat WA.
        </p>
      </motion.div>

      {/* ======================================================== */}
      {/* SEKSI 1: MANAJEMEN CABANG KOS (MULTI-PROPERTY)           */}
      {/* ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-4 sm:p-6 md:p-7 shadow-cute border border-cream-200 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-500">
              <Building2 className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-darkcocoa">
                Daftar Cabang &amp; Area KosanKu
              </h2>
              <p className="text-xs text-softgray">
                Kelola multiple properti atau lokasi kos yang Anda miliki
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const quota = canAddProperty();
              if (!quota.allowed) {
                setPlanLimitData({
                  current: quota.current,
                  max: quota.max,
                  planName: quota.planName
                });
                setIsPlanLimitModalOpen(true);
                return;
              }
              setEditingProperty(null);
              setIsPropertyModalOpen(true);
            }}
            className="bg-peach-500 hover:bg-peach-400 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-cute flex items-center gap-1.5 transition-transform active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Tambah Cabang Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {properties.map((prop) => {
            const propRooms = rooms.filter((r) => r.propertyId === prop.id);
            return (
              <div
                key={prop.id}
                className="p-4 rounded-2xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50 transition-colors space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-darkcocoa">{prop.name}</h3>
                      <p className="text-[11px] text-softgray flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-peach-500 flex-shrink-0" />
                        <span className="line-clamp-1">{prop.address}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-peach-100 text-peach-600">
                      {prop.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-softgray mt-2 pt-2 border-t border-cream-200">
                    <span>{propRooms.length} Kamar</span>
                    <span>•</span>
                    <span>{prop.floors || 2} Lantai</span>
                    {prop.managerName && (
                      <>
                        <span>•</span>
                        <span>PJ: {prop.managerName}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-cream-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProperty(prop);
                      setIsPropertyModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-cream-200 hover:border-peach-400 text-darkcocoa text-xs font-bold flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3 text-peach-500" />
                    <span>Edit Cabang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePropertyConfirm(prop)}
                    disabled={properties.length <= 1}
                    className="p-1.5 rounded-xl text-softgray hover:text-red-500 hover:bg-red-50 disabled:opacity-30"
                    title={properties.length <= 1 ? 'Minimal harus ada 1 cabang kos' : 'Hapus cabang ini'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ======================================================== */}
      {/* SEKSI 2: KELOLA MASTER FASILITAS KOS (EDITABLE)          */}
      {/* ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 md:p-7 shadow-cute border border-cream-200 space-y-4"
      >
        <div className="flex items-center gap-3 border-b border-cream-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-sakura-50 flex items-center justify-center text-sakura-500">
            <Tag className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-heading font-extrabold text-darkcocoa">
              Kelola Master Fasilitas Kos
            </h2>
            <p className="text-xs text-softgray">
              Tambah atau hapus fitur fasilitas yang dapat dipilih saat pembuatan &amp; edit kamar
            </p>
          </div>
        </div>

        {/* List of active facilities with delete action */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-darkcocoa block">
            Daftar Fasilitas Aktif ({availableFacilities.length} Fitur):
          </label>
          <div className="flex flex-wrap gap-2">
            {availableFacilities.map((fac) => (
              <span
                key={fac}
                className="px-3.5 py-1.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs font-bold text-darkcocoa flex items-center gap-2 group hover:border-peach-300"
              >
                <span>{fac}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteFacility(fac)}
                  className="w-4 h-4 rounded-full bg-cream-200 hover:bg-red-100 text-softgray hover:text-red-500 flex items-center justify-center text-[10px] transition-colors"
                  title="Hapus fasilitas ini"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Input Add New Facility Form */}
        <form onSubmit={handleAddFacilitySubmit} className="pt-2 flex items-center gap-2 max-w-md">
          <input
            type="text"
            required
            placeholder="Ketik fasilitas baru (misal: Water Heater, Smart TV)..."
            value={newFacilityName}
            onChange={(e) => setNewFacilityName(e.target.value)}
            className="flex-1 bg-cream-50 border border-cream-200 rounded-2xl px-4 py-2 text-xs font-medium text-darkcocoa focus:outline-none focus:border-peach-400"
          />
          <button
            type="submit"
            className="bg-sakura-400 hover:bg-sakura-500 text-white font-bold text-xs px-4 py-2 rounded-2xl shadow-sm transition-all"
          >
            + Tambah
          </button>
        </form>
      </motion.div>

      {/* ======================================================== */}
      {/* SEKSI 3: PROFIL KOS, BANK & PESAN WA                     */}
      {/* ======================================================== */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Kos */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-7 shadow-cute border border-cream-200 space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-cream-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-500">
              <Home className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-darkcocoa">
                Profil Utama Usaha Kos
              </h2>
              <p className="text-xs text-softgray">Informasi nama brand kos dan kontak pemilik</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-darkcocoa block mb-1">Nama Usaha Kos</label>
              <input
                type="text"
                required
                value={kosName}
                onChange={(e) => setKosName(e.target.value)}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-darkcocoa block mb-1">Nomor Telepon / WA Pemilik</label>
              <input
                type="text"
                required
                value={kosPhone}
                onChange={(e) => setKosPhone(e.target.value)}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-bold text-darkcocoa block mb-1">Kota / Domisili Operasional</label>
            <input
              type="text"
              required
              value={kosAddress}
              onChange={(e) => setKosAddress(e.target.value)}
              className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
            />
          </div>
        </motion.div>

        {/* Rekening Pembayaran Default */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-7 shadow-cute border border-cream-200 space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-cream-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-matcha-50 flex items-center justify-center text-matcha-600">
              <CreditCard className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-darkcocoa">
                Rekening Bank Pembayaran Sewa Utama
              </h2>
              <p className="text-xs text-softgray">
                Rekening tujuan transfer yang dicantumkan pada kuitansi dan pesan WhatsApp
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-darkcocoa block mb-1">Nama Bank</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-darkcocoa block mb-1">Nomor Rekening</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-mono font-bold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-darkcocoa block mb-1">Atas Nama Pemilik</label>
              <input
                type="text"
                required
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa text-xs font-semibold focus:outline-none focus:border-peach-400 focus:bg-white"
              />
            </div>
          </div>
        </motion.div>

        {/* Template WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-7 shadow-cute border border-cream-200 space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-cream-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-500">
              <MessageSquare className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-darkcocoa">
                Format Template WhatsApp Otomatis
              </h2>
              <p className="text-xs text-softgray">
                Gunakan variabel [nama], [kamar], [nominal], [tanggal], [bank], [pemilik]
              </p>
            </div>
          </div>

          <textarea
            rows={4}
            required
            value={waTemplate}
            onChange={(e) => setWaTemplate(e.target.value)}
            className="w-full bg-cream-50 border border-cream-200 rounded-2xl p-4 text-xs font-mono text-darkcocoa leading-relaxed focus:outline-none focus:border-peach-400 focus:bg-white"
          />
        </motion.div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-2xl text-xs font-bold text-softgray hover:text-peach-600 hover:bg-peach-50 border border-cream-200 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Data Demo Awal</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto justify-center bg-peach-500 hover:bg-peach-400 text-white px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-cute flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
          </button>
        </div>
      </form>

      {/* Property Modal for Add / Edit */}
      <PropertyModal
        isOpen={isPropertyModalOpen}
        onClose={() => {
          setIsPropertyModalOpen(false);
          setEditingProperty(null);
        }}
        editingProperty={editingProperty}
      />

      {/* SaaS Property Quota Limit Modal */}
      {planLimitData && (
        <PlanLimitModal
          isOpen={isPlanLimitModalOpen}
          onClose={() => setIsPlanLimitModalOpen(false)}
          type="property"
          current={planLimitData.current}
          max={planLimitData.max}
          planName={planLimitData.planName}
        />
      )}
    </div>
  );
}

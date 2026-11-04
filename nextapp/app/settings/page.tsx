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
  Check,
  Palette,
  Layers,
  BedDouble,
  DollarSign,
  Play,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Users,
  UserPlus,
  Wrench,
  Crown,
  ShieldAlert,
  Dice5
} from 'lucide-react';
import Image from 'next/image';
import { useKosStore, Property, AppTheme, TenantStaffUser, TenantStaffRole } from '../lib/store/useKosStore';
import { PropertyModal } from '../components/ui/PropertyModal';
import { PlanLimitModal } from '../components/ui/PlanLimitModal';
import { ManageRoomTypesModal } from '../components/ui/ManageRoomTypesModal';
import { ManageMasterFinanceModal } from '../components/ui/ManageMasterFinanceModal';
import { StaffUserModal } from '../components/admin/StaffUserModal';
import { ResetStaffPasswordModal } from '../components/admin/ResetStaffPasswordModal';
import { supabase } from '../lib/supabase';

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
    canAddProperty,
    appTheme,
    setAppTheme,
    currentUser,
    changeCurrentPassword,
    staffUsers,
    addStaffUser,
    updateStaffUser,
    deleteStaffUser,
    toggleStaffStatus,
    setPreviewRole,
    getActiveRole
  } = useKosStore();

  // Staff Management Modals State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<TenantStaffUser | null>(null);

  const [isResetStaffPassOpen, setIsResetStaffPassOpen] = useState(false);
  const [selectedStaffForPassword, setSelectedStaffForPassword] = useState<TenantStaffUser | null>(null);

  const activeRole = getActiveRole();

  const handleOpenAddStaff = () => {
    setSelectedStaffForEdit(null);
    setIsStaffModalOpen(true);
  };

  const handleOpenEditStaff = (staff: TenantStaffUser) => {
    setSelectedStaffForEdit(staff);
    setIsStaffModalOpen(true);
  };

  const handleOpenResetStaffPassword = (staff: TenantStaffUser) => {
    setSelectedStaffForPassword(staff);
    setIsResetStaffPassOpen(true);
  };

  const handleSaveStaff = (data: {
    name: string;
    email: string;
    phone: string;
    role: TenantStaffRole;
    password: string;
    assignedPropertyId: string;
    isActive: boolean;
  }) => {
    if (selectedStaffForEdit) {
      updateStaffUser(selectedStaffForEdit.id, data);
      showToast(`Data staf ${data.name} berhasil diperbarui! ✨`);
    } else {
      addStaffUser({
        ...data,
        ownerId: currentUser?.id || 'usr-acct-1'
      });
      showToast(`Akun staf ${data.name} berhasil ditambahkan! 🎉`);
    }
  };

  const handleDeleteStaff = (staff: TenantStaffUser) => {
    if (confirm(`Yakin ingin menghapus akun staf ${staff.name}?`)) {
      deleteStaffUser(staff.id);
      showToast(`Akun staf ${staff.name} telah dihapus.`);
    }
  };

  const handleSimulateRole = (role: TenantStaffRole, name: string) => {
    setPreviewRole(role);
    showToast(`Beralih ke mode simulasi hak akses ${role === 'cashier' ? 'Kasir' : role === 'manager' ? 'Manajer' : 'Penjaga'} (${name}) 🚀`);
  };

  const [bankName, setBankName] = useState(settings.bankName);
  const [accountNumber, setAccountNumber] = useState(settings.accountNumber);
  const [accountHolder, setAccountHolder] = useState(settings.accountHolder);
  const [waTemplate, setWaTemplate] = useState(settings.waTemplate);
  const [kosName, setKosName] = useState(settings.kosName);
  const [kosAddress, setKosAddress] = useState(settings.kosAddress);
  const [kosPhone, setKosPhone] = useState(settings.kosPhone);

  const [isSaving, setIsSaving] = useState(false);

  // Property Modal State
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Quota Limit Modal State
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  const [planLimitData, setPlanLimitData] = useState<{ current: number; max: number; planName: string } | null>(null);

  // Master Modals State
  const [isRoomTypesModalOpen, setIsRoomTypesModalOpen] = useState(false);
  const [isMasterFinanceModalOpen, setIsMasterFinanceModalOpen] = useState(false);

  // New facility input state
  const [newFacilityName, setNewFacilityName] = useState('');

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    setBankName(settings.bankName);
    setAccountNumber(settings.accountNumber);
    setAccountHolder(settings.accountHolder);
    setWaTemplate(settings.waTemplate);
    setKosName(settings.kosName);
    setKosAddress(settings.kosAddress);
    setKosPhone(settings.kosPhone);
  }, [settings]);

  // Theme palettes configuration - Soft Pastel Aesthetics (Item 15 & Update)
  const themeOptions: {
    id: AppTheme;
    name: string;
    desc: string;
    previewBg: string;
    badgeColor: string;
    borderActive: string;
  }[] = [
    {
      id: 'paw-peach',
      name: 'Soft Paw Peach 🐾',
      desc: 'Peach pastel hangat, ceria & lembut (Tema Utama)',
      previewBg: 'bg-gradient-to-r from-[#FF8E72] to-[#FFDDD3]',
      badgeColor: 'bg-[#FF8E72] text-white',
      borderActive: 'border-[#FF8E72] ring-2 ring-[#FF8E72]/30'
    },
    {
      id: 'matcha-mint',
      name: 'Soft Matcha Sage 🍃',
      desc: 'Sage green pastel segar & teduh',
      previewBg: 'bg-gradient-to-r from-[#6EAA81] to-[#CFE5D8]',
      badgeColor: 'bg-[#6EAA81] text-white',
      borderActive: 'border-[#6EAA81] ring-2 ring-[#6EAA81]/30'
    },
    {
      id: 'sakura-blossom',
      name: 'Soft Sakura Blossom 🌸',
      desc: 'Baby pink pastel manis & lembut',
      previewBg: 'bg-gradient-to-r from-[#D77992] to-[#F6D3DC]',
      badgeColor: 'bg-[#D77992] text-white',
      borderActive: 'border-[#D77992] ring-2 ring-[#D77992]/30'
    },
    {
      id: 'ocean-blue',
      name: 'Soft Sky Pastel ☁️',
      desc: 'Biru langit pastel teduh & rapi',
      previewBg: 'bg-gradient-to-r from-[#5FA5CE] to-[#C7E2F1]',
      badgeColor: 'bg-[#5FA5CE] text-white',
      borderActive: 'border-[#5FA5CE] ring-2 ring-[#5FA5CE]/30'
    },
    {
      id: 'lavender-cozy',
      name: 'Soft Lilac Cozy 💜',
      desc: 'Lavender pastel santai & aesthetic',
      previewBg: 'bg-gradient-to-r from-[#9F87DA] to-[#E0D7F5]',
      badgeColor: 'bg-[#9F87DA] text-white',
      borderActive: 'border-[#9F87DA] ring-2 ring-[#9F87DA]/30'
    },
    {
      id: 'mocha-latte',
      name: 'Soft Mocha Latte ☕',
      desc: 'Kopi susu krem & biskuit hangat',
      previewBg: 'bg-gradient-to-r from-[#B18F6F] to-[#E7DACB]',
      badgeColor: 'bg-[#B18F6F] text-white',
      borderActive: 'border-[#B18F6F] ring-2 ring-[#B18F6F]/30'
    }
  ];

  const handleSelectTheme = (themeId: AppTheme) => {
    setAppTheme(themeId);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
      document.body.setAttribute('data-theme', themeId);
    }
    const themeName = themeOptions.find((t) => t.id === themeId)?.name || themeId;
    setToastMessage(`Tema warna aplikasi diubah ke ${themeName}! 🎨✨`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.trim().length < 6) {
      setPasswordError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
      return;
    }

    setIsChangingPassword(true);
    const result = changeCurrentPassword(newPassword);

    // Sync ke Supabase Auth jika sedang login di cloud session
    try {
      await supabase.auth.updateUser({ password: newPassword.trim() });
    } catch (err) {
      console.warn('Supabase password update:', err);
    }

    setIsChangingPassword(false);

    if (result.success) {
      setPasswordSuccess(result.message);
      setNewPassword('');
      setConfirmPassword('');
      setToastMessage(result.message);
      setTimeout(() => setPasswordSuccess(null), 4000);
    } else {
      setPasswordError(result.message);
    }
  };

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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight">
          Pengaturan pawskost
        </h1>
        <p className="text-softgray text-xs sm:text-sm">
          Sesuaikan tema warna aplikasi, cabang kos, master tipe kamar, fasilitas, dan rekening bank 🐾
        </p>
      </motion.div>

      {/* ======================================================== */}
      {/* ITEM 15: PILIHAN PATTERN TEMA WARNA APLIKASI (EDITABLE)   */}
      {/* ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-4 sm:p-6 md:p-7 shadow-cute border border-cream-200 space-y-4"
      >
        <div className="flex items-center gap-3 border-b border-cream-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-500">
            <Palette className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-heading font-extrabold text-darkcocoa">
              Pilihan Pattern Tema Warna Aplikasi
            </h2>
            <p className="text-xs text-softgray">
              Pilih palet warna yang Anda sukai untuk mengubah tampilan antarmuka pawskost secara instan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {themeOptions.map((item) => {
            const isSelected = (appTheme || 'paw-peach') === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTheme(item.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between group hover:scale-[1.02] ${
                  isSelected
                    ? `${item.borderActive} bg-cream-50/80 shadow-cute`
                    : 'border-cream-200 bg-white hover:border-peach-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-xs text-darkcocoa">
                      {item.name}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-peach-500 text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className={`h-8 rounded-xl ${item.previewBg} shadow-inner flex items-center px-3`} />
                  <p className="text-[11px] text-softgray leading-tight">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ======================================================== */}
      {/* SEKSI SHORTCUT: MASTER DATA (TIPE KAMAR & KEUANGAN)      */}
      {/* ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream-50 rounded-3xl p-5 border border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-peach-600 shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-darkcocoa">
              Master Data Operasional
            </h3>
            <p className="text-xs text-softgray">
              Kelola master jenis kamar kost dan master kategori pos keuangan dengan icon kustom
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsRoomTypesModalOpen(true)}
            className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-2xl bg-white hover:bg-cream-100 text-darkcocoa border border-cream-200 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <BedDouble className="w-4 h-4 text-peach-500" />
            <span>Kelola Tipe Kamar</span>
          </button>
          <button
            type="button"
            onClick={() => setIsMasterFinanceModalOpen(true)}
            className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-2xl bg-white hover:bg-cream-100 text-darkcocoa border border-cream-200 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <DollarSign className="w-4 h-4 text-matcha-600" />
            <span>Master Keuangan</span>
          </button>
        </div>
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
                Daftar Cabang &amp; Area pawskost
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

        {/* ======================================================== */}
        {/* SEKSI: MANAJEMEN TIM & HAK AKSES STAF KOS                */}
        {/* ======================================================== */}
        {activeRole === 'owner' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-4 sm:p-6 md:p-7 shadow-cute border border-cream-200 space-y-5"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-500 shadow-sm">
                  <Users className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-heading font-extrabold text-darkcocoa">
                      Manajemen Tim &amp; Hak Akses Staf Kos
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-peach-100 text-peach-700">
                      Multi-User
                    </span>
                  </div>
                  <p className="text-xs text-softgray mt-0.5">
                    Buat akun staf (kasir, manajer, atau penjaga kos) dengan hak akses terukur agar operasional tetap aman
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenAddStaff}
                className="bg-peach-500 hover:bg-peach-400 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-cute flex items-center justify-center gap-1.5 transition-transform active:scale-95 self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Tambah Staf Baru</span>
              </button>
            </div>

            {/* 3 Role Guidance Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/70 space-y-1">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Staf Kasir &amp; Resepsionis</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Bisa catat/update pembayaran sewa di <strong>/billing</strong>, cetak kwitansi &amp; struk thermal, serta <strong>cek ketersediaan kamar</strong> untuk anak kos baru.
                </p>
                <p className="text-[10px] text-amber-700 font-semibold pt-1 border-t border-amber-200/50">
                  🔒 Laba bersih, kas, &amp; rekening bank pemilik disembunyikan.
                </p>
              </div>

              <div className="p-3.5 bg-matcha-50/60 rounded-2xl border border-matcha-200/70 space-y-1">
                <div className="flex items-center gap-2 text-matcha-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-matcha-600" />
                  <span>Pengelola / Manajer Kos</span>
                </div>
                <p className="text-[11px] text-matcha-900 leading-relaxed">
                  Operasional harian: kelola kamar, check-in anak kos, buat tagihan bulanan, input beban kas harian, dan tiket perbaikan.
                </p>
                <p className="text-[10px] text-matcha-700 font-semibold pt-1 border-t border-matcha-200/50">
                  🔒 Rekening pencairan &amp; tagihan SaaS pemilik terproteksi.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/70 space-y-1">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span>Penjaga Kos &amp; Teknisi</span>
                </div>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  Fokus perawatan fisik bangunan: cek status kamar kotor/perbaikan dan tangani keluhan fasilitas di <strong>/maintenance</strong>.
                </p>
                <p className="text-[10px] text-blue-700 font-semibold pt-1 border-t border-blue-200/50">
                  🔒 Terisolasi penuh dari seluruh data finansial &amp; sewa.
                </p>
              </div>
            </div>

            {/* Staff List */}
            <div className="space-y-3 pt-1">
              <h3 className="font-heading font-black text-xs text-darkcocoa uppercase tracking-wider flex items-center justify-between">
                <span>Daftar Staf Kos Aktif ({staffUsers?.length || 0})</span>
                <span className="text-[11px] font-normal text-softgray lowercase">
                  *klik tombol uji akses untuk simulasi tampilan staf
                </span>
              </h3>

              {(!staffUsers || staffUsers.length === 0) ? (
                <div className="p-8 text-center bg-cream-50 rounded-2xl border border-cream-200 text-softgray text-xs space-y-2">
                  <Users className="w-8 h-8 mx-auto text-peach-300" />
                  <p className="font-bold text-darkcocoa">Belum ada akun staf operasional</p>
                  <p className="text-[11px]">
                    Tambahkan staf kasir atau penjaga kos agar mereka dapat login dengan hak akses terpisah yang aman.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {staffUsers.map((stf) => {
                    const assignedProp = properties.find((p) => p.id === stf.assignedPropertyId);
                    const propLabel = stf.assignedPropertyId === 'all' ? 'Semua Cabang' : (assignedProp?.name || 'Cabang Khusus');

                    return (
                      <div
                        key={stf.id}
                        className="p-4 rounded-2xl bg-cream-50/50 border border-cream-200/90 hover:border-peach-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                      >
                        {/* Left: Info Staf */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-heading font-black text-sm flex-shrink-0 shadow-xs ${
                            stf.role === 'cashier'
                              ? 'bg-amber-100 text-amber-700'
                              : stf.role === 'manager'
                              ? 'bg-matcha-100 text-matcha-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {stf.role === 'cashier' ? '💳' : stf.role === 'manager' ? '👔' : '🛠️'}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-heading font-extrabold text-sm text-darkcocoa truncate">
                                {stf.name}
                              </h4>

                              {/* Role Badge */}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                stf.role === 'cashier'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : stf.role === 'manager'
                                  ? 'bg-matcha-100 text-matcha-800 border border-matcha-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                {stf.role === 'cashier' ? 'Staf Kasir & Resepsionis' : stf.role === 'manager' ? 'Manajer Kos' : 'Penjaga Kos'}
                              </span>

                              {/* Status Badge */}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                stf.isActive
                                  ? 'bg-matcha-50 text-matcha-700 border border-matcha-200'
                                  : 'bg-red-50 text-red-600 border border-red-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${stf.isActive ? 'bg-matcha-500' : 'bg-red-500'}`} />
                                {stf.isActive ? 'Aktif' : 'Dinonaktifkan'}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-softgray mt-1 flex-wrap">
                              <span className="font-mono">{stf.email}</span>
                              <span>•</span>
                              <span>WA: {stf.phone}</span>
                              <span>•</span>
                              <span className="font-semibold text-darkcocoa">📍 {propLabel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto">
                          {/* Tombol Simulasi Hak Akses */}
                          <button
                            type="button"
                            onClick={() => handleSimulateRole(stf.role, stf.name)}
                            className="py-1.5 px-3 rounded-xl bg-peach-50 hover:bg-peach-100 text-peach-700 border border-peach-200 font-extrabold text-[11px] flex items-center gap-1 transition-all hover:scale-105"
                            title="Uji tampilan aplikasi seperti yang dilihat staf ini"
                          >
                            <Eye className="w-3.5 h-3.5 text-peach-600" />
                            <span>Uji Akses</span>
                          </button>

                          {/* Tombol Sandi */}
                          <button
                            type="button"
                            onClick={() => handleOpenResetStaffPassword(stf)}
                            className="py-1.5 px-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-[11px] flex items-center gap-1 transition-colors"
                            title="Reset kata sandi staf"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-peach-500" />
                            <span>Sandi</span>
                          </button>

                          {/* Tombol Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditStaff(stf)}
                            className="py-1.5 px-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-[11px] flex items-center gap-1 transition-colors"
                            title="Edit data staf"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-softgray" />
                            <span>Edit</span>
                          </button>

                          {/* Toggle Active Status */}
                          <button
                            type="button"
                            onClick={() => {
                              toggleStaffStatus(stf.id);
                              showToast(`Status staf ${stf.name} diubah menjadi ${stf.isActive ? 'Nonaktif' : 'Aktif'}.`);
                            }}
                            className={`p-1.5 rounded-xl border text-[11px] font-bold transition-colors ${
                              stf.isActive
                                ? 'bg-cream-100 text-softgray hover:text-darkcocoa hover:bg-cream-200 border-cream-200'
                                : 'bg-matcha-50 text-matcha-700 border-matcha-200'
                            }`}
                            title={stf.isActive ? 'Nonaktifkan akun staf ini' : 'Aktifkan akun staf ini'}
                          >
                            {stf.isActive ? 'Blokir' : 'Aktifkan'}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(stf)}
                            className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                            title="Hapus akun staf ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Keamanan & Ubah Kata Sandi Akun Tenant */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-7 shadow-cute border border-cream-200 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-cream-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-peach-50 flex items-center justify-center text-peach-500">
                <KeyRound className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-heading font-extrabold text-darkcocoa">
                  Keamanan &amp; Ubah Kata Sandi Akun
                </h2>
                <p className="text-xs text-softgray">
                  Atur ulang kata sandi login untuk akun pemilik kos ini
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-cream-100 rounded-full text-[11px] font-semibold text-softgray">
              <ShieldCheck className="w-3.5 h-3.5 text-matcha-600" />
              <span>{currentUser?.email || 'Akun Aktif'}</span>
            </div>
          </div>

          {passwordSuccess && (
            <div className="p-3 bg-matcha-50 border border-matcha-200 rounded-2xl text-matcha-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-matcha-600 flex-shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="font-bold text-darkcocoa block mb-1.5 text-xs">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-2xl pl-3.5 pr-10 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400 focus:bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-softgray hover:text-darkcocoa transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-darkcocoa block mb-1.5 text-xs">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-2xl pl-3.5 pr-10 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400 focus:bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-softgray hover:text-darkcocoa transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              disabled={isChangingPassword || !newPassword}
              onClick={handleChangePassword}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-darkcocoa hover:bg-darkcocoa/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <KeyRound className="w-4 h-4 text-peach-400" />
              <span>{isChangingPassword ? 'Memproses...' : 'Ubah Kata Sandi 🔐'}</span>
            </button>
          </div>
        </motion.div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-2xl text-xs font-bold text-softgray hover:text-peach-600 hover:bg-peach-50 border border-cream-200 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset ke Data Demo Awal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('pawskost_bumper_seen');
                  window.dispatchEvent(new CustomEvent('play-pawskost-bumper'));
                }
              }}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-2xl text-xs font-bold text-darkcocoa hover:text-peach-600 bg-white hover:bg-peach-50 border border-cream-200 shadow-sm flex items-center gap-1.5 transition-colors"
              title="Putar video bumper intro aplikasi"
            >
              <Play className="w-4 h-4 text-peach-500 fill-peach-500" />
              <span>Putar Video Bumper 🎬</span>
            </button>
          </div>

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

      {/* Quota Limit Modal */}
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

      {/* Manage Room Types Modal */}
      <ManageRoomTypesModal
        isOpen={isRoomTypesModalOpen}
        onClose={() => setIsRoomTypesModalOpen(false)}
      />

      {/* Manage Master Finance Modal */}
      <ManageMasterFinanceModal
        isOpen={isMasterFinanceModalOpen}
        onClose={() => setIsMasterFinanceModalOpen(false)}
      />

      {/* Staff User Add/Edit Modal */}
      <StaffUserModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        staff={selectedStaffForEdit}
        properties={properties}
        onSave={handleSaveStaff}
      />

      {/* Reset Staff Password Modal */}
      <ResetStaffPasswordModal
        isOpen={isResetStaffPassOpen}
        onClose={() => setIsResetStaffPassOpen(false)}
        staff={selectedStaffForPassword}
        onSaved={(msg) => showToast(msg)}
        onUpdatePassword={(staffId, newPass) => {
          updateStaffUser(staffId, { password: newPass });
        }}
      />
    </div>
  );
}

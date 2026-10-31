'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Users,
  Search,
  Plus,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  X,
  Sparkles,
  Building2,
  AlertCircle,
  Edit2,
  Trash2,
  LogOut,
  UserCheck,
  HeartHandshake,
  MessageCircle,
  Key,
  Camera,
  IdCard,
  Briefcase
} from 'lucide-react';
import { useKosStore, Tenant } from '../lib/store/useKosStore';
import { MimiLoader } from '../components/ui/MimiLoader';

export default function TenantsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const {
    properties,
    activePropertyId,
    setActivePropertyId,
    tenants,
    rooms,
    checkInTenant,
    checkOutTenant,
    updateTenant,
    deleteTenant
  } = useKosStore();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'checked_out'>('active');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [isKtpModalOpen, setIsKtpModalOpen] = useState(false);
  const [ktpViewerData, setKtpViewerData] = useState<{ name: string; ktpPhoto: string; ktpNumber?: string } | null>(null);

  // Add / Edit Form state
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('08');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDayOfMonth, setDueDayOfMonth] = useState(1);
  const [depositAmount, setDepositAmount] = useState(500000);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Orang Tua');
  const [emergencyPhone, setEmergencyPhone] = useState('08');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [ktpPhoto, setKtpPhoto] = useState<string | null>(null);
  const [ktpNumber, setKtpNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  // Check-out options
  const [refundDeposit, setRefundDeposit] = useState(true);
  const [checkoutReason, setCheckoutReason] = useState('Selesai masa sewa');

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  // Multi-Property Reactive Filtering
  const activeProperty = properties.find((p) => p.id === activePropertyId);

  const propertyTenants = activePropertyId === 'all'
    ? tenants
    : tenants.filter((t) => t.propertyId === activePropertyId);

  const propertyRooms = activePropertyId === 'all'
    ? rooms
    : rooms.filter((r) => r.propertyId === activePropertyId);

  const vacantRooms = propertyRooms.filter((r) => r.status === 'vacant');

  const filteredTenants = propertyTenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tenant.roomNumber && tenant.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tenant.phone.includes(searchQuery);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && tenant.status === statusFilter;
  });

  // Handle Image Upload to Base64 Data URL
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    if (vacantRooms.length > 0) {
      setSelectedRoomId(vacantRooms[0].id);
    } else {
      setSelectedRoomId('');
    }
    setName('');
    setPhone('08');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDueDayOfMonth(new Date().getDate());
    setDepositAmount(500000);
    setEmergencyName('');
    setEmergencyRelation('Orang Tua');
    setEmergencyPhone('08');
    setProfilePhoto(null);
    setKtpPhoto(null);
    setKtpNumber('');
    setJobTitle('');
    setIsAddModalOpen(true);
  };

  const handleSaveAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedRoomId) return;

    checkInTenant(
      {
        name: name.trim(),
        phone: phone.trim(),
        startDate,
        dueDayOfMonth: Number(dueDayOfMonth),
        depositAmount: Number(depositAmount),
        depositStatus: 'paid',
        profilePhoto: profilePhoto || undefined,
        ktpPhoto: ktpPhoto || undefined,
        ktpNumber: ktpNumber.trim() || undefined,
        jobTitle: jobTitle.trim() || undefined,
        emergencyContact: {
          name: emergencyName.trim() || 'Wali Keluarga',
          relation: emergencyRelation,
          phone: emergencyPhone.trim()
        }
      },
      selectedRoomId
    );

    setIsAddModalOpen(false);
    showToast(`Penghuni baru "${name}" berhasil didaftarkan dan kamar siap huni! 🎉`);
  };

  const handleOpenEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setName(tenant.name);
    setPhone(tenant.phone);
    setStartDate(tenant.startDate);
    setDueDayOfMonth(tenant.dueDayOfMonth);
    setDepositAmount(tenant.depositAmount);
    setEmergencyName(tenant.emergencyContact?.name || '');
    setEmergencyRelation(tenant.emergencyContact?.relation || 'Orang Tua');
    setEmergencyPhone(tenant.emergencyContact?.phone || '');
    setProfilePhoto(tenant.profilePhoto || null);
    setKtpPhoto(tenant.ktpPhoto || null);
    setKtpNumber(tenant.ktpNumber || '');
    setJobTitle(tenant.jobTitle || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant || !name.trim()) return;

    updateTenant(selectedTenant.id, {
      name: name.trim(),
      phone: phone.trim(),
      startDate,
      dueDayOfMonth: Number(dueDayOfMonth),
      depositAmount: Number(depositAmount),
      profilePhoto: profilePhoto || undefined,
      ktpPhoto: ktpPhoto || undefined,
      ktpNumber: ktpNumber.trim() || undefined,
      jobTitle: jobTitle.trim() || undefined,
      emergencyContact: {
        name: emergencyName.trim(),
        relation: emergencyRelation,
        phone: emergencyPhone.trim()
      }
    });

    setIsEditModalOpen(false);
    setSelectedTenant(null);
    showToast(`Data penghuni "${name}" berhasil diperbarui! 💾`);
  };

  const handleOpenCheckOut = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setRefundDeposit(true);
    setCheckoutReason('Selesai masa sewa/kontrak');
    setIsCheckOutModalOpen(true);
  };

  const handleSaveCheckOut = () => {
    if (!selectedTenant) return;

    checkOutTenant(selectedTenant.id, {
      refundDeposit,
      reason: checkoutReason
    });

    setIsCheckOutModalOpen(false);
    setSelectedTenant(null);
    showToast(`Penghuni ${selectedTenant.name} berhasil check-out. Status kamar diperbarui ke Kosong 🌿`);
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    if (tenant.status === 'active') {
      alert('Penghuni masih aktif ngekos. Silakan lakukan proses Check-out terlebih dahulu.');
      return;
    }
    if (confirm(`Yakin ingin menghapus riwayat penghuni ${tenant.name}?`)) {
      deleteTenant(tenant.id);
      showToast(`Riwayat ${tenant.name} berhasil dihapus.`);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <MimiLoader message="Mimi sedang mengambil data anak kos... 🐾" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 font-body text-darkcocoa">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-5 right-5 z-50 bg-matcha-400 text-white px-5 py-3.5 rounded-2xl shadow-cute flex items-center gap-3 font-semibold text-sm"
          >
            <Sparkles className="w-5 h-5 text-matcha-50 animate-spin" strokeWidth={1.75} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Branch Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight flex items-center gap-2">
            <span>Direktori Penghuni</span>
            <span className="text-2xl">👥</span>
          </h1>
          <p className="text-softgray text-xs sm:text-sm mt-1">
            {activeProperty ? (
              <span className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-darkcocoa">{activeProperty.name}</span>
                <span>• {propertyTenants.filter((t) => t.status === 'active').length} Penghuni Aktif</span>
              </span>
            ) : (
              'Data kontak WhatsApp, arsip KTP, tanggal jatuh tempo sewa, uang deposit, dan kontak darurat seluruh cabang.'
            )}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-peach-500 hover:bg-peach-400 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-cute flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Tambah Penghuni Baru</span>
        </button>
      </div>

      {/* Search & Status Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, kamar (K-101), atau no WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-cream-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-darkcocoa focus:outline-none focus:border-peach-400 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
              statusFilter === 'active'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Aktif Ngekos ({propertyTenants.filter((t) => t.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('checked_out')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
              statusFilter === 'checked_out'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Riwayat Check-out ({propertyTenants.filter((t) => t.status === 'checked_out').length})
          </button>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredTenants.map((tenant) => {
          const tenantProp = properties.find((p) => p.id === tenant.propertyId);

          return (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-3xl p-5 shadow-cute border border-cream-200 flex flex-col justify-between space-y-4 relative"
            >
              <div>
                {/* Header card with Profile Photo */}
                <div className="flex items-start justify-between border-b border-cream-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-peach-100 to-sakura-100 flex items-center justify-center text-peach-600 font-heading font-extrabold text-base ring-2 ring-peach-200 shadow-sm overflow-hidden flex-shrink-0">
                      {tenant.profilePhoto ? (
                        <img
                          src={tenant.profilePhoto}
                          alt={tenant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {tenant.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                        {tenant.name}
                      </h3>
                      <p className="text-xs text-softgray flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-peach-500" />
                        <span>{tenant.phone}</span>
                      </p>
                      {tenant.jobTitle && (
                        <p className="text-[10px] text-peach-600 font-medium flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3" />
                          <span>{tenant.jobTitle}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="font-heading font-extrabold text-sm px-2.5 py-1 rounded-xl bg-peach-50 text-peach-600 border border-peach-200 inline-block">
                      {tenant.roomNumber || 'Kamar -'}
                    </span>
                    {activePropertyId === 'all' && tenantProp && (
                      <span className="text-[9px] font-bold text-softgray bg-cream-100 px-2 py-0.5 rounded-full">
                        {tenantProp.name.replace('KosanKu ', '')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Detail */}
                <div className="mt-3 space-y-2 text-xs bg-cream-50 p-3.5 rounded-2xl border border-cream-100">
                  <div className="flex items-center justify-between">
                    <span className="text-softgray flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-peach-400" />
                      <span>Mulai Sewa:</span>
                    </span>
                    <span className="font-semibold text-darkcocoa">{tenant.startDate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-softgray">Jatuh Tempo:</span>
                    <span className="font-bold text-peach-600">Tiap tgl {tenant.dueDayOfMonth}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-cream-200">
                    <span className="text-softgray">Uang Deposit:</span>
                    <span className="font-bold text-darkcocoa">
                      {formatRupiah(tenant.depositAmount)}
                      <span
                        className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          tenant.depositStatus === 'paid'
                            ? 'bg-matcha-100 text-matcha-700'
                            : tenant.depositStatus === 'refunded'
                            ? 'bg-cream-200 text-softgray'
                            : 'bg-peach-100 text-peach-600'
                        }`}
                      >
                        {tenant.depositStatus === 'paid'
                          ? 'Lunas'
                          : tenant.depositStatus === 'refunded'
                          ? 'Dikembalikan'
                          : 'Belum'}
                      </span>
                    </span>
                  </div>

                  {/* KTP Document Status & View Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-cream-200">
                    <span className="text-softgray flex items-center gap-1">
                      <IdCard className="w-3.5 h-3.5 text-peach-500" />
                      <span>Dokumen KTP:</span>
                    </span>
                    {tenant.ktpPhoto ? (
                      <button
                        onClick={() => {
                          setKtpViewerData({
                            name: tenant.name,
                            ktpPhoto: tenant.ktpPhoto!,
                            ktpNumber: tenant.ktpNumber
                          });
                          setIsKtpModalOpen(true);
                        }}
                        className="text-[11px] font-bold text-peach-600 hover:text-peach-700 bg-peach-50 px-2 py-0.5 rounded-lg border border-peach-200 flex items-center gap-1 transition-colors"
                      >
                        <span>Lihat KTP</span>
                        <span>📄</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-softgray italic">Belum diupload</span>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  {tenant.emergencyContact?.name && (
                    <div className="pt-2 border-t border-cream-200 text-[11px]">
                      <span className="text-softgray font-semibold block mb-0.5 flex items-center gap-1">
                        <HeartHandshake className="w-3.5 h-3.5 text-peach-400" />
                        <span>Kontak Darurat ({tenant.emergencyContact.relation}):</span>
                      </span>
                      <p className="font-bold text-darkcocoa truncate">
                        {tenant.emergencyContact.name} •{' '}
                        <span className="font-mono text-softgray">{tenant.emergencyContact.phone}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-cream-100 text-xs">
                <a
                  href={`https://wa.me/${tenant.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-matcha-50 hover:bg-matcha-100 text-matcha-700 font-bold px-3 py-1.5 rounded-xl border border-matcha-200 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-matcha-600" />
                  <span>Kirim WA</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(tenant)}
                    className="p-1.5 text-softgray hover:text-darkcocoa hover:bg-cream-100 rounded-lg transition-colors"
                    title="Edit Profil & KTP"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {tenant.status === 'active' ? (
                    <button
                      onClick={() => handleOpenCheckOut(tenant)}
                      className="text-xs font-bold text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                      title="Proses Check-out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Check-out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeleteTenant(tenant)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Riwayat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODAL: TAMBAH PENGHUNI BARU                              */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-cute border border-cream-200 p-6 max-w-lg w-full space-y-4 font-body my-8"
            >
              <div className="flex items-center justify-between border-b border-cream-100 pb-3">
                <h3 className="font-heading font-extrabold text-lg text-darkcocoa flex items-center gap-2">
                  <span>Pendaftaran Penghuni Baru</span>
                  <span>✍️</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-softgray hover:text-darkcocoa p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddTenant} className="space-y-4 text-xs">
                {/* Upload Foto Profil & KTP */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-cream-50 rounded-2xl border border-cream-200">
                  <div className="flex flex-col items-center text-center space-y-1">
                    <span className="font-bold text-darkcocoa text-[11px]">Pas Foto Profil</span>
                    <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-peach-300 overflow-hidden flex items-center justify-center shadow-sm group">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profil" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-peach-400" />
                      )}
                      <label className="absolute inset-0 bg-darkcocoa/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">
                        Ganti
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setProfilePhoto)}
                        />
                      </label>
                    </div>
                    <label className="cursor-pointer text-[10px] font-bold text-peach-600 hover:underline">
                      {profilePhoto ? 'Ubah' : '+ Upload Foto'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setProfilePhoto)}
                      />
                    </label>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-1">
                    <span className="font-bold text-darkcocoa text-[11px]">Foto Kartu KTP</span>
                    <div className="relative w-28 h-20 rounded-2xl bg-white border-2 border-dashed border-sakura-300 overflow-hidden flex items-center justify-center shadow-sm group">
                      {ktpPhoto ? (
                        <img src={ktpPhoto} alt="KTP" className="w-full h-full object-cover" />
                      ) : (
                        <IdCard className="w-7 h-7 text-sakura-400" />
                      )}
                      <label className="absolute inset-0 bg-darkcocoa/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">
                        Ganti
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setKtpPhoto)}
                        />
                      </label>
                    </div>
                    <label className="cursor-pointer text-[10px] font-bold text-sakura-600 hover:underline">
                      {ktpPhoto ? 'Ubah' : '+ Upload KTP'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setKtpPhoto)}
                      />
                    </label>
                  </div>
                </div>

                {/* Pilih Kamar Kosong */}
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">
                    Pilih Kamar yang Siap Ditempati <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400"
                  >
                    {vacantRooms.length === 0 ? (
                      <option value="">Semua kamar saat ini terisi penuh!</option>
                    ) : (
                      vacantRooms.map((r) => {
                        const prop = properties.find((p) => p.id === r.propertyId);
                        return (
                          <option key={r.id} value={r.id}>
                            Kamar {r.number} ({r.type} - {formatRupiah(r.price)}/bln)
                            {activePropertyId === 'all' && prop ? ` - ${prop.name}` : ''}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                {/* Nama & WhatsApp */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Nama Penghuni</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rian Pratama"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">No. WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="08123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400"
                    />
                  </div>
                </div>

                {/* NIK & Profesi */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Nomor NIK KTP</label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="3273xxxxxxxxxxxx"
                      value={ktpNumber}
                      onChange={(e) => setKtpNumber(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-mono text-xs focus:outline-none focus:border-peach-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Pekerjaan / Kampus</label>
                    <input
                      type="text"
                      placeholder="Mahasiswa / Karyawan"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa text-xs focus:outline-none focus:border-peach-400"
                    />
                  </div>
                </div>

                {/* Tanggal, Tempo & Deposit */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Tgl Masuk</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-2.5 py-1.5 text-xs text-darkcocoa font-medium focus:outline-none focus:border-peach-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Tgl Tempo</label>
                    <input
                      type="number"
                      min={1}
                      max={28}
                      required
                      value={dueDayOfMonth}
                      onChange={(e) => setDueDayOfMonth(Number(e.target.value))}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-2.5 py-1.5 text-xs text-darkcocoa font-bold focus:outline-none focus:border-peach-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Deposit (Rp)</label>
                    <input
                      type="number"
                      step={100000}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-2.5 py-1.5 text-xs text-darkcocoa font-bold focus:outline-none focus:border-peach-400"
                    />
                  </div>
                </div>

                {/* Kontak Darurat */}
                <div className="p-3 bg-sakura-50/50 rounded-2xl border border-sakura-200/80 space-y-2">
                  <p className="font-bold text-darkcocoa text-xs">
                    🚨 Kontak Darurat Keluarga (Wajib untuk Keamanan):
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Nama Wali"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="bg-white border border-cream-200 rounded-xl px-2.5 py-1.5 text-xs text-darkcocoa"
                    />
                    <select
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      className="bg-white border border-cream-200 rounded-xl px-2 py-1.5 text-xs text-darkcocoa font-medium"
                    >
                      <option value="Orang Tua">Orang Tua</option>
                      <option value="Suami / Istri">Suami / Istri</option>
                      <option value="Kakak / Adik">Kakak / Adik</option>
                      <option value="Kerabat">Kerabat</option>
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="No. HP Wali"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="bg-white border border-cream-200 rounded-xl px-2.5 py-1.5 text-xs text-darkcocoa"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-softgray hover:bg-cream-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={vacantRooms.length === 0}
                    className="bg-peach-500 hover:bg-peach-400 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-cute disabled:opacity-50"
                  >
                    Simpan &amp; Check-In
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: EDIT PENGHUNI                                     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isEditModalOpen && selectedTenant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-cute border border-cream-200 p-6 max-w-lg w-full space-y-4 font-body my-8"
            >
              <div className="flex items-center justify-between border-b border-cream-100 pb-3">
                <h3 className="font-heading font-extrabold text-lg text-darkcocoa flex items-center gap-2">
                  <span>Edit Data Penghuni: {selectedTenant.name}</span>
                  <span>✏️</span>
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-softgray hover:text-darkcocoa p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                {/* Upload Foto Profil & KTP */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-cream-50 rounded-2xl border border-cream-200">
                  <div className="flex flex-col items-center text-center space-y-1">
                    <span className="font-bold text-darkcocoa text-[11px]">Pas Foto Profil</span>
                    <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-peach-300 overflow-hidden flex items-center justify-center shadow-sm group">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profil" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-peach-400" />
                      )}
                      <label className="absolute inset-0 bg-darkcocoa/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">
                        Ganti
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setProfilePhoto)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-1">
                    <span className="font-bold text-darkcocoa text-[11px]">Foto Kartu KTP</span>
                    <div className="relative w-28 h-20 rounded-2xl bg-white border-2 border-dashed border-sakura-300 overflow-hidden flex items-center justify-center shadow-sm group">
                      {ktpPhoto ? (
                        <img src={ktpPhoto} alt="KTP" className="w-full h-full object-cover" />
                      ) : (
                        <IdCard className="w-7 h-7 text-sakura-400" />
                      )}
                      <label className="absolute inset-0 bg-darkcocoa/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">
                        Ganti
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setKtpPhoto)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">No. WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Nomor NIK KTP</label>
                    <input
                      type="text"
                      maxLength={16}
                      value={ktpNumber}
                      onChange={(e) => setKtpNumber(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Pekerjaan / Kampus</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Tgl Jatuh Tempo</label>
                    <input
                      type="number"
                      min={1}
                      max={28}
                      value={dueDayOfMonth}
                      onChange={(e) => setDueDayOfMonth(Number(e.target.value))}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Uang Deposit (Rp)</label>
                    <input
                      type="number"
                      step={100000}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Kontak Darurat */}
                <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
                  <p className="font-bold text-darkcocoa text-xs">Kontak Darurat Keluarga:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Nama Wali"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="bg-white border border-cream-200 rounded-xl px-2.5 py-1.5 text-xs text-darkcocoa"
                    />
                    <select
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      className="bg-white border border-cream-200 rounded-xl px-2 py-1.5 text-xs text-darkcocoa font-medium"
                    >
                      <option value="Orang Tua">Orang Tua</option>
                      <option value="Suami / Istri">Suami / Istri</option>
                      <option value="Kakak / Adik">Kakak / Adik</option>
                      <option value="Kerabat">Kerabat</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="No. HP Wali"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="bg-white border border-cream-200 rounded-xl px-2.5 py-1.5 text-xs text-darkcocoa"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-softgray hover:bg-cream-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-peach-500 hover:bg-peach-400 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-cute"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: KTP VIEWER POPUP                                  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isKtpModalOpen && ktpViewerData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/70 animate-in fade-in duration-150">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-6 max-w-md w-full space-y-4 font-body relative"
            >
              <div className="flex items-center justify-between border-b border-cream-100 pb-3">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-darkcocoa flex items-center gap-1.5">
                    <IdCard className="w-4 h-4 text-peach-500" />
                    <span>Arsip Dokumen KTP Penghuni</span>
                  </h3>
                  <p className="text-[11px] text-softgray">
                    Atas Nama: <strong className="text-darkcocoa">{ktpViewerData.name}</strong>
                    {ktpViewerData.ktpNumber && ` (NIK: ${ktpViewerData.ktpNumber})`}
                  </p>
                </div>
                <button
                  onClick={() => setIsKtpModalOpen(false)}
                  className="text-softgray hover:text-darkcocoa p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* KTP Image Display with Watermark */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-cream-200 bg-cream-50 flex items-center justify-center min-h-[220px]">
                <img
                  src={ktpViewerData.ktpPhoto}
                  alt="Foto KTP"
                  className="w-full h-auto max-h-[350px] object-contain"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span className="text-black/10 font-black text-2xl rotate-[-25deg] select-none tracking-widest border-2 border-dashed border-black/10 px-4 py-2 rounded-xl">
                    ARSIP RESMI KOSANKU
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsKtpModalOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs transition-colors"
              >
                Tutup Pratinjau
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: CHECK-OUT PENGHUNI                                */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isCheckOutModalOpen && selectedTenant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-cute border border-cream-200 p-6 max-w-md w-full space-y-4 font-body"
            >
              <div className="flex items-center gap-3 border-b border-cream-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                    Check-Out Penghuni
                  </h3>
                  <p className="text-xs text-softgray">
                    Konfirmasi selesai sewa untuk <strong>{selectedTenant.name}</strong> (Kamar {selectedTenant.roomNumber})
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-darkcocoa">
                    <input
                      type="checkbox"
                      checked={refundDeposit}
                      onChange={(e) => setRefundDeposit(e.target.checked)}
                      className="rounded text-matcha-500 w-4 h-4"
                    />
                    <span>Kembalikan Uang Jaminan / Deposit ({formatRupiah(selectedTenant.depositAmount)})</span>
                  </label>
                  <p className="text-[11px] text-softgray pl-6">
                    {refundDeposit
                      ? 'Status deposit akan diubah menjadi Refunded.'
                      : 'Deposit ditahan / tidak dikembalikan (misal ada kerusakan aset/tunggakan).'}
                  </p>
                </div>

                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Alasan Check-Out</label>
                  <textarea
                    rows={2}
                    value={checkoutReason}
                    onChange={(e) => setCheckoutReason(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl p-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-cream-100">
                  <button
                    type="button"
                    onClick={() => setIsCheckOutModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-softgray hover:bg-cream-100"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCheckOut}
                    className="bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm"
                  >
                    Konfirmasi Selesai Sewa
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

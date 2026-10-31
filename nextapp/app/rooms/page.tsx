'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Snowflake,
  Wifi,
  ShowerHead,
  Layers,
  Key,
  X,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Zap,
  Copy,
  Check,
  CheckCircle2,
  UserCheck,
  LogOut,
  AlertTriangle,
  Building2,
  Camera,
  FileText,
  Eye,
  Tag,
  IdCard,
  Briefcase
} from 'lucide-react';
import { useKosStore, Room, Tenant } from '../lib/store/useKosStore';
import { MimiLoader } from '../components/ui/MimiLoader';
import { PlanLimitModal } from '../components/ui/PlanLimitModal';

type FilterType = 'all' | 'occupied' | 'vacant' | 'maintenance';

export default function RoomsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const {
    properties,
    activePropertyId,
    setActivePropertyId,
    availableFacilities,
    addFacility,
    deleteFacility,
    addFloorToProperty,
    deleteFloorFromProperty,
    rooms,
    tenants,
    addRoom,
    updateRoom,
    deleteRoom,
    checkInTenant,
    checkOutTenant,
    canAddRoom
  } = useKosStore();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // SaaS Quota Limit Modal State
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  const [planLimitData, setPlanLimitData] = useState<{ current: number; max: number; planName: string } | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [isKtpModalOpen, setIsKtpModalOpen] = useState(false);
  const [ktpViewerData, setKtpViewerData] = useState<{ name: string; ktpPhoto: string; ktpNumber?: string } | null>(null);
  const [deleteFloorTarget, setDeleteFloorTarget] = useState<{
    propertyId: string;
    propertyName: string;
    floorNum: number;
    roomsCount: number;
    occupiedCount: number;
    vacantCount: number;
  } | null>(null);

  // Form states for Add / Edit Room
  const [targetPropertyId, setTargetPropertyId] = useState<string>('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomFloor, setRoomFloor] = useState(1);
  const [roomType, setRoomType] = useState<'Standard' | 'Deluxe'>('Standard');
  const [roomPrice, setRoomPrice] = useState(1500000);
  const [selectedCustomFacilities, setSelectedCustomFacilities] = useState<string[]>([]);
  const [newFacilityInput, setNewFacilityInput] = useState('');
  const [idMeteranPln, setIdMeteranPln] = useState('');
  const [roomNotes, setRoomNotes] = useState('');

  // Form states for Check-in
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('08');
  const [tenantStartDate, setTenantStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDayOfMonth, setDueDayOfMonth] = useState(1);
  const [depositAmount, setDepositAmount] = useState(500000);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Orang Tua');
  const [emergencyPhone, setEmergencyPhone] = useState('08');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [ktpPhoto, setKtpPhoto] = useState<string | null>(null);
  const [ktpNumber, setKtpNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  // Check-out state
  const [refundDeposit, setRefundDeposit] = useState(true);
  const [checkoutReason, setCheckoutReason] = useState('Selesai masa sewa/kontrak');

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPln, setCopiedPln] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  // Active Property Filter Logic
  const activeProperty = properties.find((p) => p.id === activePropertyId);

  const propertyRooms = activePropertyId === 'all'
    ? rooms
    : rooms.filter((r) => r.propertyId === activePropertyId);

  // Filter counts
  const filterCounts = {
    all: propertyRooms.length,
    occupied: propertyRooms.filter((r) => r.status === 'occupied').length,
    vacant: propertyRooms.filter((r) => r.status === 'vacant').length,
    maintenance: propertyRooms.filter((r) => r.status === 'maintenance').length
  };

  const filteredRooms = propertyRooms.filter((room) => {
    if (filter === 'all') return true;
    return room.status === filter;
  });

  // Calculate available floors for current view
  const currentMaxFloor = activeProperty ? (activeProperty.floors || 2) : 2;
  const floors = Array.from(
    new Set([
      ...propertyRooms.map((r) => r.floor),
      ...Array.from({ length: Math.max(currentMaxFloor, 1) }, (_, i) => i + 1)
    ])
  ).sort((a, b) => a - b);

  // Helper to handle image uploads to base64 data URL
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Mohon pilih foto dengan ukuran maksimal 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Facility toggle helper
  const toggleFacility = (facilityName: string) => {
    setSelectedCustomFacilities((prev) =>
      prev.includes(facilityName) ? prev.filter((f) => f !== facilityName) : [...prev, facilityName]
    );
  };

  // Add new custom facility type to master list
  const handleAddNewFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityInput.trim()) return;
    const name = newFacilityInput.trim();
    addFacility(name);
    if (!selectedCustomFacilities.includes(name)) {
      setSelectedCustomFacilities((prev) => [...prev, name]);
    }
    setNewFacilityInput('');
    showToast(`Fasilitas "${name}" ditambahkan! ✨`);
  };

  // Handlers
  const handleAddFloor = () => {
    const targetId = activePropertyId !== 'all' ? activePropertyId : properties[0]?.id;
    if (!targetId) return;
    const newFloorNum = addFloorToProperty(targetId);
    showToast(`Lantai ${newFloorNum} berhasil ditambahkan! 🏢✨`);
  };

  const handleInitiateDeleteFloor = (floorNum: number) => {
    const targetProp = activePropertyId !== 'all'
      ? properties.find((p) => p.id === activePropertyId)
      : properties[0];

    if (!targetProp) return;

    if ((targetProp.floors || 1) <= 1) {
      showToast('Cabang kos minimal harus memiliki 1 lantai. Tidak bisa dihapus.');
      return;
    }

    const floorRooms = rooms.filter(
      (r) => r.propertyId === targetProp.id && r.floor === floorNum
    );
    const occupied = floorRooms.filter((r) => r.status === 'occupied').length;
    const vacant = floorRooms.filter((r) => r.status === 'vacant' || r.status === 'maintenance').length;

    setDeleteFloorTarget({
      propertyId: targetProp.id,
      propertyName: targetProp.name,
      floorNum,
      roomsCount: floorRooms.length,
      occupiedCount: occupied,
      vacantCount: vacant
    });
  };

  const handleConfirmDeleteFloor = () => {
    if (!deleteFloorTarget) return;
    const res = deleteFloorFromProperty(deleteFloorTarget.propertyId, deleteFloorTarget.floorNum);
    showToast(res.message);
    if (res.success) {
      setDeleteFloorTarget(null);
    }
  };

  const handleOpenAddModal = (defaultFloor = 1) => {
    const quota = canAddRoom();
    if (!quota.allowed) {
      setPlanLimitData({
        current: quota.current,
        max: quota.max,
        planName: quota.planName
      });
      setIsPlanLimitModalOpen(true);
      return;
    }

    const propId = activePropertyId !== 'all' ? activePropertyId : (properties[0]?.id || 'prop-1');
    setTargetPropertyId(propId);
    setRoomFloor(defaultFloor);
    const existingCount = rooms.filter((r) => r.propertyId === propId && r.floor === defaultFloor).length;
    const prefix = propId === 'prop-2' ? 'S' : 'K';
    setRoomNumber(`${prefix}-${defaultFloor}${String(existingCount + 1).padStart(2, '0')}`);
    setRoomPrice(1500000);
    setRoomType('Standard');
    setSelectedCustomFacilities(['AC Dingin', 'WiFi Cepat', 'Kamar Mandi Dalam']);
    setIdMeteranPln(`5421-9820-${Math.floor(1000 + Math.random() * 9000)}`);
    setRoomNotes('');
    setIsAddModalOpen(true);
  };

  const handleSaveAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) return;

    addRoom({
      propertyId: targetPropertyId,
      number: roomNumber.trim().toUpperCase(),
      floor: Number(roomFloor),
      type: roomType,
      status: 'vacant',
      price: Number(roomPrice),
      facilities: {
        ac: selectedCustomFacilities.includes('AC Dingin') || selectedCustomFacilities.some((f) => f.toLowerCase().includes('ac')),
        wifi: selectedCustomFacilities.includes('WiFi Cepat') || selectedCustomFacilities.some((f) => f.toLowerCase().includes('wifi')),
        bath: selectedCustomFacilities.includes('Kamar Mandi Dalam') || selectedCustomFacilities.some((f) => f.toLowerCase().includes('mandi')),
        custom: selectedCustomFacilities
      },
      idMeteranPln: idMeteranPln.trim() || undefined,
      catatan: roomNotes.trim() || undefined
    });

    setIsAddModalOpen(false);
    showToast(`Kamar ${roomNumber.toUpperCase()} berhasil ditambahkan! 🏡✨`);
  };

  const handleOpenEditModal = (room: Room) => {
    setSelectedRoom(room);
    setTargetPropertyId(room.propertyId);
    setRoomNumber(room.number);
    setRoomFloor(room.floor);
    setRoomType(room.type);
    setRoomPrice(room.price);
    const initialFacs = room.facilities.custom && room.facilities.custom.length > 0
      ? room.facilities.custom
      : [
          ...(room.facilities.ac ? ['AC Dingin'] : []),
          ...(room.facilities.wifi ? ['WiFi Cepat'] : []),
          ...(room.facilities.bath ? ['Kamar Mandi Dalam'] : [])
        ];
    setSelectedCustomFacilities(initialFacs);
    setIdMeteranPln(room.idMeteranPln || '');
    setRoomNotes(room.catatan || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    updateRoom(selectedRoom.id, {
      propertyId: targetPropertyId,
      number: roomNumber.trim().toUpperCase(),
      floor: Number(roomFloor),
      type: roomType,
      price: Number(roomPrice),
      facilities: {
        ac: selectedCustomFacilities.includes('AC Dingin') || selectedCustomFacilities.some((f) => f.toLowerCase().includes('ac')),
        wifi: selectedCustomFacilities.includes('WiFi Cepat') || selectedCustomFacilities.some((f) => f.toLowerCase().includes('wifi')),
        bath: selectedCustomFacilities.includes('Kamar Mandi Dalam') || selectedCustomFacilities.some((f) => f.toLowerCase().includes('mandi')),
        custom: selectedCustomFacilities
      },
      idMeteranPln: idMeteranPln.trim() || undefined,
      catatan: roomNotes.trim() || undefined
    });

    setIsEditModalOpen(false);
    setSelectedRoom((prev) =>
      prev ? { ...prev, number: roomNumber, price: Number(roomPrice), type: roomType, propertyId: targetPropertyId } : null
    );
    showToast(`Data Kamar ${roomNumber} berhasil diperbarui! 💾`);
  };

  const handleDeleteRoom = (room: Room) => {
    if (room.status === 'occupied') {
      alert('Kamar tidak dapat dihapus karena masih ada penghuni aktif.');
      return;
    }
    if (confirm(`Yakin ingin menghapus Kamar ${room.number}? Tindakan ini permanen.`)) {
      const ok = deleteRoom(room.id);
      if (ok) {
        setSelectedRoom(null);
        setIsEditModalOpen(false);
        showToast(`Kamar ${room.number} berhasil dihapus.`);
      }
    }
  };

  const handleOpenCheckInModal = (room: Room) => {
    setSelectedRoom(room);
    setTenantName('');
    setTenantPhone('08');
    setTenantStartDate(new Date().toISOString().split('T')[0]);
    setDueDayOfMonth(new Date().getDate());
    setDepositAmount(500000);
    setEmergencyName('');
    setEmergencyRelation('Orang Tua');
    setEmergencyPhone('08');
    setProfilePhoto(null);
    setKtpPhoto(null);
    setKtpNumber('');
    setJobTitle('');
    setIsCheckInModalOpen(true);
  };

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !tenantName.trim()) return;

    checkInTenant(
      {
        name: tenantName.trim(),
        phone: tenantPhone.trim(),
        startDate: tenantStartDate,
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
      selectedRoom.id
    );

    setIsCheckInModalOpen(false);
    setSelectedRoom(null);
    showToast(`Selamat datang ${tenantName}! Kamar ${selectedRoom.number} kini terisi & tagihan otomatis diterbitkan 🔑🎉`);
  };

  const handleSaveCheckOut = () => {
    if (!selectedRoom || !selectedRoom.tenantId) return;

    checkOutTenant(selectedRoom.tenantId, {
      refundDeposit,
      reason: checkoutReason
    });

    setIsCheckOutModalOpen(false);
    setSelectedRoom(null);
    showToast(`Penghuni Kamar ${selectedRoom.number} berhasil check-out. Status kamar kini Kosong 🌿`);
  };

  const handleCopyPln = (token?: string) => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopiedPln(true);
    setTimeout(() => setCopiedPln(false), 2000);
  };

  const getCardBgAndBorder = (status: Room['status']) => {
    switch (status) {
      case 'occupied':
        return 'bg-sakura-50/70 border-sakura-200 hover:border-sakura-400';
      case 'vacant':
        return 'bg-matcha-50/70 border-matcha-200 hover:border-matcha-400';
      case 'maintenance':
        return 'bg-lavender-50/70 border-lavender-200 hover:border-lavender-400';
    }
  };

  const renderStatusBadge = (status: Room['status']) => {
    switch (status) {
      case 'occupied':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sakura-100 text-sakura-600 border border-sakura-300/60 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sakura-500" />
            Terisi
          </span>
        );
      case 'vacant':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-matcha-100 text-matcha-600 border border-matcha-300/60 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-matcha-500" />
            Kosong
          </span>
        );
      case 'maintenance':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-lavender-100 text-lavender-600 border border-lavender-300/60 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-lavender-500" />
            Perbaikan
          </span>
        );
    }
  };

  // Find tenant details of selected room
  const currentOccupant = selectedRoom?.tenantId
    ? tenants.find((t) => t.id === selectedRoom.tenantId)
    : null;

  if (!isMounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <MimiLoader message="Mimi sedang menata denah kamar... 🐾" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6 md:space-y-8 font-body text-darkcocoa">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-matcha-400 text-white px-5 py-3 rounded-2xl shadow-cute flex items-center gap-2.5 font-semibold text-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-white animate-spin" strokeWidth={2} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Active Branch Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-darkcocoa tracking-tight">
              Denah Kamar KosanKu
            </h1>
          </div>
          <p className="text-softgray text-xs sm:text-sm mt-1">
            {activeProperty ? (
              <span className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-darkcocoa">{activeProperty.name}</span>
                <span>• {activeProperty.address}</span>
                <span className="px-2 py-0.5 rounded-full bg-peach-100 text-peach-600 font-bold text-[10px]">
                  {activeProperty.type}
                </span>
              </span>
            ) : (
              'Menampilkan seluruh kamar dari semua cabang kosan Anda secara konsolidasi.'
            )}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAddFloor}
            className="flex-1 sm:flex-none justify-center bg-cream-100 hover:bg-cream-200 text-darkcocoa px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold border border-cream-200 transition-all flex items-center gap-1.5"
            title="Tambah Lantai Baru pada Cabang Ini"
          >
            <Layers className="w-4 h-4 text-peach-500 flex-shrink-0" strokeWidth={2} />
            <span className="whitespace-nowrap">+ Lantai</span>
          </button>

          {currentMaxFloor > 1 && (
            <button
              onClick={() => handleInitiateDeleteFloor(currentMaxFloor)}
              className="bg-white hover:bg-red-50 text-softgray hover:text-red-500 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold border border-cream-200 hover:border-red-200 transition-all flex items-center gap-1.5"
              title={`Hapus Lantai Teratas (Lantai ${currentMaxFloor})`}
            >
              <Trash2 className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
              <span className="whitespace-nowrap">- Hapus L{currentMaxFloor}</span>
            </button>
          )}

          <button
            onClick={() => handleOpenAddModal(1)}
            className="w-full sm:w-auto justify-center bg-peach-500 hover:bg-peach-400 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-cute flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
            <span>+ Tambah Kamar</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center gap-2 pt-1 border-b border-cream-200/80 pb-3 overflow-x-auto scrollbar-none sm:flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'all'
              ? 'bg-peach-500 text-white shadow-cute'
              : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
          }`}
        >
          Semua ({filterCounts.all})
        </button>
        <button
          onClick={() => setFilter('occupied')}
          className={`whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'occupied'
              ? 'bg-sakura-400 text-white shadow-cute'
              : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
          }`}
        >
          Terisi ({filterCounts.occupied})
        </button>
        <button
          onClick={() => setFilter('vacant')}
          className={`whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'vacant'
              ? 'bg-matcha-400 text-white shadow-cute'
              : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
          }`}
        >
          Kosong ({filterCounts.vacant})
        </button>
        <button
          onClick={() => setFilter('maintenance')}
          className={`whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'maintenance'
              ? 'bg-lavender-400 text-white shadow-cute'
              : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
          }`}
        >
          Perbaikan ({filterCounts.maintenance})
        </button>
      </div>

      {/* Visual Floor Sections */}
      <div className="space-y-8">
        {floors.map((floorNum) => {
          const roomsInFloor = filteredRooms.filter((r) => r.floor === floorNum);

          return (
            <div key={floorNum} className="space-y-4">
              {/* Floor Header */}
              <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-peach-100 text-peach-500 flex items-center justify-center font-bold text-xs shadow-sm">
                    L{floorNum}
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-extrabold text-darkcocoa">
                      Lantai {floorNum}
                    </h2>
                    <p className="text-[11px] text-softgray">
                      {roomsInFloor.length} Kamar pada lantai ini
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAddModal(floorNum)}
                    className="text-xs font-bold text-peach-500 hover:text-peach-600 flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Kamar di Lantai {floorNum}</span>
                    <span className="xs:hidden">+ Kamar L{floorNum}</span>
                  </button>

                  <button
                    onClick={() => handleInitiateDeleteFloor(floorNum)}
                    className="text-xs font-semibold text-softgray hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded-xl flex items-center gap-1 transition-colors border border-transparent hover:border-red-200"
                    title={`Hapus Lantai ${floorNum}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hapus Lantai</span>
                  </button>
                </div>
              </div>

              {/* Grid of Room Cards */}
              {roomsInFloor.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
                  {roomsInFloor.map((room) => {
                    const roomProp = properties.find((p) => p.id === room.propertyId);

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`
                          group cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-4 border shadow-sm
                          flex flex-col justify-between transition-all duration-150
                          hover:-translate-y-1 hover:shadow-cute active:scale-95
                          ${getCardBgAndBorder(room.status)}
                        `}
                      >
                        <div>
                          {/* Card Top: Number, Branch Tag & Type */}
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa group-hover:text-peach-500 transition-colors">
                              {room.number}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-darkcocoa shadow-2xs">
                              {room.type}
                            </span>
                          </div>

                          {/* Branch tag if in all mode */}
                          {activePropertyId === 'all' && roomProp && (
                            <p className="text-[9px] font-bold text-peach-600 truncate mb-1">
                              📍 {roomProp.name}
                            </p>
                          )}

                          {/* Price */}
                          <p className="text-xs font-bold text-darkcocoa/90 mb-2">
                            {formatRupiah(room.price)}
                            <span className="text-[10px] text-softgray font-normal">/bln</span>
                          </p>

                          {/* Status Badge */}
                          <div className="mb-2.5">{renderStatusBadge(room.status)}</div>

                          {/* Tenant Info if Occupied */}
                          {room.status === 'occupied' && (
                            <div className="bg-white/80 rounded-xl p-2 mb-2 border border-cream-200/50">
                              <p className="font-bold text-darkcocoa text-[11px] truncate">
                                {room.tenantName}
                              </p>
                              <p className="text-[10px] text-softgray">
                                Tempo: <strong className="text-peach-500">{room.dueDate || 'Awal Bln'}</strong>
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Facilities Icons row */}
                        <div className="pt-2 border-t border-darkcocoa/5 flex items-center justify-between text-softgray text-[10px]">
                          <div className="flex items-center gap-1.5">
                            {room.facilities.ac && (
                              <span title="AC" className="inline-flex">
                                <Snowflake className="w-3.5 h-3.5 text-peach-400" strokeWidth={1.75} />
                              </span>
                            )}
                            {room.facilities.wifi && (
                              <span title="WiFi" className="inline-flex">
                                <Wifi className="w-3.5 h-3.5 text-peach-400" strokeWidth={1.75} />
                              </span>
                            )}
                            {room.facilities.bath && (
                              <span title="KM Dalam" className="inline-flex">
                                <ShowerHead className="w-3.5 h-3.5 text-peach-400" strokeWidth={1.75} />
                              </span>
                            )}
                            {room.facilities.custom && room.facilities.custom.length > 0 && (
                              <span className="text-[9px] font-bold text-softgray px-1 py-0.2 rounded bg-white">
                                +{room.facilities.custom.length}
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] text-peach-500 font-bold group-hover:underline">
                            Detail ➔
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-white rounded-3xl border border-cream-200 text-center text-xs text-softgray">
                  Belum ada kamar pada Lantai {floorNum}. Klik &quot;+ Kamar di Lantai {floorNum}&quot; untuk menambahkan.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ROOM DETAIL & ACTIONS                           */}
      {/* ======================================================== */}
      {selectedRoom && !isEditModalOpen && !isCheckInModalOpen && !isCheckOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-cute border border-cream-200 p-6 max-w-lg w-full space-y-5 font-body relative">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-cream-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-2xl text-darkcocoa">
                    Kamar {selectedRoom.number}
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-600">
                    {selectedRoom.type}
                  </span>
                </div>
                <p className="text-xs text-softgray mt-0.5">
                  Lantai {selectedRoom.floor} • Tarif: <strong className="text-darkcocoa">{formatRupiah(selectedRoom.price)}/bln</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedRoom(null)}
                className="text-softgray hover:text-darkcocoa p-1 rounded-xl hover:bg-cream-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Room Status & Information */}
            <div className="bg-cream-50 rounded-2xl p-4 border border-cream-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                <span className="text-softgray font-medium">Status Kamar:</span>
                {renderStatusBadge(selectedRoom.status)}
              </div>

              {selectedRoom.status === 'occupied' && currentOccupant ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-peach-100 border border-peach-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {currentOccupant.profilePhoto ? (
                          <img
                            src={currentOccupant.profilePhoto}
                            alt={currentOccupant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-peach-600 text-xs">
                            {currentOccupant.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-darkcocoa text-sm">{currentOccupant.name}</p>
                        <p className="text-[11px] text-softgray">{currentOccupant.phone}</p>
                      </div>
                    </div>

                    {currentOccupant.ktpPhoto && (
                      <button
                        onClick={() => {
                          setKtpViewerData({
                            name: currentOccupant.name,
                            ktpPhoto: currentOccupant.ktpPhoto!,
                            ktpNumber: currentOccupant.ktpNumber
                          });
                          setIsKtpModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-peach-100 hover:bg-peach-200 text-peach-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <IdCard className="w-3.5 h-3.5" />
                        <span>Lihat KTP</span>
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-cream-200 text-xs">
                    <span className="text-softgray">Jatuh Tempo:</span>
                    <span className="font-bold text-peach-600">{selectedRoom.dueDate || 'Tiap Tanggal 1'}</span>
                  </div>
                </div>
              ) : selectedRoom.status === 'occupied' ? (
                <div className="flex justify-between items-center">
                  <span className="text-softgray font-medium">Penghuni Aktif:</span>
                  <span className="font-bold text-darkcocoa">{selectedRoom.tenantName}</span>
                </div>
              ) : (
                <div className="py-1 text-matcha-600 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-matcha-500" />
                  <span>Kamar kosong siap huni! Kunci dipegang Mimi 🔑</span>
                </div>
              )}

              {/* ID Meteran PLN */}
              <div className="flex justify-between items-center pt-2 border-t border-cream-200">
                <span className="text-softgray font-medium flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-peach-500" strokeWidth={1.75} />
                  <span>ID Token PLN:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-darkcocoa">
                    {selectedRoom.idMeteranPln || 'Belum diisi'}
                  </span>
                  {selectedRoom.idMeteranPln && (
                    <button
                      onClick={() => handleCopyPln(selectedRoom.idMeteranPln)}
                      className="text-peach-500 hover:text-peach-600 p-1 rounded-md"
                      title="Salin ID Token PLN"
                    >
                      {copiedPln ? <Check className="w-3.5 h-3.5 text-matcha-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {selectedRoom.catatan && (
                <p className="text-[11px] text-softgray italic pt-1 border-t border-cream-200">
                  Catatan: {selectedRoom.catatan}
                </p>
              )}
            </div>

            {/* Facilities List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-darkcocoa block">Daftar Fasilitas Unit:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedRoom.facilities.ac && (
                  <span className="px-2.5 py-1 rounded-xl bg-sakura-50 border border-sakura-200 text-darkcocoa font-medium flex items-center gap-1">
                    <Snowflake className="w-3.5 h-3.5 text-peach-500" /> AC Dingin
                  </span>
                )}
                {selectedRoom.facilities.wifi && (
                  <span className="px-2.5 py-1 rounded-xl bg-sakura-50 border border-sakura-200 text-darkcocoa font-medium flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-peach-500" /> WiFi Cepat
                  </span>
                )}
                {selectedRoom.facilities.bath && (
                  <span className="px-2.5 py-1 rounded-xl bg-sakura-50 border border-sakura-200 text-darkcocoa font-medium flex items-center gap-1">
                    <ShowerHead className="w-3.5 h-3.5 text-peach-500" /> Kamar Mandi Dalam
                  </span>
                )}
                {selectedRoom.facilities.custom &&
                  selectedRoom.facilities.custom.map((fac) => (
                    <span
                      key={fac}
                      className="px-2.5 py-1 rounded-xl bg-cream-100 border border-cream-200 text-darkcocoa font-medium flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-peach-500" /> {fac}
                    </span>
                  ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-cream-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(selectedRoom)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-darkcocoa bg-cream-100 hover:bg-cream-200 flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Data Kamar</span>
                </button>
                <button
                  onClick={() => handleDeleteRoom(selectedRoom)}
                  disabled={selectedRoom.status === 'occupied'}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                    selectedRoom.status === 'occupied'
                      ? 'opacity-40 cursor-not-allowed text-softgray'
                      : 'text-red-500 hover:bg-red-50'
                  }`}
                  title={selectedRoom.status === 'occupied' ? 'Kamar terisi tidak dapat dihapus' : 'Hapus kamar'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                {selectedRoom.status === 'vacant' ? (
                  <button
                    onClick={() => handleOpenCheckInModal(selectedRoom)}
                    className="bg-matcha-500 hover:bg-matcha-400 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-cute flex items-center gap-1.5 transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Check-In Penghuni</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCheckOutModalOpen(true)}
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Check-Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD ROOM (WITH DYNAMIC FACILITIES & FLOORS)     */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-cute border border-cream-200 p-6 max-w-lg w-full space-y-4 font-body my-8">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                Tambah Kamar Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-softgray hover:text-darkcocoa p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddRoom} className="space-y-4 text-xs">
              {/* Cabang Kos */}
              <div>
                <label className="font-bold text-darkcocoa block mb-1">Lokasi Cabang Kos</label>
                <select
                  value={targetPropertyId}
                  onChange={(e) => setTargetPropertyId(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Nomor Kamar & Lantai */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Nomor Kamar</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: K-111"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-sm focus:outline-none focus:border-peach-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Lantai</label>
                  <select
                    value={roomFloor}
                    onChange={(e) => setRoomFloor(Number(e.target.value))}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-semibold text-sm focus:outline-none focus:border-peach-400 focus:bg-white"
                  >
                    {floors.map((f) => (
                      <option key={f} value={f}>
                        Lantai {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tipe & Tarif */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Tipe Kamar</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as 'Standard' | 'Deluxe')}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-semibold text-sm focus:outline-none focus:border-peach-400 focus:bg-white"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Tarif Sewa (Rp / Bulan)</label>
                  <input
                    type="number"
                    required
                    step={50000}
                    value={roomPrice}
                    onChange={(e) => setRoomPrice(Number(e.target.value))}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-sm focus:outline-none focus:border-peach-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* ID Token Listrik PLN */}
              <div>
                <label className="font-bold text-darkcocoa block mb-1">ID Pelanggan Token Listrik PLN</label>
                <input
                  type="text"
                  placeholder="Contoh: 5421-9820-1111"
                  value={idMeteranPln}
                  onChange={(e) => setIdMeteranPln(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-mono text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                />
              </div>

              {/* Dynamic Facilities Checklist */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-darkcocoa">Fasilitas Kamar:</label>
                  <span className="text-[10px] text-softgray">Klik untuk memilih</span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-cream-50/50 rounded-2xl border border-cream-200">
                  {availableFacilities.map((fac) => {
                    const isChecked = selectedCustomFacilities.includes(fac);
                    return (
                      <span
                        key={fac}
                        onClick={() => toggleFacility(fac)}
                        className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all select-none ${
                          isChecked
                            ? 'bg-peach-500 text-white shadow-sm'
                            : 'bg-white text-darkcocoa border border-cream-200 hover:border-peach-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        <span>{fac}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Hapus fasilitas "${fac}" dari daftar master?`)) {
                              deleteFacility(fac);
                              setSelectedCustomFacilities((prev) => prev.filter((item) => item !== fac));
                            }
                          }}
                          className={`ml-1 rounded-full p-0.5 hover:bg-black/10 text-[10px] ${
                            isChecked ? 'text-white' : 'text-softgray hover:text-red-500'
                          }`}
                          title="Hapus fasilitas ini"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>

                {/* Inline Add New Facility Form */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="+ Tambah fasilitas baru..."
                    value={newFacilityInput}
                    onChange={(e) => setNewFacilityInput(e.target.value)}
                    className="flex-1 bg-white border border-cream-200 rounded-xl px-3 py-1.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewFacility}
                    className="px-3 py-1.5 rounded-xl bg-peach-100 hover:bg-peach-200 text-peach-700 font-bold text-xs"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="font-bold text-darkcocoa block mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Menghadap taman, jendela besar, sirkulasi udara sejuk..."
                  value={roomNotes}
                  onChange={(e) => setRoomNotes(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl p-2.5 text-darkcocoa text-xs focus:outline-none focus:border-peach-400 focus:bg-white resize-none"
                />
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
                  className="bg-peach-500 hover:bg-peach-400 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-cute"
                >
                  Simpan Kamar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: EDIT ROOM                                       */}
      {/* ======================================================== */}
      {isEditModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-cute border border-cream-200 p-6 max-w-lg w-full space-y-4 font-body my-8">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                Edit Kamar {selectedRoom.number}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-softgray hover:text-darkcocoa p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditRoom} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Nomor Kamar</label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-sm focus:outline-none focus:border-peach-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Lantai</label>
                  <select
                    value={roomFloor}
                    onChange={(e) => setRoomFloor(Number(e.target.value))}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-semibold text-sm focus:outline-none focus:border-peach-400 focus:bg-white"
                  >
                    {floors.map((f) => (
                      <option key={f} value={f}>
                        Lantai {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Tipe Kamar</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as 'Standard' | 'Deluxe')}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-semibold text-sm focus:outline-none focus:border-peach-400 focus:bg-white"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Tarif Sewa (Rp / Bulan)</label>
                  <input
                    type="number"
                    required
                    step={50000}
                    value={roomPrice}
                    onChange={(e) => setRoomPrice(Number(e.target.value))}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-sm focus:outline-none focus:border-peach-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-darkcocoa block mb-1">ID Pelanggan Token Listrik PLN</label>
                <input
                  type="text"
                  value={idMeteranPln}
                  onChange={(e) => setIdMeteranPln(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-mono text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                />
              </div>

              {/* Dynamic Facilities Checklist */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-darkcocoa">Fasilitas Kamar:</label>
                  <span className="text-[10px] text-softgray">Pilih fasilitas yang tersedia</span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-cream-50/50 rounded-2xl border border-cream-200">
                  {availableFacilities.map((fac) => {
                    const isChecked = selectedCustomFacilities.includes(fac);
                    return (
                      <span
                        key={fac}
                        onClick={() => toggleFacility(fac)}
                        className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all select-none ${
                          isChecked
                            ? 'bg-peach-500 text-white shadow-sm'
                            : 'bg-white text-darkcocoa border border-cream-200 hover:border-peach-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        <span>{fac}</span>
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="+ Tambah jenis fasilitas..."
                    value={newFacilityInput}
                    onChange={(e) => setNewFacilityInput(e.target.value)}
                    className="flex-1 bg-white border border-cream-200 rounded-xl px-3 py-1.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewFacility}
                    className="px-3 py-1.5 rounded-xl bg-peach-100 hover:bg-peach-200 text-peach-700 font-bold text-xs"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-darkcocoa block mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  value={roomNotes}
                  onChange={(e) => setRoomNotes(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl p-2.5 text-darkcocoa text-xs focus:outline-none focus:border-peach-400 focus:bg-white resize-none"
                />
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
                  className="bg-peach-500 hover:bg-peach-400 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-cute"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: CHECK-IN PENGHUNI (WITH KTP & PHOTO UPLOAD)      */}
      {/* ======================================================== */}
      {isCheckInModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-cute border border-cream-200 p-6 max-w-lg w-full space-y-4 font-body my-8">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                  Registrasi Check-In Penghuni
                </h3>
                <p className="text-xs text-softgray">
                  Kamar <strong>{selectedRoom.number}</strong> ({formatRupiah(selectedRoom.price)}/bln)
                </p>
              </div>
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="text-softgray hover:text-darkcocoa p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCheckIn} className="space-y-4 text-xs">
              {/* UPLOAD FOTO PROFIL & FOTO KTP */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-cream-50 rounded-2xl border border-cream-200">
                {/* Pas Foto Profil */}
                <div className="flex flex-col items-center text-center space-y-1.5">
                  <span className="font-bold text-darkcocoa text-[11px]">Pas Foto Penghuni</span>
                  <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-peach-300 overflow-hidden flex items-center justify-center group shadow-sm">
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
                    {profilePhoto ? 'Ubah Foto' : '+ Upload Foto'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setProfilePhoto)}
                    />
                  </label>
                </div>

                {/* Foto KTP */}
                <div className="flex flex-col items-center text-center space-y-1.5">
                  <span className="font-bold text-darkcocoa text-[11px]">Foto Kartu KTP</span>
                  <div className="relative w-28 h-20 rounded-2xl bg-white border-2 border-dashed border-sakura-300 overflow-hidden flex items-center justify-center group shadow-sm">
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
                    {ktpPhoto ? 'Ubah KTP' : '+ Upload KTP'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setKtpPhoto)}
                    />
                  </label>
                </div>
              </div>

              {/* Data Identitas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Pratama"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              {/* No KTP / NIK & Pekerjaan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Nomor NIK KTP (16 Digit)</label>
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
                  <label className="font-bold text-darkcocoa block mb-1">Profesi / Instansi / Kampus</label>
                  <input
                    type="text"
                    placeholder="Contoh: Mahasiswa ITB / Karyawan"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa text-xs focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              {/* Tanggal Mulai, Jatuh Tempo & Uang Jaminan Deposit */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Mulai Masuk</label>
                  <input
                    type="date"
                    required
                    value={tenantStartDate}
                    onChange={(e) => setTenantStartDate(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-2.5 py-1.5 text-xs text-darkcocoa font-medium focus:outline-none focus:border-peach-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Tgl Jatuh Tempo</label>
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
                  <label className="font-bold text-darkcocoa block mb-1">Uang Deposit (Rp)</label>
                  <input
                    type="number"
                    step={100000}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-2.5 py-1.5 text-xs text-darkcocoa font-bold focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>

              {/* Kontak Darurat Keluarga */}
              <div className="p-3 bg-sakura-50/50 rounded-2xl border border-sakura-200/80 space-y-2">
                <p className="font-bold text-darkcocoa text-xs">
                  Kontak Darurat Keluarga (Wajib untuk Keamanan Kos):
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nama Wali (Ayah/Ibu)"
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
                  onClick={() => setIsCheckInModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-softgray hover:bg-cream-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-matcha-500 hover:bg-matcha-400 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-cute flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Konfirmasi Check-In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: KTP VIEWER POPUP                                */}
      {/* ======================================================== */}
      {isKtpModalOpen && ktpViewerData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/70 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-6 max-w-md w-full space-y-4 font-body relative">
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
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: CHECK-OUT PENGHUNI                              */}
      {/* ======================================================== */}
      {isCheckOutModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50">
          <div className="bg-white rounded-3xl shadow-cute border border-cream-200 p-6 max-w-md w-full space-y-4 font-body">
            <div className="flex items-center gap-3 border-b border-cream-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                  Check-Out Penghuni
                </h3>
                <p className="text-xs text-softgray">
                  Kamar <strong>{selectedRoom.number}</strong> ({selectedRoom.tenantName})
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
                  <span>Kembalikan Uang Jaminan / Deposit</span>
                </label>
                <p className="text-[11px] text-softgray pl-6">
                  {refundDeposit
                    ? 'Status deposit akan diubah menjadi Refunded.'
                    : 'Deposit tidak dikembalikan (misal untuk ganti kerusakan/denda).'}
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
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: HAPUS LANTAI                                    */}
      {/* ======================================================== */}
      {deleteFloorTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-cute border border-cream-200 p-6 max-w-md w-full space-y-4 font-body">
            <div className="flex items-center gap-3 border-b border-cream-100 pb-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  deleteFloorTarget.occupiedCount > 0
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-red-100 text-red-500'
                }`}
              >
                {deleteFloorTarget.occupiedCount > 0 ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                  Hapus Lantai {deleteFloorTarget.floorNum}
                </h3>
                <p className="text-xs text-softgray">
                  Cabang: <strong>{deleteFloorTarget.propertyName}</strong>
                </p>
              </div>
            </div>

            {deleteFloorTarget.occupiedCount > 0 ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 space-y-1">
                  <p className="font-bold">❌ Tidak Dapat Menghapus Lantai Ini</p>
                  <p>
                    Lantai {deleteFloorTarget.floorNum} masih memiliki{' '}
                    <strong>{deleteFloorTarget.occupiedCount} kamar terisi</strong>.
                  </p>
                  <p className="text-[11px] text-amber-700">
                    Silakan lakukan check-out atau pindahkan penghuni terlebih dahulu sebelum menghapus lantai ini demi keamanan data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteFloorTarget(null)}
                  className="w-full py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs transition-colors"
                >
                  Mengerti & Tutup
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-softgray leading-relaxed">
                  {deleteFloorTarget.roomsCount > 0 ? (
                    <>
                      Lantai {deleteFloorTarget.floorNum} memiliki{' '}
                      <strong className="text-darkcocoa">{deleteFloorTarget.roomsCount} kamar</strong> kosong/perbaikan.
                      Menghapus lantai ini akan sekaligus menghapus kamar-kamar tersebut dari daftar.
                    </>
                  ) : (
                    <>
                      Apakah Anda yakin ingin menghapus <strong>Lantai {deleteFloorTarget.floorNum}</strong> yang kosong ini?
                    </>
                  )}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-cream-100">
                  <button
                    type="button"
                    onClick={() => setDeleteFloorTarget(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-softgray hover:bg-cream-100"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeleteFloor}
                    className="bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Lantai</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SaaS Room Quota Limit Modal */}
      {planLimitData && (
        <PlanLimitModal
          isOpen={isPlanLimitModalOpen}
          onClose={() => setIsPlanLimitModalOpen(false)}
          type="room"
          current={planLimitData.current}
          max={planLimitData.max}
          planName={planLimitData.planName}
        />
      )}
    </div>
  );
}

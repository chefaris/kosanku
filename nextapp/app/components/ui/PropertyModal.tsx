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
  Save,
  Globe2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldCheck,
  FileText,
  Compass,
  Zap,
  Car,
  Clock,
  Coins,
  ExternalLink,
  Camera,
  Upload,
  Loader2
} from 'lucide-react';
import {
  Property,
  useKosStore,
  defaultKosPhotoPresets,
  defaultKosRules,
  defaultCommonKosFacilities,
  checkPropertyEligibility
} from '../../lib/store/useKosStore';
import { ImageCompressorUploader } from '../common/ImageCompressorUploader';

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
  const { addProperty, updateProperty, rooms } = useKosStore();

  const [activeTab, setActiveTab] = useState<'basic' | 'policy' | 'promotion'>('basic');

  // Basic Details
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bandung');
  const [type, setType] = useState<Property['type']>('Campur');
  const [floors, setFloors] = useState<number>(2);
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // Policy & Transparent Costs
  const [electricityType, setElectricityType] = useState<'token' | 'included' | 'meter_monthly'>('token');
  const [depositAmount, setDepositAmount] = useState<number | string>(0);
  const [parkingFeeCar, setParkingFeeCar] = useState<number | string>(0);
  const [curfewPolicy, setCurfewPolicy] = useState('Akses 24 Jam Mandiri');
  const [minimalRentMonths, setMinimalRentMonths] = useState<number>(1);

  // Promotion & Catalog Details
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [rules, setRules] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(true);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  useEffect(() => {
    if (editingProperty) {
      setName(editingProperty.name);
      setAddress(editingProperty.address);
      setCity(editingProperty.city || 'Bandung');
      setType(editingProperty.type);
      setFloors(editingProperty.floors || 2);
      setManagerName(editingProperty.managerName || '');
      setManagerPhone(editingProperty.managerPhone || '');
      setBankName(editingProperty.bankName || '');
      setAccountNumber(editingProperty.accountNumber || '');
      setAccountHolder(editingProperty.accountHolder || '');

      setElectricityType(editingProperty.electricityType || 'token');
      setDepositAmount(editingProperty.depositAmount !== undefined ? editingProperty.depositAmount : 0);
      setParkingFeeCar(editingProperty.parkingFeeCar !== undefined ? editingProperty.parkingFeeCar : 0);
      setCurfewPolicy(editingProperty.curfewPolicy || 'Akses 24 Jam Mandiri');
      setMinimalRentMonths(editingProperty.minimalRentMonths || 1);

      setDescription(editingProperty.description || '');
      setCoverPhoto(editingProperty.coverPhoto || editingProperty.photos?.[0] || '');
      setPhotos(editingProperty.photos || []);
      setRules(editingProperty.rules || defaultKosRules.slice(0, 3));
      setFacilities(editingProperty.facilities || defaultCommonKosFacilities.slice(0, 4));
      setIsPublished(editingProperty.isPublished !== false);
      setGoogleMapsUrl(editingProperty.googleMapsUrl || '');
    } else {
      setName('');
      setAddress('');
      setCity('Bandung');
      setType('Campur');
      setFloors(2);
      setManagerName('');
      setManagerPhone('');
      setBankName('BCA');
      setAccountNumber('');
      setAccountHolder('');

      setElectricityType('token');
      setDepositAmount(0);
      setParkingFeeCar(0);
      setCurfewPolicy('Akses 24 Jam Mandiri');
      setMinimalRentMonths(1);

      setDescription('');
      setCoverPhoto(defaultKosPhotoPresets[0].url);
      setPhotos([defaultKosPhotoPresets[0].url, defaultKosPhotoPresets[1].url]);
      setRules(defaultKosRules.slice(0, 3));
      setFacilities(defaultCommonKosFacilities.slice(0, 4));
      setIsPublished(true);
      setGoogleMapsUrl('');
    }
    setActiveTab('basic');
  }, [editingProperty, isOpen]);

  if (!isOpen) return null;

  // Build temporary property object to calculate live eligibility score
  const tempProperty: Property = {
    id: editingProperty?.id || 'temp',
    name,
    address,
    city,
    type,
    floors,
    managerName,
    managerPhone,
    coverPhoto,
    photos,
    facilities,
    isPublished,
    electricityType,
    depositAmount: Number(depositAmount) || 0,
    curfewPolicy
  };

  const eligibility = checkPropertyEligibility(tempProperty, rooms);

  const handleAddPhoto = (url: string) => {
    if (!url.trim()) return;
    if (!photos.includes(url.trim())) {
      const updated = [...photos, url.trim()];
      setPhotos(updated);
      if (!coverPhoto) setCoverPhoto(url.trim());
    }
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (urlToRemove: string) => {
    const updated = photos.filter((p) => p !== urlToRemove);
    setPhotos(updated);
    if (coverPhoto === urlToRemove) {
      setCoverPhoto(updated[0] || '');
    }
  };

  const handleImagesUploaded = (dataUrls: string[]) => {
    setPhotos((prev) => {
      const next = [...prev, ...dataUrls];
      if (!coverPhoto && next.length > 0) {
        setCoverPhoto(next[0]);
      }
      return next;
    });
    if (!coverPhoto && dataUrls.length > 0) {
      setCoverPhoto(dataUrls[0]);
    }
  };

  const toggleRule = (rule: string) => {
    if (rules.includes(rule)) {
      setRules(rules.filter((r) => r !== rule));
    } else {
      setRules([...rules, rule]);
    }
  };

  const toggleFacility = (fac: string) => {
    if (facilities.includes(fac)) {
      setFacilities(facilities.filter((f) => f !== fac));
    } else {
      setFacilities([...facilities, fac]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    const finalPhotos = photos.length > 0 ? photos : coverPhoto ? [coverPhoto] : [];
    const finalCover = coverPhoto || finalPhotos[0] || '';

    const payload: Partial<Property> = {
      name: name.trim(),
      address: address.trim(),
      city: city.trim() || 'Bandung',
      type,
      floors: Number(floors) || 1,
      managerName: managerName.trim() || undefined,
      managerPhone: managerPhone.trim() || undefined,
      bankName: bankName.trim() || undefined,
      accountNumber: accountNumber.trim() || undefined,
      accountHolder: accountHolder.trim() || undefined,
      description: description.trim() || undefined,
      coverPhoto: finalCover,
      photos: finalPhotos,
      rules,
      facilities,
      isPublished,
      googleMapsUrl: googleMapsUrl.trim() || undefined,
      electricityType,
      depositAmount: Number(depositAmount) || 0,
      parkingFeeCar: Number(parkingFeeCar) || 0,
      parkingFeeMotor: 0,
      curfewPolicy: curfewPolicy.trim() || 'Akses 24 Jam Mandiri',
      minimalRentMonths: Number(minimalRentMonths) || 1
    };

    if (editingProperty) {
      updateProperty(editingProperty.id, payload);
    } else {
      addProperty(payload as Omit<Property, 'id'>);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-darkcocoa/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-cute overflow-hidden z-10 flex flex-col max-h-[92vh] border border-cream-200"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-peach-100/70 via-sakura-100/60 to-cream-100/60 border-b border-cream-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-peach-600 text-white flex items-center justify-center shadow-cute">
                <Building2 className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa flex items-center gap-2">
                  <span>{editingProperty ? 'Edit Cabang & Etalase Kos' : 'Daftarkan Cabang Kos Baru'}</span>
                </h3>
                <p className="font-body text-xs text-softgray">
                  Lengkapi data kos agar otomatis tayang di katalog promosi website utama
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-softgray hover:text-darkcocoa hover:bg-cream-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-cream-200 bg-cream-50/50 px-3 sm:px-6 pt-2 overflow-x-auto scrollbar-none gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`pb-2.5 px-2.5 sm:px-3 font-heading font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 flex-shrink-0 ${
                activeTab === 'basic'
                  ? 'border-peach-600 text-peach-600'
                  : 'border-transparent text-softgray hover:text-darkcocoa'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>1. Data Pokok &amp; Rekening</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('policy')}
              className={`pb-2.5 px-2.5 sm:px-3 font-heading font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 flex-shrink-0 ${
                activeTab === 'policy'
                  ? 'border-peach-600 text-peach-600'
                  : 'border-transparent text-softgray hover:text-darkcocoa'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>2. Biaya &amp; Kebijakan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('promotion')}
              className={`pb-2.5 px-2.5 sm:px-3 font-heading font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 flex-shrink-0 ${
                activeTab === 'promotion'
                  ? 'border-peach-600 text-peach-600'
                  : 'border-transparent text-softgray hover:text-darkcocoa'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>3. Foto &amp; Etalase</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  eligibility.isEligible ? 'bg-matcha-100 text-matcha-700' : 'bg-peach-100 text-peach-700'
                }`}
              >
                {eligibility.completedCount}/{eligibility.totalCount}
              </span>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 font-body text-darkcocoa">
            {/* Live Auto-Listing Eligibility Banner */}
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 transition-colors ${
                eligibility.isEligible
                  ? 'bg-matcha-50/90 border-matcha-200 text-matcha-800'
                  : 'bg-peach-50/70 border-peach-200 text-darkcocoa'
              }`}
            >
              {eligibility.isEligible ? (
                <CheckCircle2 className="w-5 h-5 text-matcha-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-peach-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wide">
                    {eligibility.isEligible
                      ? '🎉 KOS ANDA SIAP TAYANG DI KATALOG PUBLIK!'
                      : `PROGRES AUTO-LISTING: ${eligibility.completedCount}/${eligibility.totalCount} SYARAT TERPENUHI`}
                  </span>
                  <span className="font-bold text-[11px]">{eligibility.score}% Lengkap</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {eligibility.isEligible
                    ? 'Semua data usaha kost lengkap! Properti ini akan otomatis tampil di katalog pencarian calon penghuni pada website utama.'
                    : `Belum tayang otomatis. Syarat yang masih kurang: ${eligibility.missingDetails.slice(0, 2).join(', ')}${
                        eligibility.missingDetails.length > 2 ? ` (+${eligibility.missingDetails.length - 2} lainnya)` : ''
                      }.`}
                </p>
              </div>
            </div>

            {/* TAB 1: BASIC DETAILS */}
            {activeTab === 'basic' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Nama Cabang */}
                <div>
                  <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                    Nama Cabang Kost <span className="text-peach-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: KosanKu Paviliun Dago"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Kota & Tipe Kos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                      Kota / Wilayah <span className="text-peach-500">*</span>
                    </label>
                    <div className="relative">
                      <Compass className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Bandung, Jakarta, Jogja"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                      Tipe Penghuni
                    </label>
                    <div className="relative">
                      <Users2 className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as Property['type'])}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                      >
                        <option value="Campur">Campur (Putra &amp; Putri)</option>
                        <option value="Putri">Khusus Putri 🌸</option>
                        <option value="Putra">Khusus Putra 🌿</option>
                        <option value="Pasutri">Pasutri (Pasangan) 💍</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Alamat Lengkap */}
                <div>
                  <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                    Alamat Lengkap Lokasi <span className="text-peach-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-softgray absolute left-3.5 top-3" />
                    <textarea
                      required
                      rows={2}
                      placeholder="Jl. Dago Asri No. 12, Kel. Dago, Kec. Coblong, Kota Bandung..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium resize-none"
                    />
                  </div>
                </div>

                {/* Jumlah Lantai */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

                  <div>
                    <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                      Link Google Maps (Opsional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://maps.google.com/?q=..."
                      value={googleMapsUrl}
                      onChange={(e) => setGoogleMapsUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Kontak WhatsApp Pengelola (PENTING untuk calon penyewa) */}
                <div className="pt-2 border-t border-cream-100">
                  <h4 className="text-xs font-extrabold text-softgray uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Kontak WhatsApp Pemilik / Pengelola</span>
                    <span className="text-[10px] text-peach-500 font-bold lowercase">syarat tayang katalog</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Pengelola (cth: Pak Asep / Bu Eni)"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                    />
                    <div className="relative">
                      <Phone className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="No. WhatsApp (0812-xxxx-xxxx)"
                        value={managerPhone}
                        onChange={(e) => setManagerPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-400 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Rekening Pembayaran */}
                <div className="pt-2 border-t border-cream-100">
                  <h4 className="text-xs font-extrabold text-softgray uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
              </div>
            )}

            {/* TAB 2: BIAYA & KEBIJAKAN PRAKTIS */}
            {activeTab === 'policy' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* 1. Skema Listrik */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Skema Pembayaran Listrik Kamar</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'token', label: 'Token Mandiri', desc: 'Penghuni isi token listrik sendiri per kamar' },
                      { id: 'included', label: 'Termasuk Sewa', desc: 'Listrik sudah termasuk di tarif sewa bulanan' },
                      { id: 'meter_monthly', label: 'Meteran Pascabayar', desc: 'Dihitung per kWh sesuai pemakaian tiap bulan' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setElectricityType(item.id as any)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          electricityType === item.id
                            ? 'border-peach-600 bg-peach-50 text-peach-900 font-bold shadow-xs'
                            : 'border-cream-200 bg-white hover:bg-cream-50 text-darkcocoa'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-heading text-xs font-extrabold">{item.label}</span>
                          {electricityType === item.id && <CheckCircle2 className="w-3.5 h-3.5 text-peach-600" />}
                        </div>
                        <p className="text-[10px] text-softgray leading-tight">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Uang Jaminan / Deposit & Biaya Parkir */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-peach-600" />
                      <span>Uang Deposit / Jaminan (Rp)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-softgray">
                        Rp
                      </span>
                      <input
                        type="number"
                        placeholder="0 (Jika tanpa deposit)"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-600 text-xs font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-softgray mt-1">
                      Uang jaminan yang dikembalikan saat penyewa checkout jika tidak ada kerusakan.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-peach-600" />
                      <span>Biaya Parkir Mobil (Rp/Bln)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-softgray">
                        Rp
                      </span>
                      <input
                        type="number"
                        placeholder="0 (Jika gratis / tidak ada)"
                        value={parkingFeeCar}
                        onChange={(e) => setParkingFeeCar(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-600 text-xs font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-softgray mt-1">
                      Isi 0 jika fasilitas parkir mobil gratis atau termasuk sewa.
                    </p>
                  </div>
                </div>

                {/* 3. Kebijakan Jam Malam & Minimal Sewa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-peach-600" />
                      <span>Akses Gerbang / Jam Malam</span>
                    </label>
                    <select
                      value={curfewPolicy}
                      onChange={(e) => setCurfewPolicy(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-600 text-xs font-bold"
                    >
                      <option value="Akses 24 Jam Mandiri">Akses 24 Jam Mandiri (Kunci Sendiri)</option>
                      <option value="Akses 24 Jam Smart Lock">Akses 24 Jam dengan Smart Lock / Kartu</option>
                      <option value="Jam Malam Gerbang 23.00 WIB">Jam Malam Gerbang 23.00 WIB</option>
                      <option value="Jam Malam Gerbang 22.00 WIB">Jam Malam Gerbang 22.00 WIB</option>
                      <option value="Bebas Jam Malam Tanpa Kunci">Bebas Jam Malam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-peach-600" />
                      <span>Minimal Durasi Sewa</span>
                    </label>
                    <select
                      value={minimalRentMonths}
                      onChange={(e) => setMinimalRentMonths(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-600 text-xs font-bold"
                    >
                      <option value={1}>Minimal 1 Bulan</option>
                      <option value={3}>Minimal 3 Bulan</option>
                      <option value={6}>Minimal 6 Bulan</option>
                      <option value={12}>Minimal 1 Tahun</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROMOTION & PUBLIC CATALOG */}
            {activeTab === 'promotion' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Switch Publikasikan */}
                <div className="p-3.5 rounded-2xl bg-peach-50/70 border border-peach-200 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-heading font-bold text-xs sm:text-sm text-darkcocoa">
                      Tampilkan di Katalog Promosi Website
                    </p>
                    <p className="text-[11px] text-softgray">
                      Jika aktif dan data lengkap, kos akan otomatis dipromosikan ke calon penyewa di website utama tanpa biaya komisi.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-cream-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-peach-600"></div>
                  </label>
                </div>

                {/* Tautan Google Maps / Titik Lokasi Peta */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-peach-600" />
                      <span>Tautan / Titik Lokasi Google Maps</span>
                    </label>
                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-peach-600 hover:underline flex items-center gap-1"
                      >
                        <span>Uji Buka Titik Peta</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="Contoh: https://maps.google.com/?q=Nama+Kos+Jalan+Kota atau tautan bagikan Google Maps"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-600 text-xs font-medium"
                  />
                  <p className="text-[10px] text-softgray mt-1">
                    Calon penghuni dapat langsung mengklik tombol &ldquo;Buka di Google Maps&rdquo; pada katalog untuk melihat navigasi rute ke kos Anda.
                  </p>
                </div>

                {/* Deskripsi Keunggulan Kost */}
                <div>
                  <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                    Deskripsi &amp; Keunggulan Lokasi Kost
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Kos nyaman dekat Kampus ITB & Unpad Dipatiukur, hanya 5 menit jalan kaki. Lingkungan sejuk, tenang, bebas banjir, dekat laundry dan minimarket..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-cream-50 border border-cream-200 focus:outline-none focus:border-peach-600 text-xs sm:text-sm font-medium resize-none"
                  />
                </div>

                {/* Galeri Foto Kamar & Bangunan */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider">
                      Foto Kamar &amp; Kost <span className="text-peach-600">*</span>
                    </label>
                    <span className="text-[11px] text-softgray">
                      {photos.length} foto tersimpan
                    </span>
                  </div>

                  {/* Unggah Foto Asli dari HP / Komputer (Tanpa Cloud Backend) */}
                  <ImageCompressorUploader
                    id="property-kos-photo-uploader"
                    onImagesCompressed={handleImagesUploaded}
                    className="mb-3"
                  />

                  {/* Foto yang Terpilih */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
                      {photos.map((url, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-2xl overflow-hidden aspect-video border-2 group ${
                            coverPhoto === url ? 'border-peach-600 ring-2 ring-peach-300' : 'border-cream-200'
                          }`}
                        >
                          <img
                            src={url}
                            alt="Foto Kos"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-darkcocoa/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                            <button
                              type="button"
                              onClick={() => setCoverPhoto(url)}
                              className="px-2 py-1 rounded-lg bg-peach-600 text-white text-[10px] font-bold shadow-xs hover:scale-105"
                            >
                              {coverPhoto === url ? '⭐ Sampul' : 'Jadikan Sampul'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(url)}
                              className="p-1 rounded-lg bg-red-500 text-white text-[10px] hover:scale-105"
                              title="Hapus foto ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {coverPhoto === url && (
                            <span className="absolute bottom-1.5 left-1.5 bg-peach-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                              Foto Sampul Utama
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pilih dari Preset Galeri Aesthetic (1-Klik) */}
                  <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
                    <span className="text-[11px] font-bold text-darkcocoa block">
                      💡 Pilih Cepat dari Galeri Foto Aesthetic Bawaan:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {defaultKosPhotoPresets.map((preset) => {
                        const isSelected = photos.includes(preset.url);
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                handleRemovePhoto(preset.url);
                              } else {
                                handleAddPhoto(preset.url);
                              }
                            }}
                            className={`rounded-xl overflow-hidden border-2 aspect-square relative group transition-all ${
                              isSelected ? 'border-peach-600 ring-2 ring-peach-300' : 'border-cream-200 opacity-70 hover:opacity-100'
                            }`}
                            title={preset.name}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-peach-600 text-white rounded-full p-0.5 shadow-xs">
                                <CheckCircle2 className="w-3 h-3" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input URL Foto Kustom */}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="url"
                      placeholder="Atau tempel link URL foto lain (https://...)"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs focus:outline-none focus:border-peach-600 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddPhoto(newPhotoUrl)}
                      className="px-3.5 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-darkcocoa text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>

                {/* Fasilitas Bersama Kos */}
                <div>
                  <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                    Fasilitas Gedung &amp; Bersama
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {defaultCommonKosFacilities.map((fac) => {
                      const isSelected = facilities.includes(fac);
                      return (
                        <button
                          key={fac}
                          type="button"
                          onClick={() => toggleFacility(fac)}
                          className={`p-2 rounded-xl border text-left text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-peach-600 text-white border-peach-600 shadow-xs'
                              : 'bg-cream-50 text-darkcocoa border-cream-200 hover:border-peach-300'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                          <span className="truncate">{fac}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Peraturan Kos */}
                <div>
                  <label className="block text-xs font-bold text-darkcocoa uppercase tracking-wider mb-1.5">
                    Peraturan Kos
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {defaultKosRules.map((rule) => {
                      const isSelected = rules.includes(rule);
                      return (
                        <button
                          key={rule}
                          type="button"
                          onClick={() => toggleRule(rule)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-peach-50 text-darkcocoa border-peach-400 shadow-2xs font-bold'
                              : 'bg-cream-50 text-softgray border-cream-200 hover:border-peach-300'
                          }`}
                        >
                          <span className="line-clamp-1">{rule}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-peach-600 flex-shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-cream-100 flex items-center justify-between gap-3">
              <div className="text-xs text-softgray">
                {activeTab === 'basic' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('policy')}
                    className="text-peach-600 font-extrabold hover:underline"
                  >
                    Lanjut ke Biaya &amp; Kebijakan &rarr;
                  </button>
                ) : activeTab === 'policy' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('promotion')}
                    className="text-peach-600 font-extrabold hover:underline"
                  >
                    Lanjut ke Foto &amp; Etalase &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('policy')}
                    className="text-softgray font-semibold hover:underline"
                  >
                    &larr; Kembali ke Biaya &amp; Kebijakan
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-softgray hover:bg-cream-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 rounded-2xl bg-peach-600 hover:bg-peach-700 active:bg-peach-800 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md shadow-peach-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" strokeWidth={2} />
                  <span>{editingProperty ? 'Simpan Data Cabang' : 'Daftarkan Cabang'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

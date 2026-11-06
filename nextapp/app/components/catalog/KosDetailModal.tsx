'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  MessageCircle,
  Share2,
  Check,
  CheckCircle2,
  ShieldCheck,
  Star,
  Snowflake,
  Wifi,
  ShowerHead,
  Car,
  Utensils,
  Lock,
  Layers,
  Sparkles,
  Phone,
  DoorOpen,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  Coins,
  ExternalLink,
  Heart
} from 'lucide-react';
import { Property, Room, useKosStore } from '../../lib/store/useKosStore';

interface KosDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  rooms: Room[];
}

export const KosDetailModal: React.FC<KosDetailModalProps> = ({
  isOpen,
  onClose,
  property,
  rooms
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSurveyScheduler, setShowSurveyScheduler] = useState(false);
  const [surveyDate, setSurveyDate] = useState('');
  const [surveyTimeSlot, setSurveyTimeSlot] = useState('14:00 - 16:00 WIB (Sore)');

  const { toggleWishlist, isWishlisted } = useKosStore();

  if (!isOpen || !property) return null;

  const isFav = isWishlisted(property.id);

  const propRooms = rooms.filter((r) => r.propertyId === property.id);
  const vacantRooms = propRooms.filter((r) => r.status === 'vacant');
  const roomPrices = propRooms.map((r) => r.price).filter((p) => p > 0);
  const minPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 1500000;
  const maxPrice = roomPrices.length > 0 ? Math.max(...roomPrices) : minPrice;

  const photoList =
    property.photos && property.photos.length > 0
      ? property.photos
      : property.coverPhoto
      ? [property.coverPhoto]
      : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const cleanPhone = (property.managerPhone || '').replace(/\D/g, '');
  const waTarget = cleanPhone.startsWith('0')
    ? '62' + cleanPhone.slice(1)
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : '6281234567890';

  const handleChatWhatsApp = (withSurvey = false) => {
    let textMsg = '';
    if (withSurvey && surveyDate) {
      textMsg = encodeURIComponent(
        `Halo Kak ${property.managerName || 'Pengelola'}!\nSaya melihat info kos "${property.name}" (${property.address}) di katalog pawskost.\n\nSaya tertarik dan ingin menjadwalkan SURVEI LOKASI pada:\n📅 Hari/Tanggal: ${surveyDate}\n⏰ Waktu: ${surveyTimeSlot}\n\nApakah jadwal tersebut diperbolehkan dan ada yang bertugas di lokasi? Terima kasih!`
      );
    } else {
      textMsg = encodeURIComponent(
        `Halo Kak ${property.managerName || 'Pengelola'}!\nSaya melihat info kos "${property.name}" (${property.address}) di katalog pawskost.\n\nApakah saat ini masih ada kamar yang kosong? Bisa mohon informasi jadwal untuk survei lokasi dan persyaratannya? Terima kasih!`
      );
    }
    window.open(`https://wa.me/${waTarget}?text=${textMsg}`, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/katalog/${property.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getGenderBadge = (type: Property['type']) => {
    switch (type) {
      case 'Putri':
        return { label: 'Khusus Putri', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'Putra':
        return { label: 'Khusus Putra', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'Pasutri':
        return { label: 'Pasutri', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Campur', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
  };

  const genderInfo = getGenderBadge(property.type);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-darkcocoa/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden z-10 flex flex-col max-h-[92vh] my-auto font-body text-darkcocoa"
        >
          {/* Top Bar with Title & Close */}
          <div className="p-4 sm:p-5 border-b border-cream-200 bg-white sticky top-0 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${genderInfo.bg} flex-shrink-0`}>
                {genderInfo.label}
              </span>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa truncate">
                {property.name}
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => property && toggleWishlist(property.id)}
                className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold border ${
                  isFav
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'text-softgray hover:text-darkcocoa hover:bg-cream-100 border-cream-200'
                }`}
                title={isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden sm:inline">{isFav ? 'Tersimpan' : 'Favorit'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-xl text-softgray hover:text-darkcocoa hover:bg-cream-100 border border-cream-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Salin Tautan Kos"
              >
                {copiedLink ? <Check className="w-4 h-4 text-matcha-500" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedLink ? 'Tersalin!' : 'Bagikan'}</span>
              </button>

              <a
                href={`/katalog/${property.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-softgray hover:text-primary hover:bg-cream-100 border border-cream-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Buka Halaman Publik (SEO)"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden md:inline">Halaman Penuh</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-softgray hover:text-darkcocoa hover:bg-cream-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* 1. PHOTO GALLERY CAROUSEL */}
            <div className="space-y-2.5">
              <div className="relative aspect-video sm:aspect-[16/9] md:aspect-[21/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-cream-100 border border-cream-200 shadow-xs">
                <img
                  src={photoList[activePhotoIdx] || photoList[0]}
                  alt={property.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Badges on image */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-darkcocoa/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>4.9 (Terverifikasi)</span>
                  </span>

                  {vacantRooms.length > 0 ? (
                    <span className="bg-matcha-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-cute">
                      Sisa {vacantRooms.length} Kamar Kosong
                    </span>
                  ) : (
                    <span className="bg-darkcocoa/80 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full">
                      Kamar Penuh
                    </span>
                  )}
                </div>

                {/* Left/Right controls if multiple photos */}
                {photoList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActivePhotoIdx((prev) => (prev === 0 ? photoList.length - 1 : prev - 1))
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-darkcocoa flex items-center justify-center shadow-md transition-all active:scale-90"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActivePhotoIdx((prev) => (prev === photoList.length - 1 ? 0 : prev + 1))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-darkcocoa flex items-center justify-center shadow-md transition-all active:scale-90"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails row */}
              {photoList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {photoList.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActivePhotoIdx(i)}
                      className={`relative w-16 sm:w-20 aspect-video rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activePhotoIdx === i
                          ? 'border-peach-500 ring-2 ring-peach-300 scale-102'
                          : 'border-cream-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. HEADER INFO & PRICING */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
              <div className="space-y-1">
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-darkcocoa">
                  {property.name}
                </h1>
                <p className="text-xs sm:text-sm text-softgray flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-peach-500 flex-shrink-0" />
                  <span>{property.address}</span>
                  {property.city && <strong className="text-darkcocoa">• {property.city}</strong>}
                </p>
              </div>

              <div className="bg-peach-50 p-3 sm:p-4 rounded-2xl border border-peach-200 text-left sm:text-right flex-shrink-0">
                <span className="text-[11px] font-bold text-softgray block">Tarif Sewa Bulanan:</span>
                <p className="font-heading font-extrabold text-lg sm:text-xl text-peach-600">
                  {minPrice === maxPrice
                    ? formatRupiah(minPrice)
                    : `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`}
                  <span className="text-xs text-softgray font-normal"> /bln</span>
                </p>
              </div>
            </div>

            {/* 2B. GOOGLE MAPS & TRANSPARANSI BIAYA KOST */}
            <div className="space-y-3 pb-2">
              {/* Google Maps Route Button */}
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={
                    property.googleMapsUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.name} ${property.address} ${property.city || ''}`)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-peach-50 hover:bg-peach-100 text-peach-700 border border-peach-200 text-xs font-extrabold transition-all shadow-2xs hover:scale-[1.02]"
                >
                  <MapPin className="w-3.5 h-3.5 text-peach-600" />
                  <span>Buka di Google Maps &amp; Navigasi Rute</span>
                  <ExternalLink className="w-3 h-3 text-peach-600" />
                </a>

                <span className="text-[11px] text-softgray font-medium">
                  {property.city ? `Area ${property.city}` : 'Lokasi Terdaftar'}
                </span>
              </div>

              {/* Transparansi Biaya & Kebijakan Grid */}
              <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-xs text-darkcocoa uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-peach-600" />
                    <span>Transparansi Biaya &amp; Kebijakan Sewa</span>
                  </span>
                  <span className="text-[10px] font-bold text-softgray">
                    Informasi Lengkap
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {/* 1. Listrik */}
                  <div className="p-2.5 rounded-xl bg-white border border-cream-200 space-y-1">
                    <span className="text-[10px] text-softgray font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" /> Listrik
                    </span>
                    <p className="font-bold text-darkcocoa text-[11px] leading-tight">
                      {property.electricityType === 'included'
                        ? 'Termasuk Sewa'
                        : property.electricityType === 'meter_monthly'
                        ? 'Meteran Bulanan'
                        : 'Token Mandiri (PLN)'}
                    </p>
                  </div>

                  {/* 2. Uang Jaminan / Deposit */}
                  <div className="p-2.5 rounded-xl bg-white border border-cream-200 space-y-1">
                    <span className="text-[10px] text-softgray font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Uang Jaminan
                    </span>
                    <p className="font-bold text-darkcocoa text-[11px] leading-tight">
                      {property.depositAmount && property.depositAmount > 0
                        ? `${formatRupiah(property.depositAmount)} (Refundable)`
                        : 'Bebas Deposit'}
                    </p>
                  </div>

                  {/* 3. Parkir Mobil */}
                  <div className="p-2.5 rounded-xl bg-white border border-cream-200 space-y-1">
                    <span className="text-[10px] text-softgray font-semibold flex items-center gap-1">
                      <Car className="w-3 h-3 text-peach-600" /> Parkir Mobil
                    </span>
                    <p className="font-bold text-darkcocoa text-[11px] leading-tight">
                      {property.parkingFeeCar && property.parkingFeeCar > 0
                        ? `${formatRupiah(property.parkingFeeCar)}/bln`
                        : 'Gratis Parkir Mobil'}
                    </p>
                  </div>

                  {/* 4. Akses / Jam Gerbang */}
                  <div className="p-2.5 rounded-xl bg-white border border-cream-200 space-y-1">
                    <span className="text-[10px] text-softgray font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-peach-600" /> Akses Gerbang
                    </span>
                    <p
                      className="font-bold text-darkcocoa text-[11px] leading-tight line-clamp-1"
                      title={property.curfewPolicy || 'Akses 24 Jam Mandiri'}
                    >
                      {property.curfewPolicy || 'Akses 24 Jam Mandiri'}
                    </p>
                  </div>
                </div>

                {property.minimalRentMonths && property.minimalRentMonths > 1 && (
                  <p className="text-[11px] text-darkcocoa/80 font-medium pt-1 border-t border-cream-200">
                    📌 <strong>Catatan:</strong> Properti ini memberlakukan minimal masa sewa <strong>{property.minimalRentMonths} bulan</strong>.
                  </p>
                )}
              </div>

              {/* 2C. SURVEY SCHEDULER SECTION */}
              <div className="p-4 rounded-2xl bg-peach-50/60 border border-peach-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-peach-600 text-white flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-xs sm:text-sm text-darkcocoa">
                        Mau Cek Langsung? Jadwalkan Survei Lokasi
                      </h4>
                      <p className="text-[11px] text-softgray">
                        Pilih tanggal &amp; jam untuk berkunjung dan melihat kamar secara langsung
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSurveyScheduler(!showSurveyScheduler)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-peach-300 text-peach-700 text-xs font-bold hover:bg-peach-100 transition-colors flex-shrink-0"
                  >
                    {showSurveyScheduler ? 'Tutup Form' : 'Atur Jadwal'}
                  </button>
                </div>

                {showSurveyScheduler && (
                  <div className="pt-2 border-t border-peach-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-bold text-darkcocoa uppercase tracking-wider mb-1">
                        Pilih Tanggal Survei:
                      </label>
                      <input
                        type="date"
                        value={surveyDate}
                        onChange={(e) => setSurveyDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-peach-300 text-xs font-bold text-darkcocoa focus:outline-none focus:ring-1 focus:ring-peach-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-darkcocoa uppercase tracking-wider mb-1">
                        Perkiraan Jam Kunjungan:
                      </label>
                      <select
                        value={surveyTimeSlot}
                        onChange={(e) => setSurveyTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-peach-300 text-xs font-bold text-darkcocoa focus:outline-none focus:ring-1 focus:ring-peach-600"
                      >
                        <option value="09:00 - 12:00 WIB (Pagi)">09:00 - 12:00 WIB (Pagi)</option>
                        <option value="13:00 - 15:00 WIB (Siang)">13:00 - 15:00 WIB (Siang)</option>
                        <option value="15:00 - 17:00 WIB (Sore)">15:00 - 17:00 WIB (Sore)</option>
                        <option value="19:00 - 20:30 WIB (Malam)">19:00 - 20:30 WIB (Malam)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleChatWhatsApp(true)}
                        disabled={!surveyDate}
                        className={`w-full py-2.5 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          surveyDate
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            : 'bg-cream-200 text-softgray cursor-not-allowed'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>
                          {surveyDate
                            ? `Kirim Permintaan Jadwal Survei (${surveyDate}) ke WhatsApp Pemilik`
                            : 'Pilih Tanggal Terlebih Dahulu'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. DESKRIPSI & TENTANG KOS */}
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-sm text-darkcocoa flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-peach-500" />
                <span>Deskripsi &amp; Lingkungan Kost</span>
              </h3>
              <p className="text-xs sm:text-sm text-softgray leading-relaxed bg-cream-50/70 p-4 rounded-2xl border border-cream-200">
                {property.description ||
                  'Kos bersih, aman, dan nyaman dengan lingkungan asri yang mendukung ketenangan istirahat maupun belajar. Lokasi strategis dekat dengan berbagai fasilitas umum, kampus, dan kuliner.'}
              </p>
            </div>

            {/* 4. DAFTAR TIPE KAMAR & KETERSEDIAAN UNIT */}
            {propRooms.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-sm text-darkcocoa flex items-center gap-1.5">
                  <DoorOpen className="w-4 h-4 text-peach-500" />
                  <span>Pilihan Tipe Kamar ({propRooms.length} Total Unit)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from(new Set(propRooms.map((r) => r.type))).map((tName) => {
                    const roomsOfType = propRooms.filter((r) => r.type === tName);
                    const sampleRoom = roomsOfType[0];
                    const vacantOfType = roomsOfType.filter((r) => r.status === 'vacant').length;

                    return (
                      <div
                        key={tName}
                        className="p-3.5 rounded-2xl border border-cream-200 bg-white hover:border-peach-300 transition-colors space-y-2 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-heading font-bold text-sm text-darkcocoa block">
                              Tipe {tName}
                            </span>
                            <span className="text-[11px] text-softgray">
                              {formatRupiah(sampleRoom.price)} /bln
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              vacantOfType > 0
                                ? 'bg-matcha-100 text-matcha-700'
                                : 'bg-cream-100 text-softgray'
                            }`}
                          >
                            {vacantOfType > 0 ? `Tersedia ${vacantOfType} Kamar` : 'Penuh'}
                          </span>
                        </div>

                        {/* Fasilitas Kamar */}
                        <div className="flex items-center gap-2 text-[10px] text-softgray flex-wrap">
                          {sampleRoom.facilities.ac && (
                            <span className="inline-flex items-center gap-1 bg-cream-100 px-2 py-0.5 rounded-md">
                              <Snowflake className="w-3 h-3 text-peach-500" /> AC
                            </span>
                          )}
                          {sampleRoom.facilities.wifi && (
                            <span className="inline-flex items-center gap-1 bg-cream-100 px-2 py-0.5 rounded-md">
                              <Wifi className="w-3 h-3 text-peach-500" /> WiFi
                            </span>
                          )}
                          {sampleRoom.facilities.bath && (
                            <span className="inline-flex items-center gap-1 bg-cream-100 px-2 py-0.5 rounded-md">
                              <ShowerHead className="w-3 h-3 text-peach-500" /> KM Dalam
                            </span>
                          )}
                          {sampleRoom.facilities.custom?.slice(0, 2).map((c) => (
                            <span key={c} className="bg-cream-100 px-2 py-0.5 rounded-md">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. FASILITAS BERSAMA & GEDUNG */}
            {property.facilities && property.facilities.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="font-heading font-bold text-sm text-darkcocoa flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-peach-500" />
                  <span>Fasilitas Gedung &amp; Bersama</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {property.facilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 font-semibold text-darkcocoa flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-peach-500 flex-shrink-0" />
                      <span className="truncate">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PERATURAN KOST */}
            {property.rules && property.rules.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="font-heading font-bold text-sm text-darkcocoa flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-peach-500" />
                  <span>Peraturan &amp; Tata Tertib Kost</span>
                </h3>
                <div className="p-3.5 rounded-2xl bg-sakura-50/60 border border-sakura-200/80 space-y-2 text-xs text-darkcocoa">
                  {property.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-peach-500 mt-1.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. INFORMASI PENGELOLA */}
            <div className="p-4 rounded-2xl bg-cream-100/70 border border-cream-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-peach-100 text-peach-600 flex items-center justify-center font-bold text-base flex-shrink-0 shadow-2xs">
                  {property.managerName ? property.managerName.charAt(0).toUpperCase() : '🏠'}
                </div>
                <div>
                  <p className="font-bold text-darkcocoa text-sm">
                    {property.managerName || 'Pemilik Kos Terdaftar'}
                  </p>
                  <p className="text-[11px] text-softgray">
                    Pengelola Resmi • Respon Cepat via WhatsApp
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-matcha-700 bg-matcha-50 border border-matcha-200 px-2.5 py-1 rounded-full hidden sm:inline-block">
                ✓ Profil Terverifikasi
              </span>
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="p-4 sm:p-5 border-t border-cream-200 bg-white sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-softgray block">Mulai dari:</span>
              <p className="font-heading font-extrabold text-base sm:text-lg text-peach-600">
                {formatRupiah(minPrice)} <span className="text-xs text-softgray font-normal">/bulan</span>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none justify-center px-4 py-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa text-xs sm:text-sm font-bold border border-cream-200 transition-colors flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="w-4 h-4 text-matcha-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Tersalin!' : 'Bagikan Kos'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleChatWhatsApp(false)}
                className="flex-2 sm:flex-none justify-center px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Pemilik via WhatsApp</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

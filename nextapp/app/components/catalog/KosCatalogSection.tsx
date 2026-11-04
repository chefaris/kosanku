'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Search,
  MapPin,
  Star,
  Snowflake,
  Wifi,
  ShowerHead,
  MessageCircle,
  Eye,
  Sparkles,
  RotateCcw,
  Building2,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Users,
  Coins,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useKosStore, Property, checkPropertyEligibility } from '../../lib/store/useKosStore';
import { KosDetailModal } from './KosDetailModal';

interface KosCatalogSectionProps {
  onOpenRegister?: () => void;
  showOwnerCta?: boolean;
}

export const KosCatalogSection: React.FC<KosCatalogSectionProps> = ({
  onOpenRegister,
  showOwnerCta = true
}) => {
  const { properties, rooms } = useKosStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua');
  const [selectedType, setSelectedType] = useState<string>('Semua');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');

  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 1. Filter only properties that pass the 7 Auto-Listing Eligibility criteria
  const eligibleProperties = useMemo(() => {
    return properties.filter((prop) => {
      const eligibility = checkPropertyEligibility(prop, rooms);
      return eligibility.isEligible;
    });
  }, [properties, rooms]);

  // Extract unique cities from eligible properties
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();
    eligibleProperties.forEach((p) => {
      if (p.city) citySet.add(p.city);
    });
    return ['Semua', ...Array.from(citySet)];
  }, [eligibleProperties]);

  // 2. Filter properties based on user search & filters
  const filteredProperties = useMemo(() => {
    return eligibleProperties.filter((prop) => {
      const propRooms = rooms.filter((r) => r.propertyId === prop.id);
      const roomPrices = propRooms.map((r) => r.price).filter((p) => p > 0);
      const minPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 1500000;

      // Text search: matches name, address, or city
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = prop.name.toLowerCase().includes(q);
        const matchAddress = prop.address.toLowerCase().includes(q);
        const matchCity = (prop.city || '').toLowerCase().includes(q);
        if (!matchName && !matchAddress && !matchCity) return false;
      }

      // City filter
      if (selectedCity !== 'Semua') {
        const propCity = prop.city || (prop.address.toLowerCase().includes(selectedCity.toLowerCase()) ? selectedCity : '');
        if (propCity.toLowerCase() !== selectedCity.toLowerCase()) return false;
      }

      // Gender / Type filter
      if (selectedType !== 'Semua') {
        if (prop.type !== selectedType) return false;
      }

      // Price range filter
      if (selectedPriceRange === 'under-15') {
        if (minPrice > 1500000) return false;
      } else if (selectedPriceRange === '15-20') {
        if (minPrice < 1500000 || minPrice > 2000000) return false;
      } else if (selectedPriceRange === 'above-20') {
        if (minPrice < 2000000) return false;
      }

      // Facility filter
      if (selectedFacility === 'ac') {
        const hasAc = propRooms.some((r) => r.facilities.ac) || (prop.facilities || []).some((f) => f.toLowerCase().includes('ac'));
        if (!hasAc) return false;
      } else if (selectedFacility === 'wifi') {
        const hasWifi = propRooms.some((r) => r.facilities.wifi) || (prop.facilities || []).some((f) => f.toLowerCase().includes('wifi'));
        if (!hasWifi) return false;
      } else if (selectedFacility === 'bath') {
        const hasBath = propRooms.some((r) => r.facilities.bath) || (prop.facilities || []).some((f) => f.toLowerCase().includes('mandi'));
        if (!hasBath) return false;
      }

      return true;
    });
  }, [eligibleProperties, rooms, searchQuery, selectedCity, selectedType, selectedPriceRange, selectedFacility]);

  const handleOpenDetail = (prop: Property) => {
    setSelectedPropertyForModal(prop);
    setIsDetailModalOpen(true);
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedCity('Semua');
    setSelectedType('Semua');
    setSelectedPriceRange('all');
    setSelectedFacility('all');
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const isFiltered = Boolean(
    searchQuery.trim() ||
    selectedCity !== 'Semua' ||
    selectedType !== 'Semua' ||
    selectedPriceRange !== 'all' ||
    selectedFacility !== 'all'
  );

  return (
    <div className="font-body text-darkcocoa">
      {/* ======================================================== */}
      {/* 1. MASTER SEARCH HERO SECTION (MAMIKOS / AIRBNB-STYLE)   */}
      {/* ======================================================== */}
      <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 bg-gradient-to-b from-cream-50 via-peach-50/40 to-white overflow-hidden border-b border-cream-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Cute Mascot Greeting Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-peach-200 shadow-xs text-xs font-bold text-darkcocoa hover:border-peach-400 transition-colors">
            <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-peach-300 shadow-2xs flex-shrink-0 bg-peach-50">
              <Image
                src="/mimi-mascot.jpg"
                alt="Maskot Mimi"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span>🐾 Hai! Mimi siap bantu kamu temukan kos idaman tanpa perantara ✨</span>
          </div>

          {/* Catchy Main Heading */}
          <div className="max-w-4xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-darkcocoa tracking-tight leading-tight">
              Temukan Kos Nyaman &amp; Bersih <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-peach-500 via-peach-600 to-sakura-500">
                Langsung dari Pemilik Resmi
              </span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-softgray max-w-2xl mx-auto leading-relaxed">
              Jelajahi kamar kos terverifikasi di berbagai kota. Tanpa calo, info sisa kamar real-time, dan bisa langsung chat WhatsApp pemilik kos dengan 1 klik!
            </p>
          </div>

          {/* Unified Floating Search Console */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-peach-200/80 shadow-cute max-w-4xl mx-auto text-left space-y-4">
            {/* Top Selector Grid: Kota, Tipe, Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Pilih Kota */}
              <div className="p-3 rounded-2xl bg-cream-50/80 border border-cream-200 hover:border-peach-300 transition-colors">
                <label className="text-[11px] font-bold text-softgray flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-peach-500" />
                  <span>Pilih Kota / Area</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent font-heading font-bold text-xs sm:text-sm text-darkcocoa focus:outline-none cursor-pointer appearance-none pr-6"
                  >
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city === 'Semua' ? '🏙️ Semua Kota' : `📍 Kota ${city}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-softgray absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 2. Tipe Kos */}
              <div className="p-3 rounded-2xl bg-cream-50/80 border border-cream-200 hover:border-peach-300 transition-colors">
                <label className="text-[11px] font-bold text-softgray flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-peach-500" />
                  <span>Kategori / Gender</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-transparent font-heading font-bold text-xs sm:text-sm text-darkcocoa focus:outline-none cursor-pointer appearance-none pr-6"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Putri">🌸 Khusus Putri</option>
                    <option value="Putra">🌿 Khusus Putra</option>
                    <option value="Campur">⚡ Campur</option>
                    <option value="Pasutri">💍 Pasutri</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-softgray absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 3. Budget Sewa */}
              <div className="p-3 rounded-2xl bg-cream-50/80 border border-cream-200 hover:border-peach-300 transition-colors">
                <label className="text-[11px] font-bold text-softgray flex items-center gap-1.5 mb-1">
                  <Coins className="w-3.5 h-3.5 text-peach-500" />
                  <span>Budget Bulanan</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full bg-transparent font-heading font-bold text-xs sm:text-sm text-darkcocoa focus:outline-none cursor-pointer appearance-none pr-6"
                  >
                    <option value="all">Semua Tarif</option>
                    <option value="under-15">&lt; Rp 1.5 Juta/bln</option>
                    <option value="15-20">Rp 1.5 - 2 Juta/bln</option>
                    <option value="above-20">&gt; Rp 2 Juta/bln</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-softgray absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bottom Row: Text Keyword + Fasilitas + Tombol Cari */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-softgray absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ketik area kampus (ITB, UI, UGM), nama jalan, atau nama kos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-50/70 border border-cream-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-peach-400 focus:bg-white shadow-2xs transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Facility quick filter */}
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="bg-cream-50/70 border border-cream-200 rounded-2xl px-3.5 py-3 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-400 cursor-pointer"
                >
                  <option value="all">Fasilitas Apapun</option>
                  <option value="ac">❄️ Ada AC</option>
                  <option value="wifi">📶 Ada WiFi</option>
                  <option value="bath">🚿 KM Dalam</option>
                </select>

                {isFiltered && (
                  <button
                    type="button"
                    onClick={handleResetFilter}
                    className="p-3 rounded-2xl bg-cream-100 hover:bg-red-50 text-softgray hover:text-red-500 border border-cream-200 transition-colors"
                    title="Reset Semua Filter"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}

                <a
                  href="#hasil-katalog"
                  className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-peach-500 to-sakura-500 hover:from-peach-600 hover:to-sakura-600 text-white font-heading font-bold text-xs sm:text-sm shadow-cute flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>Lihat Kos ({filteredProperties.length})</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Filter Recommendation Pills */}
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-darkcocoa flex items-center gap-1 text-[11px] text-softgray">
              <span>🔥 Rekomendasi Cepat:</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedCity('Bandung');
                setSelectedType('Putri');
              }}
              className="px-3 py-1 rounded-full bg-white hover:bg-peach-50 border border-cream-200 text-darkcocoa font-semibold text-[11px] shadow-2xs hover:border-peach-300 transition-all flex items-center gap-1"
            >
              <span>🌸 Putri Bandung</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedFacility('ac');
              }}
              className="px-3 py-1 rounded-full bg-white hover:bg-peach-50 border border-cream-200 text-darkcocoa font-semibold text-[11px] shadow-2xs hover:border-peach-300 transition-all flex items-center gap-1"
            >
              <span>❄️ Ada AC &amp; KM Dalam</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('ITB');
              }}
              className="px-3 py-1 rounded-full bg-white hover:bg-peach-50 border border-cream-200 text-darkcocoa font-semibold text-[11px] shadow-2xs hover:border-peach-300 transition-all flex items-center gap-1"
            >
              <span>🎓 Dekat Kampus ITB</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPriceRange('under-15');
              }}
              className="px-3 py-1 rounded-full bg-white hover:bg-peach-50 border border-cream-200 text-darkcocoa font-semibold text-[11px] shadow-2xs hover:border-peach-300 transition-all flex items-center gap-1"
            >
              <span>💰 &lt; 1.5 Juta/bln</span>
            </button>
          </div>

          {/* 3 Main Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-cream-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-peach-100 text-peach-600 flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-heading font-bold text-xs text-darkcocoa">100% Kontak Pemilik</h4>
                <p className="text-[11px] text-softgray">Tanpa perantara &amp; bebas komisi</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-cream-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-matcha-100 text-matcha-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-heading font-bold text-xs text-darkcocoa">Kamar Kosong Real-Time</h4>
                <p className="text-[11px] text-softgray">Sinkron dengan sistem juragan</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-cream-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sakura-100 text-sakura-500 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-heading font-bold text-xs text-darkcocoa">Foto Asli Terverifikasi</h4>
                <p className="text-[11px] text-softgray">Kondisi kamar sesuai kenyataan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CATALOG RESULTS SECTION (CARDS & DETAIL MODAL)        */}
      {/* ======================================================== */}
      <section id="hasil-katalog" className="py-12 sm:py-16 bg-cream-50/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Sub-Header & Live Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cream-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-darkcocoa">
                  Pilihan Kos Terverifikasi
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-700 text-xs font-bold">
                  {filteredProperties.length} Kos Tersedia
                </span>
              </div>
              <p className="text-xs text-softgray mt-0.5">
                {selectedCity !== 'Semua' ? `Menampilkan kos di area ${selectedCity}` : 'Menampilkan kos dari semua wilayah mitra pawskost'}
              </p>
            </div>

            {/* City Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {availableCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCity === city
                      ? 'bg-darkcocoa text-white shadow-xs'
                      : 'bg-white text-softgray hover:text-darkcocoa hover:bg-cream-100 border border-cream-200'
                  }`}
                >
                  {city}
                </button>
              ))}

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 border border-red-200 whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid of Kos Cards */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((prop) => {
                const propRooms = rooms.filter((r) => r.propertyId === prop.id);
                const vacantCount = propRooms.filter((r) => r.status === 'vacant').length;
                const roomPrices = propRooms.map((r) => r.price).filter((p) => p > 0);
                const minPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 1500000;

                const coverImg =
                  prop.coverPhoto ||
                  prop.photos?.[0] ||
                  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';

                const cleanPhone = (prop.managerPhone || '').replace(/\D/g, '');
                const waTarget = cleanPhone.startsWith('0')
                  ? '62' + cleanPhone.slice(1)
                  : cleanPhone.startsWith('62')
                  ? cleanPhone
                  : '6281234567890';

                const handleQuickWa = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const textMsg = encodeURIComponent(
                    `Halo Kak! 🐾 Saya tertarik dengan kos "${prop.name}" di katalog pawskost. Apakah masih ada kamar kosong? Bisa info jadwal survei lokasi? Terima kasih!`
                  );
                  window.open(`https://wa.me/${waTarget}?text=${textMsg}`, '_blank');
                };

                return (
                  <div
                    key={prop.id}
                    onClick={() => handleOpenDetail(prop)}
                    className="group cursor-pointer rounded-3xl bg-white border border-cream-200 shadow-sm hover:shadow-cute hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail with Badges */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-cream-100">
                        <img
                          src={coverImg}
                          alt={prop.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs ${
                              prop.type === 'Putri'
                                ? 'bg-sakura-500 text-white'
                                : prop.type === 'Putra'
                                ? 'bg-matcha-600 text-white'
                                : 'bg-peach-500 text-white'
                            }`}
                          >
                            {prop.type === 'Putri'
                              ? 'Putri 🌸'
                              : prop.type === 'Putra'
                              ? 'Putra 🌿'
                              : 'Campur ⚡'}
                          </span>

                          {vacantCount > 0 ? (
                            <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span>Sisa {vacantCount} Kamar</span>
                            </span>
                          ) : (
                            <span className="bg-darkcocoa/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                              Kamar Penuh
                            </span>
                          )}
                        </div>

                        {/* Bottom-right City Badge */}
                        {prop.city && (
                          <span className="absolute bottom-2.5 right-2.5 bg-darkcocoa/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-peach-400" />
                            <span>{prop.city}</span>
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 space-y-3">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500 mb-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-darkcocoa font-extrabold">4.9</span>
                            <span className="text-softgray font-medium">• Terverifikasi pawskost 🐾</span>
                          </div>

                          <h3 className="font-heading font-extrabold text-base text-darkcocoa group-hover:text-peach-500 transition-colors line-clamp-1">
                            {prop.name}
                          </h3>

                          <p className="text-xs text-softgray line-clamp-1 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-peach-500 flex-shrink-0" />
                            <span>{prop.address}</span>
                          </p>
                        </div>

                        {/* Key Facilities Icons */}
                        <div className="flex items-center gap-3 pt-2 border-t border-cream-100 text-xs text-softgray">
                          <span className="inline-flex items-center gap-1" title="AC Dingin">
                            <Snowflake className="w-3.5 h-3.5 text-peach-400" /> AC
                          </span>
                          <span className="inline-flex items-center gap-1" title="WiFi Cepat">
                            <Wifi className="w-3.5 h-3.5 text-peach-400" /> WiFi
                          </span>
                          <span className="inline-flex items-center gap-1" title="Kamar Mandi Dalam">
                            <ShowerHead className="w-3.5 h-3.5 text-peach-400" /> KM Dalam
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom: Price & Action Buttons */}
                    <div className="p-4 sm:p-5 pt-0 border-t border-cream-100 flex items-center justify-between gap-2 mt-2">
                      <div>
                        <span className="text-[10px] text-softgray block">Mulai dari</span>
                        <p className="font-heading font-extrabold text-sm sm:text-base text-peach-600">
                          {formatRupiah(minPrice)}
                          <span className="text-[10px] text-softgray font-normal">/bln</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleQuickWa}
                          className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 transition-colors shadow-2xs"
                          title="Chat WhatsApp Pemilik"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat WA</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDetail(prop)}
                          className="px-3 py-2 rounded-xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="p-10 bg-white rounded-3xl border border-cream-200 text-center space-y-4 max-w-md mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-peach-100 text-peach-600 flex items-center justify-center mx-auto text-2xl shadow-cute">
                🐾
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-extrabold text-base text-darkcocoa">
                  Belum Ada Kos yang Cocok
                </h4>
                <p className="text-xs text-softgray leading-relaxed">
                  Tidak ada kos yang cocok dengan kriteria pencarian kamu. Coba ganti kata pencarian atau reset filter.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilter}
                className="px-5 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white text-xs font-bold shadow-cute inline-flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </button>
            </div>
          )}

          {/* Banner for Kos Owners to Register & Get Promoted */}
          {showOwnerCta && (
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-darkcocoa via-[#332016] to-darkcocoa text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-peach-300 text-xs font-bold">
                  <span>Khusus Pemilik &amp; Juragan Kos 👑</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight">
                  Ingin Kos Anda Tampil di Katalog Ini?
                </h3>
                <p className="text-xs sm:text-sm text-cream-200/80 max-w-xl">
                  Daftar akun software pawskost sekarang. Begitu Anda melengkapi profil kos, properti Anda akan otomatis dipromosikan ke calon penyewa tanpa biaya komisi!
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {onOpenRegister && (
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="px-6 py-3 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-heading font-bold text-xs sm:text-sm shadow-cute flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>Daftar Coba Gratis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Kos Detail Modal */}
      {selectedPropertyForModal && (
        <KosDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedPropertyForModal(null);
          }}
          property={selectedPropertyForModal}
          rooms={rooms.filter((r) => r.propertyId === selectedPropertyForModal.id)}
        />
      )}
    </div>
  );
};

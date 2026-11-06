'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Users,
  Coins,
  ChevronDown,
  X,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Heart,
  RotateCcw,
  ArrowRight,
  Compass,
  Gamepad2
} from 'lucide-react';
import { useKosStore, Property } from '../../lib/store/useKosStore';
import { useCatalogFilter, PRICE_PRESETS } from '../../hooks/useCatalogFilter';
import { KosCard } from './KosCard';
import { KosFilterBar } from './KosFilterBar';
import { KosFilterModal } from './KosFilterModal';
import { KosDetailModal } from './KosDetailModal';

interface KosCatalogSectionProps {
  onOpenRegister?: () => void;
  showOwnerCta?: boolean;
}

export const KosCatalogSection: React.FC<KosCatalogSectionProps> = ({
  onOpenRegister,
  showOwnerCta = true
}) => {
  // Fine-grained Zustand selectors to prevent unnecessary re-renders
  const properties = useKosStore((state) => state.properties);
  const rooms = useKosStore((state) => state.rooms);
  const guestWishlist = useKosStore((state) => state.guestWishlist || []);
  const toggleWishlist = useKosStore((state) => state.toggleWishlist);
  const isWishlisted = useKosStore((state) => state.isWishlisted);

  // Modular custom hook for filtering & sorting
  const {
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    selectedType,
    setSelectedType,
    selectedPriceRange,
    setSelectedPriceRange,
    customMinPrice,
    setCustomMinPrice,
    customMaxPrice,
    setCustomMaxPrice,
    selectedFacilities,
    toggleFacility,
    sortBy,
    setSortBy,
    onlyWishlist,
    setOnlyWishlist,
    availableCities,
    filteredProperties,
    activeFilterCount,
    isFiltered,
    currentPriceLabel,
    handleResetFilter
  } = useCatalogFilter({
    properties,
    rooms,
    guestWishlist
  });

  // UI Control States
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Auto-open property detail if URL query ?kos= is present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const kosParam = params.get('kos');
      if (kosParam) {
        setSearchQuery(kosParam);
        const match = properties.find((p) =>
          p.name.toLowerCase().includes(kosParam.toLowerCase())
        );
        if (match) {
          setSelectedPropertyForModal(match);
          setIsDetailModalOpen(true);
        }
      }
    }
  }, [properties, setSearchQuery]);

  const handleOpenDetail = (prop: Property) => {
    setSelectedPropertyForModal(prop);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="font-body text-darkcocoa">
      {/* ======================================================== */}
      {/* 1. TRAVELOKA & MAMIKOS STYLE HERO SEARCH CONSOLE        */}
      {/* ======================================================== */}
      <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 bg-gradient-to-b from-cream-50 via-peach-50/40 to-white overflow-hidden border-b border-cream-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Persona Switcher Badge / Bridge */}
          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/90 backdrop-blur-md border border-cream-200/90 shadow-2xs text-xs font-bold text-darkcocoa">
            <span className="px-3 py-1 rounded-xl bg-peach-500 text-white shadow-xs flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Portal Pencari Kos</span>
            </span>
            <Link
              href="/mitra"
              className="px-3 py-1 rounded-xl text-softgray hover:text-darkcocoa hover:bg-cream-100 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-peach-500" />
              <span>Software Pemilik Kos</span>
            </Link>
            <Link
              href="/login?tab=demo"
              className="px-3 py-1 rounded-xl text-softgray hover:text-darkcocoa hover:bg-cream-100 transition-colors flex items-center gap-1.5 hidden sm:flex"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-peach-500" />
              <span>Coba Demo Sandbox</span>
            </Link>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-darkcocoa tracking-tight leading-tight">
              Cari &amp; Sewa Kos Nyaman <br className="hidden sm:inline" />
              <span className="text-peach-600">Langsung dari Pemilik Resmi</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-darkcocoa/80 max-w-2xl mx-auto leading-relaxed font-medium">
              Jelajahi ribuan kamar kos terverifikasi di berbagai kota. Cek ketersediaan kamar
              real-time dan hubungi WhatsApp pengelola kos tanpa biaya perantara.
            </p>
          </div>

          {/* Master Search Bar Console */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-3.5 sm:p-5 shadow-xl shadow-peach-600/5 border-2 border-peach-500/30 transition-all">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                {/* 1. LOKASI / KOTA / NAMA KOS */}
                <div className="md:col-span-5 p-3 rounded-2xl bg-cream-50/90 hover:bg-peach-50/40 border border-cream-200/90 focus-within:border-peach-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-peach-500/20 transition-all text-left">
                  <label className="text-[10px] font-extrabold tracking-wider text-darkcocoa/80 uppercase flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-peach-600 flex-shrink-0" />
                    <span>Lokasi atau Nama Kos</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ketik kota, area kampus, atau nama kos..."
                      className="w-full bg-transparent font-bold text-xs sm:text-sm text-darkcocoa placeholder:text-softgray focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="p-1 rounded-full text-softgray hover:text-darkcocoa hover:bg-cream-200"
                        title="Hapus pencarian"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. TIPE KOST / GENDER */}
                <div className="md:col-span-3 p-3 rounded-2xl bg-cream-50/90 hover:bg-peach-50/40 border border-cream-200/90 focus-within:border-peach-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-peach-500/20 transition-all text-left">
                  <label className="text-[10px] font-extrabold tracking-wider text-darkcocoa/80 uppercase flex items-center gap-1.5 mb-1">
                    <Users className="w-3.5 h-3.5 text-peach-600 flex-shrink-0" />
                    <span>Tipe Kost</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-transparent font-heading font-extrabold text-xs sm:text-sm text-darkcocoa focus:outline-none cursor-pointer appearance-none pr-5"
                    >
                      <option value="Semua">Semua Kategori</option>
                      <option value="Putri">Khusus Putri</option>
                      <option value="Putra">Khusus Putra</option>
                      <option value="Campur">Campur</option>
                      <option value="Pasutri">Pasutri</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-softgray absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. BUDGET BULANAN */}
                <div className="md:col-span-2 p-3 rounded-2xl bg-cream-50/90 hover:bg-peach-50/40 border border-cream-200/90 focus-within:border-peach-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-peach-500/20 transition-all text-left">
                  <label className="text-[10px] font-extrabold tracking-wider text-darkcocoa/80 uppercase flex items-center gap-1.5 mb-1">
                    <Coins className="w-3.5 h-3.5 text-peach-600 flex-shrink-0" />
                    <span>Budget Sewa</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full bg-transparent font-heading font-extrabold text-xs sm:text-sm text-darkcocoa focus:outline-none cursor-pointer appearance-none pr-5 truncate"
                    >
                      {PRICE_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-softgray absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 4. TOMBOL CARI KOST */}
                <div className="md:col-span-2">
                  <a
                    href="#hasil-katalog"
                    className="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-peach-600 hover:bg-peach-700 active:bg-peach-800 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md shadow-peach-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
                  >
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>Cari Kos</span>
                  </a>
                </div>
              </div>

              {/* Quick City Suggestion Pills */}
              <div className="mt-3.5 pt-3 border-t border-cream-100 flex items-center gap-1.5 flex-wrap text-left">
                <span className="text-[11px] font-bold text-darkcocoa/70 mr-1 flex items-center gap-1">
                  <span>Pilihan Kota:</span>
                </span>
                {availableCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all ${
                      selectedCity === city
                        ? 'bg-peach-600 text-white shadow-sm'
                        : 'bg-cream-100 hover:bg-cream-200 text-darkcocoa border border-cream-200'
                    }`}
                  >
                    {city === 'Semua' ? 'Semua Kota' : city}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Popular Search Chips */}
            <div className="pt-3.5 flex items-center justify-center gap-2 flex-wrap text-xs">
              <span className="font-extrabold text-darkcocoa/80 text-[11px]">Populer:</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCity('Bandung');
                  setSelectedType('Putri');
                }}
                className="px-3 py-1 rounded-full bg-white hover:bg-peach-50 border border-cream-200 hover:border-peach-400 text-darkcocoa font-bold text-[11px] shadow-2xs transition-all"
              >
                Putri Bandung
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCity('Jakarta Selatan');
                  setSelectedType('Putra');
                }}
                className="px-3 py-1 rounded-full bg-white hover:bg-peach-50 border border-cream-200 hover:border-peach-400 text-darkcocoa font-bold text-[11px] shadow-2xs transition-all"
              >
                Putra Jakarta
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCity('Yogyakarta');
                }}
                className="px-3 py-1 rounded-full bg-white hover:bg-peach-50 border border-cream-200 hover:border-peach-400 text-darkcocoa font-bold text-[11px] shadow-2xs transition-all"
              >
                Mahasiswa Jogja
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedFacilities.includes('ac')) toggleFacility('ac');
                  if (!selectedFacilities.includes('bath')) toggleFacility('bath');
                }}
                className="px-3 py-1 rounded-full bg-white hover:bg-peach-50 border border-cream-200 hover:border-peach-400 text-darkcocoa font-bold text-[11px] shadow-2xs transition-all"
              >
                Kost AC &amp; KM Dalam
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPriceRange('under-1m');
                }}
                className="px-3 py-1 rounded-full bg-white hover:bg-peach-50 border border-cream-200 hover:border-peach-400 text-darkcocoa font-bold text-[11px] shadow-2xs transition-all"
              >
                &lt; Rp 1 Juta/bln
              </button>
            </div>
          </div>

          {/* 3 Main Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-peach-100 text-peach-700 flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-heading font-extrabold text-xs text-darkcocoa">100% Kontak Pemilik</h4>
                <p className="text-[11px] text-darkcocoa/70 font-medium">Tanpa perantara &amp; bebas calo</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-heading font-extrabold text-xs text-darkcocoa">Kamar Kosong Real-Time</h4>
                <p className="text-[11px] text-darkcocoa/70 font-medium">Sinkron dengan software juragan</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-peach-100 text-peach-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-heading font-extrabold text-xs text-darkcocoa">Foto Asli Terverifikasi</h4>
                <p className="text-[11px] text-darkcocoa/70 font-medium">Kondisi kamar sesuai kenyataan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CATALOG RESULTS SECTION                               */}
      {/* ======================================================== */}
      <section id="hasil-katalog" className="py-10 sm:py-14 bg-cream-50/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header & Results Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-darkcocoa">
                  Pilihan Kost Tersedia
                </h2>
                <span className="px-3 py-1 rounded-full bg-peach-100 text-peach-800 border border-peach-200 text-xs font-black">
                  {filteredProperties.length} Kosan
                </span>
              </div>
              <p className="text-xs text-darkcocoa/70 mt-1 font-medium">
                {selectedCity !== 'Semua'
                  ? `Menampilkan kos di area ${selectedCity}`
                  : 'Menampilkan kos dari semua area mitra terdaftar'}
                {selectedType !== 'Semua' && ` • Khusus ${selectedType}`}
                {selectedFacilities.length > 0 && ` • ${selectedFacilities.length} Fasilitas dipilih`}
              </p>
            </div>

            {/* Quick Actions / Reset */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="self-start md:self-auto px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-red-700 hover:bg-red-100 bg-red-50 border border-red-300 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua Filter ({activeFilterCount})</span>
              </button>
            )}
          </div>

          {/* ======================================================== */}
          {/* MODULAR HORIZONTAL QUICK FILTER BAR                      */}
          {/* ======================================================== */}
          <KosFilterBar
            activeFilterCount={activeFilterCount}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
            onlyWishlist={onlyWishlist}
            onToggleOnlyWishlist={() => setOnlyWishlist(!onlyWishlist)}
            wishlistCount={guestWishlist.length}
            sortBy={sortBy}
            onSelectSort={setSortBy}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            selectedFacilities={selectedFacilities}
            onToggleFacility={toggleFacility}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            selectedCity={selectedCity}
            onResetCity={() => setSelectedCity('Semua')}
            selectedPriceRange={selectedPriceRange}
            currentPriceLabel={currentPriceLabel}
            onResetPrice={() => {
              setSelectedPriceRange('all');
              setCustomMinPrice('');
              setCustomMaxPrice('');
            }}
            isFiltered={isFiltered}
            onResetAll={handleResetFilter}
          />

          {/* ======================================================== */}
          {/* PROPERTIES GRID / EMPTY STATE                            */}
          {/* ======================================================== */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((prop) => (
                <KosCard
                  key={prop.id}
                  property={prop}
                  rooms={rooms}
                  isWishlisted={isWishlisted(prop.id)}
                  onToggleWishlist={toggleWishlist}
                  onOpenDetail={handleOpenDetail}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-10 bg-white rounded-3xl border border-cream-200 text-center space-y-4 max-w-md mx-auto shadow-sm">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm ${
                  onlyWishlist
                    ? 'bg-rose-50 border border-rose-200 text-rose-600'
                    : 'bg-peach-50 border border-peach-200 text-peach-600'
                }`}
              >
                {onlyWishlist ? (
                  <Heart className="w-8 h-8 text-rose-500 fill-rose-100" />
                ) : (
                  <Building2 className="w-8 h-8 text-peach-600" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-extrabold text-base text-darkcocoa">
                  {onlyWishlist ? 'Belum Ada Kos Favorit Disimpan' : 'Belum Ada Kos yang Cocok'}
                </h4>
                <p className="text-xs text-softgray leading-relaxed">
                  {onlyWishlist
                    ? 'Klik ikon hati pada foto kosan yang kamu sukai untuk menyimpannya ke daftar favorit ini tanpa perlu repot login.'
                    : 'Tidak ada kos yang cocok dengan kriteria pencarian kamu. Coba ganti kata pencarian atau reset filter.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilter}
                className="px-5 py-2.5 rounded-2xl bg-peach-600 hover:bg-peach-700 active:bg-peach-800 text-white text-xs font-extrabold shadow-md shadow-peach-600/20 inline-flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{onlyWishlist ? 'Lihat Semua Katalog Kos' : 'Reset Semua Filter'}</span>
              </button>
            </div>
          )}

          {/* Banner for Kos Owners to Register & Get Promoted */}
          {showOwnerCta && (
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-darkcocoa via-[#332016] to-darkcocoa text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-peach-300 text-xs font-bold">
                  <span>Khusus Pemilik &amp; Juragan Kos</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight">
                  Ingin Kos Anda Tampil di Katalog Ini?
                </h3>
                <p className="text-xs sm:text-sm text-cream-200/80 max-w-xl">
                  Daftar akun software pawskost sekarang. Begitu Anda melengkapi profil kos,
                  properti Anda akan otomatis dipromosikan ke calon penyewa tanpa biaya komisi!
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {onOpenRegister && (
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="px-6 py-3 rounded-2xl bg-peach-600 hover:bg-peach-700 active:bg-peach-800 text-white font-heading font-extrabold text-xs sm:text-sm shadow-lg shadow-peach-600/30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
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

      {/* ======================================================== */}
      {/* 3. MODULAR FILTER DETAIL MODAL                           */}
      {/* ======================================================== */}
      <KosFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        availableCities={availableCities}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        selectedPriceRange={selectedPriceRange}
        onSelectPriceRange={(range) => {
          setSelectedPriceRange(range);
          if (range !== 'custom') {
            setCustomMinPrice('');
            setCustomMaxPrice('');
          }
        }}
        customMinPrice={customMinPrice}
        onChangeCustomMinPrice={setCustomMinPrice}
        customMaxPrice={customMaxPrice}
        onChangeCustomMaxPrice={setCustomMaxPrice}
        selectedFacilities={selectedFacilities}
        onToggleFacility={toggleFacility}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        onResetAll={handleResetFilter}
        matchCount={filteredProperties.length}
      />

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

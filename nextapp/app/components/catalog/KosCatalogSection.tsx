'use client';

import React, { useState, useMemo } from 'react';
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
  SlidersHorizontal,
  RotateCcw,
  Building2,
  CheckCircle2,
  ArrowRight
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

  return (
    <section id="katalog" className="py-16 sm:py-24 bg-white/70 relative font-body text-darkcocoa">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-peach-100 text-peach-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-peach-500 animate-spin" />
            <span>Katalog Kosan Terverifikasi Indonesia 🏡✨</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight">
            Cari &amp; Sewa Kos Nyaman <span className="text-peach-500">Tanpa Perantara</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-softgray leading-relaxed">
            Jelajahi pilihan kos terbaik dari mitra pemilik kos pawskost. Hubungi langsung pemilik via WhatsApp, tanpa potongan komisi, tanpa ribet!
          </p>
        </div>

        {/* Search & Filter Bar (Mamikos-Style) */}
        <div className="bg-cream-50/90 rounded-3xl p-4 sm:p-6 border border-cream-200 shadow-sm space-y-4">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-softgray absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama kos, area kampus (ITB, UI, UGM), atau jalan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-2xl bg-white border border-cream-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-peach-400 focus:ring-2 focus:ring-peach-200/50 shadow-2xs"
            />
          </div>

          {/* Filter Row: Kota, Gender/Tipe, Harga, Fasilitas */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* City Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
              <span className="text-xs font-bold text-softgray mr-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-peach-500" />
                <span>Kota:</span>
              </span>
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
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end text-xs">
              {/* Type / Gender */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white border border-cream-200 rounded-xl px-3 py-1.5 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
              >
                <option value="Semua">Semua Tipe Kos</option>
                <option value="Putri">Khusus Putri 🌸</option>
                <option value="Putra">Khusus Putra 🌿</option>
                <option value="Campur">Campur ⚡</option>
                <option value="Pasutri">Pasutri 💍</option>
              </select>

              {/* Price Range */}
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="bg-white border border-cream-200 rounded-xl px-3 py-1.5 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
              >
                <option value="all">Semua Tarif</option>
                <option value="under-15">&lt; Rp 1.5 Juta/bln</option>
                <option value="15-20">Rp 1.5 - 2 Juta/bln</option>
                <option value="above-20">&gt; Rp 2 Juta/bln</option>
              </select>

              {/* Facility */}
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="bg-white border border-cream-200 rounded-xl px-3 py-1.5 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
              >
                <option value="all">Semua Fasilitas</option>
                <option value="ac">Ada AC Dingin ❄️</option>
                <option value="wifi">Ada WiFi Cepat 📶</option>
                <option value="bath">Kamar Mandi Dalam 🚿</option>
              </select>

              {(searchQuery || selectedCity !== 'Semua' || selectedType !== 'Semua' || selectedPriceRange !== 'all' || selectedFacility !== 'all') && (
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="p-1.5 rounded-xl bg-white border border-cream-200 text-softgray hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Reset Filter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info & Counter */}
        <div className="flex items-center justify-between text-xs text-softgray px-1">
          <span>
            Menampilkan <strong className="text-darkcocoa">{filteredProperties.length}</strong> pilihan kosan terverifikasi
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-matcha-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-matcha-500" />
            <span>Katalog diperbarui otomatis oleh pemilik kos</span>
          </span>
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
                  `Halo Kak! 🐾 Saya tertarik dengan kos "${prop.name}" di katalog pawskost. Apakah masih ada kamar kosong? Terima kasih!`
                );
                window.open(`https://wa.me/${waTarget}?text=${textMsg}`, '_blank');
              };

              return (
                <div
                  key={prop.id}
                  onClick={() => handleOpenDetail(prop)}
                  className="group cursor-pointer rounded-3xl bg-white border border-cream-200 shadow-sm hover:shadow-cute hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between"
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
                          <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                            Sisa {vacantCount} Kamar
                          </span>
                        ) : (
                          <span className="bg-darkcocoa/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                            Penuh
                          </span>
                        )}
                      </div>

                      {/* Bottom-right City Badge */}
                      {prop.city && (
                        <span className="absolute bottom-2.5 right-2.5 bg-darkcocoa/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-peach-400" />
                          <span>{prop.city}</span>
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 mb-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-darkcocoa">4.9</span>
                          <span className="text-softgray font-normal">• Terverifikasi</span>
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
                        className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200 transition-colors"
                        title="Chat WhatsApp Pemilik"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Chat WA</span>
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
          <div className="p-10 bg-cream-50 rounded-3xl border border-cream-200 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-peach-100 text-peach-600 flex items-center justify-center mx-auto text-2xl shadow-cute">
              🐾
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-extrabold text-base text-darkcocoa">
                Belum Ada Kos yang Cocok
              </h4>
              <p className="text-xs text-softgray leading-relaxed">
                Tidak ada kos yang cocok dengan kata kunci &quot;{searchQuery || selectedCity}&quot;. Coba ganti kata pencarian atau reset filter.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilter}
              className="px-5 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white text-xs font-bold shadow-cute inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        )}

        {/* Banner for Kos Owners to Register & Get Promoted */}
        {showOwnerCta && (
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-darkcocoa via-darkcocoa/95 to-peach-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-peach-300 text-xs font-bold">
                <span>Khusus Pemilik &amp; Juragan Kos 👑</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight">
                Ingin Kos Anda Tampil di Katalog Ini?
              </h3>
              <p className="text-xs sm:text-sm text-cream-200/80 max-w-xl">
                Daftar akun pawskost sekarang. Begitu Anda melengkapi profil kos, properti Anda akan otomatis dipromosikan ke calon penyewa tanpa biaya komisi!
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {onOpenRegister && (
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-6 py-3 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-heading font-bold text-xs sm:text-sm shadow-cute flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <span>Daftar Kos Saya Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Kos Detail Modal */}
      <KosDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPropertyForModal(null);
        }}
        property={selectedPropertyForModal}
        rooms={rooms}
      />
    </section>
  );
};

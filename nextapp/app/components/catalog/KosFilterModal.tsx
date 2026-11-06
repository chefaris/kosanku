'use client';

import React from 'react';
import {
  SlidersHorizontal,
  X,
  Users,
  MapPin,
  Coins,
  Sparkles,
  ArrowUpDown,
  Check
} from 'lucide-react';
import {
  SortOption,
  SORT_OPTIONS,
  PRICE_PRESETS,
  POPULAR_FACILITIES
} from '../../hooks/useCatalogFilter';

interface KosFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  availableCities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedPriceRange: string;
  onSelectPriceRange: (range: string) => void;
  customMinPrice: string;
  onChangeCustomMinPrice: (val: string) => void;
  customMaxPrice: string;
  onChangeCustomMaxPrice: (val: string) => void;
  selectedFacilities: string[];
  onToggleFacility: (id: string) => void;
  sortBy: SortOption;
  onSelectSort: (option: SortOption) => void;
  onResetAll: () => void;
  matchCount: number;
}

export const KosFilterModal: React.FC<KosFilterModalProps> = ({
  isOpen,
  onClose,
  selectedType,
  onSelectType,
  availableCities,
  selectedCity,
  onSelectCity,
  selectedPriceRange,
  onSelectPriceRange,
  customMinPrice,
  onChangeCustomMinPrice,
  customMaxPrice,
  onChangeCustomMaxPrice,
  selectedFacilities,
  onToggleFacility,
  sortBy,
  onSelectSort,
  onResetAll,
  matchCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-peach-100 text-peach-600 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                Filter Lengkap Pencarian Kos
              </h3>
              <p className="text-[11px] text-softgray">
                Pilih kriteria spesifik untuk menemukan kos terbaik
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

        {/* Modal Body (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-left">
          {/* SECTION A: Kategori / Tipe Kos */}
          <div className="space-y-2.5">
            <label className="text-xs font-heading font-extrabold text-darkcocoa uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-peach-500" />
              <span>Kategori / Gender Penghuni</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Semua', label: 'Semua Tipe' },
                { id: 'Putri', label: 'Khusus Putri' },
                { id: 'Putra', label: 'Khusus Putra' },
                { id: 'Campur', label: 'Campur' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectType(item.id)}
                  className={`p-3 rounded-2xl border-2 text-xs font-bold text-center transition-all ${
                    selectedType === item.id
                      ? 'border-peach-600 bg-peach-50 text-peach-900 shadow-sm font-extrabold'
                      : 'border-cream-200 bg-white hover:bg-cream-50 text-darkcocoa'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION B: Kota / Wilayah */}
          <div className="space-y-2.5">
            <label className="text-xs font-heading font-extrabold text-darkcocoa uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-peach-600" />
              <span>Pilihan Kota / Area</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {availableCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => onSelectCity(city)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCity === city
                      ? 'bg-darkcocoa text-white shadow-xs'
                      : 'bg-cream-100 hover:bg-cream-200 text-darkcocoa border border-cream-200'
                  }`}
                >
                  {city === 'Semua' ? 'Semua Kota' : city}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION C: Rentang Budget per Bulan */}
          <div className="space-y-2.5">
            <label className="text-xs font-heading font-extrabold text-darkcocoa uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-peach-600" />
              <span>Rentang Tarif Sewa / Bulan</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRICE_PRESETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectPriceRange(item.id);
                  }}
                  className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                    selectedPriceRange === item.id
                      ? 'border-peach-600 bg-peach-50 text-peach-900 shadow-xs font-extrabold'
                      : 'border-cream-200 bg-white hover:bg-cream-50 text-darkcocoa'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Custom Min / Max inputs */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-softgray mb-1.5">
                Atau tentukan harga sendiri:
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-softgray">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="Harga Minimum"
                    value={customMinPrice}
                    onChange={(e) => {
                      onChangeCustomMinPrice(e.target.value);
                      onSelectPriceRange('custom');
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-200 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-600 focus:ring-1 focus:ring-peach-600 bg-cream-50/50"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-softgray">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="Harga Maksimum"
                    value={customMaxPrice}
                    onChange={(e) => {
                      onChangeCustomMaxPrice(e.target.value);
                      onSelectPriceRange('custom');
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-200 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-600 focus:ring-1 focus:ring-peach-600 bg-cream-50/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION D: Fasilitas Kamar & Properti */}
          <div className="space-y-2.5">
            <label className="text-xs font-heading font-extrabold text-darkcocoa uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-peach-600" />
              <span>Fasilitas Kamar &amp; Kos (Bisa Pilih Lebih dari Satu)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POPULAR_FACILITIES.map((fac) => {
                const Icon = fac.icon;
                const isSelected = selectedFacilities.includes(fac.id);
                return (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => onToggleFacility(fac.id)}
                    className={`p-3 rounded-2xl border-2 text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-peach-600 bg-peach-50 text-peach-900 shadow-xs font-extrabold'
                        : 'border-cream-200 bg-white hover:bg-cream-50 text-darkcocoa font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-peach-600 text-white' : 'bg-cream-100 text-peach-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{fac.label}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-peach-600 bg-peach-600 text-white'
                          : 'border-cream-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION E: Urutkan Hasil */}
          <div className="space-y-2.5">
            <label className="text-xs font-heading font-extrabold text-darkcocoa uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-peach-600" />
              <span>Urutkan Hasil Pencarian</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectSort(opt.id)}
                  className={`p-2.5 rounded-xl border-2 text-xs font-semibold text-left flex items-center justify-between transition-all ${
                    sortBy === opt.id
                      ? 'border-peach-600 bg-peach-50 text-peach-900 font-extrabold'
                      : 'border-cream-200 bg-white hover:bg-cream-50 text-darkcocoa font-bold'
                  }`}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-peach-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 border-t border-cream-200 bg-cream-50/70 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetAll}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-softgray hover:text-red-600 hover:bg-red-50 border border-cream-200 transition-colors"
          >
            Reset Semua
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-peach-600 hover:bg-peach-700 active:bg-peach-800 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md shadow-peach-600/30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <span>Terapkan ({matchCount} Kos Ditemukan)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

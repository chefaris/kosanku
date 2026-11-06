'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  Check,
  Heart,
  X,
  RotateCcw
} from 'lucide-react';
import {
  SortOption,
  SORT_OPTIONS,
  POPULAR_FACILITIES
} from '../../hooks/useCatalogFilter';

interface KosFilterBarProps {
  activeFilterCount: number;
  onOpenFilterModal: () => void;
  onlyWishlist: boolean;
  onToggleOnlyWishlist: () => void;
  wishlistCount: number;
  sortBy: SortOption;
  onSelectSort: (option: SortOption) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  selectedFacilities: string[];
  onToggleFacility: (id: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
  selectedCity: string;
  onResetCity: () => void;
  selectedPriceRange: string;
  currentPriceLabel: string;
  onResetPrice: () => void;
  isFiltered: boolean;
  onResetAll: () => void;
}

export const KosFilterBar: React.FC<KosFilterBarProps> = ({
  activeFilterCount,
  onOpenFilterModal,
  onlyWishlist,
  onToggleOnlyWishlist,
  wishlistCount,
  sortBy,
  onSelectSort,
  selectedType,
  onSelectType,
  selectedFacilities,
  onToggleFacility,
  searchQuery,
  onClearSearch,
  selectedCity,
  onResetCity,
  selectedPriceRange,
  currentPriceLabel,
  onResetPrice,
  isFiltered,
  onResetAll
}) => {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-cream-200 shadow-2xs space-y-2">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
        {/* 1. TOMBOL SEMUA FILTER (FILTER LENGKAP) */}
        <button
          type="button"
          onClick={onOpenFilterModal}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all flex-shrink-0 ${
            activeFilterCount > 0
              ? 'bg-peach-600 text-white shadow-sm border border-peach-600'
              : 'bg-white hover:bg-cream-100 text-darkcocoa border border-cream-200'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-peach-700 text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* 2. TAB FAVORIT SAYA (GUEST WISHLIST) */}
        <button
          type="button"
          onClick={onToggleOnlyWishlist}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all flex-shrink-0 ${
            onlyWishlist
              ? 'bg-rose-500 text-white shadow-sm border border-rose-500'
              : 'bg-white hover:bg-rose-50 text-darkcocoa border border-cream-200'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyWishlist ? 'fill-current text-white' : 'text-rose-500'}`} />
          <span>Favorit</span>
          {wishlistCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                onlyWishlist ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {wishlistCount}
            </span>
          )}
        </button>

        {/* 3. DROPDOWN URUTKAN (SORT BY) */}
        <div className="relative flex-shrink-0" ref={sortDropdownRef}>
          <button
            type="button"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-cream-100 text-darkcocoa border-2 border-cream-200 flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-peach-600" />
            <span>Urutkan:</span>
            <span className="text-peach-700 font-extrabold">
              {SORT_OPTIONS.find((s) => s.id === sortBy)?.label.replace('Harga: ', '')}
            </span>
            <ChevronDown className="w-3 h-3 text-softgray ml-0.5" />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-cream-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-extrabold text-softgray uppercase tracking-wider border-b border-cream-100">
                Urutkan Berdasarkan
              </div>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelectSort(opt.id);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-xs font-medium flex items-center justify-between text-left hover:bg-peach-50 transition-colors ${
                    sortBy === opt.id ? 'text-peach-700 font-extrabold bg-peach-50' : 'text-darkcocoa'
                  }`}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-peach-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pemisah Garis Vertikal */}
        <div className="w-[1px] h-6 bg-cream-200 mx-1 flex-shrink-0 hidden sm:block" />

        {/* 4. CHIP PILIHAN TIPE GENDER KOS */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {(['Semua', 'Putri', 'Putra', 'Campur'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onSelectType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-darkcocoa text-white shadow-xs border-2 border-darkcocoa'
                  : 'bg-white hover:bg-cream-100 text-darkcocoa border-2 border-cream-200'
              }`}
            >
              {type === 'Semua' ? 'Semua Tipe' : type === 'Putri' ? 'Khusus Putri' : type === 'Putra' ? 'Khusus Putra' : 'Campur'}
            </button>
          ))}
        </div>

        {/* Pemisah Garis Vertikal */}
        <div className="w-[1px] h-6 bg-cream-200 mx-1 flex-shrink-0 hidden sm:block" />

        {/* 5. CHIP TOGGLE FASILITAS POPULER */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {POPULAR_FACILITIES.slice(0, 5).map((fac) => {
            const Icon = fac.icon;
            const isSelected = selectedFacilities.includes(fac.id);
            return (
              <button
                key={fac.id}
                type="button"
                onClick={() => onToggleFacility(fac.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-peach-600 text-white shadow-sm border-2 border-peach-600 font-extrabold'
                    : 'bg-white hover:bg-cream-100 text-darkcocoa border-2 border-cream-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-peach-600'}`} />
                <span>{fac.label}</span>
                {isSelected && <Check className="w-3 h-3 text-white ml-0.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* DISMISSIBLE ACTIVE FILTER TAGS */}
      {isFiltered && (
        <div className="pt-2.5 border-t border-cream-100 flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] font-extrabold text-darkcocoa/80 mr-1">Filter Aktif:</span>

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-peach-100 text-peach-900 border border-peach-300 text-[11px] font-bold">
              <span>Cari: &quot;{searchQuery}&quot;</span>
              <button
                type="button"
                onClick={onClearSearch}
                className="p-0.5 hover:bg-peach-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCity !== 'Semua' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-peach-100 text-peach-900 border border-peach-300 text-[11px] font-bold">
              <span>Kota: {selectedCity}</span>
              <button
                type="button"
                onClick={onResetCity}
                className="p-0.5 hover:bg-peach-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedType !== 'Semua' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-peach-100 text-peach-900 border border-peach-300 text-[11px] font-bold">
              <span>Tipe: {selectedType}</span>
              <button
                type="button"
                onClick={() => onSelectType('Semua')}
                className="p-0.5 hover:bg-peach-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedPriceRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-peach-100 text-peach-900 border border-peach-300 text-[11px] font-bold">
              <span>Budget: {currentPriceLabel}</span>
              <button
                type="button"
                onClick={onResetPrice}
                className="p-0.5 hover:bg-peach-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedFacilities.map((facId) => {
            const facObj = POPULAR_FACILITIES.find((f) => f.id === facId);
            return (
              <span
                key={facId}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-peach-100 text-peach-900 border border-peach-300 text-[11px] font-bold"
              >
                <span>{facObj?.label || facId}</span>
                <button
                  type="button"
                  onClick={() => onToggleFacility(facId)}
                  className="p-0.5 hover:bg-peach-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          <button
            type="button"
            onClick={onResetAll}
            className="text-[11px] font-extrabold text-red-600 hover:text-red-800 ml-1 hover:underline"
          >
            Hapus Semua
          </button>
        </div>
      )}
    </div>
  );
};

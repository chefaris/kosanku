'use client';

import { useState, useMemo } from 'react';
import {
  Snowflake,
  Wifi,
  ShowerHead,
  Car,
  KeyRound,
  Utensils,
  Flame,
  LucideIcon
} from 'lucide-react';
import { Property, Room, checkPropertyEligibility } from '../lib/store/useKosStore';

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'vacant-desc';

export interface PopularFacility {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const POPULAR_FACILITIES: PopularFacility[] = [
  { id: 'ac', label: 'AC', icon: Snowflake },
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'bath', label: 'KM Dalam', icon: ShowerHead },
  { id: 'car', label: 'Parkir Mobil', icon: Car },
  { id: '24h', label: 'Akses 24 Jam', icon: KeyRound },
  { id: 'dapur', label: 'Dapur Bersama', icon: Utensils },
  { id: 'waterheater', label: 'Water Heater', icon: Flame }
];

export const PRICE_PRESETS = [
  { id: 'all', label: 'Semua Tarif' },
  { id: 'under-1m', label: '< Rp 1 Juta', min: 0, max: 1000000 },
  { id: '1m-2m', label: 'Rp 1 - 2 Juta', min: 1000000, max: 2000000 },
  { id: '2m-3m', label: 'Rp 2 - 3 Juta', min: 2000000, max: 3000000 },
  { id: 'above-3m', label: '> Rp 3 Juta', min: 3000000, max: Infinity }
];

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'recommended', label: 'Rekomendasi Terbaik' },
  { id: 'price-asc', label: 'Harga: Termurah' },
  { id: 'price-desc', label: 'Harga: Tertinggi' },
  { id: 'vacant-desc', label: 'Kamar Kosong Terbanyak' }
];

export const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
};

export const checkFacilityMatch = (prop: Property, propRooms: Room[], facId: string): boolean => {
  const propFacs = (prop.facilities || []).map((f) => f.toLowerCase());
  const propRules = (prop.rules || []).map((r) => r.toLowerCase());

  if (facId === 'ac') {
    return propRooms.some((r) => r.facilities.ac) || propFacs.some((f) => f.includes('ac'));
  }
  if (facId === 'wifi') {
    return propRooms.some((r) => r.facilities.wifi) || propFacs.some((f) => f.includes('wifi'));
  }
  if (facId === 'bath') {
    return (
      propRooms.some((r) => r.facilities.bath) ||
      propFacs.some((f) => f.includes('kamar mandi dalam') || f.includes('km dalam') || f.includes('mandi'))
    );
  }
  if (facId === 'car') {
    return propFacs.some((f) => f.includes('mobil') || f.includes('parkir'));
  }
  if (facId === '24h') {
    return (
      propFacs.some((f) => f.includes('24')) ||
      propRules.some((r) => r.includes('24') || r.includes('kunci'))
    );
  }
  if (facId === 'dapur') {
    return propFacs.some((f) => f.includes('dapur'));
  }
  if (facId === 'waterheater') {
    return propFacs.some((f) => f.includes('water heater') || f.includes('panas'));
  }
  return true;
};

interface UseCatalogFilterProps {
  properties: Property[];
  rooms: Room[];
  guestWishlist?: string[];
}

export function useCatalogFilter({
  properties,
  rooms,
  guestWishlist = []
}: UseCatalogFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua');
  const [selectedType, setSelectedType] = useState<string>('Semua');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [customMinPrice, setCustomMinPrice] = useState<string>('');
  const [customMaxPrice, setCustomMaxPrice] = useState<string>('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [onlyWishlist, setOnlyWishlist] = useState(false);

  // 1. Filter properti yang lolos 7 kriteria kelayakan tayang publik
  const eligibleProperties = useMemo(() => {
    return properties.filter((prop) => {
      const eligibility = checkPropertyEligibility(prop, rooms);
      return eligibility.isEligible;
    });
  }, [properties, rooms]);

  // 2. Daftar kota unik dari properti yang layak
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();
    eligibleProperties.forEach((p) => {
      if (p.city) citySet.add(p.city);
    });
    return ['Semua', ...Array.from(citySet)];
  }, [eligibleProperties]);

  // 3. Penyaringan dan pengurutan properti
  const filteredProperties = useMemo(() => {
    const results = eligibleProperties.filter((prop) => {
      const propRooms = rooms.filter((r) => r.propertyId === prop.id);
      const roomPrices = propRooms.map((r) => r.price).filter((p) => p > 0);
      const minPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 1500000;

      // Filter teks pencarian (nama, alamat, deskripsi, kota)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = prop.name.toLowerCase().includes(q);
        const matchAddress = prop.address.toLowerCase().includes(q);
        const matchCity = (prop.city || '').toLowerCase().includes(q);
        const matchDesc = (prop.description || '').toLowerCase().includes(q);
        if (!matchName && !matchAddress && !matchCity && !matchDesc) return false;
      }

      // Filter kota
      if (selectedCity !== 'Semua') {
        const propCity =
          prop.city ||
          (prop.address.toLowerCase().includes(selectedCity.toLowerCase()) ? selectedCity : '');
        if (propCity.toLowerCase() !== selectedCity.toLowerCase()) return false;
      }

      // Filter tipe gender
      if (selectedType !== 'Semua') {
        if (prop.type !== selectedType) return false;
      }

      // Filter rentang tarif sewa
      if (selectedPriceRange === 'custom') {
        const minVal = customMinPrice ? Number(customMinPrice) : 0;
        const maxVal = customMaxPrice ? Number(customMaxPrice) : Infinity;
        if (minPrice < minVal || minPrice > maxVal) return false;
      } else if (selectedPriceRange !== 'all') {
        const preset = PRICE_PRESETS.find((p) => p.id === selectedPriceRange);
        if (preset) {
          if (minPrice < (preset.min ?? 0) || minPrice > (preset.max ?? Infinity)) return false;
        }
      }

      // Filter multi-fasilitas
      if (selectedFacilities.length > 0) {
        const hasAllFacilities = selectedFacilities.every((facId) =>
          checkFacilityMatch(prop, propRooms, facId)
        );
        if (!hasAllFacilities) return false;
      }

      // Filter wishlist tamu
      if (onlyWishlist && !guestWishlist.includes(prop.id)) {
        return false;
      }

      return true;
    });

    // Logika pengurutan (Sorting)
    return results.sort((a, b) => {
      const propRoomsA = rooms.filter((r) => r.propertyId === a.id);
      const propRoomsB = rooms.filter((r) => r.propertyId === b.id);
      const pricesA = propRoomsA.map((r) => r.price).filter((p) => p > 0);
      const pricesB = propRoomsB.map((r) => r.price).filter((p) => p > 0);
      const minA = pricesA.length > 0 ? Math.min(...pricesA) : 1500000;
      const minB = pricesB.length > 0 ? Math.min(...pricesB) : 1500000;

      const vacantA = propRoomsA.filter((r) => r.status === 'vacant').length;
      const vacantB = propRoomsB.filter((r) => r.status === 'vacant').length;

      if (sortBy === 'price-asc') return minA - minB;
      if (sortBy === 'price-desc') return minB - minA;
      if (sortBy === 'vacant-desc') return vacantB - vacantA;
      // Default 'recommended': properti dengan kamar kosong dahulu, lalu nama
      return vacantB - vacantA || a.name.localeCompare(b.name);
    });
  }, [
    eligibleProperties,
    rooms,
    searchQuery,
    selectedCity,
    selectedType,
    selectedPriceRange,
    customMinPrice,
    customMaxPrice,
    selectedFacilities,
    sortBy,
    onlyWishlist,
    guestWishlist
  ]);

  const toggleFacility = (id: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedCity('Semua');
    setSelectedType('Semua');
    setSelectedPriceRange('all');
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setSelectedFacilities([]);
    setSortBy('recommended');
    setOnlyWishlist(false);
  };

  // Jumlah filter aktif di luar nilai default
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedCity !== 'Semua') count++;
    if (selectedType !== 'Semua') count++;
    if (selectedPriceRange !== 'all') count++;
    if (onlyWishlist) count++;
    count += selectedFacilities.length;
    return count;
  }, [searchQuery, selectedCity, selectedType, selectedPriceRange, selectedFacilities, onlyWishlist]);

  const isFiltered = activeFilterCount > 0;

  const currentPriceLabel = useMemo(() => {
    if (selectedPriceRange === 'all') return 'Semua Harga';
    if (selectedPriceRange === 'custom') {
      const minText = customMinPrice ? formatRupiah(Number(customMinPrice)) : '0';
      const maxText = customMaxPrice ? formatRupiah(Number(customMaxPrice)) : 'Tak Terbatas';
      return `${minText} - ${maxText}`;
    }
    const preset = PRICE_PRESETS.find((p) => p.id === selectedPriceRange);
    return preset?.label || 'Semua Harga';
  }, [selectedPriceRange, customMinPrice, customMaxPrice]);

  return {
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
    setSelectedFacilities,
    toggleFacility,
    sortBy,
    setSortBy,
    onlyWishlist,
    setOnlyWishlist,
    eligibleProperties,
    availableCities,
    filteredProperties,
    activeFilterCount,
    isFiltered,
    currentPriceLabel,
    handleResetFilter
  };
}

'use client';

import React from 'react';
import {
  Snowflake,
  Wifi,
  ShowerHead,
  Bath,
  Layers,
  Armchair,
  Flame,
  Tv,
  Refrigerator,
  Zap,
  Car,
  Bike,
  UtensilsCrossed,
  Shirt,
  Shield,
  KeyRound,
  Droplets,
  Sparkles,
  LucideIcon
} from 'lucide-react';

export interface FacilityIconOption {
  id: string;
  name: string;
  iconName: string;
}

export const availableFacilityIcons: FacilityIconOption[] = [
  { id: 'ac', name: 'AC / Pendingin', iconName: 'Snowflake' },
  { id: 'wifi', name: 'WiFi Internet', iconName: 'Wifi' },
  { id: 'shower', name: 'Shower / KM', iconName: 'ShowerHead' },
  { id: 'bath', name: 'Bak Mandi', iconName: 'Bath' },
  { id: 'bed', name: 'Kasur Springbed', iconName: 'Layers' },
  { id: 'desk', name: 'Meja & Kursi', iconName: 'Armchair' },
  { id: 'heater', name: 'Water Heater', iconName: 'Flame' },
  { id: 'tv', name: 'Smart TV', iconName: 'Tv' },
  { id: 'fridge', name: 'Kulkas', iconName: 'Refrigerator' },
  { id: 'pln', name: 'Listrik Token', iconName: 'Zap' },
  { id: 'car', name: 'Parkir Mobil', iconName: 'Car' },
  { id: 'bike', name: 'Parkir Motor', iconName: 'Bike' },
  { id: 'kitchen', name: 'Dapur', iconName: 'UtensilsCrossed' },
  { id: 'laundry', name: 'Laundry', iconName: 'Shirt' },
  { id: 'cctv', name: 'CCTV 24 Jam', iconName: 'Shield' },
  { id: 'lock', name: 'Smart Lock', iconName: 'KeyRound' },
  { id: 'water', name: 'Air Minum', iconName: 'Droplets' },
  { id: 'other', name: 'Fasilitas Lain', iconName: 'Sparkles' }
];

export const renderFacilityIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Snowflake':
      return <Snowflake className={className} />;
    case 'Wifi':
      return <Wifi className={className} />;
    case 'ShowerHead':
      return <ShowerHead className={className} />;
    case 'Bath':
      return <Bath className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Armchair':
      return <Armchair className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Refrigerator':
      return <Refrigerator className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Bike':
      return <Bike className={className} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} />;
    case 'Shirt':
      return <Shirt className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'KeyRound':
      return <KeyRound className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Sparkles':
    default:
      return <Sparkles className={className} />;
  }
};

interface FacilityIconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export function FacilityIconPicker({ selectedIcon, onSelectIcon }: FacilityIconPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-darkcocoa block">Pilih Ikon Fasilitas</label>
      <div className="grid grid-cols-6 gap-2 p-2 bg-cream-50 rounded-2xl border border-cream-200 max-h-40 overflow-y-auto">
        {availableFacilityIcons.map((item) => {
          const isSelected = selectedIcon === item.iconName;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectIcon(item.iconName)}
              title={item.name}
              className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-peach-500 text-white shadow-cute'
                  : 'bg-white hover:bg-cream-100 text-darkcocoa border border-cream-200'
              }`}
            >
              {renderFacilityIcon(item.iconName, 'w-4 h-4')}
              <span className="text-[9px] font-semibold truncate w-full text-center mt-1">
                {item.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

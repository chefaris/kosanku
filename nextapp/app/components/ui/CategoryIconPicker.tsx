'use client';

import React from 'react';
import {
  Zap,
  Wifi,
  Droplets,
  Users,
  Wrench,
  Layers,
  Home,
  Shield,
  Shirt,
  Clock,
  Sparkles,
  FileText,
  CreditCard,
  Wallet,
  Banknote,
  TrendingUp,
  TrendingDown,
  Coffee,
  ShoppingBag,
  Car,
  Tv,
  Flame,
  Check
} from 'lucide-react';

export interface CategoryIconOption {
  name: string;
  label: string;
}

export const availableCategoryIcons: CategoryIconOption[] = [
  { name: 'Zap', label: 'Listrik' },
  { name: 'Wifi', label: 'Internet' },
  { name: 'Droplets', label: 'Air PDAM' },
  { name: 'Users', label: 'Gaji / Karyawan' },
  { name: 'Wrench', label: 'Perbaikan' },
  { name: 'Layers', label: 'Perlengkapan' },
  { name: 'Home', label: 'Sewa Kamar' },
  { name: 'Shield', label: 'Deposit' },
  { name: 'Shirt', label: 'Laundry' },
  { name: 'Clock', label: 'Denda / Waktu' },
  { name: 'CreditCard', label: 'Kartu / Bank' },
  { name: 'Wallet', label: 'Dompet / Kas' },
  { name: 'Banknote', label: 'Uang Tunai' },
  { name: 'Coffee', label: 'Konsumsi' },
  { name: 'ShoppingBag', label: 'Belanja' },
  { name: 'Car', label: 'Transport' },
  { name: 'Tv', label: 'Elektronik' },
  { name: 'Flame', label: 'Gas / Masak' },
  { name: 'Sparkles', label: 'Lainnya' }
];

export const renderCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Zap':
      return <Zap className={className} />;
    case 'Wifi':
      return <Wifi className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Shirt':
      return <Shirt className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'Wallet':
      return <Wallet className={className} />;
    case 'Banknote':
      return <Banknote className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Sparkles':
    default:
      return <Sparkles className={className} />;
  }
};

interface CategoryIconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export function CategoryIconPicker({ selectedIcon, onSelectIcon }: CategoryIconPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-darkcocoa block">Pilih Ikon Kategori</label>
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-cream-50 rounded-2xl border border-cream-200">
        {availableCategoryIcons.map((item) => {
          const isSelected = selectedIcon === item.name;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onSelectIcon(item.name)}
              title={item.label}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs transition-all relative ${
                isSelected
                  ? 'bg-peach-500 text-white shadow-cute scale-105'
                  : 'bg-white hover:bg-cream-100 text-darkcocoa border border-cream-200'
              }`}
            >
              <div className="p-1">{renderCategoryIcon(item.name, 'w-5 h-5')}</div>
              <span className="text-[9px] font-semibold truncate w-full text-center mt-1">
                {item.label}
              </span>
              {isSelected && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-white text-peach-500 rounded-full flex items-center justify-center text-[8px] font-extrabold shadow-sm">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  ChevronDown,
  Check,
  Plus,
  Layers,
  MapPin,
  Globe,
  Sparkles
} from 'lucide-react';
import { useKosStore, Property } from '../../lib/store/useKosStore';
import { PropertyModal } from './PropertyModal';

interface PropertySelectorProps {
  compact?: boolean;
}

export const PropertySelector: React.FC<PropertySelectorProps> = ({ compact = false }) => {
  const { properties, activePropertyId, setActivePropertyId, rooms } = useKosStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeProperty = properties.find((p) => p.id === activePropertyId);

  // Count rooms per property
  const getRoomCount = (propId: string) => {
    return rooms.filter((r) => r.propertyId === propId).length;
  };

  const totalAllRooms = rooms.length;

  const getTypeBadgeColor = (type: Property['type']) => {
    switch (type) {
      case 'Putri':
        return 'bg-sakura-100 text-sakura-400 border border-sakura-200';
      case 'Putra':
        return 'bg-lavender-100 text-lavender-400 border border-lavender-200';
      case 'Pasutri':
        return 'bg-peach-100 text-peach-500 border border-peach-200';
      default:
        return 'bg-matcha-100 text-matcha-400 border border-matcha-200';
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {compact ? (
          /* Mobile Compact Trigger Button */
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-peach-50 border border-peach-200 hover:bg-peach-100 text-darkcocoa transition-all text-xs font-semibold"
          >
            <span className="text-sm">{activePropertyId === 'all' ? '🌐' : '🏠'}</span>
            <span className="max-w-[110px] truncate text-left">
              {activePropertyId === 'all' ? 'Semua Cabang' : activeProperty?.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-softgray transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          /* Desktop Sidebar Full Card Trigger */
          <div className="px-3 pt-3 pb-1">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left p-2.5 rounded-2xl bg-white border border-cream-200 hover:border-peach-300 shadow-sm hover:shadow-cute transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-peach-100 to-sakura-100 text-peach-500 flex items-center justify-center flex-shrink-0 border border-peach-200">
                  {activePropertyId === 'all' ? (
                    <Globe className="w-4 h-4 text-peach-500" strokeWidth={2} />
                  ) : (
                    <Building2 className="w-4 h-4 text-peach-500" strokeWidth={2} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="font-heading font-bold text-xs text-darkcocoa truncate">
                      {activePropertyId === 'all' ? 'Semua Cabang Kos' : activeProperty?.name}
                    </p>
                  </div>
                  <p className="font-body text-[10px] text-softgray truncate">
                    {activePropertyId === 'all'
                      ? `${properties.length} Cabang (${totalAllRooms} Kamar)`
                      : `${getRoomCount(activePropertyId)} Kamar • ${activeProperty?.type}`}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-softgray group-hover:text-peach-500 transition-transform flex-shrink-0 ml-1 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}

        {/* Dropdown Menu Popover */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-cream-200 p-2 z-50 font-body text-darkcocoa"
              style={{ minWidth: '270px' }}
            >
              <div className="px-2.5 py-1.5 text-[11px] font-extrabold text-softgray uppercase tracking-wider flex items-center justify-between">
                <span>Pilih Lokasi Kos</span>
                <span className="text-[10px] font-medium text-peach-500">{properties.length} Cabang</span>
              </div>

              {/* Option 1: Semua Cabang (Konsolidasi) */}
              <button
                type="button"
                onClick={() => {
                  setActivePropertyId('all');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors mb-1 ${
                  activePropertyId === 'all'
                    ? 'bg-peach-50 text-peach-500 font-bold'
                    : 'hover:bg-cream-100 text-darkcocoa'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-peach-100 text-peach-500 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-3.5 h-3.5" strokeWidth={2} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="font-heading font-bold text-xs truncate">Semua Cabang</p>
                    <p className="text-[10px] text-softgray">Konsolidasi ({totalAllRooms} Kamar)</p>
                  </div>
                </div>
                {activePropertyId === 'all' && (
                  <Check className="w-4 h-4 text-peach-500 flex-shrink-0" strokeWidth={2.5} />
                )}
              </button>

              <div className="my-1 border-t border-cream-100" />

              {/* List of individual properties */}
              <div className="max-h-56 overflow-y-auto space-y-1">
                {properties.map((prop) => {
                  const isSelected = activePropertyId === prop.id;
                  const roomCount = getRoomCount(prop.id);

                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => {
                        setActivePropertyId(prop.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                        isSelected
                          ? 'bg-peach-50 text-peach-500 font-bold'
                          : 'hover:bg-cream-100 text-darkcocoa'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-cream-100 text-darkcocoa flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-peach-500" strokeWidth={2} />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-heading font-bold text-xs truncate">{prop.name}</p>
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ${getTypeBadgeColor(
                                prop.type
                              )}`}
                            >
                              {prop.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-softgray truncate">{roomCount} Kamar • {prop.address}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-peach-500 flex-shrink-0" strokeWidth={2.5} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Divider & Add Branch Button */}
              <div className="my-1 border-t border-cream-100" />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-peach-500 hover:bg-peach-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Tambah Cabang Kos Baru</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Property Modal */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

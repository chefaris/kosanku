'use client';

import React, { memo } from 'react';
import {
  MapPin,
  MessageCircle,
  Heart
} from 'lucide-react';
import { Property, Room } from '../../lib/store/useKosStore';
import { formatRupiah } from '../../hooks/useCatalogFilter';

interface KosCardProps {
  property: Property;
  rooms: Room[];
  isWishlisted: boolean;
  onToggleWishlist: (propertyId: string) => void;
  onOpenDetail: (property: Property) => void;
}

export const KosCard: React.FC<KosCardProps> = memo(({
  property,
  rooms,
  isWishlisted,
  onToggleWishlist,
  onOpenDetail
}) => {
  const propRooms = rooms.filter((r) => r.propertyId === property.id);
  const vacantCount = propRooms.filter((r) => r.status === 'vacant').length;
  const roomPrices = propRooms.map((r) => r.price).filter((p) => p > 0);
  const minPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 1500000;

  const coverImg =
    property.coverPhoto ||
    property.photos?.[0] ||
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';

  const cleanPhone = (property.managerPhone || '').replace(/\D/g, '');
  const waTarget = cleanPhone.startsWith('0')
    ? '62' + cleanPhone.substring(1)
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : '6281234567890';

  const handleQuickWa = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textMsg = encodeURIComponent(
      `Halo Kak! Saya tertarik dengan kos "${property.name}" di katalog pawskost. Apakah masih ada kamar kosong? Terima kasih!`
    );
    window.open(`https://wa.me/${waTarget}?text=${textMsg}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpenDetail(property)}
      className="group cursor-pointer rounded-2xl bg-white border border-cream-200 shadow-2xs hover:shadow-cute hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Compact Image Thumbnail with Badges */}
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
          <img
            src={coverImg}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Top Badges */}
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 flex-wrap">
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs ${
                property.type === 'Putri'
                  ? 'bg-rose-500 text-white'
                  : property.type === 'Putra'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {property.type === 'Putri'
                ? 'Putri'
                : property.type === 'Putra'
                ? 'Putra'
                : 'Campur'}
            </span>

            {vacantCount > 0 ? (
              <span className="bg-darkcocoa/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                Sisa {vacantCount}
              </span>
            ) : (
              <span className="bg-red-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                Penuh
              </span>
            )}
          </div>

          {/* Top-Right Wishlist Heart */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(property.id);
            }}
            aria-label={isWishlisted ? 'Hapus favorit' : 'Tambah favorit'}
            className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full backdrop-blur-md shadow-xs flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-rose-500 text-white scale-105'
                : 'bg-white/85 text-darkcocoa/70 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom City Badge */}
          {property.city && (
            <span className="absolute bottom-1 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 text-peach-300" />
              <span>{property.city}</span>
            </span>
          )}
        </div>

        {/* Card Body (Tight & Simple) */}
        <div className="p-2 sm:p-2.5">
          <h3 className="font-heading font-extrabold text-xs sm:text-sm text-darkcocoa group-hover:text-peach-600 transition-colors line-clamp-1 leading-snug">
            {property.name}
          </h3>

          <p className="text-[10px] sm:text-[11px] text-softgray line-clamp-1 mt-0.5">
            {property.address}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Compact WA Action */}
      <div className="p-2 sm:p-2.5 pt-0 flex items-center justify-between gap-1 border-t border-cream-100/60 mt-1">
        <div className="min-w-0">
          <p className="font-heading font-black text-xs sm:text-sm text-peach-600 truncate">
            {formatRupiah(minPrice)}
            <span className="text-[9px] text-darkcocoa/60 font-medium">/bln</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickWa}
          className="p-1 sm:px-2 sm:py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1 border border-emerald-200 transition-colors flex-shrink-0"
          title="Chat WhatsApp"
        >
          <MessageCircle className="w-3 h-3 text-emerald-600" />
          <span className="hidden sm:inline">WA</span>
        </button>
      </div>
    </div>
  );
});

KosCard.displayName = 'KosCard';

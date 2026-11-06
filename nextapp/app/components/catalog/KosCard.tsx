'use client';

import React, { memo } from 'react';
import {
  MapPin,
  Star,
  Snowflake,
  Wifi,
  ShowerHead,
  MessageCircle,
  Eye,
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
      `Halo Kak! Saya tertarik dengan kos "${property.name}" di katalog pawskost. Apakah masih ada kamar kosong? Bisa info jadwal survei lokasi? Terima kasih!`
    );
    window.open(`https://wa.me/${waTarget}?text=${textMsg}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpenDetail(property)}
      className="group cursor-pointer rounded-3xl bg-white border border-cream-200 shadow-sm hover:shadow-cute hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Image Thumbnail with Badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-cream-100">
          <img
            src={coverImg}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs border ${
                property.type === 'Putri'
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : property.type === 'Putra'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {property.type === 'Putri'
                ? 'Khusus Putri'
                : property.type === 'Putra'
                ? 'Khusus Putra'
                : 'Campur'}
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

          {/* Top-Right Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(property.id);
            }}
            aria-label={isWishlisted ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-xs transition-all duration-200 z-10 ${
              isWishlisted
                ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                : 'bg-white/85 text-darkcocoa/70 hover:bg-white hover:text-rose-500 hover:scale-105'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom-right City Badge */}
          {property.city && (
            <span className="absolute bottom-2.5 right-2.5 bg-darkcocoa/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
              <MapPin className="w-3 h-3 text-peach-400" />
              <span>{property.city}</span>
            </span>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500 mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-darkcocoa font-extrabold">4.9</span>
              <span className="text-darkcocoa/70 font-semibold">• Terverifikasi pawskost</span>
            </div>

            <h3 className="font-heading font-extrabold text-base text-darkcocoa group-hover:text-peach-600 transition-colors line-clamp-1">
              {property.name}
            </h3>

            <p className="text-xs text-softgray line-clamp-1 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-peach-600 flex-shrink-0" />
              <span>{property.address}</span>
            </p>
          </div>

          {/* Key Facilities Icons */}
          <div className="flex items-center gap-3 pt-2 border-t border-cream-100 text-xs text-softgray">
            <span className="inline-flex items-center gap-1" title="AC Dingin">
              <Snowflake className="w-3.5 h-3.5 text-peach-500" /> AC
            </span>
            <span className="inline-flex items-center gap-1" title="WiFi Cepat">
              <Wifi className="w-3.5 h-3.5 text-peach-500" /> WiFi
            </span>
            <span className="inline-flex items-center gap-1" title="Kamar Mandi Dalam">
              <ShowerHead className="w-3.5 h-3.5 text-peach-500" /> KM Dalam
            </span>
          </div>
        </div>
      </div>

      {/* Card Bottom: Price & Action Buttons */}
      <div className="p-4 sm:p-5 pt-0 border-t border-cream-100 flex items-center justify-between gap-2 mt-2">
        <div>
          <span className="text-[10px] text-softgray block">Mulai dari</span>
          <p className="font-heading font-black text-sm sm:text-base text-peach-700">
            {formatRupiah(minPrice)}
            <span className="text-[10px] text-darkcocoa/60 font-semibold">/bln</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleQuickWa}
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-300 transition-colors shadow-2xs"
            title="Chat WhatsApp Pemilik"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat WA</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDetail(property)}
            className="px-3 py-2 rounded-xl bg-peach-600 hover:bg-peach-700 active:bg-peach-800 text-white font-extrabold text-xs shadow-md shadow-peach-600/20 flex items-center gap-1 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detail</span>
          </button>
        </div>
      </div>
    </div>
  );
});

KosCard.displayName = 'KosCard';

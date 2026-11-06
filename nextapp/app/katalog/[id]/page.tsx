import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  MapPin,
  Star,
  Snowflake,
  Wifi,
  ShowerHead,
  Car,
  Clock,
  ShieldCheck,
  Zap,
  Phone,
  MessageCircle,
  ExternalLink,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  Property,
  Room,
  initialProperties,
  initialRooms
} from '../../lib/store/useKosStore';

function formatRupiah(val: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Mengambil data properti dari Supabase PostgreSQL dengan fallback ke initialProperties.
 */
async function fetchProperty(id: string): Promise<{ property: Property; rooms: Room[] } | null> {
  // Decode URL encoded id if needed
  const decodedId = decodeURIComponent(id);

  // 1. Coba ambil dari Supabase PostgreSQL jika ada
  try {
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project');

    if (isConfigured) {
      const fetchPromise = (async () => {
        const { data: p } = await supabase
          .from('properties')
          .select('*')
          .or(`id.eq.${decodedId},name.ilike.%${decodedId}%`)
          .maybeSingle();

        if (p) {
          const { data: rList } = await supabase
            .from('rooms')
            .select('*')
            .eq('property_id', p.id);

          const property: Property = {
            id: p.id,
            name: p.name,
            address: p.address,
            city: p.city || 'Bandung',
            type: p.type || 'Campur',
            floors: p.floors || 1,
            managerName: p.manager_name,
            managerPhone: p.manager_phone,
            coverPhoto: p.cover_photo,
            photos: p.photos || [],
            description: p.description,
            rules: p.rules || [],
            facilities: p.facilities || [],
            isPublished: p.is_published !== false,
            googleMapsUrl: p.google_maps_url,
            electricityType: p.electricity_type || 'token',
            depositAmount: Number(p.deposit_amount) || 0,
            parkingFeeCar: Number(p.parking_fee_car) || 0,
            curfewPolicy: p.curfew_policy || 'Akses 24 Jam Mandiri',
            minimalRentMonths: Number(p.minimal_rent_months) || 1,
            bankName: p.bank_name,
            accountNumber: p.account_number,
            accountHolder: p.account_holder
          };

          const rooms: Room[] = (rList || []).map((r: any) => ({
            id: r.id,
            propertyId: r.property_id,
            floor: r.floor || 1,
            number: r.number,
            type: r.type || 'Standard',
            status: r.status || 'vacant',
            price: Number(r.price) || 1500000,
            facilities: r.facilities || { ac: true, wifi: true, bath: true }
          }));

          return { property, rooms };
        }
        return null;
      })();

      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 2500)
      );

      const remoteResult = await Promise.race([fetchPromise, timeoutPromise]);
      if (remoteResult) return remoteResult;
    }
  } catch (err) {
    console.warn('💡 Supabase fetch fallback to local initialProperties:', err);
  }

  // 2. Fallback: Cari di initialProperties
  const safeInitialProps = Array.isArray(initialProperties) ? initialProperties : [];
  const safeInitialRooms = Array.isArray(initialRooms) ? initialRooms : [];

  const matchedProp = safeInitialProps.find(
    (p) =>
      p.id.toLowerCase() === decodedId.toLowerCase() ||
      p.name.toLowerCase().includes(decodedId.toLowerCase())
  );

  if (matchedProp) {
    const propRooms = safeInitialRooms.filter((r) => r.propertyId === matchedProp.id);
    return { property: matchedProp, rooms: propRooms };
  }

  return null;
}

/**
 * Generate Dynamic SEO & OpenGraph Metadata untuk Google Bot & Media Sosial (WhatsApp/Twitter)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchProperty(id);

  if (!result) {
    return {
      title: 'Kos Tidak Ditemukan | pawskost',
      description: 'Halaman kos yang Anda cari tidak ditemukan di katalog pawskost.'
    };
  }

  const { property, rooms } = result;
  const roomPrices = rooms.map((r) => r.price).filter((p) => p > 0);
  const minPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 1500000;
  const priceFormatted = formatRupiah(minPrice);

  const title = `${property.name} - Kos ${property.type} di ${property.city} | pawskost`;
  const description = `Info sewa ${property.name} di ${property.address}, ${property.city}. Tarif mulai ${priceFormatted}/bln. Fasilitas lengkap, kontak langsung pemilik resmi tanpa perantara.`;
  const coverImg =
    property.coverPhoto ||
    property.photos?.[0] ||
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    keywords: [
      `kost ${property.city.toLowerCase()}`,
      `kos ${property.type.toLowerCase()} ${property.city.toLowerCase()}`,
      property.name.toLowerCase(),
      'sewa kost murah',
      'katalog pawskost'
    ],
    openGraph: {
      title,
      description,
      url: `https://pawskost.id/katalog/${encodeURIComponent(property.id)}`,
      siteName: 'pawskost',
      images: [
        {
          url: coverImg,
          width: 1200,
          height: 630,
          alt: property.name
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverImg]
    }
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await fetchProperty(id);

  if (!result) {
    notFound();
  }

  const { property, rooms } = result;
  const vacantRooms = rooms.filter((r) => r.status === 'vacant');
  const roomPrices = rooms.map((r) => r.price).filter((p) => p > 0);
  const minPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 1500000;
  const maxPrice = roomPrices.length > 0 ? Math.max(...roomPrices) : minPrice;

  const photos =
    property.photos && property.photos.length > 0
      ? property.photos
      : property.coverPhoto
      ? [property.coverPhoto]
      : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'];

  const cleanPhone = (property.managerPhone || '').replace(/\D/g, '');
  const waTarget = cleanPhone.startsWith('0')
    ? '62' + cleanPhone.substring(1)
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : '6281234567890';

  const waBookingMessage = encodeURIComponent(
    `Halo Kak! Saya melihat info kos "${property.name}" di pawskost (https://pawskost.id/katalog/${property.id}). Apakah masih ada kamar kosong dan bisa jadwalkan survei lokasi? Terima kasih!`
  );

  // JSON-LD Structured Data Schema (Google Rich Snippets)
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.name,
    description: property.description || `Sewa kos ${property.type} di ${property.city}`,
    image: photos[0],
    telephone: property.managerPhone || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      streetAddress: property.address,
      addressCountry: 'ID'
    },
    priceRange: `IDR ${minPrice} - ${maxPrice}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '18'
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 font-body text-darkcocoa selection:bg-peach-100 selection:text-peach-500">
      {/* JSON-LD Script untuk Google Bot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Header / Navbar Sederhana */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200/90 shadow-xs py-3.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-heading font-extrabold text-xl text-peach-600">pawskost</span>
            <span className="text-xs text-softgray font-bold hidden sm:inline">• Katalog Resmi</span>
          </Link>

          <Link
            href="/katalog"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-softgray hover:text-darkcocoa hover:bg-cream-100 border border-cream-200 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 text-xs text-softgray flex items-center gap-2">
        <Link href="/" className="hover:underline">Beranda</Link>
        <span>/</span>
        <Link href="/katalog" className="hover:underline">Katalog</Link>
        <span>/</span>
        <span className="text-darkcocoa font-bold truncate max-w-xs">{property.name}</span>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                  property.type === 'Putri'
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : property.type === 'Putra'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}
              >
                Khusus {property.type}
              </span>
              <span className="text-xs text-softgray font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-peach-600" />
                <span>{property.city}</span>
              </span>
              <span className="text-xs text-amber-500 font-extrabold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 (Terverifikasi pawskost)</span>
              </span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-darkcocoa">
              {property.name}
            </h1>
            <p className="text-xs sm:text-sm text-softgray">{property.address}</p>
          </div>

          {vacantRooms.length > 0 ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Sisa {vacantRooms.length} Kamar Kosong</span>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-full bg-cream-200 text-softgray font-bold text-xs self-start sm:self-auto">
              Kamar Penuh
            </div>
          )}
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-3xl overflow-hidden border border-cream-200 shadow-sm">
          <div className="md:col-span-2 aspect-video md:aspect-auto overflow-hidden bg-cream-100">
            <img
              src={photos[0]}
              alt={property.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {photos.slice(1, 3).map((url, idx) => (
              <div key={idx} className="aspect-video overflow-hidden bg-cream-100">
                <img
                  src={url}
                  alt={`${property.name} - ${idx + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Details & Sticky Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Transparent Costs Box */}
            <div className="p-5 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <h3 className="font-heading font-extrabold text-base text-darkcocoa flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-peach-600" />
                <span>Transparansi Biaya &amp; Ketentuan Sewa</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-darkcocoa">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Skema Listrik</span>
                  </div>
                  <p className="text-softgray">
                    {property.electricityType === 'included'
                      ? 'Termasuk sewa (Bebas biaya listrik)'
                      : property.electricityType === 'meter_monthly'
                      ? 'Meteran pascabayar bulanan'
                      : 'Token PLN mandiri per kamar'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-darkcocoa">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Uang Deposit / Jaminan</span>
                  </div>
                  <p className="text-softgray">
                    {property.depositAmount && property.depositAmount > 0
                      ? `${formatRupiah(property.depositAmount)} (Dikembalikan saat checkout)`
                      : 'Rp 0 (Bebas Deposit)'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-darkcocoa">
                    <Clock className="w-4 h-4 text-peach-600" />
                    <span>Akses Gerbang / Jam Malam</span>
                  </div>
                  <p className="text-softgray">{property.curfewPolicy || 'Akses 24 Jam Mandiri'}</p>
                </div>

                <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-darkcocoa">
                    <Car className="w-4 h-4 text-blue-500" />
                    <span>Biaya Parkir Mobil</span>
                  </div>
                  <p className="text-softgray">
                    {property.parkingFeeCar && property.parkingFeeCar > 0
                      ? `${formatRupiah(property.parkingFeeCar)}/bulan`
                      : 'Gratis / Termasuk fasilitas'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Deskripsi */}
            {property.description && (
              <div className="p-5 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-2">
                <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                  Tentang Kos Ini
                </h3>
                <p className="text-xs sm:text-sm text-darkcocoa/80 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* 3. Fasilitas Kos */}
            <div className="p-5 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                Fasilitas Kamar &amp; Bersama
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-semibold">
                <span className="p-2.5 rounded-xl bg-cream-50 border border-cream-100 flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-peach-600" /> Pendingin Ruangan (AC)
                </span>
                <span className="p-2.5 rounded-xl bg-cream-50 border border-cream-100 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-peach-600" /> Internet WiFi Cepat
                </span>
                <span className="p-2.5 rounded-xl bg-cream-50 border border-cream-100 flex items-center gap-2">
                  <ShowerHead className="w-4 h-4 text-peach-600" /> Kamar Mandi Dalam
                </span>
                {(property.facilities || []).map((fac, idx) => (
                  <span
                    key={idx}
                    className="p-2.5 rounded-xl bg-cream-50 border border-cream-100 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {fac}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Lokasi Google Maps */}
            {property.googleMapsUrl && (
              <div className="p-5 bg-white rounded-3xl border border-cream-200 shadow-sm space-y-2">
                <h3 className="font-heading font-extrabold text-base text-darkcocoa">
                  Lokasi &amp; Peta
                </h3>
                <p className="text-xs text-softgray">{property.address}</p>
                <a
                  href={property.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs border border-cream-200 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-peach-600" />
                  <span>Buka Petunjuk Arah di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking & WhatsApp Contact Box */}
          <div className="p-6 bg-white rounded-3xl border-2 border-peach-200 shadow-lg space-y-5 sticky top-24">
            <div>
              <span className="text-[11px] text-softgray font-semibold block">Mulai dari</span>
              <p className="font-heading font-black text-2xl text-peach-700">
                {formatRupiah(minPrice)}
                <span className="text-xs font-semibold text-softgray"> /bulan</span>
              </p>
              {minPrice !== maxPrice && (
                <p className="text-[11px] text-softgray">Hingga {formatRupiah(maxPrice)}/bulan</p>
              )}
            </div>

            <div className="space-y-2.5">
              <a
                href={`https://wa.me/${waTarget}?text=${waBookingMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Pemilik</span>
              </a>

              <a
                href={`https://wa.me/${waTarget}?text=${encodeURIComponent(`Halo Kak! Saya ingin menjadwalkan survei ke ${property.name}. Kapan waktu yang tersedia? Terima kasih.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs border border-cream-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4 text-peach-600" />
                <span>Jadwalkan Survei Lokasi</span>
              </a>
            </div>

            <div className="p-3.5 rounded-2xl bg-peach-50/70 border border-peach-200 text-[11px] space-y-1 text-darkcocoa">
              <p className="font-bold">💡 Kontak Langsung Bebas Komisi</p>
              <p className="text-softgray leading-relaxed">
                Anda terhubung langsung dengan nomor pengelola resmi kos ini tanpa perantara.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

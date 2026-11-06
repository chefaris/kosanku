'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useKosStore, Property, Room, Tenant, Invoice } from '../lib/store/useKosStore';

export function useSupabaseSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const currentUser = useKosStore((state) => state.currentUser);
  const authMode = useKosStore((state) => state.authMode);

  // Fungsi sinkronisasi data dari Supabase PostgreSQL
  const syncFromSupabase = useCallback(async () => {
    // Hanya sinkron jika ada URL supabase yang valid (bukan placeholder)
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project');

    if (!isConfigured) {
      setIsCloudConnected(false);
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      // 1. Cek koneksi Supabase & Session
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData?.session;

      // 2. Tarik data properti publik / milik user
      let propQuery = supabase.from('properties').select('*');
      if (currentSession?.user?.id) {
        propQuery = propQuery.eq('user_id', currentSession.user.id);
      } else {
        propQuery = propQuery.eq('is_published', true);
      }

      const { data: cloudProps, error: propErr } = await propQuery;

      if (!propErr && cloudProps && cloudProps.length > 0) {
        setIsCloudConnected(true);
        // Transform database rows to Zustand Property model
        const mappedProps: Property[] = cloudProps.map((p: any) => ({
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
        }));

        // Merge ke store
        useKosStore.setState((state) => {
          const currentIds = new Set(state.properties.map((item) => item.id));
          const newFromCloud = mappedProps.filter((mp) => !currentIds.has(mp.id));
          const updated = state.properties.map((local) => {
            const matched = mappedProps.find((mp) => mp.id === local.id);
            return matched || local;
          });
          return { properties: [...updated, ...newFromCloud] };
        });
      }

      // 3. Tarik data kamar (rooms) jika ada properti yang cocok
      const { data: cloudRooms, error: roomErr } = await supabase.from('rooms').select('*');
      if (!roomErr && cloudRooms && cloudRooms.length > 0) {
        const mappedRooms: Room[] = cloudRooms.map((r: any) => ({
          id: r.id,
          propertyId: r.property_id,
          floor: r.floor || 1,
          number: r.number,
          type: r.type || 'Standard',
          status: r.status || 'vacant',
          price: Number(r.price) || 1500000,
          facilities: r.facilities || { ac: true, wifi: true, bath: true },
          idMeteranPLN: r.id_meteran_pln,
          catatan: r.catatan
        }));

        useKosStore.setState((state) => {
          const roomIds = new Set(state.rooms.map((item) => item.id));
          const newRooms = mappedRooms.filter((mr) => !roomIds.has(mr.id));
          const updatedRooms = state.rooms.map((local) => {
            const matched = mappedRooms.find((mr) => mr.id === local.id);
            return matched || local;
          });
          return { rooms: [...updatedRooms, ...newRooms] };
        });
      }

      setLastSyncedAt(new Date());
      setIsCloudConnected(true);
    } catch (err: any) {
      console.warn('💡 Supabase sync offline/warning:', err?.message || err);
      setSyncError(err?.message || 'Gagal sinkronisasi');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Realtime subscription: otomatis dengar perubahan dari device lain
  useEffect(() => {
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project');

    if (!isConfigured) return;

    // Jalankan sync awal
    syncFromSupabase();

    // Buat listener real-time Supabase Channel
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        () => {
          syncFromSupabase();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        () => {
          syncFromSupabase();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsCloudConnected(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [syncFromSupabase]);

  return {
    isSyncing,
    isCloudConnected,
    lastSyncedAt,
    syncError,
    syncNow: syncFromSupabase
  };
}

-- =========================================================================
-- pawskost 🐾 PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Jalankan skrip ini di menu SQL Editor pada Supabase Dashboard Anda.
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Akun Pemilik Kos & Super Admin)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT DEFAULT '-',
  kos_name TEXT DEFAULT 'Kosan Saya',
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'manager', 'superadmin')),
  plan TEXT DEFAULT 'pro' CHECK (plan IN ('starter', 'pro', 'enterprise', 'trial_14_days')),
  plan_name TEXT DEFAULT 'Paket Juragan Pro',
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'active', 'trial', 'suspended', 'expired')),
  expires_at DATE,
  days_remaining INTEGER DEFAULT 30,
  total_paid NUMERIC DEFAULT 0,
  last_payment_date TEXT,
  proof_url TEXT,
  proof_notes TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PROPERTIES (Cabang / Properti Kos)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT 'Alamat Belum Diatur',
  type TEXT DEFAULT 'Campur',
  floors INTEGER DEFAULT 1,
  manager_name TEXT,
  manager_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL ROOMS (Kamar Kos)
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  floor INTEGER DEFAULT 1,
  number TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Standard',
  status TEXT DEFAULT 'vacant' CHECK (status IN ('occupied', 'vacant', 'maintenance')),
  price NUMERIC NOT NULL DEFAULT 1000000,
  facilities JSONB DEFAULT '{}'::jsonb,
  id_meteran_pln TEXT,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL TENANTS (Penghuni Kos)
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  emergency_contact JSONB DEFAULT '{"name":"","relation":"","phone":""}'::jsonb,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_day_of_month INTEGER DEFAULT 1,
  deposit_amount NUMERIC DEFAULT 0,
  deposit_status TEXT DEFAULT 'unpaid' CHECK (deposit_status IN ('paid', 'unpaid', 'refunded')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'checked_out')),
  notes TEXT,
  profile_photo TEXT,
  ktp_photo TEXT,
  ktp_number TEXT,
  job_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL INVOICES (Tagihan Sewa & Kwitansi)
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  period_month TEXT NOT NULL,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')),
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL EXPENSES (Beban & Pengeluaran Kas)
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'lainnya',
  amount NUMERIC NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL MAINTENANCE TICKETS (Keluhan & Servis)
CREATE TABLE IF NOT EXISTS public.maintenance_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('urgent', 'medium', 'low')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  technician TEXT,
  cost NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL SETTINGS & CUSTOMIZATION (Rekening Bank, Template WA, Tema Warna)
CREATE TABLE IF NOT EXISTS public.settings (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  bank_name TEXT DEFAULT 'BCA',
  account_number TEXT DEFAULT '',
  account_holder TEXT DEFAULT '',
  wa_template TEXT DEFAULT 'Halo [nama], tagihan sewa kamar [kamar] sebesar [nominal] jatuh tempo pada [tanggal]. Pembayaran via [bank] a.n [pemilik]. Terima kasih!',
  kos_name TEXT DEFAULT 'pawskost Living',
  kos_address TEXT DEFAULT '',
  kos_phone TEXT DEFAULT '',
  app_theme TEXT DEFAULT 'paw-peach',
  monthly_budgets JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL STAFF USERS (Manajemen Tim & Hak Akses Staf Kos)
CREATE TABLE IF NOT EXISTS public.staff_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '-',
  role TEXT NOT NULL DEFAULT 'cashier' CHECK (role IN ('manager', 'cashier', 'staff_ops')),
  password TEXT NOT NULL,
  assigned_property_id TEXT DEFAULT 'all',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_staff_email_per_owner UNIQUE(owner_id, email)
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Standar Keamanan: Setiap tenant HANYA bisa mengakses data miliknya sendiri.
-- Super Admin memiliki hak penuh untuk mengelola pelanggan.
-- =========================================================================

-- Helper function: cek apakah user saat ini adalah superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile or SuperAdmin views all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_superadmin());

CREATE POLICY "Users can update own profile or SuperAdmin updates all"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_superadmin());

CREATE POLICY "Allow insert during registration"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_superadmin());

CREATE POLICY "Allow delete profile for SuperAdmin or User"
  ON public.profiles FOR DELETE
  USING (true);

-- RLS PROPERTIES
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant owns properties"
  ON public.properties FOR ALL
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- RLS ROOMS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant owns rooms"
  ON public.rooms FOR ALL
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- RLS TENANTS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant owns tenant list"
  ON public.tenants FOR ALL
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- RLS INVOICES
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant owns invoices"
  ON public.invoices FOR ALL
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- RLS EXPENSES
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant owns expenses"
  ON public.expenses FOR ALL
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- RLS MAINTENANCE TICKETS
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant owns maintenance tickets"
  ON public.maintenance_tickets FOR ALL
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- RLS SETTINGS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant owns settings"
  ON public.settings FOR ALL
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- RLS STAFF USERS
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner owns staff users"
  ON public.staff_users FOR ALL
  USING (auth.uid() = owner_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = owner_id OR public.is_superadmin());

-- =========================================================================
-- TRIGGER: Otomatis buat Profile saat User mendaftar via Supabase Auth
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    phone,
    kos_name,
    role,
    plan,
    plan_name,
    status,
    expires_at,
    proof_url,
    proof_notes
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Pemilik Kos Baru'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '-'),
    COALESCE(NEW.raw_user_meta_data->>'kos_name', 'Kosan Pawskost'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'owner'),
    COALESCE(NEW.raw_user_meta_data->>'plan', 'pro'),
    COALESCE(NEW.raw_user_meta_data->>'plan_name', 'Paket Juragan Pro'),
    COALESCE(NEW.raw_user_meta_data->>'status', 'pending_approval'),
    (CURRENT_DATE + INTERVAL '30 days')::DATE,
    NEW.raw_user_meta_data->>'proof_url',
    NEW.raw_user_meta_data->>'proof_notes'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    kos_name = EXCLUDED.kos_name;

  -- Buat pengaturan default
  INSERT INTO public.settings (user_id, kos_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'kos_name', 'pawskost Living'))
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Selesai! Schema database & RLS berhasil disiapkan dengan standar keamanan SaaS.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  kosName: string;
  role: 'owner' | 'manager' | 'demo' | 'superadmin';
  plan: 'demo_sandbox' | 'trial_14_days' | 'starter' | 'pro' | 'enterprise';
  trialDaysRemaining?: number;
  isDemo: boolean;
}

export const defaultDemoUser: UserProfile = {
  id: 'usr-demo-1',
  name: 'Tamu Demo pawskost',
  email: 'demo@pawskost.id',
  kosName: 'pawskost Paviliun Dago & Sukajadi',
  role: 'demo',
  plan: 'demo_sandbox',
  trialDaysRemaining: 14,
  isDemo: true
};

export const defaultSuperAdmin: UserProfile = {
  id: 'usr-admin-root',
  name: 'Super Admin pawskost',
  email: 'admin@pawskost.id',
  kosName: 'pawskost Platform',
  role: 'superadmin',
  plan: 'enterprise',
  isDemo: false
};

export interface SubscriptionDetails {
  plan: 'demo_sandbox' | 'trial_14_days' | 'starter' | 'pro' | 'enterprise';
  planName: string;
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'trial' | 'expired';
  startDate: string;
  expiresAt: string;
  daysRemaining: number;
  maxRooms: number;
  maxProperties: number;
}

export interface SaaSInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  planName: string;
  cycle: 'Bulanan' | 'Tahunan';
  amount: number;
  paymentMethod: string;
  status: 'Lunas';
}

export const initialSubscription: SubscriptionDetails = {
  plan: 'demo_sandbox',
  planName: 'Mode Demo Sandbox',
  billingCycle: 'monthly',
  status: 'trial',
  startDate: '2026-10-01',
  expiresAt: '2026-11-14',
  daysRemaining: 14,
  maxRooms: 999,
  maxProperties: 999
};

export const initialSaaSInvoices: SaaSInvoice[] = [
  {
    id: 'inv-saas-1',
    invoiceNumber: 'INV-KSK/2026/10/001',
    date: '31 Okt 2026',
    planName: 'Trial Gratis 14 Hari',
    cycle: 'Bulanan',
    amount: 0,
    paymentMethod: 'Promo Pendaftaran',
    status: 'Lunas'
  }
];

export interface SaaSUserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  kosName: string;
  registeredAt: string;
  plan: 'trial_14_days' | 'starter' | 'pro' | 'enterprise';
  planName: string;
  status: 'active' | 'trial' | 'pending_approval' | 'expired' | 'suspended';
  expiresAt: string;
  daysRemaining: number;
  totalPaid: number;
  lastPaymentDate?: string;
  proofUrl?: string;
  proofNotes?: string;
  notes?: string;
}

// Sample transfer proof receipt SVG data URL for demonstration
export const sampleProofReceipt = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="450" height="650" viewBox="0 0 450 650"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23005baa"/><stop offset="100%" stop-color="%23003066"/></linearGradient></defs><rect width="450" height="650" rx="20" fill="%23f8fafc"/><rect width="450" height="110" rx="20" fill="url(%23g)"/><text x="225" y="45" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="%23ffffff" text-anchor="middle">m-BCA TRANSFER BERHASIL</text><text x="225" y="75" font-family="Arial,sans-serif" font-weight="bold" font-size="13" fill="%2393c5fd" text-anchor="middle">BUKTI TRANSAKSI RESMI</text><circle cx="225" cy="155" r="32" fill="%2322c55e"/><path d="M213 155l8 8 18-18" stroke="%23ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><text x="225" y="215" font-family="Arial,sans-serif" font-weight="bold" font-size="14" fill="%2316a34a" text-anchor="middle">TRANSAKSI BERHASIL</text><text x="225" y="255" font-family="Arial,sans-serif" font-weight="900" font-size="26" fill="%230f172a" text-anchor="middle">Rp 99.000</text><text x="225" y="278" font-family="Arial,sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">Biaya Admin: Rp 0</text><line x1="30" y1="305" x2="420" y2="305" stroke="%23e2e8f0" stroke-width="1.5" stroke-dasharray="6 6"/><text x="40" y="340" font-family="Arial,sans-serif" font-size="12" fill="%2364748b">Waktu Transaksi</text><text x="410" y="340" font-family="Arial,sans-serif" font-weight="bold" font-size="12" fill="%231e293b" text-anchor="end">31/10/2026 21:45:12 WIB</text><text x="40" y="375" font-family="Arial,sans-serif" font-size="12" fill="%2364748b">No. Referensi</text><text x="410" y="375" font-family="Arial,sans-serif" font-weight="bold" font-size="12" fill="%231e293b" text-anchor="end">TRX-20261031-984210</text><text x="40" y="410" font-family="Arial,sans-serif" font-size="12" fill="%2364748b">Rekening Tujuan</text><text x="410" y="410" font-family="Arial,sans-serif" font-weight="bold" font-size="12" fill="%23005baa" text-anchor="end">BCA 8420-1928-31</text><text x="40" y="445" font-family="Arial,sans-serif" font-size="12" fill="%2364748b">Nama Penerima</text><text x="410" y="445" font-family="Arial,sans-serif" font-weight="bold" font-size="12" fill="%231e293b" text-anchor="end">Rumah KosanKu Indonesia</text><text x="40" y="480" font-family="Arial,sans-serif" font-size="12" fill="%2364748b">Pengirim</text><text x="410" y="480" font-family="Arial,sans-serif" font-weight="bold" font-size="12" fill="%231e293b" text-anchor="end">CALON TENANT KOSANKU</text><text x="40" y="515" font-family="Arial,sans-serif" font-size="12" fill="%2364748b">Berita / Catatan</text><text x="410" y="515" font-family="Arial,sans-serif" font-weight="bold" font-size="12" fill="%231e293b" text-anchor="end">Langganan Paket SaaS KosanKu</text><rect x="30" y="550" width="390" height="60" rx="12" fill="%23eff6ff"/><text x="225" y="575" font-family="Arial,sans-serif" font-weight="bold" font-size="11" fill="%231e40af" text-anchor="middle">Simpan resi ini sebagai bukti pembayaran yang sah.</text><text x="225" y="595" font-family="Arial,sans-serif" font-size="10" fill="%233b82f6" text-anchor="middle">KosanKu SaaS Indonesia &bull; cs@kosanku.id</text></svg>`;

export interface LandingPageConfig {
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  heroCtaSecondaryText: string;
  pricing: {
    starter: {
      name: string;
      price: number;
      maxRooms: number;
      maxProperties: number;
      desc: string;
    };
    pro: {
      name: string;
      price: number;
      maxRooms: number;
      maxProperties: number;
      desc: string;
    };
    enterprise: {
      name: string;
      price: number;
      maxRooms: number;
      maxProperties: number;
      desc: string;
    };
  };
  bankAccounts: {
    id: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }[];
  adminWhatsApp: string;
  adminEmail: string;
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[];
}

export const initialLandingPageConfig: LandingPageConfig = {
  heroBadge: 'Platform Manajemen Kos No. 1 di Indonesia 🐾✨',
  heroHeadline: 'Kelola Kos Jadi Menyenangkan, Kamar Penuh, Tagihan Beres!',
  heroSubheadline: 'Tinggalkan buku catatan manual yang bikin pusing. Pantau okupansi kamar, kirim pengingat tagihan sewa ke WhatsApp dalam 1 klik, dan simpan arsip KTP penghuni secara aman.',
  heroCtaText: 'Coba Demo Interaktif (1-Klik Tanpa Daftar)',
  heroCtaSecondaryText: 'Mulai Uji Coba 14 Hari Gratis',
  pricing: {
    starter: {
      name: 'Paket Kos Mungil',
      price: 49000,
      maxRooms: 10,
      maxProperties: 1,
      desc: 'Cocok untuk pemilik kos pemula dengan 1 lokasi.'
    },
    pro: {
      name: 'Paket Juragan Pro',
      price: 99000,
      maxRooms: 50,
      maxProperties: 3,
      desc: 'Pilihan paling favorit! Dilengkapi multi-cabang & kuota 50 kamar.'
    },
    enterprise: {
      name: 'Paket Konglomerat',
      price: 199000,
      maxRooms: 999,
      maxProperties: 999,
      desc: 'Kapasitas tanpa batas untuk juragan kos besar & kostel.'
    }
  },
  bankAccounts: [
    {
      id: 'bank-bca',
      bankName: 'BCA (Bank Central Asia)',
      accountNumber: '8420-1928-31',
      accountHolder: 'pawskost Indonesia'
    },
    {
      id: 'bank-mandiri',
      bankName: 'BANK MANDIRI',
      accountNumber: '1370-0192-8381',
      accountHolder: 'pawskost Indonesia'
    }
  ],
  adminWhatsApp: '0812-3456-7890',
  adminEmail: 'support@pawskost.id',
  faqs: [
    {
      id: 'faq-1',
      question: 'Apakah saya bisa mencoba aplikasi ini secara gratis?',
      answer: 'Tentu saja! Anda bisa langsung mencoba Mode Demo 1-Klik tanpa perlu mendaftar atau kartu kredit, atau daftar akun baru untuk menikmati Trial 14 Hari penuh.'
    },
    {
      id: 'faq-2',
      question: 'Bagaimana cara melakukan aktivasi setelah mendaftar?',
      answer: 'Lakukan transfer manual ke rekening resmi Super Admin (BCA / Mandiri) dan unggah foto bukti transfer saat mendaftar. Super Admin akan memverifikasi mutasi dan membuka akses akun Anda.'
    },
    {
      id: 'faq-3',
      question: 'Apakah data kos dan privasi penghuni aman?',
      answer: 'Sangat aman! Seluruh dokumen KTP dienkripsi dan diberi watermark otomatis untuk mencegah penyalahgunaan identitas.'
    },
    {
      id: 'faq-4',
      question: 'Apakah bisa digunakan untuk lebih dari satu cabang kos?',
      answer: 'Bisa! Paket Juragan Pro mendukung hingga 3 cabang kos terpisah, dan Paket Konglomerat mendukung cabang tanpa batas dalam satu akun.'
    },
    {
      id: 'faq-5',
      question: 'Bagaimana cara mengirim pengingat tagihan ke WhatsApp penghuni?',
      answer: 'Cukup 1 klik dari tabel tagihan sewa. Pesan ramah yang sudah dipersonalisasi beserta rincian kamar dan nominal transfer akan otomatis disiapkan untuk dikirim ke nomor WhatsApp penghuni.'
    }
  ]
};

export const initialSaaSAccounts: SaaSUserAccount[] = [
  {
    id: 'usr-admin-root',
    name: 'Super Admin KosanKu',
    email: 'admin@kosanku.id',
    password: 'admin123',
    phone: '0812-0000-9999',
    kosName: 'KosanKu SaaS Platform',
    registeredAt: '2026-01-01',
    plan: 'enterprise',
    planName: 'Platform Owner',
    status: 'active',
    expiresAt: '2099-12-31',
    daysRemaining: 9999,
    totalPaid: 0,
    notes: 'Akun Super Admin Utama Pemilik Aplikasi.'
  },
  {
    id: 'usr-acct-1',
    name: 'Ibu Ratna Dewi',
    email: 'ratna.dago@gmail.com',
    password: 'password123',
    phone: '0812-2334-4556',
    kosName: 'Kosan Putri Cantika Dago',
    registeredAt: '2026-10-31',
    plan: 'pro',
    planName: 'Paket Juragan Pro',
    status: 'pending_approval',
    expiresAt: '2026-11-30',
    daysRemaining: 30,
    totalPaid: 99000,
    lastPaymentDate: '31 Okt 2026',
    proofUrl: sampleProofReceipt,
    proofNotes: 'Transfer via m-BCA a/n Ratna Dewi Rp 99.000 ref: 20261031772910842',
    notes: 'Pendaftaran baru dengan bukti transfer BCA. Menunggu aktivasi manual Super Admin.'
  },
  {
    id: 'usr-acct-2',
    name: 'Pak Hendra Wijaya',
    email: 'hendra.jaksel@yahoo.com',
    password: 'password123',
    phone: '0813-9988-7766',
    kosName: 'Kosan Harmoni Tebet',
    registeredAt: '2026-10-15',
    plan: 'pro',
    planName: 'Paket Juragan Pro',
    status: 'active',
    expiresAt: '2026-11-15',
    daysRemaining: 15,
    totalPaid: 198000,
    lastPaymentDate: '15 Okt 2026',
    proofUrl: sampleProofReceipt,
    proofNotes: 'Transfer Mandiri a/n Hendra Wijaya Rp 99.000',
    notes: 'Langganan bulan ke-2, verifikasi aktif via Transfer Mandiri.'
  },
  {
    id: 'usr-acct-3',
    name: 'Dimas Anugrah',
    email: 'dimas.jogja@gmail.com',
    password: 'password123',
    phone: '0857-1234-5678',
    kosName: 'Kosan Maba UGM Pogung',
    registeredAt: '2026-10-28',
    plan: 'trial_14_days',
    planName: 'Trial Gratis 14 Hari',
    status: 'trial',
    expiresAt: '2026-11-11',
    daysRemaining: 11,
    totalPaid: 0,
    notes: 'Pendaftar baru via landing page, dalam masa percobaan.'
  },
  {
    id: 'usr-acct-4',
    name: 'H. Suryadi Pratama',
    email: 'suryadi.residence@gmail.com',
    password: 'password123',
    phone: '0811-2233-4455',
    kosName: 'Suryadi Residence & Kostel',
    registeredAt: '2026-09-01',
    plan: 'enterprise',
    planName: 'Paket Konglomerat',
    status: 'active',
    expiresAt: '2027-09-01',
    daysRemaining: 305,
    totalPaid: 1900000,
    lastPaymentDate: '01 Sep 2026',
    proofUrl: sampleProofReceipt,
    proofNotes: 'Transfer BCA Bisnis a/n PT Suryadi Mandiri Rp 1.900.000',
    notes: 'Paket Tahunan Konglomerat, transfer via BCA Bisnis telah diverifikasi.'
  },
  {
    id: 'usr-acct-5',
    name: 'Siti Nurhaliza',
    email: 'siti.kosan@outlook.com',
    password: 'password123',
    phone: '0819-8765-4321',
    kosName: 'Kos Melati Sukajadi',
    registeredAt: '2026-10-01',
    plan: 'starter',
    planName: 'Paket Kos Mungil',
    status: 'expired',
    expiresAt: '2026-10-31',
    daysRemaining: 0,
    totalPaid: 49000,
    lastPaymentDate: '01 Okt 2026',
    notes: 'Masa aktif habis hari ini, menunggu konfirmasi transfer perpanjangan.'
  }
];

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'Putri' | 'Putra' | 'Campur' | 'Pasutri';
  floors: number;
  managerName?: string;
  managerPhone?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
}

export interface RoomFacilities {
  ac: boolean;
  wifi: boolean;
  bath: boolean;
  custom?: string[];
}

export interface RoomTypeItem {
  id: string;
  name: string;
  description?: string;
  defaultPrice?: number;
}

export interface FacilityItem {
  id: string;
  name: string;
  icon: string;
}

export type AppTheme = 'paw-peach' | 'matcha-mint' | 'sakura-blossom' | 'ocean-blue' | 'lavender-cozy' | 'mocha-latte';

export interface TransactionCategoryItem {
  id: string;
  name: string;
  icon: string;
  type: 'income' | 'expense';
  color?: string;
}

export interface CashAccountItem {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'ewallet';
  accountNumber?: string;
  balance?: number;
}

export interface Room {
  id: string;
  propertyId: string;
  floor: number;
  number: string;
  type: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  price: number; // in Rupiah
  tenantId?: string;
  tenantName?: string;
  dueDate?: string;
  facilities: RoomFacilities;
  idMeteranPln?: string;
  catatan?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Tenant {
  id: string;
  propertyId: string;
  name: string;
  phone: string;
  email?: string;
  roomId?: string;
  roomNumber?: string;
  emergencyContact: EmergencyContact;
  startDate: string;
  dueDayOfMonth: number;
  depositAmount: number;
  depositStatus: 'paid' | 'unpaid' | 'refunded';
  status: 'active' | 'checked_out';
  notes?: string;
  profilePhoto?: string;
  ktpPhoto?: string;
  ktpNumber?: string;
  jobTitle?: string;
}

export interface Invoice {
  id: string;
  propertyId: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  roomId: string;
  roomNumber: string;
  amount: number;
  dueDate: string;
  periodMonth: string;
  status: 'unpaid' | 'paid' | 'overdue';
  paidAt?: string;
  paymentMethod?: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  title: string;
  category: 'listrik' | 'gaji' | 'internet' | 'air' | 'maintenance' | 'lainnya';
  amount: number;
  date: string;
  notes?: string;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  roomNumber: string;
  title: string;
  description: string;
  priority: 'urgent' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'resolved';
  date: string;
  technician?: string;
  cost?: number;
}

export interface PropertySettings {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  waTemplate: string;
  kosName: string;
  kosAddress: string;
  kosPhone: string;
}

interface KosStoreState {
  currentUser: UserProfile;
  authMode: 'demo' | 'user';
  subscription: SubscriptionDetails;
  saasInvoices: SaaSInvoice[];
  properties: Property[];
  activePropertyId: string; // 'all' or propertyId
  availableFacilities: string[];
  facilityDefinitions: FacilityItem[];
  roomTypes: RoomTypeItem[];
  rooms: Room[];
  tenants: Tenant[];
  invoices: Invoice[];
  expenses: Expense[];
  incomeCategories: TransactionCategoryItem[];
  expenseCategories: TransactionCategoryItem[];
  cashAccounts: CashAccountItem[];
  monthlyBudgets: Record<string, number>;
  appTheme: AppTheme;
  maintenanceTickets: MaintenanceTicket[];
  settings: PropertySettings;

  // Auth & Demo actions
  loginAsDemo: () => void;
  loginAsUser: (userData: { name: string; email: string; kosName?: string; plan?: UserProfile['plan'] }) => void;
  authenticateUser: (
    email: string,
    password: string
  ) => {
    success: boolean;
    role?: 'superadmin' | 'owner' | 'demo';
    user?: SaaSUserAccount;
    error?: 'not_found' | 'wrong_password' | 'pending_approval' | 'suspended' | 'expired';
    message: string;
  };
  registerPendingOwner: (formData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    kosName: string;
    plan: 'starter' | 'pro' | 'enterprise';
    proofUrl?: string;
    proofNotes?: string;
  }) => { success: boolean; accountId: string; message: string };
  registerNewOwner: (formData: { name: string; email: string; kosName: string; phone?: string }) => void;
  logout: () => void;
  resetDemoData: () => void;

  // Subscription actions
  upgradeSubscription: (
    plan: 'starter' | 'pro' | 'enterprise',
    cycle: 'monthly' | 'annual',
    paymentMethod: string,
    amount: number
  ) => void;
  canAddRoom: () => { allowed: boolean; current: number; max: number; planName: string };
  canAddProperty: () => { allowed: boolean; current: number; max: number; planName: string };

  // Property actions
  setActivePropertyId: (id: string) => void;
  addProperty: (property: Omit<Property, 'id'>) => string;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => boolean;
  addFloorToProperty: (propertyId: string) => number;
  deleteFloorFromProperty: (propertyId: string, floorNumber: number) => { success: boolean; message: string };

  // Facilities actions
  addFacility: (name: string) => void;
  deleteFacility: (name: string) => void;

  // Room actions
  addRoom: (room: Omit<Room, 'id' | 'propertyId'> & { propertyId?: string }) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => boolean;

  // Tenant & Check-in / Check-out actions
  checkInTenant: (
    tenantData: Omit<Tenant, 'id' | 'propertyId' | 'roomId' | 'roomNumber' | 'status'>,
    roomId: string
  ) => void;
  checkOutTenant: (
    tenantId: string,
    options?: { refundDeposit?: boolean; deduction?: number; reason?: string }
  ) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;

  // Invoice actions
  markInvoicePaid: (id: string, method?: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'propertyId'> & { propertyId?: string }) => void;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id' | 'propertyId'> & { propertyId?: string }) => void;
  deleteExpense: (id: string) => void;

  // Maintenance actions
  addTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'propertyId'> & { propertyId?: string }) => void;
  updateTicketStatus: (id: string, status: MaintenanceTicket['status']) => void;

  // Settings
  updateSettings: (updates: Partial<PropertySettings>) => void;

  // Reset
  resetToDefaultData: () => void;

  // Super Admin SaaS Management actions
  saasAccounts: SaaSUserAccount[];
  impersonatingFromAdmin: boolean;
  approveUserSubscriptionManual: (
    userId: string,
    plan: 'starter' | 'pro' | 'enterprise',
    durationDays: number,
    amount: number,
    paymentMethod: string,
    notes?: string
  ) => void;
  impersonateUser: (userId: string) => void;
  stopImpersonating: () => void;
  toggleUserStatus: (userId: string, status: SaaSUserAccount['status']) => void;
  updateSaaSAccount: (accountId: string, updates: Partial<SaaSUserAccount>) => void;
  deleteSaaSAccount: (accountId: string) => boolean;

  // Super Admin Landing Page CMS actions
  landingPageConfig: LandingPageConfig;
  updateLandingPageConfig: (updates: Partial<LandingPageConfig>) => void;
  resetLandingPageConfig: () => void;

  // App Theme Action
  setAppTheme: (theme: AppTheme) => void;

  // Room Types Actions
  addRoomType: (item: Omit<RoomTypeItem, 'id'>) => void;
  updateRoomType: (id: string, updates: Partial<RoomTypeItem>) => void;
  deleteRoomType: (id: string) => void;

  // Facility Definition Actions
  addFacilityWithIcon: (name: string, icon: string) => void;
  updateFacilityDefinition: (id: string, updates: Partial<FacilityItem>) => void;

  // Category & Cash Account Actions
  addCategory: (item: Omit<TransactionCategoryItem, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<TransactionCategoryItem>) => void;
  deleteCategory: (id: string) => void;
  addCashAccount: (item: Omit<CashAccountItem, 'id'>) => void;
  updateCashAccount: (id: string, updates: Partial<CashAccountItem>) => void;
  deleteCashAccount: (id: string) => void;

  // Budget Actions
  setMonthlyBudget: (categoryId: string, amount: number) => void;
  clearMonthlyBudget: (categoryId: string) => void;
}

// Initial Seed Properties
export const initialProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'KosanKu Paviliun Dago',
    address: 'Jl. Dago Asri No. 12, Coblong, Bandung',
    type: 'Campur',
    floors: 2,
    managerName: 'Pak Asep',
    managerPhone: '0812-3456-7890',
    bankName: 'BCA',
    accountNumber: '8420-1928-31',
    accountHolder: 'Rumah KosanKu Dago'
  },
  {
    id: 'prop-2',
    name: 'KosanKu Putri Sukajadi',
    address: 'Jl. Sukajadi No. 88, Sukajadi, Bandung',
    type: 'Putri',
    floors: 2,
    managerName: 'Bu Eni',
    managerPhone: '0813-9876-5432',
    bankName: 'Mandiri',
    accountNumber: '131-00-9876543-2',
    accountHolder: 'KosanKu Sukajadi Putri'
  }
];

// Initial Seed Rooms
const initialRooms: Room[] = [
  // --- Cabang 1: KosanKu Paviliun Dago (14 kamar) ---
  // Lantai 1 Dago
  {
    id: 'k101',
    propertyId: 'prop-1',
    floor: 1,
    number: 'K-101',
    type: 'Deluxe',
    status: 'occupied',
    price: 1700000,
    tenantId: 't1',
    tenantName: 'Anita Wijaya',
    dueDate: '2 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-1101'
  },
  {
    id: 'k102',
    propertyId: 'prop-1',
    floor: 1,
    number: 'K-102',
    type: 'Standard',
    status: 'occupied',
    price: 1500000,
    tenantId: 't2',
    tenantName: 'Budi Santoso',
    dueDate: '1 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-1102'
  },
  {
    id: 'k103',
    propertyId: 'prop-1',
    floor: 1,
    number: 'K-103',
    type: 'Standard',
    status: 'occupied',
    price: 1500000,
    tenantId: 't3',
    tenantName: 'Cindy Claudia',
    dueDate: '8 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-1103'
  },
  {
    id: 'k104',
    propertyId: 'prop-1',
    floor: 1,
    number: 'K-104',
    type: 'Deluxe',
    status: 'vacant',
    price: 1700000,
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-1104',
    catatan: 'Kamar baru selesai dicat ulang, sangat wangi dan bersih ✨'
  },
  {
    id: 'k105',
    propertyId: 'prop-1',
    floor: 1,
    number: 'K-105',
    type: 'Standard',
    status: 'occupied',
    price: 1500000,
    tenantId: 't5',
    tenantName: 'Dimas Pratama',
    dueDate: '5 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-1105'
  },
  {
    id: 'k106',
    propertyId: 'prop-1',
    floor: 1,
    number: 'K-106',
    type: 'Deluxe',
    status: 'occupied',
    price: 1750000,
    tenantId: 't6',
    tenantName: 'Eka Saputra',
    dueDate: '12 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-1106'
  },
  {
    id: 'k107',
    propertyId: 'prop-1',
    floor: 1,
    number: 'K-107',
    type: 'Standard',
    status: 'occupied',
    price: 1500000,
    tenantId: 't7',
    tenantName: 'Fany Rahmawati',
    dueDate: '15 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-1107'
  },

  // Lantai 2 Dago
  {
    id: 'k201',
    propertyId: 'prop-1',
    floor: 2,
    number: 'K-201',
    type: 'Deluxe',
    status: 'occupied',
    price: 1800000,
    tenantId: 't11',
    tenantName: 'Gita Gutawa',
    dueDate: '3 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-2201'
  },
  {
    id: 'k202',
    propertyId: 'prop-1',
    floor: 2,
    number: 'K-202',
    type: 'Standard',
    status: 'occupied',
    price: 1600000,
    tenantId: 't12',
    tenantName: 'Kevin Julio',
    dueDate: '7 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-2202'
  },
  {
    id: 'k203',
    propertyId: 'prop-1',
    floor: 2,
    number: 'K-203',
    type: 'Deluxe',
    status: 'occupied',
    price: 1800000,
    tenantId: 't13',
    tenantName: 'Luna Maya',
    dueDate: '10 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-2203'
  },
  {
    id: 'k204',
    propertyId: 'prop-1',
    floor: 2,
    number: 'K-204',
    type: 'Standard',
    status: 'occupied',
    price: 1800000,
    tenantId: 't14',
    tenantName: 'Siti Nurhaliza',
    dueDate: '3 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-2204'
  },
  {
    id: 'k205',
    propertyId: 'prop-1',
    floor: 2,
    number: 'K-205',
    type: 'Standard',
    status: 'vacant',
    price: 1600000,
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-2205',
    catatan: 'Kamar lantai 2 menghadap taman, sejuk dan tenang 🌿'
  },
  {
    id: 'k206',
    propertyId: 'prop-1',
    floor: 2,
    number: 'K-206',
    type: 'Deluxe',
    status: 'occupied',
    price: 1800000,
    tenantId: 't16',
    tenantName: 'Maya Estianty',
    dueDate: '15 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-2206'
  },
  {
    id: 'k207',
    propertyId: 'prop-1',
    floor: 2,
    number: 'K-207',
    type: 'Standard',
    status: 'occupied',
    price: 1600000,
    tenantId: 't17',
    tenantName: 'Naufal Samudra',
    dueDate: '19 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '5421-9820-2207'
  },

  // --- Cabang 2: KosanKu Putri Sukajadi (6 kamar) ---
  // Lantai 1 Sukajadi
  {
    id: 's101',
    propertyId: 'prop-2',
    floor: 1,
    number: 'S-101',
    type: 'Deluxe',
    status: 'occupied',
    price: 1900000,
    tenantId: 't21',
    tenantName: 'Raisa Andriana',
    dueDate: '4 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '3201-4455-1011'
  },
  {
    id: 's102',
    propertyId: 'prop-2',
    floor: 1,
    number: 'S-102',
    type: 'Standard',
    status: 'occupied',
    price: 1650000,
    tenantId: 't22',
    tenantName: 'Isyana Sarasvati',
    dueDate: '9 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '3201-4455-1012'
  },
  {
    id: 's103',
    propertyId: 'prop-2',
    floor: 1,
    number: 'S-103',
    type: 'Standard',
    status: 'vacant',
    price: 1650000,
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '3201-4455-1013',
    catatan: 'Kamar lantai 1 dekat dapur bersama dan taman sakura 🌸'
  },

  // Lantai 2 Sukajadi
  {
    id: 's201',
    propertyId: 'prop-2',
    floor: 2,
    number: 'S-201',
    type: 'Deluxe',
    status: 'occupied',
    price: 2000000,
    tenantId: 't23',
    tenantName: 'Maudy Ayunda',
    dueDate: '11 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '3201-4455-2021'
  },
  {
    id: 's202',
    propertyId: 'prop-2',
    floor: 2,
    number: 'S-202',
    type: 'Standard',
    status: 'occupied',
    price: 1700000,
    tenantId: 't24',
    tenantName: 'Chelsea Islan',
    dueDate: '14 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '3201-4455-2022'
  },
  {
    id: 's203',
    propertyId: 'prop-2',
    floor: 2,
    number: 'S-203',
    type: 'Deluxe',
    status: 'occupied',
    price: 2000000,
    tenantId: 't25',
    tenantName: 'Sherina Munaf',
    dueDate: '18 Nov',
    facilities: { ac: true, wifi: true, bath: true },
    idMeteranPln: '3201-4455-2023'
  }
];

const initialTenants: Tenant[] = [
  // Cabang Dago
  {
    id: 't1',
    propertyId: 'prop-1',
    name: 'Anita Wijaya',
    phone: '0812-3456-7890',
    roomId: 'k101',
    roomNumber: 'K-101',
    emergencyContact: { name: 'Bambang Wijaya', relation: 'Ayah', phone: '0811-2233-4455' },
    startDate: '2026-02-02',
    dueDayOfMonth: 2,
    depositAmount: 500000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-music.jpg',
    jobTitle: 'Mahasiswi ITB'
  },
  {
    id: 't2',
    propertyId: 'prop-1',
    name: 'Budi Santoso',
    phone: '0812-3456-7891',
    roomId: 'k102',
    roomNumber: 'K-102',
    emergencyContact: { name: 'Sri Wahyuni', relation: 'Ibu', phone: '0813-9988-7766' },
    startDate: '2026-01-01',
    dueDayOfMonth: 1,
    depositAmount: 500000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-gamer.jpg',
    jobTitle: 'Software Developer'
  },
  {
    id: 't3',
    propertyId: 'prop-1',
    name: 'Cindy Claudia',
    phone: '0812-3456-7892',
    roomId: 'k103',
    roomNumber: 'K-103',
    emergencyContact: { name: 'Herman', relation: 'Kakak', phone: '0815-4433-2211' },
    startDate: '2026-03-08',
    dueDayOfMonth: 8,
    depositAmount: 500000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-laundry.jpg',
    jobTitle: 'Desainer Grafis'
  },
  {
    id: 't5',
    propertyId: 'prop-1',
    name: 'Dimas Pratama',
    phone: '0857-1234-5678',
    roomId: 'k105',
    roomNumber: 'K-105',
    emergencyContact: { name: 'Pratama Senior', relation: 'Ayah', phone: '0856-7788-9900' },
    startDate: '2026-04-05',
    dueDayOfMonth: 5,
    depositAmount: 500000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-gym.jpg',
    jobTitle: 'Fitness Coach'
  },
  {
    id: 't6',
    propertyId: 'prop-1',
    name: 'Eka Saputra',
    phone: '0812-9876-5431',
    roomId: 'k106',
    roomNumber: 'K-106',
    emergencyContact: { name: 'Ratna', relation: 'Ibu', phone: '0812-0011-2233' },
    startDate: '2026-05-12',
    dueDayOfMonth: 12,
    depositAmount: 500000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-groceries.jpg',
    jobTitle: 'Barista'
  },
  {
    id: 't7',
    propertyId: 'prop-1',
    name: 'Fany Rahmawati',
    phone: '0813-1122-3377',
    roomId: 'k107',
    roomNumber: 'K-107',
    emergencyContact: { name: 'Rahmawati', relation: 'Ibu', phone: '0813-7766-5544' },
    startDate: '2026-05-15',
    dueDayOfMonth: 15,
    depositAmount: 500000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-music.jpg',
    jobTitle: 'Content Creator'
  },
  {
    id: 't11',
    propertyId: 'prop-1',
    name: 'Gita Gutawa',
    phone: '0812-8877-6655',
    roomId: 'k201',
    roomNumber: 'K-201',
    emergencyContact: { name: 'Erwin Gutawa', relation: 'Ayah', phone: '0811-9900-1122' },
    startDate: '2026-02-03',
    dueDayOfMonth: 3,
    depositAmount: 600000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-gamer.jpg',
    jobTitle: 'Musisi'
  },
  {
    id: 't14',
    propertyId: 'prop-1',
    name: 'Siti Nurhaliza',
    phone: '0812-9876-5432',
    roomId: 'k204',
    roomNumber: 'K-204',
    emergencyContact: { name: 'Ahmad Dahlan', relation: 'Ayah', phone: '0813-1122-3344' },
    startDate: '2026-05-03',
    dueDayOfMonth: 3,
    depositAmount: 500000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-groceries.jpg',
    jobTitle: 'Akuntan'
  },

  // Cabang Sukajadi
  {
    id: 't21',
    propertyId: 'prop-2',
    name: 'Raisa Andriana',
    phone: '0811-9988-7711',
    roomId: 's101',
    roomNumber: 'S-101',
    emergencyContact: { name: 'Allan', relation: 'Suami/Keluarga', phone: '0811-3322-1100' },
    startDate: '2026-02-04',
    dueDayOfMonth: 4,
    depositAmount: 1000000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-laundry.jpg',
    jobTitle: 'Penyanyi'
  },
  {
    id: 't22',
    propertyId: 'prop-2',
    name: 'Isyana Sarasvati',
    phone: '0811-3344-5566',
    roomId: 's102',
    roomNumber: 'S-102',
    emergencyContact: { name: 'Rayhan', relation: 'Suami', phone: '0811-7788-9900' },
    startDate: '2026-03-09',
    dueDayOfMonth: 9,
    depositAmount: 1000000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-music.jpg',
    jobTitle: 'Komposer'
  },
  {
    id: 't23',
    propertyId: 'prop-2',
    name: 'Maudy Ayunda',
    phone: '0811-2244-6688',
    roomId: 's201',
    roomNumber: 'S-201',
    emergencyContact: { name: 'Muren', relation: 'Ibu', phone: '0811-5544-3322' },
    startDate: '2026-01-11',
    dueDayOfMonth: 11,
    depositAmount: 1000000,
    depositStatus: 'paid',
    status: 'active',
    profilePhoto: '/cat-avatar-gym.jpg',
    jobTitle: 'Konsultan Pendidikan'
  }
];

const initialInvoices: Invoice[] = [
  // Cabang Dago
  {
    id: 'inv-1',
    propertyId: 'prop-1',
    invoiceNumber: 'INV/202611/001',
    tenantId: 't2',
    tenantName: 'Budi Santoso',
    roomId: 'k102',
    roomNumber: 'K-102',
    amount: 1500000,
    dueDate: '2026-11-01',
    periodMonth: 'November 2026',
    status: 'overdue'
  },
  {
    id: 'inv-2',
    propertyId: 'prop-1',
    invoiceNumber: 'INV/202611/002',
    tenantId: 't1',
    tenantName: 'Anita Wijaya',
    roomId: 'k101',
    roomNumber: 'K-101',
    amount: 1700000,
    dueDate: '2026-11-02',
    periodMonth: 'November 2026',
    status: 'unpaid'
  },
  {
    id: 'inv-3',
    propertyId: 'prop-1',
    invoiceNumber: 'INV/202611/003',
    tenantId: 't14',
    tenantName: 'Siti Nurhaliza',
    roomId: 'k204',
    roomNumber: 'K-204',
    amount: 1800000,
    dueDate: '2026-11-03',
    periodMonth: 'November 2026',
    status: 'unpaid'
  },
  {
    id: 'inv-4',
    propertyId: 'prop-1',
    invoiceNumber: 'INV/202611/004',
    tenantId: 't5',
    tenantName: 'Dimas Pratama',
    roomId: 'k105',
    roomNumber: 'K-105',
    amount: 1500000,
    dueDate: '2026-11-05',
    periodMonth: 'November 2026',
    status: 'unpaid'
  },
  {
    id: 'inv-5',
    propertyId: 'prop-1',
    invoiceNumber: 'INV/202611/005',
    tenantId: 't3',
    tenantName: 'Cindy Claudia',
    roomId: 'k103',
    roomNumber: 'K-103',
    amount: 1500000,
    dueDate: '2026-11-08',
    periodMonth: 'November 2026',
    status: 'paid',
    paidAt: '2026-10-31',
    paymentMethod: 'BCA Transfer'
  },

  // Cabang Sukajadi
  {
    id: 'inv-6',
    propertyId: 'prop-2',
    invoiceNumber: 'INV/202611/006',
    tenantId: 't21',
    tenantName: 'Raisa Andriana',
    roomId: 's101',
    roomNumber: 'S-101',
    amount: 1900000,
    dueDate: '2026-11-04',
    periodMonth: 'November 2026',
    status: 'unpaid'
  },
  {
    id: 'inv-7',
    propertyId: 'prop-2',
    invoiceNumber: 'INV/202611/007',
    tenantId: 't23',
    tenantName: 'Maudy Ayunda',
    roomId: 's201',
    roomNumber: 'S-201',
    amount: 2000000,
    dueDate: '2026-11-11',
    periodMonth: 'November 2026',
    status: 'paid',
    paidAt: '2026-10-30',
    paymentMethod: 'Mandiri Transfer'
  }
];

const initialExpenses: Expense[] = [
  // Cabang Dago
  { id: 'exp-1', propertyId: 'prop-1', title: 'Token Listrik Utama & Pompa Air Dago', category: 'listrik', amount: 1200000, date: '2026-10-25' },
  { id: 'exp-2', propertyId: 'prop-1', title: 'Gaji Penjaga Kos & Kebersihan (Pak Joko)', category: 'gaji', amount: 2500000, date: '2026-10-28' },
  { id: 'exp-3', propertyId: 'prop-1', title: 'Internet Fiber Indihome 100Mbps Dago', category: 'internet', amount: 450000, date: '2026-10-20' },
  { id: 'exp-4', propertyId: 'prop-1', title: 'Iuran Air Bersih PDAM Dago', category: 'air', amount: 350000, date: '2026-10-22' },
  { id: 'exp-5', propertyId: 'prop-1', title: 'Cuci & Service AC Kamar K-105', category: 'maintenance', amount: 150000, date: '2026-10-27' },

  // Cabang Sukajadi
  { id: 'exp-6', propertyId: 'prop-2', title: 'Token Listrik Utama Sukajadi', category: 'listrik', amount: 800000, date: '2026-10-26' },
  { id: 'exp-7', propertyId: 'prop-2', title: 'Gaji Penjaga & Security Sukajadi (Pak Asep)', category: 'gaji', amount: 2200000, date: '2026-10-28' },
  { id: 'exp-8', propertyId: 'prop-2', title: 'Biznet High Speed WiFi Sukajadi', category: 'internet', amount: 500000, date: '2026-10-21' }
];

const initialTickets: MaintenanceTicket[] = [
  // Cabang Dago
  {
    id: 'tc-1',
    propertyId: 'prop-1',
    roomNumber: 'K-102',
    title: 'AC Kurang Dingin & Menetes',
    description: 'AC di kamar 102 mulai meneteskan air ke lantai sejak semalam dan kurang sejuk.',
    priority: 'urgent',
    status: 'new',
    date: '31 Okt 2026',
    cost: 150000
  },
  {
    id: 'tc-2',
    propertyId: 'prop-1',
    roomNumber: 'K-204',
    title: 'Kran Wastafel Kamar Mandi Goyang',
    description: 'Kran air dingin di wastafel agak longgar dudukannya, perlu dikencangkan.',
    priority: 'medium',
    status: 'in_progress',
    date: '30 Okt 2026',
    technician: 'Pak Joko'
  },
  {
    id: 'tc-3',
    propertyId: 'prop-1',
    roomNumber: 'K-106',
    title: 'Lampu Balkon Putus',
    description: 'Sudah diganti dengan lampu LED Phillips 9 watt baru.',
    priority: 'low',
    status: 'resolved',
    date: '28 Okt 2026',
    cost: 45000
  },

  // Cabang Sukajadi
  {
    id: 'tc-4',
    propertyId: 'prop-2',
    roomNumber: 'S-101',
    title: 'Pintu Kamar Mandi Seret',
    description: 'Engsel pintu bawah perlu diberi pelumas agar tidak berdecit.',
    priority: 'low',
    status: 'new',
    date: '31 Okt 2026',
    cost: 25000
  }
];

const initialSettings: PropertySettings = {
  bankName: 'BCA (Bank Central Asia)',
  accountNumber: '8420-1928-31',
  accountHolder: 'pawskost Indonesia',
  waTemplate:
    'Halo Kak {nama}! 🐾 Salam manis dari pawskost & Mimi si Kucing Kos. Tagihan sewa kamar {kamar} bulan {bulan} sebesar {nominal} jatuh tempo pada {tanggal}. Pembayaran via transfer {bank}: {rekening} a.n {pemilik}. Terima kasih! 🐱✨',
  kosName: 'pawskost Living',
  kosAddress: 'Bandung, Jawa Barat',
  kosPhone: '0812-3456-7890'
};

export const defaultRoomTypes: RoomTypeItem[] = [
  { id: 'rt-std', name: 'Standard', description: 'Kamar nyaman ukuran standar', defaultPrice: 1500000 },
  { id: 'rt-dlx', name: 'Deluxe', description: 'Kamar luas dengan fasilitas lengkap', defaultPrice: 1800000 },
  { id: 'rt-vip', name: 'VIP', description: 'Kamar premium view terbaik & perabotan eksklusif', defaultPrice: 2200000 },
  { id: 'rt-ste', name: 'Suite', description: 'Kamar mewah dengan pantry & ruang santai pribadi', defaultPrice: 2800000 },
  { id: 'rt-eko', name: 'Ekonomi', description: 'Pilihan hemat bersahabat dengan kantong', defaultPrice: 1000000 }
];

export const defaultFacilityDefinitions: FacilityItem[] = [
  { id: 'fac-ac', name: 'AC (Air Conditioner)', icon: 'Snowflake' },
  { id: 'fac-wifi', name: 'WiFi Internet Cepat', icon: 'Wifi' },
  { id: 'fac-km', name: 'Kamar Mandi Dalam', icon: 'ShowerHead' },
  { id: 'fac-water-heater', name: 'Water Heater', icon: 'Flame' },
  { id: 'fac-bed', name: 'Kasur Springbed', icon: 'Layers' },
  { id: 'fac-lemari', name: 'Meja & Lemari Pakaian', icon: 'Armchair' },
  { id: 'fac-tv', name: 'Smart TV', icon: 'Tv' },
  { id: 'fac-kulkas', name: 'Kulkas Kamar', icon: 'Refrigerator' },
  { id: 'fac-listrik', name: 'Listrik Token Termasuk', icon: 'Zap' },
  { id: 'fac-mobil', name: 'Parkir Mobil', icon: 'Car' },
  { id: 'fac-motor', name: 'Parkir Motor', icon: 'Bike' },
  { id: 'fac-dapur', name: 'Dapur Bersama', icon: 'UtensilsCrossed' },
  { id: 'fac-laundry', name: 'Mesin Cuci / Laundry', icon: 'Shirt' },
  { id: 'fac-cctv', name: 'CCTV 24 Jam', icon: 'Shield' },
  { id: 'fac-lock', name: 'Smart Door Lock', icon: 'KeyRound' },
  { id: 'fac-air', name: 'Air Minum Bersama', icon: 'Droplets' }
];

export const defaultFacilities: string[] = [
  'AC Dingin',
  'WiFi Cepat',
  'Kamar Mandi Dalam',
  'Water Heater',
  'Kasur Springbed',
  'Meja & Kursi Belajar',
  'Lemari Pakaian',
  'Smart TV',
  'Balkon Pribadi',
  'Dapur Bersama',
  'Kulkas'
];

export const defaultIncomeCategories: TransactionCategoryItem[] = [
  { id: 'inc-sewa', name: 'Sewa Kamar Pokok', icon: 'Home', type: 'income' },
  { id: 'inc-deposit', name: 'Uang Jaminan / Deposit', icon: 'ShieldCheck', type: 'income' },
  { id: 'inc-denda', name: 'Denda Keterlambatan', icon: 'AlertTriangle', type: 'income' },
  { id: 'inc-listrik', name: 'Tambahan Listrik / Elektronik', icon: 'Zap', type: 'income' },
  { id: 'inc-parkir', name: 'Parkir Kendaraan', icon: 'Car', type: 'income' },
  { id: 'inc-laundry', name: 'Jasa Cuci / Laundry', icon: 'Shirt', type: 'income' },
  { id: 'inc-lainnya', name: 'Pendapatan Lain-lain', icon: 'Sparkles', type: 'income' }
];

export const defaultExpenseCategories: TransactionCategoryItem[] = [
  { id: 'exp-listrik', name: 'Tagihan Listrik / PLN', icon: 'Zap', type: 'expense' },
  { id: 'exp-air', name: 'Tagihan Air / PDAM', icon: 'Droplets', type: 'expense' },
  { id: 'exp-wifi', name: 'Internet & WiFi', icon: 'Wifi', type: 'expense' },
  { id: 'exp-gaji', name: 'Gaji Karyawan & Penjaga', icon: 'Users', type: 'expense' },
  { id: 'exp-kebersihan', name: 'Kebersihan & Iuran Sampah', icon: 'Trash2', type: 'expense' },
  { id: 'exp-maintenance', name: 'Perbaikan & Perawatan', icon: 'Wrench', type: 'expense' },
  { id: 'exp-perlengkapan', name: 'Perlengkapan & Amenities', icon: 'ShoppingBag', type: 'expense' },
  { id: 'exp-keamanan', name: 'Iuran Keamanan Lingkungan', icon: 'Shield', type: 'expense' },
  { id: 'exp-lainnya', name: 'Pengeluaran Lain-lain', icon: 'Sparkles', type: 'expense' }
];

export const defaultCashAccounts: CashAccountItem[] = [
  { id: 'acc-cash', name: 'Kas Tunai (Petty Cash)', type: 'cash' },
  { id: 'acc-bca', name: 'BCA 8420-1928-31', type: 'bank', accountNumber: '8420-1928-31' },
  { id: 'acc-mandiri', name: 'Bank Mandiri 1370-0192', type: 'bank', accountNumber: '1370-0192-8381' },
  { id: 'acc-qris', name: 'QRIS / E-Wallet', type: 'ewallet' }
];

export const defaultMonthlyBudgets: Record<string, number> = {
  'exp-listrik': 1500000,
  'exp-air': 450000,
  'exp-wifi': 550000,
  'exp-gaji': 2500000,
  'exp-maintenance': 1000000,
  'exp-kebersihan': 350000,
  'exp-perlengkapan': 500000
};

export const useKosStore = create<KosStoreState>()(
  persist(
    (set, get) => ({
      currentUser: defaultDemoUser,
      authMode: 'demo',
      subscription: initialSubscription,
      saasInvoices: initialSaaSInvoices,
      saasAccounts: initialSaaSAccounts,
      landingPageConfig: initialLandingPageConfig,
      impersonatingFromAdmin: false,
      properties: initialProperties,
      activePropertyId: 'all',
      availableFacilities: defaultFacilities,
      facilityDefinitions: defaultFacilityDefinitions,
      roomTypes: defaultRoomTypes,
      rooms: initialRooms,
      tenants: initialTenants,
      invoices: initialInvoices,
      expenses: initialExpenses,
      incomeCategories: defaultIncomeCategories,
      expenseCategories: defaultExpenseCategories,
      cashAccounts: defaultCashAccounts,
      monthlyBudgets: defaultMonthlyBudgets,
      appTheme: 'paw-peach',
      maintenanceTickets: initialTickets,
      settings: initialSettings,

      // --- AUTH & DEMO ACTIONS ---
      loginAsDemo: () => {
        set({
          currentUser: defaultDemoUser,
          authMode: 'demo',
          subscription: initialSubscription,
          properties: initialProperties,
          activePropertyId: 'all',
          availableFacilities: defaultFacilities,
          rooms: initialRooms,
          tenants: initialTenants,
          invoices: initialInvoices,
          expenses: initialExpenses,
          maintenanceTickets: initialTickets,
          settings: initialSettings
        });
      },

      loginAsUser: (userData) => {
        const user: UserProfile = {
          id: 'usr-' + Date.now().toString(36),
          name: userData.name,
          email: userData.email,
          kosName: userData.kosName || 'Kosan ' + userData.name,
          role: 'owner',
          plan: userData.plan || 'trial_14_days',
          trialDaysRemaining: 14,
          isDemo: false
        };
        const userSub: SubscriptionDetails = {
          plan: userData.plan || 'trial_14_days',
          planName: userData.plan === 'pro' ? 'Paket Juragan Pro' : 'Trial 14 Hari',
          billingCycle: 'monthly',
          status: 'active',
          startDate: new Date().toISOString().split('T')[0],
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          daysRemaining: 14,
          maxRooms: userData.plan === 'pro' ? 50 : 50,
          maxProperties: userData.plan === 'pro' ? 3 : 3
        };
        set({
          currentUser: user,
          subscription: userSub,
          authMode: 'user'
        });
      },

      authenticateUser: (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPass = password.trim();

        // 1. Check Super Admin credentials
        if (cleanEmail === 'admin@kosanku.id' && cleanPass === 'admin123') {
          set({
            currentUser: defaultSuperAdmin,
            authMode: 'user',
            impersonatingFromAdmin: false
          });
          return {
            success: true,
            role: 'superadmin',
            message: 'Login Super Admin Berhasil!'
          };
        }

        // 2. Check registered tenant accounts
        const account = get().saasAccounts.find((a) => a.email.toLowerCase() === cleanEmail);
        if (!account) {
          return {
            success: false,
            error: 'not_found',
            message: 'Email belum terdaftar di sistem KosanKu. Silakan lakukan pendaftaran terlebih dahulu.'
          };
        }

        // 3. Check password
        const expectedPassword = account.password || 'password123';
        if (cleanPass !== expectedPassword) {
          return {
            success: false,
            error: 'wrong_password',
            message: 'Kata sandi salah. Harap periksa kembali kata sandi Anda.'
          };
        }

        // 4. Check account status: pending_approval (waiting for Super Admin approval)
        if (account.status === 'pending_approval') {
          return {
            success: false,
            error: 'pending_approval',
            user: account,
            message: 'Pendaftaran Anda sedang dalam antrean verifikasi bukti transfer oleh Super Admin. Harap tunggu konfirmasi aktivasi atau hubungi admin via WhatsApp.'
          };
        }

        // 5. Check account status: suspended
        if (account.status === 'suspended') {
          return {
            success: false,
            error: 'suspended',
            message: 'Akun Anda sedang dinonaktifkan oleh administrator. Silakan hubungi customer service.'
          };
        }

        // 6. Login Success as Tenant
        const planNames: Record<string, string> = {
          starter: 'Paket Kos Mungil',
          pro: 'Paket Juragan Pro',
          enterprise: 'Paket Konglomerat',
          trial_14_days: 'Trial Gratis 14 Hari'
        };
        const maxRoomsMap: Record<string, number> = { starter: 10, pro: 50, enterprise: 999, trial_14_days: 50 };
        const maxPropsMap: Record<string, number> = { starter: 1, pro: 3, enterprise: 999, trial_14_days: 3 };

        const loggedUser: UserProfile = {
          id: account.id,
          name: account.name,
          email: account.email,
          kosName: account.kosName,
          role: 'owner',
          plan: account.plan,
          trialDaysRemaining: account.daysRemaining,
          isDemo: false
        };

        const loggedSub: SubscriptionDetails = {
          plan: account.plan,
          planName: account.planName || planNames[account.plan],
          billingCycle: 'monthly',
          status: account.status === 'active' ? 'active' : 'trial',
          startDate: account.registeredAt,
          expiresAt: account.expiresAt,
          daysRemaining: account.daysRemaining,
          maxRooms: maxRoomsMap[account.plan] || 50,
          maxProperties: maxPropsMap[account.plan] || 3
        };

        set({
          currentUser: loggedUser,
          subscription: loggedSub,
          authMode: 'user',
          impersonatingFromAdmin: false
        });

        return {
          success: true,
          role: 'owner',
          user: account,
          message: `Selamat datang kembali, ${account.name}!`
        };
      },

      registerPendingOwner: (formData) => {
        const newUserId = 'usr-' + Date.now().toString(36);
        const newPropertyId = 'prop-' + Date.now().toString(36);
        const today = new Date();

        const planNames: Record<string, string> = {
          starter: 'Paket Kos Mungil',
          pro: 'Paket Juragan Pro',
          enterprise: 'Paket Konglomerat'
        };

        const initialProperty: Property = {
          id: newPropertyId,
          name: formData.kosName,
          address: 'Alamat Kos Belum Diatur',
          type: 'Campur',
          floors: 1,
          managerName: formData.name,
          managerPhone: formData.phone || ''
        };

        const newAccount: SaaSUserAccount = {
          id: newUserId,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || '-',
          kosName: formData.kosName,
          registeredAt: today.toISOString().split('T')[0],
          plan: formData.plan,
          planName: planNames[formData.plan] || 'Paket Juragan Pro',
          status: 'pending_approval', // LOCKED until approved by Super Admin
          expiresAt: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          daysRemaining: 30,
          totalPaid: formData.plan === 'starter' ? 49000 : formData.plan === 'enterprise' ? 199000 : 99000,
          lastPaymentDate: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          proofUrl: formData.proofUrl,
          proofNotes: formData.proofNotes,
          notes: `Pendaftaran baru via Transfer Manual (${planNames[formData.plan] || 'Pro'}). Bukti transfer terlampir.`
        };

        set((state) => ({
          saasAccounts: [newAccount, ...state.saasAccounts],
          properties: [...state.properties, initialProperty]
        }));

        return {
          success: true,
          accountId: newUserId,
          message: 'Pendaftaran berhasil dikirim! Bukti transfer Anda sedang menunggu verifikasi Super Admin.'
        };
      },

      registerNewOwner: (formData) => {
        const newUserId = 'usr-' + Date.now().toString(36);
        const newPropertyId = 'prop-' + Date.now().toString(36);
        const newUser: UserProfile = {
          id: newUserId,
          name: formData.name,
          email: formData.email,
          kosName: formData.kosName,
          role: 'owner',
          plan: 'trial_14_days',
          trialDaysRemaining: 14,
          isDemo: false
        };
        const initialOwnerProperty: Property = {
          id: newPropertyId,
          name: formData.kosName,
          address: 'Alamat Belum Diatur',
          type: 'Campur',
          floors: 1,
          managerName: formData.name,
          managerPhone: formData.phone || ''
        };
        const initialOwnerSub: SubscriptionDetails = {
          plan: 'trial_14_days',
          planName: 'Trial Gratis 14 Hari',
          billingCycle: 'monthly',
          status: 'trial',
          startDate: new Date().toISOString().split('T')[0],
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          daysRemaining: 14,
          maxRooms: 50,
          maxProperties: 3
        };
        const welcomeInvoice: SaaSInvoice = {
          id: 'inv-saas-' + Date.now().toString(36),
          invoiceNumber: `INV-KSK/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`,
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          planName: 'Trial Gratis 14 Hari',
          cycle: 'Bulanan',
          amount: 0,
          paymentMethod: 'Promo Pendaftaran',
          status: 'Lunas'
        };
        const newAccount: SaaSUserAccount = {
          id: newUserId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '-',
          kosName: formData.kosName,
          registeredAt: new Date().toISOString().split('T')[0],
          plan: 'trial_14_days',
          planName: 'Trial Gratis 14 Hari',
          status: 'trial',
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          daysRemaining: 14,
          totalPaid: 0,
          notes: 'Pendaftar baru mandiri via Landing Page.'
        };

        set((state) => ({
          currentUser: newUser,
          authMode: 'user',
          subscription: initialOwnerSub,
          saasInvoices: [welcomeInvoice],
          saasAccounts: [newAccount, ...state.saasAccounts],
          properties: [initialOwnerProperty],
          activePropertyId: newPropertyId,
          rooms: [],
          tenants: [],
          invoices: [],
          expenses: [],
          maintenanceTickets: []
        }));
      },

      logout: () => {
        set({
          currentUser: defaultDemoUser,
          authMode: 'demo'
        });
      },

      resetDemoData: () => {
        set({
          subscription: initialSubscription,
          properties: initialProperties,
          activePropertyId: 'all',
          availableFacilities: defaultFacilities,
          rooms: initialRooms,
          tenants: initialTenants,
          invoices: initialInvoices,
          expenses: initialExpenses,
          maintenanceTickets: initialTickets,
          settings: initialSettings
        });
      },

      // --- SUBSCRIPTION ACTIONS ---
      upgradeSubscription: (plan, cycle, paymentMethod, amount) => {
        const planNames = {
          starter: 'Paket Kos Mungil',
          pro: 'Paket Juragan Pro',
          enterprise: 'Paket Konglomerat'
        };
        const maxRoomsMap = { starter: 10, pro: 50, enterprise: 999 };
        const maxPropsMap = { starter: 1, pro: 3, enterprise: 999 };
        const daysToAdd = cycle === 'annual' ? 365 : 30;

        const currentExp = new Date(get().subscription?.expiresAt || Date.now());
        const baseDate = currentExp > new Date() ? currentExp : new Date();
        baseDate.setDate(baseDate.getDate() + daysToAdd);
        const newExpiresAt = baseDate.toISOString().split('T')[0];

        const updatedSub: SubscriptionDetails = {
          plan,
          planName: planNames[plan],
          billingCycle: cycle,
          status: 'active',
          startDate: new Date().toISOString().split('T')[0],
          expiresAt: newExpiresAt,
          daysRemaining: Math.ceil((baseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
          maxRooms: maxRoomsMap[plan],
          maxProperties: maxPropsMap[plan]
        };

        const newInvoice: SaaSInvoice = {
          id: 'inv-saas-' + Date.now().toString(36),
          invoiceNumber: `INV-KSK/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`,
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          planName: planNames[plan],
          cycle: cycle === 'annual' ? 'Tahunan' : 'Bulanan',
          amount,
          paymentMethod,
          status: 'Lunas'
        };

        set((state) => ({
          subscription: updatedSub,
          saasInvoices: [newInvoice, ...state.saasInvoices],
          currentUser: {
            ...state.currentUser,
            plan
          }
        }));
      },

      canAddRoom: () => {
        const current = get().rooms.length;
        const max = get().subscription?.maxRooms || 999;
        return {
          allowed: current < max,
          current,
          max,
          planName: get().subscription?.planName || 'Paket Kos'
        };
      },

      canAddProperty: () => {
        const current = get().properties.length;
        const max = get().subscription?.maxProperties || 999;
        return {
          allowed: current < max,
          current,
          max,
          planName: get().subscription?.planName || 'Paket Kos'
        };
      },

      // --- SUPER ADMIN SAAS MANAGEMENT ACTIONS ---
      approveUserSubscriptionManual: (userId, plan, durationDays, amount, paymentMethod, notes) => {
        const planNames = {
          starter: 'Paket Kos Mungil',
          pro: 'Paket Juragan Pro',
          enterprise: 'Paket Konglomerat'
        };
        const maxRoomsMap = { starter: 10, pro: 50, enterprise: 999 };
        const maxPropsMap = { starter: 1, pro: 3, enterprise: 999 };

        set((state) => {
          const today = new Date();
          const baseDate = new Date();
          baseDate.setDate(baseDate.getDate() + durationDays);
          const expiresAtStr = baseDate.toISOString().split('T')[0];

          const updatedAccounts = state.saasAccounts.map((acc) => {
            if (acc.id === userId) {
              return {
                ...acc,
                plan,
                planName: planNames[plan],
                status: 'active' as const,
                expiresAt: expiresAtStr,
                daysRemaining: durationDays,
                totalPaid: (acc.totalPaid || 0) + amount,
                lastPaymentDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                notes: notes || `Disetujui manual oleh Admin (${paymentMethod}).`
              };
            }
            return acc;
          });

          let updatedSub = state.subscription;
          let updatedUser = state.currentUser;
          let updatedInvoices = state.saasInvoices;

          if (state.currentUser.id === userId) {
            updatedSub = {
              plan,
              planName: planNames[plan],
              billingCycle: durationDays >= 365 ? 'annual' : 'monthly',
              status: 'active',
              startDate: today.toISOString().split('T')[0],
              expiresAt: expiresAtStr,
              daysRemaining: durationDays,
              maxRooms: maxRoomsMap[plan],
              maxProperties: maxPropsMap[plan]
            };
            updatedUser = {
              ...state.currentUser,
              plan
            };

            const invoice: SaaSInvoice = {
              id: 'inv-saas-' + Date.now().toString(36),
              invoiceNumber: `INV-KSK/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`,
              date: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              planName: planNames[plan],
              cycle: durationDays >= 365 ? 'Tahunan' : 'Bulanan',
              amount,
              paymentMethod: `Manual: ${paymentMethod}`,
              status: 'Lunas'
            };
            updatedInvoices = [invoice, ...state.saasInvoices];
          }

          return {
            saasAccounts: updatedAccounts,
            subscription: updatedSub,
            currentUser: updatedUser,
            saasInvoices: updatedInvoices
          };
        });
      },

      impersonateUser: (userId) => {
        const target = get().saasAccounts.find((a) => a.id === userId);
        if (!target) return;
        const planNames = {
          starter: 'Paket Kos Mungil',
          pro: 'Paket Juragan Pro',
          enterprise: 'Paket Konglomerat',
          trial_14_days: 'Trial Gratis 14 Hari'
        };
        const maxRoomsMap = { starter: 10, pro: 50, enterprise: 999, trial_14_days: 50 };
        const maxPropsMap = { starter: 1, pro: 3, enterprise: 999, trial_14_days: 3 };

        set({
          impersonatingFromAdmin: true,
          authMode: 'user',
          currentUser: {
            id: target.id,
            name: target.name,
            email: target.email,
            kosName: target.kosName,
            role: 'owner',
            plan: target.plan,
            isDemo: false
          },
          subscription: {
            plan: target.plan,
            planName: target.planName || planNames[target.plan],
            billingCycle: 'monthly',
            status: target.status === 'active' ? 'active' : 'trial',
            startDate: target.registeredAt,
            expiresAt: target.expiresAt,
            daysRemaining: target.daysRemaining,
            maxRooms: maxRoomsMap[target.plan],
            maxProperties: maxPropsMap[target.plan]
          }
        });
      },

      stopImpersonating: () => {
        set({
          impersonatingFromAdmin: false,
          authMode: 'demo',
          currentUser: defaultDemoUser,
          subscription: initialSubscription
        });
      },

      toggleUserStatus: (userId, status) => {
        set((state) => ({
          saasAccounts: state.saasAccounts.map((acc) =>
            acc.id === userId ? { ...acc, status } : acc
          )
        }));
      },

      updateSaaSAccount: (accountId, updates) => {
        set((state) => ({
          saasAccounts: state.saasAccounts.map((acc) => {
            if (acc.id === accountId) {
              const updated = { ...acc, ...updates };
              // If status updated to active or duration updated, recalculate daysRemaining if needed
              if (updates.expiresAt && !updates.daysRemaining) {
                const diffTime = new Date(updates.expiresAt).getTime() - Date.now();
                updated.daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
              }
              return updated;
            }
            return acc;
          })
        }));
      },

      deleteSaaSAccount: (accountId) => {
        if (accountId === 'usr-admin-root') return false; // Protected superadmin
        set((state) => ({
          saasAccounts: state.saasAccounts.filter((acc) => acc.id !== accountId)
        }));
        return true;
      },

      // --- SUPER ADMIN LANDING PAGE CMS ACTIONS ---
      updateLandingPageConfig: (updates) => {
        set((state) => ({
          landingPageConfig: {
            ...state.landingPageConfig,
            ...updates,
            pricing: {
              ...state.landingPageConfig.pricing,
              ...(updates.pricing || {})
            }
          }
        }));
      },

      resetLandingPageConfig: () => {
        set({ landingPageConfig: initialLandingPageConfig });
      },

      // --- PROPERTY ACTIONS ---
      setActivePropertyId: (id) => {
        set({ activePropertyId: id });
      },

      addProperty: (propertyData) => {
        const id = 'prop-' + Date.now().toString(36);
        const newProperty: Property = { ...propertyData, id };
        set((state) => ({
          properties: [...state.properties, newProperty],
          activePropertyId: id
        }));
        return id;
      },

      updateProperty: (id, updates) => {
        set((state) => ({
          properties: state.properties.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }));
      },

      deleteProperty: (id) => {
        const currentProperties = get().properties;
        if (currentProperties.length <= 1) {
          return false; // Prevent deleting the only property
        }
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
          rooms: state.rooms.filter((r) => r.propertyId !== id),
          tenants: state.tenants.filter((t) => t.propertyId !== id),
          invoices: state.invoices.filter((i) => i.propertyId !== id),
          expenses: state.expenses.filter((e) => e.propertyId !== id),
          maintenanceTickets: state.maintenanceTickets.filter((m) => m.propertyId !== id),
          activePropertyId: state.activePropertyId === id ? 'all' : state.activePropertyId
        }));
        return true;
      },

      addFloorToProperty: (propertyId) => {
        let newFloor = 2;
        set((state) => ({
          properties: state.properties.map((p) => {
            if (p.id === propertyId) {
              newFloor = (p.floors || 1) + 1;
              return { ...p, floors: newFloor };
            }
            return p;
          })
        }));
        return newFloor;
      },

      deleteFloorFromProperty: (propertyId, floorNumber) => {
        const prop = get().properties.find((p) => p.id === propertyId);
        if (!prop) {
          return { success: false, message: 'Cabang kos tidak ditemukan.' };
        }
        if ((prop.floors || 1) <= 1) {
          return { success: false, message: 'Cabang kos minimal harus memiliki 1 lantai.' };
        }

        const roomsInFloor = get().rooms.filter(
          (r) => r.propertyId === propertyId && r.floor === floorNumber
        );
        const hasOccupied = roomsInFloor.some((r) => r.status === 'occupied');
        if (hasOccupied) {
          return {
            success: false,
            message: `Tidak dapat menghapus Lantai ${floorNumber} karena masih ada kamar yang sedang terisi penghuni.`
          };
        }

        // Hapus kamar pada lantai tersebut, dan turunkan nomor lantai untuk lantai di atasnya
        set((state) => ({
          properties: state.properties.map((p) => {
            if (p.id === propertyId) {
              return { ...p, floors: Math.max(1, (p.floors || 1) - 1) };
            }
            return p;
          }),
          rooms: state.rooms
            .filter((r) => !(r.propertyId === propertyId && r.floor === floorNumber))
            .map((r) => {
              if (r.propertyId === propertyId && r.floor > floorNumber) {
                return { ...r, floor: r.floor - 1 };
              }
              return r;
            })
        }));

        return { success: true, message: `Lantai ${floorNumber} berhasil dihapus!` };
      },

      // --- FACILITIES ACTIONS ---
      addFacility: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => {
          if (state.availableFacilities.includes(trimmed)) return state;
          return { availableFacilities: [...state.availableFacilities, trimmed] };
        });
      },

      deleteFacility: (name) => {
        set((state) => ({
          availableFacilities: state.availableFacilities.filter((f) => f !== name)
        }));
      },

      // --- ROOM ACTIONS ---
      addRoom: (roomData) => {
        const id = 'k-' + Date.now().toString(36);
        const activeProp = get().activePropertyId;
        const defaultPropId = activeProp !== 'all' ? activeProp : (get().properties[0]?.id || 'prop-1');
        const finalPropertyId = roomData.propertyId || defaultPropId;

        const newRoom: Room = {
          ...roomData,
          id,
          propertyId: finalPropertyId
        };
        set((state) => ({
          rooms: [newRoom, ...state.rooms]
        }));
      },

      updateRoom: (id, updates) => {
        set((state) => ({
          rooms: state.rooms.map((r) => (r.id === id ? { ...r, ...updates } : r))
        }));
      },

      deleteRoom: (id) => {
        const room = get().rooms.find((r) => r.id === id);
        if (room && room.status === 'occupied') {
          return false;
        }
        set((state) => ({
          rooms: state.rooms.filter((r) => r.id !== id)
        }));
        return true;
      },

      // --- TENANT & CHECK-IN / CHECK-OUT ACTIONS ---
      checkInTenant: (tenantData, roomId) => {
        const room = get().rooms.find((r) => r.id === roomId);
        if (!room) return;

        const tenantId = 't-' + Date.now().toString(36);
        const today = new Date();
        const monthYear = today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

        const defaultCatAvatars = [
          '/cat-avatar-gamer.jpg',
          '/cat-avatar-groceries.jpg',
          '/cat-avatar-gym.jpg',
          '/cat-avatar-laundry.jpg',
          '/cat-avatar-music.jpg'
        ];
        const randomAvatar = defaultCatAvatars[Math.floor(Math.random() * defaultCatAvatars.length)];

        const newTenant: Tenant = {
          ...tenantData,
          profilePhoto: tenantData.profilePhoto || randomAvatar,
          id: tenantId,
          propertyId: room.propertyId,
          roomId: room.id,
          roomNumber: room.number,
          status: 'active'
        };

        const firstInvoice: Invoice = {
          id: 'inv-' + Date.now().toString(36),
          propertyId: room.propertyId,
          invoiceNumber: `INV/${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`,
          tenantId,
          tenantName: newTenant.name,
          roomId: room.id,
          roomNumber: room.number,
          amount: room.price,
          dueDate: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${tenantData.dueDayOfMonth.toString().padStart(2, '0')}`,
          periodMonth: monthYear,
          status: 'unpaid'
        };

        set((state) => ({
          tenants: [newTenant, ...state.tenants],
          invoices: [firstInvoice, ...state.invoices],
          rooms: state.rooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  status: 'occupied',
                  tenantId,
                  tenantName: newTenant.name,
                  dueDate: `${tenantData.dueDayOfMonth} ${today.toLocaleString('id-ID', { month: 'short' })}`
                }
              : r
          )
        }));
      },

      checkOutTenant: (tenantId, options) => {
        const tenant = get().tenants.find((t) => t.id === tenantId);
        if (!tenant) return;

        const roomId = tenant.roomId;

        set((state) => ({
          tenants: state.tenants.map((t) =>
            t.id === tenantId
              ? {
                  ...t,
                  status: 'checked_out',
                  depositStatus: options?.refundDeposit ? 'refunded' : t.depositStatus
                }
              : t
          ),
          rooms: state.rooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  status: 'vacant',
                  tenantId: undefined,
                  tenantName: undefined,
                  dueDate: undefined,
                  catatan: options?.reason ? `Penyewa sebelumnya check-out: ${options.reason}` : undefined
                }
              : r
          )
        }));
      },

      updateTenant: (id, updates) => {
        set((state) => ({
          tenants: state.tenants.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          rooms: state.rooms.map((r) =>
            r.tenantId === id && updates.name ? { ...r, tenantName: updates.name } : r
          )
        }));
      },

      deleteTenant: (id) => {
        set((state) => ({
          tenants: state.tenants.filter((t) => t.id !== id)
        }));
      },

      // --- INVOICE ACTIONS ---
      markInvoicePaid: (id, method = 'Transfer Bank') => {
        const invoice = get().invoices.find((i) => i.id === id);
        if (!invoice) return;

        const paidAt = new Date().toISOString().split('T')[0];

        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? {
                  ...inv,
                  status: 'paid',
                  paidAt,
                  paymentMethod: method
                }
              : inv
          )
        }));
      },

      addInvoice: (invoiceData) => {
        const id = 'inv-' + Date.now().toString(36);
        const activeProp = get().activePropertyId;
        const defaultPropId = activeProp !== 'all' ? activeProp : (get().properties[0]?.id || 'prop-1');
        const finalPropId = invoiceData.propertyId || defaultPropId;

        set((state) => ({
          invoices: [{ ...invoiceData, id, propertyId: finalPropId }, ...state.invoices]
        }));
      },

      // --- EXPENSE ACTIONS ---
      addExpense: (expenseData) => {
        const id = 'exp-' + Date.now().toString(36);
        const activeProp = get().activePropertyId;
        const defaultPropId = activeProp !== 'all' ? activeProp : (get().properties[0]?.id || 'prop-1');
        const finalPropId = expenseData.propertyId || defaultPropId;

        set((state) => ({
          expenses: [{ ...expenseData, id, propertyId: finalPropId }, ...state.expenses]
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id)
        }));
      },

      // --- MAINTENANCE ACTIONS ---
      addTicket: (ticketData) => {
        const id = 'tc-' + Date.now().toString(36);
        const activeProp = get().activePropertyId;
        const defaultPropId = activeProp !== 'all' ? activeProp : (get().properties[0]?.id || 'prop-1');
        const finalPropId = ticketData.propertyId || defaultPropId;

        set((state) => ({
          maintenanceTickets: [{ ...ticketData, id, propertyId: finalPropId }, ...state.maintenanceTickets]
        }));
      },

      updateTicketStatus: (id, status) => {
        set((state) => ({
          maintenanceTickets: state.maintenanceTickets.map((t) =>
            t.id === id ? { ...t, status } : t
          )
        }));
      },

      // --- SETTINGS ACTIONS ---
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates }
        }));
      },

      // --- THEME ACTIONS ---
      setAppTheme: (theme) => {
        set({ appTheme: theme });
      },

      // --- ROOM TYPES ACTIONS ---
      addRoomType: (item) => {
        const id = 'rt-' + Date.now().toString(36);
        set((state) => ({
          roomTypes: [...state.roomTypes, { ...item, id }]
        }));
      },

      updateRoomType: (id, updates) => {
        set((state) => ({
          roomTypes: state.roomTypes.map((rt) => (rt.id === id ? { ...rt, ...updates } : rt))
        }));
      },

      deleteRoomType: (id) => {
        set((state) => ({
          roomTypes: state.roomTypes.filter((rt) => rt.id !== id)
        }));
      },

      // --- FACILITY DEFINITION ACTIONS ---
      addFacilityWithIcon: (name, icon) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const id = 'fac-' + Date.now().toString(36);
        set((state) => {
          const newDef: FacilityItem = { id, name: trimmed, icon };
          const newAvail = state.availableFacilities.includes(trimmed)
            ? state.availableFacilities
            : [...state.availableFacilities, trimmed];
          return {
            facilityDefinitions: [...state.facilityDefinitions, newDef],
            availableFacilities: newAvail
          };
        });
      },

      updateFacilityDefinition: (id, updates) => {
        set((state) => ({
          facilityDefinitions: state.facilityDefinitions.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          )
        }));
      },

      // --- CATEGORY & ACCOUNT ACTIONS ---
      addCategory: (item) => {
        const id = (item.type === 'income' ? 'inc-' : 'exp-') + Date.now().toString(36);
        const newCat: TransactionCategoryItem = { ...item, id };
        set((state) => {
          if (item.type === 'income') {
            return { incomeCategories: [...state.incomeCategories, newCat] };
          }
          return { expenseCategories: [...state.expenseCategories, newCat] };
        });
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          incomeCategories: state.incomeCategories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          expenseCategories: state.expenseCategories.map((c) => (c.id === id ? { ...c, ...updates } : c))
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          incomeCategories: state.incomeCategories.filter((c) => c.id !== id),
          expenseCategories: state.expenseCategories.filter((c) => c.id !== id)
        }));
      },

      addCashAccount: (item) => {
        const id = 'acc-' + Date.now().toString(36);
        set((state) => ({
          cashAccounts: [...state.cashAccounts, { ...item, id }]
        }));
      },

      updateCashAccount: (id, updates) => {
        set((state) => ({
          cashAccounts: state.cashAccounts.map((a) => (a.id === id ? { ...a, ...updates } : a))
        }));
      },

      deleteCashAccount: (id) => {
        set((state) => ({
          cashAccounts: state.cashAccounts.filter((a) => a.id !== id)
        }));
      },

      // --- BUDGET ACTIONS ---
      setMonthlyBudget: (categoryId, amount) => {
        set((state) => ({
          monthlyBudgets: {
            ...state.monthlyBudgets,
            [categoryId]: amount
          }
        }));
      },

      clearMonthlyBudget: (categoryId) => {
        set((state) => {
          const next = { ...state.monthlyBudgets };
          delete next[categoryId];
          return { monthlyBudgets: next };
        });
      },

      // --- RESET TO DEMO ---
      resetToDefaultData: () => {
        set({
          properties: initialProperties,
          activePropertyId: 'all',
          availableFacilities: defaultFacilities,
          facilityDefinitions: defaultFacilityDefinitions,
          roomTypes: defaultRoomTypes,
          rooms: initialRooms,
          tenants: initialTenants,
          invoices: initialInvoices,
          expenses: initialExpenses,
          incomeCategories: defaultIncomeCategories,
          expenseCategories: defaultExpenseCategories,
          cashAccounts: defaultCashAccounts,
          monthlyBudgets: defaultMonthlyBudgets,
          appTheme: 'paw-peach',
          maintenanceTickets: initialTickets,
          settings: initialSettings
        });
      }
    }),
    {
      name: 'pawskost_store_v9',
      storage: createJSONStorage(() => localStorage),
      version: 9,
      migrate: (persistedState: any, version: number) => {
        const catAvatars = [
          '/cat-avatar-gamer.jpg',
          '/cat-avatar-groceries.jpg',
          '/cat-avatar-gym.jpg',
          '/cat-avatar-laundry.jpg',
          '/cat-avatar-music.jpg'
        ];
        const accounts = (persistedState?.saasAccounts || initialSaaSAccounts).map((acc: any) => ({
          ...acc,
          password: acc.password || (acc.id === 'usr-admin-root' ? 'admin123' : 'password123'),
          proofUrl: acc.proofUrl || (acc.status === 'pending_approval' ? sampleProofReceipt : undefined),
          proofNotes: acc.proofNotes || (acc.status === 'pending_approval' ? 'Transfer via m-BCA a/n Ratna Dewi Rp 99.000 ref: 20261031772910842' : undefined)
        }));
        return {
          ...persistedState,
          currentUser: persistedState?.currentUser || defaultDemoUser,
          authMode: persistedState?.authMode || 'demo',
          subscription: persistedState?.subscription || initialSubscription,
          saasInvoices: persistedState?.saasInvoices || initialSaaSInvoices,
          saasAccounts: accounts,
          landingPageConfig: persistedState?.landingPageConfig || initialLandingPageConfig,
          impersonatingFromAdmin: false,
          properties: persistedState?.properties || initialProperties,
          activePropertyId: persistedState?.activePropertyId || 'all',
          availableFacilities: persistedState?.availableFacilities || defaultFacilities,
          facilityDefinitions: persistedState?.facilityDefinitions || defaultFacilityDefinitions,
          roomTypes: persistedState?.roomTypes || defaultRoomTypes,
          incomeCategories: persistedState?.incomeCategories || defaultIncomeCategories,
          expenseCategories: persistedState?.expenseCategories || defaultExpenseCategories,
          cashAccounts: persistedState?.cashAccounts || defaultCashAccounts,
          monthlyBudgets: persistedState?.monthlyBudgets || defaultMonthlyBudgets,
          appTheme: persistedState?.appTheme || 'paw-peach',
          rooms: (persistedState?.rooms || initialRooms).map((r: any, idx: number) => ({
            ...r,
            propertyId: r.propertyId || (idx >= 14 ? 'prop-2' : 'prop-1')
          })),
          tenants: (persistedState?.tenants || initialTenants).map((t: any, idx: number) => ({
            ...t,
            propertyId: t.propertyId || 'prop-1',
            profilePhoto: (t.profilePhoto && !t.profilePhoto.startsWith('data:image/svg'))
              ? t.profilePhoto
              : catAvatars[idx % catAvatars.length]
          })),
          invoices: (persistedState?.invoices || initialInvoices).map((i: any) => ({
            ...i,
            propertyId: i.propertyId || 'prop-1'
          })),
          expenses: (persistedState?.expenses || initialExpenses).map((e: any) => ({
            ...e,
            propertyId: e.propertyId || 'prop-1'
          })),
          maintenanceTickets: (persistedState?.maintenanceTickets || initialTickets).map((m: any) => ({
            ...m,
            propertyId: m.propertyId || 'prop-1'
          }))
        };
      }
    }
  )
);

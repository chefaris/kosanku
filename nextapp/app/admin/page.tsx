'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Crown,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  DollarSign,
  Phone,
  MessageCircle,
  Eye,
  Check,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  Calendar,
  LogOut,
  RotateCcw,
  Edit,
  FileCheck2,
  Palette,
  CreditCard,
  Plus,
  Trash2,
  Save,
  HelpCircle,
  Layout,
  ExternalLink,
  ZoomIn
} from 'lucide-react';
import { useKosStore, SaaSUserAccount, LandingPageConfig } from '../lib/store/useKosStore';
import { ManualApprovalModal } from '../components/admin/ManualApprovalModal';
import { ProofViewerModal } from '../components/admin/ProofViewerModal';
import { EditAccountModal } from '../components/admin/EditAccountModal';

export default function SuperAdminPage() {
  const router = useRouter();
  const {
    saasAccounts,
    impersonateUser,
    stopImpersonating,
    impersonatingFromAdmin,
    currentUser,
    landingPageConfig,
    updateLandingPageConfig,
    resetLandingPageConfig
  } = useKosStore();

  // Active Tab: 'subscribers' | 'landing_cms' | 'pricing_banks'
  const [activeTab, setActiveTab] = useState<'subscribers' | 'landing_cms' | 'pricing_banks'>('subscribers');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_approval' | 'active' | 'trial' | 'expired'>('all');

  // Modals state
  const [selectedAccountForApproval, setSelectedAccountForApproval] = useState<SaaSUserAccount | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const [selectedAccountForProof, setSelectedAccountForProof] = useState<SaaSUserAccount | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  const [selectedAccountForEdit, setSelectedAccountForEdit] = useState<SaaSUserAccount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CMS Form Local State (initialized from landingPageConfig)
  const [cmsHeroBadge, setCmsHeroBadge] = useState(landingPageConfig.heroBadge);
  const [cmsHeroHeadline, setCmsHeroHeadline] = useState(landingPageConfig.heroHeadline);
  const [cmsHeroSubheadline, setCmsHeroSubheadline] = useState(landingPageConfig.heroSubheadline);
  const [cmsHeroCtaText, setCmsHeroCtaText] = useState(landingPageConfig.heroCtaText);
  const [cmsHeroCtaSecondary, setCmsHeroCtaSecondary] = useState(landingPageConfig.heroCtaSecondaryText);
  const [cmsAdminWhatsApp, setCmsAdminWhatsApp] = useState(landingPageConfig.adminWhatsApp);
  const [cmsAdminEmail, setCmsAdminEmail] = useState(landingPageConfig.adminEmail);
  const [cmsFaqs, setCmsFaqs] = useState(landingPageConfig.faqs);

  // Pricing & Banks Form Local State
  const [starterPrice, setStarterPrice] = useState(landingPageConfig.pricing.starter.price);
  const [starterRooms, setStarterRooms] = useState(landingPageConfig.pricing.starter.maxRooms);
  const [proPrice, setProPrice] = useState(landingPageConfig.pricing.pro.price);
  const [proRooms, setProRooms] = useState(landingPageConfig.pricing.pro.maxRooms);
  const [enterprisePrice, setEnterprisePrice] = useState(landingPageConfig.pricing.enterprise.price);
  const [bankAccountsList, setBankAccountsList] = useState(landingPageConfig.bankAccounts);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPIs
  const totalSubscribers = saasAccounts.length;
  const activeSubscribers = saasAccounts.filter((a) => a.status === 'active').length;
  const pendingSubscribers = saasAccounts.filter((a) => a.status === 'pending_approval').length;
  const trialSubscribers = saasAccounts.filter((a) => a.status === 'trial').length;
  const totalRevenue = saasAccounts.reduce((acc, curr) => acc + (curr.totalPaid || 0), 0);

  // Filtered List
  const filteredAccounts = saasAccounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.kosName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.phone.includes(searchQuery);

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return account.status === statusFilter;
  });

  const handleOpenApproval = (account: SaaSUserAccount) => {
    setSelectedAccountForApproval(account);
    setIsApprovalModalOpen(true);
  };

  const handleOpenProof = (account: SaaSUserAccount) => {
    setSelectedAccountForProof(account);
    setIsProofModalOpen(true);
  };

  const handleOpenEdit = (account: SaaSUserAccount) => {
    setSelectedAccountForEdit(account);
    setIsEditModalOpen(true);
  };

  const handleImpersonate = (account: SaaSUserAccount) => {
    impersonateUser(account.id);
    showToast(`Beralih ke akun ${account.name} (${account.kosName}) 🚀`);
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  const handleOpenWhatsApp = (phone: string, name: string, kosName: string) => {
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62');
    const msg = encodeURIComponent(
      `Halo Kak ${name} (${kosName}), terima kasih telah mendaftar di KosanKu! Kami siap membantu mengaktifkan akun dan pertanyaan seputar kelola kos. ✨`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  // Save Landing Page CMS
  const handleSaveLandingCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateLandingPageConfig({
      heroBadge: cmsHeroBadge,
      heroHeadline: cmsHeroHeadline,
      heroSubheadline: cmsHeroSubheadline,
      heroCtaText: cmsHeroCtaText,
      heroCtaSecondaryText: cmsHeroCtaSecondary,
      adminWhatsApp: cmsAdminWhatsApp,
      adminEmail: cmsAdminEmail,
      faqs: cmsFaqs
    });
    showToast('Tampilan Landing Page berhasil diperbarui! 🎉');
  };

  // Save Pricing & Banks
  const handleSavePricingBanks = (e: React.FormEvent) => {
    e.preventDefault();
    updateLandingPageConfig({
      pricing: {
        starter: {
          ...landingPageConfig.pricing.starter,
          price: Number(starterPrice),
          maxRooms: Number(starterRooms)
        },
        pro: {
          ...landingPageConfig.pricing.pro,
          price: Number(proPrice),
          maxRooms: Number(proRooms)
        },
        enterprise: {
          ...landingPageConfig.pricing.enterprise,
          price: Number(enterprisePrice)
        }
      },
      bankAccounts: bankAccountsList
    });
    showToast('Pengaturan harga & rekening bank berhasil disimpan! 💳');
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan seluruh teks landing page dan harga ke pengaturan bawaan awal?')) {
      resetLandingPageConfig();
      // Sync local state
      setCmsHeroBadge(landingPageConfig.heroBadge);
      setCmsHeroHeadline(landingPageConfig.heroHeadline);
      setCmsHeroSubheadline(landingPageConfig.heroSubheadline);
      setCmsHeroCtaText(landingPageConfig.heroCtaText);
      setCmsHeroCtaSecondary(landingPageConfig.heroCtaSecondaryText);
      setCmsAdminWhatsApp(landingPageConfig.adminWhatsApp);
      setCmsAdminEmail(landingPageConfig.adminEmail);
      setCmsFaqs(landingPageConfig.faqs);
      setStarterPrice(49000);
      setProPrice(99000);
      setEnterprisePrice(199000);
      showToast('Konfigurasi dikembalikan ke standar awal.');
    }
  };

  // FAQ Helpers
  const handleAddFaq = () => {
    const newFaq = {
      id: 'faq-' + Date.now(),
      question: 'Pertanyaan baru?',
      answer: 'Jawaban penjelasan untuk pertanyaan ini.'
    };
    setCmsFaqs([...cmsFaqs, newFaq]);
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...cmsFaqs];
    updated[index][field] = value;
    setCmsFaqs(updated);
  };

  const handleDeleteFaq = (index: number) => {
    setCmsFaqs(cmsFaqs.filter((_, i) => i !== index));
  };

  // Bank Helpers
  const handleAddBank = () => {
    const newBank = {
      id: 'bank-' + Date.now(),
      bankName: 'Bank Baru',
      accountNumber: '1234-5678-90',
      accountHolder: 'Rumah KosanKu Indonesia'
    };
    setBankAccountsList([...bankAccountsList, newBank]);
  };

  const handleUpdateBank = (index: number, field: 'bankName' | 'accountNumber' | 'accountHolder', value: string) => {
    const updated = [...bankAccountsList];
    updated[index][field] = value;
    setBankAccountsList(updated);
  };

  const handleDeleteBank = (index: number) => {
    if (bankAccountsList.length <= 1) {
      alert('Minimal harus ada 1 rekening transfer bank.');
      return;
    }
    setBankAccountsList(bankAccountsList.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 pb-20 font-body text-darkcocoa">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-5 right-5 z-[99999] bg-matcha-500 text-white px-5 py-3 rounded-2xl shadow-cute flex items-center gap-2 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Impersonation Banner if active */}
      {impersonatingFromAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              Anda sedang mengamati akun <strong>{currentUser.name}</strong> ({currentUser.kosName}). Seluruh data yang terlihat adalah milik akun ini.
            </span>
          </div>
          <button
            onClick={() => {
              stopImpersonating();
              showToast('Kembali ke mode Super Admin! 👑');
            }}
            className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembali ke Super Admin</span>
          </button>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-peach-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              SaaS Super Admin Console
            </span>
            <span className="text-xs text-softgray">• Hak Akses Pemilik Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-darkcocoa">
            Pusat Kendali &amp; Kustomisasi KosanKu
          </h1>
          <p className="text-xs sm:text-sm text-softgray mt-1">
            Kelola pelanggan, periksa bukti transfer manual, dan kustomisasi konten landing page secara langsung.
          </p>
        </div>

        {/* View Live Landing Page Button */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3.5 rounded-2xl bg-white border border-cream-200 hover:border-peach-300 text-xs font-bold text-darkcocoa flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
          >
            <ExternalLink className="w-3.5 h-3.5 text-peach-500" />
            <span>Lihat Landing Page Live</span>
          </a>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-cream-200 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('subscribers')}
          className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'subscribers'
              ? 'bg-peach-500 text-white shadow-cute'
              : 'text-softgray hover:text-darkcocoa hover:bg-cream-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pelanggan &amp; Bukti Transfer ({totalSubscribers})</span>
          {pendingSubscribers > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'subscribers' ? 'bg-white text-peach-600' : 'bg-amber-400 text-amber-950 animate-pulse'
            }`}>
              {pendingSubscribers} Butuh Verifikasi
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('landing_cms')}
          className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'landing_cms'
              ? 'bg-peach-500 text-white shadow-cute'
              : 'text-softgray hover:text-darkcocoa hover:bg-cream-50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Editor &amp; Kustomisasi Landing Page (CMS)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pricing_banks')}
          className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pricing_banks'
              ? 'bg-peach-500 text-white shadow-cute'
              : 'text-softgray hover:text-darkcocoa hover:bg-cream-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Paket Harga &amp; Rekening Bank SaaS</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PELANGGAN & BUKTI TRANSFER                                         */}
      {/* ========================================================================= */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-cream-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-softgray">Total Pelanggan</p>
                <h3 className="text-2xl font-heading font-black text-darkcocoa mt-1">
                  {totalSubscribers} <span className="text-xs font-normal text-softgray">Pemilik Kos</span>
                </h3>
                <p className="text-[11px] text-matcha-600 font-semibold mt-0.5">Semua cabang terdaftar</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-peach-50 text-peach-500 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className={`p-5 rounded-3xl bg-white border shadow-sm flex items-center justify-between ${
              pendingSubscribers > 0 ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/20' : 'border-cream-200'
            }`}>
              <div>
                <p className="text-xs font-bold text-amber-700">Perlu Konfirmasi Manual</p>
                <h3 className="text-2xl font-heading font-black text-amber-600 mt-1">
                  {pendingSubscribers} <span className="text-xs font-normal text-softgray">Permintaan</span>
                </h3>
                <p className="text-[11px] text-amber-800 font-semibold mt-0.5">Bukti transfer masuk</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-cream-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-softgray">Pelanggan Aktif Berbayar</p>
                <h3 className="text-2xl font-heading font-black text-matcha-600 mt-1">
                  {activeSubscribers} <span className="text-xs font-normal text-softgray">Akun</span>
                </h3>
                <p className="text-[11px] text-softgray font-semibold mt-0.5">{trialSubscribers} akun dalam masa trial</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-matcha-50 text-matcha-500 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-cream-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-softgray">Total Penerimaan SaaS</p>
                <h3 className="text-2xl font-heading font-black text-darkcocoa mt-1">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </h3>
                <p className="text-[11px] text-peach-600 font-semibold mt-0.5">Pendapatan software terkumpul</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-peach-50 text-peach-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-4 sm:p-6 space-y-4">
            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-softgray absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari nama pemilik kos, nama kosan, atau nomor WA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap ${
                    statusFilter === 'all'
                      ? 'bg-peach-500 text-white shadow-sm'
                      : 'bg-cream-100 text-softgray hover:text-darkcocoa'
                  }`}
                >
                  Semua ({totalSubscribers})
                </button>
                <button
                  onClick={() => setStatusFilter('pending_approval')}
                  className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    statusFilter === 'pending_approval'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Perlu Konfirmasi ({pendingSubscribers})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap ${
                    statusFilter === 'active'
                      ? 'bg-matcha-500 text-white shadow-sm'
                      : 'bg-cream-100 text-softgray hover:text-darkcocoa'
                  }`}
                >
                  Aktif ({activeSubscribers})
                </button>
                <button
                  onClick={() => setStatusFilter('trial')}
                  className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap ${
                    statusFilter === 'trial'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-cream-100 text-softgray hover:text-darkcocoa'
                  }`}
                >
                  Trial ({trialSubscribers})
                </button>
              </div>
            </div>

            {/* Mobile Subscribers Cards View */}
            <div className="block md:hidden space-y-3.5">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 rounded-2xl bg-cream-50/60 border border-cream-200 shadow-xs space-y-3"
                  >
                    {/* Top Row: Name, Kos & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-heading font-black text-darkcocoa text-sm truncate">
                          {account.name}
                        </h4>
                        <p className="text-xs text-softgray flex items-center gap-1 mt-0.5 font-medium truncate">
                          <Building2 className="w-3.5 h-3.5 text-peach-500 flex-shrink-0" />
                          <span className="truncate">{account.kosName}</span>
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        {account.status === 'pending_approval' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" />
                            Perlu Konfirmasi
                          </span>
                        )}
                        {account.status === 'active' && (
                          <span className="px-2.5 py-1 rounded-full bg-matcha-100 text-matcha-700 font-black text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif
                          </span>
                        )}
                        {account.status === 'trial' && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-black text-[10px]">
                            Trial
                          </span>
                        )}
                        {account.status === 'expired' && (
                          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-black text-[10px]">
                            Kedaluwarsa
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle Info: Paket, Masa Aktif, Bayar */}
                    <div className="p-3 bg-white rounded-xl border border-cream-200/80 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-softgray block text-[10px]">Paket:</span>
                        <span className="font-bold text-darkcocoa">{account.planName}</span>
                      </div>
                      <div>
                        <span className="text-softgray block text-[10px]">Total Bayar:</span>
                        <span className="font-mono font-bold text-peach-600">
                          {account.totalPaid === 0 ? 'Rp 0' : `Rp ${account.totalPaid.toLocaleString('id-ID')}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-softgray block text-[10px]">Kontak WA:</span>
                        <a
                          href={`https://wa.me/${account.phone.replace(/\D/g, '').replace(/^0/, '62')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono font-bold text-matcha-700 flex items-center gap-1 hover:underline truncate"
                        >
                          <MessageCircle className="w-3 h-3 text-matcha-600 flex-shrink-0" />
                          <span className="truncate">{account.phone}</span>
                        </a>
                      </div>
                      <div>
                        <span className="text-softgray block text-[10px]">Masa Aktif:</span>
                        <span className="font-semibold text-darkcocoa">{account.expiresAt}</span>
                      </div>
                    </div>

                    {account.notes && (
                      <p className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                        💬 {account.notes}
                      </p>
                    )}

                    {/* Action Buttons Row */}
                    <div className="space-y-2 pt-1">
                      {account.proofUrl && (
                        <button
                          type="button"
                          onClick={() => handleOpenProof(account)}
                          className="w-full py-2 px-3 rounded-xl bg-matcha-50 hover:bg-matcha-100 text-matcha-700 border border-matcha-200 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-matcha-600" />
                          <span>Lihat Struk Bukti Transfer</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        {account.status === 'pending_approval' && (
                          <button
                            onClick={() => handleOpenApproval(account)}
                            className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-peach-500 hover:bg-peach-400 text-white shadow-cute flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Buka Akses</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEdit(account)}
                          className="flex-1 py-2 px-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5 text-peach-500" />
                          <span>Edit Akun</span>
                        </button>

                        <button
                          onClick={() => handleOpenWhatsApp(account.phone, account.name, account.kosName)}
                          className="p-2 rounded-xl bg-matcha-50 text-matcha-600 hover:bg-matcha-100 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleImpersonate(account)}
                          className="p-2 rounded-xl bg-cream-100 text-softgray hover:text-darkcocoa hover:bg-cream-200 transition-colors"
                          title="Intip dashboard (Impersonate)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-softgray text-xs">
                  Tidak ada pelanggan yang cocok dengan pencarian / filter ini.
                </div>
              )}
            </div>

            {/* Subscribers Table for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead>
                  <tr className="border-b border-cream-200 text-softgray uppercase tracking-wider font-bold">
                    <th className="py-3 px-3">Pemilik &amp; Kosan</th>
                    <th className="py-3 px-3">Kontak WA</th>
                    <th className="py-3 px-3">Paket Terdaftar</th>
                    <th className="py-3 px-3">Masa Aktif</th>
                    <th className="py-3 px-3">Status &amp; Bukti Transfer</th>
                    <th className="py-3 px-3">Total Bayar</th>
                    <th className="py-3 px-3 text-right">Tindakan Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-cream-50/60 transition-colors">
                        {/* Pemilik & Kosan */}
                        <td className="py-4 px-3">
                          <div>
                            <p className="font-heading font-black text-darkcocoa text-sm">
                              {account.name}
                            </p>
                            <p className="text-[11px] text-softgray flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3.5 h-3.5 text-peach-500" />
                              <span>{account.kosName}</span>
                            </p>
                            {account.notes && (
                              <p className="text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200 mt-1 max-w-xs">
                                💬 {account.notes}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Kontak */}
                        <td className="py-4 px-3">
                          <div>
                            <p className="font-mono font-bold text-darkcocoa">{account.phone}</p>
                            <p className="text-[11px] text-softgray">{account.email}</p>
                          </div>
                        </td>

                        {/* Paket */}
                        <td className="py-4 px-3">
                          <span className="font-bold text-darkcocoa block">
                            {account.planName}
                          </span>
                          <span className="text-[10px] text-softgray">
                            Daftar: {account.registeredAt}
                          </span>
                        </td>

                        {/* Masa Aktif */}
                        <td className="py-4 px-3">
                          <p className="font-bold text-darkcocoa">{account.expiresAt}</p>
                          <p className={`text-[10px] font-semibold ${
                            account.daysRemaining <= 3 ? 'text-red-500' : 'text-softgray'
                          }`}>
                            {account.daysRemaining > 0 ? `${account.daysRemaining} Hari Lagi` : 'Kedaluwarsa'}
                          </p>
                        </td>

                        {/* Status & Bukti Transfer Badge */}
                        <td className="py-4 px-3">
                          <div className="space-y-1.5">
                            {account.status === 'pending_approval' && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] flex items-center gap-1 w-max animate-pulse">
                                <Clock className="w-3 h-3" />
                                Perlu Konfirmasi
                              </span>
                            )}
                            {account.status === 'active' && (
                              <span className="px-2.5 py-1 rounded-full bg-matcha-100 text-matcha-700 font-black text-[10px] flex items-center gap-1 w-max">
                                <CheckCircle2 className="w-3 h-3" />
                                Aktif Berbayar
                              </span>
                            )}
                            {account.status === 'trial' && (
                              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-black text-[10px] flex items-center gap-1 w-max">
                                Trial 14 Hari
                              </span>
                            )}
                            {account.status === 'expired' && (
                              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-black text-[10px] flex items-center gap-1 w-max">
                                Kedaluwarsa
                              </span>
                            )}

                            {/* Tombol Lihat Bukti Transfer Langsung */}
                            {account.proofUrl ? (
                              <button
                                type="button"
                                onClick={() => handleOpenProof(account)}
                                className="px-2.5 py-1 rounded-xl bg-matcha-50 hover:bg-matcha-100 text-matcha-700 border border-matcha-200 font-extrabold text-[10px] flex items-center gap-1 transition-all hover:scale-105"
                                title="Klik untuk langsung melihat foto struk bukti transfer"
                              >
                                <Eye className="w-3.5 h-3.5 text-matcha-600" />
                                <span>Lihat Bukti Transfer</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-softgray italic block">
                                Belum ada bukti
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total Bayar */}
                        <td className="py-4 px-3 font-mono font-bold text-darkcocoa">
                          {account.totalPaid === 0 ? 'Rp 0' : `Rp ${account.totalPaid.toLocaleString('id-ID')}`}
                        </td>

                        {/* Tindakan Admin */}
                        <td className="py-4 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Tombol Verifikasi / Buka Akses */}
                            {account.status === 'pending_approval' && (
                              <button
                                onClick={() => handleOpenApproval(account)}
                                className="py-1.5 px-3 rounded-xl font-bold text-[11px] bg-peach-500 hover:bg-peach-400 text-white shadow-cute flex items-center gap-1 transition-all hover:scale-105"
                                title="Periksa bukti transfer dan buka akses akun"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>🔍 Buka Akses</span>
                              </button>
                            )}

                            {/* Tombol Edit Lengkap Akun */}
                            <button
                              onClick={() => handleOpenEdit(account)}
                              className="py-1.5 px-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-[11px] flex items-center gap-1 transition-colors"
                              title="Edit data profil, reset password, status, atau masa aktif"
                            >
                              <Edit className="w-3.5 h-3.5 text-peach-500" />
                              <span>Edit</span>
                            </button>

                            {/* WhatsApp Kontak */}
                            <button
                              onClick={() => handleOpenWhatsApp(account.phone, account.name, account.kosName)}
                              className="p-1.5 rounded-xl bg-matcha-50 text-matcha-600 hover:bg-matcha-100 transition-colors"
                              title="Hubungi via WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            {/* Impersonate */}
                            <button
                              onClick={() => handleImpersonate(account)}
                              className="p-1.5 rounded-xl bg-cream-100 text-softgray hover:text-darkcocoa hover:bg-cream-200 transition-colors"
                              title="Intip dashboard kosan pelanggan (Impersonate)"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-softgray">
                        Tidak ada pelanggan yang cocok dengan pencarian / filter ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EDITOR & KUSTOMISASI LANDING PAGE (CMS)                           */}
      {/* ========================================================================= */}
      {activeTab === 'landing_cms' && (
        <form onSubmit={handleSaveLandingCMS} className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-100 pb-4">
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa flex items-center gap-2">
                  <Palette className="w-5 h-5 text-peach-500 flex-shrink-0" />
                  <span>Kustomisasi Teks &amp; Banner Landing Page</span>
                </h3>
                <p className="text-xs text-softgray mt-0.5">
                  Ubah kata-kata promosi utama, tombol ajakan, dan tanya jawab yang tampil pada halaman publik KosanKu.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="py-2 px-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-softgray font-bold text-xs transition-colors"
                >
                  Reset Standar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-4 sm:px-5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>

            {/* Section: Hero Banner */}
            <div className="space-y-4">
              <h4 className="font-heading font-black text-sm text-peach-600 uppercase tracking-wider flex items-center gap-1.5">
                <Layout className="w-4 h-4" />
                <span>1. Bagian Hero Utama (Tampilan Teratas)</span>
              </h4>

              <div>
                <label className="font-bold text-darkcocoa text-xs block mb-1">
                  Badge Pengumuman Atas (Teks Kecil di Atas Judul)
                </label>
                <input
                  type="text"
                  value={cmsHeroBadge}
                  onChange={(e) => setCmsHeroBadge(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2.5 text-xs text-darkcocoa font-bold focus:outline-none focus:border-peach-400"
                />
              </div>

              <div>
                <label className="font-bold text-darkcocoa text-xs block mb-1">
                  Judul Utama (Headline Besar)
                </label>
                <textarea
                  rows={2}
                  value={cmsHeroHeadline}
                  onChange={(e) => setCmsHeroHeadline(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2.5 text-xs text-darkcocoa font-heading font-black focus:outline-none focus:border-peach-400"
                />
              </div>

              <div>
                <label className="font-bold text-darkcocoa text-xs block mb-1">
                  Deskripsi / Subjudul Hero
                </label>
                <textarea
                  rows={3}
                  value={cmsHeroSubheadline}
                  onChange={(e) => setCmsHeroSubheadline(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2.5 text-xs text-darkcocoa leading-relaxed focus:outline-none focus:border-peach-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-darkcocoa text-xs block mb-1">
                    Teks Tombol CTA Utama (Oranye)
                  </label>
                  <input
                    type="text"
                    value={cmsHeroCtaText}
                    onChange={(e) => setCmsHeroCtaText(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2 text-xs text-darkcocoa font-bold focus:outline-none focus:border-peach-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-darkcocoa text-xs block mb-1">
                    Teks Tombol CTA Kedua (Putih)
                  </label>
                  <input
                    type="text"
                    value={cmsHeroCtaSecondary}
                    onChange={(e) => setCmsHeroCtaSecondary(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3.5 py-2 text-xs text-darkcocoa font-bold focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cream-100/70 via-peach-50/50 to-sakura-50/50 border border-peach-200 text-center space-y-3">
              <span className="text-[10px] font-black text-peach-700 bg-white/80 border border-peach-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Pratinjau Langsung (Live Preview Hero)
              </span>
              <div className="max-w-xl mx-auto space-y-2">
                <span className="inline-block bg-white text-peach-600 font-extrabold text-[11px] px-3 py-1 rounded-full border border-peach-200 shadow-sm">
                  {cmsHeroBadge}
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-darkcocoa">
                  {cmsHeroHeadline}
                </h2>
                <p className="text-xs text-softgray leading-relaxed">
                  {cmsHeroSubheadline}
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="px-4 py-2 rounded-2xl bg-peach-500 text-white font-bold text-xs shadow-cute">
                    {cmsHeroCtaText}
                  </span>
                  <span className="px-4 py-2 rounded-2xl bg-white text-darkcocoa font-bold text-xs border border-cream-200">
                    {cmsHeroCtaSecondary}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-cream-100 pt-4 space-y-4">
              <h4 className="font-heading font-black text-sm text-peach-600 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>2. Tanya Jawab Populer (FAQ) di Landing Page</span>
              </h4>

              <div className="space-y-3">
                {cmsFaqs.map((faq, idx) => (
                  <div key={faq.id || idx} className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-darkcocoa">Pertanyaan #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(idx)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                      placeholder="Pertanyaan FAQ"
                      className="w-full bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa font-bold focus:outline-none focus:border-peach-400"
                    />

                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                      placeholder="Jawaban penjelasan FAQ"
                      className="w-full bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa focus:outline-none focus:border-peach-400"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="py-2 px-4 rounded-xl bg-peach-50 hover:bg-peach-100 text-peach-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pertanyaan FAQ Baru</span>
                </button>
              </div>
            </div>

            <div className="border-t border-cream-100 pt-4 space-y-3">
              <h4 className="font-heading font-black text-sm text-peach-600 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                <span>3. Kontak Layanan &amp; WhatsApp CS Admin</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-darkcocoa text-xs block mb-1">
                    Nomor WhatsApp Admin (Untuk Notifikasi Transfer)
                  </label>
                  <input
                    type="text"
                    value={cmsAdminWhatsApp}
                    onChange={(e) => setCmsAdminWhatsApp(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa font-mono font-bold focus:outline-none focus:border-peach-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-darkcocoa text-xs block mb-1">
                    Email Resmi Layanan Pelanggan
                  </label>
                  <input
                    type="email"
                    value={cmsAdminEmail}
                    onChange={(e) => setCmsAdminEmail(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa font-mono focus:outline-none focus:border-peach-400"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="pt-4 border-t border-cream-200 flex justify-end">
              <button
                type="submit"
                className="py-3 px-6 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Semua Perubahan Landing Page</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PENGATURAN HARGA PAKET & REKENING BANK                           */}
      {/* ========================================================================= */}
      {activeTab === 'pricing_banks' && (
        <form onSubmit={handleSavePricingBanks} className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-100 pb-4">
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-darkcocoa flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-peach-500 flex-shrink-0" />
                  <span>Pengaturan Tarif Paket SaaS &amp; Rekening Bank</span>
                </h3>
                <p className="text-xs text-softgray mt-0.5">
                  Atur nominal tarif sewa aplikasi bulanan dan rekening tujuan transfer manual resmi platform Anda.
                </p>
              </div>

              <button
                type="submit"
                className="self-start sm:self-auto py-2.5 px-4 sm:px-5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Harga &amp; Rekening</span>
              </button>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <h4 className="font-heading font-black text-sm text-peach-600 uppercase tracking-wider">
                1. Tarif Langganan SaaS Bulanan
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Starter */}
                <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-xs text-darkcocoa">Paket Kos Mungil</span>
                    <span className="text-[10px] bg-cream-200 text-softgray px-2 py-0.5 rounded-full font-bold">1 Kos</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-softgray block mb-1">Harga Bulanan (Rp):</label>
                    <input
                      type="number"
                      value={starterPrice}
                      onChange={(e) => setStarterPrice(Number(e.target.value))}
                      className="w-full bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-softgray block mb-1">Maksimal Kamar:</label>
                    <input
                      type="number"
                      value={starterRooms}
                      onChange={(e) => setStarterRooms(Number(e.target.value))}
                      className="w-full bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
                    />
                  </div>
                </div>

                {/* Pro */}
                <div className="p-4 rounded-2xl bg-peach-50/70 border-2 border-peach-300 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-xs text-darkcocoa flex items-center gap-1">
                      <span>Paket Juragan Pro</span>
                      <Sparkles className="w-3.5 h-3.5 text-peach-500" />
                    </span>
                    <span className="text-[10px] bg-peach-500 text-white px-2 py-0.5 rounded-full font-bold">Favorit</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-softgray block mb-1">Harga Bulanan (Rp):</label>
                    <input
                      type="number"
                      value={proPrice}
                      onChange={(e) => setProPrice(Number(e.target.value))}
                      className="w-full bg-white border border-peach-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-peach-600 focus:outline-none focus:border-peach-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-softgray block mb-1">Maksimal Kamar:</label>
                    <input
                      type="number"
                      value={proRooms}
                      onChange={(e) => setProRooms(Number(e.target.value))}
                      className="w-full bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
                    />
                  </div>
                </div>

                {/* Enterprise */}
                <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-xs text-darkcocoa">Paket Konglomerat</span>
                    <span className="text-[10px] bg-lavender-100 text-lavender-600 px-2 py-0.5 rounded-full font-bold">Unlimited</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-softgray block mb-1">Harga Bulanan (Rp):</label>
                    <input
                      type="number"
                      value={enterprisePrice}
                      onChange={(e) => setEnterprisePrice(Number(e.target.value))}
                      className="w-full bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-softgray block mb-1">Maksimal Kamar:</label>
                    <input
                      type="text"
                      disabled
                      value="Unlimited (Tanpa Batas)"
                      className="w-full bg-cream-100 border border-cream-200 rounded-xl px-3 py-2 text-xs font-bold text-softgray cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Accounts Section */}
            <div className="border-t border-cream-100 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-black text-sm text-peach-600 uppercase tracking-wider">
                    2. Rekening Bank Transfer Resmi
                  </h4>
                  <p className="text-[11px] text-softgray">
                    Rekening ini akan otomatis tampil pada formulir pendaftaran tenant saat melakukan pembayaran manual.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddBank}
                  className="py-1.5 px-3 rounded-xl bg-peach-50 hover:bg-peach-100 text-peach-600 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Rekening</span>
                </button>
              </div>

              <div className="space-y-3">
                {bankAccountsList.map((bank, idx) => (
                  <div key={bank.id || idx} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-4">
                      <label className="text-[11px] font-bold text-softgray block mb-1">Nama Bank:</label>
                      <input
                        type="text"
                        value={bank.bankName}
                        onChange={(e) => handleUpdateBank(idx, 'bankName', e.target.value)}
                        placeholder="Contoh: BCA / Bank Mandiri"
                        className="w-full bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa font-bold focus:outline-none focus:border-peach-400"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="text-[11px] font-bold text-softgray block mb-1">Nomor Rekening:</label>
                      <input
                        type="text"
                        value={bank.accountNumber}
                        onChange={(e) => handleUpdateBank(idx, 'accountNumber', e.target.value)}
                        placeholder="Contoh: 8420-1928-31"
                        className="w-full bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa font-mono font-bold focus:outline-none focus:border-peach-400"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-bold text-softgray block mb-1">Atas Nama (a/n):</label>
                      <input
                        type="text"
                        value={bank.accountHolder}
                        onChange={(e) => handleUpdateBank(idx, 'accountHolder', e.target.value)}
                        placeholder="Contoh: Rumah KosanKu Indonesia"
                        className="w-full bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs text-darkcocoa font-semibold focus:outline-none focus:border-peach-400"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteBank(idx)}
                        className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        title="Hapus rekening ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="pt-4 border-t border-cream-200 flex justify-end">
              <button
                type="submit"
                className="py-3 px-6 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Harga &amp; Rekening Bank</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODALS INTEGRATION                                                        */}
      {/* ========================================================================= */}

      {/* 1. Modal Manual Approval */}
      <ManualApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        account={selectedAccountForApproval}
        onApproved={() => showToast('Akun pelanggan berhasil disetujui & diaktifkan! 🎉')}
      />

      {/* 2. Modal Proof Viewer (Lightbox Zoom) */}
      <ProofViewerModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        account={selectedAccountForProof}
        onOpenApproval={(acc) => {
          setSelectedAccountForApproval(acc);
          setIsApprovalModalOpen(true);
        }}
      />

      {/* 3. Modal Edit Account Lengkap */}
      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        account={selectedAccountForEdit}
        onSaved={(msg) => showToast(msg)}
      />
    </div>
  );
}

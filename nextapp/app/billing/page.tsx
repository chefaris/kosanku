'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Check,
  Search,
  Sparkles,
  Printer,
  Download,
  X,
  Share2,
  MessageCircle,
  Building,
  CreditCard,
  Plus,
  Calendar,
  FileText,
  User,
  Home,
  CheckCheck,
  Layers,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useKosStore, Invoice } from '../lib/store/useKosStore';
import { CatPawStamp } from '../components/ui/CatPawStamp';

export default function BillingPage() {
  const {
    properties,
    activePropertyId,
    invoices,
    rooms,
    tenants,
    settings,
    markInvoicePaid,
    addInvoice
  } = useKosStore();

  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'overdue' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Unified Invoice / Receipt Viewer Modal
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);

  // Modals for Generating Invoices
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Create Form State
  const defaultPropId = activePropertyId !== 'all' ? activePropertyId : (properties[0]?.id || 'prop-1');
  const [formPropertyId, setFormPropertyId] = useState(defaultPropId);
  const [formRoomId, setFormRoomId] = useState('');
  const [formTenantName, setFormTenantName] = useState('');
  const [formRoomNumber, setFormRoomNumber] = useState('');
  const [formPeriodMonth, setFormPeriodMonth] = useState('November 2026');
  const [formAmount, setFormAmount] = useState<number>(1500000);
  const [formDueDate, setFormDueDate] = useState('2026-11-05');
  const [formStatus, setFormStatus] = useState<'unpaid' | 'paid'>('unpaid');
  const [formPaymentMethod, setFormPaymentMethod] = useState('Transfer Bank BCA');
  const [formNotes, setFormNotes] = useState('Sewa Kamar Bulanan');

  // Bulk Generate Form State
  const [bulkMonth, setBulkMonth] = useState('November 2026');
  const [bulkDueDay, setBulkDueDay] = useState(5);

  const activeProperty = properties.find((p) => p.id === activePropertyId);

  const propertyInvoices = activePropertyId === 'all'
    ? invoices
    : invoices.filter((inv) => inv.propertyId === activePropertyId);

  const propertyRooms = activePropertyId === 'all'
    ? rooms
    : rooms.filter((r) => r.propertyId === activePropertyId);

  const propertyTenants = activePropertyId === 'all'
    ? tenants
    : tenants.filter((t) => t.propertyId === activePropertyId);

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Calculations from filtered invoices
  const totalAmount = propertyInvoices.reduce((sum, b) => sum + b.amount, 0);
  const collectedAmount = propertyInvoices
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);
  const unpaidAmount = propertyInvoices
    .filter((b) => b.status !== 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const filteredInvoices = propertyInvoices.filter((item) => {
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      item.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.periodMonth.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Open Create Modal and prefill with first occupied room if available
  const handleOpenCreateModal = () => {
    const targetPropId = activePropertyId !== 'all' ? activePropertyId : (properties[0]?.id || 'prop-1');
    setFormPropertyId(targetPropId);

    const availableOccupiedRooms = rooms.filter(
      (r) => (targetPropId === 'all' || r.propertyId === targetPropId) && r.status === 'occupied'
    );

    if (availableOccupiedRooms.length > 0) {
      const firstRoom = availableOccupiedRooms[0];
      setFormRoomId(firstRoom.id);
      setFormRoomNumber(firstRoom.number);
      setFormAmount(firstRoom.price);

      const tenant = tenants.find((t) => t.roomId === firstRoom.id || t.id === firstRoom.tenantId);
      setFormTenantName(tenant?.name || firstRoom.tenantName || 'Penghuni Kamar ' + firstRoom.number);
      const dueDay = tenant?.dueDayOfMonth || 5;
      setFormDueDate(`2026-11-${String(dueDay).padStart(2, '0')}`);
    } else {
      setFormRoomId('');
      setFormRoomNumber('K-101');
      setFormTenantName('');
      setFormAmount(1500000);
      setFormDueDate('2026-11-05');
    }

    setFormPeriodMonth('November 2026');
    setFormStatus('unpaid');
    setFormPaymentMethod('Transfer Bank BCA');
    setFormNotes('Sewa Kamar Bulanan');
    setIsCreateModalOpen(true);
  };

  // When room selection changes in Create Modal
  const handleRoomSelectChange = (roomId: string) => {
    setFormRoomId(roomId);
    if (!roomId) return;

    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setFormRoomNumber(room.number);
      setFormAmount(room.price);
      const tenant = tenants.find((t) => t.roomId === room.id || t.id === room.tenantId);
      if (tenant) {
        setFormTenantName(tenant.name);
        const dueDay = tenant.dueDayOfMonth || 5;
        setFormDueDate(`2026-11-${String(dueDay).padStart(2, '0')}`);
      } else if (room.tenantName) {
        setFormTenantName(room.tenantName);
      }
    }
  };

  // Submit Single Invoice Creation
  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTenantName.trim() || !formRoomNumber.trim()) {
      alert('Mohon isi nama penghuni dan nomor kamar.');
      return;
    }

    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const seq = Math.floor(100 + Math.random() * 900);
    const invoiceNumber = `INV/${yearMonth}/${seq}`;

    const paidAt = formStatus === 'paid' ? now.toISOString().split('T')[0] : undefined;
    const paymentMethod = formStatus === 'paid' ? formPaymentMethod : undefined;

    const matchedTenant = tenants.find(
      (t) => t.name.toLowerCase() === formTenantName.toLowerCase() || t.roomId === formRoomId
    );

    const newInv: Omit<Invoice, 'id'> = {
      propertyId: formPropertyId,
      invoiceNumber,
      tenantId: matchedTenant?.id || 't-' + Date.now(),
      tenantName: formTenantName.trim(),
      roomId: formRoomId || 'r-manual',
      roomNumber: formRoomNumber.trim(),
      amount: formAmount,
      dueDate: formDueDate,
      periodMonth: formPeriodMonth,
      status: formStatus,
      paidAt,
      paymentMethod
    };

    addInvoice(newInv);
    setIsCreateModalOpen(false);

    showToast(`Invoice ${invoiceNumber} untuk ${formTenantName} berhasil diterbitkan! 🧾✨`);

    // Automatically preview the newly generated invoice
    setSelectedInvoiceForView({
      ...newInv,
      id: 'inv-' + Date.now().toString(36)
    });
  };

  // Bulk Generate Monthly Invoices for Occupied Rooms
  const handleBulkGenerate = () => {
    const targetPropId = activePropertyId !== 'all' ? activePropertyId : null;
    const occupiedRooms = rooms.filter(
      (r) => (!targetPropId || r.propertyId === targetPropId) && r.status === 'occupied'
    );

    if (occupiedRooms.length === 0) {
      alert('Tidak ada kamar terisi untuk di-generate tagihannya pada properti ini.');
      return;
    }

    let createdCount = 0;
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

    occupiedRooms.forEach((room, index) => {
      // Check if invoice already exists for this room & period
      const existing = invoices.find(
        (inv) =>
          inv.roomId === room.id &&
          inv.periodMonth.toLowerCase() === bulkMonth.toLowerCase()
      );

      if (!existing) {
        const tenant = tenants.find((t) => t.roomId === room.id || t.id === room.tenantId);
        const tenantName = tenant?.name || room.tenantName || 'Penghuni Kamar ' + room.number;
        const tenantDueDay = tenant?.dueDayOfMonth || bulkDueDay;
        const seq = String(100 + index + Math.floor(Math.random() * 50)).padStart(3, '0');
        const invoiceNumber = `INV/${yearMonth}/${seq}`;

        addInvoice({
          propertyId: room.propertyId,
          invoiceNumber,
          tenantId: tenant?.id || room.tenantId || 't-auto',
          tenantName,
          roomId: room.id,
          roomNumber: room.number,
          amount: room.price,
          dueDate: `2026-11-${String(tenantDueDay).padStart(2, '0')}`,
          periodMonth: bulkMonth,
          status: 'unpaid'
        });
        createdCount++;
      }
    });

    setIsBulkModalOpen(false);
    if (createdCount > 0) {
      showToast(`🎉 Sukses! ${createdCount} tagihan sewa baru telah di-generate untuk periode ${bulkMonth}! 🧾`);
    } else {
      showToast(`Semua kamar terisi sudah memiliki tagihan untuk periode ${bulkMonth}. ✅`);
    }
  };

  // Mark invoice as paid
  const handleMarkAsPaid = (id: string, tenantName: string) => {
    const today = new Date().toISOString().split('T')[0];
    markInvoicePaid(id, 'Transfer Bank BCA');

    const updated = invoices.find((inv) => inv.id === id);
    if (updated) {
      const paidInvoice: Invoice = {
        ...updated,
        status: 'paid',
        paidAt: today,
        paymentMethod: 'Transfer Bank BCA'
      };
      setSelectedInvoiceForView(paidInvoice);
    }
    showToast(`Tagihan sewa ${tenantName} LUNAS! Stempel kaki kucing resmi diterbitkan 🐾✨`);
  };

  // Send WhatsApp notification
  const handleSendWa = (inv: Invoice) => {
    const tenant = tenants.find((t) => t.id === inv.tenantId || t.name === inv.tenantName);
    const phone = tenant ? tenant.phone.replace(/[^0-9]/g, '').replace(/^0/, '62') : '';

    const isPaid = inv.status === 'paid';
    const waText = isPaid
      ? encodeURIComponent(
          `Halo Kak ${inv.tenantName}! 👋\n\nTerima kasih banyak! Pembayaran sewa kamar *${inv.roomNumber}* periode *${inv.periodMonth}* sebesar *${formatRupiah(inv.amount)}* telah *LUNAS TERVERIFIKASI* dengan Stempel Resmi KosanKu 🐾✨\n\nNomor Kuitansi: ${inv.invoiceNumber}\nTanggal: ${inv.paidAt || 'Hari Ini'}\n\nSalam hangat dari Mimi si Kucing Kos & Pengelola ${settings.kosName}! 🏡🌸`
        )
      : encodeURIComponent(
          `Halo Kak ${inv.tenantName}! 👋 Salam manis dari KosanKu & Mimi si Kucing Kos 🐱✨\n\nSekadar info manis, tagihan sewa kamar *${inv.roomNumber}* sebesar *${formatRupiah(inv.amount)}* untuk periode *${inv.periodMonth}* akan jatuh tempo pada *${inv.dueDate}*.\n\nPembayaran via Transfer ${settings.bankName}: *${settings.accountNumber}* (a.n *${settings.accountHolder}*).\n\nTerima kasih banyak sudah menjaga kenyamanan kost bersama Mimi! 🏡🌸`
        );

    if (phone) {
      window.open(`https://wa.me/${phone}?text=${waText}`, '_blank');
    } else {
      alert(`Pesan WhatsApp siap dikirimkan ke ${inv.tenantName}.`);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 font-body text-darkcocoa">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-matcha-500 text-white px-5 py-3.5 rounded-2xl shadow-cute flex items-center gap-3 font-semibold text-sm max-w-md"
          >
            <Sparkles className="w-5 h-5 text-matcha-100 flex-shrink-0 animate-spin" strokeWidth={1.75} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Title & Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight flex items-center gap-2">
            <span>Kasir &amp; Tagihan Sewa</span>
            <span className="text-2xl">🧾</span>
          </h1>
          <p className="text-softgray text-xs sm:text-sm mt-1">
            {activeProperty
              ? `Menampilkan tagihan sewa untuk area ${activeProperty.name} (${activeProperty.address})`
              : 'Pantau tagihan sewa bulanan, generate invoice otomatis, cetak kuitansi stempel kaki kucing, dan kirim pengingat WA.'}
          </p>
        </div>

        {/* Action Buttons: Buat Tagihan Baru & Generate Massal */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-cream-100 text-darkcocoa text-xs font-bold border border-cream-200 shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
            title="Generate invoice untuk semua kamar terisi dalam 1 kali klik"
          >
            <Sparkles className="w-4 h-4 text-peach-500" />
            <span>⚡ Generate Tagihan Bulanan</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white text-xs font-bold shadow-cute flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Tagihan Baru</span>
          </button>
        </div>
      </motion.div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-peach-400 border-cream-200"
        >
          <span className="text-xs font-bold text-softgray block">Total Tagihan Periode Ini</span>
          <div className="text-2xl font-extrabold font-heading text-darkcocoa mt-2">
            {formatRupiah(totalAmount)}
          </div>
          <p className="text-xs text-softgray mt-1">{propertyInvoices.length} tagihan tercatat</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-matcha-400 border-cream-200"
        >
          <span className="text-xs font-bold text-softgray block">Uang Sewa Terkumpul</span>
          <div className="text-2xl font-extrabold font-heading text-matcha-600 mt-2">
            {formatRupiah(collectedAmount)}
          </div>
          <p className="text-xs text-matcha-600 font-bold mt-1">
            {totalAmount > 0 ? `${Math.round((collectedAmount / totalAmount) * 100)}% lunas` : '0%'}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-3xl p-5 shadow-cute border-l-4 border-sakura-400 border-cream-200"
        >
          <span className="text-xs font-bold text-softgray block">Sisa Tagihan Belum Masuk</span>
          <div className="text-2xl font-extrabold font-heading text-peach-600 mt-2">
            {formatRupiah(unpaidAmount)}
          </div>
          <p className="text-xs text-softgray mt-1">
            {propertyInvoices.filter((i) => i.status !== 'paid').length} penyewa belum bayar
          </p>
        </motion.div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              filterStatus === 'all'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Semua ({propertyInvoices.length})
          </button>
          <button
            onClick={() => setFilterStatus('overdue')}
            className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              filterStatus === 'overdue'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Jatuh Tempo ({propertyInvoices.filter((i) => i.status === 'overdue').length})
          </button>
          <button
            onClick={() => setFilterStatus('unpaid')}
            className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              filterStatus === 'unpaid'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Belum Bayar ({propertyInvoices.filter((i) => i.status === 'unpaid').length})
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              filterStatus === 'paid'
                ? 'bg-peach-500 text-white shadow-cute'
                : 'bg-white text-softgray hover:bg-cream-100 border border-cream-200'
            }`}
          >
            Lunas ({propertyInvoices.filter((i) => i.status === 'paid').length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-softgray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari penghuni, no invoice, kamar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-cream-200 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-darkcocoa focus:outline-none focus:border-peach-400 shadow-sm"
          />
        </div>
      </div>

      {/* Table View for Desktop */}
      <div className="hidden md:block bg-white rounded-3xl shadow-cute border border-cream-200 overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-cream-50/80 border-b border-cream-200 text-softgray font-bold">
              <th className="py-3.5 px-4">No. Invoice</th>
              <th className="py-3.5 px-4">Penghuni &amp; Kamar</th>
              <th className="py-3.5 px-4">Periode</th>
              <th className="py-3.5 px-4">Nominal</th>
              <th className="py-3.5 px-4">Jatuh Tempo</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi Kasir &amp; Cetak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-cream-50/50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-darkcocoa">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3 px-4">
                  <div className="font-extrabold text-darkcocoa">{inv.tenantName}</div>
                  <div className="text-[11px] text-peach-600 font-bold">{inv.roomNumber}</div>
                </td>
                <td className="py-3 px-4 text-softgray font-medium">{inv.periodMonth}</td>
                <td className="py-3 px-4 font-extrabold text-darkcocoa">
                  {formatRupiah(inv.amount)}
                </td>
                <td className="py-3 px-4 font-semibold text-softgray">{inv.dueDate}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      inv.status === 'paid'
                        ? 'bg-matcha-100 text-matcha-700 border border-matcha-300'
                        : inv.status === 'overdue'
                        ? 'bg-peach-100 text-peach-600 border border-peach-300'
                        : 'bg-sakura-100 text-sakura-600 border border-sakura-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-matcha-500'
                          : inv.status === 'overdue'
                          ? 'bg-peach-500'
                          : 'bg-sakura-400'
                      }`}
                    />
                    {inv.status === 'paid'
                      ? 'Lunas'
                      : inv.status === 'overdue'
                      ? 'Jatuh Tempo'
                      : 'Belum Bayar'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Document (Invoice or Paid Receipt) */}
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceForView(inv)}
                      className="bg-cream-100 hover:bg-cream-200 text-darkcocoa px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-cream-200 transition-colors"
                      title={inv.status === 'paid' ? 'Lihat Kuitansi Resmi' : 'Lihat Invoice Tagihan'}
                    >
                      <Receipt className="w-3.5 h-3.5 text-peach-500" />
                      <span>{inv.status === 'paid' ? 'Kuitansi' : 'Invoice'}</span>
                    </button>

                    {inv.status !== 'paid' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSendWa(inv)}
                          className="bg-peach-50 hover:bg-peach-100 text-peach-600 px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-peach-200 transition-colors"
                          title="Kirim pengingat WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>WA</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkAsPaid(inv.id, inv.tenantName)}
                          className="bg-matcha-500 hover:bg-matcha-400 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-sm transition-colors"
                          title="Tandai pembayaran Lunas dan terbitkan stempel kaki kucing"
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          <span>Lunas</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendWa(inv)}
                        className="bg-matcha-50 hover:bg-matcha-100 text-matcha-700 px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-matcha-200 transition-colors"
                        title="Kirim bukti kuitansi via WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards View for Mobile */}
      <div className="md:hidden space-y-3">
        {filteredInvoices.map((inv) => (
          <div
            key={inv.id}
            className="bg-white rounded-3xl p-4 shadow-cute border border-cream-200 space-y-3 text-xs"
          >
            <div className="flex items-center justify-between border-b border-cream-100 pb-2">
              <span className="font-mono font-bold text-darkcocoa">{inv.invoiceNumber}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  inv.status === 'paid'
                    ? 'bg-matcha-100 text-matcha-700'
                    : inv.status === 'overdue'
                    ? 'bg-peach-100 text-peach-600'
                    : 'bg-sakura-100 text-sakura-600'
                }`}
              >
                {inv.status === 'paid'
                  ? 'Lunas'
                  : inv.status === 'overdue'
                  ? 'Jatuh Tempo'
                  : 'Belum Bayar'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-darkcocoa">{inv.tenantName}</h3>
                <p className="text-peach-600 font-bold">{inv.roomNumber}</p>
                <p className="text-softgray text-[10px] mt-0.5">{inv.periodMonth}</p>
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-darkcocoa">
                  {formatRupiah(inv.amount)}
                </div>
                <p className="text-softgray text-[10px]">{inv.dueDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cream-100">
              <button
                type="button"
                onClick={() => setSelectedInvoiceForView(inv)}
                className="bg-cream-100 text-darkcocoa px-3 py-1.5 rounded-xl font-bold flex items-center gap-1"
              >
                <Receipt className="w-3.5 h-3.5 text-peach-500" />
                <span>{inv.status === 'paid' ? 'Kuitansi' : 'Invoice'}</span>
              </button>

              {inv.status !== 'paid' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSendWa(inv)}
                    className="bg-peach-50 text-peach-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-peach-200"
                  >
                    <Send className="w-3 h-3" />
                    <span>WA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAsPaid(inv.id, inv.tenantName)}
                    className="bg-matcha-500 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Lunas</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendWa(inv)}
                  className="bg-matcha-50 text-matcha-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-matcha-200"
                >
                  <Send className="w-3 h-3" />
                  <span>Kirim</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="p-8 bg-white rounded-3xl border border-cream-200 text-center space-y-2">
          <Receipt className="w-8 h-8 text-softgray mx-auto" />
          <p className="font-bold text-darkcocoa">Tidak ada tagihan yang cocok</p>
          <p className="text-xs text-softgray">Coba pilih filter lain atau buat tagihan sewa baru.</p>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: BUAT TAGIHAN SEWA BARU (MANUAL GENERATE INVOICE)
          ===================================================================== */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-darkcocoa/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-5 sm:p-7 max-w-lg w-full space-y-4 font-body my-8"
            >
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-peach-100 text-peach-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                      Buat Tagihan Sewa Baru
                    </h3>
                    <p className="text-xs text-softgray">Terbitkan invoice sewa kamar atau biaya tambahan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs">
                {/* Property selector if multiple */}
                {properties.length > 1 && (
                  <div>
                    <label className="font-bold text-softgray block mb-1">Cabang Properti Kos</label>
                    <select
                      value={formPropertyId}
                      onChange={(e) => {
                        setFormPropertyId(e.target.value);
                      }}
                      className="w-full bg-cream-50 border border-cream-200 rounded-2xl px-3 py-2 text-darkcocoa font-semibold focus:outline-none focus:border-peach-400"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Pilih Unit Kamar & Penghuni Terisi */}
                <div>
                  <label className="font-bold text-softgray block mb-1">
                    Pilih Kamar / Penghuni Terdaftar
                  </label>
                  <select
                    value={formRoomId}
                    onChange={(e) => handleRoomSelectChange(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-2xl px-3 py-2 text-darkcocoa font-semibold focus:outline-none focus:border-peach-400"
                  >
                    <option value="">-- Pilih Kamar Terisi atau Input Bebas --</option>
                    {rooms
                      .filter((r) => r.propertyId === formPropertyId && r.status === 'occupied')
                      .map((r) => {
                        const t = tenants.find((item) => item.roomId === r.id || item.id === r.tenantId);
                        return (
                          <option key={r.id} value={r.id}>
                            Kamar {r.number} • {t?.name || r.tenantName || 'Terisi'} ({formatRupiah(r.price)}/bln)
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-softgray block mb-1">Nama Penghuni *</label>
                    <input
                      type="text"
                      required
                      placeholder="cth: Budi Santoso"
                      value={formTenantName}
                      onChange={(e) => setFormTenantName(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-2xl px-3 py-2 text-darkcocoa font-semibold focus:outline-none focus:border-peach-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-softgray block mb-1">Nomor Unit Kamar *</label>
                    <input
                      type="text"
                      required
                      placeholder="cth: K-101"
                      value={formRoomNumber}
                      onChange={(e) => setFormRoomNumber(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-2xl px-3 py-2 text-darkcocoa font-semibold focus:outline-none focus:border-peach-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-softgray block mb-1">Periode Tagihan</label>
                    <select
                      value={formPeriodMonth}
                      onChange={(e) => setFormPeriodMonth(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-2xl px-3 py-2 text-darkcocoa font-semibold focus:outline-none focus:border-peach-400"
                    >
                      <option value="November 2026">November 2026</option>
                      <option value="Desember 2026">Desember 2026</option>
                      <option value="Januari 2027">Januari 2027</option>
                      <option value="Februari 2027">Februari 2027</option>
                      <option value="Maret 2027">Maret 2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-softgray block mb-1">Tanggal Jatuh Tempo</label>
                    <input
                      type="date"
                      required
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-2xl px-3 py-2 text-darkcocoa font-semibold focus:outline-none focus:border-peach-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-softgray block mb-1">Nominal Tagihan (Rp) *</label>
                    <input
                      type="number"
                      min={0}
                      step={50000}
                      required
                      value={formAmount}
                      onChange={(e) => setFormAmount(Number(e.target.value))}
                      className="w-full bg-cream-50 border border-cream-200 rounded-2xl px-3 py-2 text-darkcocoa font-bold text-sm focus:outline-none focus:border-peach-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-softgray block mb-1">Status Pembayaran</label>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="statusRadio"
                          checked={formStatus === 'unpaid'}
                          onChange={() => setFormStatus('unpaid')}
                          className="text-peach-500 focus:ring-peach-400"
                        />
                        <span className="font-bold text-peach-600">Belum Bayar</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer ml-3">
                        <input
                          type="radio"
                          name="statusRadio"
                          checked={formStatus === 'paid'}
                          onChange={() => setFormStatus('paid')}
                          className="text-matcha-500 focus:ring-matcha-400"
                        />
                        <span className="font-bold text-matcha-600">Langsung Lunas 🐾</span>
                      </label>
                    </div>
                  </div>
                </div>

                {formStatus === 'paid' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-matcha-50 rounded-2xl border border-matcha-200 space-y-2"
                  >
                    <label className="font-bold text-matcha-800 block">Metode Pembayaran Pelunasan</label>
                    <select
                      value={formPaymentMethod}
                      onChange={(e) => setFormPaymentMethod(e.target.value)}
                      className="w-full bg-white border border-matcha-200 rounded-xl px-3 py-1.5 text-xs text-darkcocoa font-semibold"
                    >
                      <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                      <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                      <option value="Transfer Bank BRI">Transfer Bank BRI</option>
                      <option value="QRIS / Gopay / OVO">QRIS / Gopay / OVO</option>
                      <option value="Tunai / Kasir Kos">Tunai / Kasir Kos</option>
                    </select>
                    <p className="text-[10px] text-matcha-700">
                      ✨ Kuitansi resmi berstempel lunas logo kaki kucing KosanKu akan langsung diterbitkan setelah disimpan.
                    </p>
                  </motion.div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa font-bold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold shadow-cute flex items-center gap-1.5 transition-all"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Terbitkan Tagihan 🧾</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MODAL 2: GENERATE TAGIHAN BULANAN OTOMATIS (BULK GENERATOR)
          ===================================================================== */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-darkcocoa/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-6 sm:p-8 max-w-md w-full space-y-5 font-body"
            >
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-peach-100 text-peach-500 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                      Generate Tagihan Bulanan ⚡
                    </h3>
                    <p className="text-xs text-softgray">Buat tagihan massal otomatis untuk semua kamar terisi</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-softgray block mb-1.5">Pilih Periode Bulan Tagihan</label>
                  <select
                    value={bulkMonth}
                    onChange={(e) => setBulkMonth(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
                  >
                    <option value="November 2026">November 2026</option>
                    <option value="Desember 2026">Desember 2026</option>
                    <option value="Januari 2027">Januari 2027</option>
                    <option value="Februari 2027">Februari 2027</option>
                    <option value="Maret 2027">Maret 2027</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-softgray block mb-1.5">Standar Tanggal Jatuh Tempo</label>
                  <div className="flex items-center gap-2">
                    <span className="text-softgray font-semibold">Tanggal</span>
                    <input
                      type="number"
                      min={1}
                      max={28}
                      value={bulkDueDay}
                      onChange={(e) => setBulkDueDay(Number(e.target.value))}
                      className="w-20 bg-cream-50 border border-cream-200 rounded-xl px-3 py-1.5 font-bold text-center text-darkcocoa"
                    />
                    <span className="text-softgray font-semibold">setiap bulannya</span>
                  </div>
                </div>

                <div className="p-4 bg-peach-50 rounded-2xl border border-peach-200 space-y-1.5">
                  <div className="font-bold text-peach-700 flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-peach-500" />
                    <span>Pratinjau Kamar Terisi</span>
                  </div>
                  <p className="text-softgray text-[11px] leading-relaxed">
                    Sistem mendeteksi{' '}
                    <strong className="text-darkcocoa">
                      {rooms.filter((r) => r.status === 'occupied').length} kamar aktif berpenghuni
                    </strong>{' '}
                    di seluruh cabang. Tagihan yang sudah ada untuk periode {bulkMonth} tidak akan dibuat dobel.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleBulkGenerate}
                  className="px-5 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs shadow-cute flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Tagihan Sekarang 🚀</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MODAL 3: PRATINJAU CETAK INVOICE & KUITANSI (DENGAN STEMPEL KAKI KUCING 🐾)
          ===================================================================== */}
      <AnimatePresence>
        {selectedInvoiceForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-darkcocoa/60 backdrop-blur-sm print:p-0 print:bg-transparent overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="printable-invoice relative bg-white rounded-3xl shadow-2xl border border-cream-200 p-6 md:p-8 max-w-lg w-full space-y-5 font-body overflow-hidden my-6"
            >
              {/* Close Button (Hidden on Print) */}
              <button
                type="button"
                onClick={() => setSelectedInvoiceForView(null)}
                className="print-hide absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa transition-colors"
                title="Tutup Pratinjau"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Dokumen Kuitansi / Invoice */}
              <div className="flex items-start justify-between border-b-2 border-dashed border-cream-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-peach-300 shadow-sm flex-shrink-0">
                    <Image
                      src="/mimi-mascot.jpg"
                      alt="Mimi si Kucing Kos"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base sm:text-lg text-peach-500 leading-tight">
                      {selectedInvoiceForView.status === 'paid'
                        ? 'KUITANSI RESMI PEMBAYARAN'
                        : 'INVOICE TAGIHAN SEWA'}
                    </h3>
                    <p className="text-xs font-bold text-darkcocoa">
                      {properties.find((p) => p.id === selectedInvoiceForView.propertyId)?.name || settings.kosName}
                    </p>
                    <p className="text-[10px] text-softgray">
                      {properties.find((p) => p.id === selectedInvoiceForView.propertyId)?.address || settings.kosAddress || 'Bandung'} • Dokumen Sah
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-darkcocoa block">
                    {selectedInvoiceForView.invoiceNumber}
                  </span>
                  <span
                    className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1 ${
                      selectedInvoiceForView.status === 'paid'
                        ? 'bg-matcha-100 text-matcha-700 border border-matcha-300'
                        : 'bg-peach-100 text-peach-700 border border-peach-300'
                    }`}
                  >
                    {selectedInvoiceForView.status === 'paid' ? 'LUNAS SAH' : 'BELUM DIBAYAR'}
                  </span>
                </div>
              </div>

              {/* Rincian Tagihan / Kuitansi & Floating Stempel Kaki Kucing */}
              <div className="space-y-2.5 text-xs relative">
                <div className="flex justify-between py-0.5">
                  <span className="text-softgray font-medium">Nomor Dokumen:</span>
                  <span className="font-mono font-bold text-darkcocoa">
                    {selectedInvoiceForView.invoiceNumber}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-softgray font-medium">
                    {selectedInvoiceForView.status === 'paid' ? 'Diterima Dari:' : 'Ditujukan Kepada:'}
                  </span>
                  <span className="font-bold text-darkcocoa">{selectedInvoiceForView.tenantName}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-softgray font-medium">Unit Kamar Sewa:</span>
                  <span className="font-bold text-peach-600">{selectedInvoiceForView.roomNumber}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-softgray font-medium">Untuk Pembayaran:</span>
                  <span className="font-semibold text-darkcocoa">
                    Sewa Periode {selectedInvoiceForView.periodMonth}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-softgray font-medium">Jatuh Tempo:</span>
                  <span className="font-semibold text-darkcocoa">{selectedInvoiceForView.dueDate}</span>
                </div>

                {selectedInvoiceForView.status === 'paid' ? (
                  <>
                    <div className="flex justify-between py-0.5">
                      <span className="text-softgray font-medium">Metode Pembayaran:</span>
                      <span className="font-semibold text-darkcocoa">
                        {selectedInvoiceForView.paymentMethod || 'Transfer Bank'}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-softgray font-medium">Tanggal Pelunasan:</span>
                      <span className="font-semibold text-darkcocoa">
                        {selectedInvoiceForView.paidAt || 'Hari Ini'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-0.5">
                    <span className="text-softgray font-medium">Status Pembayaran:</span>
                    <span className="font-bold text-peach-600">Menunggu Transfer</span>
                  </div>
                )}

                <div className="pt-3 border-t-2 border-dashed border-cream-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-darkcocoa">
                    {selectedInvoiceForView.status === 'paid' ? 'Jumlah Yang Diterima:' : 'Total Tagihan Sewa:'}
                  </span>
                  <span className="font-heading font-extrabold text-xl text-matcha-600">
                    {formatRupiah(selectedInvoiceForView.amount)}
                  </span>
                </div>

                {/* STEMPEL RESMI LOGO KAKI KUCING 🐾 (Floating Stamp) */}
                {selectedInvoiceForView.status === 'paid' && (
                  <div className="absolute right-2 -bottom-5 pointer-events-none z-10">
                    <CatPawStamp
                      date={selectedInvoiceForView.paidAt || 'Hari Ini'}
                      variant="emerald"
                      size="md"
                      subtext="KOSANKU • MIMI 🐾"
                    />
                  </div>
                )}
              </div>

              {/* Banner Status Bawah Dokumen */}
              {selectedInvoiceForView.status === 'paid' ? (
                <div className="bg-matcha-50 rounded-2xl p-3 border border-matcha-200 flex items-center gap-3 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-matcha-500 text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-matcha-800 font-extrabold text-xs block">
                      PEMBAYARAN RESMI DIVERIFIKASI LUNAS
                    </span>
                    <p className="text-[10px] text-softgray">
                      Dicap sah dengan segel stempel kaki kucing KosanKu &amp; Mimi si Kucing Kos! 🐾✨
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-peach-50 rounded-2xl p-3.5 border border-peach-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-peach-700 font-bold text-xs">
                    <CreditCard className="w-4 h-4 text-peach-500" />
                    <span>Rekening Tujuan Pembayaran Sewa:</span>
                  </div>
                  <div className="bg-white/80 rounded-xl p-2.5 border border-peach-200/80 font-mono text-xs text-darkcocoa space-y-0.5">
                    <p className="font-bold">
                      {settings.bankName}: <span className="text-peach-600">{settings.accountNumber}</span>
                    </p>
                    <p className="text-[11px] text-softgray">a.n {settings.accountHolder}</p>
                  </div>
                  <p className="text-[10px] text-softgray">
                    Harap mencantumkan nama dan nomor kamar saat melakukan transfer.
                  </p>
                </div>
              )}

              {/* Action Buttons (Hidden on Print / PDF Export) */}
              <div className="print-hide flex items-center justify-between gap-2 pt-3 border-t border-cream-100 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2.5 rounded-2xl text-xs font-bold text-darkcocoa bg-cream-100 hover:bg-cream-200 flex items-center gap-1.5 transition-colors shadow-sm"
                    title="Cetak atau simpan sebagai dokumen PDF tanpa watermark browser"
                  >
                    <Printer className="w-4 h-4 text-peach-500" />
                    <span>Cetak / PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendWa(selectedInvoiceForView)}
                    className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-peach-600 bg-peach-50 hover:bg-peach-100 border border-peach-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim WA</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedInvoiceForView.status !== 'paid' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleMarkAsPaid(
                          selectedInvoiceForView.id,
                          selectedInvoiceForView.tenantName
                        )
                      }
                      className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-matcha-500 hover:bg-matcha-400 flex items-center gap-1.5 shadow-cute transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Tandai Lunas Sekarang 🐾</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceForView(null)}
                    className="px-4 py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-softgray hover:text-darkcocoa font-bold text-xs transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

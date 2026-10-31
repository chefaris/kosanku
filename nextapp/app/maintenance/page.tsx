'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { useKosStore, MaintenanceTicket } from '../lib/store/useKosStore';

export default function MaintenancePage() {
  const {
    properties,
    activePropertyId,
    maintenanceTickets,
    addTicket,
    updateTicketStatus,
    rooms,
    addExpense
  } = useKosStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeProperty = properties.find((p) => p.id === activePropertyId);

  // Filtered lists
  const propertyTickets = activePropertyId === 'all'
    ? maintenanceTickets
    : maintenanceTickets.filter((t) => t.propertyId === activePropertyId);

  const propertyRooms = activePropertyId === 'all'
    ? rooms
    : rooms.filter((r) => r.propertyId === activePropertyId);

  // Form states
  const [roomNumber, setRoomNumber] = useState(propertyRooms[0]?.number || 'K-101');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>('medium');
  const [technician, setTechnician] = useState('Pak Joko');
  const [cost, setCost] = useState(50000);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetPropId = activePropertyId !== 'all' ? activePropertyId : (propertyRooms[0]?.propertyId || 'prop-1');

    addTicket({
      propertyId: targetPropId,
      roomNumber,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'new',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      technician: technician.trim() || undefined,
      cost: Number(cost) || undefined
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    showToast('Tiket keluhan fasilitas berhasil dibuat! 🔧');
  };

  const handleStatusChange = (id: string, newStatus: MaintenanceTicket['status'], ticketCost?: number, ticketTitle?: string) => {
    updateTicketStatus(id, newStatus);

    if (newStatus === 'resolved') {
      showToast('Tiket keluhan berhasil diselesaikan! ✨');
      // If there's a cost, optionally record it to expenses
      if (ticketCost && ticketCost > 0) {
        const ticket = maintenanceTickets.find((t) => t.id === id);
        addExpense({
          propertyId: ticket?.propertyId,
          title: `Biaya Perbaikan: ${ticketTitle || 'Servis Fasilitas'}`,
          category: 'maintenance',
          amount: ticketCost,
          date: new Date().toISOString().split('T')[0]
        });
      }
    } else {
      showToast('Status tiket berhasil diperbarui.');
    }
  };

  const newTickets = propertyTickets.filter((t) => t.status === 'new');
  const inProgressTickets = propertyTickets.filter((t) => t.status === 'in_progress');
  const completedTickets = propertyTickets.filter((t) => t.status === 'resolved');

  const getPriorityBadge = (p: MaintenanceTicket['priority']) => {
    switch (p) {
      case 'urgent':
        return (
          <span className="bg-peach-100 text-peach-600 border border-peach-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Urgent
          </span>
        );
      case 'medium':
        return (
          <span className="bg-lavender-100 text-lavender-600 border border-lavender-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="bg-matcha-100 text-matcha-700 border border-matcha-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Low
          </span>
        );
    }
  };

  const renderTicketCard = (ticket: MaintenanceTicket) => (
    <motion.div
      key={ticket.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-3xl p-4 shadow-cute border border-cream-200 space-y-3 text-xs"
    >
      <div className="flex items-center justify-between border-b border-cream-100 pb-2">
        <span className="font-heading font-extrabold text-sm text-peach-600 px-2 py-0.5 rounded-lg bg-peach-50">
          {ticket.roomNumber}
        </span>
        {getPriorityBadge(ticket.priority)}
      </div>

      <div>
        <h4 className="font-heading font-extrabold text-sm text-darkcocoa leading-snug">
          {ticket.title}
        </h4>
        <p className="text-softgray text-[11px] mt-1 leading-relaxed line-clamp-3">
          {ticket.description}
        </p>
      </div>

      <div className="space-y-1 text-[11px] text-softgray pt-2 border-t border-cream-100">
        <div className="flex items-center justify-between">
          <span>Lapor: {ticket.date}</span>
          {ticket.cost ? (
            <span className="font-bold text-darkcocoa">
              Rp {ticket.cost.toLocaleString('id-ID')}
            </span>
          ) : null}
        </div>
        {ticket.technician && (
          <div className="text-darkcocoa font-semibold">
            Teknisi: {ticket.technician}
          </div>
        )}
      </div>

      {/* Kanban Move Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-cream-100">
        {ticket.status === 'in_progress' ? (
          <button
            onClick={() => handleStatusChange(ticket.id, 'new')}
            className="p-1 rounded-lg text-softgray hover:bg-cream-100 flex items-center gap-1 font-bold text-[10px]"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Baru</span>
          </button>
        ) : ticket.status === 'resolved' ? (
          <button
            onClick={() => handleStatusChange(ticket.id, 'in_progress')}
            className="p-1 rounded-lg text-softgray hover:bg-cream-100 flex items-center gap-1 font-bold text-[10px]"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Ditangani</span>
          </button>
        ) : (
          <div />
        )}

        {ticket.status === 'new' ? (
          <button
            onClick={() => handleStatusChange(ticket.id, 'in_progress')}
            className="bg-lavender-50 hover:bg-lavender-100 text-lavender-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-lavender-200 transition-colors"
          >
            <span>Tugaskan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : ticket.status === 'in_progress' ? (
          <button
            onClick={() => handleStatusChange(ticket.id, 'resolved', ticket.cost, ticket.title)}
            className="bg-matcha-400 hover:bg-matcha-300 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-sm transition-colors"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai</span>
          </button>
        ) : (
          <span className="text-matcha-600 font-bold text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tuntas</span>
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 font-body text-darkcocoa">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-matcha-400 text-white px-5 py-3.5 rounded-2xl shadow-cute flex items-center gap-3 font-semibold text-sm"
          >
            <Sparkles className="w-5 h-5 text-matcha-50 animate-spin" strokeWidth={1.75} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-darkcocoa tracking-tight">
            Papan Tiket Perawatan
          </h1>
          <p className="text-softgray text-xs sm:text-sm mt-1">
            Pantau laporan komplain fasilitas, penugasan teknisi, dan pencatatan biaya perbaikan
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto justify-center bg-peach-500 hover:bg-peach-400 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-cute flex items-center gap-1.5 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Buat Tiket Baru</span>
        </button>
      </motion.div>

      {/* Kanban Board 3 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
        {/* Kolom 1: Baru Masuk */}
        <div className="bg-cream-100/60 rounded-3xl p-4 border border-cream-200/80 space-y-3">
          <div className="flex items-center justify-between px-2 pb-1 border-b border-peach-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-peach-400" />
              <h3 className="font-heading font-extrabold text-sm text-darkcocoa">
                Baru Masuk
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-peach-100 text-peach-600">
              {newTickets.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[200px]">
            {newTickets.map(renderTicketCard)}
            {newTickets.length === 0 && (
              <div className="text-center py-10 text-xs text-softgray italic">
                Tidak ada tiket baru
              </div>
            )}
          </div>
        </div>

        {/* Kolom 2: Sedang Ditangani */}
        <div className="bg-cream-100/60 rounded-3xl p-4 border border-cream-200/80 space-y-3">
          <div className="flex items-center justify-between px-2 pb-1 border-b border-lavender-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lavender-400" />
              <h3 className="font-heading font-extrabold text-sm text-darkcocoa">
                Sedang Ditangani
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-lavender-100 text-lavender-600">
              {inProgressTickets.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[200px]">
            {inProgressTickets.map(renderTicketCard)}
            {inProgressTickets.length === 0 && (
              <div className="text-center py-10 text-xs text-softgray italic">
                Tidak ada pekerjaan aktif
              </div>
            )}
          </div>
        </div>

        {/* Kolom 3: Selesai */}
        <div className="bg-cream-100/60 rounded-3xl p-4 border border-cream-200/80 space-y-3">
          <div className="flex items-center justify-between px-2 pb-1 border-b border-matcha-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-matcha-400" />
              <h3 className="font-heading font-extrabold text-sm text-darkcocoa">
                Selesai Tuntas
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-matcha-100 text-matcha-600">
              {completedTickets.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[200px]">
            {completedTickets.map(renderTicketCard)}
            {completedTickets.length === 0 && (
              <div className="text-center py-10 text-xs text-softgray italic">
                Belum ada tiket yang selesai
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL BUAT TIKET BARU --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkcocoa/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-6 max-w-md w-full space-y-4 font-body"
            >
              <div className="flex items-center justify-between border-b border-cream-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-peach-100 flex items-center justify-center text-peach-500">
                    <Wrench className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                      Buat Tiket Perawatan
                    </h3>
                    <p className="text-xs text-softgray">Catat keluhan fasilitas kamar atau area umum</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Pilih Kamar</label>
                    <select
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                    >
                      {propertyRooms.map((r) => (
                        <option key={r.id} value={r.number}>
                          {r.number} ({r.status === 'occupied' ? r.tenantName : 'Kosong'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Prioritas</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as MaintenanceTicket['priority'])}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-semibold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                    >
                      <option value="urgent">Urgent (Bocor, Listrik padam)</option>
                      <option value="medium">Medium (Kran, Lampu)</option>
                      <option value="low">Low (Estetika, Cat)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Judul Keluhan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: AC bocor meneteskan air"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa font-bold text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-darkcocoa block mb-1">Deskripsi Masalah</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Jelaskan detail kerusakan..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-xl p-2.5 text-darkcocoa text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Teknisi Ditugaskan</label>
                    <input
                      type="text"
                      placeholder="Nama teknisi (opsional)"
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-darkcocoa block mb-1">Estimasi Biaya (Rp)</label>
                    <input
                      type="number"
                      step={10000}
                      value={cost}
                      onChange={(e) => setCost(Number(e.target.value))}
                      className="w-full bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 text-darkcocoa text-xs focus:outline-none focus:border-peach-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-softgray hover:bg-cream-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-peach-500 hover:bg-peach-400 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-cute"
                  >
                    Simpan Tiket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Edit2, Check, BedDouble, AlertCircle } from 'lucide-react';
import { useKosStore, RoomTypeItem } from '../../lib/store/useKosStore';

interface ManageRoomTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageRoomTypesModal({ isOpen, onClose }: ManageRoomTypesModalProps) {
  const { roomTypes, rooms, addRoomType, updateRoomType, deleteRoomType } = useKosStore();

  const [newTypeName, setNewTypeName] = useState('');
  const [newDefaultPrice, setNewDefaultPrice] = useState<number>(1500000);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(1500000);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    addRoomType({
      name: newTypeName.trim(),
      defaultPrice: Number(newDefaultPrice) || 1500000
    });
    setNewTypeName('');
    setNewDefaultPrice(1500000);
  };

  const handleStartEdit = (item: RoomTypeItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.defaultPrice || 1500000);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateRoomType(id, {
      name: editName.trim(),
      defaultPrice: Number(editPrice) || 1500000
    });
    setEditingId(null);
  };

  const handleDelete = (item: RoomTypeItem) => {
    const isUsed = rooms.some((r) => r.type.toLowerCase() === item.name.toLowerCase());
    if (isUsed) {
      if (!confirm(`Tipe kamar "${item.name}" saat ini sedang digunakan oleh beberapa kamar kos. Tetap ingin menghapus dari master?`)) {
        return;
      }
    } else {
      if (!confirm(`Hapus tipe kamar "${item.name}"?`)) {
        return;
      }
    }
    deleteRoomType(item.id);
  };

  const formatRupiah = (val: number) => 'Rp ' + (val || 0).toLocaleString('id-ID');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-darkcocoa/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl border border-cream-200 p-5 sm:p-7 max-w-lg w-full space-y-5 font-body text-darkcocoa my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-peach-100 flex items-center justify-center text-peach-600">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-darkcocoa">
                Kelola Master Tipe Kamar
              </h3>
              <p className="text-xs text-softgray">
                Tambah, ubah nama, atau sesuaikan tarif standar per tipe kamar 🐾
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of current room types */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {roomTypes.map((item) => {
            const isEditing = editingId === item.id;
            const countUsed = rooms.filter(
              (r) => r.type.toLowerCase() === item.name.toLowerCase()
            ).length;

            if (isEditing) {
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2.5 bg-cream-50 rounded-2xl border border-peach-300 text-xs"
                >
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-white border border-cream-200 rounded-xl px-2.5 py-1.5 font-bold text-darkcocoa text-xs"
                    placeholder="Nama Tipe"
                  />
                  <input
                    type="number"
                    step={50000}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-28 bg-white border border-cream-200 rounded-xl px-2.5 py-1.5 font-bold text-darkcocoa text-xs"
                    placeholder="Harga"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(item.id)}
                    className="bg-matcha-500 hover:bg-matcha-400 text-white p-2 rounded-xl text-xs font-bold shadow-sm"
                    title="Simpan"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="bg-cream-200 text-softgray p-2 rounded-xl text-xs font-bold"
                    title="Batal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-cream-50/70 border border-cream-200/60 text-xs hover:bg-cream-100/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-darkcocoa text-sm">{item.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream-200 text-softgray font-semibold">
                      {countUsed} Kamar
                    </span>
                  </div>
                  <span className="text-[11px] text-peach-600 font-bold">
                    Tarif Dasar: {formatRupiah(item.defaultPrice || 0)}/bln
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 text-softgray hover:text-darkcocoa hover:bg-white rounded-lg transition-colors"
                    title="Edit Tipe Kamar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 text-softgray hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                    title="Hapus Tipe Kamar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Add New Room Type */}
        <form
          onSubmit={handleAddSubmit}
          className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 space-y-2 text-xs"
        >
          <span className="text-xs font-bold text-darkcocoa block">+ Tambah Tipe Kamar Baru</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Nama Tipe (mis: Suite Balkon)"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
            />
            <input
              type="number"
              step={50000}
              required
              placeholder="Tarif Standar (Rp)"
              value={newDefaultPrice}
              onChange={(e) => setNewDefaultPrice(Number(e.target.value))}
              className="bg-white border border-cream-200 rounded-xl px-3 py-2 text-xs font-bold text-darkcocoa focus:outline-none focus:border-peach-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-peach-500 hover:bg-peach-400 text-white py-2 rounded-xl text-xs font-bold shadow-cute flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambahkan ke Master Tipe</span>
          </button>
        </form>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-cream-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-darkcocoa font-bold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}

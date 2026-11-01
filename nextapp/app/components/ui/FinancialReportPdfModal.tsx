'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X, Printer, Download, Sparkles, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { CatPawStamp } from './CatPawStamp';

interface FinancialTransactionItem {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  title: string;
  amount: number;
  status?: string;
}

interface FinancialReportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodLabel: string;
  propertyName: string;
  propertyAddress: string;
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  transactions: FinancialTransactionItem[];
}

export function FinancialReportPdfModal({
  isOpen,
  onClose,
  periodLabel,
  propertyName,
  propertyAddress,
  totalIncome,
  totalExpense,
  netCashFlow,
  transactions
}: FinancialReportPdfModalProps) {
  if (!isOpen) return null;

  const formatRupiah = (val: number) => 'Rp ' + (val || 0).toLocaleString('id-ID');

  return (
    <div className="print-modal-container fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-darkcocoa/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="printable-invoice relative bg-white rounded-3xl shadow-2xl border border-cream-200 p-6 sm:p-8 max-w-3xl w-full space-y-5 font-body text-darkcocoa my-auto print:p-4 print:shadow-none print:my-0"
      >
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="print-hide absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-softgray hover:text-darkcocoa transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Action Bar (Hidden on Print) */}
        <div className="print-hide flex items-center justify-between pb-3 border-b border-cream-200">
          <div>
            <h4 className="font-heading font-extrabold text-base text-darkcocoa">
              Pratinjau Laporan Keuangan Cetak / PDF
            </h4>
            <p className="text-xs text-softgray">
              Dokumen siap cetak atau disimpan sebagai PDF dengan stempel resmi pawskost 🐾
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTimeout(() => {
                window.print();
              }, 120);
            }}
            className="px-4 py-2 rounded-2xl bg-peach-500 hover:bg-peach-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-cute transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>

        {/* Report Header */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-cream-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-peach-300 shadow-sm flex-shrink-0">
              <Image
                src="/mimi-mascot.jpg"
                alt="pawskost mascot"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-peach-500">
                LAPORAN KAS &amp; LABA RUGI
              </h2>
              <p className="font-bold text-xs text-darkcocoa">{propertyName}</p>
              <p className="text-[10px] text-softgray">{propertyAddress}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-softgray block">Periode Laporan:</span>
            <span className="font-extrabold text-sm text-darkcocoa bg-peach-50 px-2.5 py-0.5 rounded-full border border-peach-200 inline-block">
              {periodLabel}
            </span>
            <p className="text-[10px] text-softgray mt-1">Dicetak: {new Date().toLocaleDateString('id-ID')}</p>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-matcha-50 rounded-2xl p-3 border border-matcha-200 text-center">
            <span className="text-[10px] font-bold text-matcha-700 block">Total Pemasukan</span>
            <span className="font-heading font-extrabold text-base text-matcha-600 block mt-0.5">
              {formatRupiah(totalIncome)}
            </span>
          </div>

          <div className="bg-peach-50 rounded-2xl p-3 border border-peach-200 text-center">
            <span className="text-[10px] font-bold text-peach-700 block">Total Beban Operasional</span>
            <span className="font-heading font-extrabold text-base text-peach-600 block mt-0.5">
              {formatRupiah(totalExpense)}
            </span>
          </div>

          <div className="bg-cream-100 rounded-2xl p-3 border border-cream-200 text-center">
            <span className="text-[10px] font-bold text-darkcocoa block">Estimasi Kas Bersih</span>
            <span className="font-heading font-extrabold text-base text-darkcocoa block mt-0.5">
              {formatRupiah(netCashFlow)}
            </span>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-darkcocoa block">
            Daftar Arus Transaksi ({transactions.length} baris)
          </span>
          <div className="max-h-80 overflow-y-auto border border-cream-200 rounded-2xl print:max-h-none print:overflow-visible">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-darkcocoa font-bold border-b border-cream-200 text-[11px]">
                <tr>
                  <th className="p-2.5">Tanggal</th>
                  <th className="p-2.5">Tipe</th>
                  <th className="p-2.5">Kategori</th>
                  <th className="p-2.5">Keterangan</th>
                  <th className="p-2.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-softgray text-xs">
                      Tidak ada transaksi dalam rentang periode ini.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-cream-50/50">
                      <td className="p-2.5 text-softgray font-mono text-[11px]">{t.date}</td>
                      <td className="p-2.5">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            t.type === 'income'
                              ? 'bg-matcha-100 text-matcha-700'
                              : 'bg-peach-100 text-peach-700'
                          }`}
                        >
                          {t.type === 'income' ? 'MASUK' : 'KELUAR'}
                        </span>
                      </td>
                      <td className="p-2.5 font-semibold text-darkcocoa">{t.category}</td>
                      <td className="p-2.5 text-softgray">{t.title}</td>
                      <td
                        className={`p-2.5 text-right font-bold ${
                          t.type === 'income' ? 'text-matcha-600' : 'text-peach-600'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'} {formatRupiah(t.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer & Cat Stamp */}
        <div className="relative pt-3 border-t-2 border-dashed border-cream-200 flex justify-between items-end text-xs">
          <div>
            <p className="text-[11px] text-softgray">
              Dokumen laporan keuangan terverifikasi sistem pawskost 🐾
            </p>
            <p className="text-[10px] text-softgray font-semibold">
              Kenyamanan kost &amp; ketertiban pembukuan terjamin bersama Mimi si Kucing Kos.
            </p>
          </div>

          <div className="pointer-events-none pr-4">
            <CatPawStamp
              date={new Date().toLocaleDateString('id-ID')}
              variant="rose"
              size="sm"
              subtext="PAWSKOST • RESMI 🐾"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import React from 'react';
import { PawPrint } from 'lucide-react';

interface CatPawStampProps {
  date?: string;
  variant?: 'emerald' | 'rose' | 'matcha';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  subtext?: string;
}

export const CatPawStamp: React.FC<CatPawStampProps> = ({
  date,
  variant = 'emerald',
  size = 'md',
  className = '',
  subtext = 'KOSANKU • MIMI 🐾'
}) => {
  // Color configuration matching official stamp ink
  const colors = {
    emerald: {
      border: 'border-emerald-600',
      innerBorder: 'border-emerald-600/70',
      text: 'text-emerald-700',
      bg: 'bg-emerald-500/10'
    },
    matcha: {
      border: 'border-matcha-600',
      innerBorder: 'border-matcha-600/70',
      text: 'text-matcha-700',
      bg: 'bg-matcha-500/10'
    },
    rose: {
      border: 'border-rose-600',
      innerBorder: 'border-rose-600/70',
      text: 'text-rose-700',
      bg: 'bg-rose-500/10'
    }
  }[variant] || {
    border: 'border-emerald-600',
    innerBorder: 'border-emerald-600/70',
    text: 'text-emerald-700',
    bg: 'bg-emerald-500/10'
  };

  const sizeClasses = {
    sm: {
      container: 'w-24 h-24 p-1',
      paw: 'w-6 h-6',
      title: 'text-sm tracking-wider',
      sub: 'text-[7px]',
      date: 'text-[7px]',
      header: 'text-[6px]'
    },
    md: {
      container: 'w-32 h-32 p-1.5',
      paw: 'w-8 h-8',
      title: 'text-lg tracking-wider',
      sub: 'text-[8px]',
      date: 'text-[8px]',
      header: 'text-[7px]'
    },
    lg: {
      container: 'w-40 h-40 p-2',
      paw: 'w-10 h-10',
      title: 'text-xl tracking-wider',
      sub: 'text-[9px]',
      date: 'text-[9px]',
      header: 'text-[8px]'
    }
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none transform -rotate-12 transition-transform ${sizeClasses.container} ${className}`}
      title="Stempel Lunas Resmi KosanKu"
    >
      {/* Outer Circle Ring */}
      <div
        className={`w-full h-full rounded-full border-4 ${colors.border} ${colors.bg} flex items-center justify-center p-1 shadow-sm relative`}
      >
        {/* Inner Dashed Ring */}
        <div
          className={`w-full h-full rounded-full border-2 border-dashed ${colors.innerBorder} flex flex-col items-center justify-center text-center p-1 relative overflow-hidden`}
        >
          {/* Top Label */}
          <span
            className={`font-black uppercase tracking-wider ${colors.text} ${sizeClasses.header} leading-none mb-0.5`}
          >
            ★ TERVERIFIKASI RESMI ★
          </span>

          {/* Center Paw & LUNAS */}
          <div className="flex flex-col items-center justify-center my-0.5">
            <div className={`relative ${colors.text}`}>
              <PawPrint
                className={`${sizeClasses.paw} stroke-[2.2] drop-shadow-sm`}
                fill="currentColor"
              />
            </div>
            <span
              className={`font-heading font-black ${colors.text} ${sizeClasses.title} uppercase leading-tight font-extrabold`}
              style={{
                fontFamily: 'Impact, Quicksand, sans-serif',
                letterSpacing: '0.1em'
              }}
            >
              LUNAS
            </span>
          </div>

          {/* Bottom Label & Date */}
          <div className="flex flex-col items-center leading-none mt-0.5">
            <span className={`font-black uppercase tracking-tighter ${colors.text} ${sizeClasses.sub}`}>
              {subtext}
            </span>
            {date && (
              <span className={`font-mono font-bold ${colors.text} ${sizeClasses.date} mt-0.5 opacity-90`}>
                {date}
              </span>
            )}
          </div>

          {/* Subtle Ink Grunge Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
export default CatPawStamp;

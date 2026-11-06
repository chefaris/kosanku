'use client';

import React from 'react';

interface PawskostLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  textClassName?: string;
  subtitle?: string;
}

export const PawskostLogo: React.FC<PawskostLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  textClassName = '',
  subtitle = 'Cari Kos Mudah & Cepat'
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-xl', icon: 'w-4 h-4', text: 'text-base sm:text-lg' },
    md: { box: 'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl', icon: 'w-5 h-5 sm:w-6 sm:h-6', text: 'text-xl sm:text-2xl' },
    lg: { box: 'w-12 h-12 rounded-2xl', icon: 'w-6 h-6', text: 'text-2xl' },
    xl: { box: 'w-14 h-14 sm:w-16 sm:h-16 rounded-3xl', icon: 'w-7 h-7 sm:w-8 sm:h-8', text: 'text-3xl' },
  };

  const current = sizeMap[size] || sizeMap.md;

  const iconElement = (
    <div
      className={`relative ${current.box} bg-gradient-to-tr from-peach-500 via-peach-500 to-peach-600 text-white flex items-center justify-center shadow-md shadow-peach-500/25 flex-shrink-0 transition-transform group-hover:scale-105 ${className}`}
    >
      {/* Modern Architectural Geometric Brand Mark (Modern House + Room Window) */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={current.icon}
      >
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
        <rect x="9" y="13" width="6" height="8" rx="0.5" fill="currentColor" fillOpacity="0.25" />
        <line x1="9" y1="8" x2="15" y2="8" />
      </svg>
    </div>
  );

  if (!showText) {
    return iconElement;
  }

  return (
    <div className="flex items-center gap-3">
      {iconElement}
      <div className="text-left">
        <span className={`font-heading font-black tracking-tight text-peach-600 ${current.text} ${textClassName}`}>
          pawskost
        </span>
        {subtitle && (
          <p className="text-[11px] text-darkcocoa/70 font-semibold -mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PawskostLogo;

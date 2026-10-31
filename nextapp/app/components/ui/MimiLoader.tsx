'use client';

import React from 'react';

interface MimiLoaderProps {
  message?: string;
  className?: string;
  fullscreen?: boolean;
}

export const MimiLoader: React.FC<MimiLoaderProps> = ({
  message = 'Mimi sedang menyiapkan data... 🐾',
  className = '',
  fullscreen = false,
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Kaki Kiri */}
        <svg
          className="w-8 h-8 text-peach-400 animate-bounce fill-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="8.5" cy="5.5" r="2" />
          <circle cx="15.5" cy="5.5" r="2" />
          <circle cx="4.5" cy="11.5" r="2" />
          <circle cx="19.5" cy="11.5" r="2" />
          <path d="M12 11c-3.3 0-6 2.2-6 5.5 0 2 1.5 3.5 3.5 3.5 1.5 0 2-.8 2.5-.8s1 .8 2.5.8c2 0 3.5-1.5 3.5-3.5 0-3.3-2.7-5.5-6-5.5z" />
        </svg>

        {/* Kaki Kanan */}
        <svg
          className="w-8 h-8 text-sakura-400 animate-bounce fill-current"
          style={{ animationDelay: '0.2s' }}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="8.5" cy="5.5" r="2" />
          <circle cx="15.5" cy="5.5" r="2" />
          <circle cx="4.5" cy="11.5" r="2" />
          <circle cx="19.5" cy="11.5" r="2" />
          <path d="M12 11c-3.3 0-6 2.2-6 5.5 0 2 1.5 3.5 3.5 3.5 1.5 0 2-.8 2.5-.8s1 .8 2.5.8c2 0 3.5-1.5 3.5-3.5 0-3.3-2.7-5.5-6-5.5z" />
        </svg>
      </div>

      <span className="text-xs font-bold text-[#2D283E] tracking-wide animate-pulse">
        {message}
      </span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50/90 backdrop-blur-none">
        {content}
      </div>
    );
  }

  return content;
};

export default MimiLoader;

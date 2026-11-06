import React from 'react';
import { MimiLoader } from './components/ui/MimiLoader';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <MimiLoader message="Memuat aplikasi pawskost..." />
    </div>
  );
}

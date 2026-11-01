'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, FastForward, Play, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface VideoBumperOverlayProps {
  forcePlay?: boolean;
  onFinished?: () => void;
}

export function VideoBumperOverlay({ forcePlay = false, onFinished }: VideoBumperOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Check if bumper has already played in this browser session
    if (typeof window !== 'undefined') {
      const hasSeen = sessionStorage.getItem('pawskost_bumper_seen');
      if (!hasSeen || forcePlay) {
        setIsVisible(true);
      }

      // Listen for custom replay event from Settings or any component
      const handleReplayEvent = () => {
        setIsVisible(true);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      };

      window.addEventListener('play-pawskost-bumper', handleReplayEvent);
      return () => {
        window.removeEventListener('play-pawskost-bumper', handleReplayEvent);
      };
    }
  }, [forcePlay]);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocks unmuted autoplay, mute and retry
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [isVisible]);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pawskost_bumper_seen', 'true');
    }
    setIsVisible(false);
    if (onFinished) {
      onFinished();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-darkcocoa flex items-center justify-center overflow-hidden print:hidden select-none"
        >
          {/* Main Video Player */}
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src="/bumper.mp4"
              playsInline
              autoPlay
              muted={isMuted}
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleClose}
              onError={handleClose}
              className="w-full h-full object-contain sm:object-cover max-w-full max-h-screen"
            />

            {/* Gradient Overlays for Cinematic Feel */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/50" />

            {/* Top Bar: Brand Watermark & Skip Button */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
                <div className="relative w-6 h-6 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/app-logo.jpg"
                    alt="pawskost logo"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-heading font-black text-sm text-peach-400 tracking-tight">
                  pawskost 🐾
                </span>
              </div>

              {/* Skip Button */}
              <button
                type="button"
                onClick={handleClose}
                className="group flex items-center gap-2 bg-white/20 hover:bg-white/30 active:scale-95 text-white backdrop-blur-md px-4 py-2 rounded-full border border-white/20 font-bold text-xs tracking-wide shadow-lg transition-all"
              >
                <span>Lewati</span>
                <FastForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Bottom Bar: Sound Toggle & Progress */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 space-y-2">
              <div className="flex items-center justify-between text-white/80 text-xs">
                {/* Sound Button */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-peach-400" />
                      <span>Aktifkan Suara 🔊</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-matcha-400" />
                      <span>Suara Aktif 🎵</span>
                    </>
                  )}
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-white/70 font-semibold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <Sparkles className="w-3 h-3 text-peach-400" />
                  <span>Selamat Datang di pawskost 🐾</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-peach-400 to-peach-500 rounded-full shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

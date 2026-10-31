'use client';

import React, { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  className?: string;
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className = '',
  closeOnOutsideClick = true,
  showCloseButton = true,
}) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOutsideClick ? onClose : undefined}
            className="fixed inset-0 bg-black/50"
            aria-hidden="true"
          />

          {/* Modal Content Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className={`
              relative w-full ${sizeClasses[size]}
              bg-white rounded-3xl shadow-cute
              border border-cream-200
              p-6 md:p-7 z-10 my-8
              flex flex-col max-h-[90vh]
              ${className}
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-cream-100 mb-4">
                <div className="flex-1 min-w-0 pr-2">
                  {title && (
                    <h2 className="font-heading font-bold text-xl md:text-2xl text-darkcocoa truncate">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="font-body text-xs md:text-sm text-softgray mt-1">
                      {description}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup dialog"
                    className="
                      inline-flex items-center justify-center
                      w-9 h-9 rounded-full
                      text-softgray hover:text-darkcocoa
                      bg-cream-100 hover:bg-cream-200
                      transition-colors flex-shrink-0
                      cursor-pointer
                    "
                  >
                    <X className="w-5 h-5" strokeWidth={1.75} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto font-body text-darkcocoa pr-1">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="mt-6 pt-4 border-t border-cream-100 flex items-center justify-end gap-3 flex-wrap">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

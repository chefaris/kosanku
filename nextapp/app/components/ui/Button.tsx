'use client';

import React, { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-peach-500 hover:bg-peach-400 text-white shadow-cute active:bg-peach-500',
  secondary: 'bg-sakura-100 hover:bg-sakura-300 text-darkcocoa active:bg-sakura-300',
  ghost: 'bg-transparent hover:bg-cream-100 text-darkcocoa active:bg-cream-200',
  success: 'bg-matcha-400 hover:bg-matcha-300 text-white active:bg-matcha-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs font-semibold gap-1.5',
  md: 'px-5 py-2.5 text-sm font-semibold gap-2',
  lg: 'px-6 py-3 text-base font-bold gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      isLoading = false,
      children,
      className = '',
      disabled = false,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          inline-flex items-center justify-center
          min-h-[44px] min-w-[44px]
          rounded-3xl cursor-pointer select-none
          font-body transition-colors duration-200
          disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...rest}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" strokeWidth={2.2} />
            {children && <span>Memproses...</span>}
          </>
        ) : (
          <>
            {icon && <span className="inline-flex items-center justify-center">{icon}</span>}
            {children && <span>{children}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

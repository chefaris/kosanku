import React, { type HTMLAttributes, type ReactNode } from 'react';

export type BadgeVariant = 'occupied' | 'vacant' | 'maintenance' | 'overdue' | 'paid';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  occupied: {
    container: 'bg-sakura-100 text-sakura-400',
    dot: 'bg-sakura-400',
  },
  vacant: {
    container: 'bg-matcha-100 text-matcha-400',
    dot: 'bg-matcha-400',
  },
  maintenance: {
    container: 'bg-lavender-100 text-lavender-400',
    dot: 'bg-lavender-400',
  },
  overdue: {
    container: 'bg-peach-100 text-peach-500',
    dot: 'bg-peach-500',
  },
  paid: {
    container: 'bg-matcha-100 text-matcha-400',
    dot: 'bg-matcha-400',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'vacant',
  dot = false,
  children,
  className = '',
  ...rest
}) => {
  const styles = variantStyles[variant] || variantStyles.vacant;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-3 py-1 text-xs font-semibold
        tracking-wide font-body select-none
        ${styles.container}
        ${className}
      `}
      {...rest}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse ${styles.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;

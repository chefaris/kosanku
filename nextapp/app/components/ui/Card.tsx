'use client';

import React, { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  headerAction?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      subtitle,
      headerAction,
      header,
      footer,
      children,
      className = '',
      headerClassName = '',
      bodyClassName = '',
      footerClassName = '',
      ...rest
    },
    ref
  ) => {
    const hasHeader = Boolean(header || title || subtitle || headerAction);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`
          bg-white rounded-2xl shadow-cute
          hover:shadow-lg transition-shadow duration-300
          border border-cream-100 flex flex-col
          p-6
          ${className}
        `}
        {...rest}
      >
        {hasHeader && (
          <div
            className={`
              flex items-start justify-between gap-4 mb-4 pb-3
              border-b border-cream-100
              ${headerClassName}
            `}
          >
            {header ?? (
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className="font-heading font-bold text-lg md:text-xl text-darkcocoa truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="font-body text-xs md:text-sm text-softgray mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {headerAction && (
              <div className="flex-shrink-0 flex items-center gap-2">
                {headerAction}
              </div>
            )}
          </div>
        )}

        {children && (
          <div className={`flex-1 font-body text-darkcocoa ${bodyClassName}`}>
            {children}
          </div>
        )}

        {footer && (
          <div
            className={`
              mt-4 pt-4 border-t border-cream-100
              flex items-center justify-between gap-3
              ${footerClassName}
            `}
          >
            {footer}
          </div>
        )}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
export default Card;

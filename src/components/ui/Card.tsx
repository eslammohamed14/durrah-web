import React from 'react';

export type CardVariant = 'default' | 'compact' | 'horizontal';

export interface CardProps {
  variant?: CardVariant;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'flex flex-col',
  compact: 'flex flex-col',
  horizontal: 'flex flex-row',
};

const bodyPaddingClasses: Record<CardVariant, string> = {
  default: 'p-6',
  compact: 'p-3',
  horizontal: 'p-4',
};

const headerPaddingClasses: Record<CardVariant, string> = {
  default: 'px-6 py-4 border-b border-gray-200',
  compact: 'px-3 py-2 border-b border-gray-200',
  horizontal: 'px-4 py-3 border-b border-gray-200',
};

const footerPaddingClasses: Record<CardVariant, string> = {
  default: 'px-6 py-4 border-t border-gray-200',
  compact: 'px-3 py-2 border-t border-gray-200',
  horizontal: 'px-4 py-3 border-t border-gray-200',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  header,
  footer,
  children,
  className = '',
}) => {
  return (
    <div
      className={[
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {header && (
        <div className={headerPaddingClasses[variant]}>
          {header}
        </div>
      )}

      <div className={['flex-1', bodyPaddingClasses[variant]].join(' ')}>
        {children}
      </div>

      {footer && (
        <div className={footerPaddingClasses[variant]}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.displayName = 'Card';

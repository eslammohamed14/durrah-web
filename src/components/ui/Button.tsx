'use client';

import React from 'react';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 focus-visible:ring-blue-500',
  secondary:
    'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 disabled:bg-gray-300 focus-visible:ring-gray-500',
  outline:
    'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100 disabled:text-gray-300 disabled:border-gray-200 focus-visible:ring-gray-400',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-300 focus-visible:ring-gray-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

const spinnerSizeMap: Record<ButtonSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={[
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {loading && (
          <Spinner
            size={spinnerSizeMap[size]}
            aria-hidden="true"
            className="shrink-0"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

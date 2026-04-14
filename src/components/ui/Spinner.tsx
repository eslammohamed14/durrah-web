import React from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends React.SVGAttributes<SVGElement> {
  size?: SpinnerSize;
  'aria-label'?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  'aria-label': ariaLabel = 'Loading',
  className = '',
  ...props
}) => {
  return (
    <svg
      role="status"
      aria-label={ariaLabel}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={['animate-spin', sizeClasses[size], className].join(' ')}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
};

Spinner.displayName = 'Spinner';

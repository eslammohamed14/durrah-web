'use client';

import React from 'react';

export type InputValidationState = 'default' | 'error' | 'success';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  validationState?: InputValidationState;
  /** Pass 'rtl' or 'ltr' to override text direction */
  dir?: 'ltr' | 'rtl' | 'auto';
}

const stateClasses: Record<InputValidationState, string> = {
  default:
    'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error:
    'border-red-500 focus:border-red-500 focus:ring-red-500',
  success:
    'border-green-500 focus:border-green-500 focus:ring-green-500',
};

const stateIconColor: Record<InputValidationState, string> = {
  default: '',
  error: 'text-red-500',
  success: 'text-green-500',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      validationState = 'default',
      dir,
      id,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const helperId = inputId ? `${inputId}-helper` : undefined;
    const errorId = inputId ? `${inputId}-error` : undefined;

    const activeState: InputValidationState =
      errorText ? 'error' : validationState;

    const describedBy = [
      errorText && errorId,
      helperText && helperId,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className={[
              'text-sm font-medium',
              disabled ? 'text-gray-400' : 'text-gray-700',
            ].join(' ')}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          dir={dir}
          disabled={disabled}
          aria-invalid={activeState === 'error' ? 'true' : undefined}
          aria-describedby={describedBy}
          className={[
            'block w-full rounded-md border px-3 py-2 text-sm shadow-sm',
            'placeholder-gray-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
            stateClasses[activeState],
            className,
          ].join(' ')}
          {...props}
        />

        {errorText && (
          <p id={errorId} role="alert" className={['text-xs', stateIconColor.error].join(' ')}>
            {errorText}
          </p>
        )}

        {helperText && !errorText && (
          <p id={helperId} className="text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

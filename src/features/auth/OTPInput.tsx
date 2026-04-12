'use client';

/**
 * OTPInput — a row of single-character inputs for entering a one-time password.
 * Auto-focuses the next field on input and handles paste/backspace correctly.
 */

import React, { useRef, useCallback } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  'aria-label': ariaLabel = 'One-time password',
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const focusAt = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = useCallback(
    (index: number, char: string) => {
      // Accept only a single digit
      const digit = char.replace(/\D/g, '').slice(-1);
      const next = digits.map((d, i) => (i === index ? digit : d)).join('');
      onChange(next);
      if (digit && index < length - 1) focusAt(index + 1);
    },
    [digits, length, onChange]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (digits[index]) {
          const next = digits.map((d, i) => (i === index ? '' : d)).join('');
          onChange(next);
        } else if (index > 0) {
          focusAt(index - 1);
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        focusAt(index - 1);
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        focusAt(index + 1);
      }
    },
    [digits, length, onChange]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      onChange(pasted.padEnd(length, '').slice(0, length));
      const nextFocus = Math.min(pasted.length, length - 1);
      focusAt(nextFocus);
    },
    [length, onChange]
  );

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex gap-2 justify-center"
      onPaste={handlePaste}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={[
            'w-11 h-12 text-center text-lg font-semibold rounded-md border',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
            digit ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

"use client";

/**
 * FormField — accessible wrapper that renders a label, optional hint,
 * the input slot (children), and a field-level error message.
 *
 * The consumer is responsible for passing `id` to the child element so
 * the label's `htmlFor` can wire up correctly. This keeps the component
 * generic without needing cloneElement or complex generics.
 *
 * Requirements: 21.2, 7.7
 *
 * Usage:
 *   <FormField id="email" label="Email" error={errors.email?.message} required>
 *     <input id="email" {...register("email")} className="..." />
 *   </FormField>
 */

import React from "react";

interface FormFieldProps {
  /** Must match the `id` on the child input */
  id: string;
  label: string;
  children: React.ReactNode;
  /** Error message — shown below the input when truthy */
  error?: string;
  /** Optional hint shown below the label */
  hint?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  id,
  label,
  children,
  error,
  hint,
  required,
  className,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="ms-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="mb-1 text-xs text-gray-500">
          {hint}
        </p>
      )}

      {/*
        Wrap children in a fragment — the consumer's input must carry:
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
        or use the InputWithField helper below for convenience.
      */}
      {children}

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

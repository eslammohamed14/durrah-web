"use client";

import React, { useEffect, useRef, useCallback } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Prevent closing when clicking the backdrop */
  disableBackdropClose?: boolean;
  className?: string;
  "aria-label"?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  disableBackdropClose = false,
  className = "",
  "aria-label": ariaLabel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save and restore focus
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else {
      previousFocusRef.current?.focus();
    }
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    const getFocusable = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelectors));

    // Focus first focusable element
    const focusable = getFocusable();
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      dialog.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const elements = getFocusable();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleBackdropClick = useCallback(() => {
    if (!disableBackdropClose) {
      onClose();
    }
  }, [disableBackdropClose, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/50"
        onClick={handleBackdropClick}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        tabIndex={-1}
        className={[
          "relative z-10 w-full max-w-lg rounded-t-2xl bg-white shadow-xl",
          "sm:rounded-2xl",
          "focus:outline-none",
          className,
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={[
              "rounded-md p-1 text-gray-400 transition-colors",
              "hover:bg-gray-100 hover:text-gray-600",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              !title ? "ms-auto" : "",
            ].join(" ")}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = "Modal";

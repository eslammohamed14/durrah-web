"use client";

/**
 * Error boundary for the [locale] route segment.
 * Caught and displayed whenever a Server Component or Client Component
 * inside the layout throws during rendering.
 *
 * Requirements: 21.4, 21.5
 */

import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: ErrorPageProps) {
  const t = useTranslations();

  // Req 21.5 — log to console in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary]", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <ExclamationIcon className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        {t("errors.generic")}
      </h1>
      {process.env.NODE_ENV === "development" && error.message && (
        <p className="mb-4 max-w-md rounded-lg bg-gray-100 px-4 py-2 font-mono text-xs text-gray-600">
          {error.message}
        </p>
      )}
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        {t("common.retry")}
      </button>
    </div>
  );
}

function ExclamationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

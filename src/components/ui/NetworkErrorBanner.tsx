"use client";

/**
 * NetworkErrorBanner — shown when an API or network error occurs.
 * Provides a retry button and a user-friendly message.
 *
 * Also used for offline detection via the useOnlineStatus hook.
 *
 * Requirements: 21.1, 21.3
 */

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/Spinner";

// ─── useOnlineStatus hook ─────────────────────────────────────────────────────

/**
 * Tracks the browser online/offline status.
 * Returns `true` when online, `false` when offline.
 */
export function useOnlineStatus(): boolean {
  // Always start as true — only update after mount to avoid SSR/hydration mismatch
  const [online, setOnline] = useState(true);

  useEffect(() => {
    // Sync with real status after hydration
    setOnline(navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
}

// ─── OfflineBanner ────────────────────────────────────────────────────────────

/**
 * Renders a sticky top banner when the user loses their internet connection.
 * Disappears automatically when they come back online.
 */
export function OfflineBanner() {
  const t = useTranslations();
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-yellow-500 px-4 py-2 text-sm font-medium text-yellow-950"
    >
      <WifiOffIcon />
      {t("errors.offline")}
    </div>
  );
}

// ─── NetworkErrorBanner ───────────────────────────────────────────────────────

interface NetworkErrorBannerProps {
  /** Error message to display */
  message?: string;
  /** Called when the user clicks "Retry" */
  onRetry?: () => void;
  /** Whether a retry is currently in progress */
  retrying?: boolean;
  className?: string;
}

/**
 * Inline error banner for API / network failures.
 * Shows a message and an optional retry button.
 */
export function NetworkErrorBanner({
  message,
  onRetry,
  retrying = false,
  className,
}: NetworkErrorBannerProps) {
  const t = useTranslations();
  const displayMessage = message ?? t("errors.network");

  return (
    <div
      role="alert"
      className={[
        "flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <AlertIcon className="mt-0.5 shrink-0 text-red-500" />
      <div className="flex-1">
        <p className="text-sm text-red-700">{displayMessage}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="shrink-0 rounded text-sm font-medium text-red-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
        >
          {retrying ? (
            <Spinner size="sm" className="text-red-500" />
          ) : (
            t("common.retry")
          )}
        </button>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      className={["h-5 w-5", className].filter(Boolean).join(" ")}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function WifiOffIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" />
    </svg>
  );
}

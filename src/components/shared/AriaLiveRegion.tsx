"use client";

/**
 * AriaLiveRegion — invisible region that announces dynamic content changes
 * to screen readers via aria-live.
 *
 * Two usage patterns:
 *
 * 1. Singleton via the `useAnnounce` hook (preferred for toast-style messages):
 *    - Render <AriaLiveRegion /> once near the root of the app.
 *    - Call `announce(message)` from anywhere in the component tree.
 *
 * 2. Inline via the `message` prop:
 *    - Pass a `message` prop directly when the announcement is driven by
 *      local component state.
 *
 * Requirements: 22.2, 22.5
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AriaLivePoliteness = "polite" | "assertive" | "off";

export interface AnnounceOptions {
  /** How urgently the announcement should interrupt the user. Default: 'polite'. */
  politeness?: AriaLivePoliteness;
  /** Auto-clear message after this many ms. Default: 5000. Pass 0 to disable. */
  clearAfter?: number;
}

interface AnnounceFn {
  (message: string, options?: AnnounceOptions): void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AnnounceContext = createContext<AnnounceFn | null>(null);

/**
 * Hook to imperatively announce a message to screen readers.
 * Must be used within an <AriaLiveProvider>.
 */
export function useAnnounce(): AnnounceFn {
  const fn = useContext(AnnounceContext);
  if (!fn) {
    // Graceful fallback — no-op when provider is missing (e.g., in tests).
    return () => {};
  }
  return fn;
}

// ── Provider ──────────────────────────────────────────────────────────────────

interface LiveState {
  polite: string;
  assertive: string;
}

interface AriaLiveProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps the application and exposes the `useAnnounce` hook.
 * Renders two invisible live regions: one polite, one assertive.
 */
export function AriaLiveProvider({ children }: AriaLiveProviderProps) {
  const [live, setLive] = useState<LiveState>({ polite: "", assertive: "" });
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce: AnnounceFn = useCallback(
    (message, { politeness = "polite", clearAfter = 5000 } = {}) => {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
      }

      setLive((prev) => ({
        ...prev,
        [politeness]: "",
      }));

      // Defer setting the new message so screen readers detect the change.
      requestAnimationFrame(() => {
        setLive((prev) => ({
          ...prev,
          [politeness]: message,
        }));

        if (clearAfter > 0) {
          clearTimerRef.current = setTimeout(() => {
            setLive((prev) => ({ ...prev, [politeness]: "" }));
          }, clearAfter);
        }
      });
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  return (
    <AnnounceContext.Provider value={announce}>
      {children}
      {/* Polite region — waits for user to finish current activity */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {live.polite}
      </div>
      {/* Assertive region — interrupts immediately */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {live.assertive}
      </div>
    </AnnounceContext.Provider>
  );
}

// ── Inline variant ────────────────────────────────────────────────────────────

interface AriaLiveRegionProps {
  /** Message to announce. Changing this value triggers an announcement. */
  message: string;
  politeness?: AriaLivePoliteness;
  className?: string;
}

/**
 * Inline aria-live region driven by a `message` prop.
 * Use this when you want a self-contained region without the global provider.
 */
export function AriaLiveRegion({
  message,
  politeness = "polite",
  className = "sr-only",
}: AriaLiveRegionProps) {
  return (
    <div
      role={politeness === "assertive" ? "alert" : "status"}
      aria-live={politeness}
      aria-atomic="true"
      className={className}
    >
      {message}
    </div>
  );
}

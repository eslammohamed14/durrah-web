/**
 * Route-level loading skeleton for locale pages.
 * Displayed by Next.js during streaming SSR / client-side navigation.
 */

import { Skeleton } from "@/components/ui/Skeleton";

export default function LocaleLoading() {
  return (
    <div className="min-h-screen">
      {/* Header placeholder */}
      <div
        className="h-16 w-full animate-pulse bg-gray-100"
        aria-hidden="true"
      />
      {/* Hero placeholder */}
      <div
        className="h-[420px] w-full animate-pulse bg-gray-200"
        aria-hidden="true"
      />
      {/* Content grid placeholder */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

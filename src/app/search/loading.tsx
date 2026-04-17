/**
 * Route-level loading skeleton for the search results page.
 */

import { Skeleton } from "@/components/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-screen">
      <div
        className="h-16 w-full animate-pulse bg-gray-100"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Filters sidebar */}
          <aside
            className="hidden w-64 shrink-0 space-y-4 lg:block"
            aria-hidden="true"
          >
            <Skeleton className="h-8 w-32" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </aside>
          {/* Results grid */}
          <div className="flex-1">
            <Skeleton className="mb-6 h-6 w-40" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-52 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

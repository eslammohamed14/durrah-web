/**
 * Skeleton — lightweight loading placeholder with shimmer animation.
 * Used as the `loading` fallback for dynamic imports and Suspense boundaries.
 */

interface SkeletonProps {
  className?: string;
  /** Render a circle (for avatars) instead of a rectangle */
  circle?: boolean;
}

export function Skeleton({ className = "", circle = false }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        "animate-pulse bg-gray-200",
        circle ? "rounded-full" : "rounded-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

/** Gallery placeholder — mirrors the PropertyGallery grid dimensions */
export function GallerySkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-[420px] sm:h-[480px]"
    >
      <div className="col-span-2 row-span-2 animate-pulse bg-gray-200" />
      <div className="animate-pulse bg-gray-200" />
      <div className="animate-pulse bg-gray-200" />
      <div className="animate-pulse bg-gray-200" />
      <div className="animate-pulse bg-gray-200" />
    </div>
  );
}

/** Map placeholder — mirrors PropertyMap dimensions */
export function MapSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ height }}
      className="w-full animate-pulse bg-gray-200 rounded-xl"
    />
  );
}

/** Payment form placeholder */
export function PaymentFormSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-4 animate-pulse">
      <div className="h-12 rounded-lg bg-gray-200" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-12 rounded-lg bg-gray-200" />
        <div className="h-12 rounded-lg bg-gray-200" />
      </div>
      <div className="h-12 rounded-lg bg-gray-200" />
    </div>
  );
}

/** Dashboard content placeholder */
export function DashboardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-6 animate-pulse p-6">
      <div className="h-8 w-48 rounded-md bg-gray-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-200" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-gray-200" />
    </div>
  );
}

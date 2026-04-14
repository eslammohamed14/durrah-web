"use client";

/**
 * PropertyMap — renders a Mapbox map centred on a property location.
 * Loaded via dynamic import (ssr: false) to keep mapbox-gl out of the server bundle.
 * Renders a placeholder when no Mapbox access token is configured.
 */

import { useEffect, useRef, useState } from "react";
import type { MapCoordinates } from "@/lib/services/map/IMapService";

interface PropertyMapProps {
  coordinates: MapCoordinates;
  /** Optional label shown in the marker popup */
  title?: string;
  /** Map height in pixels. Defaults to 400. */
  height?: number;
  className?: string;
}

function MapPlaceholder({
  height,
  className,
}: {
  height: number;
  className: string;
}) {
  return (
    <div
      style={{ height }}
      className={`w-full rounded-lg overflow-hidden bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-400 ${className}`}
      role="img"
      aria-label="Map unavailable"
    >
      <svg
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
        />
      </svg>
      <p className="text-sm">Map preview unavailable</p>
      <p className="text-xs text-gray-400">
        Set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to enable maps
      </p>
    </div>
  );
}

export default function PropertyMap({
  coordinates,
  title,
  height = 400,
  className = "",
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<object | null>(null);
  const markerRef = useRef<{ remove(): void } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    (async () => {
      try {
        const { MapboxAdapter } =
          await import("@/lib/services/map/MapboxAdapter");
        const { env } = await import("@/config/env");

        if (cancelled || !containerRef.current) return;

        const adapter = new MapboxAdapter({
          accessToken: env.mapbox.accessToken,
        });

        const map = adapter.createMap(containerRef.current, {
          center: coordinates,
          zoom: 14,
          interactive: true,
        });

        mapRef.current = map;

        const mbMap = map as unknown as {
          on(event: string, cb: () => void): void;
        };
        mbMap.on("load", () => {
          if (cancelled) return;
          const marker = adapter.addMarker(map, coordinates, {
            popup: title,
            color: "#E63946",
          });
          markerRef.current = marker;
        });
      } catch (err) {
        if (!cancelled) {
          setMapError(
            err instanceof Error ? err.message : "Map failed to load",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      markerRef.current?.remove();
      const m = mapRef.current as { remove?(): void } | null;
      m?.remove?.();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates.lat, coordinates.lng, title]);

  if (mapError) {
    return <MapPlaceholder height={height} className={className} />;
  }

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`w-full rounded-lg overflow-hidden ${className}`}
      aria-label={
        title ? `Map showing location of ${title}` : "Property location map"
      }
      role="img"
    />
  );
}

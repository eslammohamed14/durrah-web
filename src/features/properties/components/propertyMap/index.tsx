"use client";

import { useEffect, useRef, useState } from "react";
import type { MapCoordinates } from "@/lib/services/map/IMapService";

interface PropertyMapProps {
  coordinates: MapCoordinates;
  title?: string;
  height?: number;
  className?: string;
}

function MapPlaceholder({ height, className }: { height: number; className: string }) {
  return (
    <div
      style={{ height }}
      className={`flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-100 text-gray-400 ${className}`}
      role="img"
      aria-label="Map unavailable"
    >
      <p className="text-sm">Map preview unavailable</p>
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
        const { MapboxAdapter } = await import("@/lib/services/map/MapboxAdapter");
        const { env } = await import("@/config/env");
        if (cancelled || !containerRef.current) return;

        const adapter = new MapboxAdapter({ accessToken: env.mapbox.accessToken });
        const map = adapter.createMap(containerRef.current, {
          center: coordinates,
          zoom: 14,
          interactive: true,
        });

        mapRef.current = map;
        const mbMap = map as unknown as { on(event: string, cb: () => void): void };
        mbMap.on("load", () => {
          if (cancelled) return;
          markerRef.current = adapter.addMarker(map, coordinates, {
            popup: title,
            color: "#E63946",
          });
        });
      } catch (err) {
        if (!cancelled) {
          setMapError(err instanceof Error ? err.message : "Map failed to load");
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
  }, [coordinates, title]);

  if (mapError) return <MapPlaceholder height={height} className={className} />;

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`w-full overflow-hidden rounded-lg ${className}`}
      aria-label={title ? `Map showing location of ${title}` : "Property location map"}
      role="img"
    />
  );
}

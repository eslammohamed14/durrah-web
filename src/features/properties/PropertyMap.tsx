'use client';

/**
 * PropertyMap — renders a Mapbox map centred on a property location.
 * Loaded via dynamic import (ssr: false) to keep mapbox-gl out of the server bundle.
 */

import { useEffect, useRef } from 'react';
import type { MapCoordinates } from '@/lib/services/map/IMapService';

interface PropertyMapProps {
  coordinates: MapCoordinates;
  /** Optional label shown in the marker popup */
  title?: string;
  /** Map height (Tailwind class or inline style). Defaults to 400px. */
  height?: number;
  className?: string;
}

export default function PropertyMap({
  coordinates,
  title,
  height = 400,
  className = '',
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<object | null>(null);
  const markerRef = useRef<{ remove(): void } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    (async () => {
      const { MapboxAdapter } = await import('@/lib/services/map/MapboxAdapter');
      const { env } = await import('@/config/env');

      if (cancelled || !containerRef.current) return;

      const adapter = new MapboxAdapter({ accessToken: env.mapbox.accessToken });

      const map = adapter.createMap(containerRef.current, {
        center: coordinates,
        zoom: 14,
        interactive: true,
      });

      mapRef.current = map;

      // Add marker once the map style has loaded
      const mbMap = map as unknown as { on(event: string, cb: () => void): void };
      mbMap.on('load', () => {
        if (cancelled) return;
        const marker = adapter.addMarker(map, coordinates, {
          popup: title,
          color: '#E63946',
        });
        markerRef.current = marker;
      });
    })();

    return () => {
      cancelled = true;
      markerRef.current?.remove();
      // mapbox-gl Map has a remove() method
      const m = mapRef.current as { remove?(): void } | null;
      m?.remove?.();
      mapRef.current = null;
      markerRef.current = null;
    };
  // Re-initialise only when coordinates or title change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates.lat, coordinates.lng, title]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`w-full rounded-lg overflow-hidden ${className}`}
      aria-label={title ? `Map showing location of ${title}` : 'Property location map'}
      role="img"
    />
  );
}

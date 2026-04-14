'use client';

/**
 * Mapbox GL JS adapter implementing IMapService.
 * Only runs in the browser — never import this in Server Components.
 */

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type {
  IMapService,
  MapConfig,
  MapOptions,
  MapCoordinates,
  MarkerOptions,
  MapMarker,
  MapInstance,
} from './IMapService';

interface MapboxConfig {
  accessToken: string;
  style?: string;
}

export class MapboxAdapter implements IMapService {
  private defaultStyle = 'mapbox://styles/mapbox/streets-v12';

  constructor(private config: MapboxConfig) {}

  initialize(config: MapConfig): void {
    mapboxgl.accessToken = config.accessToken || this.config.accessToken;
  }

  createMap(container: HTMLElement, options: MapOptions): MapInstance {
    mapboxgl.accessToken = this.config.accessToken;

    const map = new mapboxgl.Map({
      container,
      style: this.defaultStyle,
      center: [options.center.lng, options.center.lat],
      zoom: options.zoom,
      interactive: options.interactive ?? true,
    });

    // Add zoom + pan controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return map as unknown as MapInstance;
  }

  addMarker(map: MapInstance, coordinates: MapCoordinates, options?: MarkerOptions): MapMarker {
    const mbMap = map as unknown as mapboxgl.Map;

    const markerEl = new mapboxgl.Marker({ color: options?.color ?? '#E63946' })
      .setLngLat([coordinates.lng, coordinates.lat]);

    if (options?.popup) {
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(options.popup);
      markerEl.setPopup(popup);
    }

    markerEl.addTo(mbMap);

    const id = `marker-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return {
      id,
      coordinates,
      remove: () => markerEl.remove(),
    };
  }

  setCenter(map: MapInstance, coordinates: MapCoordinates, zoom?: number): void {
    const mbMap = map as unknown as mapboxgl.Map;
    mbMap.flyTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: zoom ?? mbMap.getZoom(),
      essential: true,
    });
  }
}

/**
 * Abstract map service interface.
 * Implement this interface to swap map providers (Mapbox, Google Maps, etc.)
 * without changing application code.
 */

export interface MapConfig {
  accessToken: string;
  style?: string;
}

export interface MapOptions {
  center: MapCoordinates;
  zoom: number;
  interactive?: boolean;
}

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MarkerOptions {
  color?: string;
  popup?: string;
  draggable?: boolean;
}

export interface MapMarker {
  id: string;
  coordinates: MapCoordinates;
  remove(): void;
}

// Opaque handle — consumers should not inspect internals
export type MapInstance = object & { readonly _brand: 'MapInstance' };

export interface IMapService {
  initialize(config: MapConfig): void;
  createMap(container: HTMLElement, options: MapOptions): MapInstance;
  addMarker(map: MapInstance, coordinates: MapCoordinates, options?: MarkerOptions): MapMarker;
  setCenter(map: MapInstance, coordinates: MapCoordinates, zoom?: number): void;
}

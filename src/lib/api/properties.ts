/**
 * Property API endpoints.
 */

import type { Property, AvailabilityCalendar, SearchFilters, DateRange } from '@/lib/types';
import { BaseAPIClient, buildQueryString } from './client';

export class PropertiesAPI extends BaseAPIClient {
  async searchProperties(filters: SearchFilters = {}): Promise<Property[]> {
    const params: Record<string, unknown> = {
      category: filters.category,
      type: filters.type,
      location: filters.location,
      rooms: filters.rooms,
      beachView: filters.beachView,
      sortBy: filters.sortBy,
      priceMin: filters.priceRange?.min,
      priceMax: filters.priceRange?.max,
      amenities: filters.amenities,
      checkIn: filters.dateRange?.checkIn?.toISOString(),
      checkOut: filters.dateRange?.checkOut?.toISOString(),
    };
    return this.get<Property[]>(`/properties${buildQueryString(params)}`);
  }

  async getProperty(id: string): Promise<Property> {
    return this.get<Property>(`/properties/${id}`);
  }

  async getPropertyAvailability(id: string, dateRange?: DateRange): Promise<AvailabilityCalendar> {
    const params: Record<string, unknown> = {
      checkIn: dateRange?.checkIn?.toISOString(),
      checkOut: dateRange?.checkOut?.toISOString(),
    };
    return this.get<AvailabilityCalendar>(`/properties/${id}/availability${buildQueryString(params)}`);
  }
}

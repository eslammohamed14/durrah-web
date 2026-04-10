/**
 * Booking API endpoints.
 */

import type { Booking } from '@/lib/types';
import type { CreateBookingData, UpdateBookingData } from '@/lib/types/api';
import { BaseAPIClient, APIError } from './client';

export class BookingsAPI extends BaseAPIClient {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    this.validateCreateBooking(data);
    return this.post<Booking>('/bookings', data);
  }

  async getBooking(id: string): Promise<Booking> {
    return this.get<Booking>(`/bookings/${id}`);
  }

  async updateBooking(id: string, data: UpdateBookingData): Promise<Booking> {
    return this.patch<Booking>(`/bookings/${id}`, data);
  }

  async cancelBooking(id: string, reason: string): Promise<Booking> {
    if (!reason?.trim()) {
      throw new APIError(400, 'Cancellation reason is required', 'VALIDATION_ERROR');
    }
    return this.post<Booking>(`/bookings/${id}/cancel`, { reason });
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.get<Booking[]>(`/users/${userId}/bookings`);
  }

  // ─── Validation ─────────────────────────────────────────────────────────────

  private validateCreateBooking(data: CreateBookingData): void {
    const errors: string[] = [];

    if (!data.propertyId) errors.push('propertyId is required');
    if (!data.checkIn) errors.push('checkIn date is required');
    if (!data.checkOut) errors.push('checkOut date is required');
    if (data.checkIn && data.checkOut && data.checkIn >= data.checkOut) {
      errors.push('checkOut must be after checkIn');
    }
    if (!data.guestInfo?.name?.trim()) errors.push('Guest name is required');
    if (!data.guestInfo?.email?.trim()) errors.push('Guest email is required');
    if (!data.guestInfo?.phone?.trim()) errors.push('Guest phone is required');
    if (!data.paymentIntentId) errors.push('paymentIntentId is required');
    if (!data.acknowledgedPolicies) errors.push('Booking policies must be acknowledged');

    if (errors.length > 0) {
      throw new APIError(400, errors.join('; '), 'VALIDATION_ERROR', errors);
    }
  }
}

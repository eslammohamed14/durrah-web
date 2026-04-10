/**
 * User, review, inquiry, and notification API endpoints.
 */

import type { User, Review, Inquiry, Notification, InquiryStatus } from '@/lib/types';
import type { UpdateUserData, CreateReviewData, CreateInquiryData } from '@/lib/types/api';
import { BaseAPIClient } from './client';

export class UsersAPI extends BaseAPIClient {
  // ─── User Profile ────────────────────────────────────────────────────────────

  async getUserProfile(userId: string): Promise<User> {
    return this.get<User>(`/users/${userId}`);
  }

  async updateUserProfile(userId: string, data: UpdateUserData): Promise<User> {
    return this.patch<User>(`/users/${userId}`, data);
  }

  // ─── Reviews ─────────────────────────────────────────────────────────────────

  async createReview(data: CreateReviewData): Promise<Review> {
    return this.post<Review>('/reviews', data);
  }

  async getPropertyReviews(propertyId: string): Promise<Review[]> {
    return this.get<Review[]>(`/properties/${propertyId}/reviews`);
  }

  // ─── Notifications ────────────────────────────────────────────────────────────

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.get<Notification[]>(`/users/${userId}/notifications`);
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    return this.patch<void>(`/notifications/${notificationId}/read`);
  }

  // ─── Inquiries ────────────────────────────────────────────────────────────────

  async createInquiry(data: CreateInquiryData): Promise<Inquiry> {
    return this.post<Inquiry>('/inquiries', data);
  }

  async getUserInquiries(userId: string): Promise<Inquiry[]> {
    return this.get<Inquiry[]>(`/users/${userId}/inquiries`);
  }

  async getPropertyInquiries(propertyId: string): Promise<Inquiry[]> {
    return this.get<Inquiry[]>(`/properties/${propertyId}/inquiries`);
  }

  async updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    return this.patch<Inquiry>(`/inquiries/${id}`, { status });
  }
}

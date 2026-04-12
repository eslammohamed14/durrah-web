/**
 * API client factory.
 * Returns MockAPIClient when NEXT_PUBLIC_USE_MOCK_API=true or when
 * NEXT_PUBLIC_API_BASE_URL is unset (local dev without a backend),
 * otherwise returns the real API client composed from endpoint modules.
 */

import { env, usesMockApi } from '@/config/env';
import { BaseAPIClient } from './client';
import { PropertiesAPI } from './properties';
import { BookingsAPI } from './bookings';
import { MaintenanceAPI } from './maintenance';
import { UsersAPI } from './users';
import { MockAPIClient } from './mock/MockAPIClient';

// ─── Real API Client ──────────────────────────────────────────────────────────

class RealAPIClient
  extends BaseAPIClient
  implements
    InstanceType<typeof PropertiesAPI>,
    InstanceType<typeof MaintenanceAPI>,
    InstanceType<typeof UsersAPI>
{
  private properties: PropertiesAPI;
  private bookings: BookingsAPI;
  private maintenance: MaintenanceAPI;
  private users: UsersAPI;

  constructor() {
    super({ baseURL: env.apiBaseURL, maxRetries: 2 });
    const cfg = { baseURL: env.apiBaseURL, maxRetries: 2 };
    this.properties = new PropertiesAPI(cfg);
    this.bookings = new BookingsAPI(cfg);
    this.maintenance = new MaintenanceAPI(cfg);
    this.users = new UsersAPI(cfg);
  }

  override setAuthToken(token: string): void {
    super.setAuthToken(token);
    this.properties.setAuthToken(token);
    this.bookings.setAuthToken(token);
    this.maintenance.setAuthToken(token);
    this.users.setAuthToken(token);
  }

  override clearAuthToken(): void {
    super.clearAuthToken();
    this.properties.clearAuthToken();
    this.bookings.clearAuthToken();
    this.maintenance.clearAuthToken();
    this.users.clearAuthToken();
  }

  // Properties
  searchProperties = (...args: Parameters<PropertiesAPI['searchProperties']>) => this.properties.searchProperties(...args);
  getProperty = (...args: Parameters<PropertiesAPI['getProperty']>) => this.properties.getProperty(...args);
  getPropertyAvailability = (...args: Parameters<PropertiesAPI['getPropertyAvailability']>) => this.properties.getPropertyAvailability(...args);

  // Bookings
  createBooking = (...args: Parameters<BookingsAPI['createBooking']>) => this.bookings.createBooking(...args);
  getBooking = (...args: Parameters<BookingsAPI['getBooking']>) => this.bookings.getBooking(...args);
  updateBooking = (...args: Parameters<BookingsAPI['updateBooking']>) => this.bookings.updateBooking(...args);
  cancelBooking = (...args: Parameters<BookingsAPI['cancelBooking']>) => this.bookings.cancelBooking(...args);
  getUserBookings = (...args: Parameters<BookingsAPI['getUserBookings']>) => this.bookings.getUserBookings(...args);

  // Maintenance
  createMaintenanceTicket = (...args: Parameters<MaintenanceAPI['createMaintenanceTicket']>) => this.maintenance.createMaintenanceTicket(...args);
  getMaintenanceTicket = (...args: Parameters<MaintenanceAPI['getMaintenanceTicket']>) => this.maintenance.getMaintenanceTicket(...args);
  updateMaintenanceTicket = (...args: Parameters<MaintenanceAPI['updateMaintenanceTicket']>) => this.maintenance.updateMaintenanceTicket(...args);
  addTicketComment = (...args: Parameters<MaintenanceAPI['addTicketComment']>) => this.maintenance.addTicketComment(...args);

  // Users / Reviews / Notifications / Inquiries
  getUserProfile = (...args: Parameters<UsersAPI['getUserProfile']>) => this.users.getUserProfile(...args);
  updateUserProfile = (...args: Parameters<UsersAPI['updateUserProfile']>) => this.users.updateUserProfile(...args);
  createReview = (...args: Parameters<UsersAPI['createReview']>) => this.users.createReview(...args);
  getPropertyReviews = (...args: Parameters<UsersAPI['getPropertyReviews']>) => this.users.getPropertyReviews(...args);
  getUserNotifications = (...args: Parameters<UsersAPI['getUserNotifications']>) => this.users.getUserNotifications(...args);
  markNotificationRead = (...args: Parameters<UsersAPI['markNotificationRead']>) => this.users.markNotificationRead(...args);
  createInquiry = (...args: Parameters<UsersAPI['createInquiry']>) => this.users.createInquiry(...args);
  getUserInquiries = (...args: Parameters<UsersAPI['getUserInquiries']>) => this.users.getUserInquiries(...args);
  getPropertyInquiries = (...args: Parameters<UsersAPI['getPropertyInquiries']>) => this.users.getPropertyInquiries(...args);
  updateInquiryStatus = (...args: Parameters<UsersAPI['updateInquiryStatus']>) => this.users.updateInquiryStatus(...args);
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export type APIClient = MockAPIClient | RealAPIClient;

let _client: APIClient | null = null;

export function getAPIClient(): APIClient {
  if (!_client) {
    _client = usesMockApi() ? new MockAPIClient() : new RealAPIClient();
  }
  return _client;
}

/** Reset the singleton — useful in tests. */
export function resetAPIClient(): void {
  _client = null;
}

export { MockAPIClient, RealAPIClient };
export { APIError } from './client';

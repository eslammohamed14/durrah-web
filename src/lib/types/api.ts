/**
 * API request/response types for the Durrah Property Management Platform.
 */

import type {
  User,
  Property,
  Booking,
  MaintenanceTicket,
  TicketComment,
  Review,
  Inquiry,
  Notification,
  SearchFilters,
  DateRange,
  AvailabilityCalendar,
  UserRole,
  BookingStatus,
  TicketStatus,
  TicketCategory,
  TicketPriority,
  InquiryStatus,
  Locale,
} from './index';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: number; // Unix timestamp
}

export interface RegisterData {
  name: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  language?: Locale;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface CreateBookingData {
  propertyId: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  guests: {
    adults: number;
    children: number;
  };
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  paymentIntentId: string;
  acknowledgedPolicies: boolean;
}

export interface UpdateBookingData {
  checkIn?: string; // ISO date string
  checkOut?: string; // ISO date string
  guests?: {
    adults: number;
    children: number;
  };
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface CancelBookingData {
  reason: string;
}

// ─── Maintenance Ticket ───────────────────────────────────────────────────────

export interface CreateTicketData {
  propertyId: string;
  category: TicketCategory;
  priority: TicketPriority;
  title: string;
  description: string;
  images?: string[];
}

export interface UpdateTicketData {
  category?: TicketCategory;
  priority?: TicketPriority;
  title?: string;
  description?: string;
  status?: TicketStatus;
  assignedTo?: string;
  resolution?: {
    notes: string;
    cost?: number;
  };
}

export interface AddTicketCommentData {
  content: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface CreateReviewData {
  propertyId: string;
  bookingId: string;
  rating: number; // 1–5
  comment: string;
}

// ─── Inquiry ──────────────────────────────────────────────────────────────────

export interface CreateInquiryData {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface UpdateInquiryData {
  status: InquiryStatus;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UpdateUserData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
  preferences?: {
    language?: Locale;
    notifications?: Partial<{
      email: boolean;
      inApp: boolean;
      bookingUpdates: boolean;
      maintenanceUpdates: boolean;
      reviewAlerts: boolean;
      systemAlerts: boolean;
    }>;
  };
}

// ─── Search & Availability ────────────────────────────────────────────────────

export type { SearchFilters, DateRange, AvailabilityCalendar };

// ─── Paginated Response ───────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface APISuccessResponse<T> {
  data: T;
  message?: string;
}

export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ─── Re-exported domain types used in API context ─────────────────────────────

export type {
  User,
  Property,
  Booking,
  MaintenanceTicket,
  TicketComment,
  Review,
  Inquiry,
  Notification,
  BookingStatus,
};

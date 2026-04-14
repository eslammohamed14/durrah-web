/**
 * Core domain models for the Durrah Property Management Platform.
 */

// ─── Locale ──────────────────────────────────────────────────────────────────

export type Locale = 'en' | 'ar';

// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'guest' | 'investor' | 'owner';
export type AuthMethod = 'phone' | 'email' | 'both';

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  bookingUpdates: boolean;
  maintenanceUpdates: boolean;
  reviewAlerts: boolean;
  systemAlerts: boolean;
}

export interface User {
  id: string;
  phoneNumber?: string;
  email?: string;
  name: string;
  roles: UserRole[];
  authMethod: AuthMethod;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    language: Locale;
    notifications: NotificationPreferences;
  };
}

// ─── Property ────────────────────────────────────────────────────────────────

export type PropertyCategory = 'rent' | 'buy' | 'shop' | 'activity';
export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'shop' | 'activity_venue';
export type PropertyStatus = 'active' | 'inactive' | 'pending';

export interface CancellationPolicyRule {
  daysBeforeCheckIn: number;
  refundPercentage: number; // 0–100
}

export interface CancellationPolicy {
  type: 'flexible' | 'moderate' | 'strict' | 'non_refundable';
  description: Record<Locale, string>;
  rules: CancellationPolicyRule[];
}

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AvailabilityCalendar {
  propertyId: string;
  bookedDates: string[]; // ISO date strings
  blockedDates: string[]; // ISO date strings
  minStay?: number;
  maxStay?: number;
}

export interface Property {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  category: PropertyCategory;
  type: PropertyType;
  ownerId: string;
  investorIds: string[];
  location: {
    address: Record<Locale, string>;
    coordinates: Coordinates;
    area: string;
  };
  specifications: {
    size: number; // square meters
    rooms?: number;
    bathrooms?: number;
    floors?: number;
    beachView?: boolean;
    maxGuests?: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
    priceType: 'per_night' | 'per_month' | 'total';
    fees?: { name: string; amount: number }[];
  };
  amenities: string[];
  images: PropertyImage[];
  floorPlans?: string[];
  availability?: AvailabilityCalendar;
  ratings: {
    average: number;
    count: number;
  };
  policies: {
    cancellation?: CancellationPolicy;
    houseRules: Record<Locale, string>;
    minStay?: number;
    maxStay?: number;
  };
  status: PropertyStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Booking ─────────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
  };
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  pricing: {
    basePrice: number;
    fees: { name: string; amount: number }[];
    taxes: number;
    total: number;
    currency: string;
  };
  payment: {
    transactionId: string;
    method: string;
    status: PaymentStatus;
    paidAt?: Date;
  };
  status: BookingStatus;
  cancellation?: {
    cancelledAt: Date;
    reason: string;
    refundAmount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ─── Maintenance Ticket ───────────────────────────────────────────────────────

export type TicketCategory = 'hvac' | 'plumbing' | 'electrical' | 'appliances' | 'structural' | 'other';
export type TicketPriority = 'low' | 'medium' | 'high' | 'emergency';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  userId: string;
  category: TicketCategory;
  priority: TicketPriority;
  title: string;
  description: string;
  images: string[];
  status: TicketStatus;
  assignedTo?: string;
  comments: TicketComment[];
  resolution?: {
    resolvedAt: Date;
    resolvedBy: string;
    notes: string;
    cost?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ─── Inquiry ─────────────────────────────────────────────────────────────────

export type InquiryStatus = 'new' | 'contacted' | 'closed';

export interface Inquiry {
  id: string;
  propertyId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  propertyId: string;
  bookingId: string;
  userId: string;
  rating: number; // 1–5
  comment: string;
  createdAt: Date;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType = 'booking' | 'maintenance' | 'review' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: Record<Locale, string>;
  message: Record<Locale, string>;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// ─── Search Filters ───────────────────────────────────────────────────────────

export interface DateRange {
  checkIn: Date;
  checkOut: Date;
}

export interface SearchFilters {
  category?: PropertyCategory;
  type?: PropertyType[];
  priceRange?: { min: number; max: number };
  location?: string;
  rooms?: number;
  amenities?: string[];
  beachView?: boolean;
  dateRange?: DateRange;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

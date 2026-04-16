/**
 * Mock API client — implements all API methods with in-memory data and simulated delays.
 * Toggled via NEXT_PUBLIC_USE_MOCK_API=true.
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
  AvailabilityCalendar,
  SearchFilters,
  DateRange,
  InquiryStatus,
} from "@/lib/types";
import type {
  CreateBookingData,
  UpdateBookingData,
  CreateTicketData,
  UpdateTicketData,
  CreateReviewData,
  CreateInquiryData,
  UpdateUserData,
} from "@/lib/types/api";
import { APIError, delay } from "../client";
import {
  seedUsers,
  seedProperties,
  seedBookings,
  seedTickets,
  seedReviews,
  seedInquiries,
  seedNotifications,
} from "./seedData";

// ─── In-Memory Store ──────────────────────────────────────────────────────────

class MockStore {
  users: User[];
  properties: Property[];
  bookings: Booking[];
  tickets: MaintenanceTicket[];
  reviews: Review[];
  inquiries: Inquiry[];
  notifications: Notification[];

  constructor() {
    // Deep-clone seed data so mutations don't affect the originals
    this.users = JSON.parse(JSON.stringify(seedUsers));
    this.properties = JSON.parse(JSON.stringify(seedProperties));
    this.bookings = JSON.parse(JSON.stringify(seedBookings));
    this.tickets = JSON.parse(JSON.stringify(seedTickets));
    this.reviews = JSON.parse(JSON.stringify(seedReviews));
    this.inquiries = JSON.parse(JSON.stringify(seedInquiries));
    this.notifications = JSON.parse(JSON.stringify(seedNotifications));
  }

  nextId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomDelay(): Promise<void> {
  return delay(200 + Math.random() * 300);
}

function notFound(entity: string, id: string): never {
  throw new APIError(404, `${entity} with id "${id}" not found`, "NOT_FOUND");
}

function applySearchFilters(
  properties: Property[],
  filters: SearchFilters,
): Property[] {
  return properties
    .filter((p) => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.type?.length && !filters.type.includes(p.type)) return false;
      if (
        filters.location &&
        !p.location.area.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;
      if (
        filters.rooms !== undefined &&
        p.specifications.rooms !== filters.rooms
      )
        return false;
      if (filters.beachView && !p.specifications.beachView) return false;
      if (filters.priceRange) {
        if (p.pricing.basePrice < filters.priceRange.min) return false;
        if (p.pricing.basePrice > filters.priceRange.max) return false;
      }
      if (filters.amenities?.length) {
        const has = filters.amenities.every((a) => p.amenities.includes(a));
        if (!has) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price_asc":
          return a.pricing.basePrice - b.pricing.basePrice;
        case "price_desc":
          return b.pricing.basePrice - a.pricing.basePrice;
        case "rating":
          return b.ratings.average - a.ratings.average;
        default:
          return 0;
      }
    });
}

// ─── Mock API Client ──────────────────────────────────────────────────────────

export class MockAPIClient {
  private store: MockStore;

  constructor() {
    this.store = new MockStore();
  }

  // ─── Properties ─────────────────────────────────────────────────────────────

  async searchProperties(filters: SearchFilters = {}): Promise<Property[]> {
    await randomDelay();
    return applySearchFilters(this.store.properties, filters);
  }

  async getProperty(id: string): Promise<Property> {
    await randomDelay();
    const prop = this.store.properties.find((p) => p.id === id);
    if (!prop) notFound("Property", id);
    return prop;
  }

  async getPropertyAvailability(
    id: string,
    _dateRange?: DateRange,
  ): Promise<AvailabilityCalendar> {
    await randomDelay();
    const prop = this.store.properties.find((p) => p.id === id);
    if (!prop) notFound("Property", id);
    return (
      prop.availability ?? { propertyId: id, bookedDates: [], blockedDates: [] }
    );
  }

  // ─── Bookings ────────────────────────────────────────────────────────────────

  async createBooking(data: CreateBookingData): Promise<Booking> {
    await randomDelay();
    const prop = this.store.properties.find((p) => p.id === data.propertyId);
    if (!prop) notFound("Property", data.propertyId);

    const booking: Booking = {
      id: this.store.nextId("booking"),
      propertyId: data.propertyId,
      guestId: "user-guest-1", // resolved from auth token in real API
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      guests: data.guests,
      guestInfo: data.guestInfo,
      pricing: {
        basePrice: prop.pricing.basePrice,
        fees: prop.pricing.fees ?? [],
        taxes: Math.round(prop.pricing.basePrice * 0.15),
        total: Math.round(prop.pricing.basePrice * 1.15),
        currency: prop.pricing.currency,
      },
      payment: {
        transactionId: data.paymentIntentId,
        method: "card",
        status: "completed",
        paidAt: new Date(),
      },
      status: "confirmed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.store.bookings.push(booking);
    return booking;
  }

  async getBooking(id: string): Promise<Booking> {
    await randomDelay();
    const booking = this.store.bookings.find((b) => b.id === id);
    if (!booking) notFound("Booking", id);
    return booking;
  }

  async updateBooking(id: string, data: UpdateBookingData): Promise<Booking> {
    await randomDelay();
    const idx = this.store.bookings.findIndex((b) => b.id === id);
    if (idx === -1) notFound("Booking", id);
    const updated = {
      ...this.store.bookings[idx],
      ...(data.checkIn && { checkIn: new Date(data.checkIn) }),
      ...(data.checkOut && { checkOut: new Date(data.checkOut) }),
      ...(data.guests && { guests: data.guests }),
      ...(data.guestInfo && {
        guestInfo: { ...this.store.bookings[idx].guestInfo, ...data.guestInfo },
      }),
      updatedAt: new Date(),
    };
    this.store.bookings[idx] = updated;
    return updated;
  }

  async cancelBooking(id: string, reason: string): Promise<Booking> {
    await randomDelay();
    const idx = this.store.bookings.findIndex((b) => b.id === id);
    if (idx === -1) notFound("Booking", id);
    const updated: Booking = {
      ...this.store.bookings[idx],
      status: "cancelled",
      cancellation: { cancelledAt: new Date(), reason, refundAmount: 0 },
      updatedAt: new Date(),
    };
    this.store.bookings[idx] = updated;
    return updated;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    await randomDelay();
    return this.store.bookings.filter((b) => b.guestId === userId);
  }

  // ─── Maintenance ─────────────────────────────────────────────────────────────

  async createMaintenanceTicket(
    data: CreateTicketData,
  ): Promise<MaintenanceTicket> {
    await randomDelay();
    const ticket: MaintenanceTicket = {
      id: this.store.nextId("ticket"),
      propertyId: data.propertyId,
      userId: "user-guest-1",
      category: data.category,
      priority: data.priority,
      title: data.title,
      description: data.description,
      images: data.images ?? [],
      status: "open",
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.store.tickets.push(ticket);
    return ticket;
  }

  async getMaintenanceTicket(id: string): Promise<MaintenanceTicket> {
    await randomDelay();
    const ticket = this.store.tickets.find((t) => t.id === id);
    if (!ticket) notFound("MaintenanceTicket", id);
    return ticket;
  }

  async updateMaintenanceTicket(
    id: string,
    data: UpdateTicketData,
  ): Promise<MaintenanceTicket> {
    await randomDelay();
    const idx = this.store.tickets.findIndex((t) => t.id === id);
    if (idx === -1) notFound("MaintenanceTicket", id);
    const existing = this.store.tickets[idx];
    const { resolution: resolutionUpdate, ...rest } = data;
    const resolution = resolutionUpdate
      ? {
          resolvedAt: existing.resolution?.resolvedAt ?? new Date(),
          resolvedBy: existing.resolution?.resolvedBy ?? "system",
          ...existing.resolution,
          ...resolutionUpdate,
        }
      : existing.resolution;
    const updated: MaintenanceTicket = {
      ...existing,
      ...rest,
      resolution,
      updatedAt: new Date(),
    };
    this.store.tickets[idx] = updated;
    return updated;
  }

  async addTicketComment(
    ticketId: string,
    content: string,
  ): Promise<TicketComment> {
    await randomDelay();
    const idx = this.store.tickets.findIndex((t) => t.id === ticketId);
    if (idx === -1) notFound("MaintenanceTicket", ticketId);
    const comment: TicketComment = {
      id: this.store.nextId("comment"),
      ticketId,
      userId: "user-guest-1",
      content,
      createdAt: new Date(),
    };
    this.store.tickets[idx].comments.push(comment);
    return comment;
  }

  // ─── Reviews ─────────────────────────────────────────────────────────────────

  async createReview(data: CreateReviewData): Promise<Review> {
    await randomDelay();
    const review: Review = {
      id: this.store.nextId("review"),
      propertyId: data.propertyId,
      bookingId: data.bookingId,
      userId: "user-guest-1",
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date(),
    };
    this.store.reviews.push(review);

    // Recalculate property average rating (Requirement 25.6)
    const propIdx = this.store.properties.findIndex(
      (p) => p.id === data.propertyId,
    );
    if (propIdx !== -1) {
      const propReviews = this.store.reviews.filter(
        (r) => r.propertyId === data.propertyId,
      );
      const avg =
        propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
      this.store.properties[propIdx].ratings = {
        average: Math.round(avg * 10) / 10,
        count: propReviews.length,
      };

      // Notify property owner (Requirement 28.4)
      const ownerId = this.store.properties[propIdx].ownerId;
      if (ownerId) {
        this.store.notifications.push({
          id: this.store.nextId("notif"),
          userId: ownerId,
          type: "review",
          title: { en: "New Review", ar: "تقييم جديد" },
          message: {
            en: `A guest left a ${data.rating}-star review on your property.`,
            ar: `ترك ضيف تقييماً بـ${data.rating} نجوم على عقارك.`,
          },
          read: false,
          actionUrl: `/properties/${data.propertyId}`,
          createdAt: new Date(),
        });
      }
    }

    return review;
  }

  async getPropertyReviews(propertyId: string): Promise<Review[]> {
    await randomDelay();
    return this.store.reviews
      .filter((r) => r.propertyId === propertyId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  // ─── Notifications ────────────────────────────────────────────────────────────

  async getUserNotifications(userId: string): Promise<Notification[]> {
    await randomDelay();
    return this.store.notifications
      .filter((n) => n.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await randomDelay();
    const idx = this.store.notifications.findIndex(
      (n) => n.id === notificationId,
    );
    if (idx !== -1) this.store.notifications[idx].read = true;
  }

  // ─── Inquiries ────────────────────────────────────────────────────────────────

  async createInquiry(data: CreateInquiryData): Promise<Inquiry> {
    await randomDelay();
    const inquiry: Inquiry = {
      id: this.store.nextId("inquiry"),
      propertyId: data.propertyId,
      userId: "user-guest-1",
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.store.inquiries.push(inquiry);
    return inquiry;
  }

  async getUserInquiries(userId: string): Promise<Inquiry[]> {
    await randomDelay();
    return this.store.inquiries.filter((i) => i.userId === userId);
  }

  async getPropertyInquiries(propertyId: string): Promise<Inquiry[]> {
    await randomDelay();
    return this.store.inquiries.filter((i) => i.propertyId === propertyId);
  }

  async updateInquiryStatus(
    id: string,
    status: InquiryStatus,
  ): Promise<Inquiry> {
    await randomDelay();
    const idx = this.store.inquiries.findIndex((i) => i.id === id);
    if (idx === -1) notFound("Inquiry", id);
    this.store.inquiries[idx] = {
      ...this.store.inquiries[idx],
      status,
      updatedAt: new Date(),
    };
    return this.store.inquiries[idx];
  }

  // ─── Users ────────────────────────────────────────────────────────────────────

  async getUserProfile(userId: string): Promise<User> {
    await randomDelay();
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) notFound("User", userId);
    return user;
  }

  async updateUserProfile(userId: string, data: UpdateUserData): Promise<User> {
    await randomDelay();
    const idx = this.store.users.findIndex((u) => u.id === userId);
    if (idx === -1) notFound("User", userId);
    const updated: User = {
      ...this.store.users[idx],
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
      ...(data.profileImage !== undefined && {
        profileImage: data.profileImage,
      }),
      preferences: {
        ...this.store.users[idx].preferences,
        ...(data.preferences?.language && {
          language: data.preferences.language,
        }),
        ...(data.preferences?.notifications && {
          notifications: {
            ...this.store.users[idx].preferences.notifications,
            ...data.preferences.notifications,
          },
        }),
      },
      updatedAt: new Date(),
    };
    this.store.users[idx] = updated;
    return updated;
  }
}

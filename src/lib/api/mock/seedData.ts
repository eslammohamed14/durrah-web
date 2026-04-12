/**
 * Seed data for the mock API layer.
 * Covers all property categories, user roles, bookings, tickets, inquiries, and reviews.
 */

import images from "@/constant/images";
import type {
  User,
  Property,
  Booking,
  MaintenanceTicket,
  Review,
  Inquiry,
  Notification,
} from "@/lib/types";

// ─── Users ────────────────────────────────────────────────────────────────────

export const seedUsers: User[] = [
  {
    id: "user-guest-1",
    name: "Ahmed Al-Rashid",
    email: "ahmed@example.com",
    phoneNumber: "+966501234567",
    roles: ["guest"],
    authMethod: "both",
    profileImage: undefined,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-06-01"),
    preferences: {
      language: "ar",
      notifications: {
        email: true,
        inApp: true,
        bookingUpdates: true,
        maintenanceUpdates: true,
        reviewAlerts: false,
        systemAlerts: true,
      },
    },
  },
  {
    id: "user-owner-1",
    name: "Sara Al-Otaibi",
    email: "sara@example.com",
    phoneNumber: "+966509876543",
    roles: ["owner", "investor"],
    authMethod: "email",
    profileImage: undefined,
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2024-05-20"),
    preferences: {
      language: "en",
      notifications: {
        email: true,
        inApp: true,
        bookingUpdates: true,
        maintenanceUpdates: true,
        reviewAlerts: true,
        systemAlerts: true,
      },
    },
  },
  {
    id: "user-investor-1",
    name: "Khalid Al-Mansouri",
    email: "khalid@example.com",
    phoneNumber: "+966507654321",
    roles: ["investor"],
    authMethod: "phone",
    profileImage: undefined,
    createdAt: new Date("2023-08-20"),
    updatedAt: new Date("2024-04-10"),
    preferences: {
      language: "en",
      notifications: {
        email: false,
        inApp: true,
        bookingUpdates: true,
        maintenanceUpdates: false,
        reviewAlerts: false,
        systemAlerts: true,
      },
    },
  },
];

// ─── Properties ───────────────────────────────────────────────────────────────

export const seedProperties: Property[] = [
  // Rent — Apartment
  {
    id: "prop-rent-1",
    title: { en: "Luxury Beachfront Apartment", ar: "شقة فاخرة على الشاطئ" },
    description: {
      en: "Stunning 2-bedroom apartment with panoramic sea views in Durrah Al-Arus.",
      ar: "شقة فاخرة من غرفتين مع إطلالات بحرية بانورامية في درة العروس.",
    },
    category: "rent",
    type: "apartment",
    ownerId: "user-owner-1",
    investorIds: ["user-investor-1"],
    location: {
      address: { en: "Durrah Al-Arus, Jizan", ar: "درة العروس، جازان" },
      coordinates: { lat: 16.8894, lng: 42.5611 },
      area: "Durrah Al-Arus",
    },
    specifications: {
      size: 120,
      rooms: 2,
      bathrooms: 2,
      beachView: true,
      maxGuests: 6,
    },
    pricing: {
      basePrice: 850,
      currency: "SAR",
      priceType: "per_night",
      fees: [
        { name: "Cleaning fee", amount: 150 },
        { name: "Service fee", amount: 85 },
      ],
    },
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Pool",
      "Parking",
      "Beach Access",
      "Kitchen",
      "Washer",
    ],
    images: [
      { id: "img-1", url: images.property1, alt: "Living room", order: 0 },
      { id: "img-2", url: images.property2, alt: "Bedroom", order: 1 },
      { id: "img-3", url: images.property3, alt: "Sea view", order: 2 },
    ],
    card: { status: "family" },
    availability: {
      propertyId: "prop-rent-1",
      bookedDates: ["2026-04-20", "2026-04-21", "2026-04-22"],
      blockedDates: ["2026-05-01"],
      minStay: 2,
      maxStay: 30,
    },
    ratings: { average: 4.8, count: 24 },
    policies: {
      cancellation: {
        type: "moderate",
        description: {
          en: "Free cancellation up to 5 days before check-in.",
          ar: "إلغاء مجاني حتى 5 أيام قبل تسجيل الوصول.",
        },
        rules: [
          { daysBeforeCheckIn: 5, refundPercentage: 100 },
          { daysBeforeCheckIn: 1, refundPercentage: 50 },
          { daysBeforeCheckIn: 0, refundPercentage: 0 },
        ],
      },
      houseRules: {
        en: "No smoking. No pets. Quiet hours after 10pm.",
        ar: "ممنوع التدخين. ممنوع الحيوانات الأليفة. ساعات الهدوء بعد الساعة 10 مساءً.",
      },
      minStay: 2,
    },
    status: "active",
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2024-03-15"),
  },
  // Rent — Villa
  {
    id: "prop-rent-2",
    title: { en: "Private Villa with Pool", ar: "فيلا خاصة مع مسبح" },
    description: {
      en: "Spacious 4-bedroom villa with private pool and garden, perfect for families.",
      ar: "فيلا واسعة من 4 غرف نوم مع مسبح خاص وحديقة، مثالية للعائلات.",
    },
    category: "rent",
    type: "villa",
    ownerId: "user-owner-1",
    investorIds: [],
    location: {
      address: { en: "Durrah Al-Arus, Jizan", ar: "درة العروس، جازان" },
      coordinates: { lat: 16.895, lng: 42.558 },
      area: "Durrah Al-Arus",
    },
    specifications: {
      size: 350,
      rooms: 4,
      bathrooms: 4,
      beachView: false,
      maxGuests: 12,
    },
    pricing: {
      basePrice: 2200,
      currency: "SAR",
      priceType: "per_night",
      fees: [{ name: "Cleaning fee", amount: 300 }],
    },
    amenities: [
      "WiFi",
      "Private Pool",
      "BBQ",
      "Parking",
      "Air Conditioning",
      "Kitchen",
      "Garden",
    ],
    images: [
      { id: "img-4", url: images.property4, alt: "Villa exterior", order: 0 },
      { id: "img-5", url: images.property5, alt: "Pool", order: 1 },
    ],
    card: { status: "family" },
    availability: {
      propertyId: "prop-rent-2",
      bookedDates: ["2026-04-25", "2026-04-26", "2026-04-27", "2026-04-28"],
      blockedDates: [],
      minStay: 3,
    },
    ratings: { average: 4.6, count: 11 },
    policies: {
      cancellation: {
        type: "strict",
        description: {
          en: "Non-refundable within 7 days of check-in.",
          ar: "غير قابل للاسترداد خلال 7 أيام من تسجيل الوصول.",
        },
        rules: [
          { daysBeforeCheckIn: 14, refundPercentage: 100 },
          { daysBeforeCheckIn: 7, refundPercentage: 50 },
          { daysBeforeCheckIn: 0, refundPercentage: 0 },
        ],
      },
      houseRules: {
        en: "No events or parties. No smoking indoors.",
        ar: "ممنوع الفعاليات والحفلات. ممنوع التدخين في الداخل.",
      },
      minStay: 3,
    },
    status: "active",
    createdAt: new Date("2023-07-10"),
    updatedAt: new Date("2024-02-20"),
  },
  // Buy — Apartment
  {
    id: "prop-buy-1",
    title: { en: "Sea View Apartment for Sale", ar: "شقة بإطلالة بحرية للبيع" },
    description: {
      en: "Modern 3-bedroom apartment with stunning sea views, available for purchase.",
      ar: "شقة حديثة من 3 غرف نوم مع إطلالات بحرية رائعة، متاحة للشراء.",
    },
    category: "buy",
    type: "apartment",
    ownerId: "user-owner-1",
    investorIds: ["user-investor-1"],
    location: {
      address: { en: "Durrah Al-Arus, Jizan", ar: "درة العروس، جازان" },
      coordinates: { lat: 16.887, lng: 42.564 },
      area: "Durrah Al-Arus",
    },
    specifications: { size: 180, rooms: 3, bathrooms: 3, beachView: true },
    pricing: { basePrice: 1_200_000, currency: "SAR", priceType: "total" },
    amenities: ["Parking", "Security", "Gym", "Pool", "Elevator"],
    images: [
      {
        id: "img-6",
        url: images.property6,
        alt: "Apartment exterior",
        order: 0,
      },
    ],
    card: { status: "single" },
    ratings: { average: 4.5, count: 3 },
    policies: {
      houseRules: { en: "Inquire for details.", ar: "استفسر للتفاصيل." },
    },
    status: "active",
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2024-01-05"),
  },
  // Buy — Villa
  {
    id: "prop-buy-2",
    title: {
      en: "Garden Family Villa for Sale",
      ar: "فيلا عائلية مع حديقة للبيع",
    },
    description: {
      en: "Five-bedroom villa with landscaped garden, smart home features, and private parking.",
      ar: "فيلا من خمس غرف نوم مع حديقة منسقة ومنزل ذكي وموقف خاص.",
    },
    category: "buy",
    type: "villa",
    ownerId: "user-owner-1",
    investorIds: [],
    location: {
      address: { en: "Durrah Al-Arus, Jizan", ar: "درة العروس، جازان" },
      coordinates: { lat: 16.892, lng: 42.562 },
      area: "Durrah Al-Arus",
    },
    specifications: {
      size: 420,
      rooms: 5,
      bathrooms: 5,
      beachView: false,
      floors: 2,
    },
    pricing: { basePrice: 4_100_000, currency: "SAR", priceType: "total" },
    amenities: [
      "WiFi",
      "Private Garden",
      "Parking",
      "Smart Home",
      "Maid Room",
      "Security",
    ],
    images: [
      { id: "img-8", url: images.property4, alt: "Villa facade", order: 0 },
      { id: "img-9", url: images.property5, alt: "Garden", order: 1 },
      { id: "img-10", url: images.property2, alt: "Living area", order: 2 },
    ],
    card: { status: "family" },
    ratings: { average: 4.7, count: 9 },
    policies: {
      houseRules: { en: "Viewing by appointment.", ar: "المعاينة بموعد مسبق." },
    },
    status: "active",
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-02-01"),
  },
  // Rent — Shop (commercial lease)
  {
    id: "prop-shop-1",
    title: {
      en: "Retail Shop — Ground Floor",
      ar: "محل تجاري — الطابق الأرضي",
    },
    description: {
      en: "Prime retail space in the main commercial strip, high foot traffic.",
      ar: "مساحة تجارية متميزة في الشارع التجاري الرئيسي، حركة مرور عالية.",
    },
    category: "rent",
    type: "shop",
    ownerId: "user-owner-1",
    investorIds: [],
    location: {
      address: {
        en: "Commercial District, Durrah Al-Arus",
        ar: "الحي التجاري، درة العروس",
      },
      coordinates: { lat: 16.891, lng: 42.56 },
      area: "Durrah Al-Arus",
    },
    specifications: { size: 80 },
    pricing: { basePrice: 15_000, currency: "SAR", priceType: "per_month" },
    amenities: ["Parking", "Security", "Air Conditioning", "Storage Room"],
    images: [
      { id: "img-7", url: images.property1, alt: "Shop front", order: 0 },
    ],
    card: { status: "single" },
    ratings: { average: 4.2, count: 5 },
    policies: {
      houseRules: { en: "Commercial use only.", ar: "للاستخدام التجاري فقط." },
    },
    status: "active",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2024-03-01"),
  },
  // Rent — Apartment (marina area)
  {
    id: "prop-activity-1",
    title: { en: "Marina View Studio", ar: "استوديو بإطلالة المرسى" },
    description: {
      en: "Bright studio steps from the marina — ideal for short stays and weekend getaways.",
      ar: "استوديو مشرق على بعد خطوات من المرسى — مثالي للإقامات القصيرة وعطلات نهاية الأسبوع.",
    },
    category: "rent",
    type: "apartment",
    ownerId: "user-owner-1",
    investorIds: [],
    location: {
      address: { en: "Durrah Marina, Jizan", ar: "مرسى درة، جازان" },
      coordinates: { lat: 16.893, lng: 42.557 },
      area: "Durrah Al-Arus",
    },
    specifications: { size: 55, rooms: 1, bathrooms: 1, beachView: true, maxGuests: 2 },
    pricing: { basePrice: 320, currency: "SAR", priceType: "per_night" },
    amenities: ["WiFi", "Kitchenette", "Marina Access", "Air Conditioning"],
    images: [
      { id: "img-4", url: images.property6, alt: "Villa exterior", order: 0 },
      { id: "img-5", url: images.property1, alt: "Pool", order: 1 },
    ],
    card: { status: "single" },
    availability: {
      propertyId: "prop-activity-1",
      bookedDates: ["2026-04-15", "2026-04-16"],
      blockedDates: [],
      minStay: 1,
      maxStay: 14,
    },
    ratings: { average: 4.9, count: 38 },
    policies: {
      cancellation: {
        type: "flexible",
        description: {
          en: "Full refund up to 24 hours before check-in.",
          ar: "استرداد كامل حتى 24 ساعة قبل تسجيل الوصول.",
        },
        rules: [
          { daysBeforeCheckIn: 1, refundPercentage: 100 },
          { daysBeforeCheckIn: 0, refundPercentage: 0 },
        ],
      },
      houseRules: {
        en: "No smoking. Quiet hours after 10pm.",
        ar: "ممنوع التدخين. ساعات الهدوء بعد 10 مساءً.",
      },
      minStay: 1,
    },
    status: "active",
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2024-04-01"),
  },
];

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const seedBookings: Booking[] = [
  {
    id: "booking-1",
    propertyId: "prop-rent-1",
    guestId: "user-guest-1",
    checkIn: new Date("2026-04-20"),
    checkOut: new Date("2026-04-23"),
    guests: { adults: 2, children: 1 },
    guestInfo: {
      name: "Ahmed Al-Rashid",
      email: "ahmed@example.com",
      phone: "+966501234567",
    },
    pricing: {
      basePrice: 850,
      fees: [
        { name: "Cleaning fee", amount: 150 },
        { name: "Service fee", amount: 85 },
      ],
      taxes: 128,
      total: 3013,
      currency: "SAR",
    },
    payment: {
      transactionId: "txn-001",
      method: "card",
      status: "completed",
      paidAt: new Date("2026-04-10"),
    },
    status: "confirmed",
    createdAt: new Date("2026-04-10"),
    updatedAt: new Date("2026-04-10"),
  },
  {
    id: "booking-2",
    propertyId: "prop-activity-1",
    guestId: "user-guest-1",
    checkIn: new Date("2026-04-15"),
    checkOut: new Date("2026-04-15"),
    guests: { adults: 2, children: 0 },
    guestInfo: {
      name: "Ahmed Al-Rashid",
      email: "ahmed@example.com",
      phone: "+966501234567",
    },
    pricing: {
      basePrice: 320,
      fees: [],
      taxes: 48,
      total: 688,
      currency: "SAR",
    },
    payment: {
      transactionId: "txn-002",
      method: "card",
      status: "completed",
      paidAt: new Date("2026-04-05"),
    },
    status: "completed",
    createdAt: new Date("2026-04-05"),
    updatedAt: new Date("2026-04-16"),
  },
  {
    id: "booking-3",
    propertyId: "prop-rent-2",
    guestId: "user-guest-1",
    checkIn: new Date("2026-05-10"),
    checkOut: new Date("2026-05-14"),
    guests: { adults: 4, children: 2 },
    guestInfo: {
      name: "Ahmed Al-Rashid",
      email: "ahmed@example.com",
      phone: "+966501234567",
    },
    pricing: {
      basePrice: 2200,
      fees: [{ name: "Cleaning fee", amount: 300 }],
      taxes: 375,
      total: 9475,
      currency: "SAR",
    },
    payment: {
      transactionId: "txn-003",
      method: "card",
      status: "completed",
      paidAt: new Date("2026-04-20"),
    },
    status: "confirmed",
    createdAt: new Date("2026-04-20"),
    updatedAt: new Date("2026-04-20"),
  },
];

// ─── Maintenance Tickets ──────────────────────────────────────────────────────

export const seedTickets: MaintenanceTicket[] = [
  {
    id: "ticket-1",
    propertyId: "prop-rent-1",
    userId: "user-guest-1",
    category: "plumbing",
    priority: "high",
    title: "Leaking faucet in master bathroom",
    description:
      "The faucet in the master bathroom has been dripping constantly for 2 days.",
    images: [],
    status: "in_progress",
    assignedTo: "maintenance-team",
    comments: [
      {
        id: "comment-1",
        ticketId: "ticket-1",
        userId: "user-owner-1",
        content: "Technician scheduled for tomorrow morning.",
        createdAt: new Date("2026-04-12"),
      },
    ],
    createdAt: new Date("2026-04-11"),
    updatedAt: new Date("2026-04-12"),
  },
  {
    id: "ticket-2",
    propertyId: "prop-rent-2",
    userId: "user-guest-1",
    category: "electrical",
    priority: "medium",
    title: "Living room light not working",
    description: "The main ceiling light in the living room stopped working.",
    images: [],
    status: "open",
    comments: [],
    createdAt: new Date("2026-04-08"),
    updatedAt: new Date("2026-04-08"),
  },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const seedReviews: Review[] = [
  {
    id: "review-1",
    propertyId: "prop-rent-1",
    bookingId: "booking-1",
    userId: "user-guest-1",
    rating: 5,
    comment:
      "Absolutely stunning views and very clean. Will definitely come back!",
    createdAt: new Date("2026-04-24"),
  },
  {
    id: "review-2",
    propertyId: "prop-activity-1",
    bookingId: "booking-2",
    userId: "user-guest-1",
    rating: 5,
    comment:
      "Perfect marina location, spotless studio. Would book again for a weekend.",
    createdAt: new Date("2026-04-16"),
  },
];

// ─── Inquiries ────────────────────────────────────────────────────────────────

export const seedInquiries: Inquiry[] = [
  {
    id: "inquiry-1",
    propertyId: "prop-buy-1",
    userId: "user-guest-1",
    name: "Ahmed Al-Rashid",
    email: "ahmed@example.com",
    phone: "+966501234567",
    message:
      "I am interested in purchasing this apartment. Can we schedule a viewing?",
    status: "new",
    createdAt: new Date("2026-04-09"),
    updatedAt: new Date("2026-04-09"),
  },
  {
    id: "inquiry-2",
    propertyId: "prop-shop-1",
    userId: "user-guest-1",
    name: "Ahmed Al-Rashid",
    email: "ahmed@example.com",
    phone: "+966501234567",
    message: "Looking to lease a retail space. Is this still available?",
    status: "contacted",
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-03-22"),
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const seedNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-guest-1",
    type: "booking",
    title: { en: "Booking Confirmed", ar: "تم تأكيد الحجز" },
    message: {
      en: "Your booking for Luxury Beachfront Apartment has been confirmed.",
      ar: "تم تأكيد حجزك للشقة الفاخرة على الشاطئ.",
    },
    read: false,
    actionUrl: "/dashboard/bookings/booking-1",
    createdAt: new Date("2026-04-10"),
  },
  {
    id: "notif-2",
    userId: "user-guest-1",
    type: "maintenance",
    title: { en: "Ticket Update", ar: "تحديث التذكرة" },
    message: {
      en: "Your maintenance ticket is now in progress.",
      ar: "تذكرة الصيانة الخاصة بك قيد التنفيذ الآن.",
    },
    read: true,
    actionUrl: "/dashboard/maintenance/ticket-1",
    createdAt: new Date("2026-04-12"),
  },
];

# Design Document: Durrah Property Management Platform

## Overview

The Durrah Property Management Platform is a Next.js-based web application that provides a comprehensive property management solution for rental, purchase, and commercial properties. The platform serves three distinct user roles (Guest, Investor, Owner) with role-specific dashboards and functionality.

### Core Objectives

- Enable users to search, view, and book properties across multiple categories (Rent, Buy, Shops, Activities)
- Provide secure authentication using phone/OTP verification
- Support multi-language (Arabic/English) with proper RTL/LTR text direction
- Integrate external services (Firebase, Stripe, Mapbox) through configurable interfaces
- Deliver optimal SEO performance through SSR-first architecture
- Maintain high performance and accessibility standards

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Authentication — phone/OTP and email/password (configurable)
- **Payment**: Stripe (configurable) — used for Rent and Activity bookings only
- **Maps**: Mapbox (configurable)
- **File Storage**: Firebase Storage (configurable)
- **Server State**: TanStack Query (React Query) for API data caching
- **Form Management**: React Hook Form with validation
- **Rendering**: Server-Side Rendering (SSR) for public pages, Client-Side for dashboards
- **API Layer**: Mock API with in-memory data for development; real backend API (separate project) for production

## Architecture

### High-Level Architecture

The platform follows a layered architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  (Next.js Pages, React Components, Tailwind CSS)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (Business Logic, State Management, Hooks)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Integration Layer                         │
│  (API Client, Service Adapters, External Integrations)      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  (Backend API, Firebase, Stripe, Mapbox)                    │
└─────────────────────────────────────────────────────────────┘
```

### Architectural Principles

1. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data access
2. **Dependency Inversion**: External services accessed through abstract interfaces
3. **SSR-First**: Public pages rendered server-side for SEO and performance
4. **Type Safety**: TypeScript throughout for compile-time error detection
5. **Modularity**: Reusable components and services organized by feature

### Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page (SSR)
│   ├── search/                   # Search results (SSR)
│   ├── properties/               # Property details (SSR)
│   ├── activities/               # Activity listings (SSR)
│   ├── shops/                    # Shop listings (SSR)
│   ├── auth/                     # Authentication pages
│   ├── checkout/                 # Checkout flow
│   ├── dashboard/                # User dashboards (CSR)
│   ├── api/                      # API routes (if needed)
│   └── layout.tsx                # Root layout
├── components/
│   ├── layout/                   # Layout components (Header, Footer, Sidebar)
│   ├── features/                 # Feature-specific components
│   │   ├── properties/           # Property-related components
│   │   ├── search/               # Search and filter components
│   │   ├── booking/              # Booking flow components
│   │   ├── maintenance/          # Maintenance ticket components
│   │   ├── auth/                 # Authentication components
│   │   └── dashboard/            # Dashboard components
│   ├── shared/                   # Shared business components
│   └── ui/                       # Reusable UI primitives
├── lib/
│   ├── api/                      # API client and endpoints
│   ├── services/                 # Service layer (auth, payment, maps)
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   ├── types/                    # TypeScript type definitions
│   └── constants/                # Application constants
├── config/
│   ├── i18n.ts                   # Internationalization config
│   ├── env.ts                    # Environment variable validation
│   └── services.ts               # Service configuration
└── public/
    ├── locales/                  # Translation files
    └── assets/                   # Static assets
```

## Components and Interfaces

### Component Organization

Components are organized into four categories:

1. **Layout Components**: Structural elements (Header, Footer, Sidebar, Navigation)
2. **Feature Components**: Domain-specific components (PropertyCard, BookingForm, MaintenanceTicket)
3. **Shared Components**: Reusable business components (SearchBar, DatePicker, UserAvatar)
4. **UI Components**: Primitive UI elements (Button, Input, Card, Modal, Dropdown)

### Key Component Interfaces

#### PropertyCard Component
```typescript
interface PropertyCardProps {
  property: Property;
  variant?: 'grid' | 'list';
  showActions?: boolean;
  locale: Locale;
}
```

#### SearchFilters Component
```typescript
interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  categories: PropertyCategory[];
  locale: Locale;
}
```

#### BookingForm Component
```typescript
interface BookingFormProps {
  property: Property;
  initialDates?: DateRange;
  onSubmit: (booking: BookingData) => Promise<void>;
  locale: Locale;
}
```

#### MaintenanceTicketForm Component
```typescript
interface MaintenanceTicketFormProps {
  propertyId: string;
  onSubmit: (ticket: MaintenanceTicketData) => Promise<void>;
  locale: Locale;
}
```

### Service Interfaces (Adapter Pattern)

To enable swappable external services, we define abstract interfaces:

#### Authentication Service Interface
```typescript
interface IAuthService {
  // Phone/OTP methods
  sendOTP(phoneNumber: string): Promise<{ success: boolean }>;
  verifyOTP(phoneNumber: string, otp: string): Promise<AuthResult>;
  // Email/password methods
  signInWithEmail(email: string, password: string): Promise<AuthResult>;
  registerWithEmail(email: string, password: string, name: string): Promise<AuthResult>;
  resetPassword(email: string): Promise<{ success: boolean }>;
  // Account linking
  linkPhoneToAccount(phoneNumber: string): Promise<void>;
  linkEmailToAccount(email: string, password: string): Promise<void>;
  // Session
  getCurrentUser(): Promise<User | null>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
```

#### Payment Service Interface
```typescript
interface IPaymentService {
  createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string, paymentMethod: PaymentMethod): Promise<PaymentResult>;
  refundPayment(paymentIntentId: string, amount?: number): Promise<RefundResult>;
}
```

#### Map Service Interface
```typescript
interface IMapService {
  initialize(config: MapConfig): void;
  createMap(container: HTMLElement, options: MapOptions): MapInstance;
  addMarker(map: MapInstance, coordinates: Coordinates, options?: MarkerOptions): Marker;
  setCenter(map: MapInstance, coordinates: Coordinates, zoom?: number): void;
}
```

#### File Storage Service Interface
```typescript
interface IFileStorageService {
  uploadFile(file: File, path: string): Promise<{ url: string; id: string }>;
  deleteFile(id: string): Promise<void>;
  getFileUrl(id: string): Promise<string>;
}
```

#### Email Service Interface
```typescript
interface IEmailService {
  sendEmail(to: string, template: EmailTemplate, data: Record<string, unknown>): Promise<{ success: boolean }>;
}

type EmailTemplate = 'booking_confirmation' | 'booking_cancellation' | 'inquiry_received' | 'inquiry_confirmation' | 'ticket_update' | 'password_reset';
```

### Routing Structure

The platform uses Next.js App Router without locale prefixes. Localization is handled via localStorage and a language toggle:

```
/                                  # Home page (SSR)
/search                            # Search results (SSR)
  ?category=rent|buy|shops|activities
  &type=apartment|villa|townhouse
  &priceMin=X&priceMax=Y
  &rooms=X&amenities=X,Y,Z
  &location=X&beachView=true
/properties/[id]                   # Property details (SSR)
/activities/[id]                   # Activity details (SSR)
/shops/[id]                        # Shop details (SSR)
/auth/login                        # Login page (phone/OTP or email/password)
/auth/register                     # Registration page
/auth/reset-password               # Password reset (email/password users only)
/checkout/[propertyId]             # Checkout flow (rent & activities only)
/dashboard                         # Dashboard hub — routes to role-specific views based on user's roles
/dashboard/guest                   # Guest dashboard (CSR)
/dashboard/investor                # Investor dashboard (CSR)
/dashboard/owner                   # Owner dashboard (CSR)
/dashboard/bookings                # Booking management
/dashboard/inquiries               # Inquiry management (sent inquiries for guests, received for owners)
/dashboard/maintenance             # Maintenance tickets
/dashboard/profile                 # User profile
```

### Localization Strategy

The platform uses client-side locale management:

1. **Locale Storage**: User's language preference stored in localStorage
2. **Default Locale**: English (en) is the default if no preference is set
3. **Locale Toggle**: Language switcher component in header updates localStorage and triggers re-render
4. **SSR Consideration**: Server renders with default locale, client hydrates with user's preference
5. **RTL/LTR**: Text direction applied dynamically based on selected locale

## Data Models

### Core Domain Models

#### User Model
```typescript
interface User {
  id: string;
  phoneNumber?: string; // optional if registered via email
  email?: string; // optional if registered via phone
  name: string;
  roles: ('guest' | 'investor' | 'owner')[]; // a user can hold multiple roles
  authMethod: 'phone' | 'email' | 'both'; // tracks how the user registered and whether they linked both
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    language: 'ar' | 'en';
    notifications: NotificationPreferences;
  };
}
```

#### Property Model
```typescript
interface Property {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  category: 'rent' | 'buy' | 'shop' | 'activity';
  type: 'apartment' | 'villa' | 'townhouse' | 'shop' | 'activity_venue';
  ownerId: string; // exactly one owner
  investorIds: string[]; // zero or more investors
  location: {
    address: Record<Locale, string>;
    coordinates: { lat: number; lng: number };
    area: string;
  };
  specifications: {
    size: number; // square meters
    rooms?: number;
    bathrooms?: number;
    floors?: number;
    beachView?: boolean;
    maxGuests?: number; // applicable to rent and activity categories
  };
  pricing: {
    basePrice: number;
    currency: string; // default: SAR
    priceType: 'per_night' | 'per_month' | 'total';
    fees?: { name: string; amount: number }[];
  };
  amenities: string[];
  images: PropertyImage[];
  floorPlans?: string[];
  availability?: AvailabilityCalendar; // only applicable to rent and activity categories
  ratings: {
    average: number;
    count: number;
  };
  policies: {
    cancellation?: CancellationPolicy; // only for rent/activity
    houseRules: Record<Locale, string>;
    minStay?: number;
    maxStay?: number;
  };
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

// Structured cancellation policy for computable refund logic
interface CancellationPolicy {
  type: 'flexible' | 'moderate' | 'strict' | 'non_refundable';
  description: Record<Locale, string>;
  rules: {
    daysBeforeCheckIn: number; // cancel X days before check-in
    refundPercentage: number; // refund percentage (0-100)
  }[];
}
```

#### Booking Model
```typescript
interface Booking {
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
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paidAt?: Date;
  };
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  cancellation?: {
    cancelledAt: Date;
    reason: string;
    refundAmount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### MaintenanceTicket Model
```typescript
interface MaintenanceTicket {
  id: string;
  propertyId: string;
  userId: string;
  category: 'hvac' | 'plumbing' | 'electrical' | 'appliances' | 'structural' | 'other';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  title: string;
  description: string;
  images: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
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
```

#### SearchFilters Model
```typescript
interface SearchFilters {
  category?: 'rent' | 'buy' | 'shop' | 'activity';
  type?: string[];
  priceRange?: { min: number; max: number };
  location?: string;
  rooms?: number;
  amenities?: string[];
  beachView?: boolean;
  dateRange?: { checkIn: Date; checkOut: Date };
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}
```

### Supporting Models

#### Review Model
```typescript
interface Review {
  id: string;
  propertyId: string;
  bookingId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}
```

#### Inquiry Model (Buy & Shops)
```typescript
interface Inquiry {
  id: string;
  propertyId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Notification Model
```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'maintenance' | 'review' | 'system';
  title: Record<Locale, string>;
  message: Record<Locale, string>;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}
```

## API Integration Patterns

### API Client Architecture

The API client is centralized and provides type-safe methods for all backend communication:

```typescript
class APIClient {
  private baseURL: string;
  private authToken?: string;

  constructor(config: APIConfig) {
    this.baseURL = config.baseURL;
  }

  // Authentication
  async loginWithOTP(phoneNumber: string, otp: string): Promise<AuthResponse>;
  async loginWithEmail(email: string, password: string): Promise<AuthResponse>;
  async register(data: RegisterData): Promise<AuthResponse>;
  async logout(): Promise<void>;
  
  // Properties
  async searchProperties(filters: SearchFilters): Promise<Property[]>;
  async getProperty(id: string): Promise<Property>;
  async getPropertyAvailability(id: string, dateRange: DateRange): Promise<AvailabilityCalendar>;
  
  // Bookings
  async createBooking(data: CreateBookingData): Promise<Booking>;
  async getBooking(id: string): Promise<Booking>;
  async updateBooking(id: string, data: UpdateBookingData): Promise<Booking>;
  async cancelBooking(id: string, reason: string): Promise<Booking>;
  async getUserBookings(userId: string): Promise<Booking[]>;
  
  // Maintenance
  async createMaintenanceTicket(data: CreateTicketData): Promise<MaintenanceTicket>;
  async getMaintenanceTicket(id: string): Promise<MaintenanceTicket>;
  async updateMaintenanceTicket(id: string, data: UpdateTicketData): Promise<MaintenanceTicket>;
  async addTicketComment(ticketId: string, comment: string): Promise<TicketComment>;
  
  // Reviews
  async createReview(data: CreateReviewData): Promise<Review>;
  async getPropertyReviews(propertyId: string): Promise<Review[]>;
  
  // Inquiries (Buy & Shops)
  async createInquiry(data: CreateInquiryData): Promise<Inquiry>;
  async getUserInquiries(userId: string): Promise<Inquiry[]>;
  async getPropertyInquiries(propertyId: string): Promise<Inquiry[]>;
  async updateInquiryStatus(id: string, status: Inquiry['status']): Promise<Inquiry>;
  
  // User
  async getUserProfile(userId: string): Promise<User>;
  async updateUserProfile(userId: string, data: UpdateUserData): Promise<User>;
  
  // Notifications
  async getUserNotifications(userId: string): Promise<Notification[]>;
  async markNotificationRead(notificationId: string): Promise<void>;
}
```

### Request/Response Interceptors

```typescript
interface RequestInterceptor {
  onRequest(config: RequestConfig): RequestConfig;
  onRequestError(error: Error): Promise<Error>;
}

interface ResponseInterceptor {
  onResponse(response: Response): Response;
  onResponseError(error: APIError): Promise<APIError>;
}
```

### Error Handling

```typescript
class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
  }
}

// Standardized error responses
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

## State Management Approach

### State Management Strategy

The platform uses a hybrid state management approach:

1. **Server State**: React Query (TanStack Query) for API data caching and synchronization
2. **Client State**: React Context + Hooks for UI state and user preferences
3. **Form State**: React Hook Form for form management and validation
4. **URL State**: Next.js router for search filters and pagination

### React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Context Providers

```typescript
// Auth Context
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginWithOTP: (phoneNumber: string, otp: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateUserData) => Promise<void>;
  hasRole: (role: 'guest' | 'investor' | 'owner') => boolean;
}

// Locale Context
interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

// Locale Provider Implementation
const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Load locale from localStorage on mount
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['en', 'ar'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    // Update document direction
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  const t = (key: string) => {
    // Translation function implementation
    return translations[locale][key] || key;
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LocaleContext.Provider>
  );
};

// Language Toggle Component
const LanguageToggle: React.FC = () => {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
      aria-label="Toggle language"
    >
      <GlobeIcon className="w-5 h-5" />
      <span>{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
};

// Notification Context
interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}
```

## External Service Integration Patterns

### Service Adapter Pattern

Each external service is wrapped in an adapter that implements a common interface:

```typescript
// Firebase Auth Adapter
class FirebaseAuthAdapter implements IAuthService {
  private auth: Auth;

  constructor(config: FirebaseConfig) {
    const app = initializeApp(config);
    this.auth = getAuth(app);
  }

  async sendOTP(phoneNumber: string): Promise<{ success: boolean }> {
    // Firebase implementation
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResult> {
    // Firebase implementation
  }

  // ... other methods
}

// Stripe Payment Adapter
class StripePaymentAdapter implements IPaymentService {
  private stripe: Stripe;

  constructor(config: StripeConfig) {
    this.stripe = new Stripe(config.secretKey);
  }

  async createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent> {
    // Stripe implementation
  }

  // ... other methods
}

// Mapbox Map Adapter
class MapboxAdapter implements IMapService {
  constructor(config: MapboxConfig) {
    mapboxgl.accessToken = config.accessToken;
  }

  initialize(config: MapConfig): void {
    // Mapbox initialization
  }

  // ... other methods
}
```

### Service Factory

```typescript
class ServiceFactory {
  static createAuthService(provider: string): IAuthService {
    switch (provider) {
      case 'firebase':
        return new FirebaseAuthAdapter(firebaseConfig);
      case 'custom':
        return new CustomAuthAdapter(customConfig);
      default:
        throw new Error(`Unknown auth provider: ${provider}`);
    }
  }

  static createPaymentService(provider: string): IPaymentService {
    switch (provider) {
      case 'stripe':
        return new StripePaymentAdapter(stripeConfig);
      case 'paypal':
        return new PayPalAdapter(paypalConfig);
      default:
        throw new Error(`Unknown payment provider: ${provider}`);
    }
  }

  static createMapService(provider: string): IMapService {
    switch (provider) {
      case 'mapbox':
        return new MapboxAdapter(mapboxConfig);
      case 'google':
        return new GoogleMapsAdapter(googleConfig);
      default:
        throw new Error(`Unknown map provider: ${provider}`);
    }
  }

  static createFileStorageService(provider: string): IFileStorageService {
    switch (provider) {
      case 'firebase':
        return new FirebaseStorageAdapter(firebaseConfig);
      default:
        throw new Error(`Unknown storage provider: ${provider}`);
    }
  }

  static createEmailService(provider: string): IEmailService {
    switch (provider) {
      case 'mock':
        return new MockEmailAdapter(); // logs to console during development
      default:
        throw new Error(`Unknown email provider: ${provider}`);
    }
  }
}
```

### Environment Configuration

```typescript
// config/env.ts
export const env = {
  // API
  apiBaseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  useMockAPI: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true', // toggle mock API
  
  // Service Providers
  authProvider: process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'firebase',
  paymentProvider: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'stripe',
  mapProvider: process.env.NEXT_PUBLIC_MAP_PROVIDER || 'mapbox',
  storageProvider: process.env.NEXT_PUBLIC_STORAGE_PROVIDER || 'firebase',
  emailProvider: process.env.NEXT_PUBLIC_EMAIL_PROVIDER || 'mock',
  
  // Firebase (auth + storage)
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  },
  
  // Stripe (rent & activity payments only)
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
  },
  
  // Mapbox
  mapbox: {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
  },

  // Default currency
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'SAR',
};
```

## Mock API Strategy

The backend API is being built as a separate project and is not yet available. The frontend uses a mock API layer during development:

```typescript
// lib/api/mock/MockAPIClient.ts
class MockAPIClient implements APIClient {
  private data: MockDataStore; // in-memory data store

  constructor() {
    this.data = new MockDataStore(seedData);
  }

  // All methods return realistic mock responses with simulated delays
  async searchProperties(filters: SearchFilters): Promise<Property[]> {
    await delay(300); // simulate network latency
    return this.data.properties.filter(/* apply filters */);
  }
  // ... implements all APIClient methods
}

// lib/api/index.ts — factory that switches based on env
export function createAPIClient(): APIClient {
  if (env.useMockAPI) {
    return new MockAPIClient();
  }
  return new RealAPIClient(env.apiBaseURL);
}
```

Seed data should cover:
- Multiple properties in each category (rent, buy, shop, activity)
- Users with different role combinations
- Sample bookings in various statuses
- Sample maintenance tickets
- Sample inquiries and reviews

## Performance and SEO Strategies

### Server-Side Rendering (SSR)

Public-facing pages use SSR for optimal SEO and initial load performance. Since locale is stored in localStorage (client-side), the server renders with the default locale (English), and the client hydrates with the user's preference:

```typescript
// app/properties/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.id);
  
  // Server-side metadata uses default locale (English)
  return {
    title: property.title.en,
    description: property.description.en,
    openGraph: {
      images: [property.images[0].url],
    },
    alternates: {
      languages: {
        'en': `/properties/${params.id}`,
        'ar': `/properties/${params.id}`,
      },
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const property = await getProperty(params.id);
  const reviews = await getPropertyReviews(params.id);
  
  // Component will hydrate with user's locale from localStorage
  return <PropertyDetails property={property} reviews={reviews} />;
}

// Client-side component that uses locale
'use client';

const PropertyDetails: React.FC<Props> = ({ property, reviews }) => {
  const { locale, t } = useLocale();
  
  return (
    <div>
      <h1>{property.title[locale]}</h1>
      <p>{property.description[locale]}</p>
      {/* Rest of component */}
    </div>
  );
};
```

### Handling SSR/CSR Locale Mismatch

To prevent hydration mismatches, use a client-only wrapper for locale-dependent content:

```typescript
// components/shared/ClientOnly.tsx
'use client';

const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return placeholder or default content during SSR
    return null;
  }

  return <>{children}</>;
};

// Usage in components
<ClientOnly>
  <LocalizedContent />
</ClientOnly>
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src={property.images[0].url}
  alt={property.title[locale]}
  width={800}
  height={600}
  priority={index === 0}
  loading={index === 0 ? 'eager' : 'lazy'}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Code Splitting

```typescript
// Dynamic imports for heavy components
const PropertyMap = dynamic(() => import('@/components/features/properties/PropertyMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

const ImageGallery = dynamic(() => import('@/components/features/properties/ImageGallery'), {
  loading: () => <GallerySkeleton />,
});
```

### Caching Strategy

```typescript
// Static page generation for property listings
export const revalidate = 3600; // Revalidate every hour

// API route caching
export async function GET(request: Request) {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### Bundle Optimization

- Tree shaking for unused code elimination
- Minification of JavaScript and CSS
- Compression (gzip/brotli) for static assets
- Route-based code splitting
- Lazy loading for below-the-fold content

### SEO Implementation

```typescript
// Structured data for property listings (uses default locale for SEO)
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: property.title.en, // Default to English for SEO
  description: property.description.en,
  image: property.images.map(img => img.url),
  offers: {
    '@type': 'Offer',
    price: property.pricing.basePrice,
    priceCurrency: property.pricing.currency,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: property.ratings.average,
    reviewCount: property.ratings.count,
  },
};

// Root layout with locale support
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="alternate" hrefLang="en" href={`${siteUrl}`} />
        <link rel="alternate" hrefLang="ar" href={`${siteUrl}`} />
      </head>
      <body>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}

// Client-side script to update html attributes based on localStorage
// This runs before React hydration to prevent flashing
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      const locale = localStorage.getItem('locale') || 'en';
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    })();
  `
}} />
```

### Known Limitations

- **SEO and Arabic content**: Since locale is stored in localStorage (client-side only), search engine crawlers will only index the English (default) content. Arabic content is rendered client-side after hydration. A future migration to URL-based locale prefixes (e.g., `/ar/properties/[id]`) would resolve this but is out of scope for the initial build.
- **Real-time availability**: Property availability is fetched via polling (React Query with `staleTime`) rather than real-time WebSocket connections. This means there is a small window where two users could attempt to book the same dates. The backend API is responsible for preventing actual double-bookings; the frontend shows a user-friendly error if a conflict occurs.

### Performance Monitoring

- Lighthouse CI integration for performance tracking
- Web Vitals monitoring (LCP, FID, CLS)
- Real User Monitoring (RUM) for production metrics
- Bundle size analysis with webpack-bundle-analyzer


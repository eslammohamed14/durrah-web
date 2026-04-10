# Project Structure

## Directory Organization

```
src/
├── app/                          # Next.js App Router (pages + layouts)
│   ├── page.tsx                  # Home page (SSR)
│   ├── layout.tsx                # Root layout with LocaleProvider
│   ├── search/                   # Search results (SSR)
│   ├── properties/[id]/          # Property details (SSR)
│   ├── activities/[id]/          # Activity details (SSR)
│   ├── shops/[id]/               # Shop details (SSR)
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── reset-password/
│   ├── checkout/[propertyId]/    # Checkout flow
│   ├── dashboard/                # User dashboards (CSR)
│   │   ├── guest/
│   │   ├── investor/
│   │   ├── owner/
│   │   ├── bookings/
│   │   ├── maintenance/
│   │   └── profile/
│   ├── api/                      # API routes (if needed)
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   └── sitemap.ts                # Dynamic sitemap generation
│
├── components/
│   ├── layout/                   # Structural components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── Sidebar.tsx
│   │   ├── LanguageToggle.tsx
│   │   └── NotificationBell.tsx
│   │
│   ├── features/                 # Feature-specific components
│   │   ├── properties/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyDetails.tsx
│   │   │   ├── PropertyGallery.tsx
│   │   │   ├── PropertyMap.tsx
│   │   │   └── PropertyReviews.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchFilters.tsx
│   │   ├── booking/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── BookingList.tsx
│   │   │   ├── AvailabilityCalendar.tsx
│   │   │   └── PaymentForm.tsx
│   │   ├── maintenance/
│   │   │   ├── MaintenanceTicketForm.tsx
│   │   │   └── MaintenanceTicketList.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── OTPInput.tsx
│   │   ├── dashboard/
│   │   │   ├── GuestDashboard.tsx
│   │   │   ├── InvestorDashboard.tsx
│   │   │   └── OwnerDashboard.tsx
│   │   └── reviews/
│   │       └── ReviewForm.tsx
│   │
│   ├── shared/                   # Shared business components
│   │   ├── ClientOnly.tsx
│   │   ├── DatePicker.tsx
│   │   └── UserAvatar.tsx
│   │
│   └── ui/                       # Reusable UI primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       ├── Dropdown.tsx
│       ├── Badge.tsx
│       ├── Spinner.tsx
│       └── Toast.tsx
│
├── lib/
│   ├── api/                      # API client and endpoints
│   │   ├── client.ts             # Base API client with interceptors
│   │   ├── properties.ts         # Property endpoints
│   │   ├── bookings.ts           # Booking endpoints
│   │   ├── maintenance.ts        # Maintenance endpoints
│   │   ├── users.ts              # User endpoints
│   │   └── reviews.ts            # Review endpoints
│   │
│   ├── services/                 # Service adapters (external integrations)
│   │   ├── auth/
│   │   │   ├── IAuthService.ts
│   │   │   └── FirebaseAuthAdapter.ts
│   │   ├── payment/
│   │   │   ├── IPaymentService.ts
│   │   │   └── StripePaymentAdapter.ts
│   │   ├── map/
│   │   │   ├── IMapService.ts
│   │   │   └── MapboxAdapter.ts
│   │   └── email/
│   │       └── sendEmail.ts
│   │
│   ├── contexts/                 # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── LocaleContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useLocale.ts
│   │   ├── useNotifications.ts
│   │   └── useBooking.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── i18n.ts               # Translation helpers
│   │   ├── date.ts               # Date formatting
│   │   ├── price.ts              # Price calculations
│   │   ├── validation.ts         # Form validation
│   │   └── booking.ts            # Booking logic (cancellation, etc.)
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── index.ts              # Core domain models
│   │   ├── api.ts                # API types
│   │   └── services.ts           # Service interface types
│   │
│   └── constants/                # Application constants
│       ├── routes.ts
│       ├── categories.ts
│       └── config.ts
│
├── config/                       # Configuration files
│   ├── i18n.ts                   # i18n configuration
│   ├── env.ts                    # Environment variable validation
│   └── services.ts               # Service factory and configuration
│
└── public/
    ├── locales/                  # Translation files
    │   ├── en.json
    │   └── ar.json
    └── assets/                   # Static assets (images, icons)
```

## Component Organization Principles

### 1. Layout Components (`components/layout/`)
Structural elements that define the page layout and navigation.

**Examples**: Header, Footer, Sidebar, Navigation, LanguageToggle

### 2. Feature Components (`components/features/`)
Domain-specific components organized by feature area. Each feature has its own subdirectory.

**Examples**: 
- `properties/` - Property-related components
- `booking/` - Booking flow components
- `maintenance/` - Maintenance ticket components

### 3. Shared Components (`components/shared/`)
Reusable business components used across multiple features.

**Examples**: ClientOnly, DatePicker, UserAvatar

### 4. UI Components (`components/ui/`)
Primitive, reusable UI elements with no business logic.

**Examples**: Button, Input, Card, Modal, Dropdown

## Service Layer Pattern

All external services follow the **Adapter Pattern**:

1. Define an interface (e.g., `IAuthService.ts`)
2. Implement adapter for specific provider (e.g., `FirebaseAuthAdapter.ts`)
3. Use factory pattern in `config/services.ts` to instantiate based on environment

This allows swapping providers (Firebase → Custom Auth, Stripe → PayPal, etc.) without changing application code.

## Routing Conventions

### Public Routes (SSR)
- `/` - Home page
- `/search?category=rent&type=apartment&...` - Search with URL params
- `/properties/[id]` - Property details
- `/activities/[id]` - Activity details
- `/shops/[id]` - Shop details

### Auth Routes
- `/auth/login` - Login with phone/OTP
- `/auth/reset-password` - Password reset

### Protected Routes (CSR)
- `/dashboard/guest` - Guest dashboard
- `/dashboard/investor` - Investor dashboard
- `/dashboard/owner` - Owner dashboard
- `/dashboard/bookings` - Booking management
- `/dashboard/maintenance` - Maintenance tickets
- `/dashboard/profile` - User profile

### Checkout Flow
- `/checkout/[propertyId]` - Multi-step checkout

## File Naming Conventions

- **Components**: PascalCase (e.g., `PropertyCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase for interfaces/types (e.g., `User`, `Property`)
- **Constants**: UPPER_SNAKE_CASE for values, camelCase for files
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)

## Import Order

1. External dependencies (React, Next.js, third-party)
2. Internal absolute imports (`@/components`, `@/lib`)
3. Relative imports (`./`, `../`)
4. Type imports (if separated)
5. Styles/CSS imports

## Key Architectural Rules

1. **Separation of Concerns**: Keep presentation, business logic, and data access separate
2. **Feature-Based Organization**: Group related components by feature, not by type
3. **Dependency Inversion**: External services accessed through abstract interfaces
4. **SSR for Public Pages**: Use SSR for SEO-critical pages
5. **Type Safety**: TypeScript strict mode throughout
6. **No Business Logic in UI Components**: Keep UI components pure and reusable

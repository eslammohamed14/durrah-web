# Project Structure

## Directory Organization

```
src/
├── app/                          # Next.js App Router (pages + layouts)
│   ├── page.tsx                  # Home page (SSR)
│   ├── layout.tsx                # Root layout with LocaleProvider
│   ├── globals.css               # Global styles
│   ├── favicon.ico
│   └── auth/                     # Authentication pages
│       ├── login/
│       │   └── page.tsx
│       ├── register/
│       │   └── page.tsx
│       └── reset-password/
│           └── page.tsx
│
├── assets/                       # Static assets
│   ├── icons/                    # SVG icon components
│   └── images/                   # Image assets
│
├── components/
│   ├── layout/                   # Structural layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── Sidebar.tsx
│   │   └── LanguageToggle.tsx
│   │
│   ├── shared/                   # Shared business components
│   │   └── ClientOnly.tsx
│   │
│   └── ui/                       # Reusable UI primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       ├── Dropdown.tsx
│       ├── Badge.tsx
│       ├── Spinner.tsx
│       ├── ImageSwiper.tsx
│       ├── PropertyCard.tsx
│       └── CtaNavigateButton.tsx
│
├── config/                       # App configuration
│   ├── i18n.ts                   # i18n configuration
│   ├── env.ts                    # Environment variable validation
│   └── services.ts               # Service factory and configuration
│
├── constant/                     # Application constants
│   ├── index.ts
│   ├── images.ts
│   └── videos.ts
│
├── features/                     # Feature modules (co-located by domain)
│   ├── auth/
│   │   ├── components/           # Auth-specific components
│   │   │   ├── LoginForm.tsx
│   │   │   └── OTPInput.tsx
│   │   ├── hooks/                # Auth-specific hooks (e.g., useOTP.ts)
│   │   ├── utils/                # Auth-specific utilities
│   │   └── types/                # Auth-specific types
│   │
│   ├── home/
│   │   ├── components/           # Home section components
│   │   │   ├── heroSection/
│   │   │   ├── PropertiesSection/
│   │   │   ├── activitiesSection/
│   │   │   ├── beachesSection/
│   │   │   ├── blogsSection/
│   │   │   ├── companyMetrics/
│   │   │   ├── ctaBannerSection/
│   │   │   ├── instagramSection/
│   │   │   ├── shopsSection/
│   │   │   ├── yachtSection/
│   │   │   └── sectionTag/
│   │   ├── hooks/                # Home-specific hooks
│   │   ├── utils/                # Home-specific utilities
│   │   ├── types/                # Home-specific types
│   │   └── HomeContent.tsx       # Home page entry component
│   │
│   ├── properties/
│   │   ├── components/           # Property-specific components
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyMap.tsx
│   │   │   └── PropertyMapDynamic.tsx
│   │   ├── hooks/                # e.g., useProperty.ts, usePropertyFilters.ts
│   │   ├── utils/                # e.g., formatPropertyPrice.ts
│   │   └── types/                # e.g., Property, PropertyFilter types
│   │
│   ├── search/
│   │   ├── components/           # Search-specific components
│   │   │   └── SearchBar.tsx
│   │   ├── hooks/                # e.g., useSearch.ts, useSearchFilters.ts
│   │   ├── utils/                # e.g., buildSearchQuery.ts
│   │   └── types/                # e.g., SearchFilters, SearchResult types
│   │
│   ├── booking/
│   │   ├── components/           # Booking-specific components
│   │   │   └── PaymentForm.tsx
│   │   ├── hooks/                # e.g., useBooking.ts, useAvailability.ts
│   │   ├── utils/                # e.g., calculateBookingPrice.ts
│   │   └── types/                # e.g., Booking, BookingStatus types
│   │
│   ├── maintenance/              # (planned)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   │
│   └── dashboard/                # (planned)
│       ├── components/
│       ├── hooks/
│       ├── utils/
│       └── types/
│
├── lib/
│   ├── api/                      # API client and endpoint modules
│   │   ├── client.ts             # Base API client with interceptors
│   │   ├── index.ts              # Re-exports
│   │   ├── properties.ts
│   │   ├── bookings.ts
│   │   ├── maintenance.ts
│   │   ├── users.ts
│   │   └── mock/                 # Mock API for development
│   │       ├── MockAPIClient.ts
│   │       └── seedData.ts
│   │
│   ├── services/                 # External service adapters
│   │   ├── auth/
│   │   │   ├── IAuthService.ts
│   │   │   ├── FirebaseAuthAdapter.ts
│   │   │   └── MockAuthAdapter.ts
│   │   ├── payment/
│   │   │   ├── IPaymentService.ts
│   │   │   └── StripePaymentAdapter.ts
│   │   ├── map/
│   │   │   ├── IMapService.ts
│   │   │   └── MapboxAdapter.ts
│   │   └── storage/
│   │       ├── IFileStorageService.ts
│   │       └── FirebaseStorageAdapter.ts
│   │
│   ├── contexts/                 # React contexts
│   │   ├── AuthContext.tsx
│   │   └── LocaleContext.tsx
│   │
│   ├── types/                    # Shared TypeScript type definitions
│   │   ├── index.ts              # Core domain models
│   │   ├── api.ts                # API request/response types
│   │   └── services.ts           # Service interface types
│   │
│   └── utils/                    # Shared utility functions
│       └── i18n.ts               # Translation helpers
│
├── types/                        # Global type declarations
│   └── assets.d.ts               # Asset module declarations
│
└── public/
    ├── locales/                  # Translation files
    │   ├── en.json
    │   └── ar.json
    └── videos/
        └── discover_video.mp4
```

## Feature Module Structure

Each feature under `src/features/` follows this internal structure:

```
features/{feature-name}/
├── components/       # UI components specific to this feature
├── hooks/            # Custom hooks (data fetching, local state, side effects)
├── utils/            # Pure utility/helper functions for this feature
├── types/            # TypeScript interfaces and types scoped to this feature
└── index.tsx         # (optional) Main entry component or barrel export
```

**Rules:**

- Feature-scoped hooks, utils, and types live inside the feature folder
- Shared hooks/utils/types that are used by 2+ features go in `lib/`
- Components inside a feature should not import from other feature folders directly — use `lib/` for shared logic
- each feature should have a single entry component that render other modular components
- a component should be as small as possible

## Component Organization Principles

### 1. Layout Components (`components/layout/`)

Structural elements that define the page layout and navigation.

**Examples**: Header, Footer, Sidebar, Navigation, LanguageToggle

### 2. Feature Components (`features/{name}/components/`)

Domain-specific components co-located with their feature's hooks, utils, and types.

**Examples**:

- `features/properties/components/` - Property-related components
- `features/booking/components/` - Booking flow components

### 3. Shared Components (`components/shared/`)

Reusable business components used across multiple features.

**Examples**: ClientOnly, DatePicker, UserAvatar

### 4. UI Components (`components/ui/`)

Primitive, reusable UI elements with no business logic.

**Examples**: Button, Input, Card, Modal, Dropdown, Badge, Spinner

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
- `/auth/register` - Registration
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
2. Internal absolute imports (`@/components`, `@/lib`, `@/features`)
3. Relative imports (`./`, `../`)
4. Type imports (if separated)
5. Styles/CSS imports

## Localization Rules

The project uses **next-intl** for all translations. Follow these rules without exception:

### In Client Components (`"use client"`)

```tsx
import { useTranslations } from "next-intl";

const t = useTranslations();
// Usage — always dot-notation, no locale condition needed:
t("home.heroSubheadline");
t("booking.title");
t("common.save");
```

### In Server Components (async, no `"use client"`)

```tsx
import { getTranslations } from "next-intl/server";

const t = await getTranslations();
// Usage — same dot-notation:
t("home.heroSubheadline");
```

### Rules

- **Never** use `createTranslator` / `getBundledTranslations` from `lib/utils/i18n.ts` for rendering text — those helpers are legacy and must not be used in new code
- **Never** branch on `locale === "ar"` to return a different string — put both strings in `public/locales/en.json` and `public/locales/ar.json` and call `t("key")`
- **Never** access `property.title[locale === "ar" ? "ar" : "en"]` inline — use `t()` for UI labels; for data model fields (e.g. `Property.title`) use `property.title[locale]` where `locale` is already typed as `Locale`
- All translation keys live in `public/locales/en.json` and `public/locales/ar.json` under the same dot-path
- Add new keys to **both** locale files at the same time
- Key naming: `namespace.camelCaseKey` — e.g. `home.heroSubheadline`, `booking.cancelBooking`

### Adding a new translation key

1. Add the key + English value to `public/locales/en.json`
2. Add the key + Arabic value to `public/locales/ar.json`
3. Use `t("namespace.key")` — no condition, no fallback needed

## Key Architectural Rules

1. **Separation of Concerns**: Keep presentation, business logic, and data access separate
2. **Feature-Based Organization**: Co-locate components, hooks, utils, and types by feature
3. **Dependency Inversion**: External services accessed through abstract interfaces
4. **SSR for Public Pages**: Use SSR for SEO-critical pages
5. **Type Safety**: TypeScript strict mode throughout
6. **No Business Logic in UI Components**: Keep UI components pure and reusable
7. **Feature Isolation**: Features should not import directly from each other — share via `lib/`

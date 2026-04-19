# Project Structure

## Directory Organization

```
src/
├── app/                          # Next.js App Router (pages + layouts)
│   ├── page.tsx                  # Thin routing wrapper (see Thin App Directory Pattern)
│   ├── layout.tsx                # Root layout with LocaleProvider
│   ├── globals.css               # Global styles
│   ├── favicon.ico
│   └── auth/                     # Authentication routes — App files are wrappers only
│       ├── login/
│       │   └── page.tsx          # Thin routing wrapper
│       ├── register/
│       │   └── page.tsx          # Thin routing wrapper
│       ├── reset-password/
│       │   └── page.tsx          # Thin routing wrapper
│       └── verify-email/
│           └── page.tsx          # Thin routing wrapper
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
│   │   ├── components/           # MANDATORY — section folders as in `home/` (see Feature Module Structure)
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   │   └── index.tsx     # Actual page implementation
│   │   │   ├── register/
│   │   │   │   └── index.tsx     # Actual page implementation
│   │   │   ├── reset-password/
│   │   │   │   └── index.tsx     # Actual page implementation
│   │   │   └── verify-email/
│   │   │       └── index.tsx     # Actual page implementation
│   │   ├── hooks/                # Auth-specific hooks (e.g., useOTP.ts)
│   │   ├── utils/                # Auth-specific utilities
│   │   └── types/                # Auth-specific types
│   │
│   ├── home/                     # REFERENCE IMPLEMENTATION for feature layout
│   │   ├── pages/
│   │   │   └── root/
│   │   │       └── index.tsx     # Actual page implementation for `/` (e.g. composes HomeContent)
│   │   ├── components/           # MANDATORY: one folder per UI section
│   │   │   ├── heroSection/      # Example section — primary blueprint
│   │   │   │   ├── index.tsx     # MANDATORY: section root component (this filename only)
│   │   │   │   ├── DateRangePanel.tsx
│   │   │   │   ├── FilterField.tsx
│   │   │   │   └── filter-container.tsx
│   │   │   ├── activitiesSection/
│   │   │   │   ├── index.tsx
│   │   │   │   └── ActivityItem.tsx
│   │   │   ├── beachesSection/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── BeachItem.tsx
│   │   │   │   └── BeachesSlider.tsx
│   │   │   ├── blogsSection/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── BlogGridItem.tsx
│   │   │   │   └── FeaturedBlogCard.tsx
│   │   │   ├── companyMetrics/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── MetricItem.tsx
│   │   │   │   └── metricIcons.tsx
│   │   │   ├── ctaBannerSection/
│   │   │   │   └── index.tsx
│   │   │   ├── homeDecorativeRightEdge/
│   │   │   │   └── index.tsx
│   │   │   ├── instagramSection/
│   │   │   │   ├── index.tsx
│   │   │   │   └── InstagramPhoto.tsx
│   │   │   ├── PropertiesSection/
│   │   │   │   └── index.tsx
│   │   │   ├── sectionTag/
│   │   │   │   └── index.tsx
│   │   │   ├── shopsSection/
│   │   │   │   ├── index.tsx
│   │   │   │   └── ShopGallery.tsx
│   │   │   └── yachtSection/
│   │   │       └── index.tsx
│   │   ├── hooks/                # Home-specific hooks (e.g., useHeroFilter.ts)
│   │   ├── utils/                # Home-specific utilities (optional)
│   │   ├── types/                # Home-specific types (optional)
│   │   └── HomeContent.tsx       # Feature entry: composes section components from components/
│   │
│   ├── properties/
│   │   ├── components/           # Reusable property UI sections & widgets (same section rules as home)
│   │   ├── pages/                # Multi-route entry points (details vs map-view, etc.)
│   │   │   ├── details/
│   │   │   │   └── index.tsx
│   │   │   └── map-view/
│   │   │       └── index.tsx
│   │   ├── hooks/                # e.g., useProperty.ts, usePropertyFilters.ts
│   │   ├── utils/                # e.g., formatPropertyPrice.ts
│   │   └── types/                # e.g., Property, PropertyFilter types
│   │
│   ├── search/
│   │   ├── components/           # Same section-folder rules as `home/components/`
│   │   │   └── searchBarSection/
│   │   │       ├── index.tsx
│   │   │       └── …             # subcomponents used only by this section
│   │   ├── pages/                # If search spans multiple routes
│   │   ├── hooks/                # e.g., useSearch.ts, useSearchFilters.ts
│   │   ├── utils/                # e.g., buildSearchQuery.ts
│   │   └── types/                # e.g., SearchFilters, SearchResult types
│   │
│   ├── booking/
│   │   ├── components/           # Same section-folder rules as `home/components/`
│   │   │   └── paymentSection/
│   │   │       ├── index.tsx
│   │   │       └── …
│   │   ├── pages/                # e.g., checkout steps as separate routes
│   │   ├── hooks/                # e.g., useBooking.ts, useAvailability.ts
│   │   ├── utils/                # e.g., calculateBookingPrice.ts
│   │   └── types/                # e.g., Booking, BookingStatus types
│   │
│   ├── maintenance/              # (planned)
│   │   ├── components/
│   │   ├── pages/                # If split across dashboard URLs
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   │
│   └── dashboard/                # (planned)
│       ├── components/
│       ├── pages/
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

**Normative source:** `src/features/home/` is the canonical implementation. New and refactored features **must** match that layout unless an explicit steering exception is recorded.

### Mandatory layout

Every feature under `src/features/{feature-name}/` **must** include at least:

```
features/{feature-name}/
├── components/       # REQUIRED — all feature UI is organized here (see below)
├── hooks/            # Feature-only hooks (optional folder if empty)
├── utils/            # Feature-only pure helpers (optional)
├── types/            # Feature-only TypeScript types (optional)
└── {Feature}Content.tsx   # OPTIONAL but recommended: single composer that imports sections from components/
```

Rules that are **not** optional:

1. **`components/` is required.** No feature may omit it. All section-level UI **must** live under `components/` using the section-folder rules below. A thin root composer at the feature root (e.g. `HomeContent.tsx`) may assemble sections; it **must not** accumulate large UI that belongs in a section’s `index.tsx`.
2. **One folder per distinct UI section** inside `components/`. Name the folder after the section (e.g. `heroSection`, `activitiesSection`, `PropertiesSection`). This is the unit of composition the feature composer (e.g. `HomeContent.tsx`) imports from.
3. **Section entry file:** Within each section folder, the primary exported component for that section **must** live in a file named **`index.tsx`**. Consumers import the section via the folder path (e.g. `@/features/home/components/heroSection`). Do not name the main section file after the section title (e.g. `HeroSection.tsx`) at the folder root — **`index.tsx` only** for the section root.
4. **Co-location (section-private UI):** Any component, hook-local wrapper, or presentational fragment used **only** by that section **must** reside in the **same** section folder as its `index.tsx`. Do not place section-specific pieces in a generic `components/` sibling bucket inside the feature, and do not move them to global `src/components/` unless they are genuinely reused across features (then they belong in `components/shared/` or `components/ui/` per the rules below).
5. **Hooks at feature level:** Hooks that serve the whole feature (e.g. `useHeroFilter.ts` used by `heroSection`) live in `features/{name}/hooks/`. Section-only hooks may live next to the section if they are never imported elsewhere; prefer `hooks/` when the hook is shared across multiple sections of the same feature.
6. **Isolation:** Features do not import from other features. Share code through `src/lib/` or shared component trees as already required elsewhere in this document.
7. **Small components:** Section `index.tsx` files orchestrate layout and data; keep leaf components focused. Split into co-located files when a section grows.

### Multi-Page features

When a single feature domain is served by **more than one** App Router URL (e.g. property details and property map view, or multiple checkout steps as separate routes), **route-level entry components** for those URLs **must** live under:

```
features/{feature-name}/pages/{route-segment}/index.tsx
```

Examples (illustrative paths):

- `features/properties/pages/details/index.tsx` — composer for the `/properties/[id]` experience
- `features/properties/pages/map-view/index.tsx` — composer for a map-focused URL

**Rules:**

- **`pages/` inside the feature is only for URL-level composers** that wire data and layout for that route. Reusable UI stays in `features/{name}/components/` under section folders.
- **App Router files** (`src/app/.../page.tsx`) **must** follow **The Thin App Directory Pattern**: no UI markup; re-export the default from `features/{name}/pages/...` (see that section). Params/searchProps are passed from the wrapper only when the framework requires it — composition stays in the feature.
- A feature may still use a root composer such as `HomeContent.tsx`, but anything rendered for a URL **must** be reached through `features/{name}/pages/{page-name}/index.tsx` when that URL is implemented by `app/.../page.tsx` — the App file never contains the page body.
- Use **one folder per route segment** under `pages/`, with **`index.tsx`** as the entry file for that segment, consistent with the section-folder convention.

## Component Organization Principles

### 1. Layout Components (`components/layout/`)

Structural elements that define the page layout and navigation.

**Examples**: Header, Footer, Sidebar, Navigation, LanguageToggle

### 2. Feature Components (`features/{name}/components/`)

Domain UI **must** follow the section-folder model in **Feature Module Structure**: each subsection of the feature is a directory under `components/` whose public surface is `index.tsx`, with section-only subcomponents co-located in that directory. The **`home`** feature is the reference tree.

**Examples**:

- `features/home/components/heroSection/index.tsx` — section root; `DateRangePanel.tsx`, `FilterField.tsx`, etc. co-located beside it
- `features/properties/components/` — the same section-folder rules apply to each property-related section

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

### The Thin App Directory Pattern

**Mandatory.** All user-visible page UI is implemented under `src/features/{feature-name}/pages/`. The App Router tree under `src/app/` exists **only** for routing, layouts, and Next.js route module APIs.

**Rule 1:** `src/app/` **must** be used strictly for routing and Next.js route configuration (for example `metadata`, `generateStaticParams`, `generateMetadata`, segment config, and `layout.tsx` boundaries). Do not treat `src/app/**/page.tsx` as a place to build screens.

**Rule 2:** **No UI markup** (JSX/TSX elements, including a single wrapper element whose purpose is page content) is allowed inside any `src/app/**/page.tsx` file. Layout files may contain structural providers and `{children}` only as required by Next.js — not feature page bodies.

**Rule 3:** The **implementation** of each route’s page **must** live in `src/features/{feature-name}/pages/{page-name}/index.tsx` (or the same path shape under a feature subfolder agreed in steering). `{page-name}` maps one segment (or logical page) per folder; dynamic routes use the same folder naming as the app segment (e.g. `[id]/index.tsx` under `pages/` when applicable).

**Rule 4:** Each `src/app/**/page.tsx` **must** import the page’s default export from the corresponding feature `pages/` module and **re-export it as default** (and may export `metadata` or other route config alongside). No other implementation logic belongs in the App `page.tsx`.

**Example — login route**

```tsx
// src/app/auth/login/page.tsx
import { Metadata } from "next";
import LoginPage from "@/features/auth/pages/login";

export const metadata: Metadata = {
  title: "Sign In",
};

export default LoginPage;
```

The real screen composition for sign-in lives in `src/features/auth/pages/login/index.tsx` (and that file pulls in `components/` sections per **Feature Module Structure**).

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
- `/auth/verify-email` - Email verification (optional `?email=` query for the instruction line)

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

## Colors and design tokens

**Source of truth:** `src/app/globals.css`. All product colors are defined as CSS custom properties on `:root` and exposed to Tailwind under `@theme inline` as `--color-*` keys. **Do not duplicate palette values in this document** (no hex/RGB literals here); read or change them only in `globals.css`.

### `:root` tokens (use in plain CSS)

| Group | Variables |
| --- | --- |
| Base | `--background`, `--foreground` |
| Surfaces | `--surface-primary`, `--surface-lavender`, `--surface-desert-sand` |
| Text | `--text-dark`, `--text-light`, `--text-body-muted`, `--text-body-dark` |
| Status — attention | `--attention-default`, `--attention-dark`, `--attention-soft` |
| Status — danger | `--danger-default`, `--danger-dark`, `--danger-soft` |
| Status — success | `--success-default`, `--success-dark`, `--success-soft` |
| Borders | `--border-inverse`, `--border-accent`, `--border-default` |
| Primary blue scale | `--primary-blue-50` … `--primary-blue-700` |
| Primary coral scale | `--primary-coral-50` … `--primary-coral-700` |
| Primary lavender scale | `--primary-lavender-50` … `--primary-lavender-700` |
| Secondary (earth) | `--secondary-50`, `--secondary-100`, `--secondary-200` |
| Grey scale | `--grey-50` … `--grey-900` |
| Basic | `--white`, `--black` |

Example: `color: var(--text-dark);`, `background: var(--surface-primary);`.

### Tailwind theme (`@theme inline`)

Theme colors mirror the same palette via `var(...)`. Prefer Tailwind utilities when styling components: each `--color-{name}` in `globals.css` maps to utilities such as `bg-{name}`, `text-{name}`, `border-{name}` (for example `bg-surface-primary`, `text-primary-blue-400`, `border-accent`).

**Legacy aliases (backward compatible):** utilities `durrah-blue`, `durrah-coral`, `durrah-beige`, and `durrah-lavender` are wired to the same underlying values as `--primary-blue-400`, `--primary-coral-400`, `--secondary-50`, and `--primary-lavender-400` respectively.

**Also wired in theme:** `--color-background`, `--color-foreground` (root page background and default text).

### Outside the token table

A few rules in the same file use **ad hoc** colors for accessibility or third-party widgets (for example focus outlines and Swiper navigation). Those are local to those selectors; prefer the tokens above for product UI.

## Key Architectural Rules

1. **Separation of Concerns**: Keep presentation, business logic, and data access separate
2. **Feature-Based Organization**: Co-locate hooks, utils, and types by feature; organize feature UI under `features/{name}/components/` using the **Feature Module Structure** section-folder rules (`home` is the reference)
3. **Dependency Inversion**: External services accessed through abstract interfaces
4. **SSR for Public Pages**: Use SSR for SEO-critical pages
5. **Type Safety**: TypeScript strict mode throughout
6. **No Business Logic in UI Components**: Keep UI components pure and reusable
7. **Feature Isolation**: Features should not import directly from each other — share via `lib/`

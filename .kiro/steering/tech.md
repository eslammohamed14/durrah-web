# Technology Stack

## Core Framework

- **Next.js 14+** with App Router
- **TypeScript** (strict mode enabled)
- **React 18+** with Server Components

## Styling

- **Tailwind CSS** for utility-first styling
- Responsive design with mobile-first approach
- RTL/LTR support for Arabic/English

## External Services

All external services use the **Adapter Pattern** for easy swapping:

- **Authentication**: Firebase Authentication (phone/OTP)
- **Payments**: Stripe
- **Maps**: Mapbox
- **Email**: Backend email service integration

## State Management

- **React Query (TanStack Query)**: Server state, API caching, data synchronization
- **React Context + Hooks**: Client state, user preferences, locale management
- **React Hook Form**: Form state and validation
- **URL State**: Next.js router for search filters and pagination

## API Integration

- Centralized API client with TypeScript type safety
- Request/response interceptors for auth tokens and error handling
- Standardized error handling with custom APIError class
- Retry logic for failed requests

## Rendering Strategy

- **SSR (Server-Side Rendering)**: Public pages for SEO
  - Home page (`/`)
  - Search results (`/search`)
  - Property details (`/properties/[id]`)
  - Activity details (`/activities/[id]`)
  - Shop details (`/shops/[id]`)
- **CSR (Client-Side Rendering)**: Authenticated dashboards
  - Guest dashboard (`/dashboard/guest`)
  - Investor dashboard (`/dashboard/investor`)
  - Owner dashboard (`/dashboard/owner`)

## Performance Targets

- **Lighthouse Performance**: 90+ (desktop), 80+ (mobile)
- **Core Web Vitals**: Optimized LCP, FID, CLS
- Image optimization via Next.js Image component
- Code splitting and lazy loading for heavy components
- Route-based code splitting

## Accessibility

- WCAG AA compliance
- Keyboard navigation support
- ARIA labels and semantic HTML
- Screen reader compatibility
- Color contrast ratios 4.5:1 minimum

## Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright/Cypress**: E2E testing (optional)

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
npm run format       # Format code with Prettier

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests (if configured)

# Analysis
npm run analyze      # Analyze bundle size
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# API
NEXT_PUBLIC_API_BASE_URL=

# Service Providers
NEXT_PUBLIC_AUTH_PROVIDER=firebase
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe
NEXT_PUBLIC_MAP_PROVIDER=mapbox

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
```

## Key Technical Decisions

1. **No locale route prefixes**: Language switching via localStorage + toggle button
2. **Adapter pattern**: All external services behind abstract interfaces
3. **SSR for SEO**: Public pages server-rendered with default locale (English)
4. **Client hydration**: User's locale preference applied after hydration
5. **Type safety**: TypeScript throughout with strict mode
6. **Modular architecture**: Feature-based component organization

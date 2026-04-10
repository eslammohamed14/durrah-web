# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Durrah is a property management platform for rental, purchase, and commercial properties in a Middle Eastern market. Users can hold multiple roles simultaneously: Guest (books properties), Investor (views invested property bookings/revenue), and Owner (owns properties, manages maintenance/bookings). A property has exactly one Owner and zero or more Investors. The project is currently in the **specification phase** — requirements and design documents are complete but no source code has been scaffolded yet.

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Firebase Authentication (phone/OTP and email/password)
- **Payments**: Stripe (Rent & Activities only; Buy & Shops use inquiry flow)
- **Maps**: Mapbox
- **File Storage**: Firebase Storage (configurable)
- **Server State**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Rendering**: SSR for public pages, CSR for dashboard routes
- **API**: Mock API layer for development (backend is a separate project, not yet available)

## Architecture

4-layer architecture: Presentation → Application → Integration → External Services.

Key principles:
- **Adapter pattern** for external services (Firebase, Stripe, Mapbox, Firebase Storage) — all accessed through abstract interfaces so they can be swapped
- **SSR-first** for public pages (`/`, `/search`, `/properties/[id]`, `/activities/[id]`, `/shops/[id]`)
- **CSR** for authenticated dashboards (`/dashboard/guest`, `/dashboard/investor`, `/dashboard/owner`)
- Feature-based component organization under `src/components/features/`
- Service layer under `src/lib/services/`

## Planned Directory Structure

```
src/
├── app/              # Next.js App Router (pages + layouts)
├── components/
│   ├── layout/       # Header, Footer, Sidebar
│   ├── features/     # Feature modules (properties, search, booking, maintenance, auth, dashboard)
│   ├── shared/       # Shared business components
│   └── ui/           # Reusable UI primitives
├── lib/
│   ├── api/          # API client and endpoints
│   ├── services/     # Service adapters (auth, payment, maps, storage, email)
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   ├── types/        # TypeScript type definitions
│   └── constants/    # Application constants
├── config/           # i18n, env validation, service config
└── public/locales/   # ar.json, en.json translation files
```

## Specifications

Full requirements (33 user stories) and design documents live in `.kiro/specs/durrah-property-platform/`:
- `requirements.md` — user stories with acceptance criteria
- `design.md` — architecture, data models, component specs, service interfaces
- `tasks.md` — implementation task breakdown

Always consult these specs before implementing features.

## Key Domain Concepts

- **Multi-language**: Arabic (RTL) and English (LTR), persisted via localStorage, client-side switching
- **Property categories**: Rent, Buy, Shops, Activities
- **User roles**: Guest, Investor, Owner — a user can hold multiple roles; each role has a distinct dashboard
- **Dual auth**: Phone/OTP and email/password sign-in, with account linking
- **Checkout flow**: Multi-step (details → payment → confirmation) via Stripe — only for Rent and Activity categories
- **Inquiry flow**: Buy and Shop categories use a contact/inquiry form instead of payment checkout
- **Maintenance tickets**: Submitted by users, managed by owners, with status tracking and photo attachments
- **Default currency**: SAR (configurable)

## Performance Targets

- Lighthouse Performance: 95+ (public pages), 80+ (dashboards)
- WCAG accessibility compliance

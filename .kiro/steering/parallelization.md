# Parallelization Strategy for Subagents

This document defines how to safely parallelize work using subagents to maximize development velocity while avoiding conflicts.

## Core Principles

1. **File-Level Isolation**: Subagents can work in parallel if they touch completely different files
2. **Feature Isolation**: Subagents can work on different features simultaneously if there are no shared dependencies
3. **Layer Isolation**: Subagents can work on different architectural layers (UI, API, Services) in parallel
4. **Sequential Dependencies**: Tasks with dependencies must run sequentially

## Safe Parallelization Patterns

### Pattern 1: Independent Feature Components

**Safe to parallelize** when creating feature-specific components that don't share code:

```
Subagent 1: components/features/properties/PropertyCard.tsx
Subagent 2: components/features/booking/BookingForm.tsx
Subagent 3: components/features/maintenance/MaintenanceTicketForm.tsx
```

**Why safe**: Each component lives in a separate file and feature directory with no shared state.

### Pattern 2: Independent UI Primitives

**Safe to parallelize** when creating primitive UI components:

```
Subagent 1: components/ui/Button.tsx
Subagent 2: components/ui/Input.tsx
Subagent 3: components/ui/Card.tsx
Subagent 4: components/ui/Modal.tsx
```

**Why safe**: UI primitives are independent, stateless components with no interdependencies.

### Pattern 3: Independent Service Adapters

**Safe to parallelize** when implementing different service adapters:

```
Subagent 1: lib/services/auth/FirebaseAuthAdapter.ts (after IAuthService.ts exists)
Subagent 2: lib/services/payment/StripePaymentAdapter.ts (after IPaymentService.ts exists)
Subagent 3: lib/services/map/MapboxAdapter.ts (after IMapService.ts exists)
```

**Why safe**: Each adapter implements a separate interface with no shared code.

### Pattern 4: Independent API Endpoint Groups

**Safe to parallelize** when implementing different API endpoint modules:

```
Subagent 1: lib/api/properties.ts (after client.ts exists)
Subagent 2: lib/api/bookings.ts (after client.ts exists)
Subagent 3: lib/api/maintenance.ts (after client.ts exists)
Subagent 4: lib/api/reviews.ts (after client.ts exists)
```

**Why safe**: Each module handles different endpoints with no shared logic beyond the base client.

### Pattern 5: Independent Page Routes

**Safe to parallelize** when creating different page routes:

```
Subagent 1: app/properties/[id]/page.tsx
Subagent 2: app/activities/[id]/page.tsx
Subagent 3: app/shops/[id]/page.tsx
```

**Why safe**: Each page is in a separate route directory with independent data fetching.

### Pattern 6: Independent Utility Functions

**Safe to parallelize** when creating different utility modules:

```
Subagent 1: lib/utils/date.ts
Subagent 2: lib/utils/price.ts
Subagent 3: lib/utils/validation.ts
```

**Why safe**: Each utility module serves a different purpose with no shared state.

### Pattern 7: Independent Dashboard Pages

**Safe to parallelize** when creating role-specific dashboards:

```
Subagent 1: app/dashboard/guest/page.tsx + components/features/dashboard/GuestDashboard.tsx
Subagent 2: app/dashboard/investor/page.tsx + components/features/dashboard/InvestorDashboard.tsx
Subagent 3: app/dashboard/owner/page.tsx + components/features/dashboard/OwnerDashboard.tsx
```

**Why safe**: Each dashboard serves a different user role with separate components and data.

## Unsafe Parallelization Patterns (AVOID)

### Anti-Pattern 1: Shared Type Definitions

**NOT safe to parallelize**:

```
❌ Subagent 1: Adding User type to lib/types/index.ts
❌ Subagent 2: Adding Property type to lib/types/index.ts
```

**Why unsafe**: Both agents would modify the same file, causing merge conflicts.

**Solution**: Create types sequentially or split into separate files:
```
✅ Sequential: Create all core types in one task
✅ Or split: lib/types/user.ts, lib/types/property.ts (then parallelize)
```

### Anti-Pattern 2: Shared Context Providers

**NOT safe to parallelize**:

```
❌ Subagent 1: Creating AuthContext.tsx
❌ Subagent 2: Modifying app/layout.tsx to add AuthProvider
```

**Why unsafe**: Layout file needs the context to exist first (dependency).

**Solution**: Sequential execution:
```
✅ Step 1: Create AuthContext.tsx
✅ Step 2: Update app/layout.tsx to use it
```

### Anti-Pattern 3: Interdependent Components

**NOT safe to parallelize**:

```
❌ Subagent 1: Creating PropertyCard.tsx that uses Button from ui/
❌ Subagent 2: Creating Button.tsx
```

**Why unsafe**: PropertyCard depends on Button existing first.

**Solution**: Create dependencies first:
```
✅ Step 1: Create ui/Button.tsx
✅ Step 2: Create PropertyCard.tsx (can now import Button)
```

### Anti-Pattern 4: Base Client and Endpoints

**NOT safe to parallelize**:

```
❌ Subagent 1: Creating lib/api/client.ts
❌ Subagent 2: Creating lib/api/properties.ts (imports client)
```

**Why unsafe**: Endpoints depend on the base client existing.

**Solution**: Sequential execution:
```
✅ Step 1: Create lib/api/client.ts
✅ Step 2: Parallelize endpoint modules (properties, bookings, etc.)
```

### Anti-Pattern 5: Interface and Implementation

**NOT safe to parallelize**:

```
❌ Subagent 1: Creating IAuthService.ts interface
❌ Subagent 2: Creating FirebaseAuthAdapter.ts (implements IAuthService)
```

**Why unsafe**: Implementation depends on interface existing.

**Solution**: Sequential execution:
```
✅ Step 1: Create IAuthService.ts interface
✅ Step 2: Create FirebaseAuthAdapter.ts implementation
```

## Parallelization Decision Tree

```
Can tasks be parallelized?
│
├─ Do they modify the same file?
│  ├─ YES → ❌ NOT SAFE (sequential only)
│  └─ NO → Continue...
│
├─ Does one task depend on the other's output?
│  ├─ YES → ❌ NOT SAFE (sequential only)
│  └─ NO → Continue...
│
├─ Do they share imported dependencies that don't exist yet?
│  ├─ YES → ❌ NOT SAFE (create dependencies first)
│  └─ NO → Continue...
│
├─ Are they in completely separate feature areas?
│  ├─ YES → ✅ SAFE TO PARALLELIZE
│  └─ NO → Continue...
│
└─ Do they touch the same architectural layer but different modules?
   ├─ YES → ✅ SAFE TO PARALLELIZE
   └─ NO → ❌ NOT SAFE (sequential only)
```

## Recommended Parallelization Workflow

### Phase 1: Foundation (Sequential)
Create shared dependencies that everything else needs:
- Type definitions (lib/types/index.ts)
- Base API client (lib/api/client.ts)
- Service interfaces (IAuthService, IPaymentService, IMapService)
- Core contexts (LocaleContext, AuthContext)
- Root layout (app/layout.tsx)

### Phase 2: UI Primitives (Parallel)
Create independent UI components simultaneously:
- Button, Input, Card, Modal, Dropdown, Badge, Spinner, Toast

### Phase 3: Service Adapters (Parallel)
Implement service adapters simultaneously:
- FirebaseAuthAdapter
- StripePaymentAdapter
- MapboxAdapter

### Phase 4: API Endpoints (Parallel)
Create API endpoint modules simultaneously:
- properties.ts, bookings.ts, maintenance.ts, users.ts, reviews.ts

### Phase 5: Feature Components (Parallel)
Create feature-specific components by domain:
- Group A: Property components (PropertyCard, PropertyDetails, PropertyGallery)
- Group B: Booking components (BookingForm, AvailabilityCalendar, PaymentForm)
- Group C: Maintenance components (MaintenanceTicketForm, MaintenanceTicketList)

### Phase 6: Pages (Parallel)
Create page routes simultaneously:
- Home page, Search page, Property details, Activity details, Shop details

### Phase 7: Dashboards (Parallel)
Create role-specific dashboards simultaneously:
- Guest dashboard, Investor dashboard, Owner dashboard

## Task Batching Strategy

When executing tasks from tasks.md, batch them into parallel groups:

**Example from tasks.md:**

```
Task 3.1: Create primitive UI components
├─ Batch 1 (Parallel):
│  ├─ Subagent 1: Button.tsx + Input.tsx
│  ├─ Subagent 2: Card.tsx + Modal.tsx
│  └─ Subagent 3: Dropdown.tsx + Badge.tsx + Spinner.tsx

Task 6.2-6.5: Implement API endpoints
├─ Batch 2 (Parallel - after 6.1 completes):
│  ├─ Subagent 1: properties.ts
│  ├─ Subagent 2: bookings.ts
│  ├─ Subagent 3: maintenance.ts
│  └─ Subagent 4: users.ts + reviews.ts

Task 14.1-14.3: Create dashboards
├─ Batch 3 (Parallel):
│  ├─ Subagent 1: Guest dashboard (page + component)
│  ├─ Subagent 2: Investor dashboard (page + component)
│  └─ Subagent 3: Owner dashboard (page + component)
```

## Conflict Detection Checklist

Before parallelizing, verify:

- [ ] Each subagent works on different files
- [ ] No shared imports that don't exist yet
- [ ] No modifications to the same configuration files
- [ ] No dependencies between the tasks
- [ ] Each task has all prerequisites completed
- [ ] No shared state or context modifications

## Maximum Parallelization Guidelines

- **UI Components**: Up to 4-6 subagents (one per component or small group)
- **API Endpoints**: Up to 4-5 subagents (one per endpoint module)
- **Feature Components**: Up to 3-4 subagents (one per feature area)
- **Pages**: Up to 3-4 subagents (one per page type)
- **Dashboards**: Up to 3 subagents (one per role)

## When to Stay Sequential

Always execute sequentially for:
1. **Foundation setup** (project init, config, base types)
2. **Shared type definitions** (adding to same file)
3. **Context provider setup** (creating context + adding to layout)
4. **Interface → Implementation** (create interface before adapter)
5. **Base → Extension** (create base client before endpoints)
6. **Integration tasks** (connecting multiple systems)
7. **Testing tasks** (may need all code to exist first)

## Monitoring Parallel Execution

When running parallel subagents:
1. Track which files each subagent is modifying
2. Monitor for unexpected import errors (indicates missing dependency)
3. Watch for merge conflicts (indicates unsafe parallelization)
4. Verify each subagent completes successfully before proceeding
5. Run type checking after parallel batch completes

## Recovery from Conflicts

If conflicts occur during parallel execution:
1. Identify which subagents conflicted
2. Determine the root cause (shared file, missing dependency, etc.)
3. Revert conflicting changes
4. Re-run tasks sequentially
5. Update this document with the new anti-pattern

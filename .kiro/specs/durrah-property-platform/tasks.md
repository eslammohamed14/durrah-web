# Implementation Plan: Durrah Property Management Platform

## Overview

This implementation plan breaks down the Durrah Property Management Platform into discrete, actionable coding tasks. The platform is built with Next.js 14+ (App Router), TypeScript, and Tailwind CSS, featuring multi-language support (Arabic/English), dual authentication via Firebase (phone/OTP and email/password), payment processing through Stripe (for rent and activities only), and map integration with Mapbox. The backend API is a separate project and is not yet available — all API calls are mocked during development.

The implementation follows an incremental approach: foundation → core UI → features → integration → testing → deployment.

## Tasks

- [-] 1. Project setup and foundation
  - [x] 1.1 Initialize Next.js project with TypeScript and Tailwind CSS
    - Create Next.js 14+ project with App Router
    - Configure TypeScript with strict mode
    - Set up Tailwind CSS with custom theme configuration
    - Create directory structure (app, components, lib, config, public)
    - _Requirements: 17.1, 17.2, 17.5_

  - [x] 1.2 Configure environment variables and service configuration
    - Create .env.example with all required variables (including NEXT_PUBLIC_USE_MOCK_API, storage, email provider)
    - Implement config/env.ts for environment variable validation (include defaultCurrency: SAR)
    - Implement config/services.ts for service provider configuration
    - _Requirements: 23.1, 23.5, 33.2_

  - [x] 1.3 Set up TypeScript type definitions
    - Create lib/types/index.ts with core domain models (User, Property, Booking, MaintenanceTicket, Inquiry, CancellationPolicy)
    - User model must support multi-role (roles array) and dual auth (authMethod field)
    - Property model must support ownerId + investorIds, maxGuests, structured CancellationPolicy
    - Create lib/types/api.ts with API request/response types
    - Create lib/types/services.ts with service interface types (IAuthService, IPaymentService, IMapService, IFileStorageService, IEmailService)
    - _Requirements: 17.4_

  - [x] 1.4 Configure internationalization (i18n) system
    - Create config/i18n.ts with locale configuration
    - Create public/locales/en.json and public/locales/ar.json with initial translations
    - Implement lib/utils/i18n.ts with translation helper functions
    - _Requirements: 1.1, 1.4_

- [x] 2. Implement localization context and provider
  - [x] 2.1 Create LocaleContext with localStorage-based persistence
    - Implement lib/contexts/LocaleContext.tsx with locale state management
    - Implement localStorage read/write for locale persistence
    - Implement translation function (t) that reads from locale files
    - Implement RTL/LTR direction switching based on locale
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.2 Create LanguageToggle component
    - Implement components/layout/LanguageToggle.tsx with toggle button
    - Add locale switching functionality that updates localStorage and context
    - Add visual indicator for current language
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 2.3 Create ClientOnly wrapper component
    - Implement components/shared/ClientOnly.tsx to prevent hydration mismatches
    - Handle SSR/CSR locale differences
    - _Requirements: 1.1_

- [ ] 3. Build UI component library
  - [x] 3.1 Create primitive UI components
    - Implement components/ui/Button.tsx with variants (primary, secondary, outline, ghost)
    - Implement components/ui/Input.tsx with validation states
    - Implement components/ui/Card.tsx with different layouts
    - Implement components/ui/Modal.tsx with overlay and close functionality
    - Implement components/ui/Dropdown.tsx with keyboard navigation
    - Implement components/ui/Badge.tsx for status indicators
    - Implement components/ui/Spinner.tsx for loading states
    - _Requirements: 17.2, 22.1, 22.4_

  - [ ]\* 3.2 Write unit tests for UI components
    - Test Button component variants and click handlers
    - Test Input component validation and onChange behavior
    - Test Modal component open/close functionality
    - Test keyboard navigation for Dropdown
    - _Requirements: 17.2_

- [x] 4. Implement layout components
  - [x] 4.1 Create root layout with locale support
    - Implement app/layout.tsx with HTML lang and dir attributes
    - Add LocaleProvider wrapper
    - Add client-side script to update HTML attributes from localStorage before hydration
    - Add meta tags for SEO and alternate language links
    - _Requirements: 1.1, 1.2, 1.3, 19.1_

  - [x] 4.2 Create Header component with navigation
    - Implement components/layout/Header.tsx with logo, navigation links, and LanguageToggle
    - Add responsive mobile menu with hamburger icon
    - Add authentication state display (login button or user menu)
    - Implement sticky header behavior
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 4.3 Create Footer component
    - Implement components/layout/Footer.tsx with links and contact information
    - Add multi-language support for footer content
    - Add responsive layout for mobile/tablet/desktop
    - _Requirements: 16.1, 16.2, 16.3_

  - [x] 4.4 Create navigation components
    - Implement components/layout/Navigation.tsx for main navigation
    - Implement components/layout/Sidebar.tsx for dashboard navigation
    - Add active link highlighting
    - _Requirements: 17.2, 22.1_

- [x] 5. Implement authentication service and UI
  - [x] 5.1 Create authentication service interface and Firebase adapter
    - Implement lib/services/auth/IAuthService.ts interface with dual auth methods
    - Implement lib/services/auth/FirebaseAuthAdapter.ts with phone/OTP AND email/password methods
    - Implement sendOTP, verifyOTP, signInWithEmail, registerWithEmail, resetPassword, linkPhoneToAccount, linkEmailToAccount, getCurrentUser, signOut, onAuthStateChanged methods
    - _Requirements: 5.1, 5.2, 5.6, 5.9, 5.12, 23.2_

  - [x] 5.2 Create AuthContext and provider
    - Implement lib/contexts/AuthContext.tsx with user state and auth methods
    - Implement loginWithOTP, loginWithEmail, register, logout, updateProfile, hasRole functions
    - Support multi-role users (roles array instead of single role)
    - Add auth state persistence and session management
    - _Requirements: 5.10, 5.11_

  - [x] 5.3 Create login page with dual auth support
    - Implement app/auth/login/page.tsx with tabs or toggle for phone/OTP vs email/password
    - Implement OTP input component with auto-focus and validation
    - Implement email/password form with validation
    - Add OTP resend functionality with countdown timer
    - Add error handling for invalid OTP, expired codes, and wrong credentials
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 5.3b Create registration page
    - Implement app/auth/register/page.tsx with phone/OTP or email/password registration
    - Collect name, email/phone based on chosen method
    - Enforce password complexity for email registration (min 8 chars, letters + numbers)
    - _Requirements: 5.7, 5.8_

  - [x] 5.4 Create password reset page
    - Implement app/auth/reset-password/page.tsx with email input
    - Send password reset link via email (Firebase)
    - Implement new password form with complexity validation
    - Only available to users who registered with email/password
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]\* 5.5 Write integration tests for authentication flow
    - Test phone/OTP sign-in flow (send, verify, retry, expire)
    - Test email/password sign-in flow (success, wrong password)
    - Test registration with both methods
    - Test session persistence across page reloads
    - Test multi-role user detection (hasRole)
    - _Requirements: 5.1, 5.2, 5.3, 5.6_

- [x] 6. Implement API client and service layer
  - [x] 6.1 Create base API client
    - Implement lib/api/client.ts with fetch wrapper
    - Add request/response interceptors for auth tokens and error handling
    - Implement standardized error handling with APIError class
    - Add retry logic for failed requests
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [x] 6.2 Implement property API endpoints
    - Add searchProperties, getProperty, getPropertyAvailability methods to API client
    - Implement request/response type definitions
    - _Requirements: 18.1, 3.1, 4.1_

  - [x] 6.3 Implement booking API endpoints
    - Add createBooking, getBooking, updateBooking, cancelBooking, getUserBookings methods
    - Implement booking data validation
    - _Requirements: 18.1, 7.4, 8.1, 8.4_

  - [x] 6.4 Implement maintenance API endpoints
    - Add createMaintenanceTicket, getMaintenanceTicket, updateMaintenanceTicket, addTicketComment methods
    - _Requirements: 18.1, 12.5, 13.1, 13.4_

  - [x] 6.5 Implement user, review, and inquiry API endpoints
    - Add getUserProfile, updateUserProfile, createReview, getPropertyReviews methods
    - Add getUserNotifications, markNotificationRead methods
    - Add createInquiry, getUserInquiries, getPropertyInquiries, updateInquiryStatus methods
    - _Requirements: 18.1, 25.4, 28.1, 31.2, 31.5, 31.6_

  - [x] 6.6 Implement mock API layer
    - Create lib/api/mock/MockAPIClient.ts implementing all APIClient methods
    - Create lib/api/mock/seedData.ts with realistic sample data for all categories and roles
    - Implement in-memory data store with CRUD operations
    - Add simulated response delays (200-500ms)
    - Create lib/api/index.ts factory that switches between mock and real client based on env
    - _Requirements: 33.1, 33.2, 33.3, 33.4, 33.5, 33.6_

- [x] 7. Implement payment service integration
  - [x] 7.1 Create payment service interface and Stripe adapter
    - Implement lib/services/payment/IPaymentService.ts interface
    - Implement lib/services/payment/StripePaymentAdapter.ts
    - Implement createPaymentIntent, confirmPayment, refundPayment methods
    - _Requirements: 14.1, 14.2, 14.4, 23.3_

  - [x] 7.2 Create payment form component
    - Implement components/features/booking/PaymentForm.tsx with Stripe Elements
    - Add card input with validation
    - Add payment error handling and retry logic
    - Implement secure payment data handling (no storage of full card numbers)
    - _Requirements: 14.2, 14.3, 14.5, 14.6_

- [x] 8. Implement map service integration
  - [x] 8.1 Create map service interface and Mapbox adapter
    - Implement lib/services/map/IMapService.ts interface
    - Implement lib/services/map/MapboxAdapter.ts
    - Implement initialize, createMap, addMarker, setCenter methods
    - _Requirements: 15.1, 23.4_

  - [x] 8.2 Create PropertyMap component
    - Implement components/features/properties/PropertyMap.tsx with dynamic import
    - Add map initialization with property coordinates
    - Add marker with property information
    - Add zoom and pan controls
    - _Requirements: 15.2, 15.3, 15.4_

- [x] 8b. Implement file storage service
  - [x] 8b.1 Create file storage service interface and Firebase Storage adapter
    - Implement lib/services/storage/IFileStorageService.ts interface
    - Implement lib/services/storage/FirebaseStorageAdapter.ts
    - Implement uploadFile, deleteFile, getFileUrl methods
    - Add file type validation (JPEG, PNG, WebP) and size limit (5MB)
    - _Requirements: 32.1, 32.4, 32.5_

- [x] 9. Implement home page
  - [x] 9.1 Create home page with SSR
    - Implement app/page.tsx with server-side data fetching
    - Add hero section with search functionality
    - Add "Browse by Property Type" section with category cards
    - Add "Top Rated" properties section
    - Add "Distinguished Offers" section
    - Add advertisement sections
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 19.1_

  - [x] 9.2 Create SearchBar component
    - Implement components/features/search/SearchBar.tsx with category tabs
    - Add location input with autocomplete
    - Add date range picker for check-in/check-out
    - Add guest count selector
    - Add search button that navigates to search results page
    - _Requirements: 2.1, 29.1_

  - [x] 9.3 Create PropertyCard component
    - Implement components/features/properties/PropertyCard.tsx with grid and list variants
    - Display property image, title, location, price, and rating
    - Add favorite/save button
    - Implement responsive layout
    - _Requirements: 3.7, 16.1, 16.2, 16.3_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement property search and filtering
  - [x] 11.1 Create search results page with SSR
    - Implement app/search/page.tsx with server-side property fetching
    - Parse URL search params for filters
    - Display search results in grid layout
    - Add pagination or infinite scroll
    - _Requirements: 3.7, 3.8, 19.1_

  - [x] 11.2 Create SearchFilters component
    - Implement components/features/search/SearchFilters.tsx with all filter options
    - Add property type filter (apartment, villa, townhouse, shop, activity)
    - Add price range slider
    - Add amenities multi-select
    - Add location/area filter
    - Add room count filter
    - Add beach view toggle
    - Update URL params when filters change
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 11.3 Implement dynamic filter updates
    - Add real-time search results update as filters are applied
    - Add loading states during filter changes
    - Add result count display
    - Add sort options (price, rating, newest)
    - _Requirements: 3.8_

- [x] 12. Implement property details page
  - [x] 12.1 Create property details page with SSR and dynamic metadata
    - Implement app/properties/[id]/page.tsx with server-side property fetching
    - Implement generateMetadata for dynamic SEO meta tags
    - Add structured data (JSON-LD) for property listings
    - _Requirements: 4.10, 19.1, 19.2, 19.3_

  - [x] 12.2 Create PropertyGallery component
    - Implement components/features/properties/PropertyGallery.tsx with image grid
    - Add lightbox view with full-screen image display
    - Add navigation arrows and thumbnail strip
    - Implement lazy loading for images
    - Add swipe gestures for mobile
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6_

  - [x] 12.3 Create PropertyDetails component
    - Implement components/features/properties/PropertyDetails.tsx
    - Display property specifications (size, rooms, bathrooms, features)
    - Display pricing information with fee breakdown
    - Display amenities list
    - Display floor plans when available
    - Display host/owner information
    - Display booking policies (cancellation, house rules, min/max stay)
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.7, 4.9_

  - [x] 12.4 Create PropertyReviews component
    - Implement components/features/properties/PropertyReviews.tsx
    - Display average rating and review count
    - Display individual reviews with rating, date, and reviewer name
    - Add pagination for reviews
    - Sort reviews by most recent first
    - _Requirements: 4.8, 25.1, 25.2, 25.5_

  - [x] 12.5 Integrate PropertyMap into property details
    - Add PropertyMap component to property details page
    - Display property location marker
    - Add nearby points of interest
    - _Requirements: 4.6, 15.2, 15.3, 15.4_

- [x] 13. Implement booking flow
  - [x] 13.1 Create AvailabilityCalendar component
    - Implement components/features/booking/AvailabilityCalendar.tsx
    - Display available and booked dates
    - Disable unavailable dates
    - Allow date range selection
    - Calculate number of nights
    - Display minimum/maximum stay requirements
    - _Requirements: 29.1, 29.2, 29.3, 29.5, 29.6, 30.1, 30.3_

  - [x] 13.2 Create BookingForm component
    - Implement components/features/booking/BookingForm.tsx
    - Add date range selection with AvailabilityCalendar
    - Add guest count input (adults, children)
    - Display dynamic pricing based on selected dates
    - Display price breakdown (base price, fees, taxes, total)
    - Add form validation
    - _Requirements: 7.1, 7.2, 7.7, 29.4_

  - [x] 13.3 Create checkout page (Rent & Activities only)
    - Implement app/checkout/[propertyId]/page.tsx
    - Guard: redirect to inquiry form if property category is 'buy' or 'shop'
    - Display booking summary with property details and dates
    - Collect guest information (name, email, phone)
    - Display booking policies and require acknowledgment
    - Integrate PaymentForm component
    - Handle payment success and failure
    - Create booking record on successful payment
    - Send confirmation email
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_

  - [ ]\* 13.4 Write integration tests for booking flow
    - Test date selection and availability checking
    - Test price calculation with different date ranges
    - Test guest information validation
    - Test payment processing success and failure scenarios
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 14. Implement user dashboards
  - [x] 14.0 Create dashboard hub page
    - Implement app/dashboard/page.tsx that routes to role-specific views
    - If user has one role, redirect to that dashboard
    - If user has multiple roles, show role selector/tabs
    - _Requirements: 10.6, 11.7_

  - [x] 14.1 Create Guest dashboard
    - Implement app/dashboard/guest/page.tsx with client-side rendering
    - Display upcoming and past bookings
    - Display submitted inquiries (for buy/shop properties) with status
    - Display maintenance tickets
    - Display saved/favorite properties
    - Add booking history with filters
    - _Requirements: 9.1, 9.3, 9.4, 9.5, 31.6_

  - [x] 14.2 Create Investor dashboard
    - Implement app/dashboard/investor/page.tsx
    - Display invested properties with booking status (read-only)
    - Display revenue analytics and investor's share per property
    - Display occupancy rates and performance metrics
    - Display all bookings for invested properties (read-only)
    - Display maintenance tickets for invested properties (read-only)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 14.3 Create Owner dashboard
    - Implement app/dashboard/owner/page.tsx
    - Display owned properties with ability to update details and pricing
    - Display all maintenance tickets for owned properties with status management
    - Display and manage bookings for owned properties
    - Display received inquiries (buy/shop) with status management
    - Display maintenance history and costs
    - Allow blocking dates for maintenance or personal use
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 31.5_

  - [x] 14.4 Create BookingList component
    - Implement components/features/booking/BookingList.tsx
    - Display bookings with status indicators
    - Add filters by date and status
    - Add action buttons (view details, edit, cancel)
    - _Requirements: 8.1, 8.5_

  - [x] 14.5 Create profile management page
    - Implement app/dashboard/profile/page.tsx
    - Allow user to update name, email, phone number
    - Allow user to update language preference
    - Allow user to update notification preferences
    - _Requirements: 9.2_

- [x] 15. Implement booking management features
  - [x] 15.1 Create booking details page
    - Implement app/dashboard/bookings/[id]/page.tsx
    - Display complete booking information (dates, property, payment, status)
    - Add edit booking functionality (date modification)
    - Add cancel booking functionality with policy application
    - _Requirements: 8.2, 8.3, 8.4_

  - [x] 15.2 Implement booking cancellation logic
    - Create lib/utils/booking.ts with cancellation policy calculation
    - Implement refund amount calculation based on cancellation policy
    - Integrate with payment service for refund processing
    - Send cancellation notification
    - _Requirements: 8.4, 8.6_

  - [x] 15.3 Implement booking status notifications
    - Create notification system for booking status changes
    - Send email notifications for booking confirmation, cancellation, completion
    - Display in-app notifications in dashboard
    - _Requirements: 8.6, 28.1, 28.2_

- [x] 16. Implement maintenance ticket system
  - [x] 16.1 Create maintenance ticket creation form
    - Implement components/features/maintenance/MaintenanceTicketForm.tsx
    - Add category dropdown (HVAC, Plumbing, Electrical, Appliances, Structural, Other)
    - Add priority selector (Low, Medium, High, Emergency)
    - Add description textarea
    - Add image upload with preview using IFileStorageService (max 5 images, 5MB each, JPEG/PNG/WebP)
    - Validate all required fields
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 32.1, 32.2, 32.3, 32.4_

  - [x] 16.2 Create maintenance ticket submission logic
    - Implement ticket creation API call
    - Generate unique ticket ID
    - Associate ticket with property and user
    - Send confirmation notification
    - _Requirements: 12.5, 12.6, 12.7_

  - [x] 16.3 Create MaintenanceTicketList component
    - Implement components/features/maintenance/MaintenanceTicketList.tsx
    - Display tickets with status indicators (Open, In Progress, Resolved, Closed)
    - Add filters by status, category, and priority
    - Add action buttons (view details, add comment)
    - _Requirements: 13.1, 13.2, 13.6_

  - [x] 16.4 Create maintenance ticket details page
    - Implement app/dashboard/maintenance/[id]/page.tsx
    - Display complete ticket information
    - Display status history and timeline
    - Add comment section for updates
    - Display resolution information when closed
    - _Requirements: 13.1, 13.4, 13.5_

  - [x] 16.5 Implement ticket status change notifications
    - Send notifications when ticket status changes
    - Display in-app notifications
    - _Requirements: 13.3, 28.3_

- [x] 17. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Implement activity and shop listings
  - [ ] 18.1 Create activity listings page
    - Implement app/activities/page.tsx with SSR
    - Display activity cards with photos, descriptions, pricing
    - Add filters by category, price, location
    - Display duration and schedule information
    - _Requirements: 26.1, 26.2, 26.3_

  - [ ] 18.2 Create activity details page
    - Implement app/activities/[id]/page.tsx with SSR
    - Display complete activity information
    - Display availability calendar
    - Add booking functionality through checkout flow
    - _Requirements: 26.4, 26.5_

  - [ ] 18.3 Create shop listings page
    - Implement app/shops/page.tsx with SSR
    - Display shop cards with photos, specifications, lease terms
    - Add filters by size, location, price, category
    - Display amenities and features
    - _Requirements: 27.1, 27.2, 27.3, 27.5_

  - [ ] 18.4 Create shop details page
    - Implement app/shops/[id]/page.tsx with SSR
    - Display complete shop information
    - Add inquiry form for availability (using shared InquiryForm component)
    - _Requirements: 27.4, 31.1, 31.2_

  - [ ] 18.5 Create inquiry form component and buy property detail behavior
    - Implement components/features/inquiry/InquiryForm.tsx (shared by buy and shop pages)
    - Collect name, phone, email, message
    - On property detail pages with category 'buy', display InquiryForm instead of booking/checkout button
    - Send notifications to owner on submission
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.7_

- [ ] 19. Implement review system
  - [ ] 19.1 Create review submission form
    - Implement components/features/reviews/ReviewForm.tsx
    - Add star rating selector (1-5)
    - Add comment textarea
    - Validate that user has completed booking before allowing review
    - _Requirements: 25.3, 25.4_

  - [ ] 19.2 Implement review submission and rating calculation
    - Submit review to API
    - Recalculate property average rating
    - Update property rating display
    - Send notification to property owner
    - _Requirements: 25.4, 25.6, 28.4_

- [ ] 20. Implement notification system
  - [ ] 20.1 Create NotificationContext and provider
    - Implement lib/contexts/NotificationContext.tsx
    - Fetch user notifications from API
    - Implement markAsRead and clearAll functions
    - Track unread count
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.6_

  - [ ] 20.2 Create NotificationBell component
    - Implement components/layout/NotificationBell.tsx for header
    - Display unread count badge
    - Show notification dropdown on click
    - Display recent notifications with read/unread status
    - _Requirements: 28.6_

  - [ ] 20.3 Implement email notification service
    - Create lib/services/email/sendEmail.ts utility
    - Implement email templates for booking confirmation, cancellation, ticket updates
    - Integrate with backend email service
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_

- [ ] 21. Implement SEO and performance optimizations
  - [ ] 21.1 Add dynamic meta tags and structured data
    - Implement generateMetadata for all public pages
    - Add JSON-LD structured data for property, activity, and shop listings
    - Add Open Graph tags for social sharing
    - _Requirements: 19.2, 19.3_

  - [ ] 21.2 Create sitemap generation
    - Implement app/sitemap.ts for dynamic sitemap generation
    - Include all public URLs (properties, activities, shops)
    - _Requirements: 19.4_

  - [ ] 21.3 Implement image optimization
    - Use Next.js Image component throughout the application
    - Configure image sizes and formats
    - Implement lazy loading for below-the-fold images
    - _Requirements: 20.3, 24.5, 24.6_

  - [ ] 21.4 Implement code splitting and lazy loading
    - Use dynamic imports for heavy components (maps, galleries, charts)
    - Implement route-based code splitting
    - Add loading skeletons for async components
    - _Requirements: 20.4_

  - [ ] 21.5 Configure caching headers
    - Set appropriate cache headers for static assets
    - Implement revalidation strategy for dynamic pages
    - _Requirements: 20.5_

  - [ ] 21.6 Optimize bundle size
    - Analyze bundle with webpack-bundle-analyzer
    - Remove unused dependencies
    - Implement tree shaking
    - Minify JavaScript and CSS
    - _Requirements: 20.6_

- [ ] 22. Implement error handling and user feedback
  - [ ] 22.1 Create error boundary components
    - Implement app/error.tsx for global error handling
    - Implement app/not-found.tsx for 404 errors
    - Add error logging in development mode
    - _Requirements: 21.4, 21.5_

  - [ ] 22.2 Create Toast notification component
    - Implement components/ui/Toast.tsx for user feedback
    - Add success, error, warning, and info variants
    - Implement auto-dismiss with configurable duration
    - _Requirements: 21.1, 21.2_

  - [ ] 22.3 Implement form validation and error display
    - Add validation to all forms with React Hook Form
    - Display field-level error messages
    - Highlight invalid fields
    - _Requirements: 21.2, 7.7_

  - [ ] 22.4 Implement loading states
    - Add loading spinners for async operations
    - Add skeleton screens for page loading
    - Add progress indicators for multi-step flows
    - _Requirements: 21.6_

  - [ ] 22.5 Implement network error handling
    - Add retry functionality for failed API requests
    - Display user-friendly error messages
    - Add offline detection and messaging
    - _Requirements: 21.1, 21.3_

- [ ] 23. Implement accessibility features
  - [ ] 23.1 Add keyboard navigation support
    - Ensure all interactive elements are keyboard accessible
    - Add focus management for modals and dropdowns
    - Implement skip-to-content link
    - _Requirements: 22.1, 22.4_

  - [ ] 23.2 Add ARIA labels and semantic HTML
    - Add ARIA labels to all interactive elements
    - Use semantic HTML elements (nav, main, article, section)
    - Add ARIA live regions for dynamic content
    - _Requirements: 22.2, 22.5_

  - [ ] 23.3 Ensure color contrast and text resizing
    - Verify color contrast ratios meet WCAG AA standards
    - Test text resizing up to 200%
    - Ensure layout doesn't break with larger text
    - _Requirements: 22.3, 22.6_

- [ ] 24. Implement responsive design refinements
  - [ ] 24.1 Test and refine mobile layouts
    - Test all pages on mobile devices (320px to 767px)
    - Optimize touch targets for mobile
    - Implement mobile-specific navigation patterns
    - _Requirements: 16.3, 16.5_

  - [ ] 24.2 Test and refine tablet layouts
    - Test all pages on tablet devices (768px to 1919px)
    - Optimize layouts for tablet screen sizes
    - _Requirements: 16.2, 16.5_

  - [ ] 24.3 Test and refine desktop layouts
    - Test all pages on desktop screens (1920px and above)
    - Optimize layouts for large screens
    - _Requirements: 16.1, 16.5_

- [ ] 25. Testing and quality assurance
  - [ ]\* 25.1 Write unit tests for utility functions
    - Test i18n translation functions
    - Test date formatting and calculation utilities
    - Test price calculation functions
    - Test validation functions
    - _Requirements: 17.4_

  - [ ]\* 25.2 Write integration tests for critical flows
    - Test authentication flow (login, logout, password reset)
    - Test booking flow (search, select dates, checkout, payment)
    - Test maintenance ticket creation and management
    - Test review submission
    - _Requirements: 5.1, 7.1, 12.1, 25.4_

  - [ ]\* 25.3 Write E2E tests for user journeys
    - Test guest user journey (search → view property → book → manage booking)
    - Test investor user journey (view dashboard → manage properties → view bookings)
    - Test owner user journey (view dashboard → manage maintenance tickets)
    - _Requirements: 9.1, 10.1, 11.1_

  - [ ]\* 25.4 Perform accessibility testing
    - Run automated accessibility tests with axe-core
    - Test keyboard navigation manually
    - Test with screen readers (NVDA, JAWS, VoiceOver)
    - _Requirements: 22.1, 22.2, 22.5_

  - [ ]\* 25.5 Perform performance testing
    - Run Lighthouse audits on all major pages
    - Measure and optimize Core Web Vitals (LCP, FID, CLS)
    - Test on slow network connections
    - _Requirements: 20.1, 20.2_

- [ ] 26. Deployment preparation
  - [ ] 26.1 Configure production environment variables
    - Set up production environment variables for all services
    - Configure API endpoints for production
    - Set up error tracking and monitoring
    - _Requirements: 23.1_

  - [ ] 26.2 Set up build and deployment pipeline
    - Configure Next.js production build
    - Set up deployment to hosting platform (Vercel, AWS, etc.)
    - Configure CI/CD pipeline
    - _Requirements: 20.5_

  - [ ] 26.3 Create deployment documentation
    - Document environment variable requirements
    - Document deployment process
    - Document rollback procedures
    - _Requirements: 23.5_

- [ ] 27. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- The implementation follows an incremental approach with checkpoints for validation
- All external services (Firebase, Stripe, Mapbox, Firebase Storage) are abstracted behind interfaces for easy swapping
- SSR is used for public pages (home, search, property details) for SEO optimization
- Client-side rendering is used for authenticated dashboards
- Localization is handled via localStorage with a toggle switch (no route prefixes)
- The platform supports Arabic (RTL) and English (LTR) with proper text direction handling
- Authentication supports dual methods: phone/OTP and email/password, with account linking
- Users can hold multiple roles (Guest, Investor, Owner) — dashboards adapt accordingly
- Payment flow (Stripe) applies only to Rent and Activity categories; Buy and Shop categories use an inquiry flow instead
- All API calls go through a mock API layer during development (toggle via NEXT_PUBLIC_USE_MOCK_API env var); the real backend is a separate project
- Default currency is SAR (configurable via env)

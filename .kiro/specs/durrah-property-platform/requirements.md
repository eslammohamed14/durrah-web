# Requirements Document

## Introduction

The Durrah Property Management Platform is a comprehensive Next.js web application that enables users to search, view, book, and manage properties across multiple categories (Rent, Buy, Shops, Activities). The platform supports three distinct user roles (Guest, Investor, Owner) with role-specific dashboards and functionality. The system includes multi-language support (Arabic/English with RTL/LTR), authentication via phone/OTP, secure payment processing, and a maintenance ticket management system.

## Glossary

- **Platform**: The Durrah Property Management web application
- **User**: Any person interacting with the Platform (Guest, Investor, or Owner)
- **Guest**: A User who books properties for temporary stays
- **Investor**: A User who has invested in one or more Properties and can view bookings and revenue for those Properties
- **Owner**: A User who owns one or more Properties and manages maintenance, bookings, and property operations
- **Role**: A User can hold multiple Roles simultaneously (e.g., both Owner and Investor)
- **Property**: A real estate unit available for rent, purchase, or lease (residential, commercial, shop, activity venue). Each Property has exactly one Owner and zero or more Investors.
- **Unit**: A specific Property listing with details, pricing, and availability
- **Inquiry**: A contact request submitted by a User interested in buying a Property or leasing a Shop
- **Booking**: A reservation made by a Guest for a specific Unit and date range
- **Maintenance_Ticket**: A service request submitted by a User for property maintenance issues
- **Search_Engine**: The component that filters and displays Properties based on User criteria
- **Auth_System**: The authentication system supporting phone/OTP and email/password sign-in methods
- **Payment_Gateway**: The Stripe integration for processing payments
- **Map_Service**: The Mapbox integration for displaying property locations
- **Dashboard**: Role-specific interface showing User's bookings, properties, and tickets
- **Checkout_Flow**: The multi-step process for completing a Booking
- **OTP**: One-Time Password sent via SMS for authentication
- **RTL**: Right-to-Left text direction for Arabic language
- **LTR**: Left-to-Right text direction for English language
- **SSR**: Server-Side Rendering for improved SEO and security
- **API_Client**: The service layer that communicates with the backend API

## Requirements

### Requirement 1: Multi-Language Support

**User Story:** As a User, I want to view the Platform in Arabic or English, so that I can use the application in my preferred language.

#### Acceptance Criteria

1. THE Platform SHALL support Arabic and English languages
2. WHEN a User selects Arabic, THE Platform SHALL render all text in Arabic with RTL layout
3. WHEN a User selects English, THE Platform SHALL render all text in English with LTR layout
4. THE Platform SHALL persist the User's language preference across sessions
5. THE Platform SHALL apply the correct text direction (RTL/LTR) to all UI components based on selected language

### Requirement 2: Home Page Display

**User Story:** As a User, I want to see a home page with search options and featured content, so that I can quickly find properties or activities of interest.

#### Acceptance Criteria

1. THE Platform SHALL display a hero section with search functionality for Rent, Buy, Shops, and Activities
2. THE Platform SHALL display marketing advertisements in designated sections
3. THE Platform SHALL display a "Browse by Property Type" section with category cards
4. THE Platform SHALL display a "Top Rated" properties section
5. THE Platform SHALL display a "Distinguished Offers" section with featured listings
6. THE Platform SHALL render the home page using SSR for optimal SEO performance

### Requirement 3: Property Search and Filtering

**User Story:** As a User, I want to search and filter properties by various criteria, so that I can find units that match my specific needs.

#### Acceptance Criteria

1. WHEN a User enters search criteria, THE Search_Engine SHALL filter Properties by unit type (apartment, villa, townhouse, shop, activity venue)
2. WHEN a User specifies a price range, THE Search_Engine SHALL return only Properties within that range
3. WHEN a User selects amenities, THE Search_Engine SHALL return only Properties that include those amenities
4. WHEN a User specifies an area or location, THE Search_Engine SHALL return Properties in that geographic area
5. WHEN a User specifies number of rooms, THE Search_Engine SHALL return Properties with that room count
6. WHEN a User filters by beach view, THE Search_Engine SHALL return only Properties with beach view availability
7. THE Search_Engine SHALL display search results in a grid layout with property cards
8. THE Search_Engine SHALL update results dynamically as filters are applied
9. THE Search_Engine SHALL show only category-relevant filters (e.g., rooms and beach view for Rent/Buy; size and shop category for Shops; activity category for Activities)

### Requirement 4: Property Details Display

**User Story:** As a User, I want to view comprehensive details about a property, so that I can make an informed booking or purchase decision.

#### Acceptance Criteria

1. THE Platform SHALL display a photo gallery with multiple images for each Unit
2. THE Platform SHALL display Unit specifications including size, rooms, bathrooms, maximum guest capacity, and features
3. THE Platform SHALL display pricing information including base price and any additional fees
4. THE Platform SHALL display floor plans when available
5. THE Platform SHALL display a list of amenities included with the Unit
6. THE Platform SHALL display the Unit location on an interactive map using Map_Service
7. THE Platform SHALL display host or owner details including name and contact information
8. THE Platform SHALL display User ratings and reviews for the Unit
9. THE Platform SHALL display booking policies including cancellation terms and house rules
10. THE Platform SHALL render the property details page using SSR for SEO optimization

### Requirement 5: User Authentication

**User Story:** As a User, I want to sign in using my phone number with OTP or my email and password, so that I can securely access my account.

#### Acceptance Criteria

1. THE Auth_System SHALL support two sign-in methods: phone/OTP and email/password
2. WHEN a User chooses phone/OTP sign-in, THE Auth_System SHALL send an OTP to the entered phone number
3. WHEN a User enters a valid OTP within the time limit, THE Auth_System SHALL authenticate the User
4. IF a User enters an invalid OTP, THEN THE Auth_System SHALL display an error message and allow retry
5. IF an OTP expires, THEN THE Auth_System SHALL allow the User to request a new OTP
6. WHEN a User chooses email/password sign-in, THE Auth_System SHALL authenticate using email and password credentials
7. WHEN a new User registers, THE Auth_System SHALL allow registration via phone/OTP or email/password
8. WHEN registering with email/password, THE Auth_System SHALL enforce password complexity requirements (minimum 8 characters, mix of letters and numbers)
9. THE Auth_System SHALL use Firebase for authentication services
10. THE Auth_System SHALL maintain User session state across page navigations
11. THE Auth_System SHALL provide a logout function that clears the User session
12. THE Auth_System SHALL allow a User to link both phone and email credentials to a single account

### Requirement 6: Password Reset Functionality

**User Story:** As a User who registered with email/password, I want to reset my password, so that I can regain access to my account if I forget my credentials.

#### Acceptance Criteria

1. WHEN a User requests a password reset, THE Auth_System SHALL send a reset link to the registered email address
2. WHEN a User clicks the reset link, THE Auth_System SHALL allow the User to set a new password
3. THE Auth_System SHALL enforce password complexity requirements (minimum 8 characters, mix of letters and numbers)
4. IF a reset link expires, THEN THE Auth_System SHALL allow the User to request a new one
5. THE Password reset flow SHALL only be available to Users who registered with email/password (not OTP-only Users)

### Requirement 7: Checkout and Booking Flow (Rent & Activities)

**User Story:** As a Guest, I want to complete a booking with guest information and payment, so that I can reserve a rental property or activity.

#### Acceptance Criteria

1. THE Checkout_Flow SHALL only apply to Rent and Activity category Properties (not Buy or Shop)
2. WHEN a Guest initiates checkout, THE Checkout_Flow SHALL collect guest information including name, email, and phone number
3. WHEN a Guest proceeds to payment, THE Checkout_Flow SHALL display the total cost breakdown including base price, fees, and taxes
4. WHEN a Guest submits payment information, THE Payment_Gateway SHALL process the payment securely using Stripe
5. WHEN payment is successful, THE Platform SHALL create a confirmed Booking record
6. WHEN payment is successful, THE Platform SHALL send a confirmation email to the Guest
7. IF payment fails, THEN THE Checkout_Flow SHALL display an error message and allow the Guest to retry
8. THE Checkout_Flow SHALL validate all required fields before proceeding to payment
9. THE Checkout_Flow SHALL display booking policies and require Guest acknowledgment before payment

### Requirement 8: Booking Management

**User Story:** As a Guest, I want to view, edit, and cancel my bookings, so that I can manage my reservations.

#### Acceptance Criteria

1. THE Platform SHALL display all of a Guest's Bookings in their Dashboard
2. WHEN a Guest views a Booking, THE Platform SHALL display booking details including dates, property, and payment information
3. WHEN a Guest requests to edit a Booking, THE Platform SHALL allow modification of dates subject to availability
4. WHEN a Guest cancels a Booking, THE Platform SHALL apply the cancellation policy and process any applicable refund
5. THE Platform SHALL display Booking status (upcoming, active, completed, cancelled)
6. THE Platform SHALL send notifications when Booking status changes

### Requirement 9: Guest Profile and Dashboard

**User Story:** As a Guest, I want a personalized dashboard, so that I can manage my bookings and profile information.

#### Acceptance Criteria

1. THE Platform SHALL display a Guest Dashboard with upcoming and past Bookings
2. THE Platform SHALL allow a Guest to update profile information including name, email, and phone number
3. THE Platform SHALL display Maintenance_Tickets submitted by the Guest
4. THE Platform SHALL allow a Guest to view booking history with filters by date and status
5. THE Platform SHALL display saved or favorite Properties for quick access

### Requirement 10: Investor Profile and Dashboard

**User Story:** As an Investor, I want a dashboard to view my invested properties, bookings, and revenue, so that I can track my investments.

#### Acceptance Criteria

1. THE Platform SHALL display an Investor Dashboard with Properties the User has invested in and their booking status
2. THE Platform SHALL display revenue analytics and the Investor's share for each Property
3. THE Platform SHALL allow an Investor to view all Bookings for their invested Properties (read-only)
4. THE Platform SHALL display occupancy rates and performance metrics
5. THE Platform SHALL display Maintenance_Tickets for invested Properties (read-only)
6. THE Investor Dashboard SHALL be accessible alongside other role dashboards if the User holds multiple roles

### Requirement 11: Owner Profile and Dashboard

**User Story:** As an Owner, I want a dashboard to manage my properties, bookings, and maintenance, so that I can oversee property operations.

#### Acceptance Criteria

1. THE Platform SHALL display an Owner Dashboard with Properties the User owns
2. THE Platform SHALL display all Maintenance_Tickets for Owner's Properties with ability to update status
3. THE Platform SHALL allow an Owner to view and manage Bookings for their Properties
4. THE Platform SHALL allow an Owner to update Property details and pricing
5. THE Platform SHALL display maintenance history and costs per Property
6. THE Platform SHALL allow an Owner to block dates for maintenance or personal use
7. THE Owner Dashboard SHALL be accessible alongside other role dashboards if the User holds multiple roles

### Requirement 12: Maintenance Ticket Creation

**User Story:** As a User, I want to submit maintenance requests, so that property issues can be addressed.

#### Acceptance Criteria

1. WHEN a User creates a Maintenance_Ticket, THE Platform SHALL collect issue category (HVAC, Plumbing, Electrical, Appliances, Structural, Other)
2. WHEN a User creates a Maintenance_Ticket, THE Platform SHALL collect priority level (Low, Medium, High, Emergency)
3. WHEN a User creates a Maintenance_Ticket, THE Platform SHALL collect a description of the issue
4. WHEN a User creates a Maintenance_Ticket, THE Platform SHALL allow attachment of photos
5. WHEN a User submits a Maintenance_Ticket, THE Platform SHALL assign a unique ticket ID
6. WHEN a User submits a Maintenance_Ticket, THE Platform SHALL send a confirmation notification
7. THE Platform SHALL associate the Maintenance_Ticket with the relevant Property and User

### Requirement 13: Maintenance Ticket Management

**User Story:** As a User, I want to track and manage maintenance tickets, so that I can monitor issue resolution.

#### Acceptance Criteria

1. THE Platform SHALL display all Maintenance_Tickets for a User in their Dashboard
2. THE Platform SHALL display Maintenance_Ticket status (Open, In Progress, Resolved, Closed)
3. WHEN a Maintenance_Ticket status changes, THE Platform SHALL notify the User
4. THE Platform SHALL allow Users to add comments or updates to existing Maintenance_Tickets
5. THE Platform SHALL display maintenance history including resolution time and actions taken
6. THE Platform SHALL allow filtering Maintenance_Tickets by status, category, and priority

### Requirement 14: Payment Processing

**User Story:** As a Guest, I want to make secure payments, so that I can complete bookings with confidence.

#### Acceptance Criteria

1. THE Payment_Gateway SHALL integrate with Stripe for payment processing
2. THE Payment_Gateway SHALL support credit card and debit card payments
3. THE Payment_Gateway SHALL encrypt all payment information during transmission
4. WHEN payment is processed, THE Payment_Gateway SHALL return a transaction ID
5. THE Payment_Gateway SHALL handle payment failures gracefully with clear error messages
6. THE Platform SHALL store only the last 4 digits of card numbers for reference
7. THE Payment_Gateway SHALL be configurable to swap payment providers without major code changes

### Requirement 15: Map Integration

**User Story:** As a User, I want to see property locations on an interactive map, so that I can understand the geographic context.

#### Acceptance Criteria

1. THE Map_Service SHALL integrate with Mapbox for map display
2. WHEN a User views a Property details page, THE Map_Service SHALL display the Property location with a marker
3. THE Map_Service SHALL allow Users to zoom and pan the map
4. THE Map_Service SHALL display nearby points of interest when available
5. THE Map_Service SHALL be configurable to swap map providers without major code changes

### Requirement 16: Responsive Design

**User Story:** As a User, I want the Platform to work on all devices, so that I can access it from desktop, tablet, or mobile.

#### Acceptance Criteria

1. THE Platform SHALL render correctly on desktop screens (1024px and above)
2. THE Platform SHALL render correctly on tablet screens (768px to 1023px)
3. THE Platform SHALL render correctly on mobile screens (below 768px)
4. THE Platform SHALL use Tailwind CSS responsive utilities for layout adaptation
5. THE Platform SHALL maintain usability and readability across all screen sizes

### Requirement 17: Component Architecture

**User Story:** As a developer, I want a modular component architecture, so that the codebase is maintainable and scalable.

#### Acceptance Criteria

1. THE Platform SHALL organize components into logical directories (layout, features, shared, ui)
2. THE Platform SHALL implement reusable UI components (buttons, cards, forms, modals)
3. THE Platform SHALL separate business logic from presentation components
4. THE Platform SHALL use TypeScript for type safety across all components
5. THE Platform SHALL follow Next.js App Router conventions for routing and layouts

### Requirement 18: API Integration

**User Story:** As a developer, I want a clean API integration layer, so that backend communication is centralized and maintainable.

#### Acceptance Criteria

1. THE API_Client SHALL provide methods for all backend endpoints
2. THE API_Client SHALL handle authentication tokens in API requests
3. THE API_Client SHALL handle API errors and return standardized error responses
4. THE API_Client SHALL support request/response interceptors for logging and debugging
5. THE API_Client SHALL be configurable with environment variables for API base URL

### Requirement 19: SEO Optimization

**User Story:** As a business owner, I want the Platform to be optimized for search engines, so that potential customers can discover our properties.

#### Acceptance Criteria

1. THE Platform SHALL use SSR for all public-facing pages (home, search, property details)
2. THE Platform SHALL generate dynamic meta tags for each Property details page
3. THE Platform SHALL include structured data (JSON-LD) for property listings
4. THE Platform SHALL generate a sitemap.xml file with all public URLs
5. THE Platform SHALL implement proper heading hierarchy (h1, h2, h3) on all pages
6. THE Platform SHALL include descriptive alt text for all images

### Requirement 20: Performance Optimization

**User Story:** As a User, I want the Platform to load quickly, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. THE Platform SHALL achieve a Lighthouse performance score of 90 or above on desktop
2. THE Platform SHALL achieve a Lighthouse performance score of 80 or above on mobile
3. THE Platform SHALL implement image optimization using Next.js Image component
4. THE Platform SHALL implement code splitting for route-based lazy loading
5. THE Platform SHALL cache static assets with appropriate cache headers
6. THE Platform SHALL minimize JavaScript bundle size through tree shaking and minification

### Requirement 21: Error Handling and User Feedback

**User Story:** As a User, I want clear feedback when errors occur, so that I understand what went wrong and how to proceed.

#### Acceptance Criteria

1. WHEN an API request fails, THE Platform SHALL display a user-friendly error message
2. WHEN form validation fails, THE Platform SHALL highlight invalid fields with specific error messages
3. WHEN a network error occurs, THE Platform SHALL display a retry option
4. THE Platform SHALL implement error boundaries to catch and handle React component errors
5. THE Platform SHALL log errors to the console in development mode for debugging
6. THE Platform SHALL display loading states during asynchronous operations

### Requirement 22: Accessibility Compliance

**User Story:** As a User with disabilities, I want the Platform to be accessible, so that I can use all features effectively.

#### Acceptance Criteria

1. THE Platform SHALL support keyboard navigation for all interactive elements
2. THE Platform SHALL provide ARIA labels for screen reader compatibility
3. THE Platform SHALL maintain color contrast ratios of at least 4.5:1 for text
4. THE Platform SHALL provide focus indicators for interactive elements
5. THE Platform SHALL support screen reader announcements for dynamic content changes
6. THE Platform SHALL allow text resizing up to 200% without breaking layout

### Requirement 23: Configuration Management

**User Story:** As a developer, I want external service integrations to be configurable, so that providers can be swapped without major code changes.

#### Acceptance Criteria

1. THE Platform SHALL use environment variables for all external service configurations
2. THE Platform SHALL abstract Firebase authentication behind an interface that can be swapped
3. THE Platform SHALL abstract Stripe payment processing behind an interface that can be swapped
4. THE Platform SHALL abstract Mapbox integration behind an interface that can be swapped
5. THE Platform SHALL document all required environment variables in a .env.example file

### Requirement 24: Property Image Gallery

**User Story:** As a User, I want to view property images in a gallery, so that I can see all available photos clearly.

#### Acceptance Criteria

1. THE Platform SHALL display property images in a responsive grid layout
2. WHEN a User clicks an image, THE Platform SHALL open a full-screen lightbox view
3. WHEN in lightbox view, THE Platform SHALL allow navigation between images using arrows or swipe gestures
4. THE Platform SHALL display image thumbnails for quick navigation
5. THE Platform SHALL optimize images for web delivery with appropriate compression
6. THE Platform SHALL implement lazy loading for images below the fold

### Requirement 25: Property Ratings and Reviews

**User Story:** As a User, I want to read and write reviews for properties, so that I can make informed decisions and share my experiences.

#### Acceptance Criteria

1. THE Platform SHALL display average rating and total review count for each Property
2. THE Platform SHALL display individual reviews with rating, date, and reviewer name
3. WHEN a Guest completes a Booking, THE Platform SHALL allow the Guest to submit a review
4. WHEN a Guest submits a review, THE Platform SHALL collect a star rating (1-5) and written feedback
5. THE Platform SHALL display reviews in chronological order with most recent first
6. THE Platform SHALL calculate and update average ratings when new reviews are submitted

### Requirement 26: Activity Listings

**User Story:** As a User, I want to browse and book activities, so that I can plan experiences during my stay.

#### Acceptance Criteria

1. THE Platform SHALL display activity listings with photos, descriptions, and pricing
2. THE Search_Engine SHALL filter activities by category, price, and location
3. THE Platform SHALL display activity duration and schedule information
4. THE Platform SHALL allow Users to book activities through the Checkout_Flow
5. THE Platform SHALL display activity availability based on date and capacity

### Requirement 27: Shop Listings

**User Story:** As a User, I want to browse commercial shop listings, so that I can find retail or office spaces.

#### Acceptance Criteria

1. THE Platform SHALL display shop listings with photos, specifications, and lease terms
2. THE Search_Engine SHALL filter shops by size, location, and price
3. THE Platform SHALL display shop amenities and features (parking, foot traffic, utilities)
4. THE Platform SHALL allow Users to submit an Inquiry about shop availability (see Requirement 31)
5. THE Platform SHALL display shop category (retail, office, restaurant, service)

### Requirement 28: Notification System

**User Story:** As a User, I want to receive notifications about important events, so that I stay informed about my bookings and tickets.

#### Acceptance Criteria

1. WHEN a Booking is confirmed, THE Platform SHALL send a notification to the Guest
2. WHEN a Booking status changes, THE Platform SHALL send a notification to the Guest
3. WHEN a Maintenance_Ticket status changes, THE Platform SHALL send a notification to the User
4. WHEN a new review is posted, THE Platform SHALL send a notification to the Property Owner
5. THE Platform SHALL support email notifications as the primary channel (via a configurable email service adapter)
6. THE Platform SHALL display in-app notifications in the User Dashboard
7. WHEN a new Inquiry is submitted, THE Platform SHALL send a notification to the Property Owner

### Requirement 29: Date Range Selection

**User Story:** As a Guest, I want to select check-in and check-out dates, so that I can book properties for specific periods.

#### Acceptance Criteria

1. THE Platform SHALL provide a date picker for selecting check-in and check-out dates
2. THE Platform SHALL disable dates that are not available for booking
3. THE Platform SHALL calculate the total number of nights based on selected dates
4. THE Platform SHALL update pricing dynamically based on selected date range
5. THE Platform SHALL validate that check-out date is after check-in date
6. THE Platform SHALL display minimum and maximum stay requirements when applicable

### Requirement 30: Property Availability Calendar

**User Story:** As a User, I want to see property availability, so that I know when I can book.

#### Acceptance Criteria

1. THE Platform SHALL display a calendar showing available and booked dates for each Property
2. THE Platform SHALL update availability in real-time when Bookings are made
3. THE Platform SHALL display different visual indicators for available, booked, and blocked dates
4. THE Platform SHALL allow Owners and Investors to block dates for maintenance or personal use
5. THE Platform SHALL prevent double-booking of Properties

### Requirement 31: Property Inquiry Flow (Buy & Shops)

**User Story:** As a User, I want to submit an inquiry about a property for sale or a shop for lease, so that I can express interest and be contacted by the owner.

#### Acceptance Criteria

1. THE Platform SHALL display an inquiry form on Buy property detail pages and Shop detail pages (instead of a checkout flow)
2. WHEN a User submits an Inquiry, THE Platform SHALL collect the User's name, phone number, email, and a message
3. WHEN an Inquiry is submitted, THE Platform SHALL send a notification to the Property Owner
4. WHEN an Inquiry is submitted, THE Platform SHALL send a confirmation notification to the User
5. THE Platform SHALL display submitted Inquiries in the Owner Dashboard
6. THE Platform SHALL display the User's own Inquiries in the Guest Dashboard
7. THE Platform SHALL track Inquiry status (new, contacted, closed)

### Requirement 32: File Upload

**User Story:** As a User, I want to upload photos when submitting maintenance tickets, so that I can visually document issues.

#### Acceptance Criteria

1. THE Platform SHALL support image uploads (JPEG, PNG, WebP) up to 5MB per file
2. THE Platform SHALL allow up to 5 images per Maintenance_Ticket
3. THE Platform SHALL display upload progress and preview of uploaded images
4. THE Platform SHALL validate file type and size before upload
5. THE Platform SHALL use a configurable file storage service (Firebase Storage as default, swappable via adapter pattern)

### Requirement 33: Mock API Layer

**User Story:** As a developer, I want a mock API layer that simulates backend responses, so that frontend development can proceed independently of the backend.

#### Acceptance Criteria

1. THE Platform SHALL include a mock API layer that implements all API_Client methods with realistic sample data
2. THE Mock API SHALL be toggleable via an environment variable (NEXT_PUBLIC_USE_MOCK_API)
3. THE Mock API SHALL simulate realistic response delays
4. THE Mock API SHALL include seed data for all property categories, user roles, bookings, and maintenance tickets
5. THE Mock API SHALL persist data in memory during a session (no database required)
6. THE Mock API SHALL be easily replaceable with real API calls when the backend is ready

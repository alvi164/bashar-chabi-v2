# Bashar Chabi (বাসার চাবি) — Phase 1 Architecture & Implementation Blueprint

## 1. Folder Structure

```
src/
  types/                    # Domain models & TypeScript enums
  localization/             # Bangla-first & English translation dictionaries & Context
  utils/                    # Taka currency, Dhaka date/timezone, validation state machines, analytics
  hooks/                    # usePWAInstall, useOnlineStatus
  components/
    common/                 # Handcrafted Logo, accessible Button, Input, Select, Card, Modal, PWA Install
    navigation/             # Top Bar (Contract), Mobile Bottom Bar, Footer
    properties/             # PropertyCard (Zero-Pill, unboxed metadata)
    services/               # ServiceCard (6 launch categories)
  layouts/
    RootLayout.tsx          # Responsive navigation shell with mobile bottom tab bar and offline banner
  pages/
    public/                 # Landing, Properties, Details, Services, Safety, About, Privacy, Terms, Auth
    dashboard/              # Role-based dashboard, Landlord 5-step property wizard, visits
    admin/                  # Moderation queues, immutable audit logs
  tests/
    unit/                   # Vitest unit test suites (currency, validation, transitions, role checks)
public/
  icon.svg                  # Original handcrafted House + Key emblem
  manifest.webmanifest      # Compliant Web App Manifest
  pwa-192x192.png           # 192px PNG
  pwa-512x512.png           # 512px standard & maskable PNG
  apple-touch-icon.png      # 180px PNG for iOS Safari
```

## 2. Route Structure

- **Public Routes:**
  - `/` — Mobile-first landing page with Dhaka quick-search and 6 service cards
  - `/properties` — Published property discovery with area/rent/bedroom filters
  - `/properties/:propertyId` — Property details with safety notice & visit request modal
  - `/services` — Household services showcase
  - `/services/request` — Service booking form with character count and area selection
  - `/safety` — Mandatory rental and payment safety guidance
  - `/about` — About Bashar Chabi & pilot scope
  - `/privacy` — MVP Privacy Policy (October 2026)
  - `/terms` — MVP Terms of Service (October 2026)
  - `/login` — Sign in shell (Google + Email) with Phase 1 role preview switcher
  - `/register` — Account registration with role allowlist (strictly no admin option)
  - `/forgot-password` — Password reset request shell
  - `/unauthorized` — 403 Access Denied
  - `/not-found` — 404 Route Not Found
- **Authenticated Dashboard Routes:**
  - `/onboarding` — First-login role & area confirmation
  - `/dashboard` — Role-specific dashboard with dynamic switcher
  - `/dashboard/profile` — User profile
  - `/dashboard/favourites` — Saved properties
  - `/dashboard/visits` — Tenant inspection requests
  - `/dashboard/listings` — Landlord property management
  - `/dashboard/listings/new` — 5-step property creation wizard
  - `/dashboard/listings/:propertyId/edit` — Property editing
  - `/dashboard/listing-visits` — Landlord incoming visit requests
  - `/dashboard/service-requests` — Customer service request status
  - `/dashboard/provider-profile` — Provider trades and coverage
  - `/dashboard/provider-jobs` — Provider assigned jobs
- **Administrator Routes:**
  - `/admin` — Moderation overview with real zero-state counts
  - `/admin/properties` — Property moderation queue (Approve/Reject/Suspend)
  - `/admin/providers` — Provider verification queue
  - `/admin/service-requests` — Manual provider assignment queue
  - `/admin/reports` — User-submitted reports queue
  - `/admin/audit-logs` — Immutable audit log viewer

## 3. Component List

- **Common Components:** `Logo` (SVG house-and-key symbol), `Button` (min 44px touch targets), `Input` (accessible labels and error IDs), `Select` (accessible dropdowns), `Card` (single-elevation, hairline border), `Modal` (accessible dialog with focus trap & Esc dismissal), `PWAInstallPrompt` (Chromium beforeinstallprompt + iOS Safari guidance), `OfflineBanner` (network connectivity listener).
- **Navigation Components:** `Navbar` (3-zone desktop contract + mobile drawer), `MobileBottomBar` (ergonomic thumb-zone 5-tab bar), `Footer` (clean typography, Dhaka coverage, quick links).
- **Domain Components:** `PropertyCard` (clean unboxed metadata, currency formatting, image fallback), `ServiceCard` (the 6 launch categories).

## 4. Domain Model List

- `User`: uid, displayName, photoURL, selectedRole (`tenant` | `landlord_or_agent` | `service_provider`), area, language, status, onboardingComplete, createdAt, updatedAt.
- `PrivateProfile`: uid, phone, contactPreference, consentVersion, consentedAt, createdAt, updatedAt.
- `Property`: id, landlordId, titleBn, titleEn, descriptionBn, descriptionEn, propertyType, monthlyRent, deposit, serviceCharge, area, neighbourhood, privateAddress, bedrooms, bathrooms, sizeSqFt, furnishing, tenantEligibility, utilities, availableFrom, imageUrls, status, rejectionReason, lastConfirmedAt, expiresAt, createdAt, updatedAt, publishedAt, rentedAt.
- `Favourite`: id, userId, propertyId, createdAt.
- `Visit`: id, propertyId, tenantId, landlordId, preferredDate, preferredTime, note, status, createdAt, updatedAt, confirmedAt, cancelledAt.
- `ServiceProvider`: id, userId, displayName, categories, serviceAreas, experienceSummary, workingHours, verificationStatus, status, createdAt, updatedAt.
- `ServiceRequest`: id, customerId, assignedProviderId, category, area, preferredDate, preferredTime, description, contactPreference, status, adminNote, cancellationReason, disputeReason, createdAt, updatedAt, assignedAt, completedAt.
- `Report`: id, reporterId, targetType, targetId, reason, description, status, createdAt, resolvedAt, resolvedBy.
- `AuditLog`: id, actorId, action, targetType, targetId, previousState, newState, reason, createdAt.

## 5. Design-System Tokens

- **Dominant Canvas (60%):** Warm off-white `#FAF9F5`, card surface `#FFFFFF`, subtle background `#F3F1EB`.
- **Primary Color (30%):** Deep botanical green `#0F4C3A` (hover `#0B3A2C`, tint `#E8F2EE`).
- **Accent Color (10%):** Restrained amber `#D97706` (hover `#B45309`, tint `#FEF3C7`).
- **Typography:** High-contrast text `#192420` (primary), `#4A5550` (secondary), `#738079` (muted); paired fonts `Hind Siliguri` (Bangla) + `Plus Jakarta Sans` (Latin).
- **Spatial & Radius:** `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-3xl` (24px); 44px minimum interactive touch hitbox.

## 6. Localization Strategy

- Default: Bangla (`bn`), with English switch (`en`).
- Dictionary-driven (`bn.ts` and `en.ts`).
- Missing English keys automatically fall back to Bangla via Javascript Proxy.
- `localStorage` key `basharchabi_lang` persists user choice.
- `document.documentElement.lang` synchronized immediately.
- Bangladeshi Taka formatted as `৳২৫,০০০` in Bangla and `৳25,000` in English.

## 7. PWA Strategy

- Manifest at `/manifest.webmanifest` and configured via `vite-plugin-pwa`.
- Standalone display mode with `#0F4C3A` theme color and `#FAF9F5` background color.
- Handcrafted SVG icon + 192x192 & 512x512 standard & maskable PNGs.
- `apple-touch-icon.png` (180x180) for iOS Safari compliance.
- In-app install button automatically suppresses when running in standalone mode and opens guided instructions for iOS Safari.
- Offline banner notifies user of cached status.

## 8. Testing Foundation

- Vitest runner (`npm run test`) with unit tests covering currency formatting, numeral conversion, role allowlists, HTTPS URL constraints, future date checks, and state transition validation for all entities.

## 9. Risks and Assumptions

- Assumed Dhaka neighborhoods as the primary operational geographic scope.
- Assumed manual admin verification for all pilot submissions to prevent fraud without automated third-party dependencies.
- No direct database writes or Firebase calls occur in Phase 1 as strictly instructed.

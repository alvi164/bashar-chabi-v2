# Bashar Chabi (বাসার চাবি)

> **“বাসার চাবি, এখন আপনার হাতে”**  
> *“Find your home. Take care of it.”*

**Technical Identifier:** `basharchabi`  
**Location:** Dhaka, Bangladesh  
**Release:** MVP Pilot (Phase 1 Foundation)

---

## 1. Product Overview

Bashar Chabi is a mobile-first, bilingual (Bangla-first with English switch) rental property and household-services marketplace engineered specifically for Dhaka, Bangladesh.

It connects:
1. **Tenants**: Discover published rental homes, filter by rent and area, and request physical property inspections.
2. **Landlords & Authorized Agents**: Draft properties, securely manage private addresses, and submit listings for administrator moderation.
3. **Customers**: Request vetted household services across 6 launch categories.
4. **Service Providers**: Manage work specifically assigned to them by administrators.
5. **Administrators**: Review pending listings, manage service assignments, inspect reports, and view immutable audit logs.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, `lucide-react`
- **Routing:** React Router DOM (v7)
- **PWA:** `vite-plugin-pwa`, Web App Manifest, Standalone mode, In-App Install prompt
- **Testing:** Vitest, Playwright (planned E2E)
- **Localization:** Custom dictionary-based Bangla/English context with localStorage persistence
- **Backend / Database (Phase 2):** Firebase Authentication, Cloud Firestore, Firebase Security Rules

---

## 3. Project Structure

```
basharchabi/
├── public/
│   ├── icon.svg                     # Handcrafted House + Key SVG emblem
│   ├── manifest.webmanifest         # PWA Manifest
│   ├── pwa-192x192.png              # Chromium standard icon
│   ├── pwa-512x512.png              # Android standard & maskable icon
│   └── apple-touch-icon.png         # iOS Safari touch icon
├── src/
│   ├── components/
│   │   ├── common/                  # Logo, Button, Input, Select, Card, Modal, PWA prompt
│   │   ├── navigation/              # Top Bar (Contract), Mobile Bottom Bar, Footer
│   │   ├── properties/              # PropertyCard (Zero-Pill discipline)
│   │   └── services/                # ServiceCard (6 launch categories)
│   ├── hooks/
│   │   ├── usePWAInstall.ts         # In-app PWA install trigger & iOS guide
│   │   └── useOnlineStatus.ts       # Connectivity detector
│   ├── layouts/
│   │   └── RootLayout.tsx           # Global responsive shell
│   ├── localization/
│   │   ├── types.ts                 # Dictionary interface
│   │   ├── bn.ts                    # Bangla dictionary (Primary)
│   │   ├── en.ts                    # English dictionary
│   │   └── LanguageContext.tsx      # Language provider & switcher
│   ├── pages/
│   │   ├── public/                  # Landing, Properties, Details, Services, Safety, Legal, Auth
│   │   ├── dashboard/               # Role-based dashboard, Landlord property stepper, visits
│   │   └── admin/                   # Moderation queues, audit logs
│   ├── tests/
│   │   └── unit/                    # Vitest unit test suites
│   ├── types/
│   │   └── index.ts                 # Complete domain interfaces & allowed enums
│   └── utils/
│       ├── currency.ts              # Bangladeshi Taka (৳) formatter
│       ├── date.ts                  # Asia/Dhaka timezone formatting
│       ├── validation.ts            # Runtime validation & state machine transitions
│       └── analytics.ts             # Privacy-conscious analytics abstraction
├── index.html                       # HTML entry point with metadata & Bangla fonts
├── metadata.json                    # AI Studio metadata
├── package.json
└── tsconfig.json
```

---

## 4. Local Development Setup

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/basharchabi.git
cd basharchabi

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### Running Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 5. Development Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at port 3000 |
| `npm run build` | Builds production-optimized bundle in `dist/` |
| `npm run typecheck` | Type-checks codebase with TypeScript |
| `npm run test` | Runs unit tests using Vitest |
| `npm run preview` | Previews production build locally |

---

## 6. Testing Foundation

Run the test suite with:
```bash
npm run test
```

Phase 1 unit tests verify:
1. **Bangladeshi Taka Currency:** Formats `৳২৫,০০০` in Bangla and `৳25,000` in English, with valid numeral conversion.
2. **Form Validation:** Validates required Bengali titles, positive rents, reasonable bed/bath limits, and maximum text lengths.
3. **Role Allowlists:** Prohibits normal users from selecting `admin` roles.
4. **State Machine Transitions:** Enforces valid lifecycle transitions for service requests, visits, and property moderation.
5. **HTTPS URLs:** Guarantees that only encrypted `https://` URLs are accepted.
6. **Timezone & Dates:** Validates future dates using `Asia/Dhaka` time.

---

## 7. Administrator Bootstrap Procedure (Server-Side)

> ⚠️ **CRITICAL SECURITY REQUIREMENT:**  
> Administrator authority is NEVER granted through client-side forms or database edits by browser users.

In Phase 2, admin privileges will be assigned exclusively via a server-side CLI script using Firebase Admin SDK:

```bash
# Example server-side claim assignment:
node server/admin/setAdminClaim.js --uid="<TARGET_FIREBASE_UID>"
```

The script sets `{ admin: true }` custom claims on the user record. Security rules and backend routes check `request.auth.token.admin == true`.

---

## 8. Known MVP Pilot Limitations

- **No Online Payment Processing:** Rent, security deposits, and provider payouts are strictly settled directly between parties.
- **Manual Moderation:** All property listings and service requests undergo human review before activation.
- **Dhaka-Only Geographic Focus:** Pilot operations are confined to residential zones within Dhaka.
- **Image URL Storage:** Properties support up to 8 verified HTTPS URLs; direct image binary upload (Firebase Storage / Cloudinary) will be integrated in subsequent phases.

---

## 9. Phase Roadmap

- [x] **Phase 1 — Foundation:** Project architecture, design tokens, responsive bilingual UI, reusable components, routing, domain models, PWA manifest, unit test suite.
- [ ] **Phase 2 — Firebase & Authentication:** Firebase Auth, Firestore converters, deny-by-default Security Rules, and Emulator tests.
- [ ] **Phase 3 — Property Supply:** Listing drafts, moderation workflow, rejection reasons, audit logging.
- [ ] **Phase 4 — Property Discovery:** Firestore search queries, indexes, pagination, and favorites.
- [ ] **Phase 5 — Visits & Household Services:** Inspection booking, customer requests, manual assignment.
- [ ] **Phase 6 — Security, Accessibility & QA:** Full emulator security tests, E2E tests, WCAG AA compliance.
- [ ] **Phase 7 — Staging & Deployment:** Production readiness checklist and deployment.

# NGEN Database Usage Map

> **Generated on:** 2026-01-02  
> **Purpose:** Map where each database entity is used throughout the website

---

## 📍 Quick Reference

| Model | Total Usage Locations | Primary Areas |
|-------|----------------------|---------------|
| User | 22 | Auth, Admin, API, Profile |
| Belt | 8 | Pricing, Curriculum, Purchase, Orders |
| Track | 3 | Curriculum, Seed |
| Order | 7 | Admin, Webhooks, Payments |
| PlacementTest | 9 | Placement API, Admin Dashboard |
| PricingConfig | 4 | Pricing Service, Admin |
| Transaction | 2 | Admin Operations, Webhooks |
| PasswordResetToken | - | Password Actions (inline) |
| VerificationToken | - | Verify Email (inline) |

---

## 1. 👤 **USER** Model Usage

### Authentication & Authorization
| File | Purpose |
|------|---------|
| `lib/auth/authOptions.ts` | NextAuth configuration, credential validation, session management |
| `app/api/auth/register/route.ts` | New user registration with profile creation |
| `app/api/auth/verify-email/route.ts` | Email verification status update |
| `app/api/auth/resend-verification/route.ts` | Re-send verification email |
| `app/api/auth/forgot-password/route.ts` | Password reset initiation |
| `app/api/auth/reset-password/route.ts` | Password update |

### User Profile
| File | Purpose |
|------|---------|
| `app/api/user/profile/route.ts` | Get user profile with placement test info |
| `app/api/user/profile/update/route.ts` | Update user profile fields |

### Admin Dashboard
| File | Purpose |
|------|---------|
| `components/admin/DashboardStats.tsx` | User count statistics |
| `components/admin/RecentActivity.tsx` | Recent user registrations |
| `lib/actions/admin/userActions.ts` | Server actions for user management (list, search, update) |

### Placement Test Flow
| File | Purpose |
|------|---------|
| `app/api/placement-test/check-user/route.ts` | Check user's test eligibility |
| `app/api/placement-test/start/route.ts` | Record test start, update user attempts |
| `app/api/placement-test/submit/route.ts` | Update user's placement test summary |
| `app/api/placement-test/my-results/route.ts` | Get user's test history |
| `app/api/placement-test/results/[testId]/route.ts` | Get specific test result |
| `app/api/admin/grant-attempt/route.ts` | Admin grants extra placement test attempts |

### Other
| File | Purpose |
|------|---------|
| `lib/services/pricingService.ts` | Fetch user's placement test for personalized pricing |
| `lib/actions/passwordActions.ts` | Password reset utilities |
| `scripts/seed-test-users.ts` | Create test user accounts |

---

## 2. 🥋 **BELT** Model Usage

### Pricing & Purchase
| File | Purpose |
|------|---------|
| `lib/services/pricingService.ts` | Calculate belt prices, apply discounts, build pricing structure |
| `app/[locale]/(marketing)/tracks/[slug]/purchase/page.tsx` | Track purchase page - display available belts |
| `app/api/orders/create/route.ts` | Create order for belt purchase |

### Admin Dashboard
| File | Purpose |
|------|---------|
| `lib/actions/admin/curriculumActions.ts` | CRUD operations for belts in admin |
| `lib/actions/admin/pricingActions.ts` | Update belt pricing |

### Database Seeding
| File | Purpose |
|------|---------|
| `scripts/seed.ts` | Seed initial belt data for all tracks |

---

## 3. 📚 **TRACK** Model Usage

### Admin Dashboard
| File | Purpose |
|------|---------|
| `lib/actions/admin/curriculumActions.ts` | CRUD operations for tracks |

### Database Seeding
| File | Purpose |
|------|---------|
| `scripts/seed.ts` | Seed initial track data |

### Documentation
| File | Purpose |
|------|---------|
| `docs/ADMIN_DASHBOARD_IMPLEMENTATION_PLAN.md` | Referenced in admin implementation docs |

---

## 4. 🛒 **ORDER** Model Usage

### Payment Flow
| File | Purpose |
|------|---------|
| `app/api/orders/create/route.ts` | Create new order, integrate with Paymob |
| `app/api/webhooks/paymob/route.ts` | Handle Paymob webhook, update order status |
| `app/api/payment/success/route.ts` | Success page, verify order status |

### Admin Dashboard
| File | Purpose |
|------|---------|
| `components/admin/DashboardStats.tsx` | Order count, revenue statistics |
| `components/admin/RecentActivity.tsx` | Recent orders feed |
| `lib/actions/admin/operationsActions.ts` | Order management (list, filter, details) |

---

## 5. 📝 **PLACEMENT TEST** Model Usage

### Placement Test API
| File | Purpose |
|------|---------|
| `app/api/placement-test/start/route.ts` | Create new test record |
| `app/api/placement-test/submit/route.ts` | Save answers, calculate score |
| `app/api/placement-test/my-results/route.ts` | List user's test attempts |
| `app/api/placement-test/results/[testId]/route.ts` | Get detailed test result |
| `app/api/user/profile/route.ts` | Include latest test result in profile |

### Admin Dashboard
| File | Purpose |
|------|---------|
| `components/admin/DashboardStats.tsx` | Test completion statistics |
| `components/admin/RecentActivity.tsx` | Recent test completions |
| `lib/actions/admin/operationsActions.ts` | Test management in admin |

---

## 6. 💰 **PRICING CONFIG** Model Usage

### Pricing System
| File | Purpose |
|------|---------|
| `lib/services/pricingService.ts` | Core pricing logic - apply package discounts, calculate totals |

### Admin Dashboard
| File | Purpose |
|------|---------|
| `lib/actions/admin/pricingActions.ts` | CRUD for pricing configurations |

### Database Seeding
| File | Purpose |
|------|---------|
| `scripts/seed.ts` | Seed initial pricing configs |

---

## 7. 💳 **TRANSACTION** Model Usage

### Payment Processing
| File | Purpose |
|------|---------|
| `app/api/webhooks/paymob/route.ts` | Record transaction from Paymob webhook |

### Admin Dashboard
| File | Purpose |
|------|---------|
| `lib/actions/admin/operationsActions.ts` | Transaction history, reports |

---

## 8. 🔑 **PASSWORD RESET TOKEN** Model Usage

### Password Reset Flow
| File | Purpose |
|------|---------|
| `app/api/auth/forgot-password/route.ts` | Create token upon request |
| `app/api/auth/reset-password/route.ts` | Validate and consume token |
| `lib/actions/passwordActions.ts` | Token generation utilities |

---

## 9. ✉️ **VERIFICATION TOKEN** Model Usage

### Email Verification Flow
| File | Purpose |
|------|---------|
| `app/api/auth/register/route.ts` | Create token after registration |
| `app/api/auth/verify-email/route.ts` | Validate and consume token |
| `app/api/auth/resend-verification/route.ts` | Create new token |

---

## 🗂️ Directory Structure with Database Usage

```
app/
├── api/
│   ├── auth/
│   │   ├── register/route.ts         → User, VerificationToken
│   │   ├── verify-email/route.ts     → User, VerificationToken
│   │   ├── resend-verification/route.ts → User, VerificationToken
│   │   ├── forgot-password/route.ts  → User, PasswordResetToken
│   │   └── reset-password/route.ts   → User, PasswordResetToken
│   ├── user/
│   │   └── profile/
│   │       ├── route.ts              → User, PlacementTest
│   │       └── update/route.ts       → User
│   ├── placement-test/
│   │   ├── check-user/route.ts       → User
│   │   ├── start/route.ts            → User, PlacementTest
│   │   ├── submit/route.ts           → User, PlacementTest
│   │   ├── my-results/route.ts       → User, PlacementTest
│   │   └── results/[testId]/route.ts → User, PlacementTest
│   ├── orders/
│   │   └── create/route.ts           → Order, Belt
│   ├── payment/
│   │   └── success/route.ts          → Order
│   ├── admin/
│   │   └── grant-attempt/route.ts    → User
│   └── webhooks/
│       └── paymob/route.ts           → Order, Transaction
│
├── [locale]/
│   ├── (marketing)/
│   │   └── tracks/
│   │       └── [slug]/
│   │           └── purchase/page.tsx → Belt
│   └── admin/
│       └── (pages use components below)

components/
├── admin/
│   ├── DashboardStats.tsx            → User, Order, PlacementTest
│   └── RecentActivity.tsx            → User, Order, PlacementTest

lib/
├── auth/
│   └── authOptions.ts                → User
├── services/
│   └── pricingService.ts             → Belt, PricingConfig, User
├── actions/
│   ├── passwordActions.ts            → User, PasswordResetToken
│   └── admin/
│       ├── userActions.ts            → User
│       ├── curriculumActions.ts      → Track, Belt
│       ├── pricingActions.ts         → Belt, PricingConfig
│       └── operationsActions.ts      → Order, Transaction, PlacementTest
└── models/
    ├── User.ts
    ├── Track.ts
    ├── Belt.ts
    ├── Order.ts
    ├── Transaction.ts
    ├── PlacementTest.ts
    ├── PricingConfig.ts
    ├── PasswordResetToken.ts
    └── VerificationToken.ts

scripts/
├── seed.ts                           → Track, Belt, PricingConfig
└── seed-test-users.ts                → User
```

---

## 🔄 Data Flow Diagrams

### User Registration Flow
```
┌─────────────┐     ┌──────────────┐     ┌────────────────────┐
│  /register  │ ──▶ │ api/auth/    │ ──▶ │ User.create()      │
│   (form)    │     │ register     │     │ VerificationToken  │
└─────────────┘     └──────────────┘     └────────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Send Email   │
                    │ (Resend)     │
                    └──────────────┘
```

### Placement Test Flow
```
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│  Check User │ ──▶ │ check-user/route │ ──▶ │ User.findOne()     │
└─────────────┘     └──────────────────┘     └────────────────────┘
       │
       ▼
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│ Start Test  │ ──▶ │ start/route      │ ──▶ │ PlacementTest.     │
│             │     │                  │     │ create()           │
└─────────────┘     └──────────────────┘     └────────────────────┘
       │
       ▼
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│ Submit      │ ──▶ │ submit/route     │ ──▶ │ PlacementTest.     │
│ Answers     │     │                  │     │ findByIdAndUpdate  │
└─────────────┘     └──────────────────┘     │ User.updateOne     │
                                             └────────────────────┘
```

### Purchase Flow
```
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│  Pricing    │ ──▶ │ pricingService   │ ──▶ │ Belt.find()        │
│  Section    │     │                  │     │ PricingConfig.find │
└─────────────┘     └──────────────────┘     │ User (optional)    │
       │                                      └────────────────────┘
       ▼
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│ Buy Now     │ ──▶ │ orders/create    │ ──▶ │ Order.create()     │
└─────────────┘     └──────────────────┘     │ Paymob API         │
       │                                      └────────────────────┘
       ▼
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│  Paymob     │ ──▶ │ webhooks/paymob  │ ──▶ │ Order.findOne()    │
│  Redirect   │     │                  │     │ Order.updateOne()  │
└─────────────┘     └──────────────────┘     │ Transaction.create │
                                             └────────────────────┘
```

---

## 🔍 Search Queries by Model

### Find All User Usages
```bash
grep -r "import User from" --include="*.ts" --include="*.tsx"
```

### Find All Belt Usages
```bash
grep -r "import Belt from" --include="*.ts" --include="*.tsx"
```

### Find All Order Usages
```bash
grep -r "import Order from" --include="*.ts" --include="*.tsx"
```

---

## 📊 Component-to-Database Mapping for Admin Dashboard

| Admin Page | Components | Models Used |
|------------|------------|-------------|
| `/admin` (Dashboard) | `DashboardStats`, `RecentActivity` | User, Order, PlacementTest |
| `/admin/users` | `UsersTable` | User |
| `/admin/orders` | `OrdersTable` | Order, Transaction |
| `/admin/curriculum` | `CurriculumList`, `TrackCard` | Track, Belt |
| `/admin/pricing` | `PackageConfigTable` | PricingConfig, Belt |

---

## ⚙️ Server Actions Mapping

| Action File | Exported Functions | Models |
|-------------|-------------------|--------|
| `userActions.ts` | `getUsers`, `getUserById`, `updateUser`, `deleteUser` | User |
| `curriculumActions.ts` | `getTracks`, `getBelts`, `createTrack`, `updateBelt` | Track, Belt |
| `pricingActions.ts` | `getPricingConfigs`, `updatePricingConfig`, `updateBeltPrices` | PricingConfig, Belt |
| `operationsActions.ts` | `getOrders`, `getTransactions`, `getPlacementTests` | Order, Transaction, PlacementTest |
| `passwordActions.ts` | `createPasswordResetToken`, `resetPassword` | User, PasswordResetToken |

---

## 🎯 Key Insights

1. **User** is the most widely used model (22+ locations) - central to auth, profile, admin, and placement tests

2. **Belt** is the core content unit - ties together tracks, pricing, and purchases

3. **Pricing logic is centralized** in `lib/services/pricingService.ts` - single source of truth

4. **Payment flow** spans: `Order` (created) → Paymob (external) → `Transaction` (recorded)

5. **Admin dashboard** heavily uses all models through the `lib/actions/admin/` server actions

6. **Placement tests** update both `PlacementTest` collection AND `User.placementTest` subdocument

7. **Token models** (PasswordReset, Verification) use TTL indexes for automatic cleanup

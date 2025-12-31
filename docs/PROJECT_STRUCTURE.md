# NGen Platform - Project Structure Guide

This document provides a detailed overview of the project's directory structure and organization principles. We follow a feature-first and page-centric architecture to ensure scalability and maintainability.

## 📁 Directory Overview

```
.
├── app/                  # Next.js App Router (Routes & API)
├── components/           # React Components
│   ├── features/         # Feature-specific components (Auth, etc.)
│   ├── general/          # Shared reusable components (Buttons, Cards)
│   ├── layout/           # Layout components (Header, Footer)
│   ├── pages/            # Page-specific components (Home, Dashboard)
│   ├── payment/          # Payment-specific components
│   ├── providers/        # Context Providers
│   └── ui/               # Core UI Primitives (shadcn/ui)
├── hooks/                # Custom React Hooks
├── lib/                  # Utilities, Models, & Services
│   ├── models/           # Mongoose Database Models
│   ├── services/         # Business Logic Services
│   └── ...               # Helper functions
├── messages/             # Localization Files (JSON)
├── public/               # Static Assets (Images, Icons)
├── scripts/              # Maintenance & Setup Scripts
└── types/                # TypeScript Type Definitions
```

## 🧩 Components Organization

We organize components based on their scope and reusability:

### `components/pages/`
Components that are **specific to a single page** are grouped here.
*   **Example:** `components/pages/Home/HeroSection.tsx`, `components/pages/PlacementTest/QuestionCard.tsx`
*   **Rule:** If a component is used on multiple pages, move it to `general` or `features`.

### `components/features/`
Components that belong to a **specific feature set** (often involving logic/state).
*   **Example:** `components/features/auth/LoginForm.tsx`, `components/features/auth/SignupForm.tsx`
*   **Usage:** Encapsulates complex logic related to a specific domain (e.g., Auth, Profile).

### `components/general/`
**Reusable, atomic/molecular components** used across the application.
*   **Example:** `Button`, `Heading`, `CallToAction`, `Cards`
*   **Rule:** These should generally be "dumb" value-presentation components.

### `components/ui/`
**Low-level UI primitives**, often from libraries like shadcn/ui.
*   **Example:** `input.tsx`, `dialog.tsx`, `select.tsx`

---

## 🛠 Lib & Utilities (`lib/`)

The `lib` folder contains the core logic and backend infrastructure.

*   `models/`: **Mongoose Schemas** for MongoDB (e.g., `User.ts`, `Order.ts`).
*   `services/`: **Business Logic Layer**. Separates API route handlers from core logic (e.g., `PricingService.ts`).
*   `actions/`: Server Actions (if applicable).
*   `paymob.ts`: Paymob payment gateway integration helpers.
*   `mongodb.ts`: Database connection utility.
*   `geoLocation.ts`: Geo-location utilities.

---

## 🪝 Hooks (`hooks/`)

Custom React hooks for reusing stateful logic.
*   `useRTL.ts`: Detects text direction (RTL/LTR).
*   `useUserLocation.ts`: Detects user's country code.
*   `useLocalization.ts`: Helper for efficient client-side translation.

---

## 🌍 Localization (`messages/`)

We use `next-intl` for internationalization.
*   `en.json`: English translations.
*   `ar.json`: Arabic translations.
*   **Note:** Keep keys consistent between files.

## 📜 Scripts (`scripts/`)

Standalone scripts for maintenance.
*   `seed.ts`: Seeds the database with initial data (Tracks, Belts).
*   `migrate-to-bilingual.ts`: Migration script for database schema updates.

---

## 🚀 Best Practices

1.  **Strict Typing:** Use TypeScript interfaces for all props and data models.
2.  **Server vs Client:** Use `'use client'` directive only when necessary (interactivity, hooks). Prefer Server Components for fetching data.
3.  **Localization:** Never hardcode text. Always use `t('key')` or `LocalizedString` objects.
4.  **Clean Imports:** Use aliases (e.g., `@/components/...`) instead of relative paths (`../../../`).

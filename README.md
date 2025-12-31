# NGen Learning Platform (LMS)

![NGen Logo](/public/assets/images/logo.png)

A comprehensive Learning Management System (LMS) built for the next generation of learners, featuring bilingual support (English/Arabic), gamified progression (Belts/Tracks), and integrated payments.

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

*   [**📁 Project Structure**](docs/PROJECT_STRUCTURE.md): Overview of folders, components, and code organization.
*   [**💳 Payment Integration**](docs/PAYMENT.md): Guide to Paymob integration, flows, and webhooks.
*   [**🌍 Localization (i18n)**](docs/LOCALIZATION.md): How we handle bilingual content and RTL support.

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   MongoDB Instance
*   Paymob Account (for payments)

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Copy `.env.local.example` (if available) or create `.env.local` with the following:

```bash
# Database
MONGODB_URI=mongodb+srv://...

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# Payments (Paymob)
PAYMOB_API_KEY=...
PAYMOB_INTEGRATION_ID_CARD=...
PAYMOB_INTEGRATION_ID_WALLET=...
PAYMOB_IFRAME_ID=...
PAYMOB_HMAC_SECRET=...

# Email (Resend)
RESEND_API_KEY=...
```

### 3. Run Development Server
```bash
npm run dev
```
Access the app at `http://localhost:3000`.

## 🏗 Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Database**: MongoDB (Mongoose)
*   **Styling**: Tailwind CSS + Shadcn/ui
*   **Auth**: NextAuth.js
*   **i18n**: next-intl
*   **Payments**: Paymob

## 🧪 Key Features

### 🥋 Gamified Tracks & Belts
Students progress through "Tracks" (e.g., Robotics, AI), earning "Belts" (Yellow, Orange, Green, etc.).
*   Data is seeded via `scripts/seed.ts`.
*   Pricing varies per belt and package.

### 📝 Placement Test
New users take a placement test to determine their starting level.
*   Engine: Custom logic in `api/placement-test`.
*   Result: Recommends a specific Belt/Track.

### 💰 Payment & Checkout
(See [Payment Docs](docs/PAYMENT.md))
*   Supports Cards & Wallets.
*   Multi-currency (EGP for Egypt, USD for others).
*   Localized checkout experience.

---
**Maintained by NGen Team**

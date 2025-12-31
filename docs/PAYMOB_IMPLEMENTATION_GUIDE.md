# Paymob Payment Integration - Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [File-by-File Documentation](#file-by-file-documentation)
4. [Database Models](#database-models)
5. [API Endpoints](#api-endpoints)
6. [UI Components](#ui-components)
7. [Email System](#email-system)

---

## Overview

This integration adds a complete payment system to NGen Schools using **Paymob** as the payment gateway. Paymob is a popular payment processor in Egypt and the MENA region that supports:
- Credit/Debit cards (Visa, Mastercard, Meeza)
- Mobile wallets (Vodafone Cash, Orange Money, Etisalat Cash, etc.)

The integration is built with:
- **MongoDB/Mongoose** for data persistence (matching your existing stack)
- **Next.js App Router** for API routes and pages
- **Resend** for transactional emails
- **Zod** for request validation
- **TypeScript** for type safety

---

## Folder Structure

```
ngen/
├── lib/
│   ├── paymob.ts                    # 🔧 Core Paymob API wrapper
│   ├── models/
│   │   ├── Order.ts                 # 📦 Order database model
│   │   └── Transaction.ts           # 💳 Transaction database model
│   └── email/
│       ├── config.ts                # ⚙️ Email configuration
│       ├── send.ts                  # 📤 Email sending functions
│       └── templates/
│           ├── index.ts             # 📋 Template exports
│           ├── order-confirmation.ts # ✉️ Order confirmation email
│           ├── payment-success.ts   # ✅ Payment success email
│           ├── payment-failed.ts    # ❌ Payment failed email
│           └── admin-notification.ts # 👤 Admin notification email
│
├── app/
│   ├── api/
│   │   ├── orders/
│   │   │   └── create/
│   │   │       └── route.ts         # 🛒 Create order API
│   │   ├── webhooks/
│   │   │   └── paymob/
│   │   │       └── route.ts         # 🔔 Webhook handler
│   │   └── payment/
│   │       └── success/
│   │           └── route.ts         # 🔄 Redirect handler
│   │
│   └── [locale]/(marketing)/
│       ├── tracks/[slug]/
│       │   └── purchase/
│       │       └── page.tsx         # 🛍️ Purchase page
│       └── payment/
│           ├── success/
│           │   └── page.tsx         # ✅ Success page
│           └── error/
│               └── page.tsx         # ❌ Error page
│
├── components/
│   └── payment/
│       └── TrackPurchaseForm.tsx    # 📝 Purchase form component
│
├── types/
│   └── payment.ts                   # 📐 TypeScript types
│
└── docs/
    ├── PAYMOB_ENV_SETUP.md          # 🔑 Environment variables
    ├── PAYMOB_INTEGRATION.md        # 📖 Integration overview
    ├── PAYMOB_IMPLEMENTATION_GUIDE.md # 📘 This file
    └── PAYMOB_WORKFLOW.md           # 🔄 Workflow documentation
```

---

## File-by-File Documentation

### 📁 `lib/paymob.ts` - Core Paymob API Wrapper

**Purpose:** This is the heart of the Paymob integration. It provides typed functions to interact with Paymob's Accept API.

**What it does:**
- Authenticates with Paymob to get temporary tokens
- Creates orders in Paymob's system
- Generates payment keys for the iframe
- Builds iframe URLs for the payment page
- Verifies webhook HMAC signatures for security
- Maps Paymob's status codes to our application status

**Key Functions:**

| Function | Description |
|----------|-------------|
| `authenticate()` | Gets an auth token from Paymob (valid ~1 hour) |
| `createPaymobOrder()` | Creates an order in Paymob |
| `createPaymentKey()` | Generates a payment key for the iframe |
| `buildIframeUrl()` | Constructs the full iframe URL |
| `verifyWebhookHmac()` | Validates webhook signatures |
| `mapPaymobStatus()` | Converts Paymob status to our status |
| `initiatePayment()` | Combines all steps for convenience |

**Why it exists:** Paymob's API requires a specific flow (auth → order → payment key → iframe). This file abstracts all that complexity into simple, reusable functions.

---

### 📁 `lib/models/Order.ts` - Order Database Model

**Purpose:** Stores all order information in MongoDB.

**Schema Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Reference to User (optional, for guests) |
| `trackId` | ObjectId | Reference to Track |
| `beltId` | ObjectId | Reference to Belt being purchased |
| `amount` | Number | Price in the selected currency |
| `currency` | String | 'EGP' or 'USD' |
| `status` | String | 'pending', 'paid', 'failed', 'refunded' |
| `paymobOrderId` | String | Paymob's order ID (unique) |
| `transactionId` | String | Paymob's transaction ID |
| `paymentMethod` | String | 'card' or 'wallet' |
| `customerName` | String | Customer's full name |
| `customerEmail` | String | Customer's email |
| `customerPhone` | String | Customer's phone |
| `metadata` | Object | Extra data (belt name, etc.) |

**Indexes:**
- `customerEmail` - Fast lookup by email
- `status` - Filter by order status
- `createdAt` - Sort by date
- `paymobOrderId` - Quick lookup for webhook processing

---

### 📁 `lib/models/Transaction.ts` - Transaction Database Model

**Purpose:** Stores every payment attempt from Paymob webhooks. One order can have multiple transactions (retries, refunds).

**Schema Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | ObjectId | Reference to Order |
| `paymobTxnId` | String | Paymob's transaction ID (unique) |
| `amount` | Number | Transaction amount |
| `currency` | String | Currency code |
| `success` | Boolean | Was it successful? |
| `pending` | Boolean | Is it still processing? |
| `responseData` | Object | Full Paymob response (for debugging) |
| `errorMessage` | String | Error message if failed |

**Why store full response:** The `responseData` field stores Paymob's complete webhook payload. This is crucial for debugging payment issues and understanding exactly what happened.

---

### 📁 `lib/email/config.ts` - Email Configuration

**Purpose:** Centralized email settings matching NGen Schools branding.

**What it provides:**
- Email addresses (from, admin)
- Brand colors (orange gradient, success green, error red)
- Reusable CSS styles for email templates

**Why it exists:** Email templates need consistent branding. Instead of hardcoding colors in every template, they all reference this config.

---

### 📁 `lib/email/send.ts` - Email Sending Functions

**Purpose:** Handles the actual sending of emails via Resend.

**Functions:**

| Function | Description |
|----------|-------------|
| `sendPaymentEmail()` | Sends email to any recipient |
| `sendAdminEmail()` | Sends email to admin |
| `sendPaymentEmails()` | Sends multiple emails in parallel |

**Graceful degradation:** If Resend isn't configured, it logs a warning instead of crashing. This allows development without email setup.

---

### 📁 `lib/email/templates/*` - Email Templates

**Four email templates:**

1. **`order-confirmation.ts`** - Sent immediately when order is created
   - Shows order details (ID, product, amount)
   - "Your order is being processed" message

2. **`payment-success.ts`** - Sent when payment succeeds
   - Green success header with checkmark
   - Transaction receipt details
   - "Start Learning Now" button

3. **`payment-failed.ts`** - Sent when payment fails
   - Red error header
   - Error message from Paymob
   - Troubleshooting tips
   - "Try Again" button

4. **`admin-notification.ts`** - Sent to admin for all events
   - Color-coded headers (orange/green/red)
   - Full customer and order details
   - Quick action button

---

### 📁 `app/api/orders/create/route.ts` - Create Order API

**Endpoint:** `POST /api/orders/create`

**Purpose:** Creates an order and initiates the Paymob payment flow.

**Request Body:**
```json
{
  "beltId": "mongodb-object-id",
  "customerName": "Ahmed Hassan",
  "customerEmail": "ahmed@example.com",
  "customerPhone": "+201234567890",
  "paymentMethod": "card",
  "currency": "EGP"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "local-order-id",
  "paymobOrderId": 12345678,
  "iframeUrl": "https://accept.paymob.com/api/acceptance/iframes/xxx?payment_token=xxx",
  "amount": 500,
  "currency": "EGP"
}
```

**What it does:**
1. Validates input with Zod
2. Fetches belt from database
3. Creates pending order in MongoDB
4. Calls Paymob (auth → order → payment key)
5. Sends confirmation email
6. Returns iframe URL

---

### 📁 `app/api/webhooks/paymob/route.ts` - Webhook Handler

**Endpoint:** `POST /api/webhooks/paymob`

**Purpose:** Receives and processes payment notifications from Paymob.

**What it does:**
1. Parses webhook payload
2. Verifies HMAC signature (security)
3. Finds the order by Paymob order ID
4. Creates transaction record
5. Updates order status (with idempotency)
6. Sends appropriate emails
7. Returns 200 OK to Paymob

**Idempotency:** The handler never downgrades status from 'paid'. If Paymob sends duplicate webhooks, they're handled safely.

---

### 📁 `app/api/payment/success/route.ts` - Redirect Handler

**Endpoint:** `GET /api/payment/success`

**Purpose:** Handles the redirect after user completes payment on Paymob iframe.

**Paymob sends query params like:**
```
?id=12345&success=true&pending=false&order=67890
```

**What it does:**
1. Extracts Paymob query parameters
2. Looks up the order
3. Redirects to:
   - `/payment/success` if success=true
   - `/payment/error` if success=false

**Why separate from webhook:** The redirect happens in the user's browser, while the webhook is server-to-server. They can arrive in any order.

---

### 📁 `app/[locale]/(marketing)/tracks/[slug]/purchase/page.tsx` - Purchase Page

**URL:** `/en/tracks/programming/purchase?beltId=xxx`

**Purpose:** Server component that displays the purchase form.

**What it does:**
1. Fetches belt data from database
2. Gets price based on currency
3. Renders the TrackPurchaseForm component
4. Provides proper SEO metadata

---

### 📁 `app/[locale]/(marketing)/payment/success/page.tsx` - Success Page

**URL:** `/en/payment/success?orderId=xxx`

**Purpose:** Shows success message after payment.

**Features:**
- Confetti animation on load
- Green success icon
- Order and transaction ID display
- "Start Learning" button
- Handles pending status differently

---

### 📁 `app/[locale]/(marketing)/payment/error/page.tsx` - Error Page

**URL:** `/en/payment/error?reason=payment_failed`

**Purpose:** Shows error message when payment fails.

**Features:**
- Red error icon with shake animation
- Error-specific messages
- Troubleshooting tips
- "Try Again" button
- Support contact link

---

### 📁 `components/payment/TrackPurchaseForm.tsx` - Purchase Form

**Purpose:** Client component form for collecting payment details.

**Features:**
- Name, email, phone inputs
- Payment method selection (card/wallet)
- Client-side validation
- Loading states with spinner
- Error display
- "Pay X EGP" button
- "Secured by Paymob" badge

**What happens on submit:**
1. Validates all fields
2. Calls `/api/orders/create`
3. Receives iframe URL
4. Redirects to Paymob iframe via `window.location.href`

---

### 📁 `types/payment.ts` - TypeScript Types

**Purpose:** Centralized TypeScript interfaces for payment-related data.

**Types defined:**
- `OrderData` - Order object shape
- `TransactionData` - Transaction object shape
- `PaymentInitiationResult` - API response shape
- `CreateOrderRequest` - API request shape
- `WebhookResult` - Webhook response shape

---

## Database Models

### Order Lifecycle

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   PENDING   │ ──► │    PAID     │  or │   FAILED    │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                    │
      │                   ▼                    │
      │            ┌─────────────┐             │
      └──────────► │  REFUNDED   │ ◄───────────┘
                   └─────────────┘
```

### Relationships

```
User (optional)
  │
  └──► Order
        │
        ├──► Belt
        │
        ├──► Track
        │
        └──► Transaction[] (one-to-many)
```

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/orders/create` | Create order, get iframe URL |
| POST | `/api/webhooks/paymob` | Receive payment notifications |
| GET | `/api/payment/success` | Handle post-payment redirect |

---

## UI Components Summary

| Component | Purpose | Location |
|-----------|---------|----------|
| `TrackPurchaseForm` | Collects customer info | `/components/payment/` |
| Purchase Page | Shows form for a belt | `/app/.../tracks/.../purchase/` |
| Success Page | Celebrates successful payment | `/app/.../payment/success/` |
| Error Page | Shows failure info | `/app/.../payment/error/` |

---

## Email System Summary

| Email | Trigger | Recipient |
|-------|---------|-----------|
| Order Confirmation | Order created | Customer |
| Payment Success | Webhook (success) | Customer |
| Payment Failed | Webhook (failed) | Customer |
| Admin: New Order | Order created | Admin |
| Admin: Success | Webhook (success) | Admin |
| Admin: Failed | Webhook (failed) | Admin |

---

*This documentation covers the implementation details of each file and its purpose in the Paymob payment integration.*

# Paymob Payment Integration - Workflow Documentation

## Table of Contents
1. [Complete Payment Flow](#complete-payment-flow)
2. [Step-by-Step Sequence](#step-by-step-sequence)
3. [File Communication Diagram](#file-communication-diagram)
4. [Data Flow](#data-flow)
5. [Error Handling Flow](#error-handling-flow)
6. [Webhook Processing Flow](#webhook-processing-flow)

---

## Complete Payment Flow

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           USER'S BROWSER                                      │
│                                                                               │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────┐   │
│   │  Pricing    │ ──► │  Purchase   │ ──► │   Paymob    │ ──► │ Success/ │   │
│   │   Page      │     │    Form     │     │   Iframe    │     │  Error   │   │
│   └─────────────┘     └─────────────┘     └─────────────┘     └──────────┘   │
│         │                   │                   │                   ▲         │
└─────────│───────────────────│───────────────────│───────────────────│─────────┘
          │                   │                   │                   │
          ▼                   ▼                   ▼                   │
┌──────────────────────────────────────────────────────────────────────────────┐
│                           YOUR SERVER (Next.js)                               │
│                                                                               │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────┐   │
│   │    Fetch    │     │   /api/     │     │    /api/    │ ──► │   /api/  │   │
│   │    Belt     │     │   orders/   │     │  webhooks/  │     │ payment/ │   │
│   │    Data     │     │   create    │     │   paymob    │     │ success  │   │
│   └─────────────┘     └─────────────┘     └─────────────┘     └──────────┘   │
│         │                   │                   │                             │
└─────────│───────────────────│───────────────────│─────────────────────────────┘
          │                   │                   │
          ▼                   ▼                   │
┌──────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                   │
│                                                                               │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                    │
│   │   MongoDB   │     │   Paymob    │     │   Resend    │                    │
│   │  Database   │     │    API      │ ━━► │   (Email)   │                    │
│   └─────────────┘     └─────────────┘     └─────────────┘                    │
│                             │                                                 │
│                             │ (Webhook)                                       │
│                             ▼                                                 │
│                       ┌─────────────┐                                        │
│                       │  Your API   │                                        │
│                       │ (webhooks)  │                                        │
│                       └─────────────┘                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Sequence

### Step 1: User Initiates Purchase

```
┌─────────────────┐
│ User clicks     │
│ "Buy" button    │
│ on pricing page │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Browser navigates to:                                        │
│ /en/tracks/programming/purchase?beltId=xxx&currency=EGP     │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Server Component: purchase/page.tsx                          │
│                                                              │
│ 1. Calls connectToDatabase()                                 │
│ 2. Fetches Belt from MongoDB                                 │
│ 3. Gets price (EGP or USD)                                   │
│ 4. Renders <TrackPurchaseForm />                             │
└──────────────────────────────────────────────────────────────┘
```

### Step 2: User Fills Form

```
┌─────────────────────────────────────────────────────────────┐
│ Client Component: TrackPurchaseForm.tsx                      │
│                                                              │
│ User enters:                                                 │
│ • Full Name                                                  │
│ • Email                                                      │
│ • Phone                                                      │
│ • Payment Method (Card/Wallet)                               │
│                                                              │
│ Clicks "Pay 500 EGP"                                         │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ TrackPurchaseForm validates locally:                         │
│                                                              │
│ • Name: min 2 chars                                          │
│ • Email: valid format                                        │
│ • Phone: min 10 digits                                       │
│                                                              │
│ If valid → proceeds                                          │
│ If invalid → shows errors                                    │
└──────────────────────────────────────────────────────────────┘
```

### Step 3: API Creates Order

```
┌─────────────────────────────────────────────────────────────┐
│ TrackPurchaseForm sends:                                     │
│                                                              │
│ POST /api/orders/create                                      │
│ {                                                            │
│   beltId: "xxx",                                             │
│   customerName: "Ahmed Hassan",                              │
│   customerEmail: "ahmed@example.com",                        │
│   customerPhone: "+201234567890",                            │
│   paymentMethod: "card",                                     │
│   currency: "EGP"                                            │
│ }                                                            │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ API Route: /api/orders/create/route.ts                       │
│                                                              │
│ Step 3a: Validate with Zod                                   │
│         ↓                                                    │
│ Step 3b: Connect to MongoDB                                  │
│         ↓                                                    │
│ Step 3c: Fetch Belt details                                  │
│         ↓                                                    │
│ Step 3d: Create Order (status: 'pending')                    │
│         ↓                                                    │
│ Step 3e: Call Paymob (see substeps below)                    │
│         ↓                                                    │
│ Step 3f: Send confirmation email                             │
│         ↓                                                    │
│ Step 3g: Return iframeUrl                                    │
└──────────────────────────────────────────────────────────────┘
```

### Step 3e: Paymob API Flow (Sub-steps)

```
┌─────────────────────────────────────────────────────────────┐
│ lib/paymob.ts → initiatePayment()                            │
│                                                              │
│ ┌─────────────────┐                                          │
│ │ 1. authenticate()│ ───► POST /auth/tokens                  │
│ │                  │      ◄─── { token: "xxx" }              │
│ └────────┬─────────┘                                          │
│          │                                                    │
│          ▼                                                    │
│ ┌─────────────────────┐                                       │
│ │ 2. createPaymobOrder()│ ───► POST /ecommerce/orders        │
│ │                      │      ◄─── { id: 12345678 }          │
│ └────────┬─────────────┘                                       │
│          │                                                    │
│          ▼                                                    │
│ ┌─────────────────────┐                                       │
│ │ 3. createPaymentKey()│ ───► POST /acceptance/payment_keys  │
│ │                      │      ◄─── { token: "payment_key" }  │
│ └────────┬─────────────┘                                       │
│          │                                                    │
│          ▼                                                    │
│ ┌─────────────────────┐                                       │
│ │ 4. buildIframeUrl() │ ───► Constructs full URL             │
│ │                      │                                     │
│ └────────┬─────────────┘                                       │
│          │                                                    │
│          ▼                                                    │
│ Returns: {                                                    │
│   paymobOrderId: 12345678,                                    │
│   paymentKey: "xxx",                                          │
│   iframeUrl: "https://accept.paymob.com/..."                  │
│ }                                                             │
└──────────────────────────────────────────────────────────────┘
```

### Step 4: Redirect to Paymob

```
┌─────────────────────────────────────────────────────────────┐
│ TrackPurchaseForm receives response:                         │
│ {                                                            │
│   success: true,                                             │
│   iframeUrl: "https://accept.paymob.com/api/acceptance/      │
│              iframes/123?payment_token=xxx"                  │
│ }                                                            │
│                                                              │
│ Executes: window.location.href = iframeUrl                   │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ USER IS NOW ON PAYMOB'S WEBSITE                              │
│                                                              │
│ • Enters card details / selects wallet                       │
│ • 3D Secure verification (if required)                       │
│ • Paymob processes payment                                   │
└──────────────────────────────────────────────────────────────┘
```

### Step 5: Paymob Sends Webhook (Server-to-Server)

```
┌─────────────────────────────────────────────────────────────┐
│ PAYMOB SERVER                                                │
│                                                              │
│ POST https://your-domain.com/api/webhooks/paymob?hmac=xxx   │
│                                                              │
│ Body: {                                                      │
│   type: "TRANSACTION",                                       │
│   obj: {                                                     │
│     id: 999999,           // Transaction ID                  │
│     order: { id: 12345678 }, // Paymob Order ID              │
│     success: true,                                           │
│     pending: false,                                          │
│     amount_cents: 50000,                                     │
│     ...                                                      │
│   }                                                          │
│ }                                                            │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ API Route: /api/webhooks/paymob/route.ts                     │
│                                                              │
│ Step 5a: Parse JSON payload                                  │
│         ↓                                                    │
│ Step 5b: Extract HMAC from query/header                      │
│         ↓                                                    │
│ Step 5c: Verify HMAC (security check)                        │
│         ↓                                                    │
│ Step 5d: Find Order by paymobOrderId                         │
│         ↓                                                    │
│ Step 5e: Create Transaction record                           │
│         ↓                                                    │
│ Step 5f: Update Order status                                 │
│         ↓                                                    │
│ Step 5g: Send emails (success/failure)                       │
│         ↓                                                    │
│ Step 5h: Return 200 OK                                       │
└──────────────────────────────────────────────────────────────┘
```

### Step 6: User Redirect Back (Browser-based)

```
┌─────────────────────────────────────────────────────────────┐
│ PAYMOB IFRAME                                                │
│                                                              │
│ Redirects user to:                                           │
│ https://your-domain.com/api/payment/success                  │
│   ?id=999999                                                 │
│   &success=true                                              │
│   &pending=false                                             │
│   &order=12345678                                            │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ API Route: /api/payment/success/route.ts                     │
│                                                              │
│ 1. Extract query params                                      │
│ 2. Look up order in database                                 │
│ 3. Determine redirect:                                       │
│    • success=true  → /en/payment/success?orderId=xxx         │
│    • success=false → /en/payment/error?reason=xxx            │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Success Page: /app/[locale]/(marketing)/payment/success/     │
│                                                              │
│ OR                                                           │
│                                                              │
│ Error Page: /app/[locale]/(marketing)/payment/error/         │
└──────────────────────────────────────────────────────────────┘
```

---

## File Communication Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────┐         ┌────────────────────┐                      │
│  │ TrackPurchaseForm  │◄───────►│   purchase/page    │                      │
│  │    (Client)        │ renders │    (Server)        │                      │
│  └─────────┬──────────┘         └─────────┬──────────┘                      │
│            │                              │                                  │
│            │ POST /api/orders/create      │ fetches                         │
│            │                              │                                  │
│            ▼                              ▼                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                               API LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐ │
│  │ /api/orders/create │    │/api/webhooks/paymob│    │/api/payment/success│ │
│  │                    │    │                    │    │                    │ │
│  └─────────┬──────────┘    └─────────┬──────────┘    └────────────────────┘ │
│            │                         │                                       │
│            │ uses                    │ uses                                  │
│            ▼                         ▼                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                              SERVICE LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐ │
│  │   lib/paymob.ts    │    │ lib/email/send.ts  │    │  lib/mongodb.ts    │ │
│  │                    │    │                    │    │                    │ │
│  │ • authenticate()   │    │ • sendPaymentEmail │    │ • connectToDatabase│ │
│  │ • createPaymobOrder│    │ • sendAdminEmail   │    │                    │ │
│  │ • createPaymentKey │    │                    │    │                    │ │
│  │ • verifyWebhookHmac│    │                    │    │                    │ │
│  └─────────┬──────────┘    └─────────┬──────────┘    └─────────┬──────────┘ │
│            │                         │                         │             │
│            │                         │ uses                    │             │
│            │                         ▼                         │             │
│            │           ┌────────────────────────────┐          │             │
│            │           │ lib/email/templates/*.ts   │          │             │
│            │           │                            │          │             │
│            │           │ • order-confirmation       │          │             │
│            │           │ • payment-success          │          │             │
│            │           │ • payment-failed           │          │             │
│            │           │ • admin-notification       │          │             │
│            │           └────────────────────────────┘          │             │
│            │                                                   │             │
├────────────┼───────────────────────────────────────────────────┼─────────────┤
│            │              DATA LAYER                           │             │
├────────────┼───────────────────────────────────────────────────┼─────────────┤
│            │                                                   │             │
│            │           ┌────────────────────────────┐          │             │
│            │           │    lib/models/Order.ts     │◄─────────┘             │
│            │           │    lib/models/Transaction  │                        │
│            │           │    lib/models/Belt.ts      │                        │
│            │           └─────────────┬──────────────┘                        │
│            │                         │                                       │
│            │                         ▼                                       │
├────────────┼─────────────────────────────────────────────────────────────────┤
│            │              EXTERNAL SERVICES                                  │
├────────────┼─────────────────────────────────────────────────────────────────┤
│            │                         │                                       │
│            ▼                         ▼                                       │
│  ┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐ │
│  │   Paymob API       │    │   MongoDB Atlas    │    │   Resend API       │ │
│  │                    │    │                    │    │                    │ │
│  └────────────────────┘    └────────────────────┘    └────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Creating an Order

```
User Input                API Processing              Database
─────────────────────────────────────────────────────────────────

{                         
  customerName,           ┌──────────────┐
  customerEmail,    ───►  │ Zod Validate │
  customerPhone,          └──────┬───────┘
  beltId,                        │
  paymentMethod,                 ▼
  currency                ┌──────────────┐
}                         │ Fetch Belt   │ ───► Belt.findById()
                          └──────┬───────┘            │
                                 │                    ▼
                                 │              ┌──────────┐
                                 │              │ Belt doc │
                                 │              └────┬─────┘
                                 ▼                   │
                          ┌──────────────┐           │
                          │ Create Order │ ◄─────────┘
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │ Order.create │ ───► MongoDB
                          │ status:      │       ┌───────────┐
                          │ 'pending'    │ ───►  │ Order doc │
                          └──────────────┘       │ (pending) │
                                                 └───────────┘
```

### Processing Webhook

```
Paymob Webhook           API Processing              Database
─────────────────────────────────────────────────────────────────

{                         
  type: "TRANSACTION",    ┌──────────────┐
  obj: {                  │ Verify HMAC  │
    id: 999999,     ───►  └──────┬───────┘
    order: {id: x},              │
    success: true,               ▼
    ...                   ┌──────────────┐
  }                       │ Find Order   │ ───► Order.findOne()
}                         └──────┬───────┘      {paymobOrderId}
                                 │                    │
                                 │                    ▼
                                 │              ┌───────────┐
                                 │              │ Order doc │
                                 │              └────┬──────┘
                                 ▼                   │
                          ┌──────────────┐           │
                          │ Create Txn   │           │
                          └──────┬───────┘           │
                                 │                   │
                                 ▼                   │
                          Transaction.create() ───►  │
                                 │                   │
                                 ▼                   ▼
                          ┌──────────────┐     ┌───────────┐
                          │ Update Order │ ──► │ Order doc │
                          │ status:'paid'│     │ (paid)    │
                          └──────────────┘     └───────────┘
```

---

## Error Handling Flow

### API Errors

```
┌─────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING CHAIN                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐                                         │
│  │ Zod Validation │──► 400 Bad Request                      │
│  │ Error          │    { error: "Validation failed",        │
│  │                │      details: { field: "message" } }    │
│  └────────────────┘                                         │
│                                                              │
│  ┌────────────────┐                                         │
│  │ Belt Not Found │──► 404 Not Found                        │
│  │                │    { error: "Belt not found" }          │
│  └────────────────┘                                         │
│                                                              │
│  ┌────────────────┐                                         │
│  │ Paymob Error   │──► 502 Bad Gateway                      │
│  │                │    { error: "Payment gateway error",    │
│  │                │      message: "...",                    │
│  │                │      details: {...} }                   │
│  └────────────────┘                                         │
│                                                              │
│  ┌────────────────┐                                         │
│  │ Paymob Not     │──► 503 Service Unavailable              │
│  │ Configured     │    { error: "Payment gateway not        │
│  │                │             configured" }               │
│  └────────────────┘                                         │
│                                                              │
│  ┌────────────────┐                                         │
│  │ Generic Error  │──► 500 Internal Server Error            │
│  │                │    { error: "Failed to create order" }  │
│  └────────────────┘                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Webhook Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│                    WEBHOOK ERROR HANDLING                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐                                         │
│  │ HMAC Invalid   │──► 401 Unauthorized                     │
│  │                │    (Paymob will NOT retry)              │
│  └────────────────┘                                         │
│                                                              │
│  ┌────────────────┐                                         │
│  │ Order Not      │──► 404 Not Found                        │
│  │ Found          │    (Paymob may retry)                   │
│  └────────────────┘                                         │
│                                                              │
│  ┌────────────────┐                                         │
│  │ Processing     │──► 200 OK (always!)                     │
│  │ Error          │    (To stop Paymob retries,             │
│  │                │     we return 200 even on error)        │
│  └────────────────┘                                         │
│                                                              │
│  NOTE: We always return 200 for processed webhooks to       │
│  prevent Paymob from endlessly retrying. Errors are logged. │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Webhook Processing Flow

### Idempotency

```
┌─────────────────────────────────────────────────────────────┐
│                    IDEMPOTENCY LOGIC                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Scenario: Paymob sends duplicate webhooks                    │
│                                                              │
│ First Webhook:                                               │
│   Order status: 'pending' → 'paid' ✓                         │
│   Transaction created: Yes ✓                                 │
│   Email sent: Yes ✓                                          │
│                                                              │
│ Duplicate Webhook:                                           │
│   Order status: 'paid' → 'paid' (no change)                  │
│   Transaction: Already exists (skip or find existing)        │
│   Email: Not sent again                                      │
│   Response: 200 OK                                           │
│                                                              │
│ Code Logic:                                                  │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ if (order.status === 'paid') {                         │  │
│ │   return { message: 'Order already processed' };       │  │
│ │ }                                                       │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Status Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                    ORDER STATUS MACHINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌─────────────┐                          │
│         ┌─────────►│   PENDING   │◄─────────┐               │
│         │          └──────┬──────┘          │               │
│         │                 │                 │               │
│         │    success=true │ success=false   │               │
│         │                 │                 │               │
│         │          ┌──────┴──────┐          │               │
│         │          ▼             ▼          │               │
│         │    ┌──────────┐  ┌──────────┐     │               │
│         │    │   PAID   │  │  FAILED  │     │               │
│         │    └────┬─────┘  └────┬─────┘     │               │
│         │         │             │           │               │
│         │         │   (retry)   │           │               │
│         │         │     ┌───────┘           │               │
│         │         │     │                   │               │
│         │         ▼     ▼                   │               │
│         │    ┌──────────────┐               │               │
│         └────│   REFUNDED   │───────────────┘               │
│              └──────────────┘                               │
│                                                              │
│ RULE: Never downgrade from PAID                              │
│ RULE: FAILED can retry → PAID                                │
│ RULE: PAID/FAILED can → REFUNDED (admin action)              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Summary

### What Triggers What?

| Trigger | What Gets Called | What Happens |
|---------|------------------|--------------|
| User clicks "Buy" | `purchase/page.tsx` | Loads belt, shows form |
| User submits form | `TrackPurchaseForm` → `/api/orders/create` | Order created, Paymob called |
| API creates order | `lib/paymob.ts` | Auth → Order → PaymentKey |
| User completes payment | Paymob iframe | Card processed, redirects |
| Paymob confirms | `POST /api/webhooks/paymob` | Order updated, emails sent |
| User redirected | `/api/payment/success` | Redirect to success/error page |

### Email Sending Map

| Event | Customer Email | Admin Email |
|-------|----------------|-------------|
| Order created | Order Confirmation ✉️ | New Order 📬 |
| Payment success | Payment Success 🎉 | Payment Success 📬 |
| Payment failed | Payment Failed ❌ | Payment Failed 📬 |

---

*This workflow documentation explains how all files communicate and work together in the Paymob payment integration.*

# Paymob Payment Integration

This document describes the Paymob payment integration for NGen Schools.

## Overview

The integration allows users to purchase belts/courses using:
- **Credit/Debit Cards** (Visa, Mastercard, Meeza, etc.)
- **Mobile Wallets** (Vodafone Cash, Orange Money, etc.)

## Architecture

```
User Flow:
┌──────────────┐     ┌─────────────────┐     ┌────────────────┐
│ Purchase Page │ ──► │ /api/orders/create │ ──► │ Paymob API     │
└──────────────┘     └─────────────────┘     └────────────────┘
                              │                        │
                              ▼                        ▼
                     ┌────────────────┐      ┌──────────────────┐
                     │ Order (pending)│      │ Paymob Iframe    │
                     └────────────────┘      └──────────────────┘
                                                      │
                                                      ▼
┌──────────────┐     ┌─────────────────────┐  ┌────────────────┐
│ Success/Error │ ◄── │ /api/webhooks/paymob│ ◄──│ Paymob Webhook│
└──────────────┘     └─────────────────────┘  └────────────────┘
                              │
                              ▼
                     ┌────────────────┐
                     │ Order (paid)   │
                     │ Transaction    │
                     │ Emails sent    │
                     └────────────────┘
```

## File Structure

```
lib/
├── paymob.ts              # Paymob API wrapper
├── models/
│   ├── Order.ts           # Order MongoDB model
│   └── Transaction.ts     # Transaction MongoDB model
└── email/
    ├── config.ts          # Email configuration
    ├── send.ts            # Email sending functions
    └── templates/
        ├── index.ts
        ├── order-confirmation.ts
        ├── payment-success.ts
        ├── payment-failed.ts
        └── admin-notification.ts

app/
├── api/
│   ├── orders/create/route.ts       # Create order API
│   ├── webhooks/paymob/route.ts     # Paymob webhook handler
│   └── payment/success/route.ts     # Post-payment redirect handler
└── [locale]/(marketing)/
    ├── tracks/[slug]/purchase/page.tsx   # Purchase page
    └── payment/
        ├── success/page.tsx         # Success page
        └── error/page.tsx           # Error page

components/
└── payment/
    └── TrackPurchaseForm.tsx        # Purchase form component

types/
└── payment.ts                       # TypeScript types
```

## Setup Instructions

### 1. Sign Up for Paymob

1. Go to [Paymob Accept Portal](https://accept.paymob.com)
2. Create a merchant account
3. Complete the verification process

### 2. Get Your Credentials

From the Paymob Dashboard, you'll need:

| Value | Location in Dashboard |
|-------|----------------------|
| API Key | Settings > Account Info |
| Integration ID (Card) | Developers > Payment Integrations |
| Integration ID (Wallet) | Developers > Payment Integrations |
| Iframe ID | Developers > iframes |
| HMAC Secret | Developers > HMAC Calculation |

### 3. Configure Environment Variables

Add these to your `.env.local`:

```bash
# Paymob Configuration
PAYMOB_API_KEY="your-api-key"
PAYMOB_INTEGRATION_ID_CARD="your-card-integration-id"
PAYMOB_INTEGRATION_ID_WALLET="your-wallet-integration-id"
PAYMOB_IFRAME_ID="your-iframe-id"
PAYMOB_HMAC_SECRET="your-hmac-secret"
PAYMOB_BASE_URL="https://accept.paymob.com/api"

# Application URL
APP_BASE_URL="https://your-domain.com"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
MAIL_FROM="no-reply@your-domain.com"
ADMIN_EMAIL="admin@your-domain.com"
```

### 4. Configure Webhook in Paymob Dashboard

1. Go to **Developers > Transaction Callbacks**
2. Set the callback URL: `https://your-domain.com/api/webhooks/paymob`
3. Enable HMAC validation
4. Set the redirect URL (optional): `https://your-domain.com/api/payment/success`

### 5. Test the Integration

1. Use Paymob's test cards (available in their documentation)
2. Make a test purchase
3. Verify the webhook is received and processed
4. Check that emails are sent correctly

## API Reference

### POST /api/orders/create

Create a new order and get the payment iframe URL.

**Request:**
```json
{
    "beltId": "mongodb-object-id",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+201234567890",
    "paymentMethod": "card",
    "currency": "EGP"
}
```

**Response:**
```json
{
    "success": true,
    "orderId": "mongodb-object-id",
    "paymobOrderId": 12345678,
    "iframeUrl": "https://accept.paymob.com/api/acceptance/iframes/xxx?payment_token=xxx",
    "amount": 500,
    "currency": "EGP"
}
```

### POST /api/webhooks/paymob

Receives transaction callbacks from Paymob.

**Note:** This endpoint verifies the HMAC signature before processing.

**Response:**
```json
{
    "success": true,
    "orderId": "mongodb-object-id",
    "status": "paid"
}
```

### GET /api/payment/success

Handles redirect from Paymob iframe after payment.

**Query Parameters:**
- `id` - Transaction ID
- `success` - "true" or "false"
- `pending` - "true" or "false"
- `order` - Paymob order ID

**Redirects to:**
- `/payment/success?orderId=xxx` on success
- `/payment/error?reason=xxx` on failure

## Paymob API Flow

The integration uses the following Paymob APIs:

1. **POST /auth/tokens** - Authenticate and get temporary token
2. **POST /ecommerce/orders** - Create order in Paymob
3. **POST /acceptance/payment_keys** - Generate payment key for iframe
4. **Iframe URL** - User completes payment
5. **Webhook** - Receive transaction result

## Troubleshooting

### HMAC Verification Failed

- Ensure your `PAYMOB_HMAC_SECRET` matches the dashboard
- Check that the webhook URL is using HTTPS
- Verify the HMAC header name (could be `hmac` query param or `x-paymob-hmac` header)

### Payment Not Reflected

- Check the webhook endpoint is accessible
- Verify the webhook is configured correctly in Paymob dashboard
- Check server logs for errors

### Emails Not Sending

- Verify `RESEND_API_KEY` is set
- Check the "from" email is verified in Resend
- Check server logs for email errors

## Next Steps After Setup

1. **Grant Course Access**: After payment success, implement logic in the webhook handler to:
   - Create a user enrollment record
   - Update user's purchased belts
   - Trigger LMS access provisioning

2. **Admin Dashboard**: Build an admin view to:
   - View all orders
   - Process refunds
   - Export transaction data

3. **Analytics**: Track:
   - Conversion rates
   - Popular products
   - Failed payment reasons

## Testing Credentials

Paymob provides test cards for sandbox testing. See their documentation for current test card numbers.

---

*Last updated: December 2024*

# Payment Integration Guide (Paymob)

This document outlines the payment flow integration with **Paymob**, handling both credit cards and mobile wallets, with support for multi-currency (EGP/USD).

## 🔄 Payment Flow Overview

1.  **User Selection**: 
    -   User selects a Belt or Package on the pricing page.
    -   Frontend detects user's location (Country/Currency).

2.  **Order Initiation** (`POST /api/orders/create`):
    -   **Validation**: Validates user details and selected product.
    -   **Currency Logic**: 
        -   Calculates amount in EGP or USD (based on user's currency).
        -   Uses dynamic country code for billing data.
    -   **DB Entry**: Creates a local `Order` record with status `pending`.
    -   **Paymob Interaction**:
        1.  **Auth**: Gets authentication token.
        2.  **Order Registration**: Registers order with Paymob.
        3.  **Payment Key**: Generates a payment key (iframe token) specific to the payment method (Card/Wallet).

3.  **User Payment**:
    -   Frontend redirects user to the Paymob Iframe (or Wallet redirect URL).
    -   User completes the payment.

4.  **Verification & Fulfillment** (`POST /api/webhooks/paymob`):
    -   Paymob sends a webhook to our server.
    -   **HMAC Verification**: Validates the request signature to ensure authenticity.
    -   **Status Update**: Updates the `Order` status to `paid` or `failed`.
    -   **Fulfillment**: Sends confirmation email to the user.

## 🛠 Key Components

### 1. `lib/paymob.ts`
The core integration library containing:
*   `authenticate()`: Gets Auth Token.
*   `createPaymobOrder()`: Registers the order.
*   `createPaymentKey()`: Generates the payment token.
*   `verifyWebhookHmac()`: Security check for webhooks.

### 2. `app/api/orders/create/route.ts`
The endpoint that orchestrates the process.
*   **Input**: `beltId`, `customerName`, `email`, `phone`, `currency`, `countryCode`.
*   **Logic**:
    -   Fetches Belt/Package details from DB.
    -   Determines price (EGP vs USD).
    -   Call `initiatePayment` wrapper from `lib/paymob.ts`.

### 3. `app/api/webhooks/paymob/route.ts`
The webhook listener.
*   **Role**: Listens for transaction updates.
*   **Crucial Step**: Verifies `hmac` query param against `PAYMOB_HMAC_SECRET` env var.

## 🌍 Internationalization (Currency & Country)

*   **Currency**: Supported currencies are `EGP` and `USD`. Prices are stored in `Belt` and `Package` models separately (`basePriceEGP`, `basePriceUSD`).
*   **Country Code**: 
    -   Detected via IP Geolocation (`lib/geoLocation.ts`).
    -   Passed to Paymob to ensure correct billing data format.
    -   Defaults to 'EG' if detection fails.

## ⚠️ Important Configurations

Ensure these environment variables are set in `.env.local`:

```bash
PAYMOB_API_KEY=...
PAYMOB_INTEGRATION_ID_CARD=...   # ID for Card Integration
PAYMOB_INTEGRATION_ID_WALLET=... # ID for Wallet Integration
PAYMOB_IFRAME_ID=...             # ID for the styling iframe
PAYMOB_HMAC_SECRET=...           # For webhook verification
```

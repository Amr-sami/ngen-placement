import * as crypto from 'crypto';

/**
 * Paymob Payment Gateway Integration
 * 
 * This module provides a complete wrapper for Paymob's Accept API.
 * 
 * Paymob APIs used:
 * - POST /auth/tokens - Authenticate and get token
 * - POST /ecommerce/orders - Create order in Paymob
 * - POST /acceptance/payment_keys - Generate payment key for iframe
 * 
 * Dashboard values needed:
 * - API Key: Found in Dashboard > Settings > Account Info
 * - Integration ID(s): Dashboard > Developers > Payment Integrations
 * - Iframe ID: Dashboard > Developers > iframes
 * - HMAC Secret: Dashboard > Developers > HMAC Calculation
 * 
 * @see https://docs.paymob.com/docs/accept-standard-redirect
 */

// Environment configuration
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || '';
const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY || '';
const NEXT_PUBLIC_PAYMOB_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY || '';
const PAYMOB_INTEGRATION_ID_CARD = process.env.PAYMOB_INTEGRATION_ID_CARD || '';
const PAYMOB_INTEGRATION_ID_WALLET = process.env.PAYMOB_INTEGRATION_ID_WALLET || '';
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID || '';
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || '';
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || 'https://accept.paymob.com/api';

// Type definitions
export interface PaymobAuthResponse {
    token: string;
}

export interface PaymobOrderResponse {
    id: number;
    created_at: string;
    delivery_needed: boolean;
    merchant: {
        id: number;
        created_at: string;
    };
    amount_cents: number;
    currency: string;
}

export interface PaymobPaymentKeyResponse {
    token: string;
}

export interface BillingData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    apartment?: string;
    floor?: string;
    street?: string;
    building?: string;
    shipping_method?: string;
    postal_code?: string;
    city?: string;
    country?: string;
    state?: string;
}

export interface CreateOrderArgs {
    amountCents: number;
    currency?: string;
    merchantOrderId?: string;
    items?: Array<{
        name: string;
        amount_cents: number;
        description?: string;
        quantity: number;
    }>;
}

export interface CreatePaymentKeyArgs {
    authToken: string;
    orderId: number;
    amountCents: number;
    currency?: string;
    billingData: BillingData;
    paymentMethod?: 'card' | 'wallet';
    lockOrderWhenPaid?: boolean;
}

export interface PaymentIntentionArgs {
    amountCents: number;
    currency: string;
    paymentMethods: Array<number | string>;
    billingData: BillingData;
    items?: Array<{
        name: string;
        amount: number; // Intention API uses 'amount' for items
        description?: string;
        quantity: number;
    }>;
    specialReference?: string;
    notificationUrl?: string;
    redirectionUrl?: string;
}

export interface IntentionInquiryResponse {
    id: string;
    status: 'Pending' | 'Success' | 'Fail';
    amount: number;
    currency: string;
    payment_methods: Array<{
        id: number;
        name: string;
        method_type: string;
    }>;
    special_reference?: string;
    created: string;
    [key: string]: any;
}

export interface TransactionInquiryResponse {
    id: number;
    success: boolean;
    pending: boolean;
    amount_cents: number;
    currency: string;
    order: {
        id: number;
        merchant_order_id?: string;
    };
    [key: string]: any;
}

export interface PaymentIntentionResponse {
    id: string;
    client_secret: string;
    amount: number;
    currency: string;
    [key: string]: any;
}

export interface PaymobWebhookPayload {
    obj: {
        id: number;
        pending: boolean;
        amount_cents: number;
        success: boolean;
        is_auth: boolean;
        is_capture: boolean;
        is_standalone_payment: boolean;
        is_voided: boolean;
        is_refunded: boolean;
        is_3d_secure: boolean;
        integration_id: number;
        profile_id: number;
        has_parent_transaction: boolean;
        order: {
            id: number;
            created_at: string;
            delivery_needed: boolean;
            merchant: {
                id: number;
                created_at: string;
            };
            amount_cents: number;
            currency: string;
        };
        created_at: string;
        transaction_processed_callback_responses: string[];
        currency: string;
        source_data: {
            type: string;
            pan: string;
            sub_type: string;
        };
        api_source: string;
        terminal_id: number | null;
        merchant_commission: number;
        installment: number | null;
        is_void: boolean;
        is_refund: boolean;
        data: {
            message?: string;
            merchant?: string;
            acq_response_code?: string | null;
            captured_amount?: number | null;
            [key: string]: unknown;
        };
        payment_key_claims: {
            user_id: number;
            amount_cents: number;
            currency: string;
            integration_id: number;
            order_id: number;
            billing_data: BillingData;
            lock_order_when_paid: boolean;
        };
        error_occured: boolean;
        owner: number;
        parent_transaction: number | null;
    };
    type: string;
    hmac?: string;
}

/**
 * Paymob API Error
 */
export class PaymobError extends Error {
    public statusCode?: number;
    public responseData?: unknown;

    constructor(message: string, statusCode?: number, responseData?: unknown) {
        super(message);
        this.name = 'PaymobError';
        this.statusCode = statusCode;
        this.responseData = responseData;
    }
}

/**
 * Make HTTP request to Paymob API
 */
async function paymobRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${PAYMOB_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new PaymobError(
            data.message || 'Paymob API request failed',
            response.status,
            data
        );
    }

    return data as T;
}

/**
 * Step 1: Authenticate with Paymob and get auth token
 * 
 * @see POST /auth/tokens
 * @returns Auth token valid for ~1 hour
 */
export async function authenticate(): Promise<PaymobAuthResponse> {
    if (!PAYMOB_API_KEY) {
        throw new PaymobError('PAYMOB_API_KEY is not configured');
    }

    const response = await paymobRequest<PaymobAuthResponse>('/auth/tokens', {
        method: 'POST',
        body: JSON.stringify({
            api_key: PAYMOB_API_KEY,
        }),
    });

    return response;
}

/**
 * Step 2: Create an order in Paymob
 * 
 * @see POST /ecommerce/orders
 * @param args - Order creation arguments
 * @returns Created order with ID
 */
export async function createPaymobOrder(
    args: CreateOrderArgs & { authToken: string }
): Promise<PaymobOrderResponse> {
    const { authToken, amountCents, currency = 'EGP', merchantOrderId, items = [] } = args;

    const response = await paymobRequest<PaymobOrderResponse>('/ecommerce/orders', {
        method: 'POST',
        body: JSON.stringify({
            auth_token: authToken,
            delivery_needed: false,
            amount_cents: amountCents,
            currency,
            merchant_order_id: merchantOrderId,
            items: items.length > 0 ? items : [
                {
                    name: 'Course Purchase',
                    amount_cents: amountCents,
                    description: 'NGen Schools Course',
                    quantity: 1,
                },
            ],
        }),
    });

    return response;
}

/**
 * Step 3: Create payment key for iframe
 * 
 * @see POST /acceptance/payment_keys
 * @param args - Payment key creation arguments
 * @returns Payment key token
 */
export async function createPaymentKey(
    args: CreatePaymentKeyArgs
): Promise<PaymobPaymentKeyResponse> {
    const {
        authToken,
        orderId,
        amountCents,
        currency = 'EGP',
        billingData,
        paymentMethod = 'card',
        lockOrderWhenPaid = true,
    } = args;

    // Select integration ID based on payment method
    const integrationId = paymentMethod === 'wallet'
        ? PAYMOB_INTEGRATION_ID_WALLET
        : PAYMOB_INTEGRATION_ID_CARD;

    if (!integrationId) {
        throw new PaymobError(
            `Integration ID for ${paymentMethod} is not configured`
        );
    }

    // Ensure billing data has all required fields
    const completeBillingData: BillingData = {
        apartment: 'NA',
        floor: 'NA',
        street: 'NA',
        building: 'NA',
        shipping_method: 'NA',
        postal_code: 'NA',
        city: 'NA',
        country: 'EG',
        state: 'NA',
        ...billingData,
    };

    const response = await paymobRequest<PaymobPaymentKeyResponse>(
        '/acceptance/payment_keys',
        {
            method: 'POST',
            body: JSON.stringify({
                auth_token: authToken,
                amount_cents: amountCents,
                expiration: 3600, // 1 hour
                order_id: orderId,
                billing_data: completeBillingData,
                currency,
                integration_id: parseInt(integrationId, 10),
                lock_order_when_paid: lockOrderWhenPaid,
            }),
        }
    );

    return response;
}

/**
 * Build Paymob iframe URL for payment
 * 
 * @param paymentKey - Payment key token from createPaymentKey
 * @returns Full iframe URL
 */
export function buildIframeUrl(paymentKey: string): string {
    if (!PAYMOB_IFRAME_ID) {
        throw new PaymobError('PAYMOB_IFRAME_ID is not configured');
    }

    return `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
}

/**
 * Verify Paymob webhook HMAC signature
 * 
 * Paymob signs webhooks using HMAC-SHA512.
 * The HMAC is calculated over a concatenated string of specific fields.
 * 
 * @see https://docs.paymob.com/docs/transaction-callbacks
 * @param payload - Full webhook payload
 * @param receivedHmac - HMAC from request header or query param
 * @returns Whether the HMAC is valid
 */
export function verifyWebhookHmac(
    payload: PaymobWebhookPayload,
    receivedHmac: string
): boolean {
    if (!PAYMOB_HMAC_SECRET) {
        console.warn('⚠️ PAYMOB_HMAC_SECRET is not configured, skipping verification');
        return true; // Skip verification in development
    }

    try {
        const obj = payload.obj;

        // Build the string to hash according to Paymob's exactly specified order:
        // amount_cents, created_at, currency, error_occured, has_parent_transaction, id, 
        // integration_id, is_3d_secure, is_auth, is_capture, is_refunded, 
        // is_standalone_payment, is_voided, order.id, owner, pending, 
        // source_data.pan, source_data.sub_type, source_data.type, success

        const dataToHash = [
            String(obj.amount_cents),
            String(obj.created_at),
            String(obj.currency),
            String(obj.error_occured),
            String(obj.has_parent_transaction),
            String(obj.id),
            String(obj.integration_id),
            String(obj.is_3d_secure),
            String(obj.is_auth),
            String(obj.is_capture),
            String(obj.is_refunded),
            String(obj.is_standalone_payment),
            String(obj.is_voided),
            String(obj.order.id),
            String(obj.owner),
            String(obj.pending),
            String(obj.source_data.pan),
            String(obj.source_data.sub_type),
            String(obj.source_data.type),
            String(obj.success),
        ].join('');

        const calculatedHmac = crypto
            .createHmac('sha512', PAYMOB_HMAC_SECRET)
            .update(dataToHash)
            .digest('hex');

        const isValid = calculatedHmac === receivedHmac;

        if (!isValid) {
            console.error('❌ HMAC verification failed');
            console.log('Data to hash:', dataToHash);
            console.log('Calculated HMAC:', calculatedHmac);
            console.log('Received HMAC:', receivedHmac);
        }

        return isValid;
    } catch (error) {
        console.error('HMAC verification error:', error);
        return false;
    }
}

/**
 * Map Paymob transaction status to application status
 * 
 * @param payload - Paymob webhook payload
 * @returns Mapped status
 */
export function mapPaymobStatus(payload: PaymobWebhookPayload): {
    success: boolean;
    pending: boolean;
    status: 'paid' | 'failed' | 'pending';
} {
    const { success, pending } = payload.obj;

    if (success && !pending) {
        return { success: true, pending: false, status: 'paid' };
    }

    if (pending) {
        return { success: false, pending: true, status: 'pending' };
    }

    return { success: false, pending: false, status: 'failed' };
}

/**
 * Get integration ID for a payment method
 */
export function getIntegrationId(paymentMethod: 'card' | 'wallet'): string {
    return paymentMethod === 'wallet'
        ? PAYMOB_INTEGRATION_ID_WALLET
        : PAYMOB_INTEGRATION_ID_CARD;
}

/**
 * Check if Paymob is configured
 */
export function isPaymobConfigured(): boolean {
    // Check for both legacy and unified checkout credentials
    const basicConfig = !!(PAYMOB_API_KEY && (PAYMOB_INTEGRATION_ID_CARD || PAYMOB_INTEGRATION_ID_WALLET));
    const unifiedConfig = !!(PAYMOB_SECRET_KEY && NEXT_PUBLIC_PAYMOB_PUBLIC_KEY);

    return basicConfig || unifiedConfig;
}

/**
 * Unified Checkout (Intention API)
 * 
 * @see POST /api/acceptance/payment_intentions
 * @param args - Payment intention arguments
 * @returns Created intention with client_secret
 */
export async function createPaymentIntention(
    args: PaymentIntentionArgs
): Promise<PaymentIntentionResponse> {
    if (!PAYMOB_SECRET_KEY) {
        throw new PaymobError('PAYMOB_SECRET_KEY is not configured');
    }

    const {
        amountCents,
        currency,
        paymentMethods,
        billingData,
        items,
        specialReference,
        notificationUrl,
        redirectionUrl
    } = args;

    // Note: The Intention API endpoint is NOT under the /api prefix
    const url = 'https://accept.paymob.com/v1/intention';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${PAYMOB_SECRET_KEY}`
        },
        body: JSON.stringify({
            amount: amountCents,
            currency,
            payment_methods: paymentMethods,
            billing_data: {
                apartment: 'NA',
                floor: 'NA',
                street: 'NA',
                building: 'NA',
                shipping_method: 'NA',
                postal_code: 'NA',
                city: 'NA',
                country: 'EG',
                state: 'NA',
                ...billingData,
            },
            items,
            special_reference: specialReference,
            notification_url: notificationUrl,
            redirection_url: redirectionUrl,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new PaymobError(
            data.message || data.detail || 'Paymob Intention API request failed',
            response.status,
            data
        );
    }

    return data as PaymentIntentionResponse;
}

/**
 * Build Unified Checkout URL
 * 
 * @param clientSecret - Client secret from createPaymentIntention
 * @returns Full checkout URL
 */
export function getUnifiedCheckoutUrl(clientSecret: string): string {
    if (!NEXT_PUBLIC_PAYMOB_PUBLIC_KEY) {
        throw new PaymobError('NEXT_PUBLIC_PAYMOB_PUBLIC_KEY is not configured');
    }

    return `https://accept.paymob.com/unifiedcheckout/?publicKey=${NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;
}

/**
 * Transaction Inquiry API
 * 
 * Get the latest status of a transaction using the Paymob Order ID or Merchant Order ID.
 * This is the most reliable way to verify a payment status on the backend.
 * 
 * @see POST /api/ecommerce/orders/transaction_inquiry
 */
export async function getTransactionInquiry(args: {
    paymobOrderId?: string;
    merchantOrderId?: string;
}): Promise<TransactionInquiryResponse> {
    if (!PAYMOB_API_KEY) {
        throw new PaymobError('PAYMOB_API_KEY is not configured');
    }

    // First authenticate to get a token
    const { token } = await authenticate();

    const response = await paymobRequest<TransactionInquiryResponse>(
        '/ecommerce/orders/transaction_inquiry',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                order_id: args.paymobOrderId,
                merchant_order_id: args.merchantOrderId,
            }),
        }
    );

    return response;
}

/**
 * Full payment flow helper
 * Combines all steps for convenience
 */
export async function initiatePayment(args: {
    amountCents: number;
    currency?: string;
    merchantOrderId: string;
    billingData: BillingData;
    paymentMethod?: 'card' | 'wallet';
    items?: CreateOrderArgs['items'];
}): Promise<{
    paymobOrderId: number;
    paymentKey: string;
    iframeUrl: string;
}> {
    // Step 1: Authenticate
    const { token: authToken } = await authenticate();

    // Step 2: Create order
    const paymobOrder = await createPaymobOrder({
        authToken,
        amountCents: args.amountCents,
        currency: args.currency,
        merchantOrderId: args.merchantOrderId,
        items: args.items,
    });

    // Step 3: Create payment key
    const { token: paymentKey } = await createPaymentKey({
        authToken,
        orderId: paymobOrder.id,
        amountCents: args.amountCents,
        currency: args.currency,
        billingData: args.billingData,
        paymentMethod: args.paymentMethod,
    });

    // Step 4: Build iframe URL
    const iframeUrl = buildIframeUrl(paymentKey);

    return {
        paymobOrderId: paymobOrder.id,
        paymentKey,
        iframeUrl,
    };
}

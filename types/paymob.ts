/**
 * Paymob Payment Gateway Types
 *
 * Type definitions for Paymob's Accept API.
 * @see https://docs.paymob.com/docs/accept-standard-redirect
 */

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
        amount: number;
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

/**
 * Payment Integration Types
 * 
 * Centralized types for the Paymob payment integration
 */

export interface OrderData {
    _id: string;
    userId?: string;
    trackId?: string;
    beltId?: string;
    amount: number;
    currency: 'EGP' | 'USD';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    paymobOrderId?: string;
    transactionId?: string;
    paymentMethod?: 'card' | 'wallet';
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export interface TransactionData {
    _id: string;
    orderId: string;
    paymobTxnId: string;
    amount: number;
    currency: string;
    success: boolean;
    pending: boolean;
    responseData: Record<string, unknown>;
    errorMessage?: string;
    createdAt: Date;
}

export interface PaymentInitiationResult {
    success: boolean;
    orderId?: string;
    paymobOrderId?: number;
    iframeUrl?: string;
    amount?: number;
    currency?: string;
    error?: string;
}

export interface CreateOrderRequest {
    beltId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod?: 'card' | 'wallet';
    currency?: 'EGP' | 'USD';
    userId?: string;
}

export interface WebhookResult {
    success: boolean;
    orderId?: string;
    status?: 'pending' | 'paid' | 'failed';
    message?: string;
    error?: string;
}

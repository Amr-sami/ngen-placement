import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Transaction from '@/lib/models/Transaction';

/**
 * GET /api/payment/verify
 * 
 * Verify Paymob payment return and update order status.
 * Called by the /payment/return page to validate the payment result.
 * 
 * Query params from Paymob redirect:
 * - success: boolean
 * - is_voided: boolean
 * - is_refunded: boolean
 * - is_pending: boolean
 * - amount_cents: number
 * - currency: string
 * - merchant_order_id: string (our orderId)
 * - txn_response_code: string
 * - id (transaction id)
 * - order: number (Paymob order id)
 * - hmac: string (HMAC signature)
 */

const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || '';

/**
 * Calculate HMAC for redirect URL params
 * Paymob uses a different HMAC calculation for redirects vs webhooks
 */
function verifyRedirectHmac(params: URLSearchParams, receivedHmac: string): boolean {
    if (!PAYMOB_HMAC_SECRET) {
        console.warn('⚠️ PAYMOB_HMAC_SECRET is not configured, skipping verification');
        return true; // Skip verification in development
    }

    try {
        // Fields used for HMAC calculation in redirect (alphabetical order)
        // Based on Paymob documentation for transaction response
        const hmacFields = [
            'amount_cents',
            'created_at',
            'currency',
            'error_occured',
            'has_parent_transaction',
            'id',
            'integration_id',
            'is_3d_secure',
            'is_auth',
            'is_capture',
            'is_refunded',
            'is_standalone_payment',
            'is_voided',
            'order',
            'owner',
            'pending',
            'source_data.pan',
            'source_data.sub_type',
            'source_data.type',
            'success',
        ];

        // Build the concatenated string
        const dataToHash = hmacFields.map(field => {
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                const parentVal = params.get(parent);
                if (parentVal) {
                    try {
                        const parsed = JSON.parse(parentVal);
                        return parsed[child] ?? '';
                    } catch {
                        return '';
                    }
                }
                return '';
            }
            return params.get(field) ?? '';
        }).join('');

        const calculatedHmac = crypto
            .createHmac('sha512', PAYMOB_HMAC_SECRET)
            .update(dataToHash)
            .digest('hex');

        return calculatedHmac === receivedHmac;
    } catch (error) {
        console.error('HMAC verification error:', error);
        return false;
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const params = url.searchParams;

        // Extract key parameters
        const success = params.get('success') === 'true';
        const isPending = params.get('pending') === 'true' || params.get('is_pending') === 'true';
        const merchantOrderId = params.get('merchant_order_id') || '';
        const paymobOrderId = params.get('order') || '';
        const transactionId = params.get('id') || '';
        const amountCents = parseInt(params.get('amount_cents') || '0', 10);
        const currency = params.get('currency') || 'EGP';
        const hmac = params.get('hmac') || '';
        const txnResponseCode = params.get('txn_response_code') || '';

        // Basic validation
        if (!merchantOrderId && !paymobOrderId) {
            return NextResponse.json({
                verified: false,
                success: false,
                error: 'Missing order identifier',
                redirectTo: 'error',
                reason: 'missing_order_id',
            });
        }

        // Verify HMAC (optional in dev mode if secret not configured)
        const hmacValid = verifyRedirectHmac(params, hmac);

        if (!hmacValid && PAYMOB_HMAC_SECRET) {
            console.error('❌ Payment return HMAC verification failed');
            return NextResponse.json({
                verified: false,
                success: false,
                error: 'HMAC verification failed',
                redirectTo: 'error',
                reason: 'hmac_invalid',
            });
        }

        // Connect to database and find order
        await connectToDatabase();

        // Find order by our order ID or Paymob order ID
        let order = null;
        if (merchantOrderId) {
            order = await Order.findById(merchantOrderId);
        }
        if (!order && paymobOrderId) {
            order = await Order.findOne({ paymobOrderId: paymobOrderId });
        }

        if (!order) {
            return NextResponse.json({
                verified: true,
                success: false,
                error: 'Order not found',
                redirectTo: 'error',
                reason: 'order_not_found',
            });
        }

        // Determine final status
        let status: 'pending' | 'paid' | 'failed' = 'failed';
        if (success && !isPending) {
            status = 'paid';
        } else if (isPending) {
            status = 'pending';
        }

        // Check for transaction response codes that indicate decline
        const declineReasons: Record<string, string> = {
            'DECLINED': 'card_declined',
            'INSUFFICIENT_FUNDS': 'insufficient_funds',
            'EXPIRED_CARD': 'expired_card',
        };
        const reason = declineReasons[txnResponseCode] || (status === 'failed' ? 'payment_failed' : undefined);

        // Idempotency: Don't downgrade from 'paid' status
        if (order.status !== 'paid') {
            order.status = status;
            if (transactionId) {
                order.transactionId = transactionId;
            }
            await order.save();
            console.log(`✅ Order ${order._id} status updated to: ${status}`);
        }

        // Create/update transaction record if we have transaction data
        if (transactionId) {
            const existingTxn = await Transaction.findOne({ paymobTxnId: transactionId });
            if (!existingTxn) {
                await Transaction.create({
                    orderId: order._id,
                    paymobTxnId: transactionId,
                    amount: amountCents / 100,
                    currency,
                    success: status === 'paid',
                    pending: status === 'pending',
                    responseData: Object.fromEntries(params.entries()),
                    errorMessage: txnResponseCode !== '0' ? txnResponseCode : undefined,
                });
            }
        }

        return NextResponse.json({
            verified: true,
            success: status === 'paid',
            pending: status === 'pending',
            orderId: order._id.toString(),
            transactionId: transactionId || undefined,
            status,
            redirectTo: status === 'paid' || status === 'pending' ? 'success' : 'error',
            reason,
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({
            verified: false,
            success: false,
            error: error instanceof Error ? error.message : 'Verification failed',
            redirectTo: 'error',
            reason: 'server_error',
        });
    }
}

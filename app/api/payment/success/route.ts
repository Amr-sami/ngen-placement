import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/lib/models/Order';

/**
 * GET /api/payment/success
 * 
 * Handle Paymob redirect after payment completion
 * 
 * This endpoint is called when Paymob redirects the user back to our site
 * after completing (or failing) a payment on the iframe.
 * 
 * Query Parameters from Paymob:
 * - id: Transaction ID
 * - pending: Whether the transaction is pending
 * - success: Whether the transaction was successful
 * - order: Paymob order ID
 * - hmac: HMAC signature (optional)
 * - integration_id: Integration used
 * 
 * Note: This is separate from the webhook. The webhook handles the actual
 * status update, this just redirects the user to the appropriate page.
 */

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        // Extract Paymob redirect parameters
        const transactionId = searchParams.get('id');
        const pending = searchParams.get('pending') === 'true';
        const success = searchParams.get('success') === 'true';
        const paymobOrderId = searchParams.get('order');
        const errorMessage = searchParams.get('data.message') || searchParams.get('error_message');

        // Determine the base URL for redirects
        const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';

        // If we don't have essential parameters, redirect to error page
        if (!paymobOrderId) {
            const errorUrl = new URL('/en/payment/error', appBaseUrl);
            errorUrl.searchParams.set('reason', 'missing_order_id');
            return NextResponse.redirect(errorUrl);
        }

        // Connect to database and find the order
        await connectToDatabase();
        const order = await Order.findOne({ paymobOrderId });

        // Build redirect URL based on payment result
        if (success && !pending) {
            // Payment successful
            const successUrl = new URL('/en/payment/success', appBaseUrl);
            successUrl.searchParams.set('orderId', order?._id.toString() || paymobOrderId);
            if (transactionId) {
                successUrl.searchParams.set('txnId', transactionId);
            }
            return NextResponse.redirect(successUrl);
        } else if (pending) {
            // Payment pending (e.g., 3D Secure verification)
            const pendingUrl = new URL('/en/payment/success', appBaseUrl);
            pendingUrl.searchParams.set('orderId', order?._id.toString() || paymobOrderId);
            pendingUrl.searchParams.set('status', 'pending');
            return NextResponse.redirect(pendingUrl);
        } else {
            // Payment failed
            const errorUrl = new URL('/en/payment/error', appBaseUrl);
            errorUrl.searchParams.set('orderId', order?._id.toString() || paymobOrderId);
            if (errorMessage) {
                errorUrl.searchParams.set('reason', errorMessage);
            } else {
                errorUrl.searchParams.set('reason', 'payment_failed');
            }
            return NextResponse.redirect(errorUrl);
        }
    } catch (error) {
        console.error('Payment success redirect error:', error);

        const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
        const errorUrl = new URL('/en/payment/error', appBaseUrl);
        errorUrl.searchParams.set('reason', 'server_error');
        return NextResponse.redirect(errorUrl);
    }
}

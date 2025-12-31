import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Transaction from '@/lib/models/Transaction';
import {
    verifyWebhookHmac,
    mapPaymobStatus,
    PaymobWebhookPayload,
} from '@/lib/paymob';
import { sendPaymentEmail, sendAdminEmail } from '@/lib/email/send';
import { paymentSuccessTemplate } from '@/lib/email/templates/payment-success';
import { paymentFailedTemplate } from '@/lib/email/templates/payment-failed';
import { adminNotificationTemplate, getAdminNotificationSubject } from '@/lib/email/templates/admin-notification';

/**
 * POST /api/webhooks/paymob
 * 
 * Handle Paymob payment webhooks (transaction callbacks)
 * 
 * This endpoint is called by Paymob after each payment attempt.
 * It verifies the HMAC signature, updates the order status, and sends appropriate emails.
 * 
 * Webhook setup in Paymob Dashboard:
 * 1. Go to Developers > Transaction Callbacks
 * 2. Set callback URL to: https://yourdomain.com/api/webhooks/paymob
 * 3. Enable HMAC validation
 * 
 * @see https://docs.paymob.com/docs/transaction-callbacks
 */

export async function POST(request: NextRequest) {
    try {
        // Parse webhook payload
        const payload: PaymobWebhookPayload = await request.json();

        // Get HMAC from query params or headers
        // Paymob typically sends HMAC as 'hmac' query parameter
        const url = new URL(request.url);
        const receivedHmac =
            url.searchParams.get('hmac') ||
            request.headers.get('x-paymob-hmac') ||
            payload.hmac ||
            '';

        // Verify HMAC signature
        if (!verifyWebhookHmac(payload, receivedHmac)) {
            console.error('❌ Paymob webhook HMAC verification failed');
            return NextResponse.json(
                { error: 'Invalid HMAC signature' },
                { status: 401 }
            );
        }

        console.log('✅ Paymob webhook HMAC verified');

        // Extract transaction data
        const txnData = payload.obj;
        const paymobOrderId = txnData.order.id.toString();
        const paymobTxnId = txnData.id.toString();
        const amountCents = txnData.amount_cents;
        const amount = amountCents / 100;
        const currency = txnData.currency || 'EGP';

        // Map Paymob status to our status
        const { success, pending, status } = mapPaymobStatus(payload);

        // Connect to database
        await connectToDatabase();

        // Find the order by Paymob order ID
        const order = await Order.findOne({ paymobOrderId });

        if (!order) {
            console.error(`Order not found for Paymob order ID: ${paymobOrderId}`);
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Create transaction record (for audit trail)
        const existingTxn = await Transaction.findOne({ paymobTxnId });

        if (!existingTxn) {
            await Transaction.create({
                orderId: order._id,
                paymobTxnId,
                amount,
                currency,
                success,
                pending,
                responseData: txnData,
                errorMessage: txnData.data?.message,
            });
        }

        // Idempotency: Don't downgrade status from 'paid'
        if (order.status === 'paid') {
            console.log(`Order ${order._id} is already paid, skipping update`);
            return NextResponse.json({
                success: true,
                message: 'Order already processed'
            });
        }

        // Update order status
        const previousStatus = order.status;
        order.status = status;
        order.transactionId = paymobTxnId;
        await order.save();

        console.log(`Order ${order._id} status updated: ${previousStatus} -> ${status}`);

        // Get product name from metadata or generate fallback
        const productName = (order.metadata as Record<string, unknown>)?.beltName as string || 'Course Purchase';

        // Send appropriate emails based on status
        if (status === 'paid') {
            // Send success email to customer
            sendPaymentEmail({
                to: order.customerEmail,
                subject: `Payment Successful - Order #${order._id.toString().slice(-8)}`,
                html: paymentSuccessTemplate({
                    customerName: order.customerName,
                    orderId: order._id.toString().slice(-8),
                    productName,
                    amount,
                    currency,
                    transactionId: paymobTxnId,
                }),
            }).catch(err => console.error('Failed to send success email:', err));

            // Notify admin
            sendAdminEmail({
                subject: getAdminNotificationSubject('payment_success', order._id.toString().slice(-8)),
                html: adminNotificationTemplate({
                    type: 'payment_success',
                    orderId: order._id.toString().slice(-8),
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    customerPhone: order.customerPhone,
                    productName,
                    amount,
                    currency,
                    transactionId: paymobTxnId,
                    timestamp: new Date(),
                }),
            }).catch(err => console.error('Failed to send admin notification:', err));

            // TODO: Grant access to the course/belt for the user
            // This could be done by:
            // 1. Creating a UserBelt/Enrollment record
            // 2. Updating user's purchasedBelts array
            // 3. Triggering a webhook to your LMS

        } else if (status === 'failed') {
            // Send failure email to customer
            sendPaymentEmail({
                to: order.customerEmail,
                subject: `Payment Failed - Order #${order._id.toString().slice(-8)}`,
                html: paymentFailedTemplate({
                    customerName: order.customerName,
                    orderId: order._id.toString().slice(-8),
                    productName,
                    amount,
                    currency,
                    errorMessage: txnData.data?.message,
                }),
            }).catch(err => console.error('Failed to send failure email:', err));

            // Notify admin
            sendAdminEmail({
                subject: getAdminNotificationSubject('payment_failed', order._id.toString().slice(-8)),
                html: adminNotificationTemplate({
                    type: 'payment_failed',
                    orderId: order._id.toString().slice(-8),
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    customerPhone: order.customerPhone,
                    productName,
                    amount,
                    currency,
                    errorMessage: txnData.data?.message,
                    timestamp: new Date(),
                }),
            }).catch(err => console.error('Failed to send admin notification:', err));
        }

        return NextResponse.json({
            success: true,
            orderId: order._id.toString(),
            status,
        });

    } catch (error) {
        console.error('Paymob webhook error:', error);

        // Always return 200 to Paymob to prevent retries for application errors
        // Log the error for debugging
        return NextResponse.json(
            {
                success: false,
                error: 'Webhook processing error',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 200 } // Return 200 to stop Paymob retries
        );
    }
}

/**
 * GET /api/webhooks/paymob
 * 
 * Health check endpoint for Paymob webhook verification
 */
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Paymob webhook endpoint is active',
        timestamp: new Date().toISOString(),
    });
}

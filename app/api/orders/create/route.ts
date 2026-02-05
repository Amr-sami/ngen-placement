import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import Belt from '@/lib/models/Belt';
import Order from '@/lib/models/Order';
import {
    createPaymentIntention,
    getUnifiedCheckoutUrl,
    isPaymobConfigured,
    PaymobError,
    BillingData,
} from '@/lib/paymob';
import { sendPaymentEmail, sendAdminEmail } from '@/lib/email/send';
import { orderConfirmationTemplate } from '@/lib/email/templates/order-confirmation';
import { adminNotificationTemplate, getAdminNotificationSubject } from '@/lib/email/templates/admin-notification';
import { getLocalizedValue } from '@/lib/localization';

/**
 * POST /api/orders/create
 * 
 * Create a new order and initiate Paymob Unified Checkout (Intention API) flow.
 * Migrated from legacy initiatePayment flow for a more modern checkout experience.
 * 
 * Request Body:
 * - beltId: string (required) - MongoDB ObjectId of the belt to purchase
 * - customerName: string (required) - Full name of the customer
 * - customerEmail: string (required) - Customer email
 * - customerPhone: string (required) - Customer phone number
 * - paymentMethod: 'card' | 'wallet' (optional, default: 'card')
 * - currency: 'EGP' | 'USD' (optional, default: 'EGP')
 * 
 * Response:
 * - orderId: string - Local order ID
 * - iframeUrl: string - Paymob payment iframe URL
 * - amount: number - Order amount
 * - currency: string - Currency code
 */

// Request validation schema
const createOrderSchema = z.object({
    beltId: z.string().min(1, 'Belt ID is required'),
    customerName: z.string().min(2, 'Name must be at least 2 characters'),
    customerEmail: z.string().email('Invalid email address'),
    customerPhone: z.string().min(10, 'Phone must be at least 10 digits'),
    paymentMethod: z.enum(['card', 'wallet']).optional().default('card'),
    currency: z.enum(['EGP', 'USD']).optional().default('EGP'),
    // Country code for billing (detected from user's location)
    countryCode: z.string().length(2).optional().default('EG'),
    // Optional: if user is logged in
    userId: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        // Check if Paymob is configured
        if (!isPaymobConfigured()) {
            return NextResponse.json(
                {
                    error: 'Payment gateway not configured',
                    message: 'Paymob credentials are not set. Please configure the payment gateway.',
                },
                { status: 503 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validationResult = createOrderSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const {
            beltId,
            customerName,
            customerEmail,
            customerPhone,
            paymentMethod,
            currency,
            countryCode,
            userId,
        } = validationResult.data;

        // Connect to database
        await connectToDatabase();

        // Fetch the belt/product
        const belt = await Belt.findById(beltId);

        if (!belt) {
            return NextResponse.json(
                { error: 'Belt not found' },
                { status: 404 }
            );
        }

        // Calculate amount based on currency
        const amount = currency === 'USD' ? belt.basePriceUSD : belt.basePriceEGP;
        const amountCents = Math.round(amount * 100);

        // Split customer name into first and last name
        const nameParts = customerName.trim().split(' ');
        const firstName = nameParts[0] || 'Customer';
        const lastName = nameParts.slice(1).join(' ') || 'Customer';

        // Prepare billing data for Paymob (use detected country code)
        const billingData: BillingData = {
            first_name: firstName,
            last_name: lastName,
            email: customerEmail,
            phone_number: customerPhone,
            country: countryCode.toUpperCase(), // Use country from request
        };

        // Create local order (pending status)
        const beltNameEn = getLocalizedValue(belt.name, 'en');
        const order = await Order.create({
            userId: userId || undefined,
            beltId: belt._id,
            amount,
            currency,
            status: 'pending',
            paymentMethod,
            customerName,
            customerEmail,
            customerPhone,
            metadata: {
                beltName: beltNameEn,
                beltCode: belt.code,
            },
        });

        // Initiate Paymob Unified Checkout (Intention API)
        const integrationId = paymentMethod === 'wallet'
            ? process.env.PAYMOB_INTEGRATION_ID_WALLET
            : process.env.PAYMOB_INTEGRATION_ID_CARD;

        if (!integrationId) {
            throw new Error(`Integration ID for ${paymentMethod} not found`);
        }

        const intention = await createPaymentIntention({
            amountCents,
            currency,
            paymentMethods: [parseInt(integrationId, 10)],
            billingData,
            specialReference: order._id.toString(),
            items: [
                {
                    name: beltNameEn,
                    amount_cents: amountCents,
                    description: `NGen Schools - ${beltNameEn} Belt`,
                    quantity: 1,
                },
            ],
        });

        // Update order with Paymob order ID/Intention ID
        order.paymobOrderId = intention.id.toString();
        await order.save();

        const iframeUrl = getUnifiedCheckoutUrl(intention.client_secret);

        // Send order confirmation email (async, don't wait)
        sendPaymentEmail({
            to: customerEmail,
            subject: `Order Confirmation - #${order._id.toString().slice(-8)}`,
            html: orderConfirmationTemplate({
                customerName,
                orderId: order._id.toString().slice(-8),
                productName: beltNameEn,
                amount,
                currency,
                orderDate: new Date(),
            }),
        }).catch(err => console.error('Failed to send confirmation email:', err));

        // Notify admin (async, don't wait)
        sendAdminEmail({
            subject: getAdminNotificationSubject('new_order', order._id.toString().slice(-8)),
            html: adminNotificationTemplate({
                type: 'new_order',
                orderId: order._id.toString().slice(-8),
                customerName,
                customerEmail,
                customerPhone,
                productName: beltNameEn,
                amount,
                currency,
                timestamp: new Date(),
            }),
        }).catch(err => console.error('Failed to send admin notification:', err));

        // Return success response
        return NextResponse.json({
            success: true,
            orderId: order._id.toString(),
            paymobOrderId: intention.id,
            iframeUrl: iframeUrl,
            amount,
            currency,
        });

    } catch (error) {
        console.error('Order creation error:', error);

        if (error instanceof PaymobError) {
            return NextResponse.json(
                {
                    error: 'Payment gateway error',
                    message: error.message,
                    details: error.responseData,
                },
                { status: 502 }
            );
        }

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Validation error',
                    details: error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: 'Failed to create order',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

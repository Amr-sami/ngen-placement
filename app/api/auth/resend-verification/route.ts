import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import VerificationToken, { generateVerificationToken } from '@/lib/models/VerificationToken';
import { sendVerificationEmail } from '@/lib/email';

// Rate limiting: simple in-memory store (use Redis in production)
const resendAttempts = new Map<string, { count: number; lastAttempt: Date }>();
const MAX_RESEND_ATTEMPTS = 3;
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const lowerEmail = email.toLowerCase();

        // Check rate limiting
        const attempts = resendAttempts.get(lowerEmail);
        if (attempts) {
            const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();

            if (timeSinceLastAttempt < RESEND_COOLDOWN_MS) {
                const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - timeSinceLastAttempt) / 1000);
                return NextResponse.json(
                    { error: `Please wait ${waitSeconds} seconds before requesting another email` },
                    { status: 429 }
                );
            }

            if (attempts.count >= MAX_RESEND_ATTEMPTS && timeSinceLastAttempt < 60 * 60 * 1000) {
                return NextResponse.json(
                    { error: 'Too many resend attempts. Please try again later.' },
                    { status: 429 }
                );
            }
        }

        await connectToDatabase();

        // Find the user
        const user = await User.findOne({ email: lowerEmail });

        if (!user) {
            // Return success even if user not found to prevent email enumeration
            return NextResponse.json(
                {
                    success: true,
                    message: 'If an account exists with this email, a verification link has been sent.',
                },
                { status: 200 }
            );
        }

        if (user.emailVerified) {
            return NextResponse.json(
                { error: 'Email is already verified' },
                { status: 400 }
            );
        }

        // Delete any existing tokens
        await VerificationToken.deleteMany({ email: lowerEmail });

        // Create new verification token
        const token = generateVerificationToken();
        await VerificationToken.create({
            email: lowerEmail,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });

        // Send verification email
        const emailResult = await sendVerificationEmail(
            lowerEmail,
            token,
            user.profile.firstName
        );

        if (!emailResult.success) {
            console.error('Failed to send verification email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send verification email. Please try again.' },
                { status: 500 }
            );
        }

        // Update rate limiting
        resendAttempts.set(lowerEmail, {
            count: (attempts?.count || 0) + 1,
            lastAttempt: new Date(),
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Verification email sent successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

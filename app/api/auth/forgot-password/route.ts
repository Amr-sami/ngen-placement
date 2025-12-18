import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import PasswordResetToken, { generatePasswordResetToken } from '@/lib/models/PasswordResetToken';
import { sendPasswordResetEmail } from '@/lib/email';

// Rate limiting: simple in-memory store (use Redis in production)
const resetAttempts = new Map<string, { count: number; lastAttempt: Date }>();
const MAX_RESET_ATTEMPTS = 3;
const RESET_COOLDOWN_MS = 60 * 1000; // 1 minute

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
        const attempts = resetAttempts.get(lowerEmail);
        if (attempts) {
            const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();

            if (timeSinceLastAttempt < RESET_COOLDOWN_MS) {
                const waitSeconds = Math.ceil((RESET_COOLDOWN_MS - timeSinceLastAttempt) / 1000);
                return NextResponse.json(
                    { error: `Please wait ${waitSeconds} seconds before requesting another reset` },
                    { status: 429 }
                );
            }

            if (attempts.count >= MAX_RESET_ATTEMPTS && timeSinceLastAttempt < 60 * 60 * 1000) {
                return NextResponse.json(
                    { error: 'Too many reset attempts. Please try again later.' },
                    { status: 429 }
                );
            }
        }

        await connectToDatabase();

        // Find the user
        const user = await User.findOne({ email: lowerEmail });

        // Return success even if user not found to prevent email enumeration
        if (!user) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'If an account exists with this email, a password reset link has been sent.',
                },
                { status: 200 }
            );
        }

        // Check if user uses social login
        if (user.authProvider !== 'email') {
            return NextResponse.json(
                { error: `This account uses ${user.authProvider} login. Please use that method to sign in.` },
                { status: 400 }
            );
        }

        // Delete any existing reset tokens
        await PasswordResetToken.deleteMany({ email: lowerEmail });

        // Create new reset token
        const token = generatePasswordResetToken();
        await PasswordResetToken.create({
            email: lowerEmail,
            token,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        });

        // Send reset email
        const emailResult = await sendPasswordResetEmail(
            lowerEmail,
            token,
            user.profile.firstName
        );

        if (!emailResult.success) {
            console.error('Failed to send password reset email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send password reset email. Please try again.' },
                { status: 500 }
            );
        }

        // Update rate limiting
        resetAttempts.set(lowerEmail, {
            count: (attempts?.count || 0) + 1,
            lastAttempt: new Date(),
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Password reset email sent successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password reset request error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

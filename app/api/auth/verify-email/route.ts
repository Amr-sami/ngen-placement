import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import VerificationToken from '@/lib/models/VerificationToken';
import { hashToken } from '@/lib/auth/tokenHash';
import { getLocaleFromRequest } from '@/lib/requestLocale';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, token } = body;

        if (!email || !token) {
            return NextResponse.json(
                { error: 'Email and token are required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Find the verification token by hashed lookup
        const verificationToken = await VerificationToken.findOne({
            email: email.toLowerCase(),
            tokenHash: hashToken(token),
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        // Check if token is expired
        if (verificationToken.expiresAt < new Date()) {
            // Delete expired token
            await VerificationToken.deleteOne({ _id: verificationToken._id });
            return NextResponse.json(
                { error: 'Verification token has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Find and update the user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (user.emailVerified) {
            // Clean up the token even if already verified
            await VerificationToken.deleteOne({ _id: verificationToken._id });
            return NextResponse.json(
                {
                    success: true,
                    message: 'Email is already verified',
                    alreadyVerified: true,
                },
                { status: 200 }
            );
        }

        // Update user as verified and active
        user.emailVerified = true;
        user.status = 'active';
        await user.save();

        // Delete the used token
        await VerificationToken.deleteOne({ _id: verificationToken._id });

        return NextResponse.json(
            {
                success: true,
                message: 'Email verified successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET handler for verification via link
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const locale = getLocaleFromRequest(request);
    const verifyPath = `/${locale}/auth/verify-email`;

    if (!email || !token) {
        return NextResponse.redirect(
            new URL(`${verifyPath}?error=missing_params`, request.url)
        );
    }

    try {
        await connectToDatabase();

        // Find the verification token by hashed lookup
        const verificationToken = await VerificationToken.findOne({
            email: email.toLowerCase(),
            tokenHash: hashToken(token),
        });

        if (!verificationToken) {
            return NextResponse.redirect(
                new URL(`${verifyPath}?error=invalid_token`, request.url)
            );
        }

        // Check if token is expired
        if (verificationToken.expiresAt < new Date()) {
            await VerificationToken.deleteOne({ _id: verificationToken._id });
            return NextResponse.redirect(
                new URL(`${verifyPath}?error=expired_token`, request.url)
            );
        }

        // Find and update the user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.redirect(
                new URL(`${verifyPath}?error=user_not_found`, request.url)
            );
        }

        // Update user as verified and active
        user.emailVerified = true;
        user.status = 'active';
        await user.save();

        // Delete the used token
        await VerificationToken.deleteOne({ _id: verificationToken._id });

        // Redirect to success page
        return NextResponse.redirect(
            new URL(`${verifyPath}?success=true`, request.url)
        );
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.redirect(
            new URL(`${verifyPath}?error=server_error`, request.url)
        );
    }
}

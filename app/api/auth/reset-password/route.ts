import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import PasswordResetToken from '@/lib/models/PasswordResetToken';
import { hashToken } from '@/lib/auth/tokenHash';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, token, password } = body;

        if (!email || !token || !password) {
            return NextResponse.json(
                { error: 'Email, token, and new password are required' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Find the reset token by hashed lookup
        const resetToken = await PasswordResetToken.findOne({
            email: email.toLowerCase(),
            tokenHash: hashToken(token),
        });

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Check if token is expired
        if (resetToken.expiresAt < new Date()) {
            // Delete expired token
            await PasswordResetToken.deleteOne({ _id: resetToken._id });
            return NextResponse.json(
                { error: 'Reset token has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Find the user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Hash new password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Update user password
        user.passwordHash = passwordHash;
        await user.save();

        // Delete the used token
        await PasswordResetToken.deleteOne({ _id: resetToken._id });

        return NextResponse.json(
            {
                success: true,
                message: 'Password reset successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

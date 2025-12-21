import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

interface GrantAttemptBody {
    userId: string;
    extraAttempts: number;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is authenticated
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // TODO: Add proper admin role check when admin system is implemented
        // For now, check against admin email from env
        const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

        if (!adminEmails.includes(session.user.email.toLowerCase())) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        const body: GrantAttemptBody = await req.json();
        const { userId, extraAttempts } = body;

        if (!userId || typeof extraAttempts !== 'number' || extraAttempts < 1) {
            return NextResponse.json(
                { error: 'Valid userId and extraAttempts (minimum 1) are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find and update user
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Initialize placementTest if not exists
        if (!user.placementTest) {
            user.placementTest = {
                hasTakenAnyPlacementTest: false,
                allowedAttempts: 1,
                attemptsUsed: 0,
                extraAttemptsGrantedBySupport: 0,
            };
        }

        // Add extra attempts
        const currentExtra = user.placementTest.extraAttemptsGrantedBySupport || 0;
        user.placementTest.extraAttemptsGrantedBySupport = currentExtra + extraAttempts;

        await user.save();

        const totalAllowed = user.placementTest.allowedAttempts + user.placementTest.extraAttemptsGrantedBySupport;
        const remaining = totalAllowed - user.placementTest.attemptsUsed;

        return NextResponse.json({
            success: true,
            message: `Granted ${extraAttempts} extra attempt(s) to user`,
            data: {
                userId: user._id.toString(),
                email: user.email,
                totalAllowedAttempts: totalAllowed,
                attemptsUsed: user.placementTest.attemptsUsed,
                remainingAttempts: remaining,
            },
        });
    } catch (error) {
        console.error('Error granting extra attempts:', error);
        return NextResponse.json(
            { error: 'Failed to grant extra attempts' },
            { status: 500 }
        );
    }
}

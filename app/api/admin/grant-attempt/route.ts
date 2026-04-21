import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { requireSuperAdmin } from '@/lib/auth/adminAuth';

const GrantAttemptSchema = z.object({
    userId: z.string().trim().min(1).max(64),
    extraAttempts: z.number().int().min(1).max(100),
});

export async function POST(req: Request) {
    try {
        // requireSuperAdmin revalidates role+status against Mongo on every call
        // (never trusts a stale JWT claim) and redirects to 404 otherwise. It
        // throws via redirect() on non-admins, which Next.js handles correctly.
        await requireSuperAdmin();

        const rawBody = await req.json().catch(() => null);
        const parsed = GrantAttemptSchema.safeParse(rawBody);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: parsed.error.issues },
                { status: 400 }
            );
        }
        const { userId, extraAttempts } = parsed.data;

        await dbConnect();

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (!user.placementTest) {
            user.placementTest = {
                hasTakenAnyPlacementTest: false,
                allowedAttempts: 1,
                attemptsUsed: 0,
                technicalAttemptsUsed: 0,
                softSkillsAttemptsUsed: 0,
                extraAttemptsGrantedBySupport: 0,
            };
        }

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

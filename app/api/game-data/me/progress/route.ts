import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/authOptions';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';

// Hard caps on level/score so a tampered client can't write arbitrarily large
// numbers into the user document.
const ProgressSchema = z.object({
    level: z.number().int().min(1).max(999).optional(),
    score: z.number().int().min(0).max(1_000_000).optional(),
}).refine(v => v.level !== undefined || v.score !== undefined, {
    message: 'At least one of level or score is required',
});

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const rawBody = await req.json().catch(() => null);
        const parsed = ProgressSchema.safeParse(rawBody);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: parsed.error.issues },
                { status: 400 }
            );
        }
        const { level, score } = parsed.data;

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.gameProgress) {
            user.gameProgress = {
                level: 1,
                score: 0,
                lastPlayedAt: new Date()
            };
        }

        // Only update provided fields, or update both if provided
        if (typeof level === 'number') user.gameProgress.level = level;
        if (typeof score === 'number') user.gameProgress.score = score;
        user.gameProgress.lastPlayedAt = new Date();

        await user.save();

        return NextResponse.json({
            message: 'Game progress updated',
            level: user.gameProgress.level,
            score: user.gameProgress.score
        });
    } catch (error) {
        console.error('Error updating game progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

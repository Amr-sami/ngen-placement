import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { level, score } = body;

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

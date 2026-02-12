import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).select('email gameProgress');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if game progress exists (level > 0 or specific flag)
        // Based on schema default, it might be level 1, score 0 if initialized.
        // But if it's empty object or user never played, we might want to return 404 to trigger init flow.
        // However, schema default is level 1.
        // Let's assume if gameProgress is present, it's valid.

        if (!user.gameProgress || !user.gameProgress.lastPlayedAt) {
            // Treat as no progress found if lastPlayedAt is missing
            // This allows the init flow to run if needed, or we just return the defaults.
            // The requirement says "If not found -> 404".
            return NextResponse.json({ error: 'Game data not found' }, { status: 404 });
        }

        return NextResponse.json({
            email: user.email,
            level: user.gameProgress.level,
            score: user.gameProgress.score,
            lastPlayedAt: user.gameProgress.lastPlayedAt
        });
    } catch (error) {
        console.error('Error fetching game data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

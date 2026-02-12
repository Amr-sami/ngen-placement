import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Initialize user game progress
        user.gameProgress = {
            level: 1,
            score: 0,
            lastPlayedAt: new Date()
        };

        await user.save();

        return NextResponse.json({
            message: 'Game data initialized',
            level: 1,
            score: 0
        });
    } catch (error) {
        console.error('Error initializing game data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

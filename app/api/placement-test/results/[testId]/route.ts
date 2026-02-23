import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PlacementTest from '@/lib/models/PlacementTest';

interface RouteParams {
    params: Promise<{ testId: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { testId } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        await dbConnect();

        // Find user
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Find the test and verify ownership
        const test = await PlacementTest.findById(testId).lean();

        if (!test) {
            return NextResponse.json(
                { error: 'Test not found' },
                { status: 404 }
            );
        }

        // Check if user owns this test
        if (!test.userId || test.userId.toString() !== user._id.toString()) {
            return NextResponse.json(
                { error: 'Access denied' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            test: {
                id: test._id.toString(),
                attemptNumber: test.attemptNumber,
                status: test.status,
                scorePercent: test.scorePercent,
                resultBeltName: test.resultBeltName,
                trackName: test.trackName,
                questions: test.questions,
                startedAt: test.startedAt,
                completedAt: test.completedAt,
                createdAt: test.createdAt,
            },
        });
    } catch (error) {
        console.error('Error fetching placement test:', error);
        return NextResponse.json(
            { error: 'Failed to fetch test' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PlacementTest from '@/lib/models/PlacementTest';

export async function GET() {
    try {
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

        // Get all placement tests for this user
        const tests = await PlacementTest.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .lean();

        // Get user's attempt info
        const placementTestData = user.placementTest;
        const allowedAttempts = placementTestData?.allowedAttempts || 2;
        const attemptsUsed = placementTestData?.attemptsUsed || 0;
        const extraAttempts = placementTestData?.extraAttemptsGrantedBySupport || 0;

        return NextResponse.json({
            tests: tests.map(test => ({
                id: test._id.toString(),
                attemptNumber: test.attemptNumber,
                status: test.status,
                scorePercent: test.scorePercent,
                resultBeltName: test.resultBeltName,
                startedAt: test.startedAt,
                completedAt: test.completedAt,
                createdAt: test.createdAt,
            })),
            summary: {
                totalAttempts: attemptsUsed,
                allowedAttempts: allowedAttempts + extraAttempts,
                remainingAttempts: (allowedAttempts + extraAttempts) - attemptsUsed,
                lastResult: placementTestData?.resultBeltName ? {
                    beltName: placementTestData.resultBeltName,
                    scorePercent: placementTestData.resultScorePercent,
                    takenAt: placementTestData.takenAt,
                } : null,
            },
        });
    } catch (error) {
        console.error('Error fetching placement test results:', error);
        return NextResponse.json(
            { error: 'Failed to fetch results' },
            { status: 500 }
        );
    }
}

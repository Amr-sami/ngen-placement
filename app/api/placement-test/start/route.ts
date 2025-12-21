import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PlacementTest from '@/lib/models/PlacementTest';

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        // If not logged in, allow test but won't be saved to DB
        if (!session?.user?.email) {
            return NextResponse.json({
                canTake: true,
                isGuest: true,
                attemptNumber: 1,
                remainingAttempts: null,
                message: 'You can take the test as a guest. Login to save your results.',
            });
        }

        await dbConnect();

        // Find user and check attempts
        const user = await User.findOne({ email: session.user.email });

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
            await user.save();
        }

        const { allowedAttempts, attemptsUsed, extraAttemptsGrantedBySupport } = user.placementTest;
        const totalAllowed = allowedAttempts + (extraAttemptsGrantedBySupport || 0);
        const remainingAttempts = totalAllowed - attemptsUsed;

        if (remainingAttempts <= 0) {
            return NextResponse.json({
                canTake: false,
                isGuest: false,
                attemptNumber: attemptsUsed,
                remainingAttempts: 0,
                message: 'You have reached the maximum number of attempts. Contact admin for additional attempts.',
            });
        }

        // Create a new placement test record
        const newAttemptNumber = attemptsUsed + 1;

        const placementTest = await PlacementTest.create({
            userId: user._id,
            trackId: user._id, // Using user ID as placeholder, will be updated when test completes
            attemptNumber: newAttemptNumber,
            status: 'in_progress',
            startedAt: new Date(),
        });

        return NextResponse.json({
            canTake: true,
            isGuest: false,
            testId: placementTest._id.toString(),
            attemptNumber: newAttemptNumber,
            remainingAttempts: remainingAttempts - 1,
            message: `Starting attempt ${newAttemptNumber} of ${totalAllowed}`,
        });
    } catch (error) {
        console.error('Error in placement-test/start:', error);
        return NextResponse.json(
            { error: 'Failed to start placement test' },
            { status: 500 }
        );
    }
}

// GET method to check if user can take test without starting
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({
                canTake: true,
                isGuest: true,
                attemptsUsed: 0,
                remainingAttempts: null,
            });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const placementTestData = user.placementTest;
        const allowedAttempts = placementTestData?.allowedAttempts || 2;
        const attemptsUsed = placementTestData?.attemptsUsed || 0;
        const extraAttemptsGrantedBySupport = placementTestData?.extraAttemptsGrantedBySupport || 0;

        const totalAllowed = allowedAttempts + extraAttemptsGrantedBySupport;
        const remainingAttempts = totalAllowed - attemptsUsed;

        return NextResponse.json({
            canTake: remainingAttempts > 0,
            isGuest: false,
            attemptsUsed,
            totalAllowed,
            remainingAttempts,
            lastTestResult: placementTestData?.resultBeltName ? {
                beltName: placementTestData.resultBeltName,
                scorePercent: placementTestData.resultScorePercent,
                takenAt: placementTestData.takenAt,
            } : null,
        });
    } catch (error) {
        console.error('Error checking placement test status:', error);
        return NextResponse.json(
            { error: 'Failed to check test status' },
            { status: 500 }
        );
    }
}

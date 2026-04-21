import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PlacementTest from '@/lib/models/PlacementTest';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json().catch(() => ({}));
        const testType = body.testType || 'technical'; // 'technical' or 'soft_skills'

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
                technicalAttemptsUsed: 0,
                softSkillsAttemptsUsed: 0,
                extraAttemptsGrantedBySupport: 0,
            };
            await user.save();
        }

        const { allowedAttempts, extraAttemptsGrantedBySupport, technicalAttemptsUsed, softSkillsAttemptsUsed } = user.placementTest;

        // Check attempts based on test type
        const totalAllowed = allowedAttempts + (extraAttemptsGrantedBySupport || 0);
        const isTechnicalTest = testType === 'technical';
        const currentAttemptsUsed = isTechnicalTest ? technicalAttemptsUsed : softSkillsAttemptsUsed;
        const remainingAttempts = totalAllowed - currentAttemptsUsed;

        if (remainingAttempts <= 0) {
            return NextResponse.json({
                canTake: false,
                isGuest: false,
                attemptNumber: currentAttemptsUsed + 1,
                remainingAttempts: 0,
                testType,
                message: isTechnicalTest
                    ? 'You have reached the maximum number of technical test attempts. Contact admin for additional attempts.'
                    : 'You have reached the maximum number of soft skills test attempts. Contact admin for additional attempts.',
            });
        }

        // Create a new placement test record
        const newAttemptNumber = currentAttemptsUsed + 1;

        // trackId intentionally omitted — it was previously set to `user._id`
        // as a placeholder, which polluted the Track collection foreign-key
        // with user ids. Leave it null until we actually know the track.
        const placementTest = await PlacementTest.create({
            userId: user._id,
            attemptNumber: newAttemptNumber,
            testType,
            status: 'in_progress',
            startedAt: new Date(),
        });

        return NextResponse.json({
            canTake: true,
            isGuest: false,
            testId: placementTest._id.toString(),
            attemptNumber: newAttemptNumber,
            remainingAttempts: remainingAttempts - 1,
            testType,
            message: `Starting ${testType === 'technical' ? 'technical' : 'soft skills'} attempt ${newAttemptNumber} of ${totalAllowed}`,
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
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(req.url);
        const testType = searchParams.get('testType') || 'technical';

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
        const technicalAttemptsUsed = placementTestData?.technicalAttemptsUsed || 0;
        const softSkillsAttemptsUsed = placementTestData?.softSkillsAttemptsUsed || 0;
        const extraAttemptsGrantedBySupport = placementTestData?.extraAttemptsGrantedBySupport || 0;

        const totalAllowed = allowedAttempts + extraAttemptsGrantedBySupport;

        // Check attempts based on test type
        const isTechnicalTest = testType === 'technical';
        const currentAttemptsUsed = isTechnicalTest ? technicalAttemptsUsed : softSkillsAttemptsUsed;
        const remainingAttempts = totalAllowed - currentAttemptsUsed;

        return NextResponse.json({
            canTake: remainingAttempts > 0,
            isGuest: false,
            attemptsUsed: currentAttemptsUsed,
            totalAllowed,
            remainingAttempts,
            technicalAttemptsUsed,
            softSkillsAttemptsUsed,
            lastTestResult: placementTestData?.resultBeltName ? {
                beltName: placementTestData.resultBeltName,
                scorePercent: placementTestData.resultScorePercent,
                takenAt: placementTestData.takenAt,
            } : null,
            hasTakenSoftSkillsTest: placementTestData?.hasTakenSoftSkillsTest || false,
            hasTakenTechnicalTest: placementTestData?.hasTakenAnyPlacementTest || false,
        });
    } catch (error) {
        console.error('Error checking placement test status:', error);
        return NextResponse.json(
            { error: 'Failed to check test status' },
            { status: 500 }
        );
    }
}

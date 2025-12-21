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

        const user = await User.findOne({ email: session.user.email }).select(
            '-passwordHash'
        );

        console.log('Profile API - User found:', {
            email: user?.email,
            hasPlacementTest: !!user?.placementTest,
            placementTest: user?.placementTest
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Fetch the detailed placement test document if available
        let detailedTest = null;
        if (user.placementTest?.lastPlacementTestId) {
            const test = await PlacementTest.findById(user.placementTest.lastPlacementTestId).lean();
            if (test && test.questions) {
                const calculatedScore = test.questions.reduce((acc: number, q: { points?: number }) => acc + (q.points || 0), 0);
                detailedTest = {
                    score: calculatedScore,
                    totalQuestions: test.questions.length
                };
            }
        }

        // Format the response
        const profileData = {
            id: user._id.toString(),
            email: user.email,
            emailVerified: user.emailVerified,
            authProvider: user.authProvider,
            role: user.role,
            status: user.status,
            profile: {
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                fullName: user.profile.fullName,
                phoneNumber: user.profile.phoneNumber,
                parentPhoneNumber: user.profile.parentPhoneNumber,
                age: user.profile.age,
                address: user.profile.address,
                joinType: user.profile.joinType,
                organizationName: user.profile.organizationName,
                howDidYouKnowNgen: user.profile.howDidYouKnowNgen,
                avatarUrl: user.profile.avatarUrl,
            },
            placementTest: user.placementTest ? {
                hasTakenTest: user.placementTest.hasTakenAnyPlacementTest,
                attemptsUsed: user.placementTest.attemptsUsed,
                allowedAttempts: user.placementTest.allowedAttempts,
                extraAttempts: user.placementTest.extraAttemptsGrantedBySupport || 0,
                remainingAttempts: (user.placementTest.allowedAttempts + (user.placementTest.extraAttemptsGrantedBySupport || 0)) - user.placementTest.attemptsUsed,
                resultBeltName: user.placementTest.resultBeltName,
                resultScorePercent: user.placementTest.resultScorePercent,
                resultScore: detailedTest?.score || 0,
                resultTotalQuestions: detailedTest?.totalQuestions || 0,
                takenAt: user.placementTest.takenAt,
            } : null,
            progress: user.progress ? {
                currentTrackName: user.progress.currentTrackName,
                currentBeltName: user.progress.currentBeltName,
                beltLevel: user.progress.beltLevel,
                trackStartedAt: user.progress.trackStartedAt,
                completedBeltsCount: user.progress.completedBelts?.length || 0,
            } : null,
            memberSince: user.createdAt,
            lastLoginAt: user.lastLoginAt,
        };

        return NextResponse.json(profileData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

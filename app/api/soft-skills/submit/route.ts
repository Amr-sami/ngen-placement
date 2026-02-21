
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PlacementTest from '@/lib/models/PlacementTest';
import { SoftSkillsEvaluator } from '@/lib/soft-skills/evaluator';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { ageGroup, answers } = body; // answers: { [questionId]: optionIndex }

        if (!ageGroup || !answers) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Run evaluation
        const evaluator = new SoftSkillsEvaluator(ageGroup);
        const evaluationResult = evaluator.evaluate(
            {
                name: user.profile.firstName,
                age: user.profile.age
            },
            answers
        );

        // Create PlacementTest record
        const placementTest = await PlacementTest.create({
            userId: user._id,
            trackId: user._id, // Placeholder, soft skills isn't tied to a track really
            attemptNumber: 1, // Soft skills is usually once-off or handled differently
            testType: 'soft_skills',
            status: 'completed',
            scorePercent: 0, // No pass/fail score
            questions: Object.entries(answers).map(([qid, optIdx]) => ({
                questionId: qid,
                selectedOptionId: String(optIdx),
                isCorrect: true // No right/wrong answer
            })),
            detailedEvaluation: evaluationResult,
            startedAt: new Date(), // Approximate
            completedAt: new Date(),
        });

        // Update User - increment soft skills attempts
        const currentSoftSkillsAttempts = user.placementTest?.softSkillsAttemptsUsed || 0;
        await User.findByIdAndUpdate(user._id, {
            $set: {
                'placementTest.hasTakenSoftSkillsTest': true,
                'placementTest.softSkillsTestId': placementTest._id,
                'placementTest.softSkillsAttemptsUsed': currentSoftSkillsAttempts + 1,
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Assessment completed successfully',
            data: {
                testId: placementTest._id,
                evaluation: evaluationResult
            }
        });

    } catch (error) {
        console.error('Error submitting soft skills assessment:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

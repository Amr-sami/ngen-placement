
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

        const body = await req.json();
        const { ageGroup, surveyData, answers } = body; // answers: { [questionId]: optionIndex }

        if (!ageGroup || !answers) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await dbConnect();
        let user = null;
        if (session?.user?.email) {
            user = await User.findOne({ email: session.user.email });
        }

        const resolvedSurveyData = surveyData || {};
        const guestDetails = !user ? {
            name: resolvedSurveyData.name,
            email: resolvedSurveyData.email,
            phone: resolvedSurveyData.phone,
            age: resolvedSurveyData.age,
            country: resolvedSurveyData.country,
            city: resolvedSurveyData.city,
            schoolName: resolvedSurveyData.schoolName,
            preferredHouse: resolvedSurveyData.preferredHouse,
            techExperience: resolvedSurveyData.techExperience,
            heardAboutUs: resolvedSurveyData.heardAboutUs,
        } : undefined;

        // Run evaluation
        const evaluator = new SoftSkillsEvaluator(ageGroup);
        const evaluationResult = evaluator.evaluate(
            {
                name: user ? user.profile.firstName : (guestDetails?.name || 'Guest'),
                age: user ? user.profile.age : (guestDetails?.age || ageGroup)
            },
            answers
        );

        // Create PlacementTest record
        const placementTest = await PlacementTest.create({
            userId: user?._id || null,
            trackId: user?._id || null, // Placeholder, soft skills isn't tied to a track really
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
            guestDetails,
            startedAt: new Date(), // Approximate
            completedAt: new Date(),
        });

        if (user) {
            // Update User - increment soft skills attempts
            const currentSoftSkillsAttempts = user.placementTest?.softSkillsAttemptsUsed || 0;
            await User.findByIdAndUpdate(user._id, {
                $set: {
                    'placementTest.hasTakenSoftSkillsTest': true,
                    'placementTest.softSkillsTestId': placementTest._id,
                    'placementTest.softSkillsAttemptsUsed': currentSoftSkillsAttempts + 1,
                }
            });
        }

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

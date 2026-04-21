import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PlacementTest from '@/lib/models/PlacementTest';
import { SoftSkillsEvaluator } from '@/lib/soft-skills/evaluator';

const SoftSkillsSubmitSchema = z.object({
    ageGroup: z.enum(['6-9', '10-14', '15-18']),
    answers: z.record(
        z.string().regex(/^\d{1,4}$/),
        z.number().int().min(0).max(9)
    ),
    surveyData: z
        .object({
            name: z.string().trim().max(120).optional(),
            email: z.string().trim().email().max(200).optional().or(z.literal('')),
            phone: z.string().trim().max(40).optional(),
            age: z.string().trim().max(16).optional(),
            country: z.string().trim().max(80).optional(),
            city: z.string().trim().max(80).optional(),
            schoolName: z.string().trim().max(200).optional(),
            preferredHouse: z.string().trim().max(60).optional(),
            techExperience: z.string().trim().max(200).optional(),
            heardAboutUs: z.string().trim().max(200).optional(),
        })
        .partial()
        .optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        const rawBody = await req.json().catch(() => null);
        const parsed = SoftSkillsSubmitSchema.safeParse(rawBody);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: parsed.error.issues },
                { status: 400 }
            );
        }
        const { ageGroup, answers, surveyData } = parsed.data;

        await dbConnect();
        let user = null;
        if (session?.user?.email) {
            user = await User.findOne({ email: session.user.email });
        }

        const resolvedSurveyData = surveyData || {};
        const guestDetails = !user ? {
            name: resolvedSurveyData.name,
            email: resolvedSurveyData.email || undefined,
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
            attemptNumber: 1,
            testType: 'soft_skills',
            status: 'completed',
            scorePercent: 0,
            questions: Object.entries(answers).map(([qid, optIdx]) => ({
                questionId: qid,
                selectedOptionId: String(optIdx),
                isCorrect: true
            })),
            detailedEvaluation: evaluationResult,
            guestDetails,
            startedAt: new Date(),
            completedAt: new Date(),
        });

        if (user) {
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

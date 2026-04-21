import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PlacementTest from '@/lib/models/PlacementTest';
import {
    hashLeadToken,
    parseLeadTokenFromHeader,
    clearLeadCookie,
} from '@/lib/placement-test/leadToken';

// Bounded survey fields — used only for populating guestDetails on the saved
// row. We accept optional/empty because sales still wants partial leads.
const SurveySchema = z
    .object({
        name: z.string().trim().max(120).optional(),
        age: z.string().trim().max(16).optional(),
        country: z.string().trim().max(80).optional(),
        city: z.string().trim().max(80).optional(),
        schoolName: z.string().trim().max(200).optional(),
        preferredHouse: z.string().trim().max(60).optional(),
        techExperience: z.string().trim().max(200).optional(),
        techDetails: z.string().trim().max(1000).optional(),
        heardAboutUs: z.string().trim().max(200).optional(),
        phone: z.string().trim().max(40).optional(),
        email: z.string().trim().email().max(200).optional().or(z.literal('')),
    })
    .partial()
    .optional();

// We do NOT trust anything about the questions or the score from the client.
// The only client-controlled field we read during scoring is selectedAnswers
// (nullable ints into the options array) and the testId. Everything else on
// the payload is historical/UI metadata that we either overwrite or ignore.
const SubmitSchema = z.object({
    testId: z.string().trim().min(1).max(64),
    surveyData: SurveySchema,
    selectedAnswers: z
        .array(z.number().int().min(0).max(20).nullable())
        .min(1)
        .max(200),
    track: z.string().trim().max(64).optional(),
});

const TRACK_NAME_MAP: Record<string, string> = {
    data_science: 'AI & Data Science',
    computer_fundamentals: 'Computer Fundamentals',
    cybersecurity: 'Cybersecurity',
    data_analysis: 'Data Analysis',
    python_programming: 'Python Programming',
    robotics: 'Robotics',
    general: 'General Placement',
};

export async function POST(req: Request) {
    try {
        const rawBody = await req.json().catch(() => null);
        const parsed = SubmitSchema.safeParse(rawBody);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: parsed.error.issues },
                { status: 400 }
            );
        }
        const { testId, surveyData, selectedAnswers, track } = parsed.data;

        await dbConnect();

        // Load the test including the server-stored answer key + leadTokenHash
        // (both marked select:false in the schema).
        const existingTest = await PlacementTest.findById(testId).select(
            '+generatedQuestions +leadTokenHash'
        );

        if (!existingTest) {
            return NextResponse.json(
                { error: 'Test not found' },
                { status: 404 }
            );
        }

        // Ownership: the submitter must either be the authenticated user that
        // started the test, OR present the HttpOnly cookie whose hash matches
        // the leadTokenHash stored when the test was created. If neither holds
        // this is someone poking at another guest's testId.
        const session = await getServerSession(authOptions);
        let user = null;
        if (session?.user?.email) {
            user = await User.findOne({ email: session.user.email });
        }

        const cookieToken = parseLeadTokenFromHeader(req.headers.get('cookie'));
        const cookieMatches =
            !!cookieToken &&
            !!existingTest.leadTokenHash &&
            hashLeadToken(cookieToken) === existingTest.leadTokenHash;

        const userMatches =
            !!user &&
            !!existingTest.userId &&
            existingTest.userId.toString() === user._id.toString();

        if (!userMatches && !cookieMatches) {
            return NextResponse.json(
                { error: 'Access denied' },
                { status: 403 }
            );
        }

        // Recompute score from the server-stored answer key.
        const generated: any[] = Array.isArray(existingTest.generatedQuestions)
            ? (existingTest.generatedQuestions as any[])
            : [];

        if (generated.length === 0) {
            return NextResponse.json(
                { error: 'Test has no associated questions on the server' },
                { status: 500 }
            );
        }

        // Determine if this is a general (3-belt) test based on stored shape.
        const firstQ: any = generated[0];
        const hasBeltData = !!firstQ && (firstQ.belt === 'White' || firstQ.belt === 'Yellow' || firstQ.belt === 'Orange');
        const isGeneral = !track || track === 'general' || hasBeltData;

        let detailedEvaluation: any = null;
        let correctCount = 0;
        const answered = selectedAnswers.slice(0, generated.length);

        for (let i = 0; i < generated.length; i++) {
            const expected = generated[i]?.ans_idx;
            const picked = answered[i] ?? null;
            if (picked !== null && typeof expected === 'number' && picked === expected) {
                correctCount += 1;
            }
        }

        let scorePercent =
            generated.length > 0 ? Math.round((correctCount / generated.length) * 100) : 0;

        if (isGeneral) {
            const { evaluatePlacementTest } = await import('@/lib/placement-test/evaluator');
            const evaluationResult = evaluatePlacementTest(generated as any, answered);
            detailedEvaluation = evaluationResult;
            scorePercent = Math.round(evaluationResult.overall_readiness);
        }

        const trackName = isGeneral ? 'General Placement' : (TRACK_NAME_MAP[track || ''] || track || 'General Placement');

        const questionsData = generated.map((q: any, index: number) => ({
            questionId: `q_${index}`,
            selectedOptionId: answered[index] !== null && answered[index] !== undefined
                ? `opt_${answered[index]}`
                : '',
            isCorrect: answered[index] === q.ans_idx,
            points: answered[index] === q.ans_idx ? 1 : 0,
            belt: q.belt,
            difficulty: q.difficulty_level,
        }));

        const assignedBeltName =
            (isGeneral && detailedEvaluation?.assigned_belt)
                ? detailedEvaluation.assigned_belt
                : (existingTest.resultBeltName || 'White');

        const guestDetails = !user && surveyData
            ? {
                name: surveyData.name,
                email: surveyData.email || undefined,
                phone: surveyData.phone,
                age: surveyData.age,
                country: surveyData.country,
                city: surveyData.city,
                schoolName: surveyData.schoolName,
                preferredHouse: surveyData.preferredHouse,
                techExperience: surveyData.techExperience,
                heardAboutUs: surveyData.heardAboutUs,
            }
            : undefined;

        existingTest.status = 'completed';
        existingTest.scorePercent = scorePercent;
        existingTest.resultBeltName = assignedBeltName;
        existingTest.trackName = trackName;
        existingTest.questions = questionsData as any;
        existingTest.detailedEvaluation = detailedEvaluation;
        existingTest.completedAt = new Date();
        if (guestDetails) {
            existingTest.guestDetails = guestDetails;
        }
        // Consume the lead token on submit; the cookie gets cleared in the
        // response below. A replayed cookie against a completed test won't
        // match anymore, and the token can't be reused for a new test.
        existingTest.leadTokenHash = undefined;

        let currentTechnicalAttemptsUsed = 0;
        if (user) {
            currentTechnicalAttemptsUsed = user.placementTest?.technicalAttemptsUsed || 0;
        }

        // Atomically persist the completed test row and (for logged-in users)
        // the user's placementTest summary. Crashing between them could
        // otherwise leave a saved result without an updated attemptsUsed count.
        const dbSession = await mongoose.startSession();
        try {
            await dbSession.withTransaction(async () => {
                await existingTest.save({ session: dbSession });

                if (user) {
                    await User.findByIdAndUpdate(
                        user._id,
                        {
                            $set: {
                                'placementTest.hasTakenAnyPlacementTest': true,
                                'placementTest.lastPlacementTestId': existingTest._id,
                                'placementTest.resultBeltName': assignedBeltName,
                                'placementTest.resultScorePercent': scorePercent,
                                'placementTest.takenAt': new Date(),
                                'placementTest.attemptsUsed': currentTechnicalAttemptsUsed + 1,
                                'placementTest.technicalAttemptsUsed': currentTechnicalAttemptsUsed + 1,
                            },
                        },
                        { session: dbSession }
                    );
                }
            });
        } finally {
            dbSession.endSession();
        }

        const response = NextResponse.json({
            success: true,
            isGuest: !user,
            message: 'Results saved successfully!',
            data: {
                testId: existingTest._id.toString(),
                scorePercent,
                beltName: assignedBeltName,
                attemptsUsed: user ? currentTechnicalAttemptsUsed + 1 : null,
                detailedEvaluation,
            },
        });

        response.headers.set('Set-Cookie', clearLeadCookie());
        return response;
    } catch (error) {
        console.error('Error submitting placement test:', error);
        return NextResponse.json(
            { error: 'Failed to save test results' },
            { status: 500 }
        );
    }
}

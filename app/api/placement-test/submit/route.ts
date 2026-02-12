import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PlacementTest from '@/lib/models/PlacementTest';

interface SubmitRequestBody {
    testId?: string;
    surveyData?: {
        name?: string;
        age?: string;
        country?: string;
        city?: string;
        schoolName?: string;
        preferredHouse?: string;
        techExperience?: string;
        techDetails?: string;
        heardAboutUs?: string;
        phone?: string;
        email?: string;
    };
    questions: Array<{
        question: string;
        options: string[];
        ans_idx: number;
        justification?: string;
    }>;
    selectedAnswers: (number | null)[];
    score: number;
    totalQuestions: number;
    belt: {
        belt: string;
        stage: string;
        color: string;
        focus: string;
        duration: string;
        totalHours: string;
        totalClasses: string;
        scoreRange: [number, number];
    };
}

export async function POST(req: Request) {
    try {
        const body: SubmitRequestBody = await req.json();
        const { testId, questions, selectedAnswers, score, totalQuestions, belt } = body;

        const session = await getServerSession(authOptions);

        // Calculate score percentage (legacy/default)
        let scorePercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
        let detailedEvaluation = null;
        let isGeneralTest = false;

        // Check if this is a General Test
        // We can infer this if the belt object corresponds to the 'General' track or 
        // if we explicitly pass a flag. 
        // Currently, the frontend passes a 'belt' object. 
        // For general test, the 'belt' might be determined by the frontend based on score.
        // BUT, the new logic requires backend to evaluate.
        // Let's assume if the belt name is derived from 'General - ' or if we pass a specific flag.
        // Better yet, let's look at the questions. If they have 'belt' property, it's likely our new format.
        // Or we can rely on `body.isGeneralTest` if we update frontend, 
        // OR we can check if `belt.belt` is 'General' (if that's what frontend sends).

        // Strategy: We will infer it if the first question has a 'belt' property that matches our new system 
        // OR if the user is in the 'General' flow (maybe check session/user state? No, stateless API is better).
        // Let's rely on the question structure for now.
        const firstQuestion = questions[0] as any;
        if (firstQuestion && (firstQuestion.belt === 'White' || firstQuestion.belt === 'Yellow' || firstQuestion.belt === 'Orange')) {
            isGeneralTest = true;
        }

        if (isGeneralTest) {
            const { evaluatePlacementTest } = await import('@/lib/placement-test/evaluator'); // Dynamic import

            // Map frontend questions format back to our internal Question format if needed
            // The frontend sends { question, options, ans_idx, justification }
            // We need { difficulty_level, concepts, belt, ... }
            // The frontend MUST send this extra metadata. 
            // We need to verify if `questions` in body contains this. 
            // Looking at `TestMain.tsx`, it sends `questions` from state.
            // The `generate-questions` API returns full objects. 
            // `TestMain.tsx` preserves them.
            // So `body.questions` should have all fields.

            const evaluationResult = evaluatePlacementTest(questions as any, selectedAnswers);
            detailedEvaluation = evaluationResult;
            scorePercent = Math.round(evaluationResult.overall_readiness);

            // Log the study plan for debugging
            console.log('🎓 General Test Evaluation:', JSON.stringify(evaluationResult.study_plan, null, 2));
        }

        // Prepare questions data for storage
        const questionsData = questions.map((q: any, index) => ({
            questionId: `q_${index}`,
            selectedOptionId: selectedAnswers[index] !== null ? `opt_${selectedAnswers[index]}` : '',
            isCorrect: selectedAnswers[index] === q.ans_idx,
            points: selectedAnswers[index] === q.ans_idx ? 1 : 0,
            belt: q.belt,
            difficulty: q.difficulty_level
        }));

        // If guest user, return the data for later linking
        if (!session?.user?.email) {
            return NextResponse.json({
                success: true,
                isGuest: true,
                message: 'Results recorded. Wait for login to save.',
                data: {
                    scorePercent,
                    beltName: belt.belt,
                    beltStage: belt.stage,
                    questionsCount: questions.length,
                    detailedEvaluation // Return this so frontend can show it if needed
                },
            });
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

        // Update or create placement test record
        let placementTest;

        const updateData: any = {
            status: 'completed',
            scorePercent,
            resultBeltName: belt.belt, // This matches what frontend predicted/showed
            questions: questionsData,
            detailedEvaluation,
            completedAt: new Date(),
        };

        if (testId) {
            // Update existing test
            placementTest = await PlacementTest.findByIdAndUpdate(
                testId,
                updateData,
                { new: true }
            );
        }

        // If no testId provided OR update failed (invalid testId), create new record
        if (!placementTest) {
            // Create new test record
            const attemptNumber = (user.placementTest?.attemptsUsed || 0) + 1;

            placementTest = await PlacementTest.create({
                userId: user._id,
                trackId: user._id, // Placeholder trackId
                attemptNumber,
                status: 'completed',
                scorePercent,
                resultBeltName: belt.belt,
                questions: questionsData,
                detailedEvaluation,
                startedAt: new Date(),
                completedAt: new Date(),
            });
        }


        // Update user's placement test summary
        const currentAttemptsUsed = user.placementTest?.attemptsUsed || 0;

        // If it's a general test, we might want to update specific fields on user model 
        // OR just keep using the generic `resultScorePercent`.
        // for now, we follow existing pattern.

        await User.findByIdAndUpdate(user._id, {
            $set: {
                'placementTest.hasTakenAnyPlacementTest': true,
                'placementTest.lastPlacementTestId': placementTest._id,
                'placementTest.resultBeltName': belt.belt,
                'placementTest.resultScorePercent': scorePercent,
                'placementTest.takenAt': new Date(),
                'placementTest.attemptsUsed': testId ? currentAttemptsUsed : currentAttemptsUsed + 1,
            },
        });

        return NextResponse.json({
            success: true,
            isGuest: false,
            message: 'Results saved successfully!',
            data: {
                testId: placementTest._id.toString(),
                scorePercent,
                beltName: belt.belt,
                beltStage: belt.stage,
                attemptsUsed: testId ? currentAttemptsUsed : currentAttemptsUsed + 1,
                detailedEvaluation // Send back to frontend
            },
        });
    } catch (error) {
        console.error('Error submitting placement test:', error);
        return NextResponse.json(
            { error: 'Failed to save test results' },
            { status: 500 }
        );
    }
}

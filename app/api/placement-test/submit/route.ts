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

        // Calculate score percentage
        const scorePercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

        // Prepare questions data for storage
        const questionsData = questions.map((q, index) => ({
            questionId: `q_${index}`,
            selectedOptionId: selectedAnswers[index] !== null ? `opt_${selectedAnswers[index]}` : '',
            isCorrect: selectedAnswers[index] === q.ans_idx,
            points: selectedAnswers[index] === q.ans_idx ? 1 : 0,
        }));

        // If guest user, return the data for later linking
        if (!session?.user?.email) {
            return NextResponse.json({
                success: true,
                isGuest: true,
                message: 'Results recorded. Login to save permanently.',
                data: {
                    scorePercent,
                    beltName: belt.belt,
                    beltStage: belt.stage,
                    questionsCount: questions.length,
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

        if (testId) {
            // Update existing test
            placementTest = await PlacementTest.findByIdAndUpdate(
                testId,
                {
                    status: 'completed',
                    scorePercent,
                    resultBeltName: belt.belt,
                    questions: questionsData,
                    completedAt: new Date(),
                },
                { new: true }
            );
        } else {
            // Create new test record (for edge cases)
            const attemptNumber = (user.placementTest?.attemptsUsed || 0) + 1;

            placementTest = await PlacementTest.create({
                userId: user._id,
                trackId: user._id, // Placeholder trackId
                attemptNumber,
                status: 'completed',
                scorePercent,
                resultBeltName: belt.belt,
                questions: questionsData,
                startedAt: new Date(),
                completedAt: new Date(),
            });
        }

        // Check if placementTest was created/updated
        if (!placementTest) {
            return NextResponse.json(
                { error: 'Failed to create or update placement test' },
                { status: 500 }
            );
        }

        // Update user's placement test summary
        const currentAttemptsUsed = user.placementTest?.attemptsUsed || 0;

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

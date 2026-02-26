import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PlacementTest from '@/lib/models/PlacementTest';
import { savePlacementResultToFirebase } from '@/lib/firebase-service';

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
    track?: string; // 'general' or specific track like 'python_programming'
}

export async function POST(req: Request) {
    try {
        const body: SubmitRequestBody = await req.json();
        const { testId, questions, selectedAnswers, score, totalQuestions, belt, track } = body;

        const session = await getServerSession(authOptions);

        // Calculate score percentage (legacy/default)
        let scorePercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
        let detailedEvaluation = null;
        let isGeneralTest = false;

        // Determine if this is a General test or specific track
        // If track is 'general' or not provided, it's a general placement test
        const isGeneral = !track || track === 'general';

        // Check if this is a General Test based on question structure
        const firstQuestion = questions[0] as any;
        const hasBeltData = firstQuestion && (firstQuestion.belt === 'White' || firstQuestion.belt === 'Yellow' || firstQuestion.belt === 'Orange');

        if (hasBeltData) {
            isGeneralTest = true;
        }

        // Debug logging
        console.log('📋 Submit API Debug:');
        console.log('  - Track:', track);
        console.log('  - Is General:', isGeneral);
        console.log('  - Has Belt Data:', hasBeltData);
        console.log('  - First Question Belt:', firstQuestion?.belt);
        console.log('  - Questions Count:', questions?.length);

        // Map track keys to display names
        const TRACK_NAME_MAP: Record<string, string> = {
            data_science: 'AI & Data Science',
            computer_fundamentals: 'Computer Fundamentals',
            cybersecurity: 'Cybersecurity',
            data_analysis: 'Data Analysis',
            python_programming: 'Python Programming',
            robotics: 'Robotics',
            general: 'General Placement',
        };

        const trackName = isGeneral ? 'General Placement' : (TRACK_NAME_MAP[track] || track);

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

            console.log('  - Running evaluator with', questions.length, 'questions');
            console.log('  - First question sample:', JSON.stringify(questions[0]));

            const evaluationResult = evaluatePlacementTest(questions as any, selectedAnswers);
            detailedEvaluation = evaluationResult;
            scorePercent = Math.round(evaluationResult.overall_readiness);

            // Log the study plan for debugging
            console.log('🎓 General Test Evaluation:', JSON.stringify(evaluationResult.study_plan, null, 2));
            console.log('🎓 Evaluation belt_details:', JSON.stringify(Object.keys(evaluationResult.belt_details || {})));
        } else {
            console.log('  - NOT running evaluator (not a general test)');
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

        await dbConnect();

        let user = null;
        if (session?.user?.email) {
            user = await User.findOne({ email: session.user.email });
        }

        const surveyData = body.surveyData || {};
        const guestDetails = !user ? {
            name: surveyData.name,
            email: surveyData.email,
            phone: surveyData.phone,
            age: surveyData.age,
            country: surveyData.country,
            city: surveyData.city,
            schoolName: surveyData.schoolName,
            preferredHouse: surveyData.preferredHouse,
            techExperience: surveyData.techExperience,
            heardAboutUs: surveyData.heardAboutUs,
        } : undefined;

        // Update or create placement test record
        let placementTest;

        // For general tests, use server-side evaluator belt; for specific tracks, use frontend belt
        const assignedBeltName = (isGeneralTest && detailedEvaluation?.assigned_belt)
            ? detailedEvaluation.assigned_belt
            : belt.belt;

        const updateData: any = {
            status: 'completed',
            scorePercent,
            resultBeltName: assignedBeltName,
            trackName: trackName,
            questions: questionsData,
            detailedEvaluation,
            completedAt: new Date(),
        };

        if (guestDetails) {
            updateData.guestDetails = guestDetails;
        }

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
            const attemptNumber = user ? ((user.placementTest?.attemptsUsed || 0) + 1) : 1;

            placementTest = await PlacementTest.create({
                userId: user?._id || null,
                trackId: user?._id || null, // Placeholder
                trackName: trackName, // Store track name for display
                attemptNumber,
                status: 'completed',
                scorePercent,
                resultBeltName: belt.belt,
                questions: questionsData,
                detailedEvaluation,
                guestDetails,
                startedAt: new Date(),
                completedAt: new Date(),
            });
        }


        let currentTechnicalAttemptsUsed = 0;

        if (user) {
            // Update user's placement test summary
            currentTechnicalAttemptsUsed = user.placementTest?.technicalAttemptsUsed || 0;

            // Update technical test attempts
            await User.findByIdAndUpdate(user._id, {
                $set: {
                    'placementTest.hasTakenAnyPlacementTest': true,
                    'placementTest.lastPlacementTestId': placementTest._id,
                    'placementTest.resultBeltName': assignedBeltName,
                    'placementTest.resultScorePercent': scorePercent,
                    'placementTest.takenAt': new Date(),
                    'placementTest.attemptsUsed': testId ? currentTechnicalAttemptsUsed : currentTechnicalAttemptsUsed + 1,
                    'placementTest.technicalAttemptsUsed': testId ? currentTechnicalAttemptsUsed : currentTechnicalAttemptsUsed + 1,
                },
            });
        }

        // Mirror result to Firebase for Sales Dashboard (Non-blocking)
        savePlacementResultToFirebase({
            ...placementTest.toObject(),
            testType: 'technical',
            email: user?.email || guestDetails?.email || null,
            name: user?.profile?.firstName || guestDetails?.name || null,
        }).catch(firebaseError => {
            console.error('⚠️ Firebase sync failed:', firebaseError);
        });

        return NextResponse.json({
            success: true,
            isGuest: false,
            message: 'Results saved successfully!',
            data: {
                testId: placementTest._id.toString(),
                scorePercent,
                beltName: assignedBeltName,
                beltStage: belt.stage,
                attemptsUsed: testId ? currentTechnicalAttemptsUsed : currentTechnicalAttemptsUsed + 1,
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

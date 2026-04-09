'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { SoftSkillsEvaluator } from '@/lib/soft-skills/evaluator';
import { evaluatePlacementTest } from '@/lib/placement-test/evaluator';

export async function fetchAndEvaluateSubmissions() {
    try {
        // Change to "ngentest" based on user hint, or maybe they meant the firebase config
        // Assuming collection 'test_submissions'.
        const q = query(collection(db, 'test_submissions'));

        const querySnapshot = await getDocs(q);
        const fetchedSubmissions: any[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Serialize dates for passing to client
            let serializedData: any = { ...data, id: doc.id };
            if (serializedData.createdAt && serializedData.createdAt.seconds) {
                serializedData.createdAt = serializedData.createdAt.seconds * 1000;
            }

            // Process evaluation server-side to avoid fs/path issues on client
            let evaluation = serializedData.detailedEvaluation;

            if (!evaluation) {
                try {
                    if (serializedData.testType === 'soft_skills') {
                        const evaluator = new SoftSkillsEvaluator(serializedData.ageGroup || '14-17');
                        evaluation = evaluator.evaluate(serializedData.studentInfo || {}, serializedData.answers || {});
                    } else if (serializedData.testType === 'technical' && serializedData.questions) {
                        console.log('--- TECHNICAL TEST EVAL ---');
                        console.log('Submission ID:', serializedData.id);
                        console.log('Questions Sample:', JSON.stringify(serializedData.questions.slice(0, 1)));
                        console.log('Answers Sample:', JSON.stringify(serializedData.selectedAnswers?.slice(0, 1)));

                        // Fix 1: Map simplified Firebase questions back to what the Evaluator needs
                        // The evaluator expects `difficulty_level`, `ans_idx`, `concepts`, etc.
                        const mappedQuestions = serializedData.questions.map((q: any) => ({
                            belt: q.belt || 'White',
                            difficulty_level: q.difficulty || 1, // evaluatePlacementTest uses 1, 2, 3
                            ans_idx: q.isCorrect ? parseInt(q.selectedOptionId?.replace('opt_', '') || '0') : -1, // Hack to force isCorrect to match ans_idx logic if ans_idx isn't saved natively
                            concepts: [], // Simplified data usually lacks concepts
                            ...q
                        }));

                        const fakeAnswers = serializedData.questions.map((q: any) =>
                            parseInt(q.selectedOptionId?.replace('opt_', '') || '1')
                        );

                        evaluation = evaluatePlacementTest(mappedQuestions, fakeAnswers);
                        console.log('Generated local eval:', !!evaluation);
                    }
                } catch (evalErr) {
                    console.error('Error evaluating submission during fetch:', evalErr);
                }
            }

            fetchedSubmissions.push({
                ...serializedData,
                detailedEvaluation: evaluation || null,
            });
        });

        return { success: true, data: fetchedSubmissions };
    } catch (err: any) {
        console.error('Error in fetchAndEvaluateSubmissions:', err);
        return { success: false, error: err.message || 'Failed to fetch evaluations.' };
    }
}

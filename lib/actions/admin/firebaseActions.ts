'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { SoftSkillsEvaluator } from '@/lib/soft-skills/evaluator';
import { evaluatePlacementTest } from '@/lib/placement-test/evaluator';

const ADMIN_ROLES = ['superadmin', 'support'] as const;

// Server actions are reachable from any client in the app unless gated —
// this one returns full submissions with PII and scoring, so it MUST be
// restricted to admin/support roles and revalidated against Mongo (the JWT
// claim is frozen at login and would survive a role downgrade).
async function assertAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }
    await connectToDatabase();
    const user = await User.findById(session.user.id).select('role status');
    const ok = !!user && user.status === 'active' && ADMIN_ROLES.includes(user.role as typeof ADMIN_ROLES[number]);
    if (!ok) {
        throw new Error('Forbidden');
    }
}

export async function fetchAndEvaluateSubmissions() {
    try {
        await assertAdmin();

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
                        evaluation = evaluatePlacementTest(serializedData.questions, serializedData.selectedAnswers || []);
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

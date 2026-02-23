'use client';

import { useEffect, useState } from 'react';
import { fetchAndEvaluateSubmissions } from '@/lib/actions/admin/firebaseActions';
import SoftSkillsEvaluationView from '@/components/admin/SoftSkillsEvaluationView';
import PlacementTestEvaluationView from '@/components/admin/PlacementTestEvaluationView';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function FirebaseEvaluationsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const result = await fetchAndEvaluateSubmissions();
            if (result.success && result.data) {
                setSubmissions(result.data);
            } else {
                setError(result.error || 'Unknown error occurred.');
            }
            setLoading(false);
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-2">Error Loading Data</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
                <Link
                    href="/en/admin"
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Firebase Evaluations
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Live from Firestore test_submissions</p>
                </div>
            </div>

            {submissions.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                    <p className="text-gray-400">No submissions found in Firebase.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {submissions.map((sub) => {
                        const evaluation = sub.detailedEvaluation;

                        return (
                            <div key={sub.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-xl">
                                <div className="mb-6 border-b border-gray-800 pb-4">
                                    <h2 className="text-xl font-bold text-white mb-2">
                                        {sub.studentInfo?.name || sub.name || 'Anonymous Student'}
                                    </h2>
                                    <div className="text-sm text-gray-400 flex flex-wrap gap-4">
                                        <span>Test: <span className="text-blue-400 capitalize">{sub.testType?.replace('_', ' ') || 'Unknown Type'}</span></span>
                                        <span>ID: {sub.id}</span>
                                        {sub.createdAt && <span>Date: {new Date(sub.createdAt).toLocaleString()}</span>}
                                    </div>
                                </div>

                                {evaluation ? (
                                    sub.testType === 'soft_skills' ? (
                                        <SoftSkillsEvaluationView evaluation={evaluation} />
                                    ) : (
                                        <PlacementTestEvaluationView
                                            evaluation={evaluation}
                                            scorePercent={sub.scorePercent}
                                            beltName={sub.resultBeltName}
                                            questions={sub.questions}
                                        />
                                    )
                                ) : (
                                    <div className="text-yellow-400 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                                        Insufficient data to calculate detailed evaluation or evaluation failed.
                                        Check the Firebase document structure.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

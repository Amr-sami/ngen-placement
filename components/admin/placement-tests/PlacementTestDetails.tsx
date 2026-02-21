
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, TrendingUp, Brain, Users, Zap, Award } from 'lucide-react';

interface PlacementTestDetailsProps {
    test: any;
}

export default function PlacementTestDetails({ test }: PlacementTestDetailsProps) {
    const isSoftSkills = test.testType === 'soft_skills';

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
                <Link
                    href="/en/admin/placement-tests"
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {test.userName} <span className="text-gray-500 text-lg font-normal">({test.userEmail})</span>
                    </h1>
                    <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                        <span>{isSoftSkills ? 'Soft Skills Assessment' : `Technical Test: ${test.trackName}`}</span>
                        <span>•</span>
                        <span>Attempt #{test.attemptNumber}</span>
                        <span>•</span>
                        <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {isSoftSkills ? (
                <SoftSkillsAnalysis evaluation={test.detailedEvaluation} />
            ) : (
                <TechnicalAnalysis test={test} />
            )}
        </div>
    );
}

function SoftSkillsAnalysis({ evaluation }: { evaluation: any }) {
    if (!evaluation) return <div className="text-gray-400">No detailed evaluation available.</div>;

    const {
        trait_scores,
        behavioral_dimensions,
        learning_profile,
        strengths,
        growth_areas,
        personality_summary,
        instructor_recommendations,
        motivation_strategies
    } = evaluation;

    return (
        <div className="space-y-6">
            {/* Personality Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <UserIcon className="mr-2 text-purple-400" /> Personality Profile
                    </h3>
                    <p className="text-gray-300 leading-relaxed max-h-40 overflow-y-auto">{personality_summary.en}</p>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-gray-400 text-right leading-relaxed" dir="rtl">{personality_summary.ar}</p>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Brain className="mr-2 text-blue-400" /> Learning Profile
                    </h3>
                    <div className="space-y-4">
                        <ProfileItem label="Learning Pace" value={learning_profile.learning_pace.primary} sub={learning_profile.learning_pace.primary_label_en} />
                        <ProfileItem label="Group Style" value={learning_profile.group_placement.primary} sub={learning_profile.group_placement.primary_label_en} />
                        <ProfileItem label="Effort Level" value={learning_profile.effort_level.level} sub={learning_profile.effort_level.label_en} />
                    </div>
                </div>
            </div>

            {/* Trait Scores Grid */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-6">Trait Scores</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(trait_scores).map(([key, data]: [string, any]) => (
                        <div key={key} className="bg-gray-700/30 p-4 rounded-lg border border-gray-700/50">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm text-gray-400 capitalize">{key.replace('_', ' ')}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${data.category === 'strong' ? 'bg-green-500/20 text-green-400' :
                                    data.category === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                    {data.category}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">{data.score}%</div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${data.score >= 75 ? 'bg-green-500' :
                                        data.score >= 50 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}
                                    style={{ width: `${data.score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 text-green-400 flex items-center">
                        <TrendingUp className="mr-2" /> Top Strengths
                    </h3>
                    <div className="space-y-4">
                        {strengths.map((item: any, idx: number) => (
                            <div key={idx} className="bg-gray-700/30 p-4 rounded-lg">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-white">{item.label_en}</span>
                                    <span className="text-green-400 font-bold">{item.score}%</span>
                                </div>
                                <p className="text-sm text-gray-400">{item.description_en}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 text-amber-400 flex items-center">
                        <Zap className="mr-2" /> Areas for Growth
                    </h3>
                    <div className="space-y-4">
                        {growth_areas.map((item: any, idx: number) => (
                            <div key={idx} className="bg-gray-700/30 p-4 rounded-lg">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-white">{item.label_en}</span>
                                    <span className="text-amber-400 font-bold">{item.score}%</span>
                                </div>
                                <p className="text-sm text-gray-400">{item.description_en}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Instructor Recommendations */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Award className="mr-2 text-indigo-400" /> Instructor Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">English</h4>
                        <ul className="space-y-2">
                            {instructor_recommendations.en.map((rec: string, i: number) => (
                                <li key={i} className="flex items-start text-gray-300">
                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div dir="rtl">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">العربية</h4>
                        <ul className="space-y-2">
                            {instructor_recommendations.ar.map((rec: string, i: number) => (
                                <li key={i} className="flex items-start text-gray-300">
                                    <span className="ml-2 mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Raw Answers (Collapsible or just listed) */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Questions & Answers</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-3">Question</th>
                                <th className="px-4 py-3">Selected Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {evaluation.enriched_answers ? (
                                evaluation.enriched_answers.map((ans: any, i: number) => (
                                    <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="px-4 py-3 font-medium text-white">
                                            <div className="mb-1">{ans.text}</div>
                                            <div className="text-xs text-gray-500" dir="rtl">{ans.text_ar}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="mb-1">{ans.selectedOption}</div>
                                            <div className="text-xs text-gray-500" dir="rtl">{ans.selectedOption_ar}</div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                evaluation.raw_data && evaluation.raw_data.answers && Object.entries(evaluation.raw_data.answers).map(([qid, ans]: [string, any]) => (
                                    <tr key={qid} className="border-b border-gray-700/50">
                                        <td className="px-4 py-3 font-medium text-white">Q{qid}</td>
                                        <td className="px-4 py-3">Option {['A', 'B', 'C', 'D'][ans] || ans}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function TechnicalAnalysis({ test }: { test: any }) {
    if (!test.questions || test.questions.length === 0) {
        return <div className="text-gray-400">No question data available.</div>;
    }

    const correctCount = test.questions.filter((q: any) => q.isCorrect).length;
    const totalCount = test.questions.length;
    const score = Math.round((correctCount / totalCount) * 100);

    // Check if we have detailed evaluation from the new evaluator
    const detailedEval = test.detailedEvaluation;
    const hasDetailedEval = detailedEval && Object.keys(detailedEval).length > 0;

    return (
        <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Overall Score</p>
                        <p className="text-3xl font-bold text-white mt-1">{score}%</p>
                    </div>
                    <div className={`p-3 rounded-full ${score >= 70 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {score >= 70 ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                    </div>
                </div>

                {/* Readiness Score (from detailed evaluation) */}
                {hasDetailedEval && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Overall Readiness</p>
                            <p className="text-3xl font-bold text-white mt-1">{detailedEval.overall_readiness?.toFixed(1) || score}%</p>
                        </div>
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-full">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                )}

                {/* Questions Stat */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">Performance</p>
                        <p className="text-3xl font-bold text-white mt-1">{correctCount} <span className="text-gray-500 text-lg font-normal">/ {totalCount}</span></p>
                    </div>
                </div>
            </div>

            {/* Detailed Evaluation Section - Only for General Tests with detailed eval */}
            {hasDetailedEval && detailedEval.belt_details && (
                <DetailedEvaluationSection evaluation={detailedEval} />
            )}

            {/* Questions List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Detailed Questions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700/50 text-gray-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4 text-left">Result</th>
                                <th className="px-6 py-4 text-left">Question ID</th>
                                <th className="px-6 py-4 text-left">Selection</th>
                                <th className="px-6 py-4 text-left">Time</th>
                                <th className="px-6 py-4 text-left">Difficulty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {test.questions.map((q: any, i: number) => (
                                <tr key={i} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        {q.isCorrect ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                                <CheckCircle size={12} className="mr-1" /> Correct
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                                                <XCircle size={12} className="mr-1" /> Incorrect
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                                        {q.questionId}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {q.selectedOptionId}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {q.timeTakenSeconds ? `${q.timeTakenSeconds}s` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {q.difficulty || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// New component to display detailed evaluation
function DetailedEvaluationSection({ evaluation }: { evaluation: any }) {
    const { belt_details, study_priority, flags, strengths, weaknesses, study_plan, belts_to_study, belts_to_skip, belts_to_review } = evaluation;

    return (
        <div className="space-y-6">
            {/* Flags */}
            {flags && flags.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <h4 className="text-amber-400 font-semibold mb-2 flex items-center">
                        <AlertCircle size={18} className="mr-2" />
                        Flags Detected
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {flags.map((flag: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm">
                                {flag.replace(/_/g, ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Study Plan */}
            {study_plan && study_plan.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Brain size={20} className="mr-2 text-purple-400" />
                        Study Plan
                    </h4>
                    <ul className="space-y-2">
                        {study_plan.map((plan: string, idx: number) => (
                            <li key={idx} className="text-gray-300 flex items-start">
                                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
                                <span>{plan}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Belts Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {belts_to_study && belts_to_study.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <h5 className="text-red-400 font-medium mb-2">Need to Study</h5>
                        <div className="flex flex-wrap gap-2">
                            {belts_to_study.map((belt: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm">{belt}</span>
                            ))}
                        </div>
                    </div>
                )}
                {belts_to_review && belts_to_review.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <h5 className="text-yellow-400 font-medium mb-2">Need Review</h5>
                        <div className="flex flex-wrap gap-2">
                            {belts_to_review.map((belt: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm">{belt}</span>
                            ))}
                        </div>
                    </div>
                )}
                {belts_to_skip && belts_to_skip.length > 0 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <h5 className="text-green-400 font-medium mb-2">Can Skip</h5>
                        <div className="flex flex-wrap gap-2">
                            {belts_to_skip.map((belt: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">{belt}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Belt Details */}
            {belt_details && Object.keys(belt_details).length > 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                        <h4 className="text-lg font-semibold text-white">Belt Performance Details</h4>
                    </div>
                    <div className="divide-y divide-gray-700/50">
                        {Object.entries(belt_details).map(([beltName, beltData]: [string, any]) => (
                            <div key={beltName} className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <h5 className="text-xl font-bold text-white">{beltName}</h5>
                                        <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium ${beltData.status === 'fully_mastered' ? 'bg-green-500/20 text-green-400' :
                                                beltData.status === 'mastered' ? 'bg-green-500/20 text-green-400' :
                                                    beltData.status === 'needs_review' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                            }`}>
                                            {beltData.status?.replace(/_/g, ' ') || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{beltData.score_percentage}%</p>
                                        <p className="text-gray-500 text-sm">{beltData.correct}/{beltData.total} correct</p>
                                    </div>
                                </div>

                                {/* Difficulty Breakdown */}
                                {beltData.by_difficulty && (
                                    <div className="mb-4">
                                        <p className="text-gray-400 text-sm mb-2">Performance by Difficulty</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {Object.entries(beltData.by_difficulty).map(([level, diffData]: [string, any]) => (
                                                <div key={level} className="bg-gray-700/30 rounded-lg p-2 text-center">
                                                    <p className="text-gray-400 text-xs">{diffData.label}</p>
                                                    <p className="text-white font-bold">{diffData.percentage?.toFixed(0)}%</p>
                                                    <p className="text-gray-500 text-xs">{diffData.correct}/{diffData.total}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Strong Concepts */}
                                {beltData.strong_concepts && beltData.strong_concepts.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-green-400 text-sm mb-1">Strong Concepts:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {beltData.strong_concepts.map((concept: string, idx: number) => (
                                                <span key={idx} className="px-2 py-0.5 bg-green-500/10 text-green-300 rounded text-xs">{concept}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Weak Concepts */}
                                {beltData.weak_concepts && beltData.weak_concepts.length > 0 && (
                                    <div>
                                        <p className="text-red-400 text-sm mb-1">Weak Concepts:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {beltData.weak_concepts.map((concept: string, idx: number) => (
                                                <span key={idx} className="px-2 py-0.5 bg-red-500/10 text-red-300 rounded text-xs">{concept}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Study Priority */}
            {study_priority && study_priority.length > 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                        <h4 className="text-lg font-semibold text-white">Study Priority</h4>
                    </div>
                    <div className="divide-y divide-gray-700/50">
                        {study_priority.map((priority: any, idx: number) => (
                            <div key={idx} className="p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mr-3">
                                        {priority.rank}
                                    </span>
                                    <div>
                                        <p className="text-white font-medium">{priority.belt}</p>
                                        <p className="text-gray-400 text-sm">{priority.score_percentage}% - {priority.status?.replace(/_/g, ' ')}</p>
                                    </div>
                                </div>
                                {priority.reasons && priority.reasons.length > 0 && (
                                    <div className="text-right">
                                        {priority.reasons.slice(0, 2).map((reason: string, rIdx: number) => (
                                            <p key={rIdx} className="text-gray-500 text-xs">{reason}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strengths && strengths.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                            <TrendingUp size={20} className="mr-2" />
                            Strengths
                        </h4>
                        <ul className="space-y-2">
                            {strengths.map((strength: string, idx: number) => (
                                <li key={idx} className="text-gray-300 flex items-start">
                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                                    {strength}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {weaknesses && weaknesses.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
                            <AlertCircle size={20} className="mr-2" />
                            Weaknesses
                        </h4>
                        <ul className="space-y-2">
                            {weaknesses.map((weakness: string, idx: number) => (
                                <li key={idx} className="text-gray-300 flex items-start">
                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                                    {weakness}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProfileItem({ label, value, sub }: { label: string, value: string, sub?: string }) {
    return (
        <div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className="text-white font-medium capitalize">{value.replace('_', ' ')}</p>
            {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    );
}

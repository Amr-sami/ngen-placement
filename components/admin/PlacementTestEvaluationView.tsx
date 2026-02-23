import { AlertCircle, Award, Target, BookOpen } from 'lucide-react';

interface PlacementTestEvaluationViewProps {
    evaluation: any;
    scorePercent?: number;
    beltName?: string;
}

export default function PlacementTestEvaluationView({ evaluation, scorePercent, beltName }: PlacementTestEvaluationViewProps) {
    if (!evaluation) return null;

    const {
        belt_details,
        study_priority,
        flags,
        belts_to_study,
        belts_to_review,
        belts_to_skip,
        study_plan
    } = evaluation;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-blue-400 flex items-center">
                    <Award className="mr-2" /> Technical Placement Analysis
                </h3>
            </div>

            {/* Flags Alert */}
            {flags && flags.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <h4 className="text-red-400 font-semibold mb-2 flex items-center">
                        <AlertCircle size={18} className="mr-2" /> System Flags Detected
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {flags.map((flag: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">
                                {flag.replace(/_/g, ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Belt Status Summary */}
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <h4 className="font-semibold text-white mb-4">Belt Mastery Summary</h4>
                    <div className="space-y-3">
                        {belts_to_skip?.length > 0 && (
                            <div className="flex items-start">
                                <span className="w-24 text-sm text-gray-500 shrink-0 mt-0.5">Mastered:</span>
                                <div className="flex flex-wrap gap-2">
                                    {belts_to_skip.map((b: string) => <span key={b} className="text-sm bg-green-500/10 text-green-400 px-2 py-0.5 rounded">{b}</span>)}
                                </div>
                            </div>
                        )}
                        {belts_to_review?.length > 0 && (
                            <div className="flex items-start">
                                <span className="w-24 text-sm text-gray-500 shrink-0 mt-0.5">Review:</span>
                                <div className="flex flex-wrap gap-2">
                                    {belts_to_review.map((b: string) => <span key={b} className="text-sm bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded">{b}</span>)}
                                </div>
                            </div>
                        )}
                        {belts_to_study?.length > 0 && (
                            <div className="flex items-start">
                                <span className="w-24 text-sm text-gray-500 shrink-0 mt-0.5">Study Needed:</span>
                                <div className="flex flex-wrap gap-2">
                                    {belts_to_study.map((b: string) => <span key={b} className="text-sm bg-red-500/10 text-red-400 px-2 py-0.5 rounded">{b}</span>)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Priority Learning Path */}
                {study_priority && study_priority.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <h4 className="font-semibold text-blue-400 mb-4 flex items-center">
                            <Target size={16} className="mr-2" /> Priority Learning Path
                        </h4>
                        <div className="space-y-3">
                            {study_priority.slice(0, 3).map((priority: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                                    <span className="text-sm text-white flex items-center">
                                        <span className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs mr-2 shrink-0">{priority.rank}</span>
                                        {priority.belt}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${priority.status === 'needs_full_course' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {priority.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Belt Details / Concepts Matrix */}
            {belt_details && (
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <h4 className="font-semibold text-white mb-4 flex items-center">
                        <BookOpen size={16} className="mr-2" /> Detailed Concept Mastery
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(belt_details).map(([belt, details]: [string, any]) => (
                            <div key={belt} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-white">{belt} Belt</span>
                                    <span className="text-sm text-gray-400">{details.score_percentage}%</span>
                                </div>

                                <div className="space-y-2 mt-2">
                                    {details.strong_concepts?.length > 0 && (
                                        <div>
                                            <span className="text-xs text-green-400 block mb-1">Strong &gt; 80%</span>
                                            <div className="flex flex-wrap gap-1">
                                                {details.strong_concepts.map((c: string) => <span key={c} className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">{c}</span>)}
                                            </div>
                                        </div>
                                    )}
                                    {details.weak_concepts?.length > 0 && (
                                        <div className="mt-2 text-xs">
                                            <span className="text-red-400 block mb-1">Weak &lt; 50%</span>
                                            <div className="flex flex-wrap gap-1">
                                                {details.weak_concepts.map((c: string) => <span key={c} className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">{c}</span>)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

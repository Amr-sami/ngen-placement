import { Brain, CheckCircle, TrendingUp, Users } from 'lucide-react';

interface SoftSkillsEvaluationViewProps {
    evaluation: any;
}

export default function SoftSkillsEvaluationView({ evaluation }: SoftSkillsEvaluationViewProps) {
    if (!evaluation) return null;

    const {
        trait_scores,
        learning_profile,
        strengths,
        growth_areas,
        personality_summary,
    } = evaluation;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-purple-400 flex items-center mb-4">
                <Brain className="mr-2" /> Soft Skills Analysis
            </h3>

            {/* Personality Summary */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h4 className="font-semibold text-white mb-2">Personality Summary</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{personality_summary?.en}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Learning Profile */}
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <h4 className="font-semibold text-white mb-4">Learning Profile</h4>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Learning Pace</p>
                            <p className="text-sm text-gray-300">{learning_profile?.learning_pace?.primary_label_en}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Group Placement</p>
                            <p className="text-sm text-gray-300">{learning_profile?.group_placement?.primary_label_en}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Effort Level Required</p>
                            <p className="text-sm text-gray-300">{learning_profile?.effort_level?.label_en}</p>
                        </div>
                    </div>
                </div>

                {/* Top Strengths */}
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <h4 className="font-semibold text-green-400 mb-4 flex items-center">
                        <TrendingUp size={16} className="mr-2" /> Top Strengths
                    </h4>
                    <div className="space-y-3 mt-2">
                        {strengths?.map((s: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-700/30 p-2 rounded">
                                <span className="text-sm text-white">{s.label_en}</span>
                                <span className="text-green-400 font-bold">{s.score}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth Areas */}
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <h4 className="font-semibold text-amber-400 mb-4 flex items-center">
                        <Users size={16} className="mr-2" /> Growth Areas
                    </h4>
                    <div className="space-y-3 mt-2">
                        {growth_areas?.map((g: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-700/30 p-2 rounded">
                                <span className="text-sm text-white">{g.label_en}</span>
                                <span className="text-amber-400 font-bold">{g.score}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Core Traits Matrix */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h4 className="font-semibold text-white mb-4">10 Core Traits Matrix</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {trait_scores && Object.entries(trait_scores).map(([key, data]: [string, any]) => (
                        <div key={key} className="bg-gray-700/50 p-3 rounded-lg text-center">
                            <span className="block text-xs text-gray-400 mb-1 capitalize truncate" title={key.replace('_', ' ')}>
                                {key.replace('_', ' ')}
                            </span>
                            <span className={`text-lg font-bold ${data.category === 'strong' ? 'text-green-400' :
                                    data.category === 'moderate' ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                {data.score}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

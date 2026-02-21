
import React from 'react';
import { motion } from 'framer-motion';

interface TestSelectionProps {
    onSelect: (type: 'technical' | 'soft_skills') => void;
    hasTakenSoftSkills: boolean;
    hasTakenTechnical: boolean;
}

const TestSelection: React.FC<TestSelectionProps> = ({ onSelect, hasTakenSoftSkills, hasTakenTechnical }) => {
    return (
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full max-w-4xl mx-auto p-4">
            {/* Technical Test Card */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className={`flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col items-center text-center transition-all ${hasTakenTechnical ? 'opacity-75 grayscale' : ''
                    }`}
            >
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">🚀</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Technical Placement Test</h3>
                <p className="text-gray-300 mb-6 flex-grow">
                    Assess your coding skills and logical thinking to find the perfect starting point in our curriculum.
                </p>
                <button
                    onClick={() => onSelect('technical')}
                    disabled={hasTakenTechnical} // Maybe allow retakes? Logic says usually one placement.
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all w-full ${hasTakenTechnical
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30'
                        }`}
                >
                    {hasTakenTechnical ? 'Completed' : 'Start Technical Test'}
                </button>
            </motion.div>

            {/* Soft Skills Test Card */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className={`flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col items-center text-center transition-all ${hasTakenSoftSkills ? 'opacity-75' : ''
                    }`}
            >
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">🧠</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Soft Skills Assessment</h3>
                <p className="text-gray-300 mb-6 flex-grow">
                    Discover your learning style, personality strengths, and how you best collaborate with others.
                </p>
                <button
                    onClick={() => onSelect('soft_skills')}
                    disabled={hasTakenSoftSkills}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all w-full ${hasTakenSoftSkills
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/30'
                        }`}
                >
                    {hasTakenSoftSkills ? 'Completed' : 'Start Assessment'}
                </button>
            </motion.div>
        </div>
    );
};

export default TestSelection;

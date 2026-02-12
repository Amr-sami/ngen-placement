export type BeltName = 'White' | 'Yellow' | 'Orange';

export interface Question {
    question_type: string;
    track: string;
    difficulty_level: number;
    concepts: string[];
    question: string;
    choices: string[];
    ans_idx: number; // 0-based index of correct answer
    justification: string;
    belt: string; // e.g., "White", "Yellow"
}

export interface UserAnswer {
    questionId: string;
    answerIndex: number | null; // User's selected index
}

// Result of evaluating a single belt
export interface BeltAssessment {
    score_percentage: number;
    correct: number;
    total: number;
    status: 'mastered' | 'fully_mastered' | 'needs_review' | 'needs_full_course' | 'not_assessed';
    confidence: 'high' | 'medium' | 'low' | 'very_low';
    by_difficulty: {
        [level: number]: {
            label: string;
            correct: number;
            total: number;
            percentage: number;
        };
    };
    strong_concepts: string[]; // >= 80%
    weak_concepts: string[]; // < 50%
}

// Priority item for study plan
export interface StudyPriority {
    rank: number;
    belt: string;
    score_percentage: number;
    status: string;
    reasons: string[];
    weak_concepts: string[];
    priority_score: number; // Internal score for sorting
}

// Final evaluation result
export interface PlacementEvaluationResult {
    overall_readiness: number; // Avg percentage
    total_questions: number;
    total_correct: number;
    belts_assessed: number;
    belts_to_study: string[];
    belts_to_skip: string[];
    belts_to_review: string[];
    study_priority: StudyPriority[];
    belt_details: Record<string, BeltAssessment>;
    study_plan: string[];
    strengths: string[];
    weaknesses: string[];
    flags: string[]; // e.g., 'INVERTED_DIFFICULTY_PATTERN'
}

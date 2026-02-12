import { Question, PlacementEvaluationResult, BeltAssessment, StudyPriority } from './types';

const MASTERY_THRESHOLD = 70;
const FULL_MASTERY_THRESHOLD = 90;
const REVIEW_THRESHOLD = 40;

const BELT_IMPORTANCE: Record<string, number> = {
    'White': 1,
    'Yellow': 2,
    'Orange': 3
};

const DIFFICULTY_WEIGHTS: Record<number, number> = {
    1: 1, // Easy
    2: 2, // Medium
    3: 3  // Hard
};

export function evaluatePlacementTest(
    questions: Question[],
    userAnswers: (number | null)[]
): PlacementEvaluationResult {
    // 1. Group questions by belt
    const questionsByBelt: Record<string, { q: Question, a: number | null }[]> = {};
    const allBelts = new Set<string>();

    questions.forEach((q, idx) => {
        const belt = q.belt || 'Unknown';
        allBelts.add(belt);
        if (!questionsByBelt[belt]) questionsByBelt[belt] = [];
        questionsByBelt[belt].push({ q, a: userAnswers[idx] });
    });

    const beltDetails: Record<string, BeltAssessment> = {};
    const flags: Set<string> = new Set();
    let totalCorrectOverall = 0;
    let totalQuestionsOverall = 0;

    // 2. Evaluate each belt
    for (const belt of allBelts) {
        const beltItems = questionsByBelt[belt];
        let correctCount = 0;
        let weightedScore = 0;
        let maxWeightedScore = 0;

        const difficultyStats: Record<number, { correct: number, total: number }> = {
            1: { correct: 0, total: 0 },
            2: { correct: 0, total: 0 },
            3: { correct: 0, total: 0 }
        };

        const conceptStats: Record<string, { correct: number, total: number }> = {};

        for (const item of beltItems) {
            const isCorrect = item.a === item.q.ans_idx;
            const weight = DIFFICULTY_WEIGHTS[item.q.difficulty_level] || 1;

            if (isCorrect) {
                correctCount++;
                weightedScore += weight;
            }
            maxWeightedScore += weight;

            // Difficulty stats
            if (difficultyStats[item.q.difficulty_level]) {
                difficultyStats[item.q.difficulty_level].total++;
                if (isCorrect) difficultyStats[item.q.difficulty_level].correct++;
            }

            // Concept stats
            for (const concept of (item.q.concepts || [])) {
                if (!conceptStats[concept]) conceptStats[concept] = { correct: 0, total: 0 };
                conceptStats[concept].total++;
                if (isCorrect) conceptStats[concept].correct++;
            }
        }

        totalCorrectOverall += correctCount;
        totalQuestionsOverall += beltItems.length;

        const scorePercent = maxWeightedScore > 0 ? (weightedScore / maxWeightedScore) * 100 : 0;

        // Determine Status
        let status: BeltAssessment['status'] = 'needs_full_course';
        if (scorePercent >= FULL_MASTERY_THRESHOLD) status = 'fully_mastered';
        else if (scorePercent >= MASTERY_THRESHOLD) status = 'mastered';
        else if (scorePercent >= REVIEW_THRESHOLD) status = 'needs_review';

        // Concepts analysis
        const strong_concepts: string[] = [];
        const weak_concepts: string[] = [];

        for (const [concept, stats] of Object.entries(conceptStats)) {
            const pct = (stats.correct / stats.total) * 100;
            if (pct >= 80) strong_concepts.push(concept);
            if (pct < 50) weak_concepts.push(concept);
        }

        // Difficulty analysis
        const by_difficulty: BeltAssessment['by_difficulty'] = {};
        for (const level of [1, 2, 3]) {
            const stats = difficultyStats[level];
            by_difficulty[level] = {
                label: level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard',
                correct: stats.correct,
                total: stats.total,
                percentage: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
            };
        }

        // Inverted Difficulty Flag
        if (
            difficultyStats[1].total > 0 && difficultyStats[3].total > 0 &&
            by_difficulty[3].percentage > by_difficulty[1].percentage + 20 // Significant inversion
        ) {
            flags.add('INVERTED_DIFFICULTY_PATTERN');
        }

        // Confidence
        let confidence: BeltAssessment['confidence'] = 'high';
        if (beltItems.length < 3) confidence = 'very_low';
        else if (beltItems.length < 5) confidence = 'low';
        else if (beltItems.length < 10) confidence = 'medium';
        if (beltItems.length < 5) flags.add('LOW_CONFIDENCE_ASSESSMENTS');

        beltDetails[belt] = {
            score_percentage: parseFloat(scorePercent.toFixed(1)),
            correct: correctCount,
            total: beltItems.length,
            status,
            confidence,
            by_difficulty,
            strong_concepts,
            weak_concepts
        };
    }

    // 3. Categorize Belts
    const belts_to_skip: string[] = [];
    const belts_to_review: string[] = [];
    const belts_to_study: string[] = [];
    const study_priority_candidates: string[] = [];

    for (const [belt, details] of Object.entries(beltDetails)) {
        if (details.status === 'fully_mastered' || details.status === 'mastered') {
            belts_to_skip.push(belt);
        } else if (details.status === 'needs_review') {
            belts_to_review.push(belt);
            belts_to_study.push(belt); // Optional review is still study
            study_priority_candidates.push(belt);
        } else {
            belts_to_study.push(belt);
            study_priority_candidates.push(belt);
        }
    }

    // 4. Calculate Priority (Tiebreakers)
    const study_priority: StudyPriority[] = study_priority_candidates.map(belt => {
        const details = beltDetails[belt];
        let priorityScore = 0;

        // Base score: Lower percentage = Higher priority
        priorityScore += (100 - details.score_percentage) * 2;

        // Tier 1: Easy Question Performance (Lower easy score = Higher priority)
        const easyPct = details.by_difficulty[1].percentage;
        priorityScore += (100 - easyPct) * 1.5;

        // Tier 2: Weak Concept Count (More weak concepts = Higher priority)
        priorityScore += details.weak_concepts.length * 5;

        // Tier 3: Hard Question Performance (Lower hard score = Higher priority)
        const hardPct = details.by_difficulty[3].percentage;
        priorityScore += (100 - hardPct) * 0.5;

        // Tier 5: Belt Importance (Lower importance number = Higher priority)
        // We use inverse of importance to add to score
        // White (1) -> +30, Yellow (2) -> +20, Orange (3) -> +10
        const importance = BELT_IMPORTANCE[belt] || 99;
        priorityScore += (10 - importance) * 10;

        const reasons: string[] = [];
        if (details.status === 'needs_full_course') reasons.push('Requires comprehensive course study');
        if (details.status === 'needs_review') reasons.push('Review and reinforcement recommended');
        if (easyPct < 50) reasons.push('Fundamental concepts need attention');
        if (details.weak_concepts.length > 0) reasons.push(`${details.weak_concepts.length} concept(s) need focused study`);

        return {
            rank: 0, // Assigned later
            belt,
            score_percentage: details.score_percentage,
            status: details.status,
            reasons,
            weak_concepts: details.weak_concepts,
            priority_score: priorityScore
        };
    });

    // Sort by priority score descending
    study_priority.sort((a, b) => b.priority_score - a.priority_score);

    // Assign ranks
    study_priority.forEach((item, index) => item.rank = index + 1);

    // 5. Global Flags
    if (Object.values(beltDetails).every(b => b.score_percentage === 0)) flags.add('ALL_ZERO_SCORE');
    if (Object.values(beltDetails).every(b => b.score_percentage === 100)) flags.add('ALL_PERFECT_SCORE');

    // check for equal scores across all belts (if more than 1 belt)
    if (allBelts.size > 1) {
        const firstScore = Object.values(beltDetails)[0].score_percentage;
        if (Object.values(beltDetails).every(b => Math.abs(b.score_percentage - firstScore) < 0.1)) {
            flags.add('ALL_EQUAL_SCORES');
        }
    }

    // 6. Generate Insights
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const study_plan: string[] = [];

    // Strengths
    Object.entries(beltDetails).forEach(([belt, d]) => {
        d.strong_concepts.forEach(c => strengths.push(`Solid understanding of: ${c} (${belt})`));
    });

    // Weaknesses
    if (belts_to_study.length > 0) {
        weaknesses.push(`Needs work in: ${belts_to_study.join(', ')}`);
    }
    Object.entries(beltDetails).forEach(([belt, d]) => {
        d.weak_concepts.forEach(c => weaknesses.push(`Review needed for: ${c}`));
    });

    // Study Plan Text
    if (belts_to_skip.length === allBelts.size && allBelts.size > 0) {
        study_plan.push("🎉 Excellent! You've demonstrated mastery across all assessed belts.");
        study_plan.push("Consider exploring advanced topics or helping other learners.");
    } else {
        const fullCourseBelts = study_priority.filter(p => p.status === 'needs_full_course').map(p => p.belt);
        const reviewBelts = study_priority.filter(p => p.status === 'needs_review').map(p => p.belt);

        if (fullCourseBelts.length) study_plan.push(`📚 Start with complete courses for: ${fullCourseBelts.join(', ')}`);
        if (reviewBelts.length) study_plan.push(`📖 Review materials recommended for: ${reviewBelts.join(', ')}`);

        if (study_priority.length > 0) {
            const topPriority = study_priority[0];
            study_plan.push(`⭐ Recommended to start with: ${topPriority.belt} (Score: ${topPriority.score_percentage}%)`);

            // Gather top weak concepts from top priority belt
            const topWeak = topPriority.weak_concepts.slice(0, 5);
            if (topWeak.length) {
                study_plan.push(`🎯 Focus especially on: ${topWeak.join(', ')}`);
            }
        }

        if (flags.has('INVERTED_DIFFICULTY_PATTERN')) {
            study_plan.push('💡 Unusual pattern detected: Review fundamental concepts carefully.');
        }
    }

    const overall_readiness = totalQuestionsOverall > 0
        ? parseFloat(((totalCorrectOverall / totalQuestionsOverall) * 100).toFixed(1))
        : 0;

    return {
        overall_readiness,
        total_questions: totalQuestionsOverall,
        total_correct: totalCorrectOverall,
        belts_assessed: allBelts.size,
        belts_to_study,
        belts_to_skip,
        belts_to_review,
        study_priority,
        belt_details: beltDetails,
        study_plan,
        strengths,
        weaknesses,
        flags: Array.from(flags)
    };
}

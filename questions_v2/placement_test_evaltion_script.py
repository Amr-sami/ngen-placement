"""
Placement Test Evaluation System
================================

Evaluates student placement tests across independent belts (topics/skill areas).
Handles normal evaluation flows and all edge cases with comprehensive tiebreaker logic.

Usage:
    from placement_evaluator import evaluate_placement_test
    
    result = evaluate_placement_test(questions, student_answers)
    summary = result  # Returns API-friendly dictionary
"""

import json
from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass, field
from collections import defaultdict
from enum import Enum
import math


# =============================================================================
# ENUMS
# =============================================================================

class MasteryLevel(Enum):
    """Mastery level for a belt"""
    NOT_ASSESSED = "not_assessed"
    NEEDS_FULL_COURSE = "needs_full_course"
    NEEDS_REVIEW = "needs_review"
    MASTERED = "mastered"
    FULLY_MASTERED = "fully_mastered"


class ConfidenceLevel(Enum):
    """Confidence level based on question count"""
    NONE = "none"
    VERY_LOW = "very_low"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# =============================================================================
# CONFIGURATION
# =============================================================================

DEFAULT_CONFIG = {
    # Mastery thresholds
    "mastery_threshold": 0.70,
    "fully_mastered_threshold": 0.90,
    "review_threshold": 0.40,

    # Scoring
    "use_weighted_scoring": True,
    "difficulty_weights": {1: 1, 2: 2, 3: 3},

    # Concepts
    "concept_mastery_threshold": 0.70,
    "concept_weak_threshold": 0.50,
    "concept_strong_threshold": 0.80,

    # Confidence
    "min_questions_high_confidence": 10,
    "min_questions_medium_confidence": 5,
    "min_questions_low_confidence": 3,

    # Priority calculation weights
    "priority_weights": {
        "base": 100,
        "easy_performance": 30,
        "weak_concepts": 5,
        "hard_performance": 10,
        "belt_importance": 2,
        "full_course_penalty": 15,
        "variance_penalty": 10
    },

    # Default belt importance (lower = more foundational)
    "belt_importance": {
        "White Belt": 1,
        "Yellow Belt": 2,
        "Orange Belt": 3,
        "Green Belt": 4,
        "Blue Belt": 5,
        "Purple Belt": 6,
        "Brown Belt": 7,
        "Black Belt": 8
    }
}


# =============================================================================
# DATA CLASSES
# =============================================================================

@dataclass
class ConceptScore:
    """Score for a specific concept"""
    concept: str
    correct: int
    total: int
    percentage: float
    status: str  # "strong", "adequate", "moderate", "weak"
    mastered: bool


@dataclass
class DifficultyScore:
    """Score for a difficulty level"""
    level: int
    label: str
    correct: int
    total: int
    percentage: float


@dataclass
class BeltAssessment:
    """Complete assessment for a single belt"""
    belt: str
    total_questions: int
    correct_answers: int
    percentage: float
    weighted_score: float
    max_weighted_score: float
    mastery_level: MasteryLevel
    confidence: ConfidenceLevel

    # Breakdown
    by_difficulty: Dict[int, DifficultyScore] = field(default_factory=dict)
    by_concept: Dict[str, ConceptScore] = field(default_factory=dict)

    # Analysis
    strong_concepts: List[str] = field(default_factory=list)
    weak_concepts: List[str] = field(default_factory=list)

    # Anomaly detection
    difficulty_variance: float = 0.0
    has_inverted_difficulty: bool = False

    @property
    def needs_study(self) -> bool:
        return self.mastery_level in [
            MasteryLevel.NEEDS_FULL_COURSE,
            MasteryLevel.NEEDS_REVIEW
        ]

    @property
    def can_skip(self) -> bool:
        return self.mastery_level in [
            MasteryLevel.MASTERED,
            MasteryLevel.FULLY_MASTERED
        ]


@dataclass
class PriorityItem:
    """Priority information for a belt"""
    rank: int
    belt: str
    priority_score: float
    percentage: float
    mastery_level: str
    reasons: List[str]
    weak_concepts: List[str]

    # Tiebreaker details
    easy_percentage: float = 0.0
    hard_percentage: float = 0.0
    weak_concept_count: int = 0
    belt_importance: int = 0


# =============================================================================
# MAIN EVALUATOR CLASS
# =============================================================================

class PlacementTestEvaluator:
    """
    Evaluates placement tests with independent belt assessment.

    Each belt is evaluated independently - no sequential dependency.
    Handles all edge cases and applies tiebreaker logic for equal scores.
    """

    DIFFICULTY_LABELS = {1: "Easy", 2: "Medium", 3: "Hard"}

    def __init__(self, config: Optional[Dict] = None):
        """
        Initialize evaluator with configuration.

        Args:
            config: Optional configuration dictionary (uses defaults if not provided)
        """
        self.config = {**DEFAULT_CONFIG, **(config or {})}
        self._extract_config()

    def _extract_config(self):
        """Extract configuration values for easy access"""
        self.mastery_threshold = self.config["mastery_threshold"]
        self.fully_mastered_threshold = self.config["fully_mastered_threshold"]
        self.review_threshold = self.config["review_threshold"]
        self.use_weighted_scoring = self.config["use_weighted_scoring"]
        self.difficulty_weights = self.config["difficulty_weights"]
        self.concept_mastery_threshold = self.config["concept_mastery_threshold"]
        self.concept_weak_threshold = self.config["concept_weak_threshold"]
        self.concept_strong_threshold = self.config["concept_strong_threshold"]
        self.priority_weights = self.config["priority_weights"]
        self.belt_importance = self.config["belt_importance"]

    # -------------------------------------------------------------------------
    # MASTERY LEVEL DETERMINATION
    # -------------------------------------------------------------------------

    def _determine_mastery_level(self, percentage: float) -> MasteryLevel:
        """Determine mastery level based on percentage score"""
        if percentage >= self.fully_mastered_threshold:
            return MasteryLevel.FULLY_MASTERED
        elif percentage >= self.mastery_threshold:
            return MasteryLevel.MASTERED
        elif percentage >= self.review_threshold:
            return MasteryLevel.NEEDS_REVIEW
        else:
            return MasteryLevel.NEEDS_FULL_COURSE

    def _determine_confidence(self, question_count: int) -> ConfidenceLevel:
        """Determine confidence level based on question count"""
        if question_count >= self.config["min_questions_high_confidence"]:
            return ConfidenceLevel.HIGH
        elif question_count >= self.config["min_questions_medium_confidence"]:
            return ConfidenceLevel.MEDIUM
        elif question_count >= self.config["min_questions_low_confidence"]:
            return ConfidenceLevel.LOW
        elif question_count > 0:
            return ConfidenceLevel.VERY_LOW
        else:
            return ConfidenceLevel.NONE

    def _determine_concept_status(self, percentage: float) -> str:
        """Determine concept status based on percentage"""
        if percentage >= self.concept_strong_threshold:
            return "strong"
        elif percentage >= self.concept_mastery_threshold:
            return "adequate"
        elif percentage >= self.concept_weak_threshold:
            return "moderate"
        else:
            return "weak"

    # -------------------------------------------------------------------------
    # STATISTICAL HELPERS
    # -------------------------------------------------------------------------

    def _calculate_variance(self, values: List[float]) -> float:
        """Calculate variance of a list of values"""
        if len(values) < 2:
            return 0.0
        mean = sum(values) / len(values)
        return sum((x - mean) ** 2 for x in values) / len(values)

    def _calculate_standard_deviation(self, values: List[float]) -> float:
        """Calculate standard deviation"""
        return math.sqrt(self._calculate_variance(values))

    # -------------------------------------------------------------------------
    # BELT ASSESSMENT
    # -------------------------------------------------------------------------

    def _assess_belt(
        self,
        questions: List[Dict],
        answers: List[int],
        belt: str
    ) -> BeltAssessment:
        """
        Assess a single belt independently.

        Calculates scores, analyzes by difficulty and concept,
        and detects anomalies.
        """
        # Filter questions for this belt
        belt_data = [
            (q, a) for q, a in zip(questions, answers)
            if q.get("belt") == belt
        ]

        # Handle no questions case
        if not belt_data:
            return BeltAssessment(
                belt=belt,
                total_questions=0,
                correct_answers=0,
                percentage=0.0,
                weighted_score=0.0,
                max_weighted_score=0.0,
                mastery_level=MasteryLevel.NOT_ASSESSED,
                confidence=ConfidenceLevel.NONE
            )

        # Initialize counters
        total = len(belt_data)
        correct = 0
        weighted_score = 0.0
        max_weighted_score = 0.0

        # Difficulty tracking
        difficulty_stats = defaultdict(lambda: {"correct": 0, "total": 0})

        # Concept tracking
        concept_stats = defaultdict(lambda: {"correct": 0, "total": 0})

        # Process each question
        for question, answer in belt_data:
            difficulty = question.get("difficulty_level", 1)
            concepts = question.get("concepts", [])
            correct_idx = question.get("ans_idx")
            is_correct = (answer == correct_idx)

            # Get weight for difficulty
            weight = self.difficulty_weights.get(difficulty, 1)
            max_weighted_score += weight

            if is_correct:
                correct += 1
                weighted_score += weight

            # Track by difficulty
            difficulty_stats[difficulty]["total"] += 1
            if is_correct:
                difficulty_stats[difficulty]["correct"] += 1

            # Track by concept
            for concept in concepts:
                concept_stats[concept]["total"] += 1
                if is_correct:
                    concept_stats[concept]["correct"] += 1

        # Calculate overall percentage
        if self.use_weighted_scoring and max_weighted_score > 0:
            percentage = weighted_score / max_weighted_score
        else:
            percentage = correct / total if total > 0 else 0.0

        # Process difficulty scores
        by_difficulty = {}
        difficulty_percentages = []

        for diff_level in sorted(difficulty_stats.keys()):
            stats = difficulty_stats[diff_level]
            diff_pct = stats["correct"] / \
                stats["total"] if stats["total"] > 0 else 0.0
            difficulty_percentages.append(diff_pct)

            by_difficulty[diff_level] = DifficultyScore(
                level=diff_level,
                label=self.DIFFICULTY_LABELS.get(
                    diff_level, f"Level {diff_level}"),
                correct=stats["correct"],
                total=stats["total"],
                percentage=diff_pct
            )

        # Process concept scores
        by_concept = {}
        strong_concepts = []
        weak_concepts = []

        for concept, stats in concept_stats.items():
            if stats["total"] > 0:
                concept_pct = stats["correct"] / stats["total"]
                status = self._determine_concept_status(concept_pct)
                mastered = concept_pct >= self.concept_mastery_threshold

                by_concept[concept] = ConceptScore(
                    concept=concept,
                    correct=stats["correct"],
                    total=stats["total"],
                    percentage=concept_pct,
                    status=status,
                    mastered=mastered
                )

                if status == "strong":
                    strong_concepts.append(concept)
                elif status == "weak":
                    weak_concepts.append(concept)

        # Calculate difficulty variance
        difficulty_variance = self._calculate_variance(difficulty_percentages)

        # Detect inverted difficulty pattern
        has_inverted_difficulty = False
        easy_stats = difficulty_stats.get(1, {"correct": 0, "total": 0})
        hard_stats = difficulty_stats.get(3, {"correct": 0, "total": 0})

        if easy_stats["total"] > 0 and hard_stats["total"] > 0:
            easy_pct = easy_stats["correct"] / easy_stats["total"]
            hard_pct = hard_stats["correct"] / hard_stats["total"]
            # Inverted if hard is significantly better than easy
            if hard_pct > easy_pct + 0.25:
                has_inverted_difficulty = True

        # Determine mastery level and confidence
        mastery_level = self._determine_mastery_level(percentage)
        confidence = self._determine_confidence(total)

        return BeltAssessment(
            belt=belt,
            total_questions=total,
            correct_answers=correct,
            percentage=percentage,
            weighted_score=weighted_score,
            max_weighted_score=max_weighted_score,
            mastery_level=mastery_level,
            confidence=confidence,
            by_difficulty=by_difficulty,
            by_concept=by_concept,
            strong_concepts=strong_concepts,
            weak_concepts=weak_concepts,
            difficulty_variance=difficulty_variance,
            has_inverted_difficulty=has_inverted_difficulty
        )

    # -------------------------------------------------------------------------
    # PRIORITY CALCULATION
    # -------------------------------------------------------------------------

    def _get_belt_importance(self, belt: str) -> int:
        """Get importance value for a belt (lower = more important)"""
        return self.belt_importance.get(belt, 99)

    def _get_max_belt_importance(self, belts: List[str]) -> int:
        """Get maximum belt importance from list"""
        if not belts:
            return 10
        return max(self._get_belt_importance(b) for b in belts)

    def _calculate_priority_score(
        self,
        assessment: BeltAssessment,
        max_importance: int
    ) -> Tuple[float, List[str]]:
        """
        Calculate priority score for a belt.

        Higher score = Higher study priority

        Returns:
            Tuple of (priority_score, list of reasons)
        """
        reasons = []
        weights = self.priority_weights

        # Base score: inverse of percentage
        base_score = (1 - assessment.percentage) * weights["base"]

        # Adjustment 1: Easy question performance
        easy_diff = assessment.by_difficulty.get(1)
        if easy_diff and easy_diff.total > 0:
            easy_pct = easy_diff.percentage
            adj_easy = (1 - easy_pct) * weights["easy_performance"]
            if easy_pct < 0.70:
                reasons.append("Fundamental concepts need attention")
        else:
            adj_easy = 0
            easy_pct = 0

        # Adjustment 2: Weak concept count
        weak_count = len(assessment.weak_concepts)
        adj_concepts = weak_count * weights["weak_concepts"]
        if weak_count > 0:
            reasons.append(f"{weak_count} concept(s) need focused study")

        # Adjustment 3: Hard question performance
        hard_diff = assessment.by_difficulty.get(3)
        if hard_diff and hard_diff.total > 0:
            hard_pct = hard_diff.percentage
            adj_hard = (1 - hard_pct) * weights["hard_performance"]
        else:
            adj_hard = 0
            hard_pct = 0

        # Adjustment 4: Belt importance
        belt_importance = self._get_belt_importance(assessment.belt)
        adj_importance = (max_importance - belt_importance) * \
            weights["belt_importance"]
        if belt_importance <= 2:
            reasons.append("Foundational belt - prioritize for strong base")

        # Adjustment 5: Mastery level penalty
        if assessment.mastery_level == MasteryLevel.NEEDS_FULL_COURSE:
            adj_level = weights["full_course_penalty"]
            reasons.append("Requires comprehensive course study")
        else:
            adj_level = 0
            reasons.append("Review and reinforcement recommended")

        # Adjustment 6: High variance penalty
        if assessment.difficulty_variance > 0.1:
            adj_variance = weights["variance_penalty"]
            reasons.append("Inconsistent performance across difficulty levels")
        else:
            adj_variance = 0

        # Calculate total
        priority_score = (
            base_score +
            adj_easy +
            adj_concepts +
            adj_hard +
            adj_importance +
            adj_level +
            adj_variance
        )

        return priority_score, reasons

    def _calculate_study_priority(
        self,
        assessments: Dict[str, BeltAssessment]
    ) -> List[PriorityItem]:
        """
        Calculate priority order for all belts needing study.

        Applies tiebreaker logic when scores are equal.
        """
        # Filter to only belts needing study
        study_belts = {
            belt: assess for belt, assess in assessments.items()
            if assess.needs_study
        }

        if not study_belts:
            return []

        # Get max importance for calculations
        max_importance = self._get_max_belt_importance(
            list(study_belts.keys()))

        # Calculate priority for each belt
        priority_items = []

        for belt, assessment in study_belts.items():
            priority_score, reasons = self._calculate_priority_score(
                assessment, max_importance
            )

            # Get difficulty percentages for tiebreaking
            easy_diff = assessment.by_difficulty.get(1)
            hard_diff = assessment.by_difficulty.get(3)

            easy_pct = easy_diff.percentage if easy_diff else 0.0
            hard_pct = hard_diff.percentage if hard_diff else 0.0

            priority_items.append(PriorityItem(
                rank=0,  # Will be set after sorting
                belt=belt,
                priority_score=priority_score,
                percentage=assessment.percentage,
                mastery_level=assessment.mastery_level.value,
                reasons=reasons,
                weak_concepts=assessment.weak_concepts.copy(),
                easy_percentage=easy_pct,
                hard_percentage=hard_pct,
                weak_concept_count=len(assessment.weak_concepts),
                belt_importance=self._get_belt_importance(belt)
            ))

        # Sort with tiebreakers
        priority_items = self._sort_with_tiebreakers(priority_items)

        # Assign ranks
        for i, item in enumerate(priority_items, 1):
            item.rank = i

        return priority_items

    def _sort_with_tiebreakers(
        self,
        items: List[PriorityItem]
    ) -> List[PriorityItem]:
        """
        Sort priority items with comprehensive tiebreaker logic.

        Tiebreaker order:
        1. Priority score (higher = first)
        2. Easy question percentage (lower = first)
        3. Weak concept count (higher = first)
        4. Hard question percentage (lower = first)
        5. Belt importance (lower number = first)
        6. Alphabetical by belt name
        """
        return sorted(
            items,
            key=lambda x: (
                -x.priority_score,           # Higher score first
                x.easy_percentage,           # Lower easy % first
                -x.weak_concept_count,       # More weak concepts first
                x.hard_percentage,           # Lower hard % first
                x.belt_importance,           # Lower importance number first
                x.belt                       # Alphabetical
            )
        )

    # -------------------------------------------------------------------------
    # FLAG DETECTION
    # -------------------------------------------------------------------------

    def _detect_flags(
        self,
        assessments: Dict[str, BeltAssessment]
    ) -> List[str]:
        """Detect anomalies and edge cases"""
        flags = []

        if not assessments:
            flags.append("NO_ASSESSMENTS")
            return flags

        valid_assessments = [
            a for a in assessments.values()
            if a.mastery_level != MasteryLevel.NOT_ASSESSED
        ]

        if not valid_assessments:
            flags.append("NO_VALID_ASSESSMENTS")
            return flags

        percentages = [a.percentage for a in valid_assessments]

        # Check for all zero scores
        if all(p == 0 for p in percentages):
            flags.append("ALL_ZERO_SCORE")

        # Check for all perfect scores
        if all(p == 1.0 for p in percentages):
            flags.append("ALL_PERFECT_SCORE")

        # Check for all equal scores
        if len(set(percentages)) == 1 and len(percentages) > 1:
            flags.append("ALL_EQUAL_SCORES")

        # Check for low confidence
        low_confidence_count = sum(
            1 for a in valid_assessments
            if a.confidence in [ConfidenceLevel.LOW, ConfidenceLevel.VERY_LOW]
        )
        if low_confidence_count > 0:
            flags.append("LOW_CONFIDENCE_ASSESSMENTS")

        # Check for inverted difficulty patterns
        inverted_count = sum(
            1 for a in valid_assessments
            if a.has_inverted_difficulty
        )
        if inverted_count > 0:
            flags.append("INVERTED_DIFFICULTY_PATTERN")

        # Check for high variance
        high_variance_count = sum(
            1 for a in valid_assessments
            if a.difficulty_variance > 0.15
        )
        if high_variance_count > 0:
            flags.append("HIGH_VARIANCE_DETECTED")

        # Check for single belt
        if len(valid_assessments) == 1:
            flags.append("SINGLE_BELT_ASSESSED")

        # Check for borderline scores
        thresholds = [
            self.mastery_threshold,
            self.fully_mastered_threshold,
            self.review_threshold
        ]
        for a in valid_assessments:
            for threshold in thresholds:
                if abs(a.percentage - threshold) < 0.01:
                    flags.append("BORDERLINE_SCORE")
                    break

        return list(set(flags))  # Remove duplicates

    # -------------------------------------------------------------------------
    # INSIGHTS GENERATION
    # -------------------------------------------------------------------------

    def _generate_strengths(
        self,
        assessments: Dict[str, BeltAssessment]
    ) -> List[str]:
        """Generate list of strengths"""
        strengths = []

        # Mastered belts
        mastered_belts = [
            belt for belt, a in assessments.items()
            if a.can_skip
        ]
        if mastered_belts:
            strengths.append(
                f"Strong performance in: {', '.join(mastered_belts)}")

        # Strong concepts across all belts
        all_strong = []
        for a in assessments.values():
            all_strong.extend(a.strong_concepts)

        # Count frequencies
        concept_counts = defaultdict(int)
        for concept in all_strong:
            concept_counts[concept] += 1

        # Top strong concepts
        top_strong = sorted(
            concept_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]

        for concept, count in top_strong:
            strengths.append(f"Solid understanding of: {concept}")

        # Check difficulty strengths
        diff_totals = defaultdict(lambda: {"correct": 0, "total": 0})
        for a in assessments.values():
            for diff, score in a.by_difficulty.items():
                diff_totals[diff]["correct"] += score.correct
                diff_totals[diff]["total"] += score.total

        for diff, stats in diff_totals.items():
            if stats["total"] > 0:
                pct = stats["correct"] / stats["total"]
                if pct >= 0.85:
                    label = self.DIFFICULTY_LABELS.get(diff, f"Level {diff}")
                    strengths.append(
                        f"Excellent on {label} questions ({pct:.0%})")

        return strengths

    def _generate_weaknesses(
        self,
        assessments: Dict[str, BeltAssessment]
    ) -> List[str]:
        """Generate list of weaknesses"""
        weaknesses = []

        # Belts needing full course
        full_course_belts = [
            belt for belt, a in assessments.items()
            if a.mastery_level == MasteryLevel.NEEDS_FULL_COURSE
        ]
        if full_course_belts:
            weaknesses.append(
                f"Needs comprehensive work in: {', '.join(full_course_belts)}")

        # Weak concepts across all belts
        all_weak = []
        for a in assessments.values():
            all_weak.extend(a.weak_concepts)

        # Count frequencies
        concept_counts = defaultdict(int)
        for concept in all_weak:
            concept_counts[concept] += 1

        # Top weak concepts
        top_weak = sorted(
            concept_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]

        for concept, count in top_weak:
            weaknesses.append(f"Review needed for: {concept}")

        # Check difficulty weaknesses
        diff_totals = defaultdict(lambda: {"correct": 0, "total": 0})
        for a in assessments.values():
            for diff, score in a.by_difficulty.items():
                diff_totals[diff]["correct"] += score.correct
                diff_totals[diff]["total"] += score.total

        for diff, stats in diff_totals.items():
            if stats["total"] > 0:
                pct = stats["correct"] / stats["total"]
                if pct < 0.40:
                    label = self.DIFFICULTY_LABELS.get(diff, f"Level {diff}")
                    weaknesses.append(
                        f"Struggles with {label} questions ({pct:.0%})")

        return weaknesses

    def _generate_study_plan(
        self,
        study_priority: List[PriorityItem],
        belts_to_review: List[str],
        flags: List[str]
    ) -> List[str]:
        """Generate personalized study plan"""
        plan = []

        # Handle edge cases first
        if "ALL_PERFECT_SCORE" in flags:
            plan.append(
                "🌟 Perfect performance! You've fully mastered all assessed areas.")
            plan.append(
                "Consider advancing to higher-level content or mentoring others.")
            return plan

        if "ALL_ZERO_SCORE" in flags:
            plan.append("📚 Comprehensive study recommended for all belts.")
            plan.append(
                "⚠️ Note: Consider verifying test was completed correctly.")

        if not study_priority:
            plan.append(
                "🎉 Excellent! You've demonstrated mastery across all assessed belts.")
            plan.append(
                "Consider exploring advanced topics or helping other learners.")
            return plan

        # Separate full course and review belts
        full_course = [
            p.belt for p in study_priority
            if p.mastery_level == "needs_full_course"
        ]
        review_only = [
            p.belt for p in study_priority
            if p.mastery_level == "needs_review"
        ]

        if full_course:
            plan.append(
                f"📚 Start with complete courses for: {', '.join(full_course)}")

        if review_only:
            plan.append(
                f"📖 Review materials recommended for: {', '.join(review_only)}")

        # Collect all weak concepts
        all_weak_concepts = []
        for p in study_priority:
            all_weak_concepts.extend(p.weak_concepts)

        unique_weak = list(dict.fromkeys(all_weak_concepts))[:5]
        if unique_weak:
            plan.append(f"🎯 Focus especially on: {', '.join(unique_weak)}")

        # Top priority recommendation
        if study_priority:
            top = study_priority[0]
            plan.append(
                f"⭐ Recommended to start with: {top.belt} "
                f"(Score: {top.percentage:.0%})"
            )

        # Add flag-based recommendations
        if "INVERTED_DIFFICULTY_PATTERN" in flags:
            plan.append(
                "💡 Unusual pattern detected: Review fundamental concepts carefully.")

        if "LOW_CONFIDENCE_ASSESSMENTS" in flags:
            plan.append(
                "ℹ️ Some assessments based on few questions - consider additional testing.")

        return plan

    # -------------------------------------------------------------------------
    # MAIN EVALUATION METHOD
    # -------------------------------------------------------------------------

    def evaluate(
        self,
        questions: List[Dict],
        answers: List[int]
    ) -> Dict[str, Any]:
        """
        Evaluate placement test and return API-friendly summary.

        Args:
            questions: List of question dictionaries from the test
            answers: List of answer indices provided by the student

        Returns:
            Dictionary with placement decision and detailed analysis
        """
        # Validate inputs
        if len(questions) != len(answers):
            raise ValueError(
                f"Questions ({len(questions)}) and answers ({len(answers)}) "
                "must have same length"
            )

        if not questions:
            return self._empty_result()

        # Get unique belts
        belts = set(q.get("belt") for q in questions if q.get("belt"))

        if not belts:
            return self._empty_result()

        # Assess each belt independently
        assessments: Dict[str, BeltAssessment] = {}
        for belt in belts:
            assessments[belt] = self._assess_belt(questions, answers, belt)

        # Categorize belts
        belts_to_study = []
        belts_to_skip = []
        belts_to_review = []

        for belt, assessment in assessments.items():
            if assessment.mastery_level == MasteryLevel.NOT_ASSESSED:
                continue
            elif assessment.can_skip:
                belts_to_skip.append(belt)
            elif assessment.mastery_level == MasteryLevel.NEEDS_REVIEW:
                belts_to_review.append(belt)
                belts_to_study.append(belt)
            elif assessment.mastery_level == MasteryLevel.NEEDS_FULL_COURSE:
                belts_to_study.append(belt)

        # Calculate study priority
        study_priority = self._calculate_study_priority(assessments)

        # Calculate overall readiness
        valid_assessments = [
            a for a in assessments.values()
            if a.mastery_level != MasteryLevel.NOT_ASSESSED
        ]

        if valid_assessments:
            total_weighted = sum(a.weighted_score for a in valid_assessments)
            max_weighted = sum(a.max_weighted_score for a in valid_assessments)
            overall_readiness = (
                total_weighted / max_weighted * 100) if max_weighted > 0 else 0
        else:
            overall_readiness = 0

        # Detect flags
        flags = self._detect_flags(assessments)

        # Generate insights
        strengths = self._generate_strengths(assessments)
        weaknesses = self._generate_weaknesses(assessments)
        study_plan = self._generate_study_plan(
            study_priority, belts_to_review, flags)

        # Build API summary
        return {
            "overall_readiness": round(overall_readiness, 1),
            "total_questions": len(questions),
            "total_correct": sum(a.correct_answers for a in valid_assessments),
            "belts_assessed": len(valid_assessments),

            "belts_to_study": belts_to_study,
            "belts_to_skip": belts_to_skip,
            "belts_to_review": belts_to_review,

            "study_priority": [
                {
                    "rank": p.rank,
                    "belt": p.belt,
                    "score_percentage": round(p.percentage * 100, 1),
                    "status": p.mastery_level,
                    "reasons": p.reasons,
                    "weak_concepts": p.weak_concepts,
                    "priority_score": round(p.priority_score, 2)
                }
                for p in study_priority
            ],

            "belt_details": {
                belt: {
                    "score_percentage": round(a.percentage * 100, 1),
                    "correct": a.correct_answers,
                    "total": a.total_questions,
                    "status": a.mastery_level.value,
                    "confidence": a.confidence.value,
                    "by_difficulty": {
                        str(d): {
                            "label": s.label,
                            "correct": s.correct,
                            "total": s.total,
                            "percentage": round(s.percentage * 100, 1)
                        }
                        for d, s in a.by_difficulty.items()
                    },
                    "strong_concepts": a.strong_concepts,
                    "weak_concepts": a.weak_concepts
                }
                for belt, a in assessments.items()
                if a.mastery_level != MasteryLevel.NOT_ASSESSED
            },

            "study_plan": study_plan,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "flags": flags
        }

    def _empty_result(self) -> Dict[str, Any]:
        """Return empty result for edge cases"""
        return {
            "overall_readiness": 0,
            "total_questions": 0,
            "total_correct": 0,
            "belts_assessed": 0,
            "belts_to_study": [],
            "belts_to_skip": [],
            "belts_to_review": [],
            "study_priority": [],
            "belt_details": {},
            "study_plan": ["No questions available for assessment."],
            "strengths": [],
            "weaknesses": [],
            "flags": ["NO_DATA"]
        }


# =============================================================================
# CONVENIENCE FUNCTION
# =============================================================================

def evaluate_placement_test(
    questions: List[Dict],
    answers: List[int],
    config: Optional[Dict] = None
) -> Dict[str, Any]:
    """
    Evaluate a placement test and return API-friendly summary.

    Args:
        questions: List of question dictionaries from the test
        answers: List of student's answer indices (same order as questions)
        config: Optional configuration dictionary

    Returns:
        Dictionary with placement decision and detailed analysis

    Example:
        >>> result = evaluate_placement_test(questions, student_answers)
        >>> print(result["belts_to_study"])
        ['Yellow Belt', 'Orange Belt']
        >>> print(result["overall_readiness"])
        56.7
    """
    evaluator = PlacementTestEvaluator(config)
    return evaluator.evaluate(questions, answers)


# =============================================================================
# PRETTY PRINT FUNCTION
# =============================================================================

def print_evaluation_report(result: Dict[str, Any]) -> None:
    """Print a formatted evaluation report"""

    print("\n" + "=" * 70)
    print("📊 PLACEMENT TEST EVALUATION REPORT")
    print("=" * 70)

    # Overall Readiness
    readiness = result["overall_readiness"]
    if readiness >= 80:
        emoji = "🌟"
    elif readiness >= 60:
        emoji = "👍"
    elif readiness >= 40:
        emoji = "📚"
    else:
        emoji = "🎯"

    print(f"\n{emoji} OVERALL READINESS: {readiness}%")
    print(
        f"   Questions: {result['total_correct']}/{result['total_questions']} correct")
    print(f"   Belts Assessed: {result['belts_assessed']}")

    # Flags
    if result["flags"]:
        print(f"\n   ⚠️ Flags: {', '.join(result['flags'])}")

    # Placement Decision
    print("\n" + "-" * 70)
    print("🎯 PLACEMENT DECISION")
    print("-" * 70)

    if result["belts_to_skip"]:
        print(f"\n   ✅ CAN SKIP ({len(result['belts_to_skip'])} belt(s)):")
        for belt in result["belts_to_skip"]:
            details = result["belt_details"].get(belt, {})
            pct = details.get("score_percentage", 0)
            status = details.get("status", "unknown")
            print(f"      • {belt}: {pct}% - {status}")

    if result["belts_to_review"]:
        print(
            f"\n   📖 NEEDS REVIEW ({len(result['belts_to_review'])} belt(s)):")
        for belt in result["belts_to_review"]:
            details = result["belt_details"].get(belt, {})
            pct = details.get("score_percentage", 0)
            weak = details.get("weak_concepts", [])
            print(f"      • {belt}: {pct}%")
            if weak:
                print(f"        Focus on: {', '.join(weak)}")

    full_course = [
        b for b in result["belts_to_study"]
        if b not in result["belts_to_review"]
    ]
    if full_course:
        print(f"\n   📚 NEEDS FULL COURSE ({len(full_course)} belt(s)):")
        for belt in full_course:
            details = result["belt_details"].get(belt, {})
            pct = details.get("score_percentage", 0)
            print(f"      • {belt}: {pct}%")

    # Study Priority
    if result["study_priority"]:
        print("\n" + "-" * 70)
        print("📋 RECOMMENDED STUDY ORDER")
        print("-" * 70)

        for item in result["study_priority"]:
            print(f"\n   {item['rank']}. {item['belt']}")
            print(f"      Score: {item['score_percentage']}%")
            print(f"      Status: {item['status'].replace('_', ' ').title()}")
            print(f"      Priority Score: {item['priority_score']}")
            if item["reasons"]:
                print(f"      Why: {'; '.join(item['reasons'])}")
            if item["weak_concepts"]:
                print(f"      Focus Areas: {', '.join(item['weak_concepts'])}")

    # Belt Details
    print("\n" + "-" * 70)
    print("📈 DETAILED BELT ANALYSIS")
    print("-" * 70)

    for belt, details in result["belt_details"].items():
        status_emoji = "✅" if belt in result["belts_to_skip"] else "📚"
        print(f"\n   {status_emoji} {belt}")
        print(f"      Score: {details['correct']}/{details['total']} "
              f"({details['score_percentage']}%)")
        print(f"      Status: {details['status'].replace('_', ' ').title()}")
        print(
            f"      Confidence: {details['confidence'].replace('_', ' ').title()}")

        # Difficulty breakdown
        if details["by_difficulty"]:
            diff_parts = []
            for diff_key in sorted(details["by_difficulty"].keys()):
                d = details["by_difficulty"][diff_key]
                diff_parts.append(
                    f"{d['label']}: {d['correct']}/{d['total']} ({d['percentage']}%)"
                )
            print(f"      By Difficulty: {' | '.join(diff_parts)}")

        if details["strong_concepts"]:
            print(f"      💪 Strong: {', '.join(details['strong_concepts'])}")
        if details["weak_concepts"]:
            print(f"      ⚠️ Weak: {', '.join(details['weak_concepts'])}")

    # Study Plan
    if result["study_plan"]:
        print("\n" + "-" * 70)
        print("📝 PERSONALIZED STUDY PLAN")
        print("-" * 70)
        for item in result["study_plan"]:
            print(f"\n   {item}")

    # Strengths & Weaknesses
    if result["strengths"]:
        print("\n   💪 STRENGTHS:")
        for s in result["strengths"]:
            print(f"      • {s}")

    if result["weaknesses"]:
        print("\n   ⚠️ AREAS FOR IMPROVEMENT:")
        for w in result["weaknesses"]:
            print(f"      • {w}")

    print("\n" + "=" * 70)

"""
NGen Placement Test Evaluation Engine
=====================================
Evaluates student answers from the soft-skills placement test
and generates comprehensive reports for instructors.

Author: NGen EdTech Platform
"""
from rich import print
import json
import os
import random
from collections import defaultdict
from datetime import datetime
from typing import Dict, List, Optional, Tuple


# ============================================================
# 1. CONSTANTS & CONFIGURATION
# ============================================================

TRAITS = [
    "social",
    "communication",
    "problem_solving",
    "time_management",
    "teamwork",
    "leadership",
    "creativity",
    "critical_thinking",
    "emotional_intelligence",
    "adaptability"
]

TRAIT_LABELS = {
    "social": {"en": "Social Skills", "ar": "المهارات الاجتماعية"},
    "communication": {"en": "Communication Skills", "ar": "مهارات التواصل"},
    "problem_solving": {"en": "Problem-Solving Skills", "ar": "مهارات حل المشكلات"},
    "time_management": {"en": "Time Management Skills", "ar": "مهارات إدارة الوقت"},
    "teamwork": {"en": "Teamwork Skills", "ar": "مهارات العمل الجماعي"},
    "leadership": {"en": "Leadership Skills", "ar": "مهارات القيادة"},
    "creativity": {"en": "Creativity Skills", "ar": "مهارات الإبداع"},
    "critical_thinking": {"en": "Critical Thinking Skills", "ar": "مهارات التفكير النقدي"},
    "emotional_intelligence": {"en": "Emotional Intelligence", "ar": "الذكاء العاطفي"},
    "adaptability": {"en": "Adaptability Skills", "ar": "مهارات القدرة على التكيف"}
}

WORK_STYLE_LABELS = {
    "individual": {"en": "Independent Worker", "ar": "عامل مستقل"},
    "collaborative": {"en": "Team Collaborator", "ar": "متعاون جماعي"},
    "leader": {"en": "Natural Leader", "ar": "قائد طبيعي"},
    "supporter": {"en": "Supportive Team Member", "ar": "عضو فريق داعم"}
}

LEARNING_APPROACH_LABELS = {
    "hands_on": {"en": "Hands-On Learner", "ar": "متعلم عملي"},
    "analytical": {"en": "Analytical Learner", "ar": "متعلم تحليلي"},
    "social_learner": {"en": "Social Learner", "ar": "متعلم اجتماعي"},
    "structured": {"en": "Structured Learner", "ar": "متعلم منظم"}
}

CHALLENGE_RESPONSE_LABELS = {
    "persistent": {"en": "Persistent & Determined", "ar": "مثابر وعازم"},
    "adaptive": {"en": "Flexible & Adaptive", "ar": "مرن ومتكيف"},
    "help_seeking": {"en": "Collaborative Problem-Solver", "ar": "حلّال مشكلات تعاوني"},
    "creative_solver": {"en": "Creative Problem-Solver", "ar": "حلّال مشكلات إبداعي"}
}

DECISION_STYLE_LABELS = {
    "decisive": {"en": "Quick & Decisive", "ar": "سريع وحاسم"},
    "deliberate": {"en": "Thoughtful & Deliberate", "ar": "متأنٍ ومتعمّد"},
    "consultative": {"en": "Consultative & Inclusive", "ar": "استشاري وشامل"},
    "spontaneous": {"en": "Spontaneous & Intuitive", "ar": "عفوي وحدسي"}
}

LEARNING_PACE_LABELS = {
    "fast": {
        "en": "Fast Learner — Picks up new concepts quickly and may need advanced challenges",
        "ar": "متعلم سريع — يستوعب المفاهيم الجديدة بسرعة وقد يحتاج تحديات متقدمة"
    },
    "steady": {
        "en": "Steady Learner — Progresses consistently with regular practice and structure",
        "ar": "متعلم ثابت — يتقدم بثبات مع الممارسة المنتظمة والهيكلة"
    },
    "reflective": {
        "en": "Reflective Learner — Takes time to process deeply; benefits from patient guidance",
        "ar": "متعلم تأملي — يأخذ وقتاً للمعالجة العميقة؛ يستفيد من التوجيه الصبور"
    },
    "exploratory": {
        "en": "Exploratory Learner — Learns best through experimentation and creative exploration",
        "ar": "متعلم استكشافي — يتعلم بشكل أفضل من خلال التجربة والاستكشاف الإبداعي"
    }
}

GROUP_TYPE_LABELS = {
    "competitive": {
        "en": "Competitive/Challenge-Driven Group",
        "ar": "مجموعة تنافسية/مدفوعة بالتحديات"
    },
    "collaborative": {
        "en": "Collaborative/Supportive Group",
        "ar": "مجموعة تعاونية/داعمة"
    },
    "creative": {
        "en": "Creative/Exploratory Group",
        "ar": "مجموعة إبداعية/استكشافية"
    },
    "structured": {
        "en": "Structured/Goal-Oriented Group",
        "ar": "مجموعة منظمة/موجهة بالأهداف"
    },
    "mixed": {
        "en": "Mixed/Balanced Group",
        "ar": "مجموعة مختلطة/متوازنة"
    }
}

EFFORT_LEVEL_LABELS = {
    "low": {
        "en": "Low — Student is self-driven and needs minimal push",
        "ar": "منخفض — الطالب ذاتي الدافع ويحتاج دفعاً بسيطاً"
    },
    "moderate": {
        "en": "Moderate — Student benefits from regular check-ins and encouragement",
        "ar": "متوسط — الطالب يستفيد من المتابعة المنتظمة والتشجيع"
    },
    "high": {
        "en": "High — Student needs structured support, frequent guidance, and patience",
        "ar": "عالي — الطالب يحتاج دعماً منظماً وتوجيهاً متكرراً وصبراً"
    }
}


# ============================================================
# 2. QUESTION BANK — LOADED FROM JSON
# ============================================================

def load_question_bank(filepath: str = None) -> Dict[str, list]:
    """
    Load questions from questions_en_ar.json and organize by age group.
    Maps JSON fields to the internal format expected by the evaluator.

    Returns:
        {"6-9": [...], "10-14": [...], "15-18": [...]}
        Each question dict contains: id, question_en, question_ar, concepts, options_scoring
    """
    if filepath is None:
        filepath = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), "questions_en_ar.json")

    with open(filepath, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    question_bank = {"6-9": [], "10-14": [], "15-18": []}
    counters = {"6-9": 0, "10-14": 0, "15-18": 0}

    for item in raw_data:
        age_group = item.get("age_group", "")
        if age_group not in question_bank:
            continue

        counters[age_group] += 1

        question = {
            "id": counters[age_group],
            "question_en": item.get("question_en", ""),
            "question_ar": item.get("question_ar", ""),
            "options_en": item.get("options_en", []),
            "options_ar": item.get("options_ar", []),
            "concepts": item.get("concepts_en", item.get("concepts", [])),
            "options_scoring": item.get("options_scoring", [])
        }
        question_bank[age_group].append(question)

    return question_bank


# Load once at module level
QUESTION_BANK = load_question_bank()


# ============================================================
# 3. CORE EVALUATION ENGINE
# ============================================================

class PlacementTestEvaluator:
    """
    Advanced evaluation engine for NGen placement test.
    Analyzes student answers and generates comprehensive behavioral reports.
    """

    def __init__(self, age_group: str):
        self.age_group = age_group
        self.questions = QUESTION_BANK.get(age_group, [])
        if not self.questions:
            raise ValueError(
                f"No question bank found for age group: {age_group}")

    # ----------------------------------------------------------
    # 3a. MAIN EVALUATION PIPELINE
    # ----------------------------------------------------------

    def evaluate(self, student_info: Dict, answers: Dict[int, int]) -> Dict:
        """
        Main evaluation function.

        Args:
            student_info: {
                "name": str,
                "age": int,
                "student_id": str
            }
            answers: {question_id: selected_option_index (0-3)}

        Returns:
            Complete evaluation report as a dictionary.
        """
        # Step 1: Validate answers
        validated_answers = self._validate_answers(answers)

        # Step 2: Calculate raw trait scores
        raw_trait_scores, max_possible_scores = self._calculate_raw_trait_scores(
            validated_answers)

        # Step 3: Normalize trait scores to 0-100
        normalized_scores = self._normalize_scores(
            raw_trait_scores, max_possible_scores)

        # Step 4: Collect behavioral indicators
        indicator_counts = self._collect_indicators(validated_answers)

        # Step 5: Derive behavioral dimensions
        work_style = self._derive_dimension(
            indicator_counts, "work_style", WORK_STYLE_LABELS)
        learning_approach = self._derive_dimension(
            indicator_counts, "learning_approach", LEARNING_APPROACH_LABELS)
        challenge_response = self._derive_dimension(
            indicator_counts, "challenge_response", CHALLENGE_RESPONSE_LABELS)
        decision_style = self._derive_dimension(
            indicator_counts, "decision_style", DECISION_STYLE_LABELS)

        # Step 6: Determine learning pace
        learning_pace = self._determine_learning_pace(
            normalized_scores, indicator_counts)

        # Step 7: Determine group placement
        group_placement = self._determine_group_placement(
            normalized_scores, work_style, learning_approach)

        # Step 8: Determine instructor effort level
        effort_level = self._determine_effort_level(
            normalized_scores, indicator_counts)

        # Step 9: Identify strengths and growth areas
        strengths = self._identify_strengths(normalized_scores)
        growth_areas = self._identify_growth_areas(normalized_scores)

        # Step 10: Calculate trait

        # Step 10: Calculate trait category levels
        trait_categories = self._categorize_traits(normalized_scores)

        # Step 11: Generate personality summary
        personality_summary = self._generate_personality_summary(
            normalized_scores, work_style, learning_approach,
            challenge_response, decision_style, learning_pace
        )

        # Step 12: Generate instructor recommendations
        instructor_recommendations = self._generate_instructor_recommendations(
            normalized_scores, work_style, learning_approach,
            challenge_response, learning_pace, effort_level, group_placement
        )

        # Step 13: Generate motivation strategies
        motivation_strategies = self._generate_motivation_strategies(
            normalized_scores, work_style, learning_approach, challenge_response
        )

        # Step 14: Compile the full report
        report = {
            "meta": {
                "student_name": student_info.get("name", "Unknown"),
                "student_id": student_info.get("student_id", "N/A"),
                "age": student_info.get("age", 0),
                "age_group": self.age_group,
                "total_questions_answered": len(validated_answers),
                "evaluation_date": datetime.now().isoformat(),
                "report_version": "2.0"
            },
            "trait_scores": {
                trait: {
                    "score": round(normalized_scores.get(trait, 0), 1),
                    "category": trait_categories.get(trait, "unknown"),
                    "label_en": TRAIT_LABELS[trait]["en"],
                    "label_ar": TRAIT_LABELS[trait]["ar"]
                }
                for trait in TRAITS
            },
            "behavioral_dimensions": {
                "work_style": work_style,
                "learning_approach": learning_approach,
                "challenge_response": challenge_response,
                "decision_style": decision_style
            },
            "learning_profile": {
                "learning_pace": learning_pace,
                "group_placement": group_placement,
                "effort_level": effort_level
            },
            "strengths": strengths,
            "growth_areas": growth_areas,
            "personality_summary": personality_summary,
            "instructor_recommendations": instructor_recommendations,
            "motivation_strategies": motivation_strategies,
            "raw_data": {
                "raw_trait_scores": raw_trait_scores,
                "max_possible_scores": max_possible_scores,
                "indicator_counts": indicator_counts,
                "answers": validated_answers
            }
        }

        return report

    # ----------------------------------------------------------
    # 3b. VALIDATION
    # ----------------------------------------------------------

    def _validate_answers(self, answers: Dict[int, int]) -> Dict[int, int]:
        """Validate answers against available questions."""
        valid_question_ids = {q["id"] for q in self.questions}
        validated = {}
        for qid, option_idx in answers.items():
            qid = int(qid)
            if qid in valid_question_ids and 0 <= option_idx <= 3:
                validated[qid] = option_idx
        return validated

    # ----------------------------------------------------------
    # 3c. RAW TRAIT SCORE CALCULATION
    # ----------------------------------------------------------

    def _calculate_raw_trait_scores(
        self, answers: Dict[int, int]
    ) -> Tuple[Dict[str, float], Dict[str, float]]:
        """
        Calculate raw trait scores based on student answers.
        Also calculates maximum possible scores for normalization.
        """
        raw_scores = defaultdict(float)
        max_scores = defaultdict(float)

        for question in self.questions:
            qid = question["id"]
            if qid not in answers:
                continue

            option_idx = answers[qid]
            selected_scoring = question["options_scoring"][option_idx]

            # Add selected option's trait scores
            for trait, score in selected_scoring["traits"].items():
                if trait in TRAITS:
                    raw_scores[trait] += score

            # Calculate max possible for this question (best option per trait)
            for trait in TRAITS:
                max_for_trait = max(
                    opt["traits"].get(trait, 0) for opt in question["options_scoring"]
                )
                max_scores[trait] += max_for_trait

        return dict(raw_scores), dict(max_scores)

    # ----------------------------------------------------------
    # 3d. SCORE NORMALIZATION
    # ----------------------------------------------------------

    def _normalize_scores(
        self, raw_scores: Dict[str, float], max_scores: Dict[str, float]
    ) -> Dict[str, float]:
        """Normalize raw scores to 0-100 scale."""
        normalized = {}
        for trait in TRAITS:
            raw = raw_scores.get(trait, 0)
            max_val = max_scores.get(trait, 1)
            if max_val > 0:
                normalized[trait] = (raw / max_val) * 100
            else:
                normalized[trait] = 0
        return normalized

    # ----------------------------------------------------------
    # 3e. BEHAVIORAL INDICATOR COLLECTION
    # ----------------------------------------------------------

    def _collect_indicators(self, answers: Dict[int, int]) -> Dict[str, Dict[str, int]]:
        """
        Collect behavioral indicator counts across all answered questions.
        Returns: {dimension_name: {indicator_value: count}}
        """
        indicator_counts = {
            "work_style": defaultdict(int),
            "learning_approach": defaultdict(int),
            "challenge_response": defaultdict(int),
            "decision_style": defaultdict(int)
        }

        for question in self.questions:
            qid = question["id"]
            if qid not in answers:
                continue

            option_idx = answers[qid]
            indicators = question["options_scoring"][option_idx]["indicators"]

            for dimension, value in indicators.items():
                if dimension in indicator_counts:
                    indicator_counts[dimension][value] += 1

        return {k: dict(v) for k, v in indicator_counts.items()}

    # ----------------------------------------------------------
    # 3f. DIMENSION DERIVATION
    # ----------------------------------------------------------

    def _derive_dimension(
        self, indicator_counts: Dict, dimension: str, labels: Dict
    ) -> Dict:
        """
        Derive the dominant behavioral dimension from indicator counts.
        Returns primary and secondary dimension with confidence.
        """
        counts = indicator_counts.get(dimension, {})
        if not counts:
            first_key = list(labels.keys())[0]
            return {
                "primary": first_key,
                "primary_label_en": labels[first_key]["en"],
                "primary_label_ar": labels[first_key]["ar"],
                "secondary": None,
                "secondary_label_en": None,
                "secondary_label_ar": None,
                "confidence": 0,
                "distribution": {}
            }

        total = sum(counts.values())
        sorted_counts = sorted(
            counts.items(), key=lambda x: x[1], reverse=True)

        primary = sorted_counts[0][0]
        primary_confidence = round((sorted_counts[0][1] / total) * 100, 1)

        secondary = sorted_counts[1][0] if len(sorted_counts) > 1 else None
        secondary_confidence = round(
            (sorted_counts[1][1] / total) * 100, 1) if secondary else 0

        distribution = {k: round((v / total) * 100, 1)
                        for k, v in counts.items()}

        return {
            "primary": primary,
            "primary_label_en": labels[primary]["en"],
            "primary_label_ar": labels[primary]["ar"],
            "primary_confidence": primary_confidence,
            "secondary": secondary,
            "secondary_label_en": labels[secondary]["en"] if secondary else None,
            "secondary_label_ar": labels[secondary]["ar"] if secondary else None,
            "secondary_confidence": secondary_confidence,
            "distribution": distribution
        }

    # ----------------------------------------------------------
    # 3g. LEARNING PACE DETERMINATION
    # ----------------------------------------------------------

    def _determine_learning_pace(
        self, scores: Dict[str, float], indicators: Dict
    ) -> Dict:
        """
        Determine learning pace based on trait scores and behavioral indicators.
        """
        # Calculate composite indicators
        analytical_score = (
            scores.get("critical_thinking", 0) * 0.35 +
            scores.get("problem_solving", 0) * 0.35 +
            scores.get("time_management", 0) * 0.30
        )

        creative_score = (
            scores.get("creativity", 0) * 0.40 +
            scores.get("adaptability", 0) * 0.35 +
            scores.get("problem_solving", 0) * 0.25
        )

        social_score = (
            scores.get("social", 0) * 0.35 +
            scores.get("communication", 0) * 0.35 +
            scores.get("teamwork", 0) * 0.30
        )

        structured_score = (
            scores.get("time_management", 0) * 0.35 +
            scores.get("critical_thinking", 0) * 0.30 +
            scores.get("adaptability", 0) * 0.20 +
            scores.get("problem_solving", 0) * 0.15
        )

        # Determine challenge response distribution
        challenge_dist = indicators.get("challenge_response", {})
        persistent_pct = challenge_dist.get("persistent", 0)
        creative_pct = challenge_dist.get("creative_solver", 0)
        help_seeking_pct = challenge_dist.get("help_seeking", 0)

        # Decision logic
        pace_scores = {
            "fast": (
                analytical_score * 0.3 +
                (persistent_pct * 100 / max(sum(challenge_dist.values()), 1)) * 0.3 +
                scores.get("adaptability", 0) * 0.2 +
                scores.get("critical_thinking", 0) * 0.2
            ),
            "steady": (
                structured_score * 0.4 +
                scores.get("time_management", 0) * 0.3 +
                scores.get("adaptability", 0) * 0.3
            ),
            "reflective": (
                scores.get("critical_thinking", 0) * 0.3 +
                scores.get("emotional_intelligence", 0) * 0.3 +
                (help_seeking_pct * 100 / max(sum(challenge_dist.values()), 1)) * 0.2 +
                structured_score * 0.2
            ),
            "exploratory": (
                creative_score * 0.4 +
                scores.get("creativity", 0) * 0.3 +
                (creative_pct * 100 / max(sum(challenge_dist.values()), 1)) * 0.3
            )
        }

        # Find top pace
        sorted_paces = sorted(pace_scores.items(),
                              key=lambda x: x[1], reverse=True)
        primary_pace = sorted_paces[0][0]
        secondary_pace = sorted_paces[1][0]

        return {
            "primary": primary_pace,
            "primary_label_en": LEARNING_PACE_LABELS[primary_pace]["en"],
            "primary_label_ar": LEARNING_PACE_LABELS[primary_pace]["ar"],
            "secondary": secondary_pace,
            "secondary_label_en": LEARNING_PACE_LABELS[secondary_pace]["en"],
            "secondary_label_ar": LEARNING_PACE_LABELS[secondary_pace]["ar"],
            "pace_scores": {k: round(v, 1) for k, v in pace_scores.items()}
        }

    # ----------------------------------------------------------
    # 3h. GROUP PLACEMENT DETERMINATION
    # ----------------------------------------------------------

    def _determine_group_placement(
        self, scores: Dict[str, float], work_style: Dict, learning_approach: Dict
    ) -> Dict:
        """
        Determine the best group type for this student.
        """
        ws = work_style.get("primary", "")
        la = learning_approach.get("primary", "")

        group_scores = {
            "competitive": 0,
            "collaborative": 0,
            "creative": 0,
            "structured": 0,
            "mixed": 0
        }

        # Factor 1: Work style influence (weight: 30%)
        ws_map = {
            "leader": {"competitive": 4, "collaborative": 2, "creative": 2, "structured": 3, "mixed": 3},
            "individual": {"competitive": 3, "collaborative": 1, "creative": 4, "structured": 3, "mixed": 2},
            "collaborative": {"competitive": 2, "collaborative": 5, "creative": 3, "structured": 2, "mixed": 3},
            "supporter": {"competitive": 1, "collaborative": 5, "creative": 2, "structured": 3, "mixed": 3}
        }
        for group, val in ws_map.get(ws, {}).items():
            group_scores[group] += val * 0.30

        # Factor 2: Learning approach influence (weight: 25%)
        la_map = {
            "hands_on": {"competitive": 3, "collaborative": 2, "creative": 5, "structured": 2, "mixed": 3},
            "analytical": {"competitive": 4, "collaborative": 2, "creative": 2, "structured": 5, "mixed": 3},
            "social_learner": {"competitive": 2, "collaborative": 5, "creative": 3, "structured": 2, "mixed": 3},
            "structured": {"competitive": 3, "collaborative": 3, "creative": 1, "structured": 5, "mixed": 3}
        }
        for group, val in la_map.get(la, {}).items():
            group_scores[group] += val * 0.25

        # Factor 3: Trait scores influence (weight: 45%)
        # Competitive: high critical_thinking + problem_solving + leadership
        group_scores["competitive"] += (
            (scores.get("critical_thinking", 0) + scores.get("problem_solving",
             0) + scores.get("leadership", 0)) / 300 * 5
        ) * 0.45

        # Collaborative: high teamwork + social + communication
        group_scores["collaborative"] += (
            (scores.get("teamwork", 0) + scores.get("social", 0) +
             scores.get("communication", 0)) / 300 * 5
        ) * 0.45

        # Creative: high creativity + adaptability
        group_scores["creative"] += (
            (scores.get("creativity", 0) + scores.get("adaptability", 0)) / 200 * 5
        ) * 0.45

        # Structured: high time_management + critical_thinking
        group_scores["structured"] += (
            (scores.get("time_management", 0) +
             scores.get("critical_thinking", 0)) / 200 * 5
        ) * 0.45

        # Mixed: moderate across the board
        avg_score = sum(scores.values()) / max(len(scores), 1)
        score_variance = sum(
            (s - avg_score) ** 2 for s in scores.values()) / max(len(scores), 1)
        # Lower variance = more balanced = more suited for mixed
        balance_factor = max(0, (5000 - score_variance) / 5000) * 5
        group_scores["mixed"] += balance_factor * 0.45

        # Find best group
        sorted_groups = sorted(group_scores.items(),
                               key=lambda x: x[1], reverse=True)
        primary_group = sorted_groups[0][0]
        secondary_group = sorted_groups[1][0]

        return {
            "primary": primary_group,
            "primary_label_en": GROUP_TYPE_LABELS[primary_group]["en"],
            "primary_label_ar": GROUP_TYPE_LABELS[primary_group]["ar"],
            "secondary": secondary_group,
            "secondary_label_en": GROUP_TYPE_LABELS[secondary_group]["en"],
            "secondary_label_ar": GROUP_TYPE_LABELS[secondary_group]["ar"],
            "group_scores": {k: round(v, 2) for k, v in group_scores.items()}
        }

    # ----------------------------------------------------------
    # 3i. EFFORT LEVEL DETERMINATION
    # ----------------------------------------------------------

    def _determine_effort_level(
        self, scores: Dict[str, float], indicators: Dict
    ) -> Dict:
        """
        Determine how much instructor effort/push the student needs.
        """
        # Self-drive indicators
        self_drive = (
            scores.get("problem_solving", 0) * 0.20 +
            scores.get("critical_thinking", 0) * 0.20 +
            scores.get("time_management", 0) * 0.20 +
            scores.get("adaptability", 0) * 0.15 +
            scores.get("leadership", 0) * 0.15 +
            scores.get("emotional_intelligence", 0) * 0.10
        )

        # Persistence factor from challenge response
        challenge_dist = indicators.get("challenge_response", {})
        total_challenge = max(sum(challenge_dist.values()), 1)
        persistence = (
            challenge_dist.get("persistent", 0) +
            challenge_dist.get("creative_solver", 0)
        ) / total_challenge * 100

        # Final composite
        effort_composite = self_drive * 0.6 + persistence * 0.4

        if effort_composite >= 65:
            level = "low"
        elif effort_composite >= 40:
            level = "moderate"
        else:
            level = "high"

        return {
            "level": level,
            "label_en": EFFORT_LEVEL_LABELS[level]["en"],
            "label_ar": EFFORT_LEVEL_LABELS[level]["ar"],
            "self_drive_score": round(self_drive, 1),
            "persistence_score": round(persistence, 1),
            "composite_score": round(effort_composite, 1)
        }

    # ----------------------------------------------------------
    # 3j. STRENGTHS & GROWTH AREAS
    # ----------------------------------------------------------

    def _identify_strengths(self, scores: Dict[str, float]) -> List[Dict]:
        """Identify top 3 strengths."""
        sorted_traits = sorted(
            scores.items(), key=lambda x: x[1], reverse=True)
        strengths = []
        for trait, score in sorted_traits[:3]:
            strengths.append({
                "trait": trait,
                "score": round(score, 1),
                "label_en": TRAIT_LABELS[trait]["en"],
                "label_ar": TRAIT_LABELS[trait]["ar"],
                "description_en": self._get_strength_description(trait, score, "en"),
                "description_ar": self._get_strength_description(trait, score, "ar")
            })
        return strengths

    def _identify_growth_areas(self, scores: Dict[str, float]) -> List[Dict]:
        """Identify bottom 3 areas for growth."""
        sorted_traits = sorted(scores.items(), key=lambda x: x[1])
        growth = []
        for trait, score in sorted_traits[:3]:
            growth.append({
                "trait": trait,
                "score": round(score, 1),
                "label_en": TRAIT_LABELS[trait]["en"],
                "label_ar": TRAIT_LABELS[trait]["ar"],
                "description_en": self._get_growth_description(trait, score, "en"),
                "description_ar": self._get_growth_description(trait, score, "ar")
            })
        return growth

    def _get_strength_description(self, trait: str, score: float, lang: str) -> str:
        """Generate contextual strength description."""
        descriptions = {
            "social": {
                "en": "Naturally connects with others and builds relationships easily. Thrives in group settings.",
                "ar": "يتواصل بشكل طبيعي مع الآخرين ويبني العلاقات بسهولة. يزدهر في الإعدادات الجماعية."
            },
            "communication": {
                "en": "Expresses ideas clearly and listens actively. Strong at sharing thoughts and understanding others.",
                "ar": "يعبّر عن الأفكار بوضوح ويستمع بفعالية. قوي في مشاركة الأفكار وفهم الآخرين."
            },
            "problem_solving": {
                "en": "Approaches challenges with determination and finds effective solutions. Doesn't give up easily.",
                "ar": "يتعامل مع التحديات بعزيمة ويجد حلولاً فعالة. لا يستسلم بسهولة."
            },
            "time_management": {
                "en": "Organizes tasks well and understands priorities. Good at balancing responsibilities.",
                "ar": "ينظم المهام جيداً ويفهم الأولويات. جيد في موازنة المسؤوليات."
            },
            "teamwork": {
                "en": "Works well with others and values group contribution. Strong collaborator who supports the team.",
                "ar": "يعمل بشكل جيد مع الآخرين ويقدر المساهمة الجماعية. متعاون قوي يدعم الفريق."
            },
            "leadership": {
                "en": "Takes initiative and guides others effectively. Natural ability to organize and inspire.",
                "ar": "يأخذ المبادرة ويوجه الآخرين بفعالية. قدرة طبيعية على التنظيم والإلهام."
            },
            "creativity": {
                "en": "Thinks outside the box and generates unique ideas. Enjoys exploring new possibilities.",
                "ar": "يفكر خارج الصندوق ويولّد أفكاراً فريدة. يستمتع باستكشاف إمكانيات جديدة."
            },
            "critical_thinking": {
                "en": "Analyzes situations carefully and makes thoughtful decisions. Strong logical reasoning.",
                "ar": "يحلل المواقف بعناية ويتخذ قرارات مدروسة. تفكير منطقي قوي."
            },
            "emotional_intelligence": {
                "en": "Understands emotions well — both their own and others'. Shows empathy and self-awareness.",
                "ar": "يفهم المشاعر جيداً — مشاعره ومشاعر الآخرين. يظهر التعاطف والوعي الذاتي."
            },
            "adaptability": {
                "en": "Adjusts well to new situations and handles change with flexibility. Open to new approaches.",
                "ar": "يتكيف جيداً مع المواقف الجديدة ويتعامل مع التغيير بمرونة. منفتح على أساليب جديدة."
            }
        }
        return descriptions.get(trait, {}).get(lang, "")

    def _get_growth_description(self, trait: str, score: float, lang: str) -> str:
        """Generate contextual growth area description."""
        descriptions = {
            "social": {
                "en": "Could benefit from more group interactions and practice initiating conversations with peers.",
                "ar": "يمكن أن يستفيد من المزيد من التفاعلات الجماعية والتدرب على بدء المحادثات مع الأقران."
            },
            "communication": {
                "en": "May need encouragement to express ideas more openly and practice active listening.",
                "ar": "قد يحتاج للتشجيع على التعبير عن الأفكار بشكل أكثر انفتاحاً والتدرب على الاستماع الفعال."
            },
            "problem_solving": {
                "en": "Could benefit from structured problem-solving exercises and learning to break down complex challenges.",
                "ar": "يمكن أن يستفيد من تمارين حل المشكلات المنظمة وتعلم تقسيم التحديات المعقدة."
            },
            "time_management": {
                "en": "Would benefit from tools and strategies to organize tasks and manage deadlines better.",
                "ar": "سيستفيد من أدوات واستراتيجيات لتنظيم المهام وإدارة المواعيد النهائية بشكل أفضل."
            },
            "teamwork": {
                "en": "Could improve collaboration skills through more group projects and shared activities.",
                "ar": "يمكن تحسين مهارات التعاون من خلال المزيد من المشاريع الجماعية والأنشطة المشتركة."
            },
            "leadership": {
                "en": "Would benefit from opportunities to take charge of small tasks and build confidence in guiding others.",
                "ar": "سيستفيد من فرص لتولي مسؤولية مهام صغيرة وبناء الثقة في توجيه الآخرين."
            },
            "creativity": {
                "en": "Could be encouraged to explore open-ended projects and express ideas in unconventional ways.",
                "ar": "يمكن تشجيعه على استكشاف مشاريع مفتوحة النهاية والتعبير عن الأفكار بطرق غير تقليدية."
            },
            "critical_thinking": {
                "en": "Would benefit from activities that require analysis, comparison, and evaluating different options.",
                "ar": "سيستفيد من أنشطة تتطلب التحليل والمقارنة وتقييم الخيارات المختلفة."
            },
            "emotional_intelligence": {
                "en": "Could benefit from activities that build self-awareness and understanding of others' feelings.",
                "ar": "يمكن أن يستفيد من أنشطة تبني الوعي الذاتي وفهم مشاعر الآخرين."
            },
            "adaptability": {
                "en": "May need gentle exposure to new situations and encouragement to try different approaches.",
                "ar": "قد يحتاج للتعرض اللطيف لمواقف جديدة والتشجيع على تجربة أساليب مختلفة."
            }
        }
        return descriptions.get(trait, {}).get(lang, "")

    # ----------------------------------------------------------
    # 3k. TRAIT CATEGORIZATION
    # ----------------------------------------------------------

    def _categorize_traits(self, scores: Dict[str, float]) -> Dict[str, str]:
        """Categorize each trait into level categories."""
        categories = {}
        for trait, score in scores.items():
            if score >= 80:
                categories[trait] = "very_high"
            elif score >= 65:
                categories[trait] = "high"
            elif score >= 45:
                categories[trait] = "moderate"
            elif score >= 25:
                categories[trait] = "developing"
            else:
                categories[trait] = "emerging"
        return categories

    # ----------------------------------------------------------
    # 3l. PERSONALITY SUMMARY GENERATION
    # ----------------------------------------------------------

    def _generate_personality_summary(
        self, scores, work_style, learning_approach,
        challenge_response, decision_style, learning_pace
    ) -> Dict:
        """Generate a comprehensive personality summary in EN and AR."""

        ws = work_style["primary"]
        la = learning_approach["primary"]
        cr = challenge_response["primary"]
        ds = decision_style["primary"]
        lp = learning_pace["primary"]

        sorted_traits = sorted(
            scores.items(), key=lambda x: x[1], reverse=True)
        top1 = sorted_traits[0][0] if len(sorted_traits) > 0 else ""
        top2 = sorted_traits[1][0] if len(sorted_traits) > 1 else ""
        top3 = sorted_traits[2][0] if len(sorted_traits) > 2 else ""

        # ---- English Summary ----
        summary_en_parts = []

        # Opening
        if ws == "leader":
            summary_en_parts.append(
                "This student shows strong leadership qualities and naturally takes initiative in group settings.")
        elif ws == "collaborative":
            summary_en_parts.append(
                "This student is a natural collaborator who values teamwork and group contribution.")
        elif ws == "supporter":
            summary_en_parts.append(
                "This student is a thoughtful team member who supports others and contributes reliably.")
        else:
            summary_en_parts.append(
                "This student works best independently and shows strong self-direction.")

        # Learning approach
        if la == "hands_on":
            summary_en_parts.append(
                "They learn best through hands-on experimentation and building things directly.")
        elif la == "analytical":
            summary_en_parts.append(
                "They have an analytical mind and prefer to understand concepts deeply before applying them.")
        elif la == "social_learner":
            summary_en_parts.append(
                "They thrive when learning alongside others and benefit from discussion and collaboration.")
        else:
            summary_en_parts.append(
                "They prefer structured learning environments with clear steps and expectations.")

        # Challenge response
        if cr == "persistent":
            summary_en_parts.append(
                "When facing challenges, they show persistence and determination to find a solution.")
        elif cr == "adaptive":
            summary_en_parts.append(
                "They adapt quickly to setbacks and are flexible in finding alternative approaches.")
        elif cr == "help_seeking":
            summary_en_parts.append(
                "They wisely seek help when stuck and leverage others' knowledge to overcome obstacles.")
        else:
            summary_en_parts.append(
                "They approach problems creatively and often find unique or unconventional solutions.")

        # Top traits
        top_trait_names = [
            TRAIT_LABELS[t]["en"] for t in [top1, top2, top3] if t
        ]
        if top_trait_names:
            summary_en_parts.append(
                f"Their strongest areas are {', '.join(top_trait_names[:-1])} and {top_trait_names[-1]}."
                if len(top_trait_names) > 1
                else f"Their strongest area is {top_trait_names[0]}."
            )

        # Learning pace
        if lp == "fast":
            summary_en_parts.append(
                "They tend to pick up new concepts quickly and may benefit from accelerated content.")
        elif lp == "steady":
            summary_en_parts.append(
                "They learn at a consistent pace and do well with regular practice and reinforcement.")
        elif lp == "reflective":
            summary_en_parts.append(
                "They take time to process information deeply and benefit from patient, guided instruction.")
        else:
            summary_en_parts.append(
                "They learn best through exploration and creative experimentation.")

        summary_en = " ".join(summary_en_parts)

        # ---- Arabic Summary ----
        summary_ar_parts = []

        if ws == "leader":
            summary_ar_parts.append(
                "يُظهر هذا الطالب صفات قيادية قوية ويأخذ المبادرة بشكل طبيعي في الإعدادات الجماعية.")
        elif ws == "collaborative":
            summary_ar_parts.append(
                "هذا الطالب متعاون بطبيعته ويقدر العمل الجماعي والمساهمة الجماعية.")
        elif ws == "supporter":
            summary_ar_parts.append(
                "هذا الطالب عضو فريق مدروس يدعم الآخرين ويساهم بشكل موثوق.")
        else:
            summary_ar_parts.append(
                "يعمل هذا الطالب بشكل أفضل بشكل مستقل ويُظهر توجيهاً ذاتياً قوياً.")

        if la == "hands_on":
            summary_ar_parts.append(
                "يتعلم بشكل أفضل من خلال التجربة العملية وبناء الأشياء مباشرة.")
        elif la == "analytical":
            summary_ar_parts.append(
                "يمتلك عقلاً تحليلياً ويفضل فهم المفاهيم بعمق قبل تطبيقها.")
        elif la == "social_learner":
            summary_ar_parts.append(
                "يزدهر عند التعلم مع الآخرين ويستفيد من النقاش والتعاون.")
        else:
            summary_ar_parts.append(
                "يفضل بيئات التعلم المنظمة مع خطوات وتوقعات واضحة.")

        if cr == "persistent":
            summary_ar_parts.append(
                "عند مواجهة التحديات، يُظهر المثابرة والعزيمة لإيجاد حل.")
        elif cr == "adaptive":
            summary_ar_parts.append(
                "يتكيف بسرعة مع الانتكاسات ومرن في إيجاد نهج بديلة.")
        elif cr == "help_seeking":
            summary_ar_parts.append(
                "يطلب المساعدة بحكمة عندما يعلق ويستفيد من معرفة الآخرين لتجاوز العقبات.")
        else:
            summary_ar_parts.append(
                "يتعامل مع المشكلات بشكل إبداعي وغالباً ما يجد حلولاً فريدة أو غير تقليدية.")

        top_trait_names_ar = [
            TRAIT_LABELS[t]["ar"] for t in [top1, top2, top3] if t
        ]
        if top_trait_names_ar:
            summary_ar_parts.append(
                f"أقوى مجالاته هي {' و'.join(top_trait_names_ar)}."
            )

        if lp == "fast":
            summary_ar_parts.append(
                "يميل لاستيعاب المفاهيم الجديدة بسرعة وقد يستفيد من محتوى متقدم.")
        elif lp == "steady":
            summary_ar_parts.append(
                "يتعلم بوتيرة ثابتة ويؤدي بشكل جيد مع الممارسة والتعزيز المنتظم.")
        elif lp == "reflective":
            summary_ar_parts.append(
                "يأخذ وقتاً لمعالجة المعلومات بعمق ويستفيد من التعليم الصبور والموجه.")
        else:
            summary_ar_parts.append(
                "يتعلم بشكل أفضل من خلال الاستكشاف والتجربة الإبداعية.")

        summary_ar = " ".join(summary_ar_parts)

        return {
            "en": summary_en,
            "ar": summary_ar
        }

    # ----------------------------------------------------------
    # 3m. INSTRUCTOR RECOMMENDATIONS
    # ----------------------------------------------------------

    def _generate_instructor_recommendations(
        self, scores, work_style, learning_approach,
        challenge_response, learning_pace, effort_level, group_placement
    ) -> Dict:
        """Generate actionable instructor recommendations."""

        recs_en = []
        recs_ar = []

        ws = work_style["primary"]
        la = learning_approach["primary"]
        cr = challenge_response["primary"]
        lp = learning_pace["primary"]
        el = effort_level["level"]
        gp = group_placement["primary"]

        # 1. Group & Seating
        if ws == "leader":
            recs_en.append(
                "Assign leadership roles in group activities — this student will naturally guide others and perform best when given responsibility.")
            recs_ar.append(
                "كلّف هذا الطالب بأدوار قيادية في الأنشطة الجماعية — سيوجه الآخرين بشكل طبيعي ويؤدي بشكل أفضل عند إعطائه المسؤولية.")
        elif ws == "collaborative":
            recs_en.append(
                "Place in groups with other collaborative students — they thrive when working together and bouncing ideas off peers.")
            recs_ar.append(
                "ضعه في مجموعات مع طلاب تعاونيين آخرين — يزدهر عند العمل معاً وتبادل الأفكار مع الأقران.")
        elif ws == "supporter":
            recs_en.append(
                "Pair with a confident peer — this student supports others well and will contribute more when feeling secure in the team.")
            recs_ar.append(
                "اجعله شريكاً مع زميل واثق — هذا الطالب يدعم الآخرين بشكل جيد وسيساهم أكثر عندما يشعر بالأمان في الفريق.")
        else:
            recs_en.append(
                "Allow individual work time before group activities — this student processes best independently first, then can share insights.")
            recs_ar.append(
                "اسمح بوقت عمل فردي قبل الأنشطة الجماعية — هذا الطالب يعالج بشكل أفضل بشكل مستقل أولاً ثم يمكنه مشاركة الأفكار.")

        # 2. Teaching approach
        if la == "hands_on":
            recs_en.append(
                "Use project-based and hands-on activities. Let them build, experiment, and learn through doing rather than reading.")
            recs_ar.append(
                "استخدم الأنشطة القائمة على المشاريع والعملية. دعه يبني ويجرب ويتعلم من خلال العمل بدلاً من القراءة.")
        elif la == "analytical":
            recs_en.append(
                "Present information logically with clear reasoning. Provide 'why' explanations and encourage them to analyze problems before solving.")
            recs_ar.append(
                "قدم المعلومات بشكل منطقي مع تبرير واضح. قدم تفسيرات 'لماذا' وشجعه على تحليل المشاكل قبل الحل.")
        elif la == "social_learner":
            recs_en.append(
                "Facilitate peer learning and group discussions. This student absorbs best when explaining to others and hearing different perspectives.")
            recs_ar.append(
                "سهّل التعلم من الأقران والنقاشات الجماعية. هذا الطالب يستوعب بشكل أفضل عند الشرح للآخرين وسماع وجهات نظر مختلفة.")
        else:
            recs_en.append(
                "Provide clear instructions, timelines, and structured materials. Break lessons into defined steps with checkpoints.")
            recs_ar.append(
                "قدم تعليمات واضحة وجداول زمنية ومواد منظمة. قسّم الدروس إلى خطوات محددة مع نقاط تفتيش.")

        # 3. Challenge handling
        if cr == "persistent":
            recs_en.append(
                "Give progressively harder challenges — they are motivated by difficulty and won't easily give up.")
            recs_ar.append(
                "قدم تحديات أصعب بشكل تدريجي — يتحفزون من الصعوبة ولن يستسلموا بسهولة.")
        elif cr == "adaptive":
            recs_en.append(
                "Expose them to varied problem types — they adapt well but benefit from stretching their comfort zone.")
            recs_ar.append(
                "عرّضهم لأنواع مشاكل متنوعة — يتكيفون جيداً لكنهم يستفيدون من توسيع منطقة راحتهم.")
        elif cr == "help_seeking":
            recs_en.append(
                "Create a safe environment for asking questions. Pair them with patient mentors and encourage them to attempt solutions before seeking help.")
            recs_ar.append(
                "أنشئ بيئة آمنة لطرح الأسئلة. اجعله شريكاً مع مرشدين صبورين وشجعه على محاولة الحلول قبل طلب المساعدة.")
        else:
            recs_en.append(
                "Encourage open-ended projects where creative problem-solving is valued. Celebrate unconventional approaches.")
            recs_ar.append(
                "شجع المشاريع المفتوحة حيث يُقدَّر حل المشكلات الإبداعي. احتفِ بالنُهج غير التقليدية.")

        # 4. Effort & Motivation
        if el == "low":
            recs_en.append(
                "This student is self-motivated. Provide autonomy and advanced material. Avoid over-managing — trust their process.")
            recs_ar.append(
                "هذا الطالب ذاتي الدافع. وفر الاستقلالية والمواد المتقدمة. تجنب الإدارة المفرطة — ثق بعمليته.")
        elif el == "moderate":
            recs_en.append(
                "Regular check-ins and positive reinforcement will keep them on track. Set clear milestones and celebrate small wins.")
            recs_ar.append(
                "المتابعة المنتظمة والتعزيز الإيجابي سيبقيانه على المسار. حدد معالم واضحة واحتفِ بالإنجازات الصغيرة.")
        else:
            recs_en.append(
                "This student needs frequent encouragement, structured support, and patience. Break tasks into very small steps and offer one-on-one guidance.")
            recs_ar.append(
                "هذا الطالب يحتاج تشجيعاً متكرراً ودعماً منظماً وصبراً. قسّم المهام إلى خطوات صغيرة جداً وقدم توجيهاً فردياً.")

        # 5. Group placement
        recs_en.append(
            f"Recommended group type: {GROUP_TYPE_LABELS[gp]['en']}.")
        recs_ar.append(
            f"نوع المجموعة الموصى بها: {GROUP_TYPE_LABELS[gp]['ar']}.")

        # 6. Pace
        if lp == "fast":
            recs_en.append(
                "Consider placing in an accelerated track or providing bonus challenges to keep engagement high.")
            recs_ar.append(
                "فكر في وضعه في مسار متقدم أو تقديم تحديات إضافية للحفاظ على مستوى عالٍ من المشاركة.")
        elif lp == "reflective":
            recs_en.append(
                "Allow extra processing time and avoid rushing through content. Depth matters more than speed for this student.")
            recs_ar.append(
                "اسمح بوقت معالجة إضافي وتجنب التسرع في المحتوى. العمق أهم من السرعة لهذا الطالب.")

        return {
            "en": recs_en,
            "ar": recs_ar
        }

    # ----------------------------------------------------------
    # 3n. MOTIVATION STRATEGIES
    # ----------------------------------------------------------

    def _generate_motivation_strategies(
        self, scores, work_style, learning_approach, challenge_response
    ) -> Dict:
        """Generate personalized motivation strategies."""

        strategies_en = []
        strategies_ar = []

        ws = work_style["primary"]
        la = learning_approach["primary"]
        cr = challenge_response["primary"]

        # Based on work style
        if ws in ["leader", "individual"]:
            strategies_en.append(
                "Give them ownership over a part of the project to fuel their sense of responsibility and pride.")
            strategies_ar.append(
                "أعطهم ملكية جزء من المشروع لتغذية إحساسهم بالمسؤولية والفخر.")
        else:
            strategies_en.append(
                "Highlight how their contribution makes the team better — they're motivated by belonging and group success.")
            strategies_ar.append(
                "أبرز كيف أن مساهمتهم تجعل الفريق أفضل — يتحفزون من الانتماء ونجاح المجموعة.")

        # Based on top traits
        sorted_traits = sorted(
            scores.items(), key=lambda x: x[1], reverse=True)
        top_trait = sorted_traits[0][0] if sorted_traits else ""

        if top_trait == "creativity":
            strategies_en.append(
                "Allow them to customize their work and express their style — creative freedom is highly motivating.")
            strategies_ar.append(
                "اسمح لهم بتخصيص عملهم والتعبير عن أسلوبهم — الحرية الإبداعية محفزة للغاية.")
        elif top_trait == "social":
            strategies_en.append(
                "Use peer recognition and group celebrations — they're energized by positive social interactions.")
            strategies_ar.append(
                "استخدم تقدير الأقران والاحتفالات الجماعية — يتنشطون من التفاعلات الاجتماعية الإيجابية.")
        elif top_trait in ["critical_thinking", "problem_solving"]:
            strategies_en.append(
                "Present problems as puzzles or mysteries to solve — intellectual challenges are intrinsically rewarding for them.")
            strategies_ar.append(
                "قدم المشاكل كألغاز أو أسرار لحلها — التحديات الفكرية مكافئة جوهرياً بالنسبة لهم.")
        elif top_trait == "leadership":
            strategies_en.append(
                "Let them mentor or teach younger peers — leadership responsibility is a powerful motivator.")
            strategies_ar.append(
                "دعهم يرشدون أو يعلمون أقراناً أصغر — مسؤولية القيادة محفز قوي.")
        elif top_trait == "emotional_intelligence":
            strategies_en.append(
                "Acknowledge their emotional growth and self-awareness — they appreciate recognition of personal development, not just academic results.")
            strategies_ar.append(
                "اعترف بنموهم العاطفي ووعيهم الذاتي — يقدرون الاعتراف بالتطور الشخصي وليس فقط النتائج الأكاديمية.")
        else:
            strategies_en.append(
                "Set clear, achievable milestones with visible progress tracking — they're motivated by seeing their own improvement.")
            strategies_ar.append(
                "حدد معالم واضحة وقابلة للتحقيق مع تتبع تقدم مرئي — يتحفزون من رؤية تحسنهم الخاص.")

        # Based on challenge response
        if cr == "persistent":
            strategies_en.append(
                "Use achievement badges or milestone rewards — they love the feeling of conquering something difficult.")
            strategies_ar.append(
                "استخدم شارات الإنجاز أو مكافآت المعالم — يحبون الشعور بقهر شيء صعب.")
        elif cr == "creative_solver":
            strategies_en.append(
                "Showcase their unique solutions to the class — being recognized for originality fuels their drive.")
            strategies_ar.append(
                "اعرض حلولهم الفريدة على الصف — الاعتراف بأصالتهم يغذي دافعهم.")
        elif cr == "help_seeking":
            strategies_en.append(
                "Create buddy systems where asking for help is normalized and celebrated, not seen as weakness.")
            strategies_ar.append(
                "أنشئ نظام رفاق حيث طلب المساعدة أمر طبيعي ومحتفى به وليس نقطة ضعف.")
        else:
            strategies_en.append(
                "Provide multiple pathways to complete tasks — flexibility in approach keeps them engaged.")
            strategies_ar.append(
                "وفر مسارات متعددة لإكمال المهام — المرونة في النهج تبقيهم منخرطين.")

        return {
            "en": strategies_en,
            "ar": strategies_ar
        }


# # ============================================================
# # 4. SIMULATED TEST & REPORT PRINTER
# # ============================================================

# def simulate_student_answers(age_group: str, num_questions: int = 25) -> Tuple[Dict, Dict[int, int]]:
#     """Simulate a student taking the test."""
#     questions = QUESTION_BANK.get(age_group, [])
#     selected = random.sample(questions, min(num_questions, len(questions)))

#     student_info = {
#         "name": "Ahmed Mohamed",
#         "student_id": "NGEN-2024-00142",
#         "age": random.choice({"6-9": [6, 7, 8, 9], "10-14": [10, 11, 12, 13, 14], "15-18": [15, 16, 17, 18]}[age_group])
#     }

#     # Simulate answers with a slight personality bias (simulating a real student)
#     # This student leans toward creative / individual / hands-on
#     bias_weights = {
#         0: [0.35, 0.20, 0.20, 0.25],  # Slightly biased toward option A
#         1: [0.20, 0.30, 0.25, 0.25],  # Slightly biased toward option B
#         2: [0.25, 0.25, 0.15, 0.35],  # Slightly biased toward option D
#     }

#     personality_type = random.choice([0, 1, 2])
#     weights = bias_weights[personality_type]

#     answers = {}
#     for q in selected:
#         answers[q["id"]] = random.choices(
#             [0, 1, 2, 3], weights=weights, k=1)[0]

#     return student_info, answers

# ============================================================
# 4. SIMULATED TEST & REPORT PRINTER
# ============================================================

# Pre-defined personality profiles for realistic simulation
PERSONALITY_PROFILES = {
    "creative_independent": {
        "description": "A creative, independent thinker who prefers working alone and finding unique solutions",
        "trait_preferences": {
            "creativity": 0.9,
            "adaptability": 0.8,
            "problem_solving": 0.7,
            "critical_thinking": 0.6,
            "emotional_intelligence": 0.5,
            "leadership": 0.4,
            "communication": 0.4,
            "time_management": 0.3,
            "social": 0.3,
            "teamwork": 0.2
        },
        "indicator_preferences": {
            "work_style": {"individual": 0.6, "leader": 0.2, "collaborative": 0.1, "supporter": 0.1},
            "learning_approach": {"hands_on": 0.5, "analytical": 0.3, "structured": 0.1, "social_learner": 0.1},
            "challenge_response": {"creative_solver": 0.5, "persistent": 0.3, "adaptive": 0.15, "help_seeking": 0.05},
            "decision_style": {"spontaneous": 0.4, "decisive": 0.3, "deliberate": 0.2, "consultative": 0.1}
        },
        "names_pool": {
            "6-9": [
                ("Layla Ahmed", 7), ("Zain Khaled", 8), ("Noor Sami", 6),
                ("Joud Ibrahim", 9), ("Rayan Faris", 7)
            ],
            "10-14": [
                ("Mariam Youssef", 12), ("Adam Nabil", 11), ("Lina Tarek", 13),
                ("Sami Jalal", 10), ("Huda Majid", 14)
            ],
            "15-18": [
                ("Nadia Saeed", 16), ("Kareem Adel", 17), ("Farah Hani", 15),
                ("Yasser Omran", 18), ("Dania Rami", 16)
            ]
        }
    },
    "social_collaborator": {
        "description": "A social, team-oriented person who loves working with others and communicating",
        "trait_preferences": {
            "social": 0.9,
            "communication": 0.9,
            "teamwork": 0.85,
            "emotional_intelligence": 0.8,
            "leadership": 0.5,
            "adaptability": 0.5,
            "creativity": 0.4,
            "problem_solving": 0.4,
            "critical_thinking": 0.3,
            "time_management": 0.3
        },
        "indicator_preferences": {
            "work_style": {"collaborative": 0.5, "supporter": 0.3, "leader": 0.1, "individual": 0.1},
            "learning_approach": {"social_learner": 0.6, "hands_on": 0.2, "structured": 0.1, "analytical": 0.1},
            "challenge_response": {"help_seeking": 0.5, "adaptive": 0.25, "persistent": 0.15, "creative_solver": 0.1},
            "decision_style": {"consultative": 0.5, "deliberate": 0.25, "spontaneous": 0.15, "decisive": 0.1}
        },
        "names_pool": {
            "6-9": [
                ("Sara Mahmoud", 8), ("Hamza Ali", 7), ("Yasmin Waleed", 9),
                ("Anas Rashed", 6), ("Malak Fadi", 8)
            ],
            "10-14": [
                ("Rana Khaled", 12), ("Tariq Samir", 13), ("Salma Nasser", 11),
                ("Faisal Omar", 14), ("Hana Basil", 10)
            ],
            "15-18": [
                ("Lama Ziad", 17), ("Bilal Hazem", 16), ("Reem Amr", 15),
                ("Mazen Wael", 18), ("Jumana Samer", 17)
            ]
        }
    },
    "analytical_leader": {
        "description": "A structured, analytical thinker who naturally takes charge and plans carefully",
        "trait_preferences": {
            "leadership": 0.9,
            "critical_thinking": 0.85,
            "time_management": 0.8,
            "problem_solving": 0.75,
            "communication": 0.7,
            "teamwork": 0.5,
            "emotional_intelligence": 0.5,
            "adaptability": 0.4,
            "social": 0.4,
            "creativity": 0.3
        },
        "indicator_preferences": {
            "work_style": {"leader": 0.5, "individual": 0.3, "collaborative": 0.15, "supporter": 0.05},
            "learning_approach": {"analytical": 0.5, "structured": 0.3, "hands_on": 0.1, "social_learner": 0.1},
            "challenge_response": {"persistent": 0.5, "adaptive": 0.25, "creative_solver": 0.15, "help_seeking": 0.1},
            "decision_style": {"decisive": 0.5, "deliberate": 0.3, "consultative": 0.15, "spontaneous": 0.05}
        },
        "names_pool": {
            "6-9": [
                ("Omar Faisal", 9), ("Deena Rashid", 8), ("Khalid Ameen", 7),
                ("Tala Saeed", 6), ("Younis Hamed", 9)
            ],
            "10-14": [
                ("Ahmad Zaki", 13), ("Nour Kamal", 12), ("Rami Jamal", 14),
                ("Dina Adnan", 11), ("Mohannad Aref", 10)
            ],
            "15-18": [
                ("Hussein Ghanem", 18), ("Arwa Mansour", 17), ("Tarek Lutfi", 16),
                ("Sama Basem", 15), ("Waleed Nizar", 18)
            ]
        }
    },
    "empathetic_supporter": {
        "description": "An emotionally intelligent, supportive person who helps others and adapts easily",
        "trait_preferences": {
            "emotional_intelligence": 0.9,
            "social": 0.8,
            "adaptability": 0.8,
            "communication": 0.7,
            "teamwork": 0.7,
            "creativity": 0.5,
            "problem_solving": 0.4,
            "critical_thinking": 0.3,
            "leadership": 0.25,
            "time_management": 0.2
        },
        "indicator_preferences": {
            "work_style": {"supporter": 0.5, "collaborative": 0.3, "individual": 0.1, "leader": 0.1},
            "learning_approach": {"social_learner": 0.4, "hands_on": 0.3, "structured": 0.2, "analytical": 0.1},
            "challenge_response": {"adaptive": 0.4, "help_seeking": 0.3, "persistent": 0.15, "creative_solver": 0.15},
            "decision_style": {"deliberate": 0.4, "consultative": 0.3, "spontaneous": 0.2, "decisive": 0.1}
        },
        "names_pool": {
            "6-9": [
                ("Layan Issa", 7), ("Aya Munir", 8), ("Suleiman Nasr", 6),
                ("Maha Taher", 9), ("Karim Wahid", 7)
            ],
            "10-14": [
                ("Zeina Fouad", 11), ("Abdallah Sharif", 12), ("Roaa Mazin", 13),
                ("Yara Raed", 14), ("Amr Bassam", 10)
            ],
            "15-18": [
                ("Noura Hatem", 16), ("Imad Rafiq", 17), ("Ghada Suleiman", 15),
                ("Saif Murad", 18), ("Lareen Osama", 16)
            ]
        }
    },
    "structured_steady": {
        "description": "A methodical, careful student who follows rules, manages time, and prefers clear structure",
        "trait_preferences": {
            "time_management": 0.9,
            "critical_thinking": 0.8,
            "problem_solving": 0.7,
            "adaptability": 0.6,
            "teamwork": 0.5,
            "communication": 0.5,
            "emotional_intelligence": 0.45,
            "leadership": 0.4,
            "social": 0.3,
            "creativity": 0.25
        },
        "indicator_preferences": {
            "work_style": {"individual": 0.4, "supporter": 0.3, "collaborative": 0.2, "leader": 0.1},
            "learning_approach": {"structured": 0.5, "analytical": 0.3, "hands_on": 0.1, "social_learner": 0.1},
            "challenge_response": {"persistent": 0.4, "adaptive": 0.3, "help_seeking": 0.2, "creative_solver": 0.1},
            "decision_style": {"deliberate": 0.5, "decisive": 0.25, "consultative": 0.15, "spontaneous": 0.1}
        },
        "names_pool": {
            "6-9": [
                ("Lina Bassam", 8), ("Muath Hakim", 9), ("Ruba Jalil", 7),
                ("Feras Numan", 6), ("Ghina Riad", 8)
            ],
            "10-14": [
                ("Baraa Samir", 12), ("Tamer Hafiz", 13), ("Lubna Majed", 11),
                ("Othman Rasheed", 14), ("Nada Ismail", 10)
            ],
            "15-18": [
                ("Muhannad Yasir", 17), ("Rahaf Diab", 16), ("Jaber Khalaf", 18),
                ("Shahd Anwar", 15), ("Iyad Qasim", 17)
            ]
        }
    }
}


def _calculate_option_affinity(
    option_scoring: Dict,
    profile: Dict,
    noise_level: float = 0.15
) -> float:
    """
    Calculate how much a personality profile is drawn to a specific option.

    This creates a composite affinity score based on:
    1. How well the option's trait scores match the profile's trait preferences
    2. How well the option's indicators match the profile's indicator preferences
    3. A small random noise factor for realistic human variation

    Args:
        option_scoring: The scoring dict for one option
        profile: The personality profile dict
        noise_level: Random variation factor (0.0 = deterministic, 1.0 = very noisy)

    Returns:
        Affinity score (higher = more likely to choose this option)
    """
    trait_prefs = profile["trait_preferences"]
    indicator_prefs = profile["indicator_preferences"]

    # ---- Factor 1: Trait Alignment (weight: 50%) ----
    # How well does this option align with what the profile values?
    trait_affinity = 0.0
    trait_count = 0
    for trait, score in option_scoring["traits"].items():
        if trait in trait_prefs:
            # High trait score + high preference = high affinity
            # Multiply option's trait score (0-5) by profile's preference (0-1)
            trait_affinity += (score / 5.0) * trait_prefs[trait]
            trait_count += 1

    if trait_count > 0:
        trait_affinity /= trait_count  # Normalize by number of matching traits
    else:
        trait_affinity = 0.1  # Small base if no matching traits

    # ---- Factor 2: Indicator Alignment (weight: 40%) ----
    # How well do the behavioral indicators match the profile's preferred indicators?
    indicator_affinity = 0.0
    indicators = option_scoring["indicators"]

    for dimension in ["work_style", "learning_approach", "challenge_response", "decision_style"]:
        option_value = indicators.get(dimension, "")
        if dimension in indicator_prefs and option_value in indicator_prefs[dimension]:
            indicator_affinity += indicator_prefs[dimension][option_value]

    indicator_affinity /= 4.0  # Normalize by 4 dimensions

    # ---- Factor 3: Human Noise (weight: 10%) ----
    # Real students don't always pick the "most aligned" option
    # They might be tired, misread, pick randomly, or genuinely vary
    noise = random.uniform(-noise_level, noise_level)

    # ---- Composite Score ----
    affinity = (
        trait_affinity * 0.50 +
        indicator_affinity * 0.40 +
        (0.5 + noise) * 0.10  # Base 0.5 + noise to keep it positive-ish
    )

    return max(0.01, affinity)  # Floor at 0.01 to avoid zero probability


def simulate_student_answers(
    age_group: str,
    num_questions: int = 25,
    personality_type: Optional[str] = None,
    consistency: float = 0.75,
    student_name: Optional[str] = None,
    student_id: Optional[str] = None
) -> Tuple[Dict, Dict[int, int], Dict]:
    """
    Simulate a realistic student taking the placement test.

    The simulation:
    1. Selects (or randomly assigns) a personality profile
    2. For each question, calculates how "attracted" the profile is to each option
    3. Uses weighted random selection so the student mostly picks aligned options
       but occasionally picks others (realistic human behavior)

    Args:
        age_group: "6-9", "10-14", or "15-18"
        num_questions: Number of questions to answer (default 25)
        personality_type: Force a specific profile (or None for random)
            Options: "creative_independent", "social_collaborator",
                     "analytical_leader", "empathetic_supporter", "structured_steady"
        consistency: How consistent the student is (0.0 = random, 1.0 = perfectly aligned)
            - 0.5 = somewhat consistent (younger kids / less self-aware)
            - 0.75 = moderately consistent (typical student)
            - 0.9 = very consistent (highly self-aware older student)
        student_name: Override the auto-generated name
        student_id: Override the auto-generated ID

    Returns:
        Tuple of:
            - student_info: Dict with name, student_id, age
            - answers: Dict mapping question_id -> selected_option_index
            - simulation_meta: Dict with profile info for verification
    """
    # Validate age group
    questions = QUESTION_BANK.get(age_group, [])
    if not questions:
        raise ValueError(f"No question bank found for age group: {age_group}")

    # Select personality profile
    if personality_type and personality_type in PERSONALITY_PROFILES:
        profile_key = personality_type
    else:
        profile_key = random.choice(list(PERSONALITY_PROFILES.keys()))

    profile = PERSONALITY_PROFILES[profile_key]

    # Adjust consistency based on age group (younger = less consistent)
    age_consistency_modifiers = {
        "6-9": -0.15,    # Younger kids are less predictable
        "10-14": -0.05,  # Pre-teens are somewhat predictable
        "15-18": 0.05    # Teens are more self-aware and consistent
    }
    adjusted_consistency = max(0.3, min(0.95,
        consistency + age_consistency_modifiers.get(age_group, 0)
    ))

    # Noise level inversely related to consistency
    noise_level = (1.0 - adjusted_consistency) * 0.5

    # Select student identity
    names_pool = profile["names_pool"].get(age_group, [("Student X", 10)])
    chosen_identity = random.choice(names_pool)

    student_info = {
        "name": student_name or chosen_identity[0],
        "student_id": student_id or f"NGEN-{random.randint(2024, 2025)}-{random.randint(10000, 99999)}",
        "age": chosen_identity[1]
    }

    # Select random subset of questions
    selected_questions = random.sample(questions, min(num_questions, len(questions)))

    # ---- Core Simulation: Answer Each Question ----
    answers = {}
    answer_details = []  # For debugging / verification

    for question in selected_questions:
        qid = question["id"]
        options = question["options_scoring"]

        # Calculate affinity for each option
        affinities = []
        for i, opt in enumerate(options):
            affinity = _calculate_option_affinity(opt, profile, noise_level)
            affinities.append(affinity)

        # Apply consistency: blend between affinity-weighted and uniform distribution
        uniform = [0.25, 0.25, 0.25, 0.25]
        final_weights = [
            adjusted_consistency * a + (1 - adjusted_consistency) * u
            for a, u in zip(affinities, uniform)
        ]

        # Normalize weights to sum to 1
        total_weight = sum(final_weights)
        if total_weight > 0:
            final_weights = [w / total_weight for w in final_weights]
        else:
            final_weights = uniform

        # Select answer using weighted random choice
        selected_option = random.choices([0, 1, 2, 3], weights=final_weights, k=1)[0]
        answers[qid] = selected_option

        # Store details for verification
        answer_details.append({
            "question_id": qid,
            "affinities": [round(a, 4) for a in affinities],
            "final_weights": [round(w, 4) for w in final_weights],
            "selected_option": selected_option,
            "selected_indicators": options[selected_option]["indicators"],
            "selected_top_traits": dict(
                sorted(options[selected_option]["traits"].items(),
                       key=lambda x: x[1], reverse=True)[:3]
            )
        })

    # ---- Compile Simulation Metadata ----
    simulation_meta = {
        "profile_key": profile_key,
        "profile_description": profile["description"],
        "adjusted_consistency": round(adjusted_consistency, 3),
        "noise_level": round(noise_level, 3),
        "total_questions": len(selected_questions),
        "answer_details": answer_details,
        "indicator_summary": _summarize_simulated_indicators(answer_details),
        "trait_alignment_score": _calculate_trait_alignment(answer_details, profile)
    }

    return student_info, answers, simulation_meta


def _summarize_simulated_indicators(answer_details: List[Dict]) -> Dict:
    """
    Summarize the behavioral indicators across all simulated answers.
    Useful for verifying the simulation makes sense.
    """
    summary = {
        "work_style": defaultdict(int),
        "learning_approach": defaultdict(int),
        "challenge_response": defaultdict(int),
        "decision_style": defaultdict(int)
    }

    for detail in answer_details:
        indicators = detail["selected_indicators"]
        for dim, value in indicators.items():
            if dim in summary:
                summary[dim][value] += 1

    # Convert to percentages
    result = {}
    for dim, counts in summary.items():
        total = sum(counts.values())
        if total > 0:
            result[dim] = {
                k: round((v / total) * 100, 1)
                for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)
            }
        else:
            result[dim] = {}

    return result


def _calculate_trait_alignment(answer_details: List[Dict], profile: Dict) -> float:
    """
    Calculate how well the simulated answers align with the intended profile.
    Score 0-100 where 100 = perfectly aligned.
    """
    trait_prefs = profile["trait_preferences"]

    if not answer_details:
        return 0.0

    alignment_scores = []
    for detail in answer_details:
        top_traits = detail["selected_top_traits"]
        # Check if the selected option's top traits match the profile's preferred traits
        question_alignment = 0
        for trait, score in top_traits.items():
            if trait in trait_prefs:
                question_alignment += (score / 5.0) * trait_prefs[trait]

        if top_traits:
            question_alignment /= len(top_traits)
        alignment_scores.append(question_alignment)

    overall = sum(alignment_scores) / len(alignment_scores) * 100
    return round(overall, 1)


def simulate_classroom(
    age_group: str,
    num_students: int = 8,
    num_questions: int = 25,
    profile_distribution: Optional[Dict[str, int]] = None
) -> List[Tuple[Dict, Dict[int, int], Dict]]:
    """
    Simulate an entire classroom of students with diverse personalities.

    Args:
        age_group: "6-9", "10-14", or "15-18"
        num_students: Number of students to simulate
        num_questions: Questions per student
        profile_distribution: Optional dict specifying how many students per profile
            e.g., {"creative_independent": 2, "social_collaborator": 3, ...}
            If None, uses a realistic random distribution

    Returns:
        List of (student_info, answers, simulation_meta) tuples
    """
    if profile_distribution:
        # Use specified distribution
        profile_assignments = []
        for profile_key, count in profile_distribution.items():
            profile_assignments.extend([profile_key] * count)
        # Fill remaining with random
        while len(profile_assignments) < num_students:
            profile_assignments.append(random.choice(list(PERSONALITY_PROFILES.keys())))
        random.shuffle(profile_assignments)
        profile_assignments = profile_assignments[:num_students]
    else:
        # Realistic distribution: most students are moderate, fewer extremes
        weighted_profiles = [
            ("social_collaborator", 3),     # Most common in classrooms
            ("structured_steady", 3),       # Common
            ("empathetic_supporter", 2),    # Fairly common
            ("creative_independent", 2),    # Less common
            ("analytical_leader", 1)        # Least common
        ]
        profile_pool = []
        for profile_key, weight in weighted_profiles:
            profile_pool.extend([profile_key] * weight)

        profile_assignments = [
            random.choice(profile_pool) for _ in range(num_students)
        ]

    # Track used names to avoid duplicates
    used_names = set()
    students = []

    for i, profile_key in enumerate(profile_assignments):
        # Vary consistency per student (some students are more decisive than others)
        consistency = random.uniform(0.55, 0.90)

        student_info, answers, sim_meta = simulate_student_answers(
            age_group=age_group,
            num_questions=num_questions,
            personality_type=profile_key,
            consistency=consistency
        )

        # Ensure unique names
        while student_info["name"] in used_names:
            alt_profile = random.choice(list(PERSONALITY_PROFILES.keys()))
            alt_names = PERSONALITY_PROFILES[alt_profile]["names_pool"].get(age_group, [])
            if alt_names:
                chosen = random.choice(alt_names)
                student_info["name"] = chosen[0]
                student_info["age"] = chosen[1]

        used_names.add(student_info["name"])
        students.append((student_info, answers, sim_meta))

    return students


def print_simulation_debug(sim_meta: Dict):
    """
    Print detailed debug information about a simulation.
    Useful for verifying the simulation produces realistic results.
    """
    print(f"\n  🎭 Profile: {sim_meta['profile_key']}")
    print(f"     Description: {sim_meta['profile_description']}")
    print(f"     Consistency: {sim_meta['adjusted_consistency']}")
    print(f"     Noise Level: {sim_meta['noise_level']}")
    print(f"     Questions Answered: {sim_meta['total_questions']}")
    print(f"     Trait Alignment Score: {sim_meta['trait_alignment_score']}/100")

    print(f"\n     📊 Indicator Distribution:")
    for dim, dist in sim_meta["indicator_summary"].items():
        print(f"        {dim}:")
        for value, pct in dist.items():
            bar = "█" * int(pct / 5) + "░" * (20 - int(pct / 5))
            print(f"          {value:<20} [{bar}] {pct}%")

    print(f"\n     📝 Answer Trace (first 5 questions):")
    for detail in sim_meta["answer_details"][:5]:
        qid = detail["question_id"]
        sel = detail["selected_option"]
        weights = detail["final_weights"]
        top = detail["selected_top_traits"]
        inds = detail["selected_indicators"]
        weight_bars = " | ".join([f"{'▓' if i == sel else '░'}{w:.2f}" for i, w in enumerate(weights)])
        traits_str = ", ".join([f"{t}:{s}" for t, s in top.items()])
        print(f"        Q{qid}: [{weight_bars}] → Option {sel}")
        print(f"              Traits: {traits_str}")
        print(f"              Style: {inds['work_style']}, Learn: {inds['learning_approach']}, "
              f"Challenge: {inds['challenge_response']}, Decision: {inds['decision_style']}")

def print_report(report: Dict, lang: str = "en") -> str:
    """Pretty print the evaluation report."""
    meta = report["meta"]
    traits = report["trait_scores"]
    dimensions = report["behavioral_dimensions"]
    learning = report["learning_profile"]
    strengths = report["strengths"]
    growth = report["growth_areas"]
    summary = report["personality_summary"]
    recs = report["instructor_recommendations"]
    motivation = report["motivation_strategies"]

    lp = learning["learning_pace"]
    gp = learning["group_placement"]
    el = learning["effort_level"]

    lines = []

    # HEADER
    lines.append("\n" + "=" * 80)
    lines.append("   NGen PLACEMENT TEST — STUDENT EVALUATION REPORT")
    lines.append("=" * 80)

    # META
    lines.append(f"\n📋 Student: {meta['student_name']}")
    lines.append(f"   ID: {meta['student_id']}")
    lines.append(f"   Age: {meta['age']} | Age Group: {meta['age_group']}")
    lines.append(f"   Questions Answered: {meta['total_questions_answered']}")
    lines.append(f"   Evaluation Date: {meta['evaluation_date'][:10]}")

    # TRAIT SCORES
    lines.append("\n" + "-" * 60)
    lines.append("📊 TRAIT SCORES")
    lines.append("-" * 60)
    for trait_key, trait_data in traits.items():
        score = trait_data["score"]
        category = trait_data["category"]
        label = trait_data[f"label_{lang}"]
        bar = "█" * int(score / 5) + "░" * (20 - int(score / 5))
        lines.append(f"  {label:<30} [{bar}] {score:>5.1f}/100  ({category})")

    # BEHAVIORAL DIMENSIONS
    lines.append("\n" + "-" * 60)
    lines.append("🧭 BEHAVIORAL DIMENSIONS")
    lines.append("-" * 60)
    for dim_name, dim_data in dimensions.items():
        label = dim_name.replace("_", " ").title()
        primary = dim_data[f"primary_label_{lang}"]
        conf = dim_data.get("primary_confidence", "N/A")
        secondary = dim_data.get(f"secondary_label_{lang}", "None")
        lines.append(f"  {label:<25} → Primary: {primary} ({conf}%)")
        if secondary:
            lines.append(f"  {'':<25}   Secondary: {secondary}")

    # LEARNING PROFILE
    lines.append("\n" + "-" * 60)
    lines.append("📚 LEARNING PROFILE")
    lines.append("-" * 60)
    lines.append(f"  Learning Pace:  {lp[f'primary_label_{lang}']}")
    lines.append(f"  Group Type:     {gp[f'primary_label_{lang}']}")
    lines.append(f"  Effort Level:   {el[f'label_{lang}']}")
    lines.append(f"  Self-Drive:     {el['self_drive_score']}/100")
    lines.append(f"  Persistence:    {el['persistence_score']}/100")

    # STRENGTHS
    lines.append("\n" + "-" * 60)
    lines.append("💪 TOP STRENGTHS")
    lines.append("-" * 60)
    for i, s in enumerate(strengths, 1):
        lines.append(f"  {i}. {s[f'label_{lang}']} ({s['score']}/100)")
        lines.append(f"     {s[f'description_{lang}']}")

    # GROWTH AREAS
    lines.append("\n" + "-" * 60)
    lines.append("🌱 GROWTH AREAS")
    lines.append("-" * 60)
    for i, g in enumerate(growth, 1):
        lines.append(f"  {i}. {g[f'label_{lang}']} ({g['score']}/100)")
        lines.append(f"     {g[f'description_{lang}']}")

    # PERSONALITY SUMMARY
    lines.append("\n" + "-" * 60)
    lines.append("🧠 PERSONALITY SUMMARY")
    lines.append("-" * 60)
    lines.append(f"  {summary[lang]}")

    # INSTRUCTOR RECOMMENDATIONS
    lines.append("\n" + "-" * 60)
    lines.append("📝 INSTRUCTOR RECOMMENDATIONS")
    lines.append("-" * 60)
    for i, rec in enumerate(recs[lang], 1):
        lines.append(f"  {i}. {rec}")

    # MOTIVATION STRATEGIES
    lines.append("\n" + "-" * 60)
    lines.append("🔥 MOTIVATION STRATEGIES")
    lines.append("-" * 60)
    for i, strat in enumerate(motivation[lang], 1):
        lines.append(f"  {i}. {strat}")

    # GROUP SCORES (Debug)
    lines.append("\n" + "-" * 60)
    lines.append("📈 GROUP PLACEMENT SCORES (Advanced)")
    lines.append("-" * 60)
    for group, score in gp["group_scores"].items():
        bar = "█" * int(score * 10) + "░" * (30 - int(score * 10))
        label = GROUP_TYPE_LABELS[group][lang]
        lines.append(f"  {label:<40} [{bar}] {score:.2f}")

    # LEARNING PACE SCORES (Debug)
    lines.append("\n" + "-" * 60)
    lines.append("⏱️ LEARNING PACE SCORES (Advanced)")
    lines.append("-" * 60)
    for pace, score in lp["pace_scores"].items():
        bar = "█" * int(score / 5) + "░" * (20 - int(score / 5))
        label = LEARNING_PACE_LABELS[pace][lang]
        lines.append(f"  {label:<100} [{bar}] {score:.1f}")

    # FOOTER
    lines.append("\n" + "=" * 80)
    lines.append("   END OF REPORT")
    lines.append("=" * 80)

    # Join everything into one big string
    full_report = "\n".join(lines)
    print(full_report)
    return full_report


def export_report_json(report: Dict, filename: str = None) -> str:
    """Export report as JSON file."""
    if filename is None:
        student_id = report["meta"]["student_id"]
        date = report["meta"]["evaluation_date"][:10]
        filename = f"ngen_report_{student_id}_{date}.json"

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    return filename



# ============================================================
# 5. BATCH EVALUATION (Multiple Students)
# ============================================================

def evaluate_batch(students_data: List[Dict]) -> List[Dict]:
    """
    Evaluate multiple students and return list of reports.

    Args:
        students_data: [
            {
                "student_info": {"name": ..., "age": ..., "student_id": ...},
                "age_group": "6-9",
                "answers": {1: 0, 2: 3, ...}
            },
            ...
        ]
    """
    reports = []
    for student in students_data:
        evaluator = PlacementTestEvaluator(student["age_group"])
        report = evaluator.evaluate(
            student["student_info"], student["answers"])
        reports.append(report)
    return reports


def generate_group_recommendations(reports: List[Dict]) -> Dict:
    """
    Analyze multiple student reports and suggest optimal groupings.
    """
    groups = defaultdict(list)

    for report in reports:
        student_name = report["meta"]["student_name"]
        student_id = report["meta"]["student_id"]
        group_type = report["learning_profile"]["group_placement"]["primary"]
        work_style = report["behavioral_dimensions"]["work_style"]["primary"]
        learning_pace = report["learning_profile"]["learning_pace"]["primary"]

        groups[group_type].append({
            "name": student_name,
            "id": student_id,
            "work_style": work_style,
            "pace": learning_pace,
            "effort": report["learning_profile"]["effort_level"]["level"]
        })

    recommendations = {
        "total_students": len(reports),
        "groups": {}
    }

    for group_type, members in groups.items():
        has_leader = any(m["work_style"] == "leader" for m in members)
        avg_pace_map = {"fast": 3, "steady": 2,
                        "reflective": 1, "exploratory": 2}
        avg_pace = sum(avg_pace_map.get(m["pace"], 2)
                       for m in members) / max(len(members), 1)

        recommendations["groups"][group_type] = {
            "label_en": GROUP_TYPE_LABELS[group_type]["en"],
            "label_ar": GROUP_TYPE_LABELS[group_type]["ar"],
            "member_count": len(members),
            "members": members,
            "has_natural_leader": has_leader,
            "average_pace_score": round(avg_pace, 1),
            "recommended_instructor_approach": (
                "Advanced/accelerated content" if avg_pace > 2.5
                else "Standard pacing with checkpoints" if avg_pace > 1.5
                else "Slower pacing with extra support"
            )
        }

    return recommendations


# ============================================================
# 6. MAIN EXECUTION
# ============================================================

if __name__ == "__main__":
    print("\n🚀 NGen Placement Test Evaluation Engine v2.0\n")

    # --- Simulate a single student ---
    print("=" * 80)
    print("  SIMULATING SINGLE STUDENT EVALUATION")
    print("=" * 80)

    age_group = "6-9"
    student_info, answers,_ = simulate_student_answers(
        age_group, num_questions=25)

    print(f"\n📝 Simulated Student: {student_info['name']}")
    print(f"   Age: {student_info['age']} | Group: {age_group}")
    print(f"   Questions Answered: {len(answers)}")
    print(f"   Answers: {answers}")

    evaluator = PlacementTestEvaluator(age_group)
    report = evaluator.evaluate(student_info, answers)

    # Print English Report
    print_report(report, lang="en")

    # Print Arabic Report
    print_report(report, lang="ar")

    # Export to JSON
    filename = export_report_json(report)
    print(f"\n💾 Report exported to: {filename}")

    # --- Simulate batch evaluation ---
    print("\n\n" + "=" * 80)
    print("  SIMULATING BATCH EVALUATION (5 Students)")
    print("=" * 80)

    batch_reports = []
    simulated_names = [
        ("Youssef Ali", "NGEN-2024-00201"),
        ("Sara Ahmed", "NGEN-2024-00202"),
        ("Omar Hassan", "NGEN-2024-00203"),
        ("Nour Ibrahim", "NGEN-2024-00204"),
        ("Kareem Mahmoud", "NGEN-2024-00205")
    ]

    for name, sid in simulated_names:
        s_info, s_answers,_ = simulate_student_answers(
            age_group, num_questions=25)
        s_info["name"] = name
        s_info["student_id"] = sid

        eval_engine = PlacementTestEvaluator(age_group)
        s_report = eval_engine.evaluate(s_info, s_answers)
        batch_reports.append(s_report)

        # Print summary for each student
        ws = s_report["behavioral_dimensions"]["work_style"]["primary_label_en"]
        lp = s_report["learning_profile"]["learning_pace"]["primary_label_en"][:40]
        gp = s_report["learning_profile"]["group_placement"]["primary_label_en"]
        el = s_report["learning_profile"]["effort_level"]["level"]
        top = s_report["strengths"][0]["label_en"]

        print(f"\n  📋 {name} (Age {s_info['age']})")
        print(f"     Work Style: {ws}")
        print(f"     Learning Pace: {lp}")
        print(f"     Group Type: {gp}")
        print(f"     Effort Needed: {el}")
        print(f"     Top Strength: {top}")

    # Generate group recommendations
    print("\n\n" + "-" * 60)
    print("🏫 GROUP PLACEMENT RECOMMENDATIONS")
    print("-" * 60)

    group_recs = generate_group_recommendations(batch_reports)
    print(f"\n  Total Students: {group_recs['total_students']}")

    for group_type, data in group_recs["groups"].items():
        print(f"\n  📦 {data['label_en']} ({data['member_count']} students)")
        print(
            f"     Has Natural Leader: {'✅' if data['has_natural_leader'] else '❌'}")
        print(f"     Avg Pace Score: {data['average_pace_score']}/3.0")
        print(
            f"     Instructor Approach: {data['recommended_instructor_approach']}")
        print(f"     Members:")
        for m in data["members"]:
            print(
                f"       - {m['name']} | Style: {m['work_style']} | Pace: {m['pace']} | Effort: {m['effort']}")

    print("\n" + "=" * 80)
    print("   BATCH EVALUATION COMPLETE")
    print("=" * 80)


# ============================================================
# 7. API-READY EVALUATION FUNCTION
# ============================================================

def evaluate_student_api(request_data: Dict) -> Dict:
    """
    API-ready evaluation function.
    Accepts a request payload and returns a complete evaluation report.

    Expected request_data format:
    {
        "student_info": {
            "name": "Ahmed Mohamed",
            "student_id": "NGEN-2024-00142",
            "age": 8
        },
        "age_group": "6-9",
        "answers": {
            "1": 2,
            "3": 0,
            "5": 3,
            ...
        }
    }

    Returns:
        Complete evaluation report dictionary
    """
    try:
        # Validate required fields
        required_fields = ["student_info", "age_group", "answers"]
        for field in required_fields:
            if field not in request_data:
                return {
                    "success": False,
                    "error": f"Missing required field: {field}",
                    "report": None
                }

        student_info = request_data["student_info"]
        age_group = request_data["age_group"]
        answers = request_data["answers"]

        # Validate age group
        valid_age_groups = ["6-9", "10-14", "15-18"]
        if age_group not in valid_age_groups:
            return {
                "success": False,
                "error": f"Invalid age group: {age_group}. Must be one of {valid_age_groups}",
                "report": None
            }

        # Validate student info
        required_student_fields = ["name", "student_id", "age"]
        for field in required_student_fields:
            if field not in student_info:
                return {
                    "success": False,
                    "error": f"Missing student info field: {field}",
                    "report": None
                }

        # Convert answer keys to integers
        int_answers = {}
        for qid, option in answers.items():
            try:
                int_answers[int(qid)] = int(option)
            except (ValueError, TypeError):
                return {
                    "success": False,
                    "error": f"Invalid answer format for question {qid}: {option}",
                    "report": None
                }

        # Validate minimum answers
        min_answers = 15
        if len(int_answers) < min_answers:
            return {
                "success": False,
                "error": f"Minimum {min_answers} answers required. Received: {len(int_answers)}",
                "report": None
            }

        # Validate maximum answers
        max_answers = 101
        if len(int_answers) > max_answers:
            return {
                "success": False,
                "error": f"Maximum {max_answers} answers allowed. Received: {len(int_answers)}",
                "report": None
            }

        # Run evaluation
        evaluator = PlacementTestEvaluator(age_group)
        report = evaluator.evaluate(student_info, int_answers)

        return {
            "success": True,
            "error": None,
            "report": report
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Evaluation failed: {str(e)}",
            "report": None
        }


def evaluate_batch_api(request_data: Dict) -> Dict:
    """
    API-ready batch evaluation function.

    Expected request_data format:
    {
        "students": [
            {
                "student_info": {...},
                "age_group": "6-9",
                "answers": {...}
            },
            ...
        ],
        "generate_group_recommendations": true
    }
    """
    try:
        students = request_data.get("students", [])
        generate_groups = request_data.get(
            "generate_group_recommendations", True)

        if not students:
            return {
                "success": False,
                "error": "No students provided",
                "reports": [],
                "group_recommendations": None
            }

        reports = []
        errors = []

        for i, student_data in enumerate(students):
            result = evaluate_student_api(student_data)
            if result["success"]:
                reports.append(result["report"])
            else:
                errors.append({
                    "student_index": i,
                    "student_name": student_data.get("student_info", {}).get("name", "Unknown"),
                    "error": result["error"]
                })

        group_recs = None
        if generate_groups and reports:
            group_recs = generate_group_recommendations(reports)

        return {
            "success": True,
            "total_evaluated": len(reports),
            "total_errors": len(errors),
            "errors": errors,
            "reports": reports,
            "group_recommendations": group_recs
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Batch evaluation failed: {str(e)}",
            "reports": [],
            "group_recommendations": None
        }


# ============================================================
# 8. REPORT FORMATTING UTILITIES
# ============================================================

def generate_compact_summary(report: Dict, lang: str = "en") -> str:
    """
    Generate a compact one-paragraph summary for quick instructor reference.
    """
    meta = report["meta"]
    ws = report["behavioral_dimensions"]["work_style"][f"primary_label_{lang}"]
    la = report["behavioral_dimensions"][
        "learning_approach"][f"primary_label_{lang}"]
    cr = report["behavioral_dimensions"][
        "challenge_response"][f"primary_label_{lang}"]
    lp = report["learning_profile"]["learning_pace"][f"primary_label_{lang}"]
    gp = report["learning_profile"]["group_placement"][f"primary_label_{lang}"]
    el = report["learning_profile"]["effort_level"][f"label_{lang}"]
    top_strengths = ", ".join(
        [s[f"label_{lang}"] for s in report["strengths"][:2]])
    top_growth = ", ".join([g[f"label_{lang}"]
                           for g in report["growth_areas"][:2]])

    if lang == "en":
        return (
            f"{meta['student_name']} (Age {meta['age']}, Group {meta['age_group']}) is a "
            f"{ws} with a {la.lower()} approach. "
            f"They respond to challenges as a {cr.lower()}. "
            f"Strengths: {top_strengths}. "
            f"Growth areas: {top_growth}. "
            f"Learning pace: {lp.split('—')[0].strip()}. "
            f"Recommended group: {gp}. "
            f"Instructor effort needed: {el.split('—')[0].strip()}."
        )
    else:
        return (
            f"{meta['student_name']} (العمر {meta['age']}، المجموعة {meta['age_group']}) هو "
            f"{ws} مع نهج {la}. "
            f"يستجيب للتحديات كـ {cr}. "
            f"نقاط القوة: {top_strengths}. "
            f"مجالات النمو: {top_growth}. "
            f"وتيرة التعلم: {lp.split('—')[0].strip()}. "
            f"المجموعة الموصى بها: {gp}. "
            f"جهد المعلم المطلوب: {el.split('—')[0].strip()}."
        )


def generate_student_card(report: Dict, lang: str = "en") -> Dict:
    """
    Generate a compact student card for dashboard display.
    """
    meta = report["meta"]
    traits = report["trait_scores"]
    dimensions = report["behavioral_dimensions"]
    learning = report["learning_profile"]

    # Calculate overall score (weighted average of all traits)
    total_score = sum(t["score"]
                      for t in traits.values()) / max(len(traits), 1)

    # Determine overall level
    if total_score >= 75:
        level = {"en": "Advanced", "ar": "متقدم"}
    elif total_score >= 55:
        level = {"en": "Intermediate", "ar": "متوسط"}
    elif total_score >= 35:
        level = {"en": "Developing", "ar": "في طور التطوير"}
    else:
        level = {"en": "Beginner", "ar": "مبتدئ"}

    # Top 3 traits as radar chart data
    sorted_traits = sorted(
        traits.items(), key=lambda x: x[1]["score"], reverse=True)
    radar_data = {t[0]: t[1]["score"] for t in sorted_traits[:5]}

    return {
        "student_name": meta["student_name"],
        "student_id": meta["student_id"],
        "age": meta["age"],
        "age_group": meta["age_group"],
        "overall_score": round(total_score, 1),
        "overall_level": level[lang],
        "work_style": dimensions["work_style"][f"primary_label_{lang}"],
        "learning_pace": learning["learning_pace"]["primary"],
        "group_type": learning["group_placement"][f"primary_label_{lang}"],
        "effort_level": learning["effort_level"]["level"],
        "top_strength": report["strengths"][0][f"label_{lang}"] if report["strengths"] else "N/A",
        "top_growth": report["growth_areas"][0][f"label_{lang}"] if report["growth_areas"] else "N/A",
        "radar_chart_data": radar_data,
        "compact_summary": generate_compact_summary(report, lang)
    }


# ============================================================
# 9. COMPREHENSIVE DEMO WITH ALL FEATURES
# ============================================================

def run_full_demo():
    """
    Run a comprehensive demo showcasing all evaluation features.
    """
    print("\n" + "🔬" * 40)
    print("   NGen COMPREHENSIVE EVALUATION DEMO")
    print("🔬" * 40)

    # ---- Demo 1: Single Student Evaluation ----
    print("\n\n📋 DEMO 1: Single Student Evaluation")
    print("=" * 60)

    student_info = {
        "name": "Layla Ahmed",
        "student_id": "NGEN-2024-00301",
        "age": 8
    }

    # Manually crafted answers to simulate a creative, independent student
    crafted_answers = {
        1: 3,   # Decides to build something else (adaptability, creativity)
        2: 2,   # Draws own special part (creativity, individual)
        3: 0,   # Goes to say hi directly (social, leadership)
        4: 0,   # Finishes homework first (time management)
        5: 2,   # Suggests playing together (teamwork, creativity)
        6: 0,   # Feels excited (communication, creativity)
        7: 0,   # Keeps trying every spot (problem solving, persistent)
        8: 2,   # Tries to cheer them up (emotional intelligence)
        9: 0,   # Painting from imagination (creativity)
        10: 0,  # Watches winner to learn (critical thinking)
        11: 0,  # Comes up with the idea (leadership, creativity)
        12: 0,  # Helps find fair solution (problem solving, leadership)
        13: 0,  # Most fun creative way (creativity)
        14: 3,  # Turns blob into something else (creativity, adaptability)
        15: 3,  # Thinks about which is due soonest (critical thinking)
        16: 3,  # Includes them with easiest job (leadership, teamwork)
        17: 0,  # Makes rules from imagination (creativity)
        # Thinks about fun things at winner place (adaptability, creativity)
        18: 3,
        19: 1,  # Shows by example turn (creativity, leadership)
        20: 2,  # Cat - independent (individual, creative)
        21: 0,  # Stops to help (emotional intelligence)
        22: 0,  # Stays near and extra nice (emotional intelligence)
        23: 1,  # Jumps right in (adaptability, hands-on)
        24: 0,  # Leader who reads map (leadership)
        25: 2,  # Maybe easier way to learn (critical thinking, creative)
    }

    evaluator = PlacementTestEvaluator("6-9")
    report = evaluator.evaluate(student_info, crafted_answers)

    # Print full report in English
    print_report(report, lang="en")

    # Print compact summary
    print("\n\n📝 COMPACT SUMMARY (English):")
    print("-" * 60)
    print(generate_compact_summary(report, "en"))

    print("\n📝 COMPACT SUMMARY (Arabic):")
    print("-" * 60)
    print(generate_compact_summary(report, "ar"))

    # Print student card
    print("\n\n🪪 STUDENT CARD:")
    print("-" * 60)
    card = generate_student_card(report, "en")
    for key, value in card.items():
        if key != "radar_chart_data" and key != "compact_summary":
            print(f"  {key:<20}: {value}")
    print(f"\n  Radar Chart Data:")
    for trait, score in card["radar_chart_data"].items():
        bar = "█" * int(score / 5) + "░" * (20 - int(score / 5))
        print(
            f"    {TRAIT_LABELS.get(trait, {}).get('en', trait):<30} [{bar}] {score:.1f}")

    # ---- Demo 2: API-Style Call ----
    print("\n\n📋 DEMO 2: API-Style Single Evaluation")
    print("=" * 60)

    api_request = {
        "student_info": {
            "name": "Khaled Youssef",
            "student_id": "NGEN-2024-00302",
            "age": 7
        },
        "age_group": "6-9",
        "answers": {
            "1": 1, "2": 3, "3": 2, "4": 2, "5": 1,
            "6": 3, "7": 3, "8": 3, "9": 1, "10": 2,
            "11": 2, "12": 1, "13": 2, "14": 2, "15": 0,
            "16": 0, "17": 2, "18": 1, "19": 2, "20": 0,
            "21": 3, "22": 1, "23": 3, "24": 3, "25": 1
        }
    }

    api_result = evaluate_student_api(api_request)

    if api_result["success"]:
        print(f"\n  ✅ Evaluation successful!")
        api_report = api_result["report"]
        print(f"  Student: {api_report['meta']['student_name']}")
        print(
            f"  Work Style: {api_report['behavioral_dimensions']['work_style']['primary_label_en']}")
        print(
            f"  Learning Pace: {api_report['learning_profile']['learning_pace']['primary']}")
        print(
            f"  Group: {api_report['learning_profile']['group_placement']['primary_label_en']}")
        print(
            f"  Effort: {api_report['learning_profile']['effort_level']['label_en']}")

        print(f"\n  Summary: {generate_compact_summary(api_report, 'en')}")
    else:
        print(f"\n  ❌ Evaluation failed: {api_result['error']}")

    # ---- Demo 3: Batch Evaluation ----
    print("\n\n📋 DEMO 3: Batch Evaluation with Group Recommendations")
    print("=" * 60)

    batch_request = {
        "students": [],
        "generate_group_recommendations": True
    }

    demo_students = [
        ("Fatima Ali", "NGEN-2024-00401", 8),
        ("Hassan Omar", "NGEN-2024-00402", 7),
        ("Mona Saeed", "NGEN-2024-00403", 9),
        ("Tariq Nabil", "NGEN-2024-00404", 6),
        ("Dina Kamal", "NGEN-2024-00405", 8),
        ("Rami Fares", "NGEN-2024-00406", 7),
        ("Hana Tarek", "NGEN-2024-00407", 9),
        ("Ziad Mostafa", "NGEN-2024-00408", 8)
    ]

    for name, sid, age in demo_students:
        _, sim_answers,_ = simulate_student_answers("6-9", num_questions=25)
        batch_request["students"].append({
            "student_info": {"name": name, "student_id": sid, "age": age},
            "age_group": "6-9",
            "answers": {str(k): v for k, v in sim_answers.items()}
        })

    batch_result = evaluate_batch_api(batch_request)

    if batch_result["success"]:
        print(f"\n  ✅ Batch evaluation complete!")
        print(f"  Total evaluated: {batch_result['total_evaluated']}")
        print(f"  Errors: {batch_result['total_errors']}")

        # Print compact student cards
        print(f"\n  {'='*60}")
        print(f"  STUDENT SUMMARY CARDS")
        print(f"  {'='*60}")

        for r in batch_result["reports"]:
            card = generate_student_card(r, "en")
            print(f"\n  🪪 {card['student_name']} (Age {card['age']})")
            print(
                f"     Overall: {card['overall_score']}/100 ({card['overall_level']})")
            print(
                f"     Style: {card['work_style']} | Pace: {card['learning_pace']}")
            print(
                f"     Group: {card['group_type']} | Effort: {card['effort_level']}")
            print(
                f"     Strength: {card['top_strength']} | Growth: {card['top_growth']}")

        # Print group recommendations
        if batch_result["group_recommendations"]:
            grecs = batch_result["group_recommendations"]
            print(f"\n  {'='*60}")
            print(f"  GROUP PLACEMENT RECOMMENDATIONS")
            print(f"  {'='*60}")
            print(f"  Total Students: {grecs['total_students']}")

            for gtype, gdata in grecs["groups"].items():
                print(f"\n  📦 {gdata['label_en']}")
                print(f"     Students: {gdata['member_count']}")
                print(
                    f"     Has Leader: {'✅' if gdata['has_natural_leader'] else '❌'}")
                print(
                    f"     Approach: {gdata['recommended_instructor_approach']}")
                for m in gdata["members"]:
                    print(
                        f"       → {m['name']} ({m['work_style']}, {m['pace']}, effort: {m['effort']})")

    # ---- Demo 4: Error Handling ----
    print("\n\n📋 DEMO 4: Error Handling")
    print("=" * 60)

    # Test: Missing fields
    bad_request_1 = {"student_info": {"name": "Test"}, "age_group": "6-9"}
    result_1 = evaluate_student_api(bad_request_1)
    print(
        f"\n  Test 1 (Missing answers): {'❌ ' + result_1['error'] if not result_1['success'] else '✅'}")

    # Test: Invalid age group
    bad_request_2 = {
        "student_info": {"name": "Test", "student_id": "T1", "age": 5},
        "age_group": "3-5",
        "answers": {"1": 0}
    }
    result_2 = evaluate_student_api(bad_request_2)
    print(
        f"  Test 2 (Invalid age group): {'❌ ' + result_2['error'] if not result_2['success'] else '✅'}")

    # Test: Too few answers
    bad_request_3 = {
        "student_info": {"name": "Test", "student_id": "T2", "age": 8},
        "age_group": "6-9",
        "answers": {"1": 0, "2": 1, "3": 2}
    }
    result_3 = evaluate_student_api(bad_request_3)
    print(
        f"  Test 3 (Too few answers): {'❌ ' + result_3['error'] if not result_3['success'] else '✅'}")

    # Test: Valid minimal request
    good_request = {
        "student_info": {"name": "Valid Student", "student_id": "V1", "age": 8},
        "age_group": "6-9",
        "answers": {str(i): random.randint(0, 3) for i in range(1, 26)}
    }
    result_4 = evaluate_student_api(good_request)
    print(
        f"  Test 4 (Valid request): {'✅ Success' if result_4['success'] else '❌ ' + result_4['error']}")

    print("\n\n" + "🔬" * 40)
    print("   COMPREHENSIVE DEMO COMPLETE")
    print("🔬" * 40)


# ============================================================
# 10. ENTRY POINT
# ============================================================

# Uncomment the line below to run the full comprehensive demo
# run_full_demo()

# Or run the default single + batch simulation:
if __name__ == "__main__":
    print("\n\n💡 To run the comprehensive demo, call: run_full_demo()")
    print("💡 To use the API function, call: evaluate_student_api(request_data)")
    print("💡 To evaluate a batch, call: evaluate_batch_api(request_data)")

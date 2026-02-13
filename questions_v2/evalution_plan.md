# Placement Test Evaluation System - Complete Plan

## Table of Contents

1. [Overview](#1-overview)
2. [Core Concepts](#2-core-concepts)
3. [Scoring System](#3-scoring-system)
4. [Mastery Levels](#4-mastery-levels)
5. [Normal Evaluation Flow](#5-normal-evaluation-flow)
6. [Edge Cases & Tiebreakers](#6-edge-cases--tiebreakers)
7. [Priority Calculation](#7-priority-calculation)
8. [Decision Matrices](#8-decision-matrices)
9. [Output Structure](#9-output-structure)
10. [Examples](#10-examples)

---

## 1. Overview

### 1.1 System Purpose

The Placement Test Evaluation System assesses students across multiple **independent belts** (topics/skill areas) to determine:

- Which belts the student can **skip** (already mastered)
- Which belts need **light review**
- Which belts require **full course study**
- **Priority order** for studying required belts

### 1.2 Key Principle: Independent Belts

```
┌─────────────────────────────────────────────────────────────────┐
│                    BELT INDEPENDENCE MODEL                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Each belt represents a SEPARATE skill/topic area:             │
│                                                                 │
│   ┌───────────┐   ┌───────────┐   ┌───────────┐                │
│   │White Belt │   │Yellow Belt│   │Orange Belt│                │
│   │  Topic A  │   │  Topic B  │   │  Topic C  │                │
│   └───────────┘   └───────────┘   └───────────┘                │
│        │               │               │                        │
│        ▼               ▼               ▼                        │
│   Independent     Independent     Independent                   │
│   Assessment      Assessment      Assessment                    │
│                                                                 │
│   ✓ No sequential dependency                                    │
│   ✓ Student may master some, need work on others               │
│   ✓ Each belt evaluated on its own merits                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Concepts

### 2.1 Question Structure

| Field | Description | Used For |
|-------|-------------|----------|
| `belt` | Belt/topic name | Grouping questions |
| `difficulty_level` | 1 (Easy), 2 (Medium), 3 (Hard) | Weighted scoring |
| `concepts` | List of concepts covered | Concept analysis |
| `ans_idx` | Correct answer index | Scoring |
| `choices` | Answer options | Validation |

### 2.2 Input Requirements

```
INPUTS:
├── questions: List[Dict]     # Questions from placement test
├── answers: List[int]        # Student's answer indices (same order)
└── config: Dict              # Optional configuration
    ├── mastery_threshold: float      # Default: 0.70
    ├── review_threshold: float       # Default: 0.40
    ├── use_weighted_scoring: bool    # Default: True
    └── difficulty_weights: Dict      # Default: {1:1, 2:2, 3:3}
```

### 2.3 Belt Importance Order (Configurable)

```
DEFAULT_BELT_IMPORTANCE = {
    "White Belt": 1,      # Most foundational
    "Yellow Belt": 2,
    "Orange Belt": 3,
    "Green Belt": 4,
    "Blue Belt": 5,
    "Purple Belt": 6,
    "Brown Belt": 7,
    "Black Belt": 8       # Most advanced
}

Note: Lower number = Higher importance for tiebreaking
```

---

## 3. Scoring System

### 3.1 Simple Scoring (Unweighted)

```
Score = Correct Answers / Total Questions × 100%

Example:
  7 correct out of 10 questions = 70%
```

### 3.2 Weighted Scoring (Recommended)

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEIGHTED SCORING SYSTEM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Difficulty Weights:                                           │
│   ┌──────────────┬────────┬─────────────────────────┐           │
│   │ Difficulty   │ Weight │ Rationale               │           │
│   ├──────────────┼────────┼─────────────────────────┤           │
│   │ Easy (1)     │ 1      │ Basic understanding     │           │
│   │ Medium (2)   │ 2      │ Applied knowledge       │           │
│   │ Hard (3)     │ 3      │ Advanced comprehension  │           │
│   └──────────────┴────────┴─────────────────────────┘           │
│                                                                 │
│   Formula:                                                      │
│   ──────────────────────────────────────────────────────────────│
│   Weighted Score = Σ (correct_i × weight_i)                     │
│   Max Score = Σ (weight_i) for all questions                    │
│   Percentage = Weighted Score / Max Score × 100%                │
│                                                                 │
│   Example:                                                      │
│   ──────────────────────────────────────────────────────────────│
│   Questions: 3 Easy, 4 Medium, 3 Hard                           │
│   Correct:   2 Easy, 3 Medium, 1 Hard                           │
│                                                                 │
│   Weighted Score = (2×1) + (3×2) + (1×3) = 2 + 6 + 3 = 11       │
│   Max Score = (3×1) + (4×2) + (3×3) = 3 + 8 + 9 = 20            │
│   Percentage = 11/20 = 55%                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Concept Scoring

```
For each concept within a belt:

Concept Score = Correct answers for concept / Total questions for concept

Concept Mastery Threshold: 70%
  - >= 70%: Concept MASTERED
  - < 50%:  Concept WEAK
  - 50-69%: Concept MODERATE
```

---

## 4. Mastery Levels

### 4.1 Level Definitions

```
┌─────────────────────────────────────────────────────────────────┐
│                      MASTERY LEVELS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   LEVEL              │ THRESHOLD  │ ACTION                      │
│   ───────────────────┼────────────┼──────────────────────────   │
│   FULLY_MASTERED     │ >= 90%     │ Skip belt entirely          │
│   MASTERED           │ >= 70%     │ Skip belt (optional review) │
│   NEEDS_REVIEW       │ >= 40%     │ Light review recommended    │
│   NEEDS_FULL_COURSE  │ < 40%      │ Complete course required    │
│   NOT_ASSESSED       │ N/A        │ No questions for this belt  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Visual Representation

```
0%                    40%                   70%           90%    100%
│─────────────────────│─────────────────────│─────────────│───────│
│   NEEDS_FULL_COURSE │    NEEDS_REVIEW     │   MASTERED  │ FULLY │
│                     │                     │             │MASTER │
│   📚 Full Course    │   📖 Review Only    │  ✅ Can Skip│  🌟   │
```

---

## 5. Normal Evaluation Flow

### 5.1 High-Level Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    EVALUATION FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐                                               │
│   │   START     │                                               │
│   └──────┬──────┘                                               │
│          ▼                                                      │
│   ┌─────────────────────────────────────┐                       │
│   │ 1. VALIDATE INPUTS                  │                       │
│   │    - Check questions/answers length │                       │
│   │    - Validate data structure        │                       │
│   └──────┬──────────────────────────────┘                       │
│          ▼                                                      │
│   ┌─────────────────────────────────────┐                       │
│   │ 2. GROUP QUESTIONS BY BELT          │                       │
│   │    - Extract unique belts           │                       │
│   │    - Associate answers              │                       │
│   └──────┬──────────────────────────────┘                       │
│          ▼                                                      │
│   ┌─────────────────────────────────────┐                       │
│   │ 3. ASSESS EACH BELT INDEPENDENTLY   │◄────────┐             │
│   │    - Calculate weighted score       │         │             │
│   │    - Analyze by difficulty          │         │             │
│   │    - Analyze by concept             │    Loop for           │
│   │    - Determine mastery level        │    each belt          │
│   │    - Identify strong/weak concepts  │         │             │
│   └──────┬──────────────────────────────┘─────────┘             │
│          ▼                                                      │
│   ┌─────────────────────────────────────┐                       │
│   │ 4. CATEGORIZE BELTS                 │                       │
│   │    - belts_to_skip                  │                       │
│   │    - belts_to_review                │                       │
│   │    - belts_to_study                 │                       │
│   └──────┬──────────────────────────────┘                       │
│          ▼                                                      │
│   ┌─────────────────────────────────────┐                       │
│   │ 5. CALCULATE STUDY PRIORITY         │                       │
│   │    - Apply priority formula         │                       │
│   │    - Handle tiebreakers             │                       │
│   │    - Generate ordered list          │                       │
│   └──────┬──────────────────────────────┘                       │
│          ▼                                                      │
│   ┌─────────────────────────────────────┐                       │
│   │ 6. GENERATE INSIGHTS                │                       │
│   │    - Overall strengths              │                       │
│   │    - Overall weaknesses             │                       │
│   │    - Study plan recommendations     │                       │
│   └──────┬──────────────────────────────┘                       │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │    END      │ → Return PlacementDecision                    │
│   └─────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Step-by-Step Details

#### Step 1: Validate Inputs

```
VALIDATION RULES:
├── len(questions) == len(answers)
├── Each question has required fields: belt, difficulty_level, ans_idx
├── Each answer is a valid integer
└── At least one question exists

ERROR HANDLING:
├── Mismatched lengths → Raise ValueError
├── Missing fields → Skip question with warning
└── Invalid answer → Treat as incorrect
```

#### Step 2: Group Questions by Belt

```
INPUT:
  questions = [q1, q2, q3, q4, q5, ...]
  answers = [a1, a2, a3, a4, a5, ...]

OUTPUT:
  grouped = {
      "White Belt": [(q1, a1), (q3, a3), ...],
      "Yellow Belt": [(q2, a2), (q5, a5), ...],
      "Orange Belt": [(q4, a4), ...],
  }
```

#### Step 3: Assess Each Belt

```
FOR EACH BELT:

1. Calculate Scores:
   ├── Total questions
   ├── Correct answers
   ├── Weighted score
   ├── Max weighted score
   └── Percentage

2. Analyze by Difficulty:
   ├── Easy: correct/total, percentage
   ├── Medium: correct/total, percentage
   └── Hard: correct/total, percentage

3. Analyze by Concept:
   FOR EACH concept in belt:
   ├── correct/total
   ├── percentage
   └── mastered (true/false)

4. Determine Mastery Level:
   ├── >= 90% → FULLY_MASTERED
   ├── >= 70% → MASTERED
   ├── >= 40% → NEEDS_REVIEW
   └── < 40%  → NEEDS_FULL_COURSE

5. Identify Concepts:
   ├── Strong concepts (>= 80%)
   └── Weak concepts (< 50%)
```

#### Step 4: Categorize Belts

```
CATEGORIZATION LOGIC:

belts_to_skip = []
belts_to_review = []
belts_to_study = []

FOR EACH belt assessment:
    IF mastery_level IN [FULLY_MASTERED, MASTERED]:
        belts_to_skip.append(belt)
    
    ELIF mastery_level == NEEDS_REVIEW:
        belts_to_review.append(belt)
        belts_to_study.append(belt)
    
    ELIF mastery_level == NEEDS_FULL_COURSE:
        belts_to_study.append(belt)
```

#### Step 5: Calculate Study Priority

```
See Section 7: Priority Calculation
```

#### Step 6: Generate Insights

```
STRENGTHS:
├── Belts with MASTERED or FULLY_MASTERED status
├── Concepts with >= 80% across all belts
└── Difficulty levels with >= 85% across all belts

WEAKNESSES:
├── Belts with NEEDS_FULL_COURSE status
├── Concepts with < 50% across all belts
└── Difficulty levels with < 40% across all belts

STUDY PLAN:
├── Prioritized list of belts to study
├── Specific concepts to focus on
└── Recommended approach (full course vs review)
```

---

## 6. Edge Cases & Tiebreakers

### 6.1 Edge Case Categories

```
┌─────────────────────────────────────────────────────────────────┐
│                      EDGE CASES OVERVIEW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   CATEGORY A: Score Equality                                    │
│   ├── A1: All belts same score (high: >= 70%)                   │
│   ├── A2: All belts same score (medium: 40-69%)                 │
│   ├── A3: All belts same score (low: < 40%)                     │
│   └── A4: Some belts have identical scores                      │
│                                                                 │
│   CATEGORY B: Data Edge Cases                                   │
│   ├── B1: Single belt assessed                                  │
│   ├── B2: No questions for a belt                               │
│   ├── B3: Very few questions per belt (< 3)                     │
│   └── B4: All questions same difficulty                         │
│                                                                 │
│   CATEGORY C: Extreme Scores                                    │
│   ├── C1: Perfect score (100%) on all belts                     │
│   ├── C2: Zero score (0%) on all belts                          │
│   ├── C3: Mixed extreme (some 100%, some 0%)                    │
│   └── C4: Borderline scores (exactly on thresholds)             │
│                                                                 │
│   CATEGORY D: Anomalies                                         │
│   ├── D1: High hard score, low easy score (guessing?)           │
│   ├── D2: High variance within belt                             │
│   └── D3: Inconsistent concept performance                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Tiebreaker System (When Scores Are Equal)

```
┌─────────────────────────────────────────────────────────────────┐
│                    TIEBREAKER HIERARCHY                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   PRIORITY ORDER (Applied sequentially until tie is broken):    │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ TIER 1: EASY QUESTION PERFORMANCE                       │   │
│   │         Lower easy score = Higher study priority        │   │
│   │         (Indicates fundamental gaps)                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                         │                                       │
│                    Still tied?                                  │
│                         ▼                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ TIER 2: WEAK CONCEPT COUNT                              │   │
│   │         More weak concepts = Higher study priority      │   │
│   │         (More areas need attention)                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                         │                                       │
│                    Still tied?                                  │
│                         ▼                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ TIER 3: HARD QUESTION PERFORMANCE                       │   │
│   │         Lower hard score = Higher study priority        │   │
│   │         (Less advanced potential shown)                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                         │                                       │
│                    Still tied?                                  │
│                         ▼                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ TIER 4: SCORE CONSISTENCY (VARIANCE)                    │   │
│   │         Higher variance = Higher study priority         │   │
│   │         (Inconsistent knowledge)                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                         │                                       │
│                    Still tied?                                  │
│                         ▼                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ TIER 5: BELT IMPORTANCE ORDER                           │   │
│   │         Lower importance number = Higher study priority │   │
│   │         (Foundational belts first)                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                         │                                       │
│                    Still tied?                                  │
│                         ▼                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ TIER 6: ALPHABETICAL ORDER                              │   │
│   │         (Final fallback - deterministic)                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Edge Case Handling Details

#### A1: All Belts Same HIGH Score (>= 70%)

```
SCENARIO:
  White Belt: 75%
  Yellow Belt: 75%
  Orange Belt: 75%

DECISION:
  - All belts marked as MASTERED
  - All go to belts_to_skip
  - No study priority needed

OUTPUT:
  belts_to_study: []
  belts_to_skip: [White Belt, Yellow Belt, Orange Belt]
  belts_to_review: []
  study_priority: []
  study_plan: [
    "🎉 Excellent! You've demonstrated mastery across all assessed belts.",
    "Consider exploring advanced topics or helping other learners."
  ]
```

#### A2: All Belts Same MEDIUM Score (40-69%)

```
SCENARIO:
  White Belt: 55%
  Yellow Belt: 55%
  Orange Belt: 55%

DECISION:
  - All belts marked as NEEDS_REVIEW
  - Apply tiebreaker system

TIEBREAKER EXAMPLE:
  ┌─────────────┬────────┬─────────┬───────────┬──────────┐
  │ Belt        │ Easy % │ Weak    │ Hard %    │ Priority │
  │             │        │ Concepts│           │          │
  ├─────────────┼────────┼─────────┼───────────┼──────────┤
  │ White Belt  │ 40%    │ 3       │ 70%       │ 1 (High) │
  │ Orange Belt │ 50%    │ 3       │ 60%       │ 2        │
  │ Yellow Belt │ 60%    │ 2       │ 50%       │ 3 (Low)  │
  └─────────────┴────────┴─────────┴───────────┴──────────┘
  
  Reasoning:
  - White Belt has lowest easy score (40%) → fundamental gaps
  - Orange Belt tied on weak concepts, but lower hard score
  - Yellow Belt has best fundamentals, fewer weak concepts
```

#### A3: All Belts Same LOW Score (< 40%)

```
SCENARIO:
  White Belt: 30%
  Yellow Belt: 30%
  Orange Belt: 30%

DECISION:
  - All belts marked as NEEDS_FULL_COURSE
  - Apply tiebreaker system
  - Emphasize belt importance order (foundational first)

OUTPUT:
  belts_to_study: [White Belt, Yellow Belt, Orange Belt]
  study_priority: [
    {rank: 1, belt: White Belt, reason: "Foundational belt, start here"},
    {rank: 2, belt: Yellow Belt, reason: "Build on basics"},
    {rank: 3, belt: Orange Belt, reason: "After foundations set"}
  ]
  study_plan: [
    "📚 Comprehensive study needed in all areas.",
    "⭐ Start with White Belt to build strong foundations.",
    "Follow the recommended study order for best results."
  ]
```

#### A4: Some Belts Have Identical Scores

```
SCENARIO:
  White Belt: 80% (MASTERED)
  Yellow Belt: 55% (NEEDS_REVIEW)
  Orange Belt: 55% (NEEDS_REVIEW)
  Green Belt: 35% (NEEDS_FULL_COURSE)

DECISION:
  - White Belt → belts_to_skip
  - Green Belt → highest priority (lowest score)
  - Yellow vs Orange → Apply tiebreakers

TIEBREAKER for Yellow vs Orange:
  IF easy_score(Yellow) < easy_score(Orange):
      Yellow gets higher priority
  ELIF weak_concepts(Yellow) > weak_concepts(Orange):
      Yellow gets higher priority
  ELIF hard_score(Yellow) < hard_score(Orange):
      Yellow gets higher priority
  ELSE:
      Use belt importance order
```

#### B1: Single Belt Assessed

```
SCENARIO:
  Only White Belt questions in test

DECISION:
  - Assess normally
  - No comparison needed
  - Clear recommendation based on score

OUTPUT:
  - Single belt in appropriate category
  - Simplified study plan
```

#### B2: No Questions for a Belt

```
SCENARIO:
  Test requested White, Yellow, Orange
  But no Yellow Belt questions exist

DECISION:
  - Mark Yellow Belt as NOT_ASSESSED
  - Exclude from all lists
  - Note in output

OUTPUT:
  detailed_analysis: {
    "Yellow Belt": {
      "status": "NOT_ASSESSED",
      "reason": "No questions available for this belt"
    }
  }
```

#### B3: Very Few Questions Per Belt (< 3)

```
SCENARIO:
  White Belt: 2 questions only

DECISION:
  - Assess normally BUT
  - Flag as LOW_CONFIDENCE
  - Recommend additional assessment

OUTPUT:
  belt_assessment: {
    "White Belt": {
      "percentage": 50%,
      "confidence": "LOW",
      "note": "Only 2 questions assessed. Consider additional testing."
    }
  }
```

#### B4: All Questions Same Difficulty

```
SCENARIO:
  All questions are Easy (level 1)

DECISION:
  - Simple scoring (weights don't differentiate)
  - Cannot assess difficulty performance
  - Tiebreakers skip difficulty analysis

OUTPUT:
  - Normal scoring
  - by_difficulty shows only one level
  - Tiebreaker moves to Tier 2 (weak concepts)
```

#### C1: Perfect Score (100%) on All Belts

```
SCENARIO:
  White Belt: 100%
  Yellow Belt: 100%
  Orange Belt: 100%

DECISION:
  - All FULLY_MASTERED
  - No study needed

OUTPUT:
  belts_to_study: []
  belts_to_skip: [White Belt, Yellow Belt, Orange Belt]
  overall_readiness: 100%
  study_plan: [
    "🌟 Perfect performance! You've fully mastered all assessed areas.",
    "You're ready for advanced challenges or to mentor others."
  ]
```

#### C2: Zero Score (0%) on All Belts

```
SCENARIO:
  White Belt: 0%
  Yellow Belt: 0%
  Orange Belt: 0%

DECISION:
  - All NEEDS_FULL_COURSE
  - Use belt importance for ordering
  - Check for possible issues (all wrong = guessing?)

OUTPUT:
  belts_to_study: [White Belt, Yellow Belt, Orange Belt]
  overall_readiness: 0%
  study_plan: [
    "📚 Comprehensive study recommended for all belts.",
    "⭐ Begin with White Belt fundamentals.",
    "Note: Consider retaking test to ensure answers were recorded correctly."
  ]
  flags: ["ALL_ZERO_SCORE"]
```

#### C3: Mixed Extreme (Some 100%, Some 0%)

```
SCENARIO:
  White Belt: 100%
  Yellow Belt: 0%
  Orange Belt: 50%

DECISION:
  - White Belt → FULLY_MASTERED → skip
  - Yellow Belt → NEEDS_FULL_COURSE → highest priority
  - Orange Belt → NEEDS_REVIEW → second priority

OUTPUT:
  belts_to_study: [Yellow Belt, Orange Belt]
  belts_to_skip: [White Belt]
  study_priority: [
    {rank: 1, belt: Yellow Belt, score: 0%},
    {rank: 2, belt: Orange Belt, score: 50%}
  ]
```

#### C4: Borderline Scores (Exactly on Thresholds)

```
SCENARIO:
  White Belt: 70.0% (exactly on mastery threshold)
  Yellow Belt: 40.0% (exactly on review threshold)
  Orange Belt: 89.9% (just under fully mastered)

DECISION:
  - Use >= for threshold comparison
  - 70.0% → MASTERED (included)
  - 40.0% → NEEDS_REVIEW (included)
  - 89.9% → MASTERED (not fully mastered)

RULE:
  >= threshold means MEETS the level
  < threshold means BELOW the level
```

#### D1: High Hard Score, Low Easy Score (Anomaly)

```
SCENARIO:
  White Belt:
    Easy: 30%
    Medium: 50%
    Hard: 80%

ANALYSIS:
  - Unusual pattern (typically inverse)
  - Possible explanations:
    a) Lucky guesses on hard questions
    b) Test question difficulty mislabeled
    c) Student has advanced knowledge but gaps in basics

DECISION:
  - Flag as ANOMALY
  - Still use easy score for priority (fundamentals matter)
  - Add recommendation for foundational review

OUTPUT:
  flags: ["INVERTED_DIFFICULTY_PATTERN"]
  recommendations: [
    "Unusual pattern detected: Strong on advanced concepts but weak on basics.",
    "Recommend reviewing fundamental concepts in White Belt."
  ]
```

#### D2: High Variance Within Belt

```
SCENARIO:
  White Belt:
    Hardware concepts: 90%
    Software concepts: 20%
    Overall: 55%

ANALYSIS:
  - High variance indicates inconsistent knowledge
  - Overall score may be misleading

DECISION:
  - Calculate variance score
  - Flag if variance > threshold
  - Provide concept-specific recommendations

OUTPUT:
  variance_flag: true
  concept_analysis: {
    "Hardware": {score: 90%, status: "STRONG"},
    "Software": {score: 20%, status: "CRITICAL_GAP"}
  }
  recommendations: [
    "Focus specifically on Software concepts within White Belt.",
    "Hardware knowledge is strong and can be briefly reviewed."
  ]
```

---

## 7. Priority Calculation

### 7.1 Priority Score Formula

```
┌─────────────────────────────────────────────────────────────────┐
│                 PRIORITY SCORE CALCULATION                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Priority_Score = Base_Score + Adjustments                     │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ BASE SCORE                                              │  │
│   │ ─────────────────────────────────────────────────────── │  │
│   │ Base = (1 - overall_percentage) × 100                   │  │
│   │                                                         │  │
│   │ Example: 60% score → (1 - 0.60) × 100 = 40 points      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ ADJUSTMENT 1: Easy Question Performance                 │  │
│   │ ─────────────────────────────────────────────────────── │  │
│   │ Adj_Easy = (1 - easy_percentage) × 30                   │  │
│   │                                                         │  │
│   │ Weight: 30 (highest adjustment - fundamentals crucial)  │  │
│   │ Example: 50% easy → (1 - 0.50) × 30 = 15 points        │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ ADJUSTMENT 2: Weak Concept Count                        │  │
│   │ ─────────────────────────────────────────────────────── │  │
│   │ Adj_Concepts = weak_concept_count × 5                   │  │
│   │                                                         │  │
│   │ Weight: 5 per concept                                   │  │
│   │ Example: 3 weak concepts → 3 × 5 = 15 points           │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ ADJUSTMENT 3: Hard Question Performance                 │  │
│   │ ─────────────────────────────────────────────────────── │  │
│   │ Adj_Hard = (1 - hard_percentage) × 10                   │  │
│   │                                                         │  │
│   │ Weight: 10 (lower than easy - potential indicator)      │  │
│   │ Example: 40% hard → (1 - 0.40) × 10 = 6 points         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ ADJUSTMENT 4: Belt Importance                           │  │
│   │ ─────────────────────────────────────────────────────── │  │
│   │ Adj_Importance = (max_importance - belt_importance) × 2 │  │
│   │                                                         │  │
│   │ Weight: 2 per rank difference                           │  │
│   │ Example: White Belt (importance 1, max 8)               │  │
│   │          → (8 - 1) × 2 = 14 points                     │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ ADJUSTMENT 5: Mastery Level Penalty                     │  │
│   │ ─────────────────────────────────────────────────────── │  │
│   │ NEEDS_FULL_COURSE: +15 points                          │  │
│   │ NEEDS_REVIEW: +0 points                                 │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   FINAL FORMULA:                                                │
│   ═══════════════════════════════════════════════════════════  │
│   Priority_Score = Base                                         │
│                  + Adj_Easy                                     │
│                  + Adj_Concepts                                 │
│                  + Adj_Hard                                     │
│                  + Adj_Importance                               │
│                  + Mastery_Penalty                              │
│                                                                 │
│   Higher Score = Higher Study Priority                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Calculation Example

```
SCENARIO: Three belts all at 55% overall

┌────────────────────────────────────────────────────────────────────┐
│                     PRIORITY CALCULATION EXAMPLE                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ WHITE BELT (Overall: 55%)                                          │
│ ─────────────────────────────────────────────────────────────────  │
│ Easy: 40% | Weak Concepts: 3 | Hard: 70% | Importance: 1           │
│                                                                    │
│ Base:           (1 - 0.55) × 100 = 45.0                           │
│ Adj_Easy:       (1 - 0.40) × 30  = 18.0                           │
│ Adj_Concepts:   3 × 5            = 15.0                           │
│ Adj_Hard:       (1 - 0.70) × 10  = 3.0                            │
│ Adj_Importance: (8 - 1) × 2      = 14.0                           │
│ Mastery_Penalty: 0 (NEEDS_REVIEW)                                  │
│ ─────────────────────────────────────────────────────────────────  │
│ TOTAL: 45 + 18 + 15 + 3 + 14 + 0 = 95.0                           │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ YELLOW BELT (Overall: 55%)                                         │
│ ─────────────────────────────────────────────────────────────────  │
│ Easy: 60% | Weak Concepts: 2 | Hard: 50% | Importance: 2           │
│                                                                    │
│ Base:           (1 - 0.55) × 100 = 45.0                           │
│ Adj_Easy:       (1 - 0.60) × 30  = 12.0                           │
│ Adj_Concepts:   2 × 5            = 10.0                           │
│ Adj_Hard:       (1 - 0.50) × 10  = 5.0                            │
│ Adj_Importance: (8 - 2) × 2      = 12.0                           │
│ Mastery_Penalty: 0 (NEEDS_REVIEW)                                  │
│ ─────────────────────────────────────────────────────────────────  │
│ TOTAL: 45 + 12 + 10 + 5 + 12 + 0 = 84.0                           │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ ORANGE BELT (Overall: 55%)                                         │
│ ─────────────────────────────────────────────────────────────────  │
│ Easy: 55% | Weak Concepts: 2 | Hard: 55% | Importance: 3           │
│                                                                    │
│ Base:           (1 - 0.55) × 100 = 45.0                           │
│ Adj_Easy:       (1 - 0.55) × 30  = 13.5                           │
│ Adj_Concepts:   2 × 5            = 10.0                           │
│ Adj_Hard:       (1 - 0.55) × 10  = 4.5                            │
│ Adj_Importance: (8 - 3) × 2      = 10.0                           │
│ Mastery_Penalty: 0 (NEEDS_REVIEW)                                  │
│ ─────────────────────────────────────────────────────────────────  │
│ TOTAL: 45 + 13.5 + 10 + 4.5 + 10 + 0 = 83.0                       │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ FINAL PRIORITY ORDER:                                              │
│ ═══════════════════════════════════════════════════════════════   │
│ 1. White Belt  (95.0 points) ← Highest priority                   │
│ 2. Yellow Belt (84.0 points)                                       │
│ 3. Orange Belt (83.0 points) ← Lowest priority                    │
│                                                                    │
│ Despite same overall scores, White Belt prioritized due to:        │
│ - Lowest easy question score (fundamental gaps)                    │
│ - Most weak concepts                                               │
│ - Highest belt importance (foundational)                           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 8. Decision Matrices

### 8.1 Overall Score to Action Matrix

```
┌──────────────────┬─────────────────┬────────────────────────────────┐
│ Score Range      │ Mastery Level   │ Action                         │
├──────────────────┼─────────────────┼────────────────────────────────┤
│ >= 90%           │ FULLY_MASTERED  │ Skip belt entirely             │
│ 70% - 89%        │ MASTERED        │ Skip (optional quick review)   │
│ 40% - 69%        │ NEEDS_REVIEW    │ Review course materials        │
│ < 40%            │ NEEDS_FULL_COURSE│ Complete full course          │
│ N/A              │ NOT_ASSESSED    │ Cannot determine               │
└──────────────────┴─────────────────┴────────────────────────────────┘
```

### 8.2 Difficulty Performance Analysis Matrix

```
┌────────────────────────────────────────────────────────────────────┐
│              DIFFICULTY PERFORMANCE INTERPRETATION                  │
├──────────┬──────────┬──────────┬───────────────────────────────────┤
│ Easy %   │ Medium % │ Hard %   │ Interpretation                    │
├──────────┼──────────┼──────────┼───────────────────────────────────┤
│ High     │ High     │ High     │ Strong overall understanding      │
│ High     │ High     │ Low      │ Good basics, needs advanced work  │
│ High     │ Low      │ Low      │ Only basics understood            │
│ High     │ Low      │ High     │ Gaps in middle knowledge (odd)    │
│ Low      │ High     │ High     │ Fundamental gaps! Review basics   │
│ Low      │ High     │ Low      │ Inconsistent, needs structure     │
│ Low      │ Low      │ High     │ Anomaly - verify test validity    │
│ Low      │ Low      │ Low      │ Needs comprehensive study         │
└──────────┴──────────┴──────────┴───────────────────────────────────┘

Thresholds: High >= 70%, Low < 50%
```

### 8.3 Concept Mastery Matrix

```
┌────────────────────────────────────────────────────────────────────┐
│                    CONCEPT STATUS MAPPING                           │
├──────────────────┬─────────────────────────────────────────────────┤
│ Concept Score    │ Status & Action                                 │
├──────────────────┼─────────────────────────────────────────────────┤
│ >= 80%           │ STRONG - Can skip or quick review               │
│ 70% - 79%        │ ADEQUATE - Brief review recommended             │
│ 50% - 69%        │ MODERATE - Focused study needed                 │
│ < 50%            │ WEAK - Priority focus area                      │
└──────────────────┴─────────────────────────────────────────────────┘
```

### 8.4 Confidence Level Matrix

```
┌────────────────────────────────────────────────────────────────────┐
│                    ASSESSMENT CONFIDENCE                            │
├────────────────────┬───────────────┬───────────────────────────────┤
│ Questions per Belt │ Confidence    │ Recommendation                │
├────────────────────┼───────────────┼───────────────────────────────┤
│ >= 10              │ HIGH          │ Reliable assessment           │
│ 5 - 9              │ MEDIUM        │ Generally reliable            │
│ 3 - 4              │ LOW           │ Consider additional testing   │
│ 1 - 2              │ VERY_LOW      │ Insufficient data             │
│ 0                  │ NONE          │ Cannot assess                 │
└────────────────────┴───────────────┴───────────────────────────────┘
```

---

## 9. Output Structure

### 9.1 Primary Output Object

```
PlacementDecision {
    // Core Decisions
    belts_to_study: List[str]           // Belts requiring study
    belts_to_skip: List[str]            // Belts that can be skipped
    belts_to_review: List[str]          // Belts needing light review only
    
    // Priority Information
    study_priority: List[PriorityItem]  // Ordered list with details
    
    // Statistics
    total_belts_assessed: int
    overall_readiness: float            // 0-100%
    
    // Detailed Assessments
    belt_assessments: Dict[str, BeltAssessment]
    
    // Insights
    overall_strengths: List[str]
    overall_weaknesses: List[str]
    study_plan: List[str]
    
    // Flags
    flags: List[str]                    // Any anomalies detected
    
    // Raw Data
    detailed_analysis: Dict
}
```

### 9.2 Belt Assessment Object

```
BeltAssessment {
    belt: str
    total_questions: int
    correct_answers: int
    percentage: float
    weighted_score: float
    max_weighted_score: float
    mastery_level: MasteryLevel
    confidence: ConfidenceLevel
    
    by_difficulty: {
        1: {correct: int, total: int, percentage: float},
        2: {correct: int, total: int, percentage: float},
        3: {correct: int, total: int, percentage: float}
    }
    
    by_concept: {
        "concept_name": {
            correct: int,
            total: int,
            percentage: float,
            mastered: bool
        }
    }
    
    strong_concepts: List[str]
    weak_concepts: List[str]
}
```

### 9.3 Priority Item Object

```
PriorityItem {
    rank: int                   // 1 = highest priority
    belt: str
    priority_score: float
    percentage: float
    mastery_level: str
    reasons: List[str]          // Why this priority
    weak_concepts: List[str]    // Specific areas to focus
}
```

### 9.4 Summary Output (API-Friendly)

```json
{
    "overall_readiness": 56.7,
    "belts_to_study": ["Yellow Belt", "Orange Belt"],
    "belts_to_skip": ["White Belt"],
    "belts_to_review": ["Yellow Belt"],
    "study_priority": [
        {
            "rank": 1,
            "belt": "Orange Belt",
            "score_percentage": 35.0,
            "status": "needs_full_course",
            "weak_concepts": ["Internet Safety", "Web Browsers"]
        },
        {
            "rank": 2,
            "belt": "Yellow Belt",
            "score_percentage": 55.0,
            "status": "needs_review",
            "weak_concepts": ["File Management"]
        }
    ],
    "study_plan": [
        "📚 Start with complete course for: Orange Belt",
        "📖 Review materials recommended for: Yellow Belt",
        "🎯 Focus especially on: Internet Safety, Web Browsers, File Management"
    ],
    "strengths": [
        "Strong performance in: White Belt",
        "Solid understanding of: Hardware"
    ],
    "weaknesses": [
        "Needs work in: Orange Belt",
        "Review needed for: Internet Safety"
    ]
}
```

---

## 10. Examples

### 10.1 Example: Varied Performance

```
INPUT:
  Questions: 30 total (10 per belt)
  
  White Belt Answers:  8/10 correct (80%)
  Yellow Belt Answers: 5/10 correct (50%)
  Orange Belt Answers: 3/10 correct (30%)

OUTPUT:
  ┌────────────────────────────────────────────────────────────┐
  │ PLACEMENT DECISION                                         │
  ├────────────────────────────────────────────────────────────┤
  │                                                            │
  │ ✅ CAN SKIP:                                               │
  │    • White Belt (80% - MASTERED)                          │
  │                                                            │
  │ 📖 NEEDS REVIEW:                                           │
  │    • Yellow Belt (50% - NEEDS_REVIEW)                     │
  │                                                            │
  │ 📚 NEEDS FULL COURSE:                                      │
  │    • Orange Belt (30% - NEEDS_FULL_COURSE)                │
  │                                                            │
  │ STUDY PRIORITY:                                            │
  │    1. Orange Belt (Score: 30%)                            │
  │    2. Yellow Belt (Score: 50%)                            │
  │                                                            │
  │ OVERALL READINESS: 53.3%                                   │
  │                                                            │
  └────────────────────────────────────────────────────────────┘
```

### 10.2 Example: All Equal Scores

```
INPUT:
  Questions: 30 total (10 per belt)
  
  White Belt:  6/10 correct (60%)
    - Easy: 2/3 (67%), Medium: 2/4 (50%), Hard: 2/3 (67%)
    - Weak concepts: Hardware, Input Devices
  
  Yellow Belt: 6/10 correct (60%)
    - Easy: 3/3 (100%), Medium: 2/4 (50%), Hard: 1/3 (33%)
    - Weak concepts: Software Installation
  
  Orange Belt: 6/10 correct (60%)
    - Easy: 2/3 (67%), Medium: 3/4 (75%), Hard: 1/3 (33%)
    - Weak concepts: Web Browsers

TIEBREAKER ANALYSIS:
  ┌─────────────┬────────┬─────────────┬────────┬───────────┐
  │ Belt        │ Easy % │ Weak Count  │ Hard % │ Importance│
  ├─────────────┼────────┼─────────────┼────────┼───────────┤
  │ White Belt  │ 67%    │ 2           │ 67%    │ 1         │
  │ Yellow Belt │ 100%   │ 1           │ 33%    │ 2         │
  │ Orange Belt │ 67%    │ 1           │ 33%    │ 3         │
  └─────────────┴────────┴─────────────┴────────┴───────────┘

PRIORITY CALCULATION:
  White Belt:  45 + 9.9 + 10 + 3.3 + 14 = 82.2
  Orange Belt: 45 + 9.9 + 5 + 6.7 + 10 = 76.6
  Yellow Belt: 45 + 0 + 5 + 6.7 + 12 = 68.7

OUTPUT:
  ┌────────────────────────────────────────────────────────────┐
  │ PLACEMENT DECISION (EQUAL SCORES RESOLVED)                 │
  ├────────────────────────────────────────────────────────────┤
  │                                                            │
  │ All belts at 60% - NEEDS_REVIEW                           │
  │                                                            │
  │ STUDY PRIORITY (after tiebreakers):                       │
  │    1. White Belt  (82.2 pts)                              │
  │       Reason: More weak concepts, foundational belt       │
  │                                                            │
  │    2. Orange Belt (76.6 pts)                              │
  │       Reason: Lower easy score than Yellow                │
  │                                                            │
  │    3. Yellow Belt (68.7 pts)                              │
  │       Reason: Best fundamentals (100% easy)               │
  │                                                            │
  └────────────────────────────────────────────────────────────┘
```

### 10.3 Example: All Perfect Scores

```
INPUT:
  All belts: 100% correct

OUTPUT:
  ┌────────────────────────────────────────────────────────────┐
  │ PLACEMENT DECISION                                         │
  ├────────────────────────────────────────────────────────────┤
  │                                                            │
  │ 🌟 OVERALL READINESS: 100%                                │
  │                                                            │
  │ ✅ CAN SKIP:                                               │
  │    • White Belt (100% - FULLY_MASTERED)                   │
  │    • Yellow Belt (100% - FULLY_MASTERED)                  │
  │    • Orange Belt (100% - FULLY_MASTERED)                  │
  │                                                            │
  │ 📚 NEEDS STUDY: None                                       │
  │                                                            │
  │ STUDY PLAN:                                                │
  │    🎉 Perfect performance across all assessed belts!       │
  │    Consider advancing to higher-level content or          │
  │    taking on mentorship roles.                            │
  │                                                            │
  └────────────────────────────────────────────────────────────┘
```

### 10.4 Example: All Zero Scores

```
INPUT:
  All belts: 0% correct

OUTPUT:
  ┌────────────────────────────────────────────────────────────┐
  │ PLACEMENT DECISION                                         │
  ├────────────────────────────────────────────────────────────┤
  │                                                            │
  │ 🎯 OVERALL READINESS: 0%                                  │
  │                                                            │
  │ ⚠️ FLAG: ALL_ZERO_SCORE                                   │
  │    Consider verifying test was completed correctly.       │
  │                                                            │
  │ 📚 NEEDS FULL COURSE (all belts):                         │
  │    • White Belt (0%)                                      │
  │    • Yellow Belt (0%)                                     │
  │    • Orange Belt (0%)                                     │
  │                                                            │
  │ STUDY PRIORITY (by belt importance):                      │
  │    1. White Belt (foundational)                           │
  │    2. Yellow Belt                                         │
  │    3. Orange Belt                                         │
  │                                                            │
  │ STUDY PLAN:                                                │
  │    📚 Comprehensive study required in all areas.          │
  │    ⭐ Begin with White Belt fundamentals.                 │
  │    💡 Consider smaller study sessions with frequent       │
  │       knowledge checks.                                   │
  │                                                            │
  └────────────────────────────────────────────────────────────┘
```

---

## Appendix A: Configuration Defaults

```
DEFAULT_CONFIG = {
    "mastery_threshold": 0.70,
    "fully_mastered_threshold": 0.90,
    "review_threshold": 0.40,
    "use_weighted_scoring": True,
    "difficulty_weights": {1: 1, 2: 2, 3: 3},
    "concept_mastery_threshold": 0.70,
    "min_questions_for_confidence": 5,
    "priority_weights": {
        "base": 100,
        "easy_performance": 30,
        "weak_concepts": 5,
        "hard_performance": 10,
        "belt_importance": 2,
        "full_course_penalty": 15
    }
}
```

---

## Appendix B: Flags Reference

```
┌─────────────────────────────┬───────────────────────────────────────┐
│ Flag                        │ Description                           │
├─────────────────────────────┼───────────────────────────────────────┤
│ ALL_ZERO_SCORE              │ All belts scored 0%                   │
│ ALL_PERFECT_SCORE           │ All belts scored 100%                 │
│ LOW_CONFIDENCE              │ Few questions per belt (< 5)          │
│ INVERTED_DIFFICULTY_PATTERN │ High hard score, low easy score       │
│ HIGH_VARIANCE               │ Inconsistent concept performance      │
│ BORDERLINE_SCORE            │ Score exactly on threshold            │
│ SINGLE_BELT                 │ Only one belt assessed                │
│ MISSING_BELT_DATA           │ Some belts have no questions          │
└─────────────────────────────┴───────────────────────────────────────┘
```

---

## Appendix C: Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────┐
│                        QUICK REFERENCE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  MASTERY LEVELS:                                                    │
│    >= 90%  →  FULLY_MASTERED  →  Skip                              │
│    >= 70%  →  MASTERED        →  Skip                              │
│    >= 40%  →  NEEDS_REVIEW    →  Review                            │
│    < 40%   →  NEEDS_FULL_COURSE → Full Course                      │
│                                                                     │
│  TIEBREAKER ORDER:                                                  │
│    1. Easy question score (lower = higher priority)                │
│    2. Weak concept count (more = higher priority)                  │
│    3. Hard question score (lower = higher priority)                │
│    4. Score variance (higher = higher priority)                    │
│    5. Belt importance (lower number = higher priority)             │
│    6. Alphabetical order (final fallback)                          │
│                                                                     │
│  PRIORITY FORMULA:                                                  │
│    Score = (1-overall)×100 + (1-easy)×30 + weak×5                  │
│          + (1-hard)×10 + importance_adj + level_penalty            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```
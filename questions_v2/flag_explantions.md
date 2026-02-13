# Placement Test Flags Explained

## Overview

Flags are **warning indicators** that alert you to unusual patterns, edge cases, or data quality issues detected during evaluation. They help you interpret results more accurately and take appropriate action.

---

## Flag Reference

### 1. ALL_ZERO_SCORE

```
┌─────────────────────────────────────────────────────────────────┐
│ ALL_ZERO_SCORE                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ MEANING:                                                        │
│   Student answered 0% correctly across ALL belts                │
│                                                                 │
│ POSSIBLE CAUSES:                                                │
│   • Student didn't understand the material at all               │
│   • Technical issue (answers not recorded properly)             │
│   • Student intentionally selected wrong answers                │
│   • Answer key mismatch (system error)                          │
│                                                                 │
│ RECOMMENDED ACTION:                                             │
│   • Verify test was submitted correctly                         │
│   • Check for technical issues                                  │
│   • If valid, student needs comprehensive beginner courses      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2. ALL_PERFECT_SCORE

```
┌─────────────────────────────────────────────────────────────────┐
│ ALL_PERFECT_SCORE                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ MEANING:                                                        │
│   Student answered 100% correctly across ALL belts              │
│                                                                 │
│ POSSIBLE CAUSES:                                                │
│   • Student has complete mastery of all topics                  │
│   • Test was too easy for the student's level                   │
│   • Student had access to answers (cheating)                    │
│   • Test questions were previously seen                         │
│                                                                 │
│ RECOMMENDED ACTION:                                             │
│   • Consider offering advanced placement                        │
│   • May need harder assessment for accurate placement           │
│   • Verify test integrity if suspicious                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3. ALL_EQUAL_SCORES

```
┌─────────────────────────────────────────────────────────────────┐
│ ALL_EQUAL_SCORES                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ MEANING:                                                        │
│   Student scored exactly the same percentage on every belt      │
│   Example: 60% on White, 60% on Yellow, 60% on Orange           │
│                                                                 │
│ POSSIBLE CAUSES:                                                │
│   • Consistent knowledge level across all topics                │
│   • Random guessing (statistically possible)                    │
│   • Similar difficulty across all belt questions                │
│                                                                 │
│ WHY IT MATTERS:                                                 │
│   • Tiebreaker logic is activated to determine priority         │
│   • Cannot differentiate belts by score alone                   │
│   • Need secondary factors (easy %, weak concepts, etc.)        │
│                                                                 │
│ RECOMMENDED ACTION:                                             │
│   • Review tiebreaker-based priority order                      │
│   • Consider student preference for study order                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. LOW_CONFIDENCE_ASSESSMENTS

```
┌─────────────────────────────────────────────────────────────────┐
│ LOW_CONFIDENCE_ASSESSMENTS                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ MEANING:                                                        │
│   One or more belts had very few questions (less than 5)        │
│   Assessment reliability is reduced                             │
│                                                                 │
│ EXAMPLE:                                                        │
│   White Belt: 10 questions → HIGH confidence                    │
│   Yellow Belt: 3 questions → LOW confidence                     │
│   Orange Belt: 2 questions → VERY LOW confidence                │
│                                                                 │
│ WHY IT MATTERS:                                                 │
│   • Small sample size = less reliable results                   │
│   • One lucky/unlucky answer significantly affects score        │
│   • 2 questions: 50% vs 100% is just 1 answer difference        │
│                                                                 │
│ CONFIDENCE THRESHOLDS:                                          │
│   • HIGH: 10+ questions                                         │
│   • MEDIUM: 5-9 questions                                       │
│   • LOW: 3-4 questions                                          │
│   • VERY LOW: 1-2 questions                                     │
│                                                                 │
│ RECOMMENDED ACTION:                                             │
│   • Consider additional testing for low-confidence belts        │
│   • Weight decisions more heavily on high-confidence results    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5. INVERTED_DIFFICULTY_PATTERN

```
┌─────────────────────────────────────────────────────────────────┐
│ INVERTED_DIFFICULTY_PATTERN                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ MEANING:                                                        │
│   Student performed BETTER on hard questions than easy ones     │
│   This is opposite to the expected pattern                      │
│                                                                 │
│ NORMAL PATTERN:                                                 │
│   Easy: 90% → Medium: 70% → Hard: 50%                           │
│   (Performance decreases as difficulty increases)               │
│                                                                 │
│ INVERTED PATTERN:                                               │
│   Easy: 40% → Medium: 60% → Hard: 80%                           │
│   (Performance INCREASES as difficulty increases) ⚠️            │
│                                                                 │
│ POSSIBLE CAUSES:                                                │
│   • Lucky guesses on hard questions                             │
│   • Question difficulty mislabeled                              │
│   • Student has advanced knowledge but gaps in basics           │
│   • Student rushed through easy questions carelessly            │
│   • Cheating on specific questions                              │
│                                                                 │
│ WHY IT MATTERS:                                                 │
│   • Unusual pattern suggests unreliable assessment              │
│   • May indicate fundamental knowledge gaps                     │
│   • Overall score may be misleading                             │
│                                                                 │
│ RECOMMENDED ACTION:                                             │
│   • Review fundamental concepts regardless of overall score     │
│   • Consider re-assessment with focus on basics                 │
│   • Investigate if pattern persists                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6. HIGH_VARIANCE_DETECTED

```
┌─────────────────────────────────────────────────────────────────┐
│ HIGH_VARIANCE_DETECTED                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ MEANING:                                                        │
│   Student's performance varies significantly within a belt      │
│   Inconsistent scores across difficulty levels or concepts      │
│                                                                 │
│ LOW VARIANCE (Consistent):                                      │
│   Easy: 70% | Medium: 65% | Hard: 60%                           │
│   Concept A: 70% | Concept B: 65% | Concept C: 75%              │
│                                                                 │
│ HIGH VARIANCE (Inconsistent):                                   │
│   Easy: 90% | Medium: 40% | Hard: 70%                           │
│   Concept A: 95% | Concept B: 20% | Concept C: 80%              │
│                                                                 │
│ POSSIBLE CAUSES:                                                │
│   • Strong in some concepts, weak in others                     │
│   • Inconsistent focus or attention during test                 │
│   • Gaps in specific knowledge areas                            │
│   • Some topics previously learned, others completely new       │
│                                                                 │
│ WHY IT MATTERS:                                                 │
│   • Overall percentage may be misleading                        │
│   • Student needs targeted study, not general review            │
│   • Some concepts may need full course, others just review      │
│                                                                 │
│ RECOMMENDED ACTION:                                             │
│   • Focus on specific weak concepts, not entire belt            │
│   • Review concept-level breakdown for targeted study           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 7. SINGLE_BELT_ASSESSED

```
┌─────────────────────────────────────────────────────────────────┐
│ SINGLE_BELT_ASSESSED                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ MEANING:                                                        │
│   Only one belt was included in the placement test              │
│                                                                 │
│ WHY IT MATTERS:                                                 │
│   • Cannot compare performance across belts                     │
│   • Limited view of student's overall readiness                 │
│   • May not be sufficient for comprehensive placement           │
│                                                                 │
│ RECOMMENDED ACTION:                                             │
│   • Consider if single-belt assessment is intentional           │
│   • May need additional belt assessments for full placement     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8. BORDERLINE_SCORE

```
┌─────────────────────────────────────────────────────────────────┐
│ BORDERLINE_SCORE                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ MEANING:                                                        │
│   Student's score is exactly on or very close to a threshold    │
│                                                                 │
│ THRESHOLDS:                                                     │
│   • 40% - Border between NEEDS_FULL_COURSE and NEEDS_REVIEW     │
│   • 70% - Border between NEEDS_REVIEW and MASTERED              │
│   • 90% - Border between MASTERED and FULLY_MASTERED            │
│                                                                 │
│ EXAMPLE:                                                        │
│   Score: 70.0% → Just barely MASTERED                           │
│   Score: 69.9% → Just barely NEEDS_REVIEW                       │
│   (0.1% difference changes the entire recommendation)           │
│                                                                 │
│ WHY IT MATTERS:                                                 │
│   • Small score change would change placement decision          │
│   • One or two questions could flip the category                │
│   • Decision is less certain than clear-cut scores              │
│                                                                 │
│ RECOMMENDED ACTION:                                             │
│   • Consider light review even if technically "mastered"        │
│   • Don't strictly enforce the threshold                        │
│   • Use judgment based on other factors                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 9. NO_DATA / NO_ASSESSMENTS / NO_VALID_ASSESSMENTS

```
┌─────────────────────────────────────────────────────────────────┐
│ NO_DATA / NO_ASSESSMENTS / NO_VALID_ASSESSMENTS                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ MEANING:                                                        │
│   • NO_DATA: No questions were provided                         │
│   • NO_ASSESSMENTS: Questions exist but no belt data found      │
│   • NO_VALID_ASSESSMENTS: All belts marked as NOT_ASSESSED      │
│                                                                 │
│ POSSIBLE CAUSES:                                                │
│   • Empty test submitted                                        │
│   • Data format error                                           │
│   • Missing belt field in questions                             │
│   • Filter criteria too restrictive                             │
│                                                                 │
│ RECOMMENDED ACTION:                                             │
│   • Check input data format                                     │
│   • Verify questions have required fields                       │
│   • Cannot make placement decision without data                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flag Summary Table

| Flag | Severity | Meaning | Action Required |
|------|----------|---------|-----------------|
| `ALL_ZERO_SCORE` | 🔴 High | 0% on everything | Verify data, start from basics |
| `ALL_PERFECT_SCORE` | 🟡 Medium | 100% on everything | Consider advanced placement |
| `ALL_EQUAL_SCORES` | 🟢 Low | Same score all belts | Use tiebreaker priority |
| `LOW_CONFIDENCE_ASSESSMENTS` | 🟡 Medium | Few questions per belt | Consider additional testing |
| `INVERTED_DIFFICULTY_PATTERN` | 🔴 High | Better on hard than easy | Review fundamentals |
| `HIGH_VARIANCE_DETECTED` | 🟡 Medium | Inconsistent performance | Target specific concepts |
| `SINGLE_BELT_ASSESSED` | 🟢 Low | Only one belt tested | May need more assessment |
| `BORDERLINE_SCORE` | 🟢 Low | Score exactly on threshold | Use judgment |
| `NO_DATA` | 🔴 High | No input data | Check data source |

---

## Multiple Flags

A single evaluation can trigger **multiple flags** simultaneously:

```
EXAMPLE:
  Flags: [
    "ALL_EQUAL_SCORES",
    "LOW_CONFIDENCE_ASSESSMENTS", 
    "INVERTED_DIFFICULTY_PATTERN"
  ]

INTERPRETATION:
  - All belts scored the same (tiebreakers used)
  - Some belts had few questions (less reliable)
  - Unusual easy/hard performance pattern (review basics)

This student needs:
  1. Possibly additional testing (low confidence)
  2. Focus on fundamentals (inverted pattern)
  3. Tiebreaker-based study order (equal scores)
```

---

## Using Flags in Decision Making

```
┌─────────────────────────────────────────────────────────────────┐
│                 FLAG-BASED DECISION GUIDE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ IF flags contain "ALL_ZERO_SCORE":                              │
│    → Verify test validity before making decisions               │
│                                                                 │
│ IF flags contain "ALL_PERFECT_SCORE":                           │
│    → Student may need advanced assessment                       │
│                                                                 │
│ IF flags contain "INVERTED_DIFFICULTY_PATTERN":                 │
│    → Always recommend fundamental review                        │
│                                                                 │
│ IF flags contain "LOW_CONFIDENCE_ASSESSMENTS":                  │
│    → Consider results tentative, suggest re-testing             │
│                                                                 │
│ IF flags contain "HIGH_VARIANCE_DETECTED":                      │
│    → Look at concept-level details, not just overall score      │
│                                                                 │
│ IF flags contain "BORDERLINE_SCORE":                            │
│    → Apply flexibility in placement decision                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Would you like me to add any additional flags or modify the existing ones?
# Feature Specification: Sequential Belt Assignment Logic

**Feature Branch**: `001-belt-assignment`  
**Created**: 2026-02-25  
**Status**: Draft  
**Input**: User description: "Change the passing criteria and belt assignment in the general test to use a sequential chain evaluation with an 80% pass threshold"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sequential Belt Evaluation (Priority: P1)

A student takes the general placement test and answers questions across multiple belt levels (White, Yellow, Orange, Green, etc.). After submission, the system evaluates their scores for each belt **sequentially**, starting from the lowest belt (White). If the student scores **≥80%** on a belt, that belt is considered "passed" and the system moves to the next belt in the chain. When a student scores **<80%** on a belt, the chain stops and that belt is **assigned** as their current belt — the one they need to study.

**Why this priority**: This is the core logic change — the entire purpose of the feature. Without this, nothing else works.

**Independent Test**: Can be fully tested by submitting a general placement test and verifying the assigned belt matches the sequential chain logic.

**Acceptance Scenarios**:

1. **Given** a student scores 90% on White, 100% on Yellow, 60% on Orange, **When** the test is submitted, **Then** the assigned belt is **Orange** (first belt that failed <80%).
2. **Given** a student scores 50% on White, **When** the test is submitted, **Then** the assigned belt is **White** (failed at the first belt, no further checking).
3. **Given** a student scores 85% on White, 80% on Yellow, 92% on Orange, **When** the test is submitted, **Then** the assigned belt is the belt **after Orange** (all three passed, so the next belt in the progression is assigned — the one they haven't proven yet).

---

### User Story 2 - All Belts Pass Edge Case (Priority: P1)

If a student passes all assessed belts (all ≥80%), the system assigns the **lowest belt** as their belt. This represents the case where all tested levels pass, but the student starts from the beginning of their curriculum.

**Why this priority**: Critical edge case that determines behavior when the student aces every belt in the test.

**Independent Test**: Submit a test where every belt scores ≥80% and verify the assigned belt is the lowest one (White).

**Acceptance Scenarios**:

1. **Given** a student scores 80% on White, 80% on Yellow, 80% on Orange, **When** the test is submitted, **Then** the assigned belt is **White** (all passed, assign the lowest).
2. **Given** a student scores 100% on White, 95% on Yellow, 90% on Orange, **When** the test is submitted, **Then** the assigned belt is **White** (all passed, assign the lowest).

---

### User Story 3 - Server-Side Belt Determination (Priority: P2)

The assigned belt must be determined **server-side** by the evaluator, not by the frontend. The frontend currently sends a `belt` object based on score ranges. The new logic should override or replace this with the server-side sequential evaluation result for general tests.

**Why this priority**: Ensures the belt assignment is authoritative and cannot be manipulated client-side.

**Independent Test**: Verify that the `resultBeltName` stored in the database comes from the evaluator's sequential logic, not from the frontend-submitted belt.

**Acceptance Scenarios**:

1. **Given** the frontend sends belt "Yellow" but the evaluator determines "Orange" based on sequential logic, **When** the test is saved, **Then** `resultBeltName` is **Orange**.

---

### Edge Cases

- What happens when a student **skips** all questions (0% on everything)? → Assigned belt is **White** (fails at the first belt).
- What happens when a belt has **no questions** in the test? → That belt is treated as not assessed and skipped in the chain. The next belt with questions is evaluated.
- What happens when there is **only one belt** in the test? → If it passes ≥80%, assign that belt; if it fails, assign that belt.
- What happens when scores are based on **weighted scoring** (difficulty-based)? → The 80% threshold applies to the weighted percentage score, preserving the existing difficulty weight logic.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST evaluate general test belt scores in **sequential order** (White → Yellow → Orange → Green → ...), sorted by belt `order` field.
- **FR-002**: System MUST use an **80% weighted score threshold** to determine if a belt is "passed".
- **FR-003**: When a belt scores **<80%**, the system MUST assign that belt as the student's current belt and stop further evaluation.
- **FR-004**: When **all assessed belts** score ≥80%, the system MUST assign the **lowest belt** (first in order) as the student's belt.
- **FR-005**: The assigned belt MUST be determined **server-side** by the evaluator for general tests, overriding any frontend-submitted belt value.
- **FR-006**: Belts with **no questions** in the test data MUST be skipped in the sequential evaluation chain.
- **FR-007**: The system MUST preserve existing per-belt detailed analysis (strong/weak concepts, difficulty breakdown, confidence) alongside the new assignment logic.

### Key Entities

- **Belt**: A curriculum level with a name, code, and `order` field defining its position in the progression chain (White=1, Yellow=2, Orange=3, etc.).
- **Belt Assessment**: Per-belt scoring result including weighted score percentage, concept analysis, and difficulty breakdown.
- **Assigned Belt**: The single belt determined by the sequential evaluation as the student's current level — the first belt they did not pass.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of general test submissions correctly assign the belt using sequential chain logic (first belt <80% threshold).
- **SC-002**: The belt assignment for general tests is determined entirely server-side with no dependency on frontend belt calculation.
- **SC-003**: Existing per-belt analysis data (concepts, difficulty breakdown, study plan) remains intact and accessible after the change.
- **SC-004**: All edge cases (all pass, all fail, single belt, empty belt) produce correct and predictable belt assignments.

/**
 * Unit tests for sequential belt assignment logic.
 * Run with: npx tsx lib/placement-test/__tests__/evaluator.test.ts
 */

import { evaluatePlacementTest } from '../evaluator';
import { Question } from '../types';

// Helper: create a question for a specific belt with a known correct answer
function makeQuestion(belt: string, difficulty: number = 1): Question {
    return {
        question_type: 'mcq',
        track: 'general',
        difficulty_level: difficulty,
        concepts: ['test-concept'],
        question: `Test question for ${belt}`,
        choices: ['A', 'B', 'C', 'D'],
        ans_idx: 0, // Correct answer is always index 0
        justification: 'test',
        belt,
    };
}

// Helper: generate N questions for a belt, with a target pass rate
function generateBeltQuestions(belt: string, count: number, correctCount: number): { questions: Question[]; answers: (number | null)[] } {
    const questions: Question[] = [];
    const answers: (number | null)[] = [];
    for (let i = 0; i < count; i++) {
        questions.push(makeQuestion(belt));
        answers.push(i < correctCount ? 0 : 1); // 0 = correct, 1 = wrong
    }
    return { questions, answers };
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
    if (condition) {
        console.log(`  ✅ ${testName}`);
        passed++;
    } else {
        console.log(`  ❌ ${testName}`);
        failed++;
    }
}

// ===================== TESTS =====================

console.log('\n🧪 Sequential Belt Assignment Tests\n');

// Test 1: Classic sequential fail — White passes, Yellow passes, Orange fails
{
    console.log('Test 1: White=90%, Yellow=100%, Orange=60% → assigned=Orange');
    const w = generateBeltQuestions('White', 10, 9);   // 90%
    const y = generateBeltQuestions('Yellow', 10, 10);  // 100%
    const o = generateBeltQuestions('Orange', 10, 6);   // 60%
    const questions = [...w.questions, ...y.questions, ...o.questions];
    const answers = [...w.answers, ...y.answers, ...o.answers];
    const result = evaluatePlacementTest(questions, answers);
    assert(result.assigned_belt === 'Orange', `assigned_belt = "${result.assigned_belt}" (expected "Orange")`);
    assert(result.belt_details['White'].passed === true, 'White passed=true');
    assert(result.belt_details['Yellow'].passed === true, 'Yellow passed=true');
    assert(result.belt_details['Orange'].passed === false, 'Orange passed=false');
}

// Test 2: Fail at first belt
{
    console.log('\nTest 2: White=50% → assigned=White');
    const w = generateBeltQuestions('White', 10, 5);   // 50%
    const y = generateBeltQuestions('Yellow', 10, 10);  // 100% (shouldn't matter)
    const questions = [...w.questions, ...y.questions];
    const answers = [...w.answers, ...y.answers];
    const result = evaluatePlacementTest(questions, answers);
    assert(result.assigned_belt === 'White', `assigned_belt = "${result.assigned_belt}" (expected "White")`);
}

// Test 3: All belts pass — assign lowest
{
    console.log('\nTest 3: All=80% → assigned=White (all pass, assign lowest)');
    const w = generateBeltQuestions('White', 10, 8);   // 80%
    const y = generateBeltQuestions('Yellow', 10, 8);   // 80%
    const o = generateBeltQuestions('Orange', 10, 8);   // 80%
    const questions = [...w.questions, ...y.questions, ...o.questions];
    const answers = [...w.answers, ...y.answers, ...o.answers];
    const result = evaluatePlacementTest(questions, answers);
    assert(result.assigned_belt === 'White', `assigned_belt = "${result.assigned_belt}" (expected "White")`);
    assert(result.belt_details['White'].passed === true, 'White passed=true');
    assert(result.belt_details['Yellow'].passed === true, 'Yellow passed=true');
    assert(result.belt_details['Orange'].passed === true, 'Orange passed=true');
}

// Test 4: All belts fail — assign White (first failure)
{
    console.log('\nTest 4: White=20%, Yellow=10%, Orange=5% → assigned=White');
    const w = generateBeltQuestions('White', 10, 2);   // 20%
    const y = generateBeltQuestions('Yellow', 10, 1);   // 10%
    const o = generateBeltQuestions('Orange', 10, 0);   // 0%  (actually 1/20... let's use 0)
    const questions = [...w.questions, ...y.questions, ...o.questions];
    const answers = [...w.answers, ...y.answers, ...o.answers];
    const result = evaluatePlacementTest(questions, answers);
    assert(result.assigned_belt === 'White', `assigned_belt = "${result.assigned_belt}" (expected "White")`);
}

// Test 5: Single belt pass
{
    console.log('\nTest 5: Only White at 90% → assigned=White');
    const w = generateBeltQuestions('White', 10, 9);   // 90%
    const result = evaluatePlacementTest(w.questions, w.answers);
    assert(result.assigned_belt === 'White', `assigned_belt = "${result.assigned_belt}" (expected "White")`);
}

// Test 6: Single belt fail
{
    console.log('\nTest 6: Only White at 50% → assigned=White');
    const w = generateBeltQuestions('White', 10, 5);   // 50%
    const result = evaluatePlacementTest(w.questions, w.answers);
    assert(result.assigned_belt === 'White', `assigned_belt = "${result.assigned_belt}" (expected "White")`);
}

// Test 7: Skip missing belt — White passes, no Yellow questions, Orange fails
{
    console.log('\nTest 7: White=90%, [no Yellow], Orange=60% → assigned=Orange');
    const w = generateBeltQuestions('White', 10, 9);   // 90%
    const o = generateBeltQuestions('Orange', 10, 6);   // 60%
    const questions = [...w.questions, ...o.questions];
    const answers = [...w.answers, ...o.answers];
    const result = evaluatePlacementTest(questions, answers);
    assert(result.assigned_belt === 'Orange', `assigned_belt = "${result.assigned_belt}" (expected "Orange")`);
}

// Test 8: All perfect scores — still assigns lowest
{
    console.log('\nTest 8: All=100% → assigned=White (all pass, assign lowest)');
    const w = generateBeltQuestions('White', 10, 10);  // 100%
    const y = generateBeltQuestions('Yellow', 10, 10);  // 100%
    const o = generateBeltQuestions('Orange', 10, 10);  // 100%
    const questions = [...w.questions, ...y.questions, ...o.questions];
    const answers = [...w.answers, ...y.answers, ...o.answers];
    const result = evaluatePlacementTest(questions, answers);
    assert(result.assigned_belt === 'White', `assigned_belt = "${result.assigned_belt}" (expected "White")`);
}

// Test 9: Boundary — exactly 79% should fail
{
    console.log('\nTest 9: White=79% (boundary fail) → assigned=White');
    // 79 correct out of 100 = 79%
    const w = generateBeltQuestions('White', 100, 79);
    const result = evaluatePlacementTest(w.questions, w.answers);
    assert(result.assigned_belt === 'White', `assigned_belt = "${result.assigned_belt}" (expected "White")`);
    assert(result.belt_details['White'].passed === false, 'White passed=false at 79%');
}

// Test 10: Boundary — exactly 80% should pass
{
    console.log('\nTest 10: White=80% (boundary pass) → White passes');
    const w = generateBeltQuestions('White', 10, 8);
    const result = evaluatePlacementTest(w.questions, w.answers);
    assert(result.belt_details['White'].passed === true, 'White passed=true at 80%');
}

// ===================== SUMMARY =====================
console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions`);
if (failed === 0) {
    console.log('🎉 All tests passed!\n');
} else {
    console.log('💥 Some tests failed!\n');
    throw new Error(`${failed} test(s) failed`);
}

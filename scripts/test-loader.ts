
import { loadGeneralQuestions } from '../lib/question-loader';

async function testLoading() {
    console.log("--- Testing Age 8 (6-9) ---");
    const q8 = await loadGeneralQuestions('en', 8);
    console.log(`Loaded ${q8.length} questions for age 8`);
    console.log('Belts found:', countBelts(q8));

    console.log("\n--- Testing Age 12 (10-14) ---");
    const q12 = await loadGeneralQuestions('en', 12);
    console.log(`Loaded ${q12.length} questions for age 12`);
    console.log('Belts found:', countBelts(q12));

    console.log("\n--- Testing Age 17 (15-18) ---");
    const q17 = await loadGeneralQuestions('en', 17);
    console.log(`Loaded ${q17.length} questions for age 17`);
    console.log('Belts found:', countBelts(q17));
}

function countBelts(questions: any[]) {
    const counts: Record<string, number> = {};
    questions.forEach(q => {
        const b = q.belt || 'Unknown';
        counts[b] = (counts[b] || 0) + 1;
    });
    return counts;
}

testLoading().catch(console.error);

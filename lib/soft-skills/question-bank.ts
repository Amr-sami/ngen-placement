import fs from 'fs';
import path from 'path';

export interface SoftSkillsQuestion {
    id: number;
    question_en: string;
    question_ar: string;
    options_en: string[];
    options_ar: string[];
    concepts: string[];
    age_group: string;
    options_scoring: any[];
}

export function loadQuestionBank(): { [ageGroup: string]: SoftSkillsQuestion[] } {
    const bank: { [ageGroup: string]: SoftSkillsQuestion[] } = {
        "6-9": [],
        "10-14": [],
        "15-18": []
    };

    try {
        const filePath = path.join(process.cwd(), 'questions_v2', 'soft_social_skills', 'questions_en_ar.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const questionsData = JSON.parse(fileContent);

        // We synthesize IDs based on order per age group to match Python logic
        const counters: any = { "6-9": 0, "10-14": 0, "15-18": 0 };

        (questionsData as any[]).forEach((item: any) => {
            const ageGroup = item.age_group;
            if (bank[ageGroup]) {
                counters[ageGroup]++;
                bank[ageGroup].push({
                    id: counters[ageGroup], // 1-based index per group
                    question_en: item.question_en,
                    question_ar: item.question_ar,
                    options_en: item.options_en,
                    options_ar: item.options_ar,
                    concepts: item.concepts_en || item.concepts,
                    age_group: ageGroup,
                    options_scoring: item.options_scoring
                });
            }
        });
    } catch (error) {
        console.error("Failed to load question bank:", error);
    }

    return bank;
}

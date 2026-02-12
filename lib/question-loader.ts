import fs from 'fs/promises';
import path from 'path';
import { BankQuestion } from './questionGenerator';
import { Question } from './placement-test/types';

// Map age input to file names
function getAgeFileName(age: number): string {
    if (age >= 15) return '15-18.json';
    if (age >= 10) return '10-14.json';
    return '6-9.json';
}

// Belts to include in General Test
const GENERAL_BELTS = ['White Belt', 'Yellow Belt', 'Orange Belt'];

export async function loadGeneralQuestions(language: 'en' | 'ar', age: number): Promise<BankQuestion[]> {
    const baseDir = path.join(process.cwd(), '.next', 'questions_v2');
    const ageFile = getAgeFileName(age);

    let allQuestions: BankQuestion[] = [];

    for (const belt of GENERAL_BELTS) {
        // Construct path: .next/questions_v2/{BeltName}/{lang}/{ageFile}
        // Note: Analysis showed language folders are inside belt folders, e.g. "Orange Belt/en/6-9.json"
        // However, some file listings showed "Ages 6-9.json" in White Belt vs "6-9.json" in Orange. 
        // I need to be careful with file names. 
        // Let's try to detect or fallback.

        const beltDir = path.join(baseDir, belt, language);

        // Try standard name first
        let filePath = path.join(beltDir, ageFile);

        // Check if file exists, if not try with "Ages " prefix as seen in directory listing for White Belt
        try {
            await fs.access(filePath);
        } catch {
            // Try alternate name
            const alternateName = `Ages ${ageFile}`;
            const alternatePath = path.join(beltDir, alternateName);
            try {
                await fs.access(alternatePath);
                filePath = alternatePath;
            } catch {
                console.warn(`⚠️ Could not find question file for ${belt} ${language} ${ageFile} or ${alternateName}`);
                continue;
            }
        }

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const beltQuestions = JSON.parse(content);

            // Inject belt name into questions if not present (though JSON seemed to have it)
            const enhancedQuestions = beltQuestions.map((q: any) => ({
                ...q,
                belt: q.belt || belt.replace(' Belt', '') // Ensure "White", "Yellow" etc.
            }));

            allQuestions = allQuestions.concat(enhancedQuestions);
            console.log(`✅ Loaded ${enhancedQuestions.length} questions from ${belt}`);
        } catch (error) {
            console.error(`❌ Error reading ${filePath}:`, error);
        }
    }

    return allQuestions;
}

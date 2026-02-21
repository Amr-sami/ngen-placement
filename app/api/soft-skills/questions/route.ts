
import { NextResponse } from 'next/server';
import { loadQuestionBank } from '@/lib/soft-skills/question-bank';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const ageGroup = searchParams.get('ageGroup');

        if (!ageGroup || !['6-9', '10-14', '15-18'].includes(ageGroup)) {
            return NextResponse.json(
                { error: 'Invalid or missing ageGroup parameter' },
                { status: 400 }
            );
        }

        const bank = loadQuestionBank();
        let questions = bank[ageGroup] || [];

        // Shuffle questions
        questions = questions.sort(() => 0.5 - Math.random());

        // Select random 25
        questions = questions.slice(0, 25);

        // Return questions without scoring info for frontend
        const safeQuestions = questions.map(q => ({
            id: q.id,
            question_en: q.question_en,
            question_ar: q.question_ar,
            options_en: q.options_en,
            options_ar: q.options_ar,
            concepts: q.concepts
        }));

        return NextResponse.json({
            success: true,
            data: safeQuestions
        });

    } catch (error) {
        console.error('Error fetching soft skills questions:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

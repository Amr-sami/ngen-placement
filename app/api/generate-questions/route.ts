import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { generateBalancedExam, type BankQuestion } from "@/lib/questionGenerator"
import { loadGeneralQuestions } from "@/lib/question-loader"

export const runtime = "nodejs"

// Map track keys to file names
const TRACK_FILE_MAP: Record<string, string> = {
  data_science: "AI_Data_Science.json",
  computer_fundamentals: "Computer_Fundamentals.json",
  cybersecurity: "Cybersecurity.json",
  data_analysis: "Data_Analysis.json",
  python_programming: "Python_Programming.json",
  robotics: "Robotics.json",
}

// Map track keys to track names used in the question bank
const TRACK_NAME_MAP: Record<string, string> = {
  data_science: "AI & Data Science",
  computer_fundamentals: "Computer Fundamentals",
  cybersecurity: "Cybersecurity",
  data_analysis: "Data Analysis",
  python_programming: "Python Programming",
  robotics: "Robotics",
}

async function readSpecificTrackFile(track: string, language: 'en' | 'ar' = 'en') {
  const fileName = TRACK_FILE_MAP[track]
  if (!fileName) {
    throw new Error(`Unknown track: ${track}`)
  }

  const folderName = language === 'ar' ? 'SpicificTest-AR' : 'SpicificTest-EN'
  const filePath = path.join(process.cwd(), folderName, fileName)

  try {
    const content = await fs.readFile(filePath, "utf-8")
    console.log(`✅ Loaded ${fileName} from ${folderName}`)
    return content
  } catch {
    console.error(`❌ Failed to load ${fileName} from ${folderName}`)
    throw new Error(`Could not find ${fileName} in ${folderName} folder`)
  }
}

function getAgeFromSurvey(surveyResults: string): number {
  try {
    const data = JSON.parse(surveyResults);
    // data.age is usually a string "6-9" or "10-14" or "15-18", or a number
    // We'll try to parse a number or range
    const ageRaw = data.age;
    if (!ageRaw) return 10; // Default

    if (typeof ageRaw === 'number') return ageRaw;

    // If range "6-9", take lower bound
    const match = ageRaw.match(/^(\d+)/);
    if (match) return parseInt(match[1]);

    return 10;
  } catch {
    return 10;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const language = (body.language || 'en') as 'en' | 'ar'
    const selectedTrack = (body.selectedTrack || 'general') as string
    const surveyResults = body.survey_results || '{}';

    console.log(`📝 Generating test in language: ${language}, track: ${selectedTrack}`)

    let allQuestions: BankQuestion[]
    let tracks: string[]

    if (selectedTrack === 'general') {
      // General track: Load from questions_v2 based on age
      const age = getAgeFromSurvey(surveyResults);
      console.log(`👶 Detected age for general test: ${age}`);

      allQuestions = await loadGeneralQuestions(language, age);

      if (allQuestions.length === 0) {
        throw new Error('No questions found for the selected age group.');
      }

      // We want questions from all 3 belts.
      // The generateBalancedExam expects "tracks" to distribute questions.
      // Our questions now have "belt" property, but "track" property might still be "AI", "Data Science" etc.
      // We should probably balance by BELT or keep balanced by original tracks? 
      // The requirement is "Assessment across multiple independent belts". 
      // Let's assume we want balance across the Belts (White, Yellow, Orange).
      // However, generateBalancedExam keys off `track` property. 
      // Mapping belt to track for generation purpose or updating generator?
      // Let's TRY to map belt -> track for generation to ensure we get X questions from each belt.

      // HACK: Temporarily override track with belt name to force distribution by belt
      allQuestions = allQuestions.map(q => ({
        ...q,
        track: (q as any).belt || q.track // Use belt as track for balancing
      }));

      tracks = ["White", "Yellow", "Orange"];

    } else {
      // Specific track: load from SpicificTest-EN / SpicificTest-AR
      const raw = await readSpecificTrackFile(selectedTrack, language)
      allQuestions = JSON.parse(raw)

      // Use only the selected track
      const trackName = TRACK_NAME_MAP[selectedTrack]
      if (!trackName) {
        throw new Error(`Unknown track name for: ${selectedTrack}`)
      }
      tracks = [trackName]
    }

    const DIFFICULTIES = [1, 2, 3]

    // Determine N based on general or specific?
    // User requested 25 questions for General (and Specific)
    const n = 25;

    const exam = generateBalancedExam(allQuestions, {
      n,
      tracks: tracks, // For General: ["White", "Yellow", "Orange"]; For Specific: [TrackName]
      difficulties: DIFFICULTIES,
      seed: Date.now(),
    })

    console.log(`✅ Generated ${exam.length} questions in ${language} for track: ${selectedTrack}`)

    return NextResponse.json({
      questions: exam,
      partial: false,
      failed_tracks: [],
      message: `Questions generated for track: ${selectedTrack}.`,
      language,
      selectedTrack,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate questions"
    console.error('❌ Error:', message)
    return NextResponse.json(
      { detail: message },
      { status: 500 }
    )
  }
}
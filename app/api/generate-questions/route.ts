// app/api/generate-questions/route.ts

import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { generateBalancedExam, type BankQuestion } from "@/lib/questionGenerator"

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

async function readGeneralQuestionsFile(language: 'en' | 'ar' = 'en') {
  const fileName = language === 'ar' ? 'test_ar.json' : 'test.json'

  // Try root first
  const rootPath = path.join(process.cwd(), fileName)
  // Fallback to data folder
  const dataPath = path.join(process.cwd(), "data", fileName)

  try {
    const content = await fs.readFile(rootPath, "utf-8")
    console.log(`✅ Loaded ${fileName} from root`)
    return content
  } catch {
    try {
      const content = await fs.readFile(dataPath, "utf-8")
      console.log(`✅ Loaded ${fileName} from data folder`)
      return content
    } catch {
      console.error(`❌ Failed to load ${fileName}`)
      throw new Error(`Could not find ${fileName} in root or data folder`)
    }
  }
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

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const language = (body.language || 'en') as 'en' | 'ar'
    const selectedTrack = (body.selectedTrack || 'general') as string

    console.log(`📝 Generating test in language: ${language}, track: ${selectedTrack}`)

    let allQuestions: BankQuestion[]
    let tracks: string[]

    if (selectedTrack === 'general') {
      // General track: load from test.json / test_ar.json (multi-track)
      const raw = await readGeneralQuestionsFile(language)
      allQuestions = JSON.parse(raw)

      tracks = [
        "Python Programming",
        "Computer Fundamentals",
        "AI & Data Science",
        "Data Analysis",
        "Cybersecurity",
        "Robotics",
      ]
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

    const exam = generateBalancedExam(allQuestions, {
      n: 25,
      tracks: tracks,
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
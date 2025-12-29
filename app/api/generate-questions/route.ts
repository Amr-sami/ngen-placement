// app/api/generate-questions/route.ts

import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { generateBalancedExam, type BankQuestion } from "@/lib/questionGenerator"

export const runtime = "nodejs"

async function readQuestionsFile(language: 'en' | 'ar' = 'en') {
  const fileName = `test_${language}.json`

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

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const language = (body.language || 'en') as 'en' | 'ar'

    console.log(`📝 Generating test in language: ${language}`)

    const raw = await readQuestionsFile(language)
    const allQuestions: BankQuestion[] = JSON.parse(raw)

    const TRACKS = [
      "Python Programming",
      "Computer Fundamentals",
      "AI & Data Science",
      "Data Analysis",
      "Cybersecurity",
      "Robotics",
    ]
    const DIFFICULTIES = [1, 2, 3]

    const exam = generateBalancedExam(allQuestions, {
      n: 25,
      tracks: TRACKS,
      difficulties: DIFFICULTIES,
      seed: Date.now(),
    })

    console.log(`✅ Generated ${exam.length} questions in ${language}`)

    return NextResponse.json({
      questions: exam,
      partial: false,
      failed_tracks: [],
      message: `Questions generated from local bank (test_${language}.json).`,
      language,
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
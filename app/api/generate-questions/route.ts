
import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { generateBalancedExam, type BankQuestion } from "@/lib/questionGenerator"


// ✅ IMPORTANT: make sure this route runs in Node.js runtime (fs works)
export const runtime = "nodejs"

async function readQuestionsFile() {
  // Your actual file location (project root): /ngen/test.json
  const rootPath = path.join(process.cwd(), "test.json")

  // Old location (if you later move it): /ngen/data/test.json
  const dataPath = path.join(process.cwd(), "data", "test.json")

  // Try root first, then data folder
  try {
    return await fs.readFile(rootPath, "utf-8")
  } catch (e) {
    return await fs.readFile(dataPath, "utf-8")
  }
}

export async function POST(req: Request) {
  try {
    // keep reading the body to match your existing client logic
    await req.json().catch(() => ({}))

    const raw = await readQuestionsFile()
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

    return NextResponse.json({
      questions: exam,
      partial: false,
      failed_tracks: [],
      message: "Questions generated from local bank (test.json).",
    })
  } catch (err: any) {
    return NextResponse.json(
      { detail: err?.message || "Failed to generate questions from test.json" },
      { status: 500 }
    )
  }
}
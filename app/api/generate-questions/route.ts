import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import PlacementTest from "@/lib/models/PlacementTest"
import { generateBalancedExam, type BankQuestion } from "@/lib/questionGenerator"
import { loadGeneralQuestions } from "@/lib/question-loader"
import {
  generateLeadToken,
  hashLeadToken,
  serializeLeadCookie,
} from "@/lib/placement-test/leadToken"

export const runtime = "nodejs"

const TRACK_FILE_MAP: Record<string, string> = {
  data_science: "AI_Data_Science.json",
  computer_fundamentals: "Computer_Fundamentals.json",
  cybersecurity: "Cybersecurity.json",
  data_analysis: "Data_Analysis.json",
  python_programming: "Python_Programming.json",
  robotics: "Robotics.json",
}

const TRACK_NAME_MAP: Record<string, string> = {
  data_science: "AI & Data Science",
  computer_fundamentals: "Computer Fundamentals",
  cybersecurity: "Cybersecurity",
  data_analysis: "Data Analysis",
  python_programming: "Python Programming",
  robotics: "Robotics",
  general: "General Placement",
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
    const ageRaw = data.age;
    if (!ageRaw) return 10;
    if (typeof ageRaw === 'number') return ageRaw;
    const match = ageRaw.match(/^(\d+)/);
    if (match) return parseInt(match[1]);
    return 10;
  } catch {
    return 10;
  }
}

/**
 * Strip the answer key before returning questions to the client. The full
 * exam (including ans_idx) is stored on the PlacementTest row and re-read by
 * the submit route — the client never sees it.
 */
function sanitizeQuestionForClient(q: any) {
  const { ans_idx, ...rest } = q ?? {};
  void ans_idx;
  return rest;
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
      const age = getAgeFromSurvey(surveyResults);
      console.log(`👶 Detected age for general test: ${age}`);

      allQuestions = await loadGeneralQuestions(language, age);

      if (allQuestions.length === 0) {
        throw new Error('No questions found for the selected age group.');
      }

      allQuestions = allQuestions.map(q => ({
        ...q,
        track: (q as any).belt || q.track
      }));

      tracks = ["White", "Yellow", "Orange"];
    } else {
      const raw = await readSpecificTrackFile(selectedTrack, language)
      allQuestions = JSON.parse(raw)

      const trackName = TRACK_NAME_MAP[selectedTrack]
      if (!trackName) {
        throw new Error(`Unknown track name for: ${selectedTrack}`)
      }
      tracks = [trackName]
    }

    const DIFFICULTIES = [1, 2, 3]
    const n = 25;

    const exam = generateBalancedExam(allQuestions, {
      n,
      tracks,
      difficulties: DIFFICULTIES,
      seed: Date.now(),
    })

    console.log(`✅ Generated ${exam.length} questions in ${language} for track: ${selectedTrack}`)

    // Persist the exam server-side so submit can recompute the score against
    // a trusted answer key rather than trusting whatever ans_idx the browser
    // echoes back. Guests get a lead-token cookie that the submit route
    // verifies as a proof-of-ownership. Authenticated users are linked by
    // session; they still get the cookie as a fallback if the session lapses.
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (e) {
      console.warn('getServerSession failed:', e);
    }

    await dbConnect();

    let user: any = null;
    if (session?.user?.email) {
      user = await User.findOne({ email: session.user.email });
    }

    const leadToken = generateLeadToken();
    const leadTokenHash = hashLeadToken(leadToken);

    const trackName = selectedTrack === 'general'
      ? 'General Placement'
      : (TRACK_NAME_MAP[selectedTrack] || selectedTrack);

    const placementTest = await PlacementTest.create({
      userId: user?._id || null,
      trackName,
      attemptNumber: user ? ((user.placementTest?.technicalAttemptsUsed || 0) + 1) : 1,
      testType: 'technical',
      status: 'in_progress',
      generatedQuestions: exam,
      leadTokenHash,
      startedAt: new Date(),
    });

    const sanitizedExam = exam.map(sanitizeQuestionForClient);

    const response = NextResponse.json({
      questions: sanitizedExam,
      partial: false,
      failed_tracks: [],
      message: `Questions generated for track: ${selectedTrack}.`,
      language,
      selectedTrack,
      testId: placementTest._id.toString(),
    });

    response.headers.set('Set-Cookie', serializeLeadCookie(leadToken));
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate questions"
    console.error('❌ Error:', message)
    return NextResponse.json(
      { detail: message },
      { status: 500 }
    )
  }
}


export type ApiQuestion = {
  question_type: string
  track: string
  belt: string
  difficulty_level: number
  concepts: string[]
  question: string
  choices: string[]
  ans_idx: number
  justification: string
}
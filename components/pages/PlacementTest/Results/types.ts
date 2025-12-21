
export type BeltLevel = {
  stage: string
  belt: string
  color: string        // Hex color for background
  glowColor: string    // Hex color for glow effect
  textColor: string    // Hex color for text
  borderColor: string  // Hex color for border
  duration: string
  totalHours: string
  totalClasses: string
  focus: string
  scoreRange: [number, number]
}

export type StoredQuestion = {
  question: string
  options: string[]
  ans_idx?: number
  correctAnswer?: number
  justification?: string
}

export type StudentInfo = {
  name: string
  age: string
  phone: string
  email: string
}

export const beltLevels: BeltLevel[] = [
  {
    stage: 'Pre-Foundation',
    belt: 'White',
    color: '#f1f5f9',       // slate-100
    glowColor: '#cbd5e1',   // slate-300
    textColor: '#1e293b',   // slate-800
    borderColor: '#cbd5e1', // slate-300
    duration: '1 Month',
    totalHours: '12 hrs',
    totalClasses: '8 Classes',
    focus: 'Digital Awareness & Curiosity',
    scoreRange: [0, 0]
  },
  {
    stage: 'Foundation',
    belt: 'Yellow',
    color: '#facc15',       // yellow-400
    glowColor: '#fde047',   // yellow-300
    textColor: '#422006',   // yellow-950
    borderColor: '#fef08a', // yellow-200
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Core Coding & Logical Thinking',
    scoreRange: [1, 17]
  },
  {
    stage: 'Foundation',
    belt: 'Orange',
    color: '#f97316',       // orange-500
    glowColor: '#fb923c',   // orange-400
    textColor: '#ffffff',   // white
    borderColor: '#fdba74', // orange-300
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Creativity & Digital Design',
    scoreRange: [18, 25]
  }
]
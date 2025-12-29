
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
  },
  {
    stage: 'Foundation',
    belt: 'Green',
    color: '#22c55e',       // green-500 (standard foundation green)
    glowColor: '#4ade80',   // green-400
    textColor: '#ffffff',   // white
    borderColor: '#86efac', // green-300
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Logic & Problem Solving',
    scoreRange: [26, 40]
  },
  {
    stage: 'Specialization',
    belt: 'Blue',
    color: '#3b82f6',       // blue-500
    glowColor: '#60a5fa',   // blue-400
    textColor: '#ffffff',   // white
    borderColor: '#93c5fd', // blue-300
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Advanced Algorithmic Thinking',
    scoreRange: [41, 55]
  },
  {
    stage: 'Specialization',
    belt: 'Red',
    color: '#ef4444',       // red-500
    glowColor: '#f87171',   // red-400
    textColor: '#ffffff',   // white
    borderColor: '#fca5a5', // red-300
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Complex Systems Design',
    scoreRange: [56, 70]
  },
  {
    stage: 'Specialization',
    belt: 'Brown',
    color: '#b45309',       // amber-700
    glowColor: '#d97706',   // amber-600
    textColor: '#ffffff',   // white
    borderColor: '#fcd34d', // amber-300
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Professional Software Architecture',
    scoreRange: [71, 85]
  },
  {
    stage: 'Specialization',
    belt: 'Black',
    color: '#0f172a',       // slate-900
    glowColor: '#334155',   // slate-700
    textColor: '#ffffff',   // white
    borderColor: '#94a3b8', // slate-400
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Mastery & Leadership',
    scoreRange: [86, 94]
  },
  {
    stage: 'Advanced',
    belt: 'Ninja',
    color: '#7c3aed',       // violet-600
    glowColor: '#8b5cf6',   // violet-500
    textColor: '#ffffff',   // white
    borderColor: '#c4b5fd', // violet-300
    duration: '4-6 Months',
    totalHours: '50 hrs',
    totalClasses: '36 Classes',
    focus: 'Elite Performance & Innovation',
    scoreRange: [95, 97]
  },
  {
    stage: 'Advanced',
    belt: 'Master',
    color: '#e11d48',       // rose-600
    glowColor: '#f43f5e',   // rose-500
    textColor: '#ffffff',   // white
    borderColor: '#fda4af', // rose-300
    duration: '6-12 Months',
    totalHours: '100 hrs',
    totalClasses: '72 Classes',
    focus: 'Legendary Status',
    scoreRange: [98, 100]
  }
]

export type BeltLevel = {
  stage: string
  belt: string
  color: string
  textColor: string
  borderColor: string
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
    color: 'bg-slate-100',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
    duration: '1 Month',
    totalHours: '12 hrs',
    totalClasses: '8 Classes',
    focus: 'Digital Awareness & Curiosity',
    scoreRange: [0, 0]
  },
  {
    stage: 'Foundation',
    belt: 'Yellow',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-950',
    borderColor: 'border-yellow-200',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Core Coding & Logical Thinking',
    scoreRange: [1, 17]
  },
  {
    stage: 'Foundation',
    belt: 'Orange',
    color: 'bg-orange-500',
    textColor: 'text-white',
    borderColor: 'border-orange-300',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    focus: 'Creativity & Digital Design',
    scoreRange: [18, 25]
  }
]

export type BeltLevel = {
  stage: { en: string; ar: string }
  belt: string  // Keep as code/key (e.g., "Yellow")
  beltName: { en: string; ar: string }  // Localized display name
  color: string        // Hex color for background
  glowColor: string    // Hex color for glow effect
  textColor: string    // Hex color for text
  borderColor: string  // Hex color for border
  duration: { en: string; ar: string }
  totalHours: { en: string; ar: string }
  totalClasses: { en: string; ar: string }
  focus: { en: string; ar: string }
  scoreRange: [number, number]
}

export type StoredQuestion = {
  question: string
  options: string[]
  ans_idx?: number
  correctAnswer?: number
  justification?: string
  // Fields for detailed evaluation
  belt?: string
  difficulty_level?: number
  concepts?: string[]
}

export type StudentInfo = {
  name: string
  age: string
  phone: string
  email: string
}

export const beltLevels: BeltLevel[] = [
  {
    stage: { en: 'Pre-Foundation', ar: 'ما قبل التأسيس' },
    belt: 'White',
    beltName: { en: 'White Belt', ar: 'الحزام الأبيض' },
    color: '#f1f5f9',       // slate-100
    glowColor: '#cbd5e1',   // slate-300
    textColor: '#1e293b',   // slate-800
    borderColor: '#cbd5e1', // slate-300
    duration: { en: '1 Month', ar: 'شهر واحد' },
    totalHours: { en: '12 hrs', ar: '١٢ ساعة' },
    totalClasses: { en: '8 Classes', ar: '٨ حصص' },
    focus: { en: 'Digital Awareness & Curiosity', ar: 'الوعي الرقمي والفضول' },
    scoreRange: [0, 0]
  },
  {
    stage: { en: 'Foundation', ar: 'التأسيس' },
    belt: 'Yellow',
    beltName: { en: 'Yellow Belt', ar: 'الحزام الأصفر' },
    color: '#facc15',       // yellow-400
    glowColor: '#fde047',   // yellow-300
    textColor: '#422006',   // yellow-950
    borderColor: '#fef08a', // yellow-200
    duration: { en: '3-4 Months', ar: '٣-٤ أشهر' },
    totalHours: { en: '35 hrs', ar: '٣٥ ساعة' },
    totalClasses: { en: '24 Classes', ar: '٢٤ حصة' },
    focus: { en: 'Core Coding & Logical Thinking', ar: 'أساسيات البرمجة والتفكير المنطقي' },
    scoreRange: [1, 17]
  },
  {
    stage: { en: 'Foundation', ar: 'التأسيس' },
    belt: 'Orange',
    beltName: { en: 'Orange Belt', ar: 'الحزام البرتقالي' },
    color: '#f97316',       // orange-500
    glowColor: '#fb923c',   // orange-400
    textColor: '#ffffff',   // white
    borderColor: '#fdba74', // orange-300
    duration: { en: '3-4 Months', ar: '٣-٤ أشهر' },
    totalHours: { en: '35 hrs', ar: '٣٥ ساعة' },
    totalClasses: { en: '24 Classes', ar: '٢٤ حصة' },
    focus: { en: 'Creativity & Digital Design', ar: 'الإبداع والتصميم الرقمي' },
    scoreRange: [18, 25]
  },
  {
    stage: { en: 'Foundation', ar: 'التأسيس' },
    belt: 'Green',
    beltName: { en: 'Green Belt', ar: 'الحزام الأخضر' },
    color: '#22c55e',       // green-500 (standard foundation green)
    glowColor: '#4ade80',   // green-400
    textColor: '#ffffff',   // white
    borderColor: '#86efac', // green-300
    duration: { en: '3-4 Months', ar: '٣-٤ أشهر' },
    totalHours: { en: '35 hrs', ar: '٣٥ ساعة' },
    totalClasses: { en: '24 Classes', ar: '٢٤ حصة' },
    focus: { en: 'Logic & Problem Solving', ar: 'المنطق وحل المشكلات' },
    scoreRange: [26, 40]
  },
  {
    stage: { en: 'Specialization', ar: 'التخصص' },
    belt: 'Blue',
    beltName: { en: 'Blue Belt', ar: 'الحزام الأزرق' },
    color: '#3b82f6',       // blue-500
    glowColor: '#60a5fa',   // blue-400
    textColor: '#ffffff',   // white
    borderColor: '#93c5fd', // blue-300
    duration: { en: '3-4 Months', ar: '٣-٤ أشهر' },
    totalHours: { en: '35 hrs', ar: '٣٥ ساعة' },
    totalClasses: { en: '24 Classes', ar: '٢٤ حصة' },
    focus: { en: 'Advanced Algorithmic Thinking', ar: 'التفكير الخوارزمي المتقدم' },
    scoreRange: [41, 55]
  },
  {
    stage: { en: 'Specialization', ar: 'التخصص' },
    belt: 'Red',
    beltName: { en: 'Red Belt', ar: 'الحزام الأحمر' },
    color: '#ef4444',       // red-500
    glowColor: '#f87171',   // red-400
    textColor: '#ffffff',   // white
    borderColor: '#fca5a5', // red-300
    duration: { en: '3-4 Months', ar: '٣-٤ أشهر' },
    totalHours: { en: '35 hrs', ar: '٣٥ ساعة' },
    totalClasses: { en: '24 Classes', ar: '٢٤ حصة' },
    focus: { en: 'Complex Systems Design', ar: 'تصميم الأنظمة المعقدة' },
    scoreRange: [56, 70]
  },
  {
    stage: { en: 'Specialization', ar: 'التخصص' },
    belt: 'Brown',
    beltName: { en: 'Brown Belt', ar: 'الحزام البني' },
    color: '#b45309',       // amber-700
    glowColor: '#d97706',   // amber-600
    textColor: '#ffffff',   // white
    borderColor: '#fcd34d', // amber-300
    duration: { en: '3-4 Months', ar: '٣-٤ أشهر' },
    totalHours: { en: '35 hrs', ar: '٣٥ ساعة' },
    totalClasses: { en: '24 Classes', ar: '٢٤ حصة' },
    focus: { en: 'Professional Software Architecture', ar: 'هندسة البرمجيات الاحترافية' },
    scoreRange: [71, 85]
  },
  {
    stage: { en: 'Specialization', ar: 'التخصص' },
    belt: 'Black',
    beltName: { en: 'Black Belt', ar: 'الحزام الأسود' },
    color: '#0f172a',       // slate-900
    glowColor: '#334155',   // slate-700
    textColor: '#ffffff',   // white
    borderColor: '#94a3b8', // slate-400
    duration: { en: '3-4 Months', ar: '٣-٤ أشهر' },
    totalHours: { en: '35 hrs', ar: '٣٥ ساعة' },
    totalClasses: { en: '24 Classes', ar: '٢٤ حصة' },
    focus: { en: 'Mastery & Leadership', ar: 'الإتقان والقيادة' },
    scoreRange: [86, 94]
  },
  {
    stage: { en: 'Advanced', ar: 'متقدم' },
    belt: 'Ninja',
    beltName: { en: 'Ninja Belt', ar: 'حزام النينجا' },
    color: '#7c3aed',       // violet-600
    glowColor: '#8b5cf6',   // violet-500
    textColor: '#ffffff',   // white
    borderColor: '#c4b5fd', // violet-300
    duration: { en: '4-6 Months', ar: '٤-٦ أشهر' },
    totalHours: { en: '50 hrs', ar: '٥٠ ساعة' },
    totalClasses: { en: '36 Classes', ar: '٣٦ حصة' },
    focus: { en: 'Elite Performance & Innovation', ar: 'الأداء النخبوي والابتكار' },
    scoreRange: [95, 97]
  },
  {
    stage: { en: 'Advanced', ar: 'متقدم' },
    belt: 'Master',
    beltName: { en: 'Master Belt', ar: 'حزام الماستر' },
    color: '#e11d48',       // rose-600
    glowColor: '#f43f5e',   // rose-500
    textColor: '#ffffff',   // white
    borderColor: '#fda4af', // rose-300
    duration: { en: '6-12 Months', ar: '٦-١٢ شهر' },
    totalHours: { en: '100 hrs', ar: '١٠٠ ساعة' },
    totalClasses: { en: '72 Classes', ar: '٧٢ حصة' },
    focus: { en: 'Legendary Status', ar: 'المرتبة الأسطورية' },
    scoreRange: [98, 100]
  }
]

// Helper function to get localized value
export function getLocalizedBeltValue<K extends keyof BeltLevel>(
  belt: BeltLevel,
  key: K,
  locale: 'en' | 'ar'
): string {
  const value = belt[key]
  if (typeof value === 'object' && value !== null && 'en' in value && 'ar' in value) {
    return (value as { en: string; ar: string })[locale]
  }
  return String(value)
}
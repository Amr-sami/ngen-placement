export type BankQuestion = {
  question_type: string
  track: string
  difficulty_level: number
  concepts: string[]
  question: string
  choices: string[]
  ans_idx: number
  justification: string
}

type PoolKey = `${string}__${number}`

function distributeCounts(total: number, labels: string[], rand: () => number) {
  const base = Math.floor(total / labels.length)
  const rem = total % labels.length

  const counts: Record<string, number> = Object.fromEntries(labels.map(l => [l, base]))

  // randomly assign the remainder
  const shuffled = [...labels].sort(() => rand() - 0.5)
  for (let i = 0; i < rem; i++) counts[shuffled[i]] += 1

  return counts
}

function uniqueKey(q: BankQuestion) {
  return `${q.track}__${q.difficulty_level}__${q.question}__${q.ans_idx}__${q.choices.join("|")}`
}

export function generateBalancedExam(
  allQuestions: BankQuestion[],
  opts: {
    n: number
    tracks: string[]
    difficulties: number[]
    seed?: number
  },
) {
  const { n, tracks, difficulties, seed } = opts

  // seeded RNG (simple)
  let s = seed ?? Math.floor(Math.random() * 1e9)
  const rand = () => {
    // xorshift32
    s ^= s << 13
    s ^= s >> 17
    s ^= s << 5
    return ((s >>> 0) / 4294967296)
  }

  // Build pool per (track, difficulty) with de-dupe
  const pool: Record<PoolKey, BankQuestion[]> = {}
  for (const t of tracks) {
    for (const d of difficulties) {
      const key = `${t}__${d}` as PoolKey
      const bucket = allQuestions.filter(q => q.track === t && q.difficulty_level === d)

      const seen = new Set<string>()
      const uniq: BankQuestion[] = []
      for (const q of bucket) {
        const k = uniqueKey(q)
        if (!seen.has(k)) {
          seen.add(k)
          uniq.push(q)
        }
      }

      // shuffle bucket
      uniq.sort(() => rand() - 0.5)
      pool[key] = uniq
    }
  }

  // targets
  const trackTargets = distributeCounts(n, tracks, rand)

  const selected: BankQuestion[] = []
  const used = new Set<string>()

  // First pass: balanced by track then by difficulty
  for (const t of tracks) {
    const perTrackN = trackTargets[t]
    const diffLabels = difficulties.map(String)
    const diffTargetsStr = distributeCounts(perTrackN, diffLabels, rand)

    for (const d of difficulties) {
      let need = diffTargetsStr[String(d)]
      const key = `${t}__${d}` as PoolKey
      const candidates = pool[key] ?? []

      for (const q of candidates) {
        if (need <= 0) break
        const k = uniqueKey(q)
        if (used.has(k)) continue
        used.add(k)
        selected.push(q)
        need--
      }
    }
  }

  // Backfill if some buckets were short
  if (selected.length < n) {
    const allUniq: BankQuestion[] = []
    const seen = new Set<string>()

    for (const q of allQuestions) {
      if (!tracks.includes(q.track)) continue
      if (!difficulties.includes(q.difficulty_level)) continue
      const k = uniqueKey(q)
      if (seen.has(k)) continue
      seen.add(k)
      allUniq.push(q)
    }

    allUniq.sort(() => rand() - 0.5)

    for (const q of allUniq) {
      if (selected.length >= n) break
      const k = uniqueKey(q)
      if (used.has(k)) continue
      used.add(k)
      selected.push(q)
    }
  }

  if (selected.length < n) {
    throw new Error(`Not enough questions to generate ${n}. Got ${selected.length}.`)
  }

  return selected.slice(0, n)
}

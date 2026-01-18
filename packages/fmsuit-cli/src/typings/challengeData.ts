export type Plan = "free+" | "free" | "premium"

export type Difficulty = "newbie" | "junior" | "intermediate" | "advanced" | "guru"

export type Lenguages = "HTML" | "CSS" | "JS" | "API"

export type Status = "pending" | "progress" | "completed"

export interface ChallengeScrap {
  id: number
  plan: Plan
  difficulty: Difficulty
  lenguages: Lenguages[]
  status: Status
  isNew: boolean
  title: string
  description: string
  downloadLink: string
  updated_at: Date
}

export interface ChallengeData {
  expires_in: Date
  last_updated: Date
  challenges: ChallengeScrap[]
}

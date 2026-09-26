import type { ScoreBreakdown } from '@skillpath/types'

export function computeEmployabilityScore(breakdown: ScoreBreakdown): number {
  const weights = {
    roadmapCompletion: 0.20,   // steps completed / total steps * 100
    verifiedSkills:    0.25,   // mentor-verified skill count * 12.5, capped at 100
    githubActivity:    0.15,   // log-normalised commit count + streak bonus
    leetcodeStats:     0.10,   // (easy*1 + medium*2 + hard*3) / target * 100
    mentorRatings:     0.20,   // avg mentor rating / 5 * 100
    projectQuality:    0.10,   // avg(aiQualityScore + mentorScore) / 2
  }

  const rawScore = Object.entries(weights).reduce(
    (total, [key, weight]) => {
      const val = Math.min(100, Math.max(0, breakdown[key as keyof ScoreBreakdown] || 0))
      return total + val * weight
    },
    0
  )

  return Math.round(Math.min(100, Math.max(0, rawScore)) * 10) / 10
}

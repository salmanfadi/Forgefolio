import type { ScoreBreakdown } from '@forgefolio/types'

const defaultBreakdown: ScoreBreakdown = {
  roadmapCompletion: 80,
  verifiedSkills: 75,
  githubActivity: 85,
  leetcodeStats: 60,
  mentorRatings: 90,
  projectQuality: 70,
}

export function normaliseScore(value: number): number {
  return Math.min(100, Math.max(0, value || 0))
}

export function recomputeEmployabilityScore(
  partialBreakdown: Partial<ScoreBreakdown> = {}
): { totalScore: number; breakdown: ScoreBreakdown } {
  const breakdown: ScoreBreakdown = {
    roadmapCompletion: normaliseScore(partialBreakdown.roadmapCompletion ?? defaultBreakdown.roadmapCompletion),
    verifiedSkills: normaliseScore(partialBreakdown.verifiedSkills ?? defaultBreakdown.verifiedSkills),
    githubActivity: normaliseScore(partialBreakdown.githubActivity ?? defaultBreakdown.githubActivity),
    leetcodeStats: normaliseScore(partialBreakdown.leetcodeStats ?? defaultBreakdown.leetcodeStats),
    mentorRatings: normaliseScore(partialBreakdown.mentorRatings ?? defaultBreakdown.mentorRatings),
    projectQuality: normaliseScore(partialBreakdown.projectQuality ?? defaultBreakdown.projectQuality),
  }

  const totalScore = computeEmployabilityScore(breakdown)

  return { totalScore, breakdown }
}

export function computeEmployabilityScore(breakdown: ScoreBreakdown): number {
  const weights = {
    roadmapCompletion: 0.20,
    verifiedSkills: 0.25,
    githubActivity: 0.15,
    leetcodeStats: 0.10,
    mentorRatings: 0.20,
    projectQuality: 0.10,
  }

  const rawScore = Object.entries(weights).reduce((total, [key, weight]) => {
    const value = normaliseScore(breakdown[key as keyof ScoreBreakdown] || 0)
    return total + value * weight
  }, 0)

  return Math.round(Math.min(100, Math.max(0, rawScore)) * 10) / 10
}

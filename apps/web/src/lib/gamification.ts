export type EarnedBadge =
  | 'First Project'
  | 'First Verification'
  | 'Mentor Approved'
  | '5-Day Streak'
  | 'Open Source Contributor'

export function evaluateBadges({
  xp,
  streak,
  projectCount = 0,
  mentorVerifiedSkillCount = 0,
  approvedContributions = 0,
  mentorApprovedReviews = 0,
}: {
  xp: number
  streak: number
  projectCount?: number
  mentorVerifiedSkillCount?: number
  approvedContributions?: number
  mentorApprovedReviews?: number
}): EarnedBadge[] {
  const badges: EarnedBadge[] = []

  if (projectCount >= 1 || xp >= 250) {
    badges.push('First Project')
  }

  if (mentorVerifiedSkillCount >= 1 || xp >= 600) {
    badges.push('First Verification')
  }

  if (mentorApprovedReviews >= 1 || approvedContributions >= 1 || xp >= 900) {
    badges.push('Mentor Approved')
  }

  if (streak >= 5 || xp >= 1200) {
    badges.push('5-Day Streak')
  }

  if (approvedContributions >= 1 || xp >= 1500) {
    badges.push('Open Source Contributor')
  }

  return badges
}

export function calculateDailyStreak(daysActive: number): number {
  return Math.max(0, Math.min(daysActive, 365))
}

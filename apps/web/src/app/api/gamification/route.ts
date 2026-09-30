import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'
import { evaluateBadges } from '@/lib/gamification'

const GamificationSchema = z.object({
  userId: z.string().min(1),
  xp: z.number().min(0).max(5000).optional(),
  streak: z.number().int().min(0).max(365).optional(),
  badge: z.string().min(2).max(80).optional(),
  projectCount: z.number().int().min(0).max(50).optional(),
  mentorVerifiedSkillCount: z.number().int().min(0).max(20).optional(),
  approvedContributions: z.number().int().min(0).max(50).optional(),
  mentorApprovedReviews: z.number().int().min(0).max(50).optional(),
})

const baseSummary = {
  xp: 1450,
  streak: 5,
  projectCount: 1,
  mentorVerifiedSkillCount: 1,
  approvedContributions: 1,
  mentorApprovedReviews: 1,
  leaderboard: [
    { name: 'Alex Sharma', xp: 1450 },
    { name: 'Priya Verma', xp: 1380 },
    { name: 'Rohit Kumar', xp: 1210 },
    { name: 'Sneha Patel', xp: 1095 },
  ],
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = Object.fromEntries(url.searchParams.entries())
  const parsed = GamificationSchema.partial().safeParse(query)

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid query.' } },
      { status: 400 }
    )
  }

  const xp = parsed.data.xp ?? baseSummary.xp
  const streak = parsed.data.streak ?? baseSummary.streak
  const badges = evaluateBadges({
    xp,
    streak,
    projectCount: parsed.data.projectCount ?? baseSummary.projectCount,
    mentorVerifiedSkillCount: parsed.data.mentorVerifiedSkillCount ?? baseSummary.mentorVerifiedSkillCount,
    approvedContributions: parsed.data.approvedContributions ?? baseSummary.approvedContributions,
    mentorApprovedReviews: parsed.data.mentorApprovedReviews ?? baseSummary.mentorApprovedReviews,
  })

  return NextResponse.json<ApiResponse<{ xp: number; streak: number; badges: string[]; leaderboard: Array<{ name: string; xp: number }> }>>({
    data: {
      xp,
      streak,
      badges,
      leaderboard: baseSummary.leaderboard,
    },
  })
}

export async function POST(request: Request) {
  const parsed = GamificationSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid gamification payload.' } },
      { status: 400 }
    )
  }

  const xp = parsed.data.xp ?? baseSummary.xp
  const streak = parsed.data.streak ?? baseSummary.streak
  const badges = evaluateBadges({
    xp,
    streak,
    projectCount: parsed.data.projectCount ?? baseSummary.projectCount,
    mentorVerifiedSkillCount: parsed.data.mentorVerifiedSkillCount ?? baseSummary.mentorVerifiedSkillCount,
    approvedContributions: parsed.data.approvedContributions ?? baseSummary.approvedContributions,
    mentorApprovedReviews: parsed.data.mentorApprovedReviews ?? baseSummary.mentorApprovedReviews,
  })

  const result = {
    userId: parsed.data.userId,
    xp,
    streak,
    badges,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json<ApiResponse<typeof result>>({ data: result })
}

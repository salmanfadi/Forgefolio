import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse, EmployabilityScoreData } from '@forgefolio/types'
import { recomputeEmployabilityScore } from '@/lib/score'

const ScoreRecomputeSchema = z.object({
  userId: z.string().min(1),
  breakdown: z
    .object({
      roadmapCompletion: z.number().min(0).max(100).optional(),
      verifiedSkills: z.number().min(0).max(100).optional(),
      githubActivity: z.number().min(0).max(100).optional(),
      leetcodeStats: z.number().min(0).max(100).optional(),
      mentorRatings: z.number().min(0).max(100).optional(),
      projectQuality: z.number().min(0).max(100).optional(),
    })
    .partial()
    .optional(),
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: 'User ID is required.' } },
      { status: 400 }
    )
  }

  const { totalScore, breakdown } = recomputeEmployabilityScore()

  const scoreData: EmployabilityScoreData = {
    id: `score-${userId}`,
    userId,
    totalScore,
    breakdown,
    computedAt: new Date().toISOString(),
  }

  return NextResponse.json<ApiResponse<EmployabilityScoreData>>({ data: scoreData })
}

export async function POST(request: Request) {
  const parsed = ScoreRecomputeSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid score recomputation payload.' } },
      { status: 400 }
    )
  }

  const { totalScore, breakdown } = recomputeEmployabilityScore(parsed.data.breakdown)

  const scoreData: EmployabilityScoreData = {
    id: `score-${parsed.data.userId}`,
    userId: parsed.data.userId,
    totalScore,
    breakdown,
    computedAt: new Date().toISOString(),
  }

  return NextResponse.json<ApiResponse<EmployabilityScoreData>>({ data: scoreData })
}

import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse, EmployabilityScoreData } from '@skillpath/types'
import { computeEmployabilityScore } from '@/lib/score'

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  if (!userId) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: 'User ID is required' } },
      { status: 400 }
    )
  }

  const breakdown = {
    roadmapCompletion: 80,
    verifiedSkills: 75,
    githubActivity: 85,
    leetcodeStats: 60,
    mentorRatings: 90,
    projectQuality: 70,
  }

  const totalScore = computeEmployabilityScore(breakdown)

  const scoreData: EmployabilityScoreData = {
    id: `score-${userId}`,
    userId,
    totalScore,
    breakdown,
    computedAt: new Date().toISOString(),
  }

  return NextResponse.json<ApiResponse<EmployabilityScoreData>>({
    data: scoreData,
  })
}

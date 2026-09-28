import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'
import { getRoadmap, getRoadmapProgress, markRoadmapStepComplete, type RoadmapProgressSummary } from '@/lib/roadmaps'

const ProgressRequestSchema = z.object({
  stepId: z.string().min(1, 'Step ID is required.'),
  userId: z.string().min(1, 'User ID is required.'),
})

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  const body = ProgressRequestSchema.safeParse(await request.json().catch(() => null))

  if (!body.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: body.error.issues[0]?.message ?? 'Invalid request body.' } },
      { status: 400 }
    )
  }

  const slug = params.slug
  const roadmap = await getRoadmap(slug)

  if (!roadmap) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'NOT_FOUND', message: 'Roadmap not found.' } },
      { status: 404 }
    )
  }

  try {
    const progress = markRoadmapStepComplete(slug, body.data.userId, body.data.stepId, roadmap)

    return NextResponse.json<ApiResponse<RoadmapProgressSummary>>({ data: progress })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_STEP', message: error instanceof Error ? error.message : 'Step is invalid for this roadmap.' } },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: 'User ID is required.' } },
      { status: 400 }
    )
  }

  const roadmap = await getRoadmap(params.slug)
  if (!roadmap) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'NOT_FOUND', message: 'Roadmap not found.' } },
      { status: 404 }
    )
  }

  const progress = getRoadmapProgress(params.slug, userId, roadmap)

  return NextResponse.json<ApiResponse<RoadmapProgressSummary>>({ data: progress })
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@skillpath/types'
import { getRoadmap, type RoadmapContent } from '@/lib/roadmaps'

const RouteParamsSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const parsedParams = RouteParamsSchema.safeParse(params)
  if (!parsedParams.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: 'Invalid roadmap identifier.' } },
      { status: 400 }
    )
  }

  try {
    const roadmap = await getRoadmap(parsedParams.data.slug)
    if (!roadmap) {
      return NextResponse.json<ApiResponse<null>>(
        { error: { code: 'NOT_FOUND', message: 'Roadmap not found.' } },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<RoadmapContent>>({ data: roadmap })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'ROADMAP_CONTENT_UNAVAILABLE', message: 'Roadmap content is unavailable.' } },
      { status: 500 }
    )
  }
}

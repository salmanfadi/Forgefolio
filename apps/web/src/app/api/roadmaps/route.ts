import { NextResponse } from 'next/server'
import type { ApiResponse } from '@skillpath/types'
import { getRoadmaps, type RoadmapContent } from '@/lib/roadmaps'

export async function GET() {
  try {
    const roadmaps = await getRoadmaps()
    const response: ApiResponse<RoadmapContent[]> = {
      data: roadmaps,
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'ROADMAP_CONTENT_UNAVAILABLE', message: 'Roadmap content is unavailable.' } },
      { status: 500 }
    )
  }
}

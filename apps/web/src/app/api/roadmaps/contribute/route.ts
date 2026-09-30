import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'
import {
  ContributionPersistenceError,
  createRoadmapContribution,
} from '@/lib/contributions'

const ContributionSchema = z.object({
  userId: z.string().min(1).optional(),
  roadmapSlug: z.string().min(2),
  type: z.enum(['add_resource', 'edit_step', 'new_module']),
  summary: z.string().min(10).max(1200),
})

export async function POST(request: Request) {
  const parsed = ContributionSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid contribution payload.' } },
      { status: 400 }
    )
  }

  try {
    const record = await createRoadmapContribution(parsed.data)

    return NextResponse.json<ApiResponse<typeof record>>({ data: record })
  } catch (error) {
    if (error instanceof ContributionPersistenceError) {
      const status = error.code === 'ROADMAP_NOT_FOUND' ? 404 : 400
      return NextResponse.json<ApiResponse<null>>(
        { error: { code: error.code, message: error.message } },
        { status }
      )
    }
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'PERSISTENCE_FAILED', message: 'Could not store the contribution. Please retry.' } },
      { status: 500 }
    )
  }
}

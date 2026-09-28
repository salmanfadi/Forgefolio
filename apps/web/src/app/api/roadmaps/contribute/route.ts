import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const ContributionSchema = z.object({
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

  const result = {
    id: `contribution-${Date.now()}`,
    roadmapSlug: parsed.data.roadmapSlug,
    type: parsed.data.type,
    status: 'OPEN',
    summary: parsed.data.summary,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json<ApiResponse<typeof result>>({ data: result })
}

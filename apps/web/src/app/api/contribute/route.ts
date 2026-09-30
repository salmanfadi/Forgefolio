import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'
import { listRoadmapContributions } from '@/lib/contributions'

const ContributeQuerySchema = z.object({
  status: z.enum(['OPEN', 'APPROVED', 'REJECTED']).optional(),
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const filters = ContributeQuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()))

  if (!filters.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: filters.error.issues[0]?.message ?? 'Invalid filter.' } },
      { status: 400 }
    )
  }

  const items = await listRoadmapContributions(filters.data.status)

  return NextResponse.json<ApiResponse<typeof items>>({ data: items })
}

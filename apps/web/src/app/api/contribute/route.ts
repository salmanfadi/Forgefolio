import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const ContributeQuerySchema = z.object({
  status: z.enum(['OPEN', 'APPROVED', 'REJECTED']).optional(),
})

const contributions = [
  {
    id: 'contrib-1',
    title: 'Add advanced React state management resource',
    roadmapSlug: 'frontend-developer',
    type: 'add_resource',
    status: 'OPEN',
    submittedBy: 'Nisha Rao',
    createdAt: '2026-09-22T11:00:00.000Z',
  },
  {
    id: 'contrib-2',
    title: 'Fix database step ordering in backend roadmap',
    roadmapSlug: 'backend-developer',
    type: 'edit_step',
    status: 'APPROVED',
    submittedBy: 'Vikram Singh',
    createdAt: '2026-09-19T15:00:00.000Z',
  },
]

export async function GET(request: Request) {
  const url = new URL(request.url)
  const filters = ContributeQuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()))

  if (!filters.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: filters.error.issues[0]?.message ?? 'Invalid filter.' } },
      { status: 400 }
    )
  }

  let items = contributions
  if (filters.data.status) {
    items = items.filter((item) => item.status === filters.data.status)
  }

  return NextResponse.json<ApiResponse<typeof items>>({ data: items })
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const QueueFilterSchema = z.object({
  domain: z.string().optional(),
  status: z.enum(['PENDING', 'AI_REVIEW', 'CHALLENGE_ISSUED', 'COMPLETED', 'REJECTED']).optional(),
})

const queue = [
  {
    id: 'req-1',
    learnerName: 'Alex Sharma',
    skill: 'JavaScript Closures & Async',
    domain: 'Frontend Development',
    status: 'AI_REVIEW',
    score: 85,
    submittedAt: '2026-09-24T09:00:00.000Z',
    githubUrl: 'https://github.com/alex-sharma/react-task-manager',
    liveUrl: 'https://taskmanager.vercel.app',
  },
  {
    id: 'req-2',
    learnerName: 'Priya Verma',
    skill: 'Node.js API Design',
    domain: 'Backend Development',
    status: 'PENDING',
    score: 78,
    submittedAt: '2026-09-20T11:00:00.000Z',
    githubUrl: 'https://github.com/priya-verma/api-routes',
    liveUrl: 'https://api-demo.vercel.app',
  },
  {
    id: 'req-3',
    learnerName: 'Rohit Kumar',
    skill: 'SQL Performance Tuning',
    domain: 'Data Analytics',
    status: 'COMPLETED',
    score: 92,
    submittedAt: '2026-09-18T14:00:00.000Z',
    githubUrl: 'https://github.com/rohit-kumar/sql-ops',
    liveUrl: null,
  },
]

export async function GET(request: Request) {
  const url = new URL(request.url)
  const filters = QueueFilterSchema.safeParse(Object.fromEntries(url.searchParams.entries()))

  if (!filters.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: filters.error.issues[0]?.message ?? 'Invalid queue filters.' } },
      { status: 400 }
    )
  }

  let items = queue
  if (filters.data.domain && filters.data.domain !== 'All') {
    items = items.filter((item) => item.domain === filters.data.domain)
  }
  if (filters.data.status) {
    items = items.filter((item) => item.status === filters.data.status)
  }

  return NextResponse.json<ApiResponse<typeof items>>({ data: items })
}

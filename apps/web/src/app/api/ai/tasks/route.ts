import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const TaskType = z.enum(['theory', 'build', 'practice'])

export const DailyTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: TaskType,
  estimatedTime: z.string().min(1),
  completed: z.boolean().default(false),
})

const QuerySchema = z.object({
  userId: z.string().min(1).optional(),
  roadmapSlug: z.string().min(1).optional(),
  stepSlug: z.string().min(1).optional(),
})

type DailyTask = z.infer<typeof DailyTaskSchema>
type DailyTaskType = DailyTask['type']

const fallbackTasks: DailyTask[] = [
  {
    id: 'daily-1',
    title: 'Review JavaScript event loop microtasks vs macrotasks',
    type: 'theory',
    estimatedTime: '15 min',
    completed: true,
  },
  {
    id: 'daily-2',
    title: 'Build a memoization wrapper with cache invalidation',
    type: 'build',
    estimatedTime: '30 min',
    completed: false,
  },
  {
    id: 'daily-3',
    title: 'Solve 2 hash table exercises on LeetCode',
    type: 'practice',
    estimatedTime: '20 min',
    completed: false,
  },
]

export async function GET(request: Request) {
  const url = new URL(request.url)
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid query parameters.' } },
      { status: 400 }
    )
  }

  const { roadmapSlug = 'frontend-developer', stepSlug = 'fe-step-3' } = parsed.data

  const recommendations: DailyTask[] = [
    {
      id: `${roadmapSlug}-${stepSlug}-1`,
      title: `Review the core concepts behind ${stepSlug.replace(/-/g, ' ')}`,
      type: 'theory' as DailyTaskType,
      estimatedTime: '15 min',
      completed: false,
    },
    {
      id: `${roadmapSlug}-${stepSlug}-2`,
      title: `Build a focused exercise tied to ${roadmapSlug.replace(/-/g, ' ')}`,
      type: 'build' as DailyTaskType,
      estimatedTime: '30 min',
      completed: false,
    },
    {
      id: `${roadmapSlug}-${stepSlug}-3`,
      title: 'Practice 2 rapid-fire problems that reinforce the day’s concepts',
      type: 'practice' as DailyTaskType,
      estimatedTime: '20 min',
      completed: false,
    },
  ]

  return NextResponse.json<ApiResponse<DailyTask[]>>({ data: recommendations })
}

export async function POST(request: Request) {
  const parsed = DailyTaskSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid task payload.' } },
      { status: 400 }
    )
  }

  return NextResponse.json<ApiResponse<DailyTask[]>>({ data: [parsed.data] })
}

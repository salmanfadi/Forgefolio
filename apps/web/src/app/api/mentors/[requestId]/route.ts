import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const ReviewActionSchema = z.object({
  action: z.enum(['accept', 'reject', 'challenge']),
  feedback: z.string().min(5).max(1200).optional(),
  challengeDescription: z.string().min(5).max(1200).optional(),
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
    description: 'Built a React task board with advanced state management and testing coverage.',
    mentorFeedback: 'Strong implementation and code quality. Good candidate for mentoring review.',
  },
]

export async function GET(_request: Request, { params }: { params: { requestId: string } }) {
  const item = queue.find((entry) => entry.id === params.requestId)

  if (!item) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'NOT_FOUND', message: 'Verification request not found.' } },
      { status: 404 }
    )
  }

  return NextResponse.json<ApiResponse<typeof item>>({ data: item })
}

export async function POST(request: Request, { params }: { params: { requestId: string } }) {
  const parsed = ReviewActionSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid review action.' } },
      { status: 400 }
    )
  }

  const item = queue.find((entry) => entry.id === params.requestId)

  if (!item) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'NOT_FOUND', message: 'Verification request not found.' } },
      { status: 404 }
    )
  }

  const result = {
    ...item,
    status: parsed.data.action === 'accept' ? 'COMPLETED' : parsed.data.action === 'reject' ? 'REJECTED' : 'CHALLENGE_ISSUED',
    mentorFeedback: parsed.data.feedback ?? item.mentorFeedback,
    challengeDescription: parsed.data.challengeDescription ?? item.description,
  }

  return NextResponse.json<ApiResponse<typeof result>>({ data: result })
}

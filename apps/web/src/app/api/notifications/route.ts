import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const NotificationSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(['verification_status', 'challenge', 'badge', 'contribution_review']),
  message: z.string().min(3).max(500),
})

const _NotificationRecordSchema = NotificationSchema.extend({
  id: z.string().min(1),
  read: z.boolean().default(false),
  createdAt: z.string().datetime().default(new Date().toISOString()),
})

export type NotificationRecord = z.infer<typeof _NotificationRecordSchema>

const fallbackNotifications: NotificationRecord[] = [
  {
    id: 'notification-1',
    userId: 'learner-123',
    type: 'verification_status',
    message: 'Your JavaScript skill passed mentor review and is now verified.',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notification-2',
    userId: 'learner-123',
    type: 'badge',
    message: 'Badge earned: First Verification',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'notification-3',
    userId: 'learner-123',
    type: 'challenge',
    message: 'A mentor issued a challenge for your TypeScript project review.',
    read: false,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
]

export async function GET(request: Request) {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: 'User ID is required.' } },
      { status: 400 }
    )
  }

  const filtered = fallbackNotifications.filter((notification) => notification.userId === userId)

  return NextResponse.json<ApiResponse<NotificationRecord[]>>({ data: filtered })
}

export async function POST(request: Request) {
  const parsed = NotificationSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid notification payload.' } },
      { status: 400 }
    )
  }

  const result: NotificationRecord = {
    id: `notification-${Date.now()}`,
    userId: parsed.data.userId,
    type: parsed.data.type,
    message: parsed.data.message,
    read: false,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json<ApiResponse<NotificationRecord>>({ data: result })
}

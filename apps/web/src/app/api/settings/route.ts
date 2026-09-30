import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const SettingsSchema = z.object({
  userId: z.string().min(1).optional(),
  name: z.string().min(2).max(80),
  username: z.string().min(2).max(40).regex(/^[a-z0-9_\-]+$/i),
  bio: z.string().min(5).max(200).optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  isPublic: z.boolean().optional(),
  showReferralTab: z.boolean().optional(),
})

const defaultState = {
  userId: 'learner-123',
  name: 'Alex Sharma',
  username: 'alex_dev',
  bio: 'Passionate about React, accessibility, and shipping dependable user experiences.',
  avatarUrl: '',
  isPublic: true,
  showReferralTab: true,
}

export async function GET() {
  return NextResponse.json<ApiResponse<typeof defaultState>>({ data: defaultState })
}

export async function POST(request: Request) {
  const parsed = SettingsSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid settings payload.' } },
      { status: 400 }
    )
  }

  const result = {
    ...defaultState,
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json<ApiResponse<typeof result>>({ data: result })
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const GamificationSchema = z.object({
  userId: z.string().min(1),
  xp: z.number().min(0).max(5000).optional(),
  streak: z.number().int().min(0).max(365).optional(),
  badge: z.string().min(2).max(80).optional(),
})

const summary = {
  xp: 1450,
  streak: 5,
  badges: ['First Project', 'First Verification', 'Mentor Approved', '5-Day Streak'],
  leaderboard: [
    { name: 'Alex Sharma', xp: 1450 },
    { name: 'Priya Verma', xp: 1380 },
    { name: 'Rohit Kumar', xp: 1210 },
    { name: 'Sneha Patel', xp: 1095 },
  ],
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = Object.fromEntries(url.searchParams.entries())
  const parsed = GamificationSchema.partial().safeParse(query)

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid query.' } },
      { status: 400 }
    )
  }

  return NextResponse.json<ApiResponse<typeof summary>>({ data: summary })
}

export async function POST(request: Request) {
  const parsed = GamificationSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid gamification payload.' } },
      { status: 400 }
    )
  }

  const result = {
    userId: parsed.data.userId,
    xp: parsed.data.xp ?? summary.xp,
    streak: parsed.data.streak ?? summary.streak,
    badge: parsed.data.badge ?? summary.badges[0],
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json<ApiResponse<typeof result>>({ data: result })
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const VerifySkillSchema = z.object({
  skillName: z.string().min(2).max(120),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  leetcodeUsername: z.string().min(2).max(80).optional().or(z.literal('')),
}).refine((data) => Boolean(data.githubUrl || data.liveUrl), {
  message: 'At least one evidence source (GitHub URL or live URL) is required.',
  path: ['githubUrl'],
})

export async function POST(request: Request) {
  const parsed = VerifySkillSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid verification payload.' } },
      { status: 400 }
    )
  }

  const result = {
    id: `verify-${Date.now()}`,
    skill: parsed.data.skillName,
    status: 'AI_REVIEW',
    score: 85,
    submittedAt: new Date().toISOString(),
    evidence: {
      githubUrl: parsed.data.githubUrl || null,
      liveUrl: parsed.data.liveUrl || null,
      leetcodeUsername: parsed.data.leetcodeUsername || null,
    },
  }

  return NextResponse.json<ApiResponse<typeof result>>({ data: result })
}

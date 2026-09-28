import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const ProjectSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(800).optional().default(''),
  repoUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  aiQualityScore: z.number().min(0).max(100).optional().default(85),
})

export async function POST(request: Request) {
  const parsed = ProjectSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid project payload.' } },
      { status: 400 }
    )
  }

  const payload = parsed.data
  const result = {
    id: `project-${Date.now()}`,
    title: payload.title,
    description: payload.description,
    repoUrl: payload.repoUrl || null,
    liveUrl: payload.liveUrl || null,
    aiQualityScore: payload.aiQualityScore,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json<ApiResponse<typeof result>>({ data: result })
}

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'
import { ProjectPersistenceError, createProject, listProjectsForUser, resolveProjectOwner } from '@/lib/projects'

const ProjectSchema = z.object({
  userId: z.string().min(1).optional(),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(800).optional().default(''),
  repoUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  aiQualityScore: z.number().min(0).max(100).optional(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const explicitUserId = searchParams.get('userId') ?? undefined

  try {
    const owner = await resolveProjectOwner(explicitUserId)
    const projects = await listProjectsForUser(owner.id)

    return NextResponse.json<ApiResponse<typeof projects>>({ data: projects })
  } catch (error) {
    if (error instanceof ProjectPersistenceError) {
      return NextResponse.json<ApiResponse<null>>(
        { error: { code: error.code, message: error.message } },
        { status: 404 }
      )
    }
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'FETCH_FAILED', message: 'Could not load projects. Please retry.' } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const parsed = ProjectSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid project payload.' } },
      { status: 400 }
    )
  }

  try {
    const owner = await resolveProjectOwner(parsed.data.userId)
    const project = await createProject({ ...parsed.data, userId: owner.id })

    return NextResponse.json<ApiResponse<typeof project>>({ data: project }, { status: 201 })
  } catch (error) {
    if (error instanceof ProjectPersistenceError) {
      return NextResponse.json<ApiResponse<null>>(
        { error: { code: error.code, message: error.message } },
        { status: 404 }
      )
    }
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'PERSISTENCE_FAILED', message: 'Could not save the project. Please retry.' } },
      { status: 500 }
    )
  }
}

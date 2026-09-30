import { db } from '@/lib/db'
import { resolveActorUser, ActorNotFoundError } from '@/lib/users'

export class ProjectPersistenceError extends Error {
  code: 'USER_NOT_FOUND'

  constructor(code: ProjectPersistenceError['code'], message: string) {
    super(message)
    this.code = code
  }
}

export type ProjectRecord = {
  id: string
  title: string
  description: string
  repoUrl: string | null
  liveUrl: string | null
  aiQualityScore: number | null
  createdAt: string
}

export async function resolveProjectOwner(explicitUserId?: string): Promise<{ id: string }> {
  try {
    return await resolveActorUser(explicitUserId)
  } catch (error) {
    if (error instanceof ActorNotFoundError) {
      throw new ProjectPersistenceError('USER_NOT_FOUND', error.message)
    }
    throw error
  }
}

export async function createProject(input: {
  userId: string
  title: string
  description: string
  repoUrl?: string | null
  liveUrl?: string | null
  aiQualityScore?: number | null
}): Promise<ProjectRecord> {
  const record = await db.project.create({
    data: {
      userId: input.userId,
      title: input.title,
      description: input.description,
      repoUrl: input.repoUrl || null,
      liveUrl: input.liveUrl || null,
      aiQualityScore: input.aiQualityScore ?? null,
    },
  })

  return serializeProject(record)
}

export async function listProjectsForUser(userId: string): Promise<ProjectRecord[]> {
  const records = await db.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return records.map(serializeProject)
}

function serializeProject(record: {
  id: string
  title: string
  description: string
  repoUrl: string | null
  liveUrl: string | null
  aiQualityScore: number | null
  createdAt: Date
}): ProjectRecord {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    repoUrl: record.repoUrl,
    liveUrl: record.liveUrl,
    aiQualityScore: record.aiQualityScore,
    createdAt: record.createdAt.toISOString(),
  }
}

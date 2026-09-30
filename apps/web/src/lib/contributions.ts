import { db } from '@/lib/db'
import { resolveActorUser, ActorNotFoundError } from '@/lib/users'

export type ContributionType = 'add_resource' | 'edit_step' | 'new_module'
export type ContributionStatus = 'OPEN' | 'APPROVED' | 'REJECTED'

export class ContributionPersistenceError extends Error {
  code: 'USER_NOT_FOUND' | 'ROADMAP_NOT_FOUND'

  constructor(code: ContributionPersistenceError['code'], message: string) {
    super(message)
    this.code = code
  }
}

export type RoadmapContributionRecord = {
  id: string
  roadmapSlug: string
  type: ContributionType
  status: ContributionStatus
  summary: string
  createdAt: string
}

/**
 * Persists a roadmap contribution with `OPEN` status for mentor review.
 */
export async function createRoadmapContribution(input: {
  userId?: string
  roadmapSlug: string
  type: ContributionType
  summary: string
}): Promise<RoadmapContributionRecord> {
  let actorId: string
  try {
    const actor = await resolveActorUser(input.userId)
    actorId = actor.id
  } catch (error) {
    if (error instanceof ActorNotFoundError) {
      throw new ContributionPersistenceError('USER_NOT_FOUND', error.message)
    }
    throw error
  }

  const roadmap = await db.roadmap.findUnique({ where: { slug: input.roadmapSlug }, select: { id: true } })

  if (!roadmap) {
    throw new ContributionPersistenceError(
      'ROADMAP_NOT_FOUND',
      `Roadmap "${input.roadmapSlug}" was not found.`
    )
  }

  const record = await db.roadmapContribution.create({
    data: {
      userId: actorId,
      roadmapId: roadmap.id,
      type: input.type,
      contentDiff: { summary: input.summary },
      status: 'OPEN',
    },
  })

  return {
    id: record.id,
    roadmapSlug: input.roadmapSlug,
    type: record.type as ContributionType,
    status: 'OPEN',
    summary: input.summary,
    createdAt: record.createdAt.toISOString(),
  }
}

/**
 * Lists contributions (newest first), optionally filtered by status.
 * Response shape mirrors the dashboard contribution queue.
 */
export async function listRoadmapContributions(
  status?: ContributionStatus
): Promise<
  Array<{
    id: string
    title: string
    roadmapSlug: string
    type: string
    status: ContributionStatus
    submittedBy: string
    createdAt: string
  }>
> {
  const rows = await db.roadmapContribution.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: { select: { name: true } },
      roadmap: { select: { slug: true } },
    },
  })

  return rows.map((row) => {
    const diff = row.contentDiff as { summary?: unknown } | null
    const summary = typeof diff?.summary === 'string' ? diff.summary : '(no summary)'

    return {
      id: row.id,
      title: summary,
      roadmapSlug: row.roadmap.slug,
      type: row.type,
      status: row.status as ContributionStatus,
      submittedBy: row.user.name,
      createdAt: row.createdAt.toISOString(),
    }
  })
}

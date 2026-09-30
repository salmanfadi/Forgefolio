import { db } from '@/lib/db'
import {
  calculateCompletionPercentage,
  type RoadmapContent,
  type RoadmapProgressSummary,
} from '@/lib/roadmaps'

export type { RoadmapProgressSummary } from '@/lib/roadmaps'

export class ProgressPersistenceError extends Error {
  code: 'USER_NOT_FOUND' | 'STEP_NOT_SEEDED'

  constructor(code: ProgressPersistenceError['code'], message: string) {
    super(message)
    this.code = code
  }
}

function summarise(
  slug: string,
  userId: string,
  roadmap: RoadmapContent,
  completedStepIds: string[]
): RoadmapProgressSummary {
  const allStepIds = roadmap.modules.flatMap((module) => module.steps.map((step) => step.id))
  const validCompletedStepIds = allStepIds.filter((stepId) => completedStepIds.includes(stepId))
  const uniqueCompletedStepIds = Array.from(new Set(validCompletedStepIds))

  return {
    slug,
    userId,
    completedSteps: uniqueCompletedStepIds.length,
    totalSteps: allStepIds.length,
    completionPercentage: calculateCompletionPercentage(uniqueCompletedStepIds.length, allStepIds.length),
    completedStepIds: uniqueCompletedStepIds,
  }
}

/**
 * Reads per-user, per-step progress for a roadmap from the `UserProgress` table.
 * Content JSON step ids are mapped to DB rows through `Step.contentId`.
 */
export async function getRoadmapProgressForUser(
  slug: string,
  userId: string,
  roadmap: RoadmapContent
): Promise<RoadmapProgressSummary> {
  const allStepIds = roadmap.modules.flatMap((module) => module.steps.map((step) => step.id))

  const rows = await db.userProgress.findMany({
    where: {
      userId,
      step: { contentId: { in: allStepIds }, module: { roadmap: { slug } } },
    },
    select: { step: { select: { contentId: true } } },
  })

  const completedStepIds = rows
    .map((row) => row.step.contentId)
    .filter((contentId): contentId is string => typeof contentId === 'string')

  return summarise(slug, userId, roadmap, completedStepIds)
}

/**
 * Marks a step complete. Idempotent: re-marking an already-completed step is a no-op
 * (the `UserProgress` composite primary key `[userId, stepId]` blocks duplicates).
 */
export async function markRoadmapStepCompleteForUser(
  slug: string,
  userId: string,
  stepId: string,
  roadmap: RoadmapContent
): Promise<RoadmapProgressSummary> {
  const allStepIds = roadmap.modules.flatMap((module) => module.steps.map((step) => step.id))
  if (!allStepIds.includes(stepId)) {
    throw new Error(`Step "${stepId}" does not exist in roadmap "${slug}".`)
  }

  const [user, step] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, select: { id: true } }),
    db.step.findFirst({
      where: { contentId: stepId, module: { roadmap: { slug } } },
      select: { id: true },
    }),
  ])

  if (!user) {
    throw new ProgressPersistenceError(
      'USER_NOT_FOUND',
      `User "${userId}" was not found. Seed demo users with pnpm db:seed.`
    )
  }
  if (!step) {
    throw new ProgressPersistenceError(
      'STEP_NOT_SEEDED',
      `Step "${stepId}" is not present in the database. Run pnpm db:seed to sync roadmap content.`
    )
  }

  await db.userProgress.upsert({
    where: { userId_stepId: { userId, stepId: step.id } },
    create: { userId, stepId: step.id },
    update: {},
  })

  return getRoadmapProgressForUser(slug, userId, roadmap)
}

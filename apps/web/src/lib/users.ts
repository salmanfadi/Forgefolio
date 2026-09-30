import { db } from '@/lib/db'

export class ActorNotFoundError extends Error {
  code = 'USER_NOT_FOUND'

  constructor(message: string) {
    super(message)
  }
}

/**
 * Resolves the user an unauthenticated request acts on. Until Phase 1A auth
 * lands, requests without an explicit userId act on the seeded demo learner
 * (alex_learner, falling back to any LEARNER).
 */
export async function resolveActorUser(explicitUserId?: string): Promise<{ id: string }> {
  if (explicitUserId) {
    const user = await db.user.findUnique({ where: { id: explicitUserId }, select: { id: true } })
    if (!user) {
      throw new ActorNotFoundError(`User "${explicitUserId}" was not found. Seed demo users with pnpm db:seed.`)
    }
    return user
  }

  const demoLearner =
    (await db.user.findFirst({ where: { username: 'alex_learner' }, select: { id: true } })) ??
    (await db.user.findFirst({ where: { role: 'LEARNER' }, select: { id: true } }))

  if (!demoLearner) {
    throw new ActorNotFoundError('No learner found. Seed demo users with pnpm db:seed.')
  }
  return demoLearner
}

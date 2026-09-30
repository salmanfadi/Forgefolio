import { promises as fs } from 'fs'
import path from 'path'
import { z } from 'zod'

const TheoryResourceSchema = z.object({
  type: z.enum(['video', 'docs', 'article']),
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().min(1),
})

const PracticalExerciseSchema = z.object({
  type: z.enum(['theory', 'build', 'practice']),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})

const StepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  orderIndex: z.number().int().positive(),
  theoryContent: z.array(TheoryResourceSchema).min(1),
  practicalContent: z.array(PracticalExerciseSchema).min(1),
})

const ModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  orderIndex: z.number().int().positive(),
  steps: z.array(StepSchema).min(1),
})

export const RoadmapContentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  domain: z.string().min(1),
  description: z.string().min(1),
  version: z.string().min(1),
  isPublished: z.boolean(),
  modules: z.array(ModuleSchema).min(1),
})

export type RoadmapContent = z.infer<typeof RoadmapContentSchema>

async function getRoadmapsDirectory(): Promise<string> {
  const candidates = [
    path.join(process.cwd(), 'content', 'roadmaps'),
    path.join(process.cwd(), '..', '..', 'content', 'roadmaps'),
  ]

  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      // Try the next supported monorepo working directory.
    }
  }

  throw new Error('Roadmap content directory not found')
}

async function readRoadmapFile(filePath: string): Promise<RoadmapContent> {
  const source = await fs.readFile(filePath, 'utf8')
  const parsed: unknown = JSON.parse(source)
  return RoadmapContentSchema.parse(parsed)
}

export async function getRoadmaps(): Promise<RoadmapContent[]> {
  const roadmapsDirectory = await getRoadmapsDirectory()
  const entries = await fs.readdir(roadmapsDirectory, { withFileTypes: true })
  const roadmaps = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => readRoadmapFile(path.join(roadmapsDirectory, entry.name, 'roadmap.json')))
  )

  return roadmaps
    .filter((roadmap) => roadmap.isPublished)
    .sort((first, second) => first.title.localeCompare(second.title))
}

export async function getRoadmap(slug: string): Promise<RoadmapContent | null> {
  const roadmaps = await getRoadmaps()
  return roadmaps.find((roadmap) => roadmap.slug === slug) ?? null
}

export function calculateCompletionPercentage(completedSteps: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0
  return Math.round((Math.min(Math.max(completedSteps, 0), totalSteps) / totalSteps) * 100)
}

export type RoadmapProgressSummary = {
  slug: string
  userId: string
  completedSteps: number
  totalSteps: number
  completionPercentage: number
  completedStepIds: string[]
}

export type RoadmapModuleOverview = {
  id: string
  title: string
  completedSteps: number
  totalSteps: number
  status: 'completed' | 'active' | 'locked'
}

export type RoadmapOverviewSummary = {
  slug: string
  title: string
  description: string
  completionPercentage: number
  modules: RoadmapModuleOverview[]
}

export function buildRoadmapOverview(roadmap: RoadmapContent, progress: RoadmapProgressSummary): RoadmapOverviewSummary {
  const completedSet = new Set(progress.completedStepIds)

  return {
    slug: roadmap.slug,
    title: roadmap.title,
    description: roadmap.description,
    completionPercentage: progress.completionPercentage,
    modules: roadmap.modules.map((module, index) => {
      const stepIds = module.steps.map((step) => step.id)
      const completedSteps = stepIds.filter((stepId) => completedSet.has(stepId)).length
      const totalSteps = stepIds.length

      let status: RoadmapModuleOverview['status'] = 'locked'
      if (completedSteps === totalSteps) {
        status = 'completed'
      } else if (completedSteps > 0 || index === 0) {
        status = 'active'
      }

      return {
        id: module.id,
        title: module.title,
        completedSteps,
        totalSteps,
        status,
      }
    }),
  }
}

export const roadmapProgressStore = new Map<string, Set<string>>()

export function getRoadmapProgress(slug: string, userId: string, roadmap: RoadmapContent): RoadmapProgressSummary {
  const allStepIds = roadmap.modules.flatMap((module) => module.steps.map((step) => step.id))
  const key = `${userId}:${slug}`
  const completedStepIds = roadmapProgressStore.get(key) ?? new Set<string>()
  const validCompletedStepIds = Array.from(completedStepIds).filter((stepId) => allStepIds.includes(stepId))

  if (validCompletedStepIds.length !== completedStepIds.size) {
    roadmapProgressStore.set(key, new Set(validCompletedStepIds))
  }

  const totalSteps = allStepIds.length
  const completedSteps = validCompletedStepIds.length

  return {
    slug,
    userId,
    completedSteps,
    totalSteps,
    completionPercentage: calculateCompletionPercentage(completedSteps, totalSteps),
    completedStepIds: validCompletedStepIds,
  }
}

export function markRoadmapStepComplete(slug: string, userId: string, stepId: string, roadmap: RoadmapContent): RoadmapProgressSummary {
  const allStepIds = roadmap.modules.flatMap((module) => module.steps.map((step) => step.id))
  if (!allStepIds.includes(stepId)) {
    throw new Error(`Step "${stepId}" does not exist in roadmap "${slug}".`)
  }

  const key = `${userId}:${slug}`
  const completedStepIds = roadmapProgressStore.get(key) ?? new Set<string>()
  completedStepIds.add(stepId)
  roadmapProgressStore.set(key, completedStepIds)

  return getRoadmapProgress(slug, userId, roadmap)
}

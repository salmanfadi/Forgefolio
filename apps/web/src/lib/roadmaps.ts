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

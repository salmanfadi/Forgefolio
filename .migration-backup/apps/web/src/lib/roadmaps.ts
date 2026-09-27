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

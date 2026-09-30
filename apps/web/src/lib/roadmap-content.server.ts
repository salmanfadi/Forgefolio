// Server-only roadmap content loading. Reads and validates roadmap JSON from
// content/roadmaps. Never import this from a client component — it uses `fs`.
import { promises as fs } from 'fs'
import path from 'path'
import { RoadmapContentSchema, type RoadmapContent } from '@/lib/roadmaps'

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

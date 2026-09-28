import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse, DirectoryCandidate } from '@forgefolio/types'

const DirectoryQuerySchema = z.object({
  domain: z.string().optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
  skill: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['score', 'completion', 'verified']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(20).optional(),
})

const candidates: DirectoryCandidate[] = [
  {
    id: 'usr-1',
    username: 'alex_dev',
    name: 'Alex Sharma',
    role: 'Frontend Developer',
    domain: 'Frontend Development',
    score: 78.5,
    roadmapPercent: 60,
    topSkills: ['JavaScript ES6+', 'React.js', 'TypeScript', 'CSS Grid'],
    verifiedSkillsCount: 2,
    isPublic: true,
  },
  {
    id: 'usr-2',
    username: 'priya_backend',
    name: 'Priya Verma',
    role: 'Backend Systems Engineer',
    domain: 'Backend Development',
    score: 84.0,
    roadmapPercent: 85,
    topSkills: ['Node.js', 'PostgreSQL', 'Prisma ORM', 'Redis', 'Docker'],
    verifiedSkillsCount: 4,
    isPublic: true,
  },
  {
    id: 'usr-3',
    username: 'rohit_data',
    name: 'Rohit Kumar',
    role: 'Data Analyst',
    domain: 'Data Analytics',
    score: 72.0,
    roadmapPercent: 50,
    topSkills: ['SQL Window Functions', 'Python Pandas', 'Tableau'],
    verifiedSkillsCount: 2,
    isPublic: true,
  },
  {
    id: 'usr-4',
    username: 'sneha_ml',
    name: 'Sneha Patel',
    role: 'Data Scientist',
    domain: 'Data Science',
    score: 81.5,
    roadmapPercent: 75,
    topSkills: ['Scikit-learn', 'Feature Engineering', 'Random Forest'],
    verifiedSkillsCount: 3,
    isPublic: true,
  },
  {
    id: 'usr-5',
    username: 'hidden_user',
    name: 'Ananya Joshi',
    role: 'Frontend Developer',
    domain: 'Frontend Development',
    score: 90.0,
    roadmapPercent: 88,
    topSkills: ['React.js', 'Accessibility', 'TypeScript'],
    verifiedSkillsCount: 5,
    isPublic: false,
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const parsed = DirectoryQuerySchema.safeParse(Object.fromEntries(searchParams.entries()))

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? 'Invalid directory filters.' } },
      { status: 400 }
    )
  }

  const domain = parsed.data.domain && parsed.data.domain !== 'All' ? parsed.data.domain : undefined
  const minScore = parsed.data.minScore ?? 0
  const skill = parsed.data.skill?.trim()
  const search = parsed.data.search?.trim().toLowerCase()
  const sort = parsed.data.sort ?? 'score'
  const page = parsed.data.page ?? 1
  const pageSize = parsed.data.pageSize ?? 20

  let filtered = candidates.filter((candidate) => candidate.isPublic)
    .filter((candidate) => !domain || candidate.domain === domain)
    .filter((candidate) => candidate.score >= minScore)
    .filter((candidate) => !skill || candidate.topSkills.some((topSkill) => topSkill.toLowerCase().includes(skill.toLowerCase())))
    .filter((candidate) => {
      if (!search) return true
      return (
        candidate.name.toLowerCase().includes(search) ||
        candidate.role.toLowerCase().includes(search) ||
        candidate.topSkills.some((topSkill) => topSkill.toLowerCase().includes(search))
      )
    })

  filtered = filtered.sort((a, b) => {
    if (sort === 'completion') return b.roadmapPercent - a.roadmapPercent
    if (sort === 'verified') return b.verifiedSkillsCount - a.verifiedSkillsCount
    return b.score - a.score
  })

  const total = filtered.length
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  return NextResponse.json<ApiResponse<typeof paged>>({
    data: paged,
  })
}

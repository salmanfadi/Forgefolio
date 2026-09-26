import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse } from '@skillpath/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain')
  const minScore = Number(searchParams.get('minScore') || 0)

  // Public candidate directory list (Strict rule: NO email address in any object)
  const candidates = [
    {
      id: 'usr-1',
      username: 'alex_dev',
      name: 'Alex Sharma',
      role: 'Frontend Developer',
      domain: 'Frontend Development',
      score: 78.5,
      roadmapPercent: 60,
      topSkills: ['JavaScript ES6+', 'React.js', 'TypeScript'],
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
      topSkills: ['Node.js', 'PostgreSQL', 'Prisma ORM', 'Redis'],
      isPublic: true,
    },
  ].filter((c) => {
    const matchDomain = !domain || domain === 'All' || c.domain === domain
    const matchScore = c.score >= minScore
    return matchDomain && matchScore
  })

  return NextResponse.json<ApiResponse<typeof candidates>>({
    data: candidates,
  })
}

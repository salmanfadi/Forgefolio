import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { buildRoadmapOverview, type RoadmapContent, type RoadmapProgressSummary } from './roadmaps'

describe('buildRoadmapOverview', () => {
  it('computes per-module status and completion from actual roadmap data', () => {
    const roadmap: RoadmapContent = {
      slug: 'frontend-developer',
      title: 'Frontend Engineering Roadmap',
      domain: 'Frontend Development',
      description: 'Example roadmap',
      version: '1.0.0',
      isPublished: true,
      modules: [
        {
          id: 'module-1',
          title: 'Module 1',
          orderIndex: 1,
          steps: [
            {
              id: 'step-1',
              title: 'Step 1',
              orderIndex: 1,
              theoryContent: [{ type: 'docs', title: 'Intro', url: 'https://example.com', description: 'Desc' }],
              practicalContent: [{ type: 'build', title: 'Practice', description: 'Do it', difficulty: 'easy' }],
            },
            {
              id: 'step-2',
              title: 'Step 2',
              orderIndex: 2,
              theoryContent: [{ type: 'docs', title: 'Intro', url: 'https://example.com', description: 'Desc' }],
              practicalContent: [{ type: 'build', title: 'Practice', description: 'Do it', difficulty: 'easy' }],
            },
          ],
        },
        {
          id: 'module-2',
          title: 'Module 2',
          orderIndex: 2,
          steps: [
            {
              id: 'step-3',
              title: 'Step 3',
              orderIndex: 1,
              theoryContent: [{ type: 'docs', title: 'Intro', url: 'https://example.com', description: 'Desc' }],
              practicalContent: [{ type: 'build', title: 'Practice', description: 'Do it', difficulty: 'easy' }],
            },
          ],
        },
      ],
    }

    const progress: RoadmapProgressSummary = {
      slug: 'frontend-developer',
      userId: 'learner-123',
      completedSteps: 2,
      totalSteps: 3,
      completionPercentage: 67,
      completedStepIds: ['step-1', 'step-3'],
    }

    const overview = buildRoadmapOverview(roadmap, progress)

    assert.equal(overview.completionPercentage, 67)
    assert.equal(overview.modules[0].status, 'active')
    assert.equal(overview.modules[0].completedSteps, 1)
    assert.equal(overview.modules[1].status, 'completed')
    assert.equal(overview.modules[1].completedSteps, 1)
  })
})

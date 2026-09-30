import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, PlayCircle, Lock, ArrowRight } from 'lucide-react'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'
import { buildRoadmapOverview, type RoadmapContent, type RoadmapProgressSummary, type RoadmapOverviewSummary } from '@/lib/roadmaps'

const fallbackOverview: RoadmapOverviewSummary = {
  slug: 'frontend-developer',
  title: 'Frontend Engineering Roadmap',
  description: 'Master modern frontend skills with a structured step-by-step progression.',
  completionPercentage: 60,
  modules: [
    { id: 'fe-mod-1', title: 'Module 1: Web Fundamentals (HTML5, CSS3, Flexbox & Grid)', completedSteps: 2, totalSteps: 2, status: 'completed' },
    { id: 'fe-mod-2', title: 'Module 2: Modern JavaScript (ES6+, Closures, Async)', completedSteps: 1, totalSteps: 2, status: 'active' },
    { id: 'fe-mod-3', title: 'Module 3: React & Next.js App Router', completedSteps: 0, totalSteps: 1, status: 'locked' },
  ],
}

export const RoadmapOverview: React.FC = () => {
  const [overview, setOverview] = useState<RoadmapOverviewSummary | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      fetch('/api/roadmaps/frontend-developer', { signal: controller.signal }),
      fetch('/api/roadmaps/frontend-developer/progress?userId=learner-123', { signal: controller.signal }),
    ])
      .then(async ([roadmapResponse, progressResponse]) => {
        const roadmapPayload = await roadmapResponse.json()
        const progressPayload = await progressResponse.json()
        const roadmap = roadmapPayload?.data as RoadmapContent | undefined
        const progress = progressPayload?.data as RoadmapProgressSummary | undefined

        if (roadmap && progress) {
          setOverview(buildRoadmapOverview(roadmap, progress))
        }
      })
      .catch(() => setOverview(fallbackOverview))

    return () => controller.abort()
  }, [])

  const activeOverview = overview ?? fallbackOverview
  const modules = activeOverview.modules
  const completionPercentage = activeOverview.completionPercentage
  const completedSteps = modules.reduce((total, module) => total + module.completedSteps, 0)
  const totalSteps = modules.reduce((total, module) => total + module.totalSteps, 0)

  return (
    <section
      aria-labelledby="roadmap-heading"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: 'var(--sp-24)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-24)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 id="roadmap-heading" style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
            {activeOverview.title}
          </h2>
          <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
            Overall progress: {completedSteps} of {totalSteps} steps completed ({completionPercentage}%)
          </p>
        </div>
        <Link
          href="/roadmap/frontend-developer"
          style={{
            fontSize: 'var(--type-sm)',
            color: 'var(--txt-accent)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--sp-4)',
            fontWeight: 'var(--weight-medium)',
          }}
        >
          View Full Roadmap <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <ProgressBar value={completionPercentage} label="Frontend Roadmap Progress" size="md" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
        {modules.map((mod) => {
          const isDone = mod.status === 'completed'
          const isActive = mod.status === 'active'
          return (
            <div
              key={mod.id}
              style={{
                minHeight: '56px',
                padding: 'var(--sp-12) var(--sp-16)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--bg-primary)' : 'var(--bg-surface)',
                border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--sp-16)',
                opacity: mod.status === 'locked' ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-16)', flex: 1 }}>
                <div
                  style={{
                    color: isDone ? 'var(--tok-success)' : isActive ? 'var(--tok-primary)' : 'var(--txt-tertiary)',
                  }}
                  aria-hidden="true"
                >
                  {isDone ? <CheckCircle2 size={20} /> : isActive ? <PlayCircle size={20} /> : <Lock size={20} />}
                </div>
                <span style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                  {mod.title}
                </span>
              </div>

              <div style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)', flexShrink: 0 }}>
                {mod.completedSteps} / {mod.totalSteps} Steps
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

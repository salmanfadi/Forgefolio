import React from 'react'
import { Link } from '@/lib/next-compat'
import { CheckCircle2, PlayCircle, Lock, ArrowRight } from 'lucide-react'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'

export interface ModuleItem {
  id: string
  title: string
  completedSteps: number
  totalSteps: number
  status: 'completed' | 'active' | 'locked'
}

export const RoadmapOverview: React.FC = () => {
  const modules: ModuleItem[] = [
    {
      id: 'fe-mod-1',
      title: 'Module 1: Web Fundamentals (HTML5, CSS3, Flexbox & Grid)',
      completedSteps: 2,
      totalSteps: 2,
      status: 'completed',
    },
    {
      id: 'fe-mod-2',
      title: 'Module 2: Modern JavaScript (ES6+, Closures, Async)',
      completedSteps: 1,
      totalSteps: 2,
      status: 'active',
    },
    {
      id: 'fe-mod-3',
      title: 'Module 3: React & Next.js App Router',
      completedSteps: 0,
      totalSteps: 1,
      status: 'locked',
    },
  ]

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
            Frontend Engineering Roadmap
          </h2>
          <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
            Overall progress: 3 of 5 steps completed (60%)
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

      <ProgressBar value={60} label="Frontend Roadmap Progress" size="md" />

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

'use client'

import React from 'react'
import { Link, useParams } from '@/lib/next-compat'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'
import { CheckCircle2, PlayCircle, Lock, ArrowRight, BookOpen, Code } from 'lucide-react'

type RoadmapStep = {
  id: string
  title: string
  type: 'theory' | 'practice' | 'build'
  completed: boolean
  isNext?: boolean
  locked?: boolean
}

type RoadmapModule = {
  id: string
  title: string
  steps: RoadmapStep[]
}

export default function RoadmapDetailPage() {
  const params = useParams()
  const slug = params?.slug as string || 'frontend-developer'

  const roadmapData: { title: string; description: string; modules: RoadmapModule[] } = {
    title: 'Frontend Engineering Roadmap',
    description: 'Master modern HTML/CSS, JavaScript ES6+, React, Next.js, TypeScript, state management, web performance, and responsive UI design.',
    modules: [
      {
        id: 'fe-mod-1',
        title: 'Module 1: Web Fundamentals (HTML5, CSS3, Flexbox & Grid)',
        steps: [
          { id: 'fe-step-1', title: 'Semantic HTML5 & Accessibility (WCAG 2.2)', type: 'theory', completed: true },
          { id: 'fe-step-2', title: 'CSS3 Layouts: Flexbox & Grid Deep Dive', type: 'practice', completed: true },
        ],
      },
      {
        id: 'fe-mod-2',
        title: 'Module 2: Modern JavaScript (ES6+)',
        steps: [
          { id: 'fe-step-3', title: 'JavaScript: Closures, Scope & Execution Context', type: 'build', completed: false, isNext: true },
          { id: 'fe-step-4', title: 'Asynchronous JS: Promises, Async/Await & Event Loop', type: 'theory', completed: false },
        ],
      },
      {
        id: 'fe-mod-3',
        title: 'Module 3: React & Next.js App Router',
        steps: [
          { id: 'fe-step-5', title: 'React Server Components & Next.js 14 Fundamentals', type: 'build', completed: false, locked: true },
        ],
      },
    ],
  }

  return (
    <AppLayout title={roadmapData.title} subtitle="Complete step-by-step module breakdown">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        
        {/* Top Overview Box */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: 'var(--sp-24)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-16)',
          }}
        >
          <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', lineHeight: 'var(--lh-base)' }}>
            {roadmapData.description}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
              <span>Completion Status</span>
              <span style={{ fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>60% Completed (2 of 5 Steps)</span>
            </div>
            <ProgressBar value={60} size="md" label="Roadmap Completion" />
          </div>
        </div>

        {/* Modules Accordion / List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
          {roadmapData.modules.map((m, mIdx) => (
            <div
              key={m.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: 'var(--sp-16) var(--sp-24)',
                  backgroundColor: 'var(--bg-overlay)',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontSize: 'var(--type-base)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--txt-primary)',
                }}
              >
                {m.title}
              </div>

              <div style={{ padding: 'var(--sp-16)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
                {m.steps.map((step) => (
                  <div
                    key={step.id}
                    style={{
                      minHeight: '52px',
                      padding: 'var(--sp-8) var(--sp-16)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: step.isNext ? 'var(--bg-primary)' : 'var(--bg-surface)',
                      border: `1px solid ${step.isNext ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--sp-16)',
                      opacity: step.locked ? 0.5 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-16)', flex: 1 }}>
                      <div
                        style={{
                          color: step.completed ? 'var(--tok-success)' : step.isNext ? 'var(--tok-primary)' : 'var(--txt-tertiary)',
                        }}
                        aria-hidden="true"
                      >
                        {step.completed ? <CheckCircle2 size={20} /> : step.isNext ? <PlayCircle size={20} /> : <Lock size={20} />}
                      </div>
                      <span style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                        {step.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
                      <Badge variant={step.type === 'theory' ? 'info' : step.type === 'build' ? 'build' : 'practice'}>
                        {step.type.toUpperCase()}
                      </Badge>
                      {!step.locked && (
                        <Link href={`/roadmap/${slug}/${step.id}`} style={{ textDecoration: 'none' }}>
                          <Button variant={step.isNext ? 'primary' : 'secondary'} size="sm" icon={<ArrowRight size={14} />}>
                            {step.completed ? 'Review' : step.isNext ? 'Start Step' : 'View'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

import React from 'react'
import Link from 'next/link'
import { PlayCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'

export interface CtaBandProps {
  currentModule: string
  currentStep: string
  stepIndex: number
  totalSteps: number
  estimatedTime: string
  stepSlug: string
  roadmapSlug: string
}

export const CtaBand: React.FC<CtaBandProps> = ({
  currentModule = 'Module 3: Modern JavaScript',
  currentStep = 'JavaScript: Closures, Scope & Execution Context',
  stepIndex = 3,
  totalSteps = 5,
  estimatedTime = '25 min',
  roadmapSlug = 'frontend-developer',
  stepSlug = 'fe-step-3',
}) => {
  return (
    <section
      aria-label="Current Learning Task"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-accent)',
        padding: 'var(--sp-24)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--sp-24)',
        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.05)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--sp-16)', alignItems: 'center', minWidth: '280px', flex: 1 }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--tok-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <PlayCircle size={24} aria-hidden="true" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)' }}>
            <Badge variant="build">Next Up</Badge>
            <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
              {currentModule} · Step {stepIndex} of {totalSteps} · Est. {estimatedTime}
            </span>
          </div>
          <h2 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
            Continue: {currentStep}
          </h2>
        </div>
      </div>

      {/* THIS IS THE ONLY FILLED PRIMARY BUTTON ON THE ENTIRE SCREEN */}
      <Link href={`/roadmap/${roadmapSlug}/${stepSlug}`} style={{ textDecoration: 'none' }}>
        <Button variant="primary" icon={<ArrowRight size={18} />}>
          Continue Learning
        </Button>
      </Link>
    </section>
  )
}

import React from 'react'
import type { ScoreBreakdown } from '@skillpath/types'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'

export interface ScoreCardProps {
  totalScore: number
  breakdown: ScoreBreakdown
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ totalScore = 78.5, breakdown }) => {
  const items = [
    { label: 'Roadmap Completion', value: breakdown?.roadmapCompletion ?? 80, weight: '20%' },
    { label: 'Verified Skills', value: breakdown?.verifiedSkills ?? 75, weight: '25%' },
    { label: 'GitHub Activity', value: breakdown?.githubActivity ?? 85, weight: '15%' },
    { label: 'LeetCode Stats', value: breakdown?.leetcodeStats ?? 60, weight: '10%' },
    { label: 'Mentor Ratings', value: breakdown?.mentorRatings ?? 90, weight: '20%' },
    { label: 'Project Quality', value: breakdown?.projectQuality ?? 70, weight: '10%' },
  ]

  return (
    <section
      aria-labelledby="score-heading"
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
          <h2 id="score-heading" style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
            Employability Score
          </h2>
          <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
            Real-time market readiness metric
          </p>
        </div>
        <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>
          Updated 10m ago
        </span>
      </div>

      {/* Ring / Circular Display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-24)' }}>
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: 'var(--radius-full)',
            border: '6px solid var(--tok-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-primary)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 'var(--type-xl)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
            {totalScore}
          </span>
          <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
            / 100
          </span>
        </div>

        <div>
          <div style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
            High Employability Status
          </div>
          <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)', marginTop: 'var(--sp-4)' }}>
            Top 15% of active graduates. Eligible for priority referrals by working professionals.
          </p>
        </div>
      </div>

      {/* Breakdown list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
        <span style={{ fontSize: 'var(--type-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-tertiary)' }}>
          WEIGHTED BREAKDOWN
        </span>

        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--type-xs)' }}>
              <span style={{ color: 'var(--txt-secondary)' }}>
                {item.label} <span style={{ color: 'var(--txt-tertiary)' }}>({item.weight})</span>
              </span>
              <span style={{ color: 'var(--txt-primary)', fontWeight: 'var(--weight-medium)' }}>
                {item.value}/100
              </span>
            </div>
            <ProgressBar value={item.value} size="sm" label={`${item.label} score`} />
          </div>
        ))}
      </div>
    </section>
  )
}

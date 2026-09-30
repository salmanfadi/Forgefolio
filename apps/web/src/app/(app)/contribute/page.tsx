'use client'

import React, { useEffect, useState } from 'react'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { EmptyState } from '@/shared/components/ui/EmptyState'

type ContributionItem = {
  id: string
  title: string
  roadmapSlug: string
  type: 'add_resource' | 'edit_step' | 'new_module'
  status: 'OPEN' | 'APPROVED' | 'REJECTED'
  submittedBy: string
  createdAt: string
}

type RoadmapOption = {
  slug: string
  title: string
}

export default function ContributePage() {
  const [items, setItems] = useState<ContributionItem[]>([])
  const [roadmaps, setRoadmaps] = useState<RoadmapOption[]>([])
  const [roadmapSlug, setRoadmapSlug] = useState('frontend-developer')
  const [type, setType] = useState<ContributionItem['type']>('add_resource')
  const [summary, setSummary] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/contribute')
      .then((response) => response.json())
      .then((payload) => setItems(Array.isArray(payload?.data) ? payload.data : []))
      .catch(() => setItems([]))
    fetch('/api/roadmaps')
      .then((response) => response.json())
      .then((payload) => setRoadmaps(Array.isArray(payload?.data) ? payload.data : []))
      .catch(() => setRoadmaps([]))
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (summary.trim().length < 10) {
      setFormError('Summary must be at least 10 characters.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/roadmaps/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmapSlug, type, summary: summary.trim() }),
      })
      const payload = await response.json()

      if (!response.ok) {
        setFormError(payload?.error?.message ?? 'Could not submit the contribution.')
        return
      }

      setSummary('')
      const refreshed = await fetch('/api/contribute').then((res) => res.json())
      setItems(Array.isArray(refreshed?.data) ? refreshed.data : [])
    } catch {
      setFormError('Network error — please retry.')
    } finally {
      setSubmitting(false)
    }
  }

  const openCount = items.filter((item) => item.status === 'OPEN').length
  const approvedCount = items.filter((item) => item.status === 'APPROVED').length

  return (
    <AppLayout title="Roadmap Contributions" subtitle="Propose community-curated improvements and review open submissions">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        <form
          data-testid="contribution-create-form"
          onSubmit={handleSubmit}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-16)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <label htmlFor="contribution-roadmap" style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                Roadmap
              </label>
              <select
                id="contribution-roadmap"
                data-testid="contribution-roadmap-select"
                value={roadmapSlug}
                onChange={(event) => setRoadmapSlug(event.target.value)}
                style={{
                  minHeight: '44px',
                  padding: 'var(--sp-8) var(--sp-16)',
                  fontSize: 'var(--type-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--txt-primary)',
                }}
              >
                {roadmaps.map((roadmap) => (
                  <option key={roadmap.slug} value={roadmap.slug}>
                    {roadmap.title}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <label htmlFor="contribution-type" style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                Type
              </label>
              <select
                id="contribution-type"
                data-testid="contribution-type-select"
                value={type}
                onChange={(event) => setType(event.target.value as ContributionItem['type'])}
                style={{
                  minHeight: '44px',
                  padding: 'var(--sp-8) var(--sp-16)',
                  fontSize: 'var(--type-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--txt-primary)',
                }}
              >
                <option value="add_resource">add_resource</option>
                <option value="edit_step">edit_step</option>
                <option value="new_module">new_module</option>
              </select>
            </div>
          </div>
          <Input
            data-testid="contribution-summary-input"
            label="Summary"
            required
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="What are you adding or improving, and why is it valuable for learners?"
          />
          {formError && (
            <span data-testid="contribution-form-error" style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-danger)' }} role="alert">
              {formError}
            </span>
          )}
          <div>
            <Button data-testid="contribution-submit-button" type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Contribution'}
            </Button>
          </div>
        </form>

        <div style={{ display: 'flex', gap: 'var(--sp-12)', flexWrap: 'wrap' }}>
          <Badge variant="info">{openCount} Open</Badge>
          <Badge variant="success">{approvedCount} Approved</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
          {items.length === 0 ? (
            <EmptyState
              title="No contributions yet"
              description="Be the first to propose a roadmap improvement with the form above."
            />
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                data-testid="contribution-card"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  padding: 'var(--sp-24)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 'var(--sp-16)',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)' }}>
                    <span style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>{item.title}</span>
                    <Badge variant={item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'danger' : 'info'}>{item.status}</Badge>
                  </div>
                  <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>{item.roadmapSlug} · {item.type} · Submitted by {item.submittedBy}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
                  <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>{new Date(item.createdAt).toLocaleDateString('en-IN')}</span>
                  <Button variant="secondary" size="sm">Review</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  )
}

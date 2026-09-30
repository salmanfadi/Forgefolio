'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'

type ReviewDetail = {
  id: string
  learnerName: string
  skill: string
  domain: string
  status: 'PENDING' | 'AI_REVIEW' | 'CHALLENGE_ISSUED' | 'COMPLETED' | 'REJECTED'
  score: number
  submittedAt: string
  githubUrl?: string | null
  liveUrl?: string | null
  description: string
  mentorFeedback: string
}

export default function MentorReviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = params?.requestId as string
  const [item, setItem] = useState<ReviewDetail | null>(null)
  const [feedback, setFeedback] = useState('Strong portfolio, concise architecture notes, and a clear GitHub trail. This is a strong mentor verification candidate.')
  const [challengeDescription, setChallengeDescription] = useState('Build a reusable async memoization utility and explain trade-offs in the code.')
  const [decisionSummary, setDecisionSummary] = useState<string | null>(null)

  useEffect(() => {
    if (!requestId) return

    fetch(`/api/mentors/${requestId}`)
      .then((response) => response.json())
      .then((payload) => setItem(payload?.data ?? null))
      .catch(() => setItem(null))
  }, [requestId])

  const handleAction = async (action: 'accept' | 'reject' | 'challenge') => {
    const response = await fetch(`/api/mentors/${requestId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        feedback,
        challengeDescription,
      }),
    })

    if (response.ok) {
      const payload = await response.json()
      const actionLabel = action === 'accept' ? 'Accepted' : action === 'reject' ? 'Rejected' : 'Challenge issued'
      setDecisionSummary(`${actionLabel}: ${payload?.data?.mentorFeedback ?? feedback}`)
      router.push('/mentors')
    }
  }

  if (!item) {
    return <AppLayout title="Review Request" subtitle="Loading verification detail"><div style={{ padding: 'var(--sp-24)' }}>Loading…</div></AppLayout>
  }

  return (
    <AppLayout title={item.skill} subtitle={`${item.learnerName} · ${item.domain}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
            <span style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-primary)' }}>{item.learnerName}</span>
            <Badge variant="info">{item.status}</Badge>
          </div>
          <span style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-accent)', fontWeight: 'var(--weight-medium)' }}>{item.score}/100</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-16)' }}>
          <section style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--sp-24)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--sp-12)' }}>Evidence</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
              <a href={item.githubUrl ?? '#'} rel="noreferrer" target="_blank" style={{ color: 'var(--txt-accent)', textDecoration: 'none' }}>GitHub Repo</a>
              {item.liveUrl && <a href={item.liveUrl} rel="noreferrer" target="_blank" style={{ color: 'var(--txt-accent)', textDecoration: 'none' }}>Live Demo</a>}
              <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>Submitted {new Date(item.submittedAt).toLocaleDateString('en-IN')}</span>
            </div>
          </section>

          <section style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--sp-24)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--sp-12)' }}>Project Summary</h2>
            <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', lineHeight: '1.6' }}>{item.description}</p>
          </section>
        </div>

        <section style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--sp-24)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
          <label style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)' }}>Mentor Feedback</label>
          <textarea
            rows={4}
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', padding: 'var(--sp-12)', fontFamily: 'inherit', fontSize: 'var(--type-sm)', backgroundColor: 'var(--bg-base)', color: 'var(--txt-primary)' }}
          />

          <label style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)' }}>Challenge Description</label>
          <textarea
            rows={3}
            value={challengeDescription}
            onChange={(event) => setChallengeDescription(event.target.value)}
            style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', padding: 'var(--sp-12)', fontFamily: 'inherit', fontSize: 'var(--type-sm)', backgroundColor: 'var(--bg-base)', color: 'var(--txt-primary)' }}
          />

          {decisionSummary && (
            <div style={{ padding: 'var(--sp-12)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--tok-success-bg)', color: 'var(--txt-success)', fontSize: 'var(--type-sm)' }}>
              {decisionSummary}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--sp-12)', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={() => handleAction('accept')}>Accept</Button>
            <Button variant="secondary" onClick={() => handleAction('challenge')}>Issue Challenge</Button>
            <Button variant="danger" onClick={() => handleAction('reject')}>Reject</Button>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}

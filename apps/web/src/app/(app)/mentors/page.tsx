'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'

type QueueItem = {
  id: string
  learnerName: string
  skill: string
  domain: string
  status: 'PENDING' | 'AI_REVIEW' | 'CHALLENGE_ISSUED' | 'COMPLETED' | 'REJECTED'
  score: number
  submittedAt: string
  githubUrl?: string | null
  liveUrl?: string | null
}

export default function MentorsPage() {
  const [items, setItems] = useState<QueueItem[]>([])
  const [domain, setDomain] = useState('All')

  useEffect(() => {
    const params = new URLSearchParams()
    if (domain !== 'All') params.set('domain', domain)

    fetch(`/api/mentors/queue?${params.toString()}`)
      .then((response) => response.json())
      .then((payload) => setItems(Array.isArray(payload?.data) ? payload.data : []))
      .catch(() => setItems([]))
  }, [domain])

  const pendingCount = items.filter((item) => item.status === 'PENDING' || item.status === 'AI_REVIEW').length
  const completedCount = items.filter((item) => item.status === 'COMPLETED').length
  const challengeCount = items.filter((item) => item.status === 'CHALLENGE_ISSUED').length

  return (
    <AppLayout title="Mentor Review Queue" subtitle="Review verification requests, issue challenges, and track completed approvals">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-16)' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-12)', flexWrap: 'wrap' }}>
            <Badge variant="info">{pendingCount} Pending</Badge>
            <Badge variant="success">{completedCount} Completed</Badge>
            <Badge variant="warning">{challengeCount} Challenges Issued</Badge>
          </div>

          <select
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            style={{
              minHeight: '44px',
              padding: '0 var(--sp-16)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--txt-primary)',
            }}
          >
            <option value="All">All Domains</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="Data Analytics">Data Analytics</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--sp-24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--sp-16)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)' }}>
                  <span style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>{item.learnerName}</span>
                  <Badge variant={item.status === 'COMPLETED' ? 'success' : item.status === 'REJECTED' ? 'danger' : 'info'}>{item.status}</Badge>
                </div>
                <span style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)' }}>{item.skill}</span>
                <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>{item.domain} · Submitted {new Date(item.submittedAt).toLocaleDateString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-accent)', fontWeight: 'var(--weight-medium)' }}>{item.score}/100</span>
                <Link href={`/mentors/${item.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="sm">Review</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

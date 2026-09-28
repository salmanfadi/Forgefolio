'use client'

import React, { useEffect, useState } from 'react'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'

type ContributionItem = {
  id: string
  title: string
  roadmapSlug: string
  type: 'add_resource' | 'edit_step' | 'new_module'
  status: 'OPEN' | 'APPROVED' | 'REJECTED'
  submittedBy: string
  createdAt: string
}

export default function ContributePage() {
  const [items, setItems] = useState<ContributionItem[]>([])

  useEffect(() => {
    fetch('/api/contribute')
      .then((response) => response.json())
      .then((payload) => setItems(Array.isArray(payload?.data) ? payload.data : []))
      .catch(() => setItems([]))
  }, [])

  return (
    <AppLayout title="Roadmap Contributions" subtitle="Review open submissions and approve community-curated learning improvements">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-12)', flexWrap: 'wrap' }}>
          <Badge variant="info">2 Open</Badge>
          <Badge variant="success">1 Approved</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
          {items.map((item) => (
            <div
              key={item.id}
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
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

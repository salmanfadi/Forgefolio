'use client'

import React, { useEffect, useState } from 'react'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: 'Alex Sharma',
    username: 'alex_dev',
    bio: 'Passionate about React, accessibility, and shipping dependable user experiences.',
    avatarUrl: '',
    isPublic: true,
    showReferralTab: true,
  })
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then((response) => response.json())
      .then((payload) => {
        if (payload?.data) {
          setForm((prev) => ({ ...prev, ...payload.data }))
        }
      })
      .catch(() => undefined)
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId: 'learner-123' }),
    })

    if (!response.ok) {
      setSavedMessage('Unable to save settings right now.')
      return
    }

    setSavedMessage('Settings saved successfully.')
  }

  return (
    <AppLayout title="Account Settings" subtitle="Manage your public profile and privacy preferences">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        <section
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
          <h2 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
            Profile details
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-16)' }}>
            <Input
              label="Full name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <Input
              label="Username"
              value={form.username}
              onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            />
          </div>

          <Input
            label="Avatar URL"
            value={form.avatarUrl}
            placeholder="https://example.com/avatar.png"
            onChange={(event) => setForm((prev) => ({ ...prev, avatarUrl: event.target.value }))}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <label style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
              Bio
            </label>
            <textarea
              value={form.bio}
              rows={5}
              onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
              style={{
                resize: 'vertical',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--txt-primary)',
                padding: 'var(--sp-12) var(--sp-16)',
                fontSize: 'var(--type-sm)',
              }}
            />
          </div>
        </section>

        <section
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
          <h2 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
            Privacy controls
          </h2>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-12)', color: 'var(--txt-primary)' }}>
            <span>Public profile visibility</span>
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(event) => setForm((prev) => ({ ...prev, isPublic: event.target.checked }))}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-12)', color: 'var(--txt-primary)' }}>
            <span>Show referral tab on public passport</span>
            <input
              type="checkbox"
              checked={form.showReferralTab}
              onChange={(event) => setForm((prev) => ({ ...prev, showReferralTab: event.target.checked }))}
            />
          </label>
        </section>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-16)', flexWrap: 'wrap' }}>
          <Button type="submit" variant="primary">Save settings</Button>
          {savedMessage && (
            <span style={{ fontSize: 'var(--type-xs)', color: savedMessage.includes('Unable') ? 'var(--txt-danger)' : 'var(--txt-success)' }}>
              {savedMessage}
            </span>
          )}
        </div>
      </form>
    </AppLayout>
  )
}

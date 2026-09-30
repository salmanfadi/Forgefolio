'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { Skeleton } from '@/shared/components/ui/Skeleton'

type ProjectItem = {
  id: string
  title: string
  description: string
  repoUrl: string | null
  liveUrl: string | null
  aiQualityScore: number | null
  createdAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/projects')
      const payload = await response.json()
      setProjects(Array.isArray(payload?.data) ? payload.data : [])
    } catch {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (title.trim().length < 3) {
      setFormError('Title must be at least 3 characters.')
      return
    }
    if (description.trim().length < 10) {
      setFormError('Description must be at least 10 characters.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), repoUrl, liveUrl }),
      })
      const payload = await response.json()

      if (!response.ok) {
        setFormError(payload?.error?.message ?? 'Could not save the project.')
        return
      }

      setTitle('')
      setDescription('')
      setRepoUrl('')
      setLiveUrl('')
      await loadProjects()
    } catch {
      setFormError('Network error — please retry.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout title="My Projects" subtitle="Showcase shipped work on your Skill Passport">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        <form
          data-testid="project-create-form"
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
            <Input
              data-testid="project-title-input"
              label="Title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Realtime chat app with Next.js"
            />
            <Input
              data-testid="project-repo-url-input"
              label="Repository URL"
              type="url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/you/repo"
            />
            <Input
              data-testid="project-live-url-input"
              label="Live URL"
              type="url"
              value={liveUrl}
              onChange={(event) => setLiveUrl(event.target.value)}
              placeholder="https://your-demo.app"
            />
          </div>
          <Input
            data-testid="project-description-input"
            label="Description"
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What did you build, and what problems does it solve?"
          />
          {formError && (
            <span data-testid="project-form-error" style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-danger)' }} role="alert">
              {formError}
            </span>
          )}
          <div>
            <Button data-testid="project-submit-button" type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Add Project'}
            </Button>
          </div>
        </form>

        {loading ? (
          <Skeleton height="72px" />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Add your first shipped project above — it appears on your public Skill Passport."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                data-testid="project-card"
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
                    <span style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                      {project.title}
                    </span>
                    {project.aiQualityScore != null && <Badge variant="info">AI Quality {project.aiQualityScore}</Badge>}
                  </div>
                  <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>{project.description}</span>
                  <span style={{ display: 'flex', gap: 'var(--sp-12)', fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--txt-accent)' }}>
                        Repository
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--txt-accent)' }}>
                        Live demo
                      </a>
                    )}
                  </span>
                </div>
                <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>
                  {new Date(project.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

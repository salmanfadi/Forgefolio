'use client'

import React, { useState } from 'react'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Badge } from '@/shared/components/ui/Badge'
import { FolderGit2, Github, ExternalLink, Plus, Sparkles } from 'lucide-react'

type PortfolioProject = {
  id: string
  title: string
  description: string
  repoUrl: string | null
  liveUrl: string | null
  aiQualityScore: number
  createdAt: string
}

export default function ProjectsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')

  const [projects, setProjects] = useState<PortfolioProject[]>([
    {
      id: 'proj-1',
      title: 'DevBoard: Developer Task & Sprint Planner',
      description: 'A Next.js 14 App Router task manager with drag-and-drop Kanban columns, optimistic updates, and PostgreSQL Prisma integration.',
      repoUrl: 'https://github.com/alex-sharma/devboard',
      liveUrl: 'https://devboard.vercel.app',
      aiQualityScore: 88,
      createdAt: 'Sep 20, 2026',
    },
    {
      id: 'proj-2',
      title: 'Resilient Fetch Utility & Event Emitter',
      description: 'A zero-dependency TypeScript library implementing exponential backoff retries, abort signal timeouts, and type-safe pub/sub closures.',
      repoUrl: 'https://github.com/alex-sharma/resilient-fetch',
      liveUrl: null,
      aiQualityScore: 94,
      createdAt: 'Sep 12, 2026',
    },
  ])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    const newP = {
      id: `proj-${Date.now()}`,
      title,
      description: desc,
      repoUrl: repoUrl || null,
      liveUrl: liveUrl || null,
      aiQualityScore: 85,
      createdAt: 'Just now',
    }
    setProjects([newP, ...projects])
    setShowAddModal(false)
    setTitle('')
    setDesc('')
    setRepoUrl('')
    setLiveUrl('')
  }

  return (
    <AppLayout title="My Portfolio Projects" subtitle="Showcase your verified software projects to working professionals">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        
        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
              Projects ({projects.length})
            </h2>
            <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
              Each project contributes up to 10% to your Employability Score.
            </p>
          </div>

          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
            Add New Project
          </Button>
        </div>

        {/* Add Project Form Drawer/Modal */}
        {showAddModal && (
          <form
            onSubmit={handleCreate}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-accent)',
              padding: 'var(--sp-24)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-16)',
            }}
          >
            <h3 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
              Add Portfolio Project
            </h3>

            <Input
              label="Project Title"
              placeholder="e.g. E-Commerce Microservices API"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <label style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of tech stack, architectural highlights, and problem solved..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={{
                  padding: 'var(--sp-8) var(--sp-16)',
                  fontSize: 'var(--type-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--txt-primary)',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-16)' }}>
              <Input
                label="GitHub Repository URL"
                placeholder="https://github.com/..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
              <Input
                label="Live Application URL"
                placeholder="https://app.vercel.app"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-12)' }}>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Project
              </Button>
            </div>
          </form>
        )}

        {/* Projects List Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--sp-24)' }}>
          {projects.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                padding: 'var(--sp-24)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--sp-16)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge variant="build" icon={<Sparkles size={14} />}>
                    AI Quality Score: {p.aiQualityScore}/100
                  </Badge>
                  <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>{p.createdAt}</span>
                </div>

                <h3 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                  {p.title}
                </h3>

                <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', lineHeight: 'var(--lh-base)' }}>
                  {p.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--sp-4)',
                      fontSize: 'var(--type-xs)',
                      color: 'var(--txt-primary)',
                      textDecoration: 'none',
                    }}
                  >
                    <Github size={16} /> Code Repo
                  </a>
                )}
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--sp-4)',
                      fontSize: 'var(--type-xs)',
                      color: 'var(--txt-accent)',
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  )
}

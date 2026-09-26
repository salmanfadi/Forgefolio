'use client'

import React from 'react'
import Link from 'next/link'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Compass, ArrowRight, Layers, Clock } from 'lucide-react'

export default function RoadmapsListPage() {
  const roadmaps = [
    {
      slug: 'frontend-developer',
      title: 'Frontend Engineering Roadmap',
      domain: 'Frontend Development',
      description: 'Master HTML5/CSS3, Modern JavaScript ES6+, React 18, Next.js 14 App Router, Web Performance & Accessibility.',
      modulesCount: 3,
      estWeeks: '12 weeks',
      isEnrolled: true,
      progress: 60,
    },
    {
      slug: 'backend-developer',
      title: 'Backend Systems Engineering Roadmap',
      domain: 'Backend Development',
      description: 'Master Node.js runtime, Express/Fastify, PostgreSQL query optimization, Prisma ORM, Redis caching & BullMQ queues.',
      modulesCount: 2,
      estWeeks: '14 weeks',
      isEnrolled: false,
      progress: 0,
    },
    {
      slug: 'data-analyst',
      title: 'Data Analytics & Insights Roadmap',
      domain: 'Data Analytics',
      description: 'Master Advanced SQL window functions, Python Pandas/NumPy, Cohort retention models, and Business Data Visualization.',
      modulesCount: 1,
      estWeeks: '8 weeks',
      isEnrolled: false,
      progress: 0,
    },
    {
      slug: 'data-scientist',
      title: 'Data Science & ML Engineering Roadmap',
      domain: 'Data Science',
      description: 'Master Applied Statistics, Supervised Classification & Regression, Scikit-learn, Feature Engineering and Model Deployment.',
      modulesCount: 1,
      estWeeks: '16 weeks',
      isEnrolled: false,
      progress: 0,
    },
    {
      slug: 'devops-engineer',
      title: 'DevOps & Cloud Infrastructure Roadmap',
      domain: 'DevOps Engineering',
      description: 'Master Docker containerization, Kubernetes cluster orchestration, GitHub Actions CI/CD, Terraform, and Monitoring.',
      modulesCount: 1,
      estWeeks: '10 weeks',
      isEnrolled: false,
      progress: 0,
    },
  ]

  return (
    <AppLayout title="Career Roadmaps" subtitle="Structured community-maintained learning paths">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--sp-24)' }}>
          {roadmaps.map((r) => (
            <div
              key={r.slug}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${r.isEnrolled ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                padding: 'var(--sp-24)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--sp-20)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge variant={r.isEnrolled ? 'build' : 'default'}>
                    {r.isEnrolled ? 'Active Learning' : r.domain}
                  </Badge>
                  {r.isEnrolled && (
                    <span style={{ fontSize: 'var(--type-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-accent)' }}>
                      {r.progress}% Completed
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                  {r.title}
                </h2>

                <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', lineHeight: 'var(--lh-base)' }}>
                  {r.description}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-16)', fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                    <Layers size={14} /> {r.modulesCount} Modules
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                    <Clock size={14} /> {r.estWeeks}
                  </span>
                </div>

                <Link href={`/roadmap/${r.slug}`} style={{ textDecoration: 'none' }}>
                  <Button variant={r.isEnrolled ? 'primary' : 'secondary'} icon={<ArrowRight size={16} />}>
                    {r.isEnrolled ? 'Continue Roadmap' : 'Explore Path'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

import React from 'react'
import Link from 'next/link'
import {ShieldCheck, Compass, Users, ArrowRight, BookOpen, Code2, Award} from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { ThemeToggle } from '@/shared/components/layout/ThemeToggle'

export default function LandingPage() {
  const roadmaps = [
    { slug: 'frontend-developer', title: 'Frontend Developer', desc: 'React, Next.js, TypeScript, Web Vitals, CSS Architecture' },
    { slug: 'backend-developer', title: 'Backend Developer', desc: 'Node.js, Express, PostgreSQL, Prisma, Redis & Job Queues' },
    { slug: 'data-analyst', title: 'Data Analyst', desc: 'SQL, Python, Pandas, Matplotlib, Business Analytics & Cohorts' },
    { slug: 'data-scientist', title: 'Data Scientist', desc: 'Supervised ML, Scikit-learn, Feature Engineering, Model Ops' },
    { slug: 'devops-engineer', title: 'DevOps Engineer', desc: 'Docker, Kubernetes, CI/CD, Terraform, Cloud Infrastructure' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--txt-primary)' }}>
      {/* Header */}
      <header
        style={{
          height: '64px',
          padding: '0 var(--sp-32)',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--tok-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={22} aria-hidden="true" />
          </div>
          <span style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)' }}>Forgefolio</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-16)' }}>
          <Link href="/directory" style={{ textDecoration: 'none', color: 'var(--txt-primary)', fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)' }}>
            Referral Directory
          </Link>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Button variant="primary" icon={<ArrowRight size={16} />}>
              Open Dashboard
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: 'var(--sp-80) var(--sp-24)',
          maxWidth: '1100px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--sp-24)',
        }}
      >
        <Badge variant="build" icon={<Award size={14} />}>
          OPEN SOURCE CAREER ACCELERATOR FOR INDIA
        </Badge>

        <h1
          style={{
            fontSize: 'var(--type-3xl)',
            fontWeight: 'var(--weight-medium)',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            maxWidth: '900px',
          }}
        >
          Employment based on <span style={{ color: 'var(--tok-primary)' }}>Demonstrated Skills</span> and Verified Projects, Not Certificates.
        </h1>

        <p
          style={{
            fontSize: 'var(--type-base)',
            color: 'var(--txt-secondary)',
            maxWidth: '700px',
            lineHeight: 'var(--lh-loose)',
          }}
        >
          Forgefolio helps unemployed graduates follow structured 80% practical roadmaps, complete verified challenges, compute an Employability Score, and get discovered by working professionals for job referrals.
        </p>

        <div style={{ display: 'flex', gap: 'var(--sp-16)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg" icon={<Compass size={20} />}>
              Start Learning Free
            </Button>
          </Link>
          <Link href="/directory" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="lg" icon={<Users size={20} />}>
              Explore Candidates Directory
            </Button>
          </Link>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--sp-64) var(--sp-24)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--sp-32)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-12)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', color: 'var(--tok-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)' }}>80% Practical Roadmaps</h3>
            <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', lineHeight: 'var(--lh-base)' }}>
              Community-maintained roadmaps focused on building real software and handling production-grade edge cases.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-12)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--tok-info-bg)', color: 'var(--tok-info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={20} aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)' }}>AI & Mentor Verification</h3>
            <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', lineHeight: 'var(--lh-base)' }}>
              Submit GitHub repositories for Claude AI static analysis and Senior Mentor code reviews to verify real skills.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-12)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--tok-warning-bg)', color: 'var(--tok-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)' }}>Referral Circle</h3>
            <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', lineHeight: 'var(--lh-base)' }}>
              Verified working professionals discover candidates with high Employability Scores and initiate direct referrals.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmaps Grid */}
      <section style={{ padding: 'var(--sp-64) var(--sp-24)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-40)' }}>
          <h2 style={{ fontSize: 'var(--type-2xl)', fontWeight: 'var(--weight-medium)' }}>Career Roadmaps</h2>
          <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', marginTop: 'var(--sp-8)' }}>
            Select your target role and start building your verified Skill Passport.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--sp-24)' }}>
          {roadmaps.map((r) => (
            <div
              key={r.slug}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--sp-24)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--sp-16)',
              }}
            >
              <div>
                <h3 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)' }}>{r.title}</h3>
                <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', marginTop: 'var(--sp-8)' }}>{r.desc}</p>
              </div>
              <Link href={`/roadmap/${r.slug}`} style={{ textDecoration: 'none' }}>
                <Button variant="secondary" icon={<ArrowRight size={16} />}>
                  View Roadmap
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: 'var(--sp-32) var(--sp-24)', backgroundColor: 'var(--bg-surface)', textAlign: 'center', fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>
        © 2026 Forgefolio · Open Source Career Acceleration Platform · DPDPA 2023 Compliant
      </footer>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { Link } from '@/lib/next-compat'
import { ShieldCheck, Search, Filter, Mail, Award, CheckCircle2, ArrowRight } from 'lucide-react'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { ThemeToggle } from '@/shared/components/layout/ThemeToggle'

export default function ReferralDirectoryPage() {
  const [search, setSearch] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('All')
  const [minScore, setMinScore] = useState(70)

  const candidates = [
    {
      username: 'alex_dev',
      name: 'Alex Sharma',
      role: 'Frontend Developer',
      domain: 'Frontend Development',
      score: 78.5,
      roadmapPercent: 60,
      topSkills: ['JavaScript ES6+', 'React.js', 'TypeScript', 'CSS Grid'],
      verifiedSkillsCount: 2,
    },
    {
      username: 'priya_backend',
      name: 'Priya Verma',
      role: 'Backend Systems Engineer',
      domain: 'Backend Development',
      score: 84.0,
      roadmapPercent: 85,
      topSkills: ['Node.js', 'PostgreSQL', 'Prisma ORM', 'Redis', 'Docker'],
      verifiedSkillsCount: 4,
    },
    {
      username: 'rohit_data',
      name: 'Rohit Kumar',
      role: 'Data Analyst',
      domain: 'Data Analytics',
      score: 72.0,
      roadmapPercent: 50,
      topSkills: ['SQL Window Functions', 'Python Pandas', 'Tableau'],
      verifiedSkillsCount: 2,
    },
    {
      username: 'sneha_ml',
      name: 'Sneha Patel',
      role: 'Data Scientist',
      domain: 'Data Science',
      score: 81.5,
      roadmapPercent: 75,
      topSkills: ['Scikit-learn', 'Feature Engineering', 'Random Forest'],
      verifiedSkillsCount: 3,
    },
  ]

  const filtered = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()) || c.topSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain
    const matchesScore = c.score >= minScore
    return matchesSearch && matchesDomain && matchesScore
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--txt-primary)' }}>
      {/* Top Header */}
      <header
        style={{
          height: '64px',
          padding: '0 var(--sp-32)',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', color: 'var(--tok-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} aria-hidden="true" />
          </div>
          <span style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)' }}>Referral Circle Directory</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-16)' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="sm">
              Dashboard
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Directory Area */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: 'var(--sp-40) var(--sp-24)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-32)' }}>
        <div>
          <Badge variant="build">V2 REFERRAL CIRCLE</Badge>
          <h1 style={{ fontSize: 'var(--type-2xl)', fontWeight: 'var(--weight-medium)', marginTop: 'var(--sp-8)' }}>
            Discover Verified Talent
          </h1>
          <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', marginTop: 'var(--sp-4)' }}>
            Working professionals at top tech companies browse candidates with verified skills and initiate direct referrals.
          </p>
        </div>

        {/* Filters Bar */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: 'var(--sp-20)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'var(--sp-16)',
          }}
        >
          <div style={{ flex: 1, minWidth: '240px' }}>
            <Input
              placeholder="Search candidate name, role, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{
                minHeight: '44px',
                padding: '0 var(--sp-16)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--txt-primary)',
                fontSize: 'var(--type-sm)',
              }}
            >
              <option value="All">All Domains</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Data Science">Data Science</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)', fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
              <span>Min Score: {minScore}</span>
              <input
                type="range"
                min={50}
                max={90}
                step={5}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--sp-24)' }}>
          {filtered.map((c) => (
            <div
              key={c.username}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                padding: 'var(--sp-24)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--sp-20)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
                    <Avatar name={c.name} size="md" />
                    <div>
                      <h3 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                        {c.name}
                      </h3>
                      <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>{c.role}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-full)',
                      border: '3px solid var(--tok-primary)',
                      backgroundColor: 'var(--bg-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'var(--weight-medium)',
                      fontSize: 'var(--type-sm)',
                    }}
                  >
                    {c.score}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
                  <div style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>TOP VERIFIED SKILLS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
                    {c.topSkills.map((s, idx) => (
                      <Badge key={idx} variant="info">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--sp-16)', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
                  Roadmap: {c.roadmapPercent}% Complete
                </span>
                <Link href={`/u/${c.username}`} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />}>
                    View Passport
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

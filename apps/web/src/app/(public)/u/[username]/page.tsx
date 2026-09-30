'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {ShieldCheck, Award, Mail, Lock} from 'lucide-react'
import { Avatar } from '@/shared/components/ui/Avatar'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { ThemeToggle } from '@/shared/components/layout/ThemeToggle'

export default function SkillPassportPage() {
  const params = useParams()
  const username = params?.username as string || 'alex_dev'
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills' | 'referral'>('overview')
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [isReferralIntent, setIsReferralIntent] = useState(true)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [copyStatus, setCopyStatus] = useState('Copy link')

  const learner = {
    name: 'Alex Sharma',
    username: username,
    role: 'Frontend Engineering Learner',
    bio: 'Passionate about React 18, Next.js App Router, web performance, and building accessible UI design systems. 80% practical learning completed.',
    score: 78.5,
    github: 'https://github.com/alex-sharma',
    skills: [
      { name: 'JavaScript ES6+ & Closures', level: 'MENTOR_VERIFIED', score: 92 },
      { name: 'React.js & State Management', level: 'AI_VERIFIED', score: 85 },
      { name: 'HTML5 & CSS Grid Layouts', level: 'MENTOR_VERIFIED', score: 90 },
      { name: 'TypeScript Strict Mode', level: 'AI_VERIFIED', score: 82 },
    ],
    projects: [
      {
        title: 'DevBoard: Developer Task Planner',
        desc: 'Next.js 14 App Router task manager with drag-and-drop Kanban columns and PostgreSQL Prisma backend.',
        repoUrl: 'https://github.com/alex-sharma/devboard',
        liveUrl: 'https://devboard.vercel.app',
        aiScore: 88,
      },
      {
        title: 'Resilient Fetch Utility',
        desc: 'TypeScript library implementing exponential backoff retries and abort signal timeouts.',
        repoUrl: 'https://github.com/alex-sharma/resilient-fetch',
        liveUrl: null,
        aiScore: 94,
      },
    ],
    badges: ['First Project', 'First Verification', 'Mentor Approved', '5-Day Streak'],
    isPublic: true,
    showReferralTab: true,
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${encodeURIComponent(username)}` : ''

  const handleShare = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyStatus('Copied!')
      setTimeout(() => setCopyStatus('Copy link'), 1200)
    } catch {
      setCopyStatus('Copy unavailable')
      setTimeout(() => setCopyStatus('Copy link'), 1200)
    }
  }

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch(`/api/contact/${encodeURIComponent(username)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: contactMessage,
        isReferralIntent,
      }),
    })

    if (!response.ok) {
      return
    }

    setSentSuccess(true)
    setTimeout(() => {
      setSentSuccess(false)
      setShowContactModal(false)
      setContactMessage('')
    }, 1500)
  }

  if (!learner.isPublic) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-24)' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'var(--bg-surface)', padding: 'var(--sp-48)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <Lock size={48} style={{ color: 'var(--txt-tertiary)', marginBottom: 'var(--sp-16)' }} />
          <h1 style={{ fontSize: 'var(--type-lg)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>Profile is Private</h1>
          <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', marginTop: 'var(--sp-8)' }}>
            This learner has set their Skill Passport visibility to private.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--txt-primary)' }}>
      {/* Header */}
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
          <span style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)' }}>Forgefolio Passport</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-16)' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Container */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: 'var(--sp-40) var(--sp-24)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-32)' }}>
        
        {/* Passport Hero Banner */}
        <section
          aria-label="Learner Profile Summary"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: 'var(--sp-32)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--sp-24)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-24)', minWidth: '280px', flex: 1 }}>
            <Avatar name={learner.name} size="lg" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
                <h1 style={{ fontSize: 'var(--type-xl)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                  {learner.name}
                </h1>
                <Badge variant="build">VERIFIED PASSPORT</Badge>
              </div>
              <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-accent)', fontWeight: 'var(--weight-medium)' }}>
                {learner.role} (@{learner.username})
              </p>
              <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', marginTop: 'var(--sp-8)', maxWidth: '550px' }}>
                {learner.bio}
              </p>
            </div>
          </div>

          {/* Score Badge & Contact CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-16)' }}>
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: 'var(--radius-full)',
                border: '5px solid var(--tok-primary)',
                backgroundColor: 'var(--bg-primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 'var(--type-lg)', fontWeight: 'var(--weight-medium)' }}>{learner.score}</span>
              <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>SCORE</span>
            </div>

            {learner.showReferralTab && (
              <Button
                variant="primary"
                icon={<Mail size={16} />}
                onClick={() => setShowContactModal(true)}
              >
                Contact for Referral
              </Button>
            )}
            <Button variant="secondary" onClick={handleShare}>
              {copyStatus}
            </Button>
          </div>
        </section>

        {/* Profile Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', gap: 'var(--sp-24)' }}>
          {(['overview', 'projects', 'skills', 'referral'] as const)
            .filter((tab) => tab !== 'referral' || learner.showReferralTab)
            .map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  minHeight: '44px',
                  padding: '0 var(--sp-16)',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid var(--tok-primary)' : '3px solid transparent',
                  color: activeTab === tab ? 'var(--txt-accent)' : 'var(--txt-secondary)',
                  fontWeight: activeTab === tab ? 'var(--weight-medium)' : 'var(--weight-normal)',
                  fontSize: 'var(--type-sm)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'referral' ? 'Referral Circle' : tab}
              </button>
            ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
            
            {/* Verified Skills Grid */}
            <section style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--sp-24)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--sp-16)' }}>Verified Skills</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-16)' }}>
                {learner.skills.map((s, i) => (
                  <div key={i} style={{ padding: 'var(--sp-16)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)' }}>{s.name}</div>
                      <Badge variant={s.level === 'MENTOR_VERIFIED' ? 'success' : 'info'} className="mt-2">
                        {s.level === 'MENTOR_VERIFIED' ? 'Mentor Verified' : 'AI Verified'}
                      </Badge>
                    </div>
                    <span style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-accent)' }}>{s.score}/100</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Earned Badges Shelf */}
            <section style={{ backgroundColor: 'var(--bg-surface)', padding: 'var(--sp-24)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--sp-16)' }}>Earned Badges</h2>
              <div style={{ display: 'flex', gap: 'var(--sp-12)', flexWrap: 'wrap' }}>
                {learner.badges.map((b, i) => (
                  <Badge key={i} variant="warning" icon={<Award size={14} />}>
                    {b}
                  </Badge>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Contact Form Relay Modal for Verified Professionals */}
        {showContactModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 'var(--sp-16)' }}>
            <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-accent)', padding: 'var(--sp-24)', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
              <h2 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)' }}>
                Contact {learner.name} (Email Relay)
              </h2>
              <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
                Your message will be securely emailed to {learner.name} via server-side relay. Learner email address is never exposed.
              </p>

              {sentSuccess ? (
                <div style={{ padding: 'var(--sp-16)', backgroundColor: 'var(--tok-success-bg)', color: 'var(--txt-success)', borderRadius: 'var(--radius-md)' }}>
                  Message sent securely via Forgefolio Relay!
                </div>
              ) : (
                <form onSubmit={handleSendContact} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                    <label style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)' }}>Message to Candidate</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Hi Alex, I saw your verified React & TypeScript project on Forgefolio and would like to refer you for a Frontend Engineer role at..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      style={{ padding: 'var(--sp-12)', fontSize: 'var(--type-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-base)', color: 'var(--txt-primary)', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)' }}>
                    <input
                      type="checkbox"
                      id="intent"
                      checked={isReferralIntent}
                      onChange={(e) => setIsReferralIntent(e.target.checked)}
                    />
                    <label htmlFor="intent" style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-primary)' }}>
                      This message contains job referral intent
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-12)' }}>
                    <Button variant="secondary" onClick={() => setShowContactModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Send Secure Message
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

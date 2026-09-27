'use client'

import React, { useState } from 'react'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Badge } from '@/shared/components/ui/Badge'
import { CheckCircle2, ShieldCheck, Github, ExternalLink, Clock, Sparkles, UserCheck } from 'lucide-react'

export default function VerificationHubPage() {
  const [skillName, setSkillName] = useState('React.js & State Management')
  const [githubUrl, setGithubUrl] = useState('https://github.com/alex-sharma/react-task-manager')
  const [liveUrl, setLiveUrl] = useState('https://taskmanager.vercel.app')
  const [leetcode, setLeetcode] = useState('alex_sharma99')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const pendingRequests = [
    {
      id: 'req-1',
      skill: 'JavaScript Closures & Async',
      status: 'AI_VERIFIED',
      score: 85,
      submittedDate: 'Sep 24, 2026',
      mentor: 'Pending Mentor Assignment',
    },
    {
      id: 'req-2',
      skill: 'HTML5 & CSS Grid Layouts',
      status: 'COMPLETED',
      score: 92,
      submittedDate: 'Sep 18, 2026',
      mentor: 'Priya Mehta (Senior Mentor)',
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <AppLayout title="Skill Verification Hub" subtitle="Get your skills verified by Claude AI & Senior Industry Mentors">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        
        {/* Verification Request Form */}
        <section
          aria-labelledby="submit-heading"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-accent)',
            padding: 'var(--sp-24)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-20)',
          }}
        >
          <div>
            <h2 id="submit-heading" style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
              Submit Skill Evidence for Verification
            </h2>
            <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)', marginTop: 'var(--sp-4)' }}>
              At least one piece of evidence (GitHub repository URL or Live URL) is required for analysis.
            </p>
          </div>

          {submitted ? (
            <div
              style={{
                padding: 'var(--sp-16)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--tok-success-bg)',
                border: '1px solid var(--border-success)',
                color: 'var(--txt-success)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-12)',
              }}
            >
              <CheckCircle2 size={24} />
              <div>
                <div style={{ fontWeight: 'var(--weight-medium)', fontSize: 'var(--type-sm)' }}>
                  Verification Request Submitted Successfully!
                </div>
                <div style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)', marginTop: 'var(--sp-4)' }}>
                  Claude AI static analysis job enqueued. You will be notified in 2–3 minutes once AI review completes.
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-16)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-16)' }}>
                <Input
                  label="Target Skill"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  required
                />
                <Input
                  label="GitHub Repository URL"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
                <Input
                  label="Live Deployed Project URL"
                  placeholder="https://yourproject.vercel.app"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                />
                <Input
                  label="LeetCode Username (Optional)"
                  placeholder="username"
                  value={leetcode}
                  onChange={(e) => setLeetcode(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--sp-8)' }}>
                <Button variant="primary" type="submit" disabled={isSubmitting} icon={<ShieldCheck size={18} />}>
                  {isSubmitting ? 'Enqueuing AI Review...' : 'Submit Evidence for Review'}
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* Existing Requests Hub */}
        <section
          aria-labelledby="requests-heading"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: 'var(--sp-24)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-20)',
          }}
        >
          <h2 id="requests-heading" style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
            Your Verification History & Requests
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-12)' }}>
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: 'var(--sp-16)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-overlay)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 'var(--sp-16)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)' }}>
                    <span style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                      {req.skill}
                    </span>
                    <Badge variant={req.status === 'COMPLETED' ? 'success' : 'info'}>
                      {req.status === 'COMPLETED' ? 'MENTOR VERIFIED' : 'AI VERIFIED (85/100)'}
                    </Badge>
                  </div>
                  <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>
                    Submitted: {req.submittedDate} · Evaluator: {req.mentor}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
                  <span style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-accent)' }}>
                    Score: {req.score}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  )
}

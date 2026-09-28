'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { CtaBand } from '@/features/dashboard/CtaBand'
import { StatCard } from '@/features/dashboard/StatCard'
import { ScoreCard } from '@/features/dashboard/ScoreCard'
import { TasksCard } from '@/features/dashboard/TasksCard'
import { RoadmapOverview } from '@/features/dashboard/RoadmapOverview'
import { ShieldCheck, Compass, Award, Zap, Trophy } from 'lucide-react'

const defaultBreakdown = {
  roadmapCompletion: 80,
  verifiedSkills: 75,
  githubActivity: 85,
  leetcodeStats: 60,
  mentorRatings: 90,
  projectQuality: 70,
}

export default function DashboardPage() {
  const [scoreData, setScoreData] = useState<{ totalScore: number; breakdown: typeof defaultBreakdown } | null>(null)
  const [gamification, setGamification] = useState<{ xp: number; streak: number; badges: string[]; leaderboard: Array<{ name: string; xp: number }> } | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      fetch('/api/score/learner-123', { signal: controller.signal }),
      fetch('/api/gamification?userId=learner-123', { signal: controller.signal }),
    ])
      .then(async ([scoreRes, gamificationRes]) => {
        const scorePayload = await scoreRes.json()
        const gamificationPayload = await gamificationRes.json()

        if (scorePayload?.data) {
          setScoreData(scorePayload.data)
        }

        if (gamificationPayload?.data) {
          setGamification(gamificationPayload.data)
        }
      })
      .catch(() => {
        // Keep the default dashboard content if live data is unavailable.
      })

    return () => controller.abort()
  }, [])

  const totalScore = scoreData?.totalScore ?? 78.5
  const scoreBreakdown = scoreData?.breakdown ?? defaultBreakdown
  const xp = gamification?.xp ?? 1450
  const leaderboard = gamification?.leaderboard ?? [
    { name: 'Alex Sharma', xp: 1450 },
    { name: 'Priya Verma', xp: 1380 },
    { name: 'Rohit Kumar', xp: 1210 },
    { name: 'Sneha Patel', xp: 1095 },
  ]

  const leaderboardTitle = useMemo(
    () => `${Math.max(...leaderboard.map((entry) => entry.xp))} XP leader`,
    [leaderboard]
  )

  return (
    <AppLayout title="Learner Dashboard" subtitle="Overview of your career roadmap and employability score">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        <CtaBand
          currentModule="Module 2: Modern JavaScript"
          currentStep="JavaScript: Closures, Scope & Execution Context"
          stepIndex={3}
          totalSteps={5}
          estimatedTime="25 min"
          roadmapSlug="frontend-developer"
          stepSlug="fe-step-3"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--sp-16)',
          }}
        >
          <StatCard
            title="EMPLOYABILITY SCORE"
            value={totalScore.toFixed(1)}
            subtext="Top 15% in India"
            icon={<ShieldCheck size={20} />}
            accentColor="var(--tok-primary)"
          />
          <StatCard
            title="ROADMAP PROGRESS"
            value="60%"
            subtext="3 of 5 steps complete"
            icon={<Compass size={20} />}
            accentColor="var(--tok-info)"
          />
          <StatCard
            title="VERIFIED SKILLS"
            value="4 Skills"
            subtext="2 Mentor Verified"
            icon={<Award size={20} />}
            accentColor="var(--tok-warning)"
          />
          <StatCard
            title="TOTAL XP EARNED"
            value={`${xp.toLocaleString()} XP`}
            subtext="+150 XP today"
            icon={<Zap size={20} />}
            accentColor="var(--tok-primary)"
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--sp-24)',
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
            <RoadmapOverview />
            <TasksCard />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
            <ScoreCard totalScore={totalScore} breakdown={scoreBreakdown} />
            <section
              aria-labelledby="leaderboard-heading"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                padding: 'var(--sp-24)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-12)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--tok-warning-bg)',
                      color: 'var(--txt-warning)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trophy size={16} aria-hidden="true" />
                  </div>
                  <h2 id="leaderboard-heading" style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                    Roadmap Leaderboard
                  </h2>
                </div>
                <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>{leaderboardTitle}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
                {leaderboard.map((entry, index) => (
                  <div
                    key={`${entry.name}-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--sp-12)',
                      padding: 'var(--sp-8) 0',
                      borderBottom: index === leaderboard.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
                      <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)', width: '20px' }}>#{index + 1}</span>
                      <span style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-primary)' }}>{entry.name}</span>
                    </div>
                    <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)', fontWeight: 'var(--weight-medium)' }}>
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

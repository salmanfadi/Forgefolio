'use client'

import React from 'react'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { CtaBand } from '@/features/dashboard/CtaBand'
import { StatCard } from '@/features/dashboard/StatCard'
import { ScoreCard } from '@/features/dashboard/ScoreCard'
import { TasksCard } from '@/features/dashboard/TasksCard'
import { RoadmapOverview } from '@/features/dashboard/RoadmapOverview'
import { ShieldCheck, Compass, Award, Zap } from 'lucide-react'

export default function DashboardPage() {
  const scoreBreakdown = {
    roadmapCompletion: 80,
    verifiedSkills: 75,
    githubActivity: 85,
    leetcodeStats: 60,
    mentorRatings: 90,
    projectQuality: 70,
  }

  return (
    <AppLayout title="Learner Dashboard" subtitle="Overview of your career roadmap and employability score">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        
        {/* Dominant Primary CTA Band */}
        <CtaBand
          currentModule="Module 2: Modern JavaScript"
          currentStep="JavaScript: Closures, Scope & Execution Context"
          stepIndex={3}
          totalSteps={5}
          estimatedTime="25 min"
          roadmapSlug="frontend-developer"
          stepSlug="fe-step-3"
        />

        {/* Top 4 Stat Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--sp-16)',
          }}
        >
          <StatCard
            title="EMPLOYABILITY SCORE"
            value="78.5"
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
            value="1,450 XP"
            subtext="+150 XP today"
            icon={<Zap size={20} />}
            accentColor="var(--tok-primary)"
          />
        </div>

        {/* Main 2-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--sp-24)',
            alignItems: 'start',
          }}
        >
          {/* Left Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
            <RoadmapOverview />
            <TasksCard />
          </div>

          {/* Right Sidebar Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
            <ScoreCard totalScore={78.5} breakdown={scoreBreakdown} />
          </div>
        </div>

      </div>
    </AppLayout>
  )
}

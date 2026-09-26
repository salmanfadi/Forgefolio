'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Compass, CheckCircle2, FolderGit2, User, Users, GitPullRequest, Settings, ShieldCheck } from 'lucide-react'
import { Avatar } from '../ui/Avatar'

export const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const navGroups = [
    {
      label: 'LEARN & BUILD',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Roadmaps', href: '/roadmap', icon: Compass },
        { label: 'Skill Verification', href: '/verify', icon: CheckCircle2 },
        { label: 'Projects', href: '/projects', icon: FolderGit2 },
      ],
    },
    {
      label: 'PORTFOLIO & CAREER',
      items: [
        { label: 'My Passport', href: '/u/alex_dev', icon: User },
        { label: 'Referral Directory', href: '/directory', icon: Users },
        { label: 'Contribute', href: '/contribute', icon: GitPullRequest },
      ],
    },
    {
      label: 'ACCOUNT',
      items: [{ label: 'Settings', href: '/settings', icon: Settings }],
    },
  ]

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: '64px',
          padding: '0 var(--sp-24)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-16)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
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
        <div>
          <h1 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)', lineHeight: '1.2' }}>
            SkillPath
          </h1>
          <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-accent)' }}>
            Career Accelerator
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav aria-label="Main navigation" style={{ flex: 1, padding: 'var(--sp-16)', overflowY: 'auto' }}>
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: 'var(--sp-24)' }}>
            <div
              style={{
                fontSize: 'var(--type-xs)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--txt-tertiary)',
                padding: '0 var(--sp-8) var(--sp-8) var(--sp-8)',
                letterSpacing: '0.05em',
              }}
            >
              {group.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    tabIndex={0}
                    style={{
                      minHeight: '44px',
                      padding: '0 var(--sp-16)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--sp-16)',
                      fontSize: 'var(--type-sm)',
                      fontWeight: isActive ? 'var(--weight-medium)' : 'var(--weight-normal)',
                      color: isActive ? 'var(--txt-accent)' : 'var(--txt-primary)',
                      backgroundColor: isActive ? 'var(--bg-primary)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--tok-primary)' : '3px solid transparent',
                      textDecoration: 'none',
                    }}
                    className="transition-colors"
                  >
                    <Icon size={18} style={{ color: isActive ? 'var(--tok-primary)' : 'var(--txt-secondary)' }} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer User Info */}
      <div
        style={{
          padding: 'var(--sp-16)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-16)',
        }}
      >
        <Avatar name="Alex Sharma" role="LEARNER" />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Alex Sharma
          </div>
          <div style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>
            Frontend Learner
          </div>
        </div>
      </div>
    </aside>
  )
}

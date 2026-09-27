'use client'

import React from 'react'
import { Flame, Bell } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export interface TopbarProps {
  title?: string
  subtitle?: string
}

export const Topbar: React.FC<TopbarProps> = ({ title = 'Dashboard', subtitle }) => {
  return (
    <header
      style={{
        height: '64px',
        padding: '0 var(--sp-24)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        <h1 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-16)' }}>
        {/* Streak Pill */}
        <div
          role="status"
          aria-label="Active 5 day learning streak"
          style={{
            height: '44px',
            padding: '0 var(--sp-16)',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-warning)',
            border: '1px solid var(--border-warning)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-8)',
            color: 'var(--txt-warning)',
            fontWeight: 'var(--weight-medium)',
            fontSize: 'var(--type-sm)',
          }}
        >
          <Flame size={18} style={{ color: 'var(--tok-warning)' }} aria-hidden="true" />
          <span>5 Day Streak</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          aria-label="Notifications (2 unread)"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-overlay)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--txt-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
          className="transition-colors"
        >
          <Bell size={18} aria-hidden="true" />
          <span
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '8px',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--tok-primary)',
            }}
          />
        </button>

        {/* Dark Mode Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}

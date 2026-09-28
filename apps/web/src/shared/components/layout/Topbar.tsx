'use client'

import React, { useEffect, useState } from 'react'
import { Flame, Bell } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export interface TopbarProps {
  title?: string
  subtitle?: string
}

type NotificationItem = {
  id: string
  userId: string
  type: 'verification_status' | 'challenge' | 'badge' | 'contribution_review'
  message: string
  read: boolean
  createdAt: string
}

export const Topbar: React.FC<TopbarProps> = ({ title = 'Dashboard', subtitle }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/notifications?userId=learner-123', { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => {
        const nextNotifications = Array.isArray(payload?.data) ? payload.data : []
        setNotifications(nextNotifications)
      })
      .catch(() => setNotifications([]))

    return () => controller.abort()
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length

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

        <button
          aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications (0 unread)'}
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
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                minWidth: '18px',
                height: '18px',
                borderRadius: '999px',
                backgroundColor: 'var(--tok-primary)',
                color: 'var(--txt-inverse)',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              {Math.min(unreadCount, 9)}
            </span>
          )}
        </button>

        <ThemeToggle />
      </div>
    </header>
  )
}

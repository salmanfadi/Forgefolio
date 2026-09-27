import React from 'react'

export interface StatCardProps {
  title: string
  value: string | number
  subtext?: string
  icon?: React.ReactNode
  accentColor?: string
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon, accentColor = 'var(--tok-primary)' }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: 'var(--sp-16)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--sp-16)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--type-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-secondary)' }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 'var(--type-xl)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
          {value}
        </div>
        {subtext && (
          <div style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)', marginTop: 'var(--sp-4)' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  )
}

import React from 'react'

export interface BadgeProps {
  variant?: 'theory' | 'build' | 'practice' | 'success' | 'warning' | 'info' | 'danger' | 'default'
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, icon, className = '' }) => {
  const styles: Record<string, React.CSSProperties> = {
    theory: {
      backgroundColor: 'var(--tok-info-bg)',
      color: 'var(--txt-info)',
      borderColor: 'var(--border-info)',
    },
    build: {
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--txt-accent)',
      borderColor: 'var(--border-accent)',
    },
    practice: {
      backgroundColor: 'var(--tok-success-bg)',
      color: 'var(--txt-success)',
      borderColor: 'var(--border-success)',
    },
    success: {
      backgroundColor: 'var(--tok-success-bg)',
      color: 'var(--txt-success)',
      borderColor: 'var(--border-success)',
    },
    warning: {
      backgroundColor: 'var(--tok-warning-bg)',
      color: 'var(--txt-warning)',
      borderColor: 'var(--border-warning)',
    },
    info: {
      backgroundColor: 'var(--tok-info-bg)',
      color: 'var(--txt-info)',
      borderColor: 'var(--border-info)',
    },
    danger: {
      backgroundColor: 'var(--tok-danger-bg)',
      color: 'var(--txt-danger)',
      borderColor: 'var(--border-danger)',
    },
    default: {
      backgroundColor: 'var(--bg-overlay)',
      color: 'var(--txt-secondary)',
      borderColor: 'var(--border-subtle)',
    },
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--sp-4)',
        padding: 'var(--sp-4) var(--sp-8)',
        fontSize: 'var(--type-xs)',
        fontWeight: 'var(--weight-medium)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid',
        lineHeight: '1.2',
        ...styles[variant],
      }}
      className={className}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  )
}

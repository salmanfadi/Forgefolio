import React from 'react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--sp-48) var(--sp-24)',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-default)',
        gap: 'var(--sp-16)',
      }}
    >
      {icon && (
        <div
          style={{
            fontSize: '32px',
            color: 'var(--txt-tertiary)',
            backgroundColor: 'var(--bg-overlay)',
            padding: 'var(--sp-16)',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
        <h3 style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
          {title}
        </h3>
        <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', maxWidth: '400px' }}>
          {description}
        </p>
      </div>
      {action && <div style={{ marginTop: 'var(--sp-8)' }}>{action}</div>}
    </div>
  )
}

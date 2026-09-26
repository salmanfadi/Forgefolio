import React from 'react'

export interface ProgressBarProps {
  value: number // 0 - 100
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'info'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label = 'Progress',
  size = 'md',
  variant = 'primary',
}) => {
  const heightMap = {
    sm: '4px',
    md: '8px',
    lg: '12px',
  }

  const fillColors: Record<string, string> = {
    primary: 'var(--tok-primary)',
    success: 'var(--tok-success)',
    warning: 'var(--tok-warning)',
    info: 'var(--tok-info)',
  }

  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{
        width: '100%',
        height: heightMap[size],
        backgroundColor: 'var(--bg-overlay)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        className="transition-progress"
        style={{
          width: `${clamped}%`,
          height: '100%',
          backgroundColor: fillColors[variant],
          borderRadius: 'var(--radius-full)',
        }}
      />
    </div>
  )
}

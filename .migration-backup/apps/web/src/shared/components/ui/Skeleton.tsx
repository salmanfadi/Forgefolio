import React from 'react'

export interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className = '',
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--bg-overlay)',
        opacity: 0.7,
      }}
      className={`animate-pulse ${className}`}
      aria-hidden="true"
    />
  )
}

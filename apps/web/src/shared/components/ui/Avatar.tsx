import React from 'react'

export interface AvatarProps {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  role?: string
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {
  const sizeMap = {
    sm: { dimension: '32px', font: 'var(--type-xs)' },
    md: { dimension: '40px', font: 'var(--type-sm)' },
    lg: { dimension: '56px', font: 'var(--type-base)' },
  }

  const { dimension, font } = sizeMap[size]

  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--txt-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'var(--weight-medium)',
        fontSize: font,
        border: '1px solid var(--border-accent)',
        flexShrink: 0,
      }}
      aria-label={name}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', icon, children, className = '', disabled, ...props }, ref) => {
    // WCAG 2.5.5 target size min-height 44px
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--sp-8)',
      minHeight: '44px',
      minWidth: '44px',
      padding: size === 'sm' ? 'var(--sp-8) var(--sp-16)' : 'var(--sp-16) var(--sp-24)',
      fontSize: 'var(--type-sm)',
      fontWeight: 'var(--weight-medium)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid transparent',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      textDecoration: 'none',
      boxSizing: 'border-box' as const,
    }

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--tok-primary)',
        color: 'var(--txt-on-primary)',
        borderColor: 'var(--tok-primary-dark)',
      },
      secondary: {
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--txt-primary)',
        borderColor: 'var(--border-default)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--txt-secondary)',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: 'var(--tok-danger)',
        color: 'var(--txt-on-primary)',
        borderColor: 'var(--tok-danger)',
      },
      link: {
        backgroundColor: 'transparent',
        color: 'var(--txt-accent)',
        borderColor: 'transparent',
        textDecoration: 'underline',
      },
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={{ ...baseStyle, ...variantStyles[variant] }}
        className={`transition-colors ${className}`}
        {...props}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        <span>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'

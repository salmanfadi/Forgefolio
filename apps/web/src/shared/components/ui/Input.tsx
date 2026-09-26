import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, id, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: 'var(--type-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--txt-primary)',
            }}
          >
            {label} {required && <span style={{ color: 'var(--tok-danger)' }}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          style={{
            minHeight: '44px',
            padding: 'var(--sp-8) var(--sp-16)',
            fontSize: 'var(--type-sm)',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--tok-danger)' : 'var(--border-default)'}`,
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--txt-primary)',
            outline: 'none',
            boxSizing: 'border-box' as const,
          }}
          className={`transition-colors ${className}`}
          {...props}
        />
        {error && (
          <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-danger)' }} role="alert">
            {error}
          </span>
        )}
        {hint && !error && (
          <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>
            {hint}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

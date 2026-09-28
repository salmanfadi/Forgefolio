'use client'

import React from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar title={title} subtitle={subtitle} />
        <main
          role="main"
          style={{
            flex: 1,
            padding: 'var(--sp-24)',
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { Button } from '@/shared/components/ui/Button'
import { BookOpen, Code, CheckCircle2, ExternalLink, Sparkles, MessageSquare, ArrowLeft } from 'lucide-react'

export default function StepDetailPage() {
  const router = useRouter()
  const [completed, setCompleted] = useState(false)
  const [showAiMentor, setShowAiMentor] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Hello Alex! I am your AI Mentor for this step on JavaScript Closures. Ask me any question or request a code snippet explanation!' },
  ])

  const stepTitle = 'JavaScript: Closures, Scope & Execution Context'

  const handleSendAi = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiQuery.trim()) return
    const userText = aiQuery
    setMessages((prev) => [...prev, { role: 'user', text: userText }])
    setAiQuery('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `A closure in JS is formed when a inner function retains access to variables declared in its outer enclosing scope even after that outer function has returned. Here is an example:

function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}`,
        },
      ])
    }, 600)
  }

  return (
    <AppLayout title={stepTitle} subtitle="Module 2 · Step 3 of 5">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
        
        {/* Top Header & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-16)' }}>
          <button
            onClick={() => router.back()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--sp-8)',
              background: 'none',
              border: 'none',
              color: 'var(--txt-secondary)',
              fontSize: 'var(--type-sm)',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            <ArrowLeft size={18} /> Back to Roadmap
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
            <Button
              variant="secondary"
              icon={<Sparkles size={16} style={{ color: 'var(--tok-info)' }} />}
              onClick={() => setShowAiMentor(!showAiMentor)}
            >
              {showAiMentor ? 'Close AI Mentor' : 'Ask AI Mentor'}
            </Button>

            <Button
              variant={completed ? 'secondary' : 'primary'}
              icon={<CheckCircle2 size={18} />}
              onClick={() => setCompleted(!completed)}
            >
              {completed ? 'Marked Complete' : 'Mark Step Complete'}
            </Button>
          </div>
        </div>

        {/* Layout: Main content + Optional AI Mentor Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: showAiMentor ? '1fr 340px' : '1fr', gap: 'var(--sp-24)', alignItems: 'start' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-24)' }}>
            {/* Theory Resources Section */}
            <section
              aria-labelledby="theory-heading"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                padding: 'var(--sp-24)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-16)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
                <div style={{ padding: 'var(--sp-8)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--tok-info-bg)', color: 'var(--tok-info)' }}>
                  <BookOpen size={20} aria-hidden="true" />
                </div>
                <div>
                  <h2 id="theory-heading" style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                    1. Theory & Core Concepts (20%)
                  </h2>
                  <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
                    Read/watch these curated resources before attempting the practical challenge.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-12)' }}>
                <a
                  href="https://javascript.info/closure"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: 'var(--sp-16)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-overlay)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                      JavaScript.info: Variable Scope & Closures
                    </div>
                    <div style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)', marginTop: 'var(--sp-4)' }}>
                      In-depth guide explaining Lexical Environment, Function Outer References, and Garbage Collection.
                    </div>
                  </div>
                  <ExternalLink size={18} style={{ color: 'var(--txt-accent)', flexShrink: 0 }} aria-hidden="true" />
                </a>
              </div>
            </section>

            {/* Practical Exercise Section */}
            <section
              aria-labelledby="practical-heading"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-accent)',
                padding: 'var(--sp-24)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-16)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-12)' }}>
                <div style={{ padding: 'var(--sp-8)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', color: 'var(--tok-primary)' }}>
                  <Code size={20} aria-hidden="true" />
                </div>
                <div>
                  <h2 id="practical-heading" style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                    2. Practical Build Exercise (80%)
                  </h2>
                  <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
                    Demonstrate your skill by writing working code and pushing to GitHub.
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-base)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-16)', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)', marginBottom: 'var(--sp-8)' }}>
                  Task: Implement a Custom Memoize Wrapper Function
                </h3>
                <p style={{ fontSize: 'var(--type-sm)', color: 'var(--txt-secondary)', lineHeight: 'var(--lh-base)' }}>
                  Write a function <code style={{ backgroundColor: 'var(--bg-overlay)', padding: '2px 6px', borderRadius: '4px' }}>memoize(fn)</code> that returns a new function. It should cache results based on argument key serialization using closures so subsequent calls with identical arguments do not re-run expensive calculations.
                </p>
              </div>
            </section>
          </div>

          {/* AI Mentor Slide-in Panel */}
          {showAiMentor && (
            <aside
              aria-label="AI Mentor Assistant"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-info)',
                padding: 'var(--sp-16)',
                display: 'flex',
                flexDirection: 'column',
                height: '500px',
              }}
            >
              <div style={{ paddingBottom: 'var(--sp-12)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 'var(--sp-8)' }}>
                <MessageSquare size={18} style={{ color: 'var(--tok-info)' }} />
                <span style={{ fontSize: 'var(--type-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
                  AI Step Mentor
                </span>
              </div>

              <div style={{ flex: 1, padding: 'var(--sp-12) 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-12)' }}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                      backgroundColor: m.role === 'user' ? 'var(--bg-primary)' : 'var(--bg-overlay)',
                      color: 'var(--txt-primary)',
                      padding: 'var(--sp-8) var(--sp-12)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--type-xs)',
                      lineHeight: '1.4',
                      maxWidth: '85%',
                    }}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendAi} style={{ display: 'flex', gap: 'var(--sp-8)', paddingTop: 'var(--sp-8)', borderTop: '1px solid var(--border-subtle)' }}>
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  style={{
                    flex: 1,
                    minHeight: '36px',
                    padding: '0 var(--sp-12)',
                    fontSize: 'var(--type-xs)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-base)',
                    color: 'var(--txt-primary)',
                  }}
                />
                <Button variant="secondary" size="sm" type="submit">
                  Send
                </Button>
              </form>
            </aside>
          )}

        </div>
      </div>
    </AppLayout>
  )
}

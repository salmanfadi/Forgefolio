import React, { useEffect, useState } from 'react'
import { Sparkles, CheckSquare, Square } from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'

export interface TaskItem {
  id: string
  title: string
  type: 'theory' | 'build' | 'practice'
  estimatedTime: string
  completed: boolean
}

export const TasksCard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([])

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/ai/tasks?roadmapSlug=frontend-developer&stepSlug=fe-step-3', { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => {
        const nextTasks = Array.isArray(payload?.data) ? payload.data : []
        setTasks(nextTasks)
      })
      .catch(() => setTasks([]))

    return () => controller.abort()
  }, [])

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  return (
    <section
      aria-labelledby="tasks-heading"
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--tok-info-bg)',
              color: 'var(--tok-info)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} aria-hidden="true" />
          </div>
          <div>
            <h2 id="tasks-heading" style={{ fontSize: 'var(--type-base)', fontWeight: 'var(--weight-medium)', color: 'var(--txt-primary)' }}>
              AI Daily Task Recommendations
            </h2>
            <p style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-secondary)' }}>
              Tailored to your current Frontend Developer roadmap step
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            style={{
              minHeight: '48px',
              padding: 'var(--sp-8) var(--sp-16)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: task.completed ? 'var(--bg-overlay)' : 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--sp-16)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
            className="transition-colors"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-16)', flex: 1 }}>
              <div style={{ color: task.completed ? 'var(--tok-primary)' : 'var(--txt-tertiary)' }} aria-hidden="true">
                {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
              </div>
              <span
                style={{
                  fontSize: 'var(--type-sm)',
                  color: task.completed ? 'var(--txt-tertiary)' : 'var(--txt-primary)',
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)', flexShrink: 0 }}>
              <Badge variant={task.type}>{task.type.toUpperCase()}</Badge>
              <span style={{ fontSize: 'var(--type-xs)', color: 'var(--txt-tertiary)' }}>
                {task.estimatedTime}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

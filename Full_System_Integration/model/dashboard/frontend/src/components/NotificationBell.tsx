import { useState, useRef, useEffect } from 'react'

export interface AppNotification {
  id: string
  title: string
  body: string
  timestamp: Date
  read: boolean
}

interface Props {
  notifications: AppNotification[]
  onRead: (id: string) => void
  onReadAll: () => void
  onGoToDetections: () => void
}

export default function NotificationBell({ notifications, onRead, onReadAll, onGoToDetections }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function fmt(d: Date) {
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          position: 'relative', width: 32, height: 32, borderRadius: 8,
          background: open ? '#1e293b' : 'transparent',
          border: `1px solid ${open ? '#334155' : 'transparent'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 5, right: 5, width: 7, height: 7,
            background: '#dc2626', borderRadius: '50%', border: '1.5px solid #0f172a',
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 42, right: 0, width: 320, borderRadius: 12,
          background: 'white', border: '1px solid #e2e8f0',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)', zIndex: 99999, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderBottom: '1px solid #f1f5f9',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Notifications</span>
              {unread > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10,
                  background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                }}>{unread} new</span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={onReadAll} style={{
                fontSize: 11, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer',
              }}>Mark all read</button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"
                  style={{ display: 'block', margin: '0 auto 8px' }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>No notifications yet</p>
                <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 3 }}>Upload an image to scan</p>
              </div>
            ) : notifications.map(n => (
              <button
                key={n.id}
                onClick={() => { onRead(n.id); onGoToDetections(); setOpen(false) }}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 16px',
                  borderBottom: '1px solid #f8fafc',
                  background: n.read ? 'white' : '#f0fdf4',
                  cursor: 'pointer', border: 'none', display: 'block',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'white' : '#f0fdf4')}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{n.title}</p>
                    <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.45 }}>{n.body}</p>
                    <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{fmt(n.timestamp)}</p>
                  </div>
                  {!n.read && (
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#16a34a',
                      flexShrink: 0, marginTop: 5,
                    }} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

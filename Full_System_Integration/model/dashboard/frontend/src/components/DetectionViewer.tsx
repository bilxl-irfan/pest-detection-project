import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Detection } from '../types'
import { api } from '../services/api'

interface Props {
  detections: Detection[]
  onDetectionsChange: () => void
}

type HitlStep = 'health' | 'pest' | null

const PEST_CLASSES = ['aphids', 'whitefly', 'thrips', 'mites', 'blight', 'rust']

function StatusDot({ color }: { color: string }) {
  return <span className="w-2 h-2 rounded-full flex-shrink-0 inline-block" style={{ background: color }} />
}

function TileImage({ src, alt, style }: {
  src?: string | null; alt: string; className?: string; style?: React.CSSProperties
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  // Reset state whenever src changes
  const prevSrc = useRef(src)
  if (prevSrc.current !== src) {
    prevSrc.current = src
    setLoaded(false)
    setFailed(false)
  }

  const bg = String(style?.background ?? '#1e293b')
  const showPlaceholder = !src || failed || !loaded

  return (
    <div style={{ position: 'absolute', inset: 0, background: bg }}>
      {showPlaceholder && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>No image</span>
        </div>
      )}
      {src && (
        <img
          key={src}
          src={src}
          alt={alt}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            display: loaded ? 'block' : 'none',
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1 rounded-full" style={{ background: '#f1f5f9' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

function statusProps(detection: Detection, resolvedLabel: string | null) {
  const isUncertain = !resolvedLabel && detection.requires_review
  const effective = (resolvedLabel ?? detection.pestType).toLowerCase()
  const isUnhealthy = effective === 'unhealthy'
  const color = isUncertain ? '#d97706' : isUnhealthy ? '#dc2626' : '#16a34a'
  const label = isUncertain ? 'Uncertain' : isUnhealthy ? 'Unhealthy' : 'Healthy'
  const conf = detection.confidence
  // Healthy → always green (high confidence = more certain it's safe)
  // Unhealthy → risk-based (high confidence = high danger)
  // Uncertain → always amber
  const confColor = isUncertain ? '#d97706' : isUnhealthy
    ? (conf >= 70 ? '#dc2626' : conf >= 50 ? '#d97706' : '#ea580c')
    : '#16a34a'
  return { isUncertain, isUnhealthy, color, label, confColor }
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: '1px solid #f8fafc' }}>
      <span className="text-xs font-semibold uppercase tracking-wider flex-shrink-0" style={{ color: '#94a3b8' }}>{label}</span>
      <div className="text-xs text-right" style={{ color: '#0f172a' }}>{children}</div>
    </div>
  )
}

export function DetailModal({ detection, onClose, onRetrain }: {
  detection: Detection; onClose: () => void; onRetrain: () => void
}) {
  const [showXAI, setShowXAI] = useState(false)
  const [retraining, setRetraining] = useState(false)
  const [retrainMsg, setRetrainMsg] = useState('')
  const [done, setDone] = useState(false)
  const [label, setLabel] = useState('')
  const [resolvedLabel, setResolvedLabel] = useState<string | null>(null)

  const initialStep = (): HitlStep => {
    if (detection.requires_review) return 'health'
    if (detection.pestType.toLowerCase() === 'unhealthy') return 'pest'
    return null
  }
  const [hitlStep, setHitlStep] = useState<HitlStep>(initialStep)

  // Poll /api/retrain/status while a retraining job is in progress.
  useEffect(() => {
    if (!retraining) return
    const interval = setInterval(async () => {
      const s = await api.getRetrainStatus()
      setRetrainMsg(s.message)
      if (s.status === 'complete' || s.status === 'error') {
        clearInterval(interval)
        setRetraining(false)
        setDone(true)
        onRetrain()
      }
    }, 1500)
    return () => clearInterval(interval)
  }, [retraining])

  const _submitLabel = async (submitLabel: string, bbox: number[]) => {
    setRetraining(true)
    setRetrainMsg('Sending label to server…')
    await api.retrain({ image_id: detection.id, label: submitLabel, bbox })
    setRetrainMsg('Processing label · fine-tuning model weights…')
    setResolvedLabel(submitLabel)
  }

  const handleHealthChoice = async (choice: 'healthy' | 'unhealthy') => {
    if (choice === 'healthy') {
      await _submitLabel('healthy', [0.5, 0.5, 0.5, 0.5])
    } else {
      setHitlStep('pest')
    }
  }

  const handlePestSubmit = async () => {
    if (!label.trim()) return
    await _submitLabel(label.trim(), [0.5, 0.5, 0.5, 0.5])
  }

  const { isUncertain, isUnhealthy, color, label: statusLabel, confColor } = statusProps(detection, resolvedLabel)
  const riskLabel = isUncertain ? 'Uncertain'
    : isUnhealthy ? (detection.confidence >= 70 ? 'High' : detection.confidence >= 50 ? 'Medium' : 'Low')
    : 'Low'
  const riskText = isUncertain ? 'Risk: Uncertain' : isUnhealthy ? `Risk: ${riskLabel}` : 'Risk: Low'

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', zIndex: 99999 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl" style={{ border: '1px solid #e2e8f0' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div className="flex items-center gap-2">
              <StatusDot color={color} />
              <h2 className="font-semibold text-sm capitalize" style={{ color: '#0f172a' }}>
                {resolvedLabel ?? detection.pestType} &mdash; {statusLabel}
              </h2>
            </div>
            <p className="font-mono text-xs mt-1" style={{ color: '#94a3b8' }}>{detection.id}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-slate-100" style={{ color: '#64748b' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Image panel */}
          <div className="md:w-[52%] relative flex-shrink-0" style={{ aspectRatio: '1', background: '#0f172a' }}>
            <TileImage src={detection.original_url} alt="tile" className="absolute inset-0 w-full h-full object-cover" style={{ background: '#1e293b' }} />
            {showXAI && detection.xai_url && (
              <img src={detection.xai_url} alt="heatmap" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.85 }} />
            )}
            {detection.xai_url && (
              <button onClick={() => setShowXAI(v => !v)}
                className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-md transition-all"
                style={{ background: showXAI ? '#d97706' : 'rgba(255,255,255,0.9)', color: showXAI ? 'white' : '#0f172a' }}>
                {showXAI ? 'Heatmap' : 'Raw'}
              </button>
            )}
            {!detection.xai_url && (
              <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-md" style={{ background: 'rgba(15,23,42,0.7)', color: '#64748b' }}>
                No heatmap
              </div>
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold"
              style={{ background: 'rgba(15,23,42,0.8)', color: color }}>
              <StatusDot color={color} />
              {statusLabel}
            </div>
          </div>

          {/* Info panel */}
          <div className="md:w-[48%] p-6 space-y-1">
            {/* Confidence */}
            <div className="pb-3" style={{ borderBottom: '1px solid #f8fafc' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Confidence</span>
                <span className="text-lg font-bold" style={{ color: confColor }}>{detection.confidence.toFixed(2)}%</span>
              </div>
              <ConfidenceBar value={detection.confidence} color={confColor} />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs" style={{ color: '#94a3b8' }}>0%</span>
                <span className="text-xs font-medium" style={{ color: confColor }}>{riskText}</span>
                <span className="text-xs" style={{ color: '#94a3b8' }}>100%</span>
              </div>
            </div>

            <InfoRow label="Classification"><span className="capitalize font-semibold">{resolvedLabel ?? detection.pestType}</span></InfoRow>
            <InfoRow label="Status">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: isUncertain ? '#fffbeb' : isUnhealthy ? '#fef2f2' : '#f0fdf4', color: isUncertain ? '#92400e' : isUnhealthy ? '#991b1b' : '#166534' }}>
                <StatusDot color={color} />{detection.status}
              </span>
            </InfoRow>
            <InfoRow label="Tile"># {detection.tile_index ?? '—'}</InfoRow>
            {detection.tile_bbox && (
              <InfoRow label="Bbox (px)">
                {detection.tile_bbox[0]}×{detection.tile_bbox[1]} &nbsp;{detection.tile_bbox[2]}w {detection.tile_bbox[3]}h
              </InfoRow>
            )}
            <InfoRow label="GPS">
              {detection.gps_coords?.lat != null
                ? <span className="font-mono">{detection.gps_coords.lat.toFixed(6)}, {detection.gps_coords.lon?.toFixed(6)}</span>
                : <span style={{ color: '#94a3b8' }}>No GPS data</span>}
            </InfoRow>
            <InfoRow label="Heatmap">{detection.xai_url ? 'Available' : 'Skipped'}</InfoRow>
            <InfoRow label="Captured">{new Date(detection.timestamp).toLocaleString()}</InfoRow>

            {/* HITL */}
            {!done && hitlStep && (
              <div className="pt-3 mt-2 space-y-2.5" style={{ borderTop: '1px solid #f1f5f9' }}>
                {hitlStep === 'health' && (
                  <>
                    <div className="rounded-lg px-3 py-2.5" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                      <p className="text-xs font-semibold capitalize" style={{ color: '#92400e' }}>
                        Model predicts: {detection.pestType}
                        <span className="font-normal ml-1.5">({detection.confidence.toFixed(1)}% confidence)</span>
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#92400e' }}>Uncertain result — is this correct?</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleHealthChoice('healthy')} disabled={retraining}
                        className="flex-1 text-sm py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                        Healthy
                      </button>
                      <button onClick={() => handleHealthChoice('unhealthy')} disabled={retraining}
                        className="flex-1 text-sm py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
                        Unhealthy
                      </button>
                    </div>
                  </>
                )}
                {hitlStep === 'pest' && (
                  <>
                    <p className="text-xs font-medium" style={{ color: '#dc2626' }}>Specify the pest class:</p>
                    <input type="text" value={label} onChange={e => setLabel(e.target.value)}
                      placeholder="e.g. aphids, whitefly, thrips..."
                      className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                      style={{ border: '1px solid #e2e8f0', color: '#0f172a' }} />
                    <div className="flex flex-wrap gap-1">
                      {PEST_CLASSES.map(p => (
                        <button key={p} onClick={() => setLabel(p)}
                          className="text-xs px-2.5 py-1 rounded-md font-medium transition-colors"
                          style={{
                            background: label === p ? '#0f172a' : '#f8fafc',
                            color: label === p ? 'white' : '#64748b',
                            border: `1px solid ${label === p ? '#0f172a' : '#e2e8f0'}`
                          }}>
                          {p}
                        </button>
                      ))}
                    </div>
                    <button onClick={handlePestSubmit} disabled={retraining || !label.trim()}
                      className="w-full text-sm py-2 rounded-lg font-semibold transition-opacity disabled:opacity-40"
                      style={{ background: '#0f172a', color: 'white' }}>
                      {retraining ? 'Submitting...' : 'Submit Label'}
                    </button>
                  </>
                )}
              </div>
            )}
            {retraining && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#d97706' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  {retrainMsg || 'Processing…'}
                </div>
              </div>
            )}
            {done && resolvedLabel && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#16a34a' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Labelled as <span className="capitalize ml-1">{resolvedLabel}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Label saved · model updated</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Detection Card ───────────────────────────────────────────────────────────

function DetectionCard({ detection, onRetrain, onViewDetail }: {
  detection: Detection; onRetrain: () => void; onViewDetail: () => void
}) {
  const [retraining, setRetraining] = useState(false)
  const [done, setDone] = useState(false)
  const [label, setLabel] = useState('')
  const [resolvedLabel, setResolvedLabel] = useState<string | null>(null)

  const initialStep = (): HitlStep => {
    if (detection.requires_review) return 'health'
    if (detection.pestType.toLowerCase() === 'unhealthy') return 'pest'
    return null
  }
  const [hitlStep, setHitlStep] = useState<HitlStep>(initialStep)

  const handleHealthChoice = async (choice: 'healthy' | 'unhealthy') => {
    if (choice === 'healthy') {
      setRetraining(true)
      await api.retrain({ image_id: detection.id, label: 'healthy', bbox: [0.5, 0.5, 0.5, 0.5] })
      setRetraining(false)
      setResolvedLabel('healthy')
      setDone(true)
      onRetrain()
    } else {
      setHitlStep('pest')
    }
  }

  const handlePestSubmit = async () => {
    if (!label.trim()) return
    setRetraining(true)
    await api.retrain({ image_id: detection.id, label: label.trim(), bbox: [0.5, 0.5, 0.5, 0.5] })
    setRetraining(false)
    setResolvedLabel(label.trim())
    setDone(true)
    onRetrain()
  }

  const { color, label: statusLabel, confColor } = statusProps(detection, resolvedLabel)

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col" style={{ border: '1px solid #e2e8f0' }}>
      {/* Image */}
      <div className="relative w-full" style={{ aspectRatio: '1', background: '#0f172a' }}>
        <TileImage src={detection.original_url} alt="tile" className="absolute inset-0 w-full h-full object-cover" style={{ background: '#1e293b' }} />
        {/* Status badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold"
          style={{ background: 'rgba(15,23,42,0.75)', color, backdropFilter: 'blur(4px)' }}>
          <StatusDot color={color} />
          {statusLabel}
        </div>
        {/* XAI badge */}
        {detection.xai_url && (
          <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md text-xs font-semibold"
            style={{ background: 'rgba(217,119,6,0.9)', color: 'white' }}>
            XAI
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-sm capitalize leading-tight" style={{ color: '#0f172a' }}>
            {resolvedLabel ?? detection.pestType}
          </span>
          <span className="text-sm font-bold flex-shrink-0" style={{ color: confColor }}>
            {detection.confidence.toFixed(1)}%
          </span>
        </div>

        <ConfidenceBar value={detection.confidence} color={confColor} />

        <p className="text-xs" style={{ color: '#94a3b8' }}>
          {new Date(detection.timestamp).toLocaleString()}
        </p>

        {/* View Details */}
        <button onClick={onViewDetail}
          className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc' }}>
          View Details
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        {/* HITL */}
        {!done && hitlStep && (
          <div className="pt-2 space-y-2" style={{ borderTop: '1px solid #f1f5f9' }}>
            {hitlStep === 'health' && (
              <>
                <div className="rounded-lg px-2.5 py-2" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <p className="text-xs font-semibold capitalize" style={{ color: '#92400e' }}>
                    Predicts: {detection.pestType} <span className="font-normal">({detection.confidence.toFixed(1)}%)</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#92400e' }}>Uncertain — classify this tile:</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleHealthChoice('healthy')} disabled={retraining}
                    className="flex-1 text-xs py-1.5 rounded-md font-semibold disabled:opacity-50"
                    style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                    Healthy
                  </button>
                  <button onClick={() => handleHealthChoice('unhealthy')} disabled={retraining}
                    className="flex-1 text-xs py-1.5 rounded-md font-semibold disabled:opacity-50"
                    style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
                    Unhealthy
                  </button>
                </div>
              </>
            )}
            {hitlStep === 'pest' && (
              <>
                <p className="text-xs font-medium" style={{ color: '#dc2626' }}>Specify pest class:</p>
                <input type="text" value={label} onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. aphids, whitefly..."
                  className="w-full text-xs px-2.5 py-1.5 rounded-md outline-none"
                  style={{ border: '1px solid #e2e8f0', color: '#0f172a' }} />
                <div className="flex flex-wrap gap-1">
                  {PEST_CLASSES.map(p => (
                    <button key={p} onClick={() => setLabel(p)}
                      className="text-xs px-2 py-0.5 rounded-md font-medium"
                      style={{
                        background: label === p ? '#0f172a' : '#f8fafc',
                        color: label === p ? 'white' : '#64748b',
                        border: `1px solid ${label === p ? '#0f172a' : '#e2e8f0'}`
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
                <button onClick={handlePestSubmit} disabled={retraining || !label.trim()}
                  className="w-full text-xs py-1.5 rounded-md font-semibold disabled:opacity-40"
                  style={{ background: '#0f172a', color: 'white' }}>
                  {retraining ? 'Submitting...' : 'Submit'}
                </button>
              </>
            )}
          </div>
        )}
        {done && resolvedLabel && (
          <div className="pt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
            <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#16a34a' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Labelled as <span className="capitalize ml-0.5">{resolvedLabel}</span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Saved · retraining in progress</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

type StatusFilter = 'all' | 'healthy' | 'unhealthy' | 'uncertain'
type ConfFilter = 'all' | 'high' | 'medium' | 'low'
type SortBy = 'newest' | 'oldest' | 'conf-desc' | 'conf-asc'

function Chip({ label, active, color, onClick }: {
  label: string; active: boolean; color?: string; onClick: () => void
}) {
  const c = color ?? '#0f172a'
  return (
    <button onClick={onClick} style={{
      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, cursor: 'pointer',
      border: `1px solid ${active ? c : '#e2e8f0'}`,
      background: active ? c : 'white',
      color: active ? 'white' : '#64748b',
      transition: 'all 0.1s',
    }}>{label}</button>
  )
}

// ─── Detection Viewer ─────────────────────────────────────────────────────────

export default function DetectionViewer({ detections, onDetectionsChange }: Props) {
  const [history, setHistory] = useState<Detection[]>([])
  const [selected, setSelected] = useState<Detection | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [confFilter, setConfFilter] = useState<ConfFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('newest')

  useEffect(() => {
    api.getHistory().then(setHistory).catch(() => {})
  }, [detections])

  const all = [...detections, ...history.filter(h => !detections.find(d => d.id === h.id))]

  const classify = (d: Detection) =>
    d.requires_review ? 'uncertain' : d.pestType.toLowerCase() === 'healthy' ? 'healthy' : 'unhealthy'

  const filtered = all
    .filter(d => {
      if (statusFilter !== 'all' && classify(d) !== statusFilter) return false
      if (confFilter === 'high' && d.confidence < 70) return false
      if (confFilter === 'medium' && (d.confidence < 50 || d.confidence >= 70)) return false
      if (confFilter === 'low' && d.confidence >= 50) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      if (sortBy === 'conf-desc') return b.confidence - a.confidence
      if (sortBy === 'conf-asc') return a.confidence - b.confidence
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

  if (all.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-xl" style={{ border: '1px dashed #e2e8f0' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: '#f1f5f9' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <p className="text-sm font-medium" style={{ color: '#0f172a' }}>No detections yet</p>
        <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Upload a drone image to begin scanning</p>
      </div>
    )
  }

  const isFiltered = statusFilter !== 'all' || confFilter !== 'all'

  return (
    <div>
      {selected && (
        <DetailModal detection={selected} onClose={() => setSelected(null)}
          onRetrain={() => { onDetectionsChange(); setSelected(null) }} />
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-xl p-3 mb-4 flex flex-wrap items-center gap-x-4 gap-y-2"
        style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>Status</span>
          <div className="flex gap-1">
            <Chip label="All" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
            <Chip label="Healthy" active={statusFilter === 'healthy'} color="#16a34a" onClick={() => setStatusFilter('healthy')} />
            <Chip label="Unhealthy" active={statusFilter === 'unhealthy'} color="#dc2626" onClick={() => setStatusFilter('unhealthy')} />
            <Chip label="Uncertain" active={statusFilter === 'uncertain'} color="#d97706" onClick={() => setStatusFilter('uncertain')} />
          </div>
        </div>
        <div style={{ width: 1, height: 20, background: '#e2e8f0', flexShrink: 0 }} />
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>Conf</span>
          <div className="flex gap-1">
            <Chip label="All" active={confFilter === 'all'} onClick={() => setConfFilter('all')} />
            <Chip label="≥70%" active={confFilter === 'high'} color="#dc2626" onClick={() => setConfFilter('high')} />
            <Chip label="50–69%" active={confFilter === 'medium'} color="#d97706" onClick={() => setConfFilter('medium')} />
            <Chip label="<50%" active={confFilter === 'low'} color="#16a34a" onClick={() => setConfFilter('low')} />
          </div>
        </div>
        <div style={{ width: 1, height: 20, background: '#e2e8f0', flexShrink: 0 }} />
        <div className="flex items-center gap-1.5 ml-auto">
          <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>Sort</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)} style={{
            fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 8,
            border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', cursor: 'pointer',
          }}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="conf-desc">Highest confidence</option>
            <option value="conf-asc">Lowest confidence</option>
          </select>
        </div>
      </div>

      {/* Count + clear */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium" style={{ color: '#64748b' }}>
          {isFiltered
            ? `${filtered.length} of ${all.length} detection${all.length !== 1 ? 's' : ''}`
            : `${all.length} detection${all.length !== 1 ? 's' : ''}`}
        </p>
        {isFiltered && (
          <button onClick={() => { setStatusFilter('all'); setConfFilter('all') }}
            style={{ fontSize: 11, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl" style={{ border: '1px dashed #e2e8f0' }}>
          <p className="text-sm font-medium" style={{ color: '#0f172a' }}>No detections match the filters</p>
          <button onClick={() => { setStatusFilter('all'); setConfFilter('all') }}
            className="text-xs mt-2" style={{ color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer' }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(d => (
            <DetectionCard key={d.id} detection={d} onRetrain={onDetectionsChange} onViewDetail={() => setSelected(d)} />
          ))}
        </div>
      )}
    </div>
  )
}

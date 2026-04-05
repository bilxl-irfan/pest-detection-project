import { useState } from 'react'
import type { Detection } from '../types'

interface Props {
  detections: Detection[]
  onClose: () => void
  onViewDetections: () => void
}

function classify(d: Detection) {
  if (d.requires_review) return 'uncertain'
  return d.pestType.toLowerCase() === 'healthy' ? 'healthy' : 'unhealthy'
}

function StatBox({ value, label, color, bg, border }: {
  value: number; label: string; color: string; bg: string; border: string
}) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
      <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export default function ScanReport({ detections, onClose, onViewDetections }: Props) {
  const [expanded, setExpanded] = useState(true)

  if (detections.length === 0) return null

  const healthy = detections.filter(d => classify(d) === 'healthy')
  const unhealthy = detections.filter(d => classify(d) === 'unhealthy')
  const uncertain = detections.filter(d => classify(d) === 'uncertain')
  const topThreat = unhealthy.length > 0
    ? unhealthy.reduce((a, b) => a.confidence > b.confidence ? a : b)
    : null
  const avgConf = detections.reduce((s, d) => s + d.confidence, 0) / detections.length
  const hasXai = detections.some(d => d.xai_url)

  const recommendation = unhealthy.length > 0
    ? `${unhealthy.length} tile${unhealthy.length > 1 ? 's show' : ' shows'} signs of pest or disease at an average of ${(unhealthy.reduce((s, d) => s + d.confidence, 0) / unhealthy.length).toFixed(1)}% confidence.${uncertain.length > 0 ? ` ${uncertain.length} tile${uncertain.length > 1 ? 's require' : ' requires'} your classification.` : ''} Field inspection recommended.`
    : uncertain.length > 0
    ? `No confirmed threats. ${uncertain.length} tile${uncertain.length > 1 ? 's require' : ' requires'} your classification to finalize the scan.`
    : `All ${detections.length} tile${detections.length > 1 ? 's' : ''} appear healthy with an average confidence of ${avgConf.toFixed(1)}%. No action required.`

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
      {/* Clickable header */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 20px', cursor: 'pointer',
          background: 'linear-gradient(90deg, #0f172a 0%, #1a3050 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Scan Report</span>
            <span style={{ fontSize: 11, color: '#64748b', marginLeft: 10 }}>
              {detections.length} tile{detections.length !== 1 ? 's' : ''} analysed
              {hasXai && <span style={{ marginLeft: 8, color: '#d97706' }}>· XAI available</span>}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={e => { e.stopPropagation(); onViewDetections() }}
            style={{
              fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
              background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)',
              color: '#4ade80', cursor: 'pointer',
            }}
          >View Detections →</button>
          <button
            onClick={e => { e.stopPropagation(); onClose() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: 4 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: 20 }}>
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
            <StatBox value={detections.length} label="Total Tiles" color="#0f172a" bg="#f8fafc" border="#e2e8f0" />
            <StatBox value={healthy.length} label="Healthy" color="#16a34a" bg="#f0fdf4" border="#bbf7d0" />
            <StatBox value={unhealthy.length} label="Unhealthy" color="#dc2626" bg="#fef2f2" border="#fecaca" />
            <StatBox value={uncertain.length} label="Uncertain" color="#d97706" bg="#fffbeb" border="#fde68a" />
          </div>

          {/* Avg confidence bar */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Average Confidence</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{avgConf.toFixed(1)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: '#f1f5f9', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${avgConf}%`, borderRadius: 6, transition: 'width 0.6s',
                background: unhealthy.length > 0 ? '#dc2626' : '#16a34a',
              }} />
            </div>
          </div>

          {/* Top threat */}
          {topThreat && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '10px 14px', marginBottom: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#991b1b' }}>Highest Risk Detection</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                    Tile #{topThreat.tile_index ?? '—'}
                    <span style={{ fontSize: 11, fontWeight: 400, color: '#64748b', marginLeft: 6 }}>
                      · {topThreat.pestType}
                    </span>
                  </p>
                  {topThreat.gps_coords?.lat != null && (
                    <p style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace', marginTop: 2 }}>
                      📍 {topThreat.gps_coords.lat.toFixed(5)}°, {topThreat.gps_coords.lon?.toFixed(5)}°
                    </p>
                  )}
                  {topThreat.xai_url && (
                    <p style={{ fontSize: 10, color: '#d97706', marginTop: 2 }}>XAI heatmap available</p>
                  )}
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#dc2626', flexShrink: 0 }}>
                  {topThreat.confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 10, padding: '10px 14px',
            display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={unhealthy.length > 0 ? '#dc2626' : '#16a34a'}
              strokeWidth="2" style={{ marginTop: 1, flexShrink: 0 }}>
              {unhealthy.length > 0
                ? <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>
                : <polyline points="20 6 9 17 4 12" />
              }
            </svg>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{recommendation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

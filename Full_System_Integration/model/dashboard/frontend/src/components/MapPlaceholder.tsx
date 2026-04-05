import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import type { Detection } from '../types'
import { api } from '../services/api'
import { DetailModal } from './DetectionViewer'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const pulsingIcon = L.divIcon({
  className: 'pulsing-marker',
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [60, 60], maxZoom: 19 })
    }
  }, [positions, map])
  return null
}

function MapClickHandler({ onClose }: { onClose: () => void }) {
  useMapEvents({ click: onClose })
  return null
}

function statusColor(d: Detection) {
  if (d.requires_review) return '#d97706'
  if (d.pestType.toLowerCase() === 'unhealthy') return '#dc2626'
  return '#16a34a'
}

function statusLabel(d: Detection) {
  if (d.requires_review) return 'Review'
  if (d.pestType.toLowerCase() === 'unhealthy') return 'Unhealthy'
  return 'Healthy'
}

interface Props { detections: Detection[] }

export default function MapPlaceholder({ detections }: Props) {
  const [history, setHistory] = useState<Detection[]>([])
  const [selected, setSelected] = useState<Detection | null>(null)
  const [highlighted, setHighlighted] = useState<string | null>(null)

  useEffect(() => {
    api.getHistory().then(setHistory).catch(() => {})
  }, [detections])

  const all = [...detections, ...history.filter(h => !detections.find(d => d.id === h.id))]
  const withGps = all.filter(d => d.gps_coords?.lat != null)
  const positions = withGps.map(d => [d.gps_coords.lat!, d.gps_coords.lon!] as [number, number])
  const center: [number, number] = positions.length > 0 ? positions[0] : [20, 0]

  return (
    <>
      {selected && (
        <DetailModal
          detection={selected}
          onClose={() => setSelected(null)}
          onRetrain={() => setSelected(null)}
        />
      )}

      <div className="rounded-xl overflow-hidden relative" style={{ border: '1px solid #e2e8f0' }}>

        {/* Map */}
        <MapContainer center={center} zoom={positions.length > 0 ? 17 : 2} style={{ height: '580px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {positions.length > 0 && <FitBounds positions={positions} />}
          <MapClickHandler onClose={() => { setSelected(null); setHighlighted(null) }} />

          {withGps.map((d, i) => {
            const isHighlighted = highlighted === d.id
            return d.requires_review ? (
              <Marker
                key={i}
                position={[d.gps_coords.lat!, d.gps_coords.lon!]}
                icon={pulsingIcon}
                eventHandlers={{ click: (e) => { e.originalEvent.stopPropagation(); setSelected(d) } }}
              />
            ) : (
              <CircleMarker
                key={i}
                center={[d.gps_coords.lat!, d.gps_coords.lon!]}
                radius={isHighlighted ? 12 : 8}
                pathOptions={{
                  color: d.pestType.toLowerCase() === 'unhealthy' ? '#dc2626' : '#16a34a',
                  fillColor: d.pestType.toLowerCase() === 'unhealthy' ? '#ef4444' : '#22c55e',
                  fillOpacity: isHighlighted ? 1 : 0.85,
                  weight: isHighlighted ? 3 : 2,
                }}
                eventHandlers={{ click: (e) => { e.originalEvent.stopPropagation(); setSelected(d) } }}
              />
            )
          })}
        </MapContainer>

        {/* Detection list panel — overlaid on left */}
        <div
          className="absolute top-3 left-3 bottom-3 flex flex-col rounded-xl overflow-hidden"
          style={{
            width: 260,
            background: 'rgba(255,255,255,0.97)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 24px rgba(15,23,42,0.12)',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Panel header */}
          <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>Detections</p>
            <p className="text-lg font-bold mt-0.5" style={{ color: '#0f172a' }}>{all.length}</p>
            <div className="flex gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#ef4444' }} />
                {all.filter(d => d.pestType.toLowerCase() === 'unhealthy' && !d.requires_review).length} unhealthy
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#d97706' }} />
                {all.filter(d => d.requires_review).length} review
              </span>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="overflow-y-auto flex-1">
            {all.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                <p className="text-xs" style={{ color: '#94a3b8' }}>No detections yet.<br />Upload a drone image to begin.</p>
              </div>
            ) : (
              all.map((d) => {
                const color = statusColor(d)
                const label = statusLabel(d)
                const hasGps = d.gps_coords?.lat != null
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelected(d)}
                    onMouseEnter={() => setHighlighted(d.id)}
                    onMouseLeave={() => setHighlighted(null)}
                    className="w-full text-left px-4 py-3 transition-colors"
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      background: highlighted === d.id ? '#f8fafc' : 'transparent',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-xs font-semibold capitalize truncate" style={{ color: '#0f172a' }}>
                          {d.pestType}
                        </span>
                      </div>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color }}>
                        {d.confidence.toFixed(1)}%
                      </span>
                    </div>

                    {/* Confidence bar */}
                    <div className="w-full h-1 rounded-full mb-1.5" style={{ background: '#f1f5f9' }}>
                      <div className="h-full rounded-full" style={{ width: `${d.confidence}%`, background: color }} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{
                        background: color + '18',
                        color,
                      }}>
                        {label}
                      </span>
                      {hasGps ? (
                        <span className="text-xs" style={{ color: '#94a3b8' }}>
                          {d.gps_coords.lat!.toFixed(4)}, {d.gps_coords.lon!.toFixed(4)}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: '#cbd5e1' }}>No GPS</span>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-5 px-5 py-2.5 text-xs"
          style={{ background: 'rgba(255,255,255,0.95)', borderTop: '1px solid #f1f5f9', zIndex: 999 }}>
          <span className="flex items-center gap-1.5" style={{ color: '#64748b' }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#ef4444' }} />
            Confirmed unhealthy
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#64748b' }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#22c55e' }} />
            Healthy
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#64748b' }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#d97706' }} />
            Pending review
          </span>
          <span className="ml-auto font-mono" style={{ color: '#94a3b8' }}>
            {withGps.length} / {all.length} with GPS
          </span>
        </div>
      </div>
    </>
  )
}

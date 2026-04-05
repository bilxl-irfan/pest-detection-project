import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { Detection } from '../types'
import { api } from '../services/api'

interface Props { latestDetections: Detection[] }

function StatCard({
  label, value, sub, accent = '#0f172a',
}: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #e2e8f0', borderLeft: `3px solid ${accent}` }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94a3b8' }}>{label}</p>
      <p className="text-3xl font-bold leading-none" style={{ color: accent === '#0f172a' ? '#0f172a' : accent }}>{value}</p>
      {sub && <p className="text-xs mt-2" style={{ color: '#94a3b8' }}>{sub}</p>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg shadow-lg px-3 py-2 text-xs" style={{ background: '#0f172a', color: 'white', border: 'none' }}>
      <p className="font-semibold mb-1" style={{ color: '#94a3b8' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function Overview({ latestDetections }: Props) {
  const [history, setHistory] = useState<Detection[]>([])

  useEffect(() => {
    api.getHistory().then(setHistory).catch(() => {})
  }, [latestDetections])

  const all = [...latestDetections, ...history.filter(h => !latestDetections.find(d => d.id === h.id))]

  const total = all.length
  const unhealthy = all.filter(d => d.pestType.toLowerCase() === 'unhealthy').length
  const hitlPending = all.filter(d => d.requires_review).length
  const uniqueGps = new Set(
    all.filter(d => d.gps_coords?.lat != null)
      .map(d => `${d.gps_coords.lat!.toFixed(5)},${d.gps_coords.lon?.toFixed(5)}`)
  ).size

  const byDate = all.reduce<Record<string, { healthy: number; unhealthy: number }>>((acc, d) => {
    const date = new Date(d.timestamp).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
    if (!acc[date]) acc[date] = { healthy: 0, unhealthy: 0 }
    const key = d.pestType.toLowerCase() === 'unhealthy' ? 'unhealthy' : 'healthy'
    acc[date][key]++
    return acc
  }, {})

  const chartData = Object.entries(byDate)
    .map(([date, counts]) => ({ date, ...counts }))
    .slice(-14)

  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Detections" value={total} accent="#0f172a" />
        <StatCard
          label="Unhealthy Tiles"
          value={unhealthy}
          accent="#dc2626"
          sub={total > 0 ? `${((unhealthy / total) * 100).toFixed(0)}% of scanned area` : undefined}
        />
        <StatCard
          label="Pending Review"
          value={hitlPending}
          accent="#d97706"
          sub="awaiting human label"
        />
        <StatCard
          label="GPS Locations"
          value={uniqueGps}
          accent="#16a34a"
          sub={uniqueGps > 0 ? 'unique coordinates' : 'upload GPS-tagged images'}
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold" style={{ color: '#0f172a' }}>Health Trend</h2>
            <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Daily breakdown of healthy vs unhealthy detections</p>
          </div>
        </div>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-sm rounded-lg" style={{ background: '#f8fafc', color: '#94a3b8', border: '1px dashed #e2e8f0' }}>
            No scan data yet — upload a drone image to begin.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Line type="monotone" dataKey="healthy" stroke="#16a34a" strokeWidth={2} dot={{ r: 3, fill: '#16a34a', strokeWidth: 0 }} name="Healthy" />
              <Line type="monotone" dataKey="unhealthy" stroke="#dc2626" strokeWidth={2} dot={{ r: 3, fill: '#dc2626', strokeWidth: 0 }} name="Unhealthy" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Detections table */}
      {all.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <h2 className="text-sm font-semibold" style={{ color: '#0f172a' }}>Recent Detections</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {['ID', 'Classification', 'Confidence', 'Status', 'Timestamp'].map(h => (
                  <th key={h} className="px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {all.slice(0, 10).map((d, i) => (
                <tr key={d.id} style={{ borderBottom: i < 9 ? '1px solid #f8fafc' : 'none' }}
                  className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-3 font-mono text-xs truncate max-w-[160px]" style={{ color: '#64748b' }}>{d.id}</td>
                  <td className="px-6 py-3">
                    <span className="font-medium capitalize text-sm" style={{ color: '#0f172a' }}>{d.pestType}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                        <div className="h-full rounded-full" style={{
                          width: `${d.confidence}%`,
                          background: d.confidence >= 70 ? '#dc2626' : d.requires_review ? '#d97706' : '#16a34a'
                        }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: d.confidence >= 70 ? '#dc2626' : d.requires_review ? '#d97706' : '#16a34a' }}>
                        {d.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium" style={{
                      background: d.requires_review ? '#fffbeb' : '#f0fdf4',
                      color: d.requires_review ? '#92400e' : '#166534',
                    }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: d.requires_review ? '#d97706' : '#16a34a' }} />
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs" style={{ color: '#94a3b8' }}>
                    {new Date(d.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

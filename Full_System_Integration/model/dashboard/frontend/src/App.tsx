import { useState, useCallback } from 'react'
import { api } from './services/api'
import type { Detection } from './types'
import DetectionViewer from './components/DetectionViewer'
import MapPlaceholder from './components/MapPlaceholder'
import Overview from './components/Overview'
import InfoPage from './components/InfoPage'
import NotificationBell from './components/NotificationBell'
import type { AppNotification } from './components/NotificationBell'
import ScanReport from './components/ScanReport'

type Tab = 'overview' | 'detections' | 'map' | 'info'

const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const VideoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
)

const SpinnerIcon = () => (
  <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
)

export default function App() {
  const [tab, setTab] = useState<Tab>('overview')
  const [uploading, setUploading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [latestDetections, setLatestDetections] = useState<Detection[]>([])
  const [videoFramesSampled, setVideoFramesSampled] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  // Scan report (only shown after a fresh upload, not from history)
  const [reportDetections, setReportDetections] = useState<Detection[]>([])
  const [showReport, setShowReport] = useState(false)

  function addNotification(detections: Detection[], extra?: string) {
    const healthy = detections.filter(d => !d.requires_review && d.pestType.toLowerCase() === 'healthy').length
    const unhealthy = detections.filter(d => !d.requires_review && d.pestType.toLowerCase() !== 'healthy').length
    const uncertain = detections.filter(d => d.requires_review).length
    const parts = [
      unhealthy > 0 ? `${unhealthy} unhealthy` : '',
      healthy > 0 ? `${healthy} healthy` : '',
      uncertain > 0 ? `${uncertain} uncertain` : '',
    ].filter(Boolean)
    const body = parts.join(' · ') + (extra ? ` · ${extra}` : '') + ' — click to view'
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: `Scan complete — ${detections.length} tile${detections.length !== 1 ? 's' : ''}`,
      body,
      timestamp: new Date(),
      read: false,
    }, ...prev])
  }

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    setVideoFramesSampled(null)
    setShowReport(false)
    try {
      const result = await api.upload(file)
      const dets = result.detections ?? []
      setLatestDetections(dets)
      setReportDetections(dets)
      setShowReport(true)
      setRefreshKey(k => k + 1)
      addNotification(dets)
    } catch (err: any) {
      setUploadError(err.message ?? 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }, [])

  const handleVideoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideo(true)
    setUploadError('')
    setVideoFramesSampled(null)
    setShowReport(false)
    try {
      const result = await api.uploadVideo(file)
      const dets = result.detections ?? []
      setLatestDetections(dets)
      setReportDetections(dets)
      setShowReport(true)
      setVideoFramesSampled(result.frames_sampled ?? 0)
      setRefreshKey(k => k + 1)
      addNotification(dets, `${result.frames_sampled} frame${result.frames_sampled !== 1 ? 's' : ''}`)
    } catch (err: any) {
      setUploadError(err.message ?? 'Video upload failed')
    } finally {
      setUploadingVideo(false)
      e.target.value = ''
    }
  }, [])

  const busy = uploading || uploadingVideo

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'detections', label: 'Detections' },
    { id: 'map', label: 'GIS Map' },
    { id: 'info', label: 'Guide' },
  ]

  const best = latestDetections.length > 0
    ? [...latestDetections].sort((a, b) => b.confidence - a.confidence)[0]
    : null

  return (
    <div className="min-h-screen" style={{ background: '#f1f5f9' }}>
      {/* Header */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ background: '#16a34a', width: 28, height: 28, borderRadius: 6 }}
              className="flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-tight">AGROSCAN</span>
              <span style={{ color: '#475569' }} className="text-xs ml-2 font-normal">/ Pest Detection System</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span style={{ color: '#475569' }} className="text-xs">YOLOv5-DP · PDT-UAV</span>
            <div style={{ width: 1, height: 16, background: '#1e293b' }} />

            <NotificationBell
              notifications={notifications}
              onRead={id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
              onReadAll={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              onGoToDetections={() => setTab('detections')}
            />

            <div style={{ width: 1, height: 16, background: '#1e293b' }} />

            {/* Upload Image */}
            <label className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${busy ? 'cursor-not-allowed opacity-60' : ''}`}
              style={{ background: uploading ? '#1e293b' : '#16a34a', color: uploading ? '#475569' : 'white' }}>
              {uploading ? <SpinnerIcon /> : <UploadIcon />}
              {uploading ? 'Processing…' : 'Upload Image'}
              <input type="file" accept=".jpg,.jpeg,.png,.JPG" onChange={handleUpload} disabled={busy} className="hidden" />
            </label>

            {/* Upload Video */}
            <label className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${busy ? 'cursor-not-allowed opacity-60' : ''}`}
              style={{ background: uploadingVideo ? '#1e293b' : '#1d4ed8', color: uploadingVideo ? '#475569' : 'white' }}>
              {uploadingVideo ? <SpinnerIcon /> : <VideoIcon />}
              {uploadingVideo ? 'Processing…' : 'Upload Video'}
              <input type="file" accept=".mp4,.mov,.avi,.mkv,.MP4,.MOV" onChange={handleVideoUpload} disabled={busy} className="hidden" />
            </label>
          </div>
        </div>
      </header>

      {/* Sub-nav */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative px-4 py-3 text-sm font-medium transition-colors"
              style={{ color: tab === t.id ? '#0f172a' : '#64748b' }}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t" style={{ background: '#16a34a' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        {/* Error banner */}
        {uploadError && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm border"
            style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {uploadError}
          </div>
        )}

        {/* Success banner */}
        {best && !uploadError && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm border"
            style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {videoFramesSampled !== null
              ? <><strong>{videoFramesSampled}</strong> frame{videoFramesSampled !== 1 ? 's' : ''} · <strong>{latestDetections.length}</strong> tile{latestDetections.length !== 1 ? 's' : ''} —</>
              : <>{latestDetections.length} tile{latestDetections.length !== 1 ? 's' : ''} —</>
            }
            {' '}top result: <strong className="ml-1 capitalize">{best.pestType}</strong>
            <span className="ml-1" style={{ color: '#15803d' }}>at {best.confidence.toFixed(1)}%</span>
          </div>
        )}

        {/* Scan report — only after fresh upload */}
        {showReport && reportDetections.length > 0 && (
          <ScanReport
            detections={reportDetections}
            onClose={() => setShowReport(false)}
            onViewDetections={() => { setTab('detections'); setShowReport(false) }}
          />
        )}

        {/* Tab content */}
        <div key={refreshKey}>
          {tab === 'overview' && <Overview latestDetections={latestDetections} />}
          {tab === 'detections' && (
            <DetectionViewer detections={latestDetections} onDetectionsChange={() => setRefreshKey(k => k + 1)} />
          )}
          {tab === 'map' && <MapPlaceholder detections={latestDetections} />}
          {tab === 'info' && <InfoPage />}
        </div>
      </div>
    </div>
  )
}

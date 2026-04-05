import type { Detection, Alert } from '../types'

const BASE = import.meta.env.VITE_API_BASE ?? ''

async function throwIfError(res: Response): Promise<void> {
  if (!res.ok) {
    try {
      const body = await res.clone().json()
      throw new Error(body.detail ?? body.error ?? `Server error ${res.status}`)
    } catch {
      throw new Error(await res.text() || `Server error ${res.status}`)
    }
  }
}

export const api = {
  async upload(file: File): Promise<{ detections: Detection[]; best: Detection }> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: form })
    await throwIfError(res)
    return res.json()
  },

  async uploadVideo(file: File): Promise<{ detections: Detection[]; best: Detection; frames_sampled: number }> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE}/api/upload_video`, { method: 'POST', body: form })
    await throwIfError(res)
    return res.json()
  },

  async getAlerts(): Promise<{ alerts: Alert[]; activeCount: number }> {
    const res = await fetch(`${BASE}/alerts`)
    return res.json()
  },

  async getHistory(): Promise<Detection[]> {
    const res = await fetch(`${BASE}/outputs/processed/detection_history.json`)
    if (!res.ok) return []
    return res.json()
  },

  async retrain(payload: { image_id: string; label: string; bbox: number[] }) {
    const res = await fetch(`${BASE}/api/retrain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  async getRetrainStatus(): Promise<{ status: string; message: string }> {
    const res = await fetch(`${BASE}/api/retrain/status`)
    return res.json()
  },
}

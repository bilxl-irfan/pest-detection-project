export interface GpsCoords {
  lat: number | null
  lon: number | null
}

export interface Detection {
  id: string
  pestType: string
  confidence: number
  status: string
  requires_review: boolean
  gps_coords: GpsCoords
  tile_index?: number
  tile_bbox?: number[]
  xai_url?: string | null
  original_url: string
  timestamp: string
}

export interface Alert {
  id: number
  pestType: string
  severity: string
  fieldId: string
  status: string
  requires_review: boolean
  gps_coords: GpsCoords
}

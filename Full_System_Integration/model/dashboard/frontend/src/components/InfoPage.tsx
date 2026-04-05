import { useState } from 'react'

// ─── Shared ───────────────────────────────────────────────────────────────────

function Dot({ color }: { color: string }) {
  return <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
}

function CalloutBadge({
  id, color, active, onClick,
}: { id: number; color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={`Learn about #${id}`}
      style={{
        width: 20, height: 20, borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
        background: active ? color : 'white',
        color: active ? 'white' : color,
        border: `2px solid ${color}`,
        fontSize: 10, fontWeight: 800,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'all 0.15s',
        lineHeight: 1,
      }}
    >
      {id}
    </button>
  )
}

// ─── Concepts ─────────────────────────────────────────────────────────────────

const CONCEPTS = [
  {
    id: 1,
    title: 'Status Badge',
    color: '#16a34a',
    detail: 'Shows the model\'s verdict at a glance. Green = Healthy (no pest detected). Red = Unhealthy (pest or disease present). Amber = Uncertain (model confidence 40–60%, human review required). The badge updates to your label after HITL submission.',
  },
  {
    id: 2,
    title: 'XAI Heatmap Badge',
    color: '#d97706',
    detail: 'Visible when an Explainable AI overlay exists for this tile. Uses EigenCAM to highlight the image regions that most influenced the model\'s decision. Only generated for Unhealthy detections to save compute. Toggle Raw ↔ Heatmap in the detail view.',
  },
  {
    id: 3,
    title: 'Confidence Score',
    color: '#1d4ed8',
    detail: 'How certain the model is, expressed as 0–100%. ≥ 70% = high confidence (result is confirmed). 40–60% = uncertain (HITL review triggered). For Healthy tiles the score displays green — higher means more certain it is safe. For Unhealthy tiles the score is red — higher means greater risk.',
  },
  {
    id: 4,
    title: 'Risk Level',
    color: '#dc2626',
    detail: 'Derived from confidence for Unhealthy detections. High Risk (≥ 70%) → act immediately. Medium (50–69%) → monitor closely. Low (< 50%) → minor severity. Always shown in green for Healthy tiles regardless of confidence, since high certainty of health is a good thing.',
  },
  {
    id: 5,
    title: 'Classification Label',
    color: '#7c3aed',
    detail: 'The model\'s predicted class for this 640×640 image tile. Healthy — no pest or disease detected. Unhealthy — pest or disease is present. After HITL review, this label updates to reflect your correction (e.g. the specific pest class you selected).',
  },
  {
    id: 6,
    title: 'HITL Labelling',
    color: '#0891b2',
    detail: 'Human-in-the-Loop (HITL) review is triggered when the model is uncertain (confidence 40–60%), or when a confident Unhealthy detection needs a specific pest class. You pick Healthy or Unhealthy; if Unhealthy you then select the pest class. Your label is saved to the training dataset and a background retraining job is queued.',
  },
]

// ─── Sample Card Mockup ───────────────────────────────────────────────────────

function SampleCard({ active, onToggle }: { active: number | null; onToggle: (id: number) => void }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', width: '100%', maxWidth: 300 }}>
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #162032 100%)' }}>
        {/* Simulated EigenCAM heatmap blob */}
        <div style={{
          position: 'absolute', top: '26%', left: '20%', width: '58%', height: '52%', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(239,68,68,0.55) 0%, rgba(251,146,60,0.32) 45%, transparent 70%)',
        }} />
        {/* Leaf texture dots */}
        {[[14, 22], [42, 58], [68, 28], [52, 72], [28, 78]].map(([t, l], i) => (
          <div key={i} style={{
            position: 'absolute', top: `${t}%`, left: `${l}%`,
            width: 10, height: 10, borderRadius: '50%', background: 'rgba(74,222,128,0.13)',
          }} />
        ))}

        {/* Status badge [1] */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(15,23,42,0.82)', borderRadius: 6, padding: '4px 8px',
          }}>
            <Dot color="#dc2626" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#dc2626' }}>Unhealthy</span>
          </div>
          <CalloutBadge id={1} color={CONCEPTS[0].color} active={active === 1} onClick={() => onToggle(1)} />
        </div>

        {/* XAI badge [2] */}
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <CalloutBadge id={2} color={CONCEPTS[1].color} active={active === 2} onClick={() => onToggle(2)} />
          <div style={{ background: 'rgba(217,119,6,0.9)', borderRadius: 6, padding: '4px 8px' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>XAI</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 14 }}>
        {/* Classification + confidence [3] [5] */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>Unhealthy</span>
            <CalloutBadge id={5} color={CONCEPTS[4].color} active={active === 5} onClick={() => onToggle(5)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#dc2626' }}>87.4%</span>
            <CalloutBadge id={3} color={CONCEPTS[2].color} active={active === 3} onClick={() => onToggle(3)} />
          </div>
        </div>

        {/* Confidence bar */}
        <div style={{ height: 4, borderRadius: 4, background: '#f1f5f9', marginBottom: 4 }}>
          <div style={{ height: '100%', width: '87%', borderRadius: 4, background: '#dc2626' }} />
        </div>
        {/* Risk [4] */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>0%</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#dc2626' }}>Risk: High</span>
            <CalloutBadge id={4} color={CONCEPTS[3].color} active={active === 4} onClick={() => onToggle(4)} />
          </div>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>100%</span>
        </div>

        <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>Jun 1, 2025, 2:32 PM</p>

        {/* HITL [6] */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '4px 8px', flex: 1, marginRight: 6 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#92400e' }}>Predicts: Unhealthy (87.4%)</p>
              <p style={{ fontSize: 10, color: '#92400e', marginTop: 1 }}>Uncertain — classify this tile:</p>
            </div>
            <CalloutBadge id={6} color={CONCEPTS[5].color} active={active === 6} onClick={() => onToggle(6)} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, padding: '5px 0', borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#166534' }}>Healthy</span>
            </div>
            <div style={{ flex: 1, padding: '5px 0', borderRadius: 6, background: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#991b1b' }}>Unhealthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Concept Row ──────────────────────────────────────────────────────────────

function ConceptRow({ concept, active, onClick }: {
  concept: typeof CONCEPTS[0]; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 transition-all"
      style={{ border: `1px solid ${active ? concept.color : '#e2e8f0'}`, background: active ? `${concept.color}0d` : 'white' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
          background: active ? concept.color : `${concept.color}1a`,
          color: active ? 'white' : concept.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800,
        }}>{concept.id}</span>
        <span style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', flex: 1 }}>{concept.title}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"
          style={{ transform: active ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {active && (
        <p style={{ marginTop: 10, fontSize: 12, color: '#475569', lineHeight: 1.65, paddingLeft: 34 }}>
          {concept.detail}
        </p>
      )}
    </button>
  )
}

// ─── Confidence Guide ─────────────────────────────────────────────────────────

function ConfidenceGuide() {
  const zones = [
    {
      range: '≥ 70%', label: 'High Confidence', bar: '88%',
      healthy: { color: '#16a34a', text: 'Confident Healthy', sub: 'No action needed. Card confirmed green.' },
      unhealthy: { color: '#dc2626', text: 'High Risk Unhealthy', sub: 'Immediate attention recommended.' },
    },
    {
      range: '40–69%', label: 'Uncertain', bar: '54%',
      healthy: { color: '#d97706', text: 'Uncertain', sub: 'HITL review triggered — you classify it.' },
      unhealthy: { color: '#d97706', text: 'Uncertain', sub: 'HITL review triggered — you classify it.' },
    },
    {
      range: '< 40%', label: 'Low Confidence', bar: '26%',
      healthy: { color: '#16a34a', text: 'Low Confidence Healthy', sub: 'Confirmed healthy, low certainty.' },
      unhealthy: { color: '#ea580c', text: 'Low Risk Unhealthy', sub: 'Detected but model is not very sure.' },
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2e8f0' }}>
      <h2 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 4 }}>Confidence Score Guide</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
        The same confidence percentage means different things depending on what was detected.
      </p>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 12, marginBottom: 8 }}>
        <div />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot color="#16a34a" /><span style={{ fontSize: 11, fontWeight: 600, color: '#166534' }}>Healthy detection</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot color="#dc2626" /><span style={{ fontSize: 11, fontWeight: 600, color: '#991b1b' }}>Unhealthy detection</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {zones.map(z => (
          <div key={z.range} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 12, alignItems: 'start' }}>
            {/* Range label */}
            <div style={{ paddingTop: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{z.range}</span>
              <div style={{ height: 4, borderRadius: 4, background: '#f1f5f9', marginTop: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: z.bar, borderRadius: 4, background: '#cbd5e1' }} />
              </div>
            </div>
            {/* Healthy column */}
            <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '8px 10px', border: '1px solid #bbf7d0' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: z.healthy.color }}>{z.healthy.text}</p>
              <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{z.healthy.sub}</p>
            </div>
            {/* Unhealthy column */}
            <div style={{ background: '#fef2f2', borderRadius: 8, padding: '8px 10px', border: '1px solid #fecaca' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: z.unhealthy.color }}>{z.unhealthy.text}</p>
              <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{z.unhealthy.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── HITL Flow ────────────────────────────────────────────────────────────────

function FlowNode({ icon, label, sub, bg, border, textColor }: {
  icon: string; label: string; sub: string; bg: string; border: string; textColor: string
}) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
      <div style={{ fontSize: 20, marginBottom: 3 }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: textColor, lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 10, color: textColor, opacity: 0.65, marginTop: 3 }}>{sub}</div>
    </div>
  )
}

function Arrow() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div style={{ width: 1, height: 12, background: '#cbd5e1' }} />
        <svg width="8" height="6" viewBox="0 0 8 6" fill="#cbd5e1"><path d="M4 6L0 0h8z" /></svg>
      </div>
    </div>
  )
}

function HitlFlow() {
  return (
    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2e8f0' }}>
      <h2 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 4 }}>Human-in-the-Loop (HITL) Flow</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
        What the dashboard asks you based on the model's confidence and classification.
      </p>

      {/* Root node */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 240 }}>
          <FlowNode icon="🤖" label="Model runs inference" sub="YOLOv5-DP scores every 640×640 tile" bg="#0f172a" border="#1e293b" textColor="white" />
        </div>
      </div>
      <Arrow />

      {/* Three branches */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {/* Confident Healthy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FlowNode icon="✅" label="Confident Healthy" sub="conf ≥ 70%" bg="#f0fdf4" border="#bbf7d0" textColor="#166534" />
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px' }}>
            <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
              No action needed. Card confirmed green. Score displays green.
            </p>
          </div>
        </div>

        {/* Uncertain */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FlowNode icon="⚠️" label="Uncertain" sub="conf 40–60%" bg="#fffbeb" border="#fde68a" textColor="#92400e" />
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px' }}>
            <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
              Shows model prediction + confidence. You choose:
            </p>
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              <div style={{ flex: 1, padding: '4px 0', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 5, textAlign: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#166534' }}>Healthy</span>
                <p style={{ fontSize: 9, color: '#64748b', marginTop: 1 }}>label updated, done</p>
              </div>
              <div style={{ flex: 1, padding: '4px 0', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 5, textAlign: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#991b1b' }}>Unhealthy</span>
                <p style={{ fontSize: 9, color: '#64748b', marginTop: 1 }}>→ pick pest class</p>
              </div>
            </div>
          </div>
        </div>

        {/* Confident Unhealthy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FlowNode icon="🚨" label="Confident Unhealthy" sub="conf ≥ 70%" bg="#fef2f2" border="#fecaca" textColor="#991b1b" />
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px' }}>
            <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
              Directly asks for the pest class (aphids, whitefly, thrips, mites, blight, rust…).
            </p>
          </div>
        </div>
      </div>

      <Arrow />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 240 }}>
          <FlowNode icon="🔁" label="Background Retraining" sub="Label saved → model fine-tuned on new data" bg="#f0f9ff" border="#bae6fd" textColor="#075985" />
        </div>
      </div>
    </div>
  )
}

// ─── XAI Section ──────────────────────────────────────────────────────────────

function XaiSection() {
  return (
    <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>Explainable AI (XAI) — EigenCAM</h2>
      </div>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.6 }}>
        AGROSCAN uses <strong>EigenCAM</strong> to generate saliency heatmaps that show <em>where</em> in the image the model focused when making its decision — not just what it decided.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { icon: '🎯', title: 'What it shows', text: 'Warmer colours (red/orange) highlight regions with the highest model attention. These are the pixels that most influenced the Unhealthy prediction.' },
          { icon: '🔬', title: 'How it works', text: 'EigenCAM computes the principal component of the final convolutional feature maps. The heatmap is masked to the bounding box of the top detection for focused insight.' },
          { icon: '⚡', title: 'When it runs', text: 'Only generated for Unhealthy detections. Healthy tiles skip XAI to save GPU cycles. If a tile shows the XAI badge, the heatmap is available in the detail view.' },
          { icon: '🔄', title: 'How to use it', text: 'Open a detection\'s detail panel and click the Raw / Heatmap toggle in the top-right of the image. The overlay blends at 85% opacity so the original tile is still visible beneath.' },
        ].map(item => (
          <div key={item.title} style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>{item.title}</p>
            <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InfoPage() {
  const [active, setActive] = useState<number | null>(null)

  const toggle = (id: number) => setActive(prev => prev === id ? null : id)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 style={{ fontWeight: 700, fontSize: 20, color: 'white' }}>How to Read Detections</h1>
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, maxWidth: 640 }}>
          AGROSCAN uses a <strong style={{ color: '#e2e8f0' }}>YOLOv5-DP</strong> model trained on the PDT-UAV dataset to analyse drone imagery.
          Each uploaded image is sliced into <strong style={{ color: '#e2e8f0' }}>640×640 px tiles</strong>, run through the AI model,
          and each tile's result appears as a detection card. Use the annotated card below to understand what every element means.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {[
            { label: 'YOLOv5-DP Model', color: '#16a34a' },
            { label: 'EigenCAM XAI', color: '#d97706' },
            { label: 'HITL Retraining', color: '#7c3aed' },
            { label: 'GPS Mapping', color: '#0891b2' },
          ].map(tag => (
            <span key={tag.label} style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
              background: `${tag.color}22`, color: tag.color, border: `1px solid ${tag.color}44`,
            }}>{tag.label}</span>
          ))}
        </div>
      </div>

      {/* Card Anatomy */}
      <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 2 }}>Detection Card Anatomy</h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
          Click the numbered badges on the card or the list to learn what each element means.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
          <SampleCard active={active} onToggle={toggle} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CONCEPTS.map(c => (
              <ConceptRow key={c.id} concept={c} active={active === c.id} onClick={() => toggle(c.id)} />
            ))}
          </div>
        </div>
      </div>

      {/* Confidence Guide */}
      <ConfidenceGuide />

      {/* HITL Flow */}
      <HitlFlow />

      {/* XAI */}
      <XaiSection />
    </div>
  )
}

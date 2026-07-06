"use client"

import { useState } from "react"

type NodeId = "solver" | "zkvm" | "vdf" | "block" | "consensus" | "discount"

const NODES: { id: NodeId; label: string; sub: string; x: number; y: number; w: number; h: number; tone: "blue" | "ink" | "ink-soft" }[] = [
  { id: "solver",    label: "Solver",          sub: "RNA candidate",        x: 40,  y: 60,  w: 140, h: 56, tone: "ink-soft" },
  { id: "zkvm",      label: "zkVM Prover",     sub: "Execution proof",      x: 220, y: 60,  w: 160, h: 56, tone: "blue" },
  { id: "discount",  label: "δ(k) Discount",   sub: "≤ δ_max = 15%",        x: 420, y: 60,  w: 160, h: 56, tone: "ink-soft" },
  { id: "vdf",       label: "VDF Floor",       sub: "Class group squaring", x: 220, y: 180, w: 160, h: 56, tone: "blue" },
  { id: "consensus", label: "Consensus Check", sub: "Beacon + proof verify",x: 420, y: 180, w: 160, h: 56, tone: "ink" },
  { id: "block",     label: "Block Sealed",    sub: "Cost = (1−δ)·C_h",     x: 620, y: 120, w: 140, h: 56, tone: "blue" },
]

const EDGES: { from: NodeId; to: NodeId; label: string; danger?: boolean }[] = [
  { from: "solver",   to: "zkvm",      label: "witness" },
  { from: "zkvm",     to: "discount",  label: "proof" },
  { from: "discount", to: "consensus", label: "k, δ(k)" },
  { from: "vdf",      to: "consensus", label: "y, π" },
  { from: "consensus",to: "block",     label: "valid" },
]

export function ArchitectureDiagram() {
  const [active, setActive] = useState<NodeId | null>(null)

  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n])) as Record<NodeId, typeof NODES[0]>

  return (
    <div
      className="relative w-full overflow-x-auto"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      <svg viewBox="0 0 800 280" className="w-full h-auto" style={{ minWidth: 720 }} role="img" aria-label="BC-UPoW architecture diagram">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)" />
          </marker>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="800" height="280" fill="url(#grid)" />

        {/* Edges */}
        {EDGES.map((e, i) => {
          const a = nodeMap[e.from]
          const b = nodeMap[e.to]
          const x1 = a.x + a.w
          const y1 = a.y + a.h / 2
          const x2 = b.x
          const y2 = b.y + b.h / 2
          const isHot = active === e.from || active === e.to
          return (
            <g key={i} style={{ opacity: isHot ? 1 : 0.7 }}>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="var(--accent)"
                strokeWidth={isHot ? 2.5 : 1.5}
                strokeDasharray="4 4"
                markerEnd="url(#arrow)"
                style={{ animation: "data-flow 1.6s linear infinite" }}
              />
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 6}
                textAnchor="middle"
                fontFamily="'Space Mono', monospace"
                fontSize="9"
                fill="var(--fg-muted)"
              >
                {e.label}
              </text>
            </g>
          )
        })}

        {/* Nodes */}
        {NODES.map(n => {
          const isActive = active === n.id
          const fill = n.tone === "blue" ? "var(--accent)" : n.tone === "ink" ? "var(--fg)" : "var(--bg-inset)"
          const stroke = "var(--accent)"
          // Choose text color based on the *fill* (theme-aware via CSS vars), not hardcoded white
          const isLightFill = n.tone === "blue" || n.tone === "ink"
          const textColor = isLightFill ? "var(--fg-inverse)" : "var(--fg)"
          const subColor = isLightFill ? "color-mix(in srgb, var(--fg-inverse) 75%, transparent)" : "var(--fg-muted)"
          return (
            <g
              key={n.id}
              onMouseEnter={() => setActive(n.id)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={n.x} y={n.y} width={n.w} height={n.h}
                fill={fill}
                stroke={stroke}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{ filter: isActive ? "drop-shadow(0 0 8px var(--accent))" : "none", transition: "all 0.2s ease" }}
              />
              <text
                x={n.x + n.w / 2}
                y={n.y + 22}
                textAnchor="middle"
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight="700"
                fontSize="13"
                fill={textColor}
              >
                {n.label}
              </text>
              <text
                x={n.x + n.w / 2}
                y={n.y + 40}
                textAnchor="middle"
                fontFamily="'Space Mono', monospace"
                fontSize="9"
                fill={subColor}
              >
                {n.sub}
              </text>
            </g>
          )
        })}

        {/* Annotation: ceiling */}
        <g>
          <rect x="400" y="40" width="200" height="14" fill="var(--bg-inset)" stroke="var(--border)" />
          <text x="500" y="50" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="9" fill="var(--fg-muted)">
            C_attack ≥ (1 − δ_max) · C_h
          </text>
        </g>
      </svg>

      {/* Legend */}
      <div className="px-4 py-3 flex flex-wrap items-center gap-4 text-[10px] font-mono tracking-widest" style={{ borderTop: "1px solid var(--border)", color: "var(--fg-muted)" }}>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3" style={{ background: "var(--accent)" }} />
          SECURITY-CRITICAL
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3" style={{ background: "var(--fg)" }} />
          COMPOSITION
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3" style={{ background: "var(--bg-inset)", border: "1px solid var(--border-strong)" }} />
          USEFUL / DISCOUNT
        </span>
        <span style={{ marginLeft: "auto", color: "var(--fg-subtle)" }}>
          HOVER A NODE TO TRACE THE FLOW
        </span>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"

const SUPPLY_SEGMENTS = [
  { label: "Mining Rewards (Planned)", pct: 99.9, color: "var(--accent)" },
  { label: "Genesis Allocation",       pct: 0.1,  color: "var(--fg)" },
  { label: "Public Sale",              pct: 0,    color: "var(--fg-muted)" },
  { label: "Ecosystem DAO",            pct: 0,    color: "var(--fg-subtle)" },
  { label: "Team & Advisors",          pct: 0,    color: "var(--fg-subtle)" },
]

const TOKEN_FACTS = [
  { label: "Ticker",          val: "$RIBO" },
  { label: "Max Supply",      val: "21,000,000" },
  { label: "Algorithm",       val: "BC-UPoW" },
  { label: "Block Time",      val: "VDF-Determined" },
  { label: "Block Reward",    val: "12.5 $RIBO (planned)" },
  { label: "Halving",         val: "Every 210,000 blocks" },
  { label: "Current Supply",  val: "0 — not yet deployed" },
  { label: "Status",          val: "In development" },
]

// All eras are UPCOMING — no era has begun because the network has not launched.
const HALVING = [
  { era: "Era 1", blocks: "0–210,000",      reward: "12.5 $RIBO",   current: false, upcoming: true  },
  { era: "Era 2", blocks: "210,001–420,000", reward: "6.25 $RIBO",  current: false, upcoming: false },
  { era: "Era 3", blocks: "420,001–630,000", reward: "3.125 $RIBO", current: false, upcoming: false },
  { era: "Era 4", blocks: "630,001–840,000", reward: "1.5625 $RIBO",current: false, upcoming: false },
]

const UTILITIES = [
  "Pay for computational task submissions",
  "DAO governance votes",
  "Research priority bidding",
  "Staking for node validation",
  "Reward useful-work solvers",
]

function DonutChart({ segments }: { segments: typeof SUPPLY_SEGMENTS }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true) }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const size = 200, cx = size / 2, cy = size / 2, r = 70, innerR = 44

  // Pre-compute cumulative percentages WITHOUT mutating during render —
  // avoids the React 19 "immutability" lint error.
  const startPcts: number[] = []
  let acc = 0
  for (const seg of segments) {
    startPcts.push(acc)
    acc += seg.pct
  }

  const paths = segments.map((seg, i) => {
    const startPct = startPcts[i]
    const endPct = startPct + seg.pct
    const startAngle = (startPct / 100) * 360 - 90
    const endAngle   = (endPct   / 100) * 360 - 90
    const start    = { x: cx + r     * Math.cos((startAngle * Math.PI) / 180), y: cy + r     * Math.sin((startAngle * Math.PI) / 180) }
    const end      = { x: cx + r     * Math.cos((endAngle   * Math.PI) / 180), y: cy + r     * Math.sin((endAngle   * Math.PI) / 180) }
    const innerStart = { x: cx + innerR * Math.cos((startAngle * Math.PI) / 180), y: cy + innerR * Math.sin((startAngle * Math.PI) / 180) }
    const innerEnd   = { x: cx + innerR * Math.cos((endAngle   * Math.PI) / 180), y: cy + innerR * Math.sin((endAngle   * Math.PI) / 180) }
    const largeArc = seg.pct > 50 ? 1 : 0
    const d = [
      `M ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
      "Z",
    ].join(" ")
    return { d, color: seg.color }
  })

  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill={p.color}
              stroke="var(--bg-elevated)"
              strokeWidth="2"
              style={{
                opacity: animated ? 1 : 0,
                transform: animated ? "none" : "scale(0.8)",
                transformOrigin: "center",
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
              }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-mono font-bold text-lg" style={{ color: "var(--accent)" }}>21M</div>
          <div className="font-mono text-xs" style={{ color: "var(--fg-subtle)" }}>MAX</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 shrink-0" style={{ background: seg.color }} />
              <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>{seg.label}</span>
            </div>
            <span className="font-mono text-xs font-bold" style={{ color: "var(--accent)" }}>{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div
      className="p-6"
      style={{ border: "2px solid var(--border)", background: "var(--bg)" }}
    >
      <div className="font-mono text-xs tracking-widest mb-4" style={{ color: "var(--accent)" }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export function TokenomicsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="tokenomics"
      ref={ref}
      className="py-24 px-4 md:px-8 relative"
      style={{ background: "var(--bg-elevated)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(var(--border-strong) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative max-w-6xl mx-auto">
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs tracking-widest mb-6"
            style={{ border: "1px solid var(--border-strong)", color: "var(--accent)" }}
          >
            TOKENOMICS
          </div>
          <h2
            className="font-sans font-bold text-4xl md:text-6xl leading-tight tracking-tight"
            style={{ color: "var(--fg)" }}
          >
            Bitcoin economics.<br />
            <span style={{ color: "var(--accent)" }}>Bounded purpose.</span>
          </h2>
        </div>

        {/* Status banner — IN DEVELOPMENT */}
        <div
          className="mb-12 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          style={{
            border: "2px solid var(--warning)",
            background: "color-mix(in srgb, var(--warning) 8%, transparent)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--warning)", animation: "pulse-blue 1.6s ease-in-out infinite" }}
            />
            <span
              className="font-mono text-xs font-bold tracking-widest"
              style={{ color: "var(--warning)" }}
            >
              NOT YET DEPLOYED
            </span>
          </div>
          <span className="font-sans text-xs md:text-sm" style={{ color: "var(--fg-muted)" }}>
            The numbers below describe the planned token design from the whitepaper. No $RIBO has been minted, sold, or distributed. Token parameters may change before launch.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Token facts */}
          <Card title="TOKEN SPECIFICATIONS">
            <div className="flex flex-col">
              {TOKEN_FACTS.map((fact, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3"
                  style={{
                    borderBottom: i < TOKEN_FACTS.length - 1 ? "1px solid var(--border)" : "none",
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.5s ease ${i * 60}ms`,
                  }}
                >
                  <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>{fact.label}</span>
                  <span className="font-mono text-xs font-bold text-right" style={{ color: "var(--fg)" }}>{fact.val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Donut chart */}
          <Card title="PLANNED TOKEN DISTRIBUTION">
            <DonutChart segments={SUPPLY_SEGMENTS} />
          </Card>

          {/* Halving + utility */}
          <div className="flex flex-col gap-6">
            <Card title="PLANNED HALVING SCHEDULE">
              <div className="flex flex-col">
                {HALVING.map((era, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 px-2"
                    style={{
                      borderBottom: i < HALVING.length - 1 ? "1px solid var(--border)" : "none",
                      background: era.upcoming ? "var(--accent-soft)" : "transparent",
                      margin: era.upcoming ? "0 -8px" : 0,
                    }}
                  >
                    <div>
                      <div
                        className="font-mono text-xs font-bold"
                        style={{ color: era.upcoming ? "var(--accent)" : "var(--fg)" }}
                      >
                        {era.era} {era.upcoming && "← LAUNCH ERA"}
                      </div>
                      <div className="font-mono text-xs" style={{ color: "var(--fg-subtle)", fontSize: "9px" }}>
                        {era.blocks}
                      </div>
                    </div>
                    <div className="font-mono text-sm font-bold" style={{ color: "var(--fg)" }}>{era.reward}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="$RIBO UTILITY (PLANNED)">
              <div className="flex flex-col gap-3">
                {UTILITIES.map((u, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 shrink-0" style={{ background: "var(--accent)" }} />
                    <span className="font-sans text-xs" style={{ color: "var(--fg)" }}>{u}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

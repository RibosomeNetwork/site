"use client"

import { useEffect, useState } from "react"

// Spec / planning values (NOT live network metrics — RIBO hasn't launched).
// Rendered as a continuous marquee ticker so labels never overlap, even on
// narrow screens.
const STATS = [
  { label: "Status",          value: "PRE-TESTNET" },
  { label: "Spec",            value: "BC-UPoW v1.0" },
  { label: "VDF",             value: "Class Group (Unknown Order)" },
  { label: "Useful Work",     value: "RNA Inverse Design" },
  { label: "δ_max (Planned)", value: "15%" },
  { label: "α (Planned)",     value: "0.0015" },
  { label: "k_sat",           value: "10,000" },
  { label: "Key Cap",         value: "1% per epoch" },
  { label: "Proof System",    value: "zkVM (succinct)" },
  { label: "Launch Default",  value: "δ_max = 0" },
  { label: "Verification",    value: "R = { ∃w : H(w) = h_w }" },
  { label: "Attack Bound",    value: "C_attack ≥ (1−δ_max)·C_h" },
]

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center gap-2 shrink-0 px-4 py-1"
      style={{ borderRight: "1px solid var(--border)" }}
    >
      <span
        className="font-mono text-[10px] tracking-widest"
        style={{ color: "var(--fg-subtle)" }}
      >
        {label}
      </span>
      <span
        className="font-mono text-xs font-bold whitespace-nowrap"
        style={{ color: "var(--fg)" }}
      >
        {value}
      </span>
    </div>
  )
}

export function LiveStats() {
  const [now, setNow] = useState<string>("--:--:--")

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setNow(d.toISOString().substring(11, 19) + " UTC")
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  // Duplicate the stats array so the marquee loops seamlessly
  const looped = [...STATS, ...STATS]

  return (
    <div
      className="border-y overflow-hidden"
      style={{
        background: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)",
        borderColor: "var(--border)",
        backdropFilter: "blur(8px)",
      }}
      aria-label="Protocol specification summary"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center gap-3">
        {/* Status badge — fixed on left */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--warning)", animation: "pulse-blue 1.4s ease-in-out infinite" }}
          />
          <span className="font-mono text-[10px] tracking-widest whitespace-nowrap" style={{ color: "var(--accent)" }}>
            IN DEVELOPMENT
          </span>
        </div>

        {/* Marquee ticker — fills remaining width, scrolls left continuously */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className="flex w-max"
            style={{ animation: "marqueeLeft 40s linear infinite" }}
          >
            {looped.map((s, i) => (
              <StatChip key={i} label={s.label} value={s.value} />
            ))}
          </div>
          {/* Fade edges so chips don't appear/disappear abruptly */}
          <div
            className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--bg-elevated), transparent)" }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-8 pointer-events-none"
            style={{ background: "linear-gradient(to left, var(--bg-elevated), transparent)" }}
          />
        </div>

        {/* Clock — fixed on right (desktop only) */}
        <span
          className="hidden md:inline font-mono text-[10px] shrink-0 tabular-nums"
          style={{ color: "var(--fg-subtle)" }}
        >
          {now}
        </span>
      </div>
    </div>
  )
}

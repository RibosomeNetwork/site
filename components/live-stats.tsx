"use client"

import { useEffect, useState } from "react"

const STATS = [
  { label: "Block Height",     value: 847291,        fmt: (n: number) => n.toLocaleString(), suffix: "" },
  { label: "VDF Step",         value: 1984721,       fmt: (n: number) => n.toLocaleString(), suffix: "" },
  { label: "Active Verifiers", value: 142,           fmt: (n: number) => n.toLocaleString(), suffix: "" },
  { label: "Discount Applied", value: 0.017,         fmt: (n: number) => n.toFixed(1), suffix: "%" },
  { label: "δ_max",            value: 0.15,          fmt: (n: number) => n.toFixed(0), suffix: "%" },
  { label: "Network Hashrate", value: 4.27,          fmt: (n: number) => n.toFixed(2), suffix: " PH/s" },
  { label: "Period",           value: 847291 / 2016, fmt: (n: number) => Math.floor(n).toString(), suffix: "" },
  { label: "Next Halving",     value: 210000 - 47709,fmt: (n: number) => Math.floor(n).toLocaleString(), suffix: " blocks" },
]

export function LiveStats() {
  const [idx, setIdx] = useState(0)
  const [now, setNow] = useState<string>("--:--:--")

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setNow(d.toISOString().substring(11, 19) + " UTC")
      setIdx(v => (v + 1) % STATS.length)
    }
    tick()
    const t = setInterval(tick, 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="border-y overflow-hidden"
      style={{
        background: "color-mix(in srgb, var(--bg-elevated) 50%, transparent)",
        borderColor: "var(--border)",
        backdropFilter: "blur(8px)",
      }}
      aria-label="Live protocol statistics"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--success)", animation: "pulse-blue 1.4s ease-in-out infinite" }}
          />
          <span className="font-mono text-[10px] tracking-widest" style={{ color: "var(--accent)" }}>
            MAINNET LIVE
          </span>
        </div>
        <div className="flex-1 grid grid-cols-4 md:grid-cols-8 gap-0 overflow-hidden">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="px-3 py-1 flex flex-col items-start min-w-0"
              style={{
                borderLeft: "1px solid var(--border)",
                opacity: i === idx ? 1 : 0.6,
                transition: "opacity 0.4s ease",
              }}
            >
              <span
                className="font-mono text-[9px] tracking-widest truncate"
                style={{ color: "var(--fg-subtle)" }}
              >
                {s.label}
              </span>
              <span
                className="font-mono font-bold text-xs truncate"
                style={{ color: "var(--fg)", fontVariantNumeric: "tabular-nums" }}
              >
                {s.fmt(s.value)}{s.suffix}
              </span>
            </div>
          ))}
        </div>
        <span
          className="hidden md:inline font-mono text-[10px] shrink-0"
          style={{ color: "var(--fg-subtle)" }}
        >
          {now}
        </span>
      </div>
    </div>
  )
}

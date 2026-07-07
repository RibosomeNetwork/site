"use client"

import { useEffect, useRef, useState } from "react"

// Reframed roadmap: Genesis is IN PROGRESS (whitepaper published, no
// mainnet yet). Phase II (Zero-Discount Default launch) is the active
// milestone — it ships with δ_max = 0 per whitepaper §9. Subsequent
// phases are upcoming.
const PHASES = [
  {
    phase: "GENESIS",
    period: "2024 — 2025",
    status: "active" as const, // in progress
    items: [
      "BC-UPoW Architecture Published",
      "Class Group VDF specification",
      "zkVM verification relation formalized",
      "RNA verifier (Zuker-Stiegler + McCaskill) spec'd",
      "Open-source reference implementation in progress",
    ],
  },
  {
    phase: "ZERO-DISCOUNT LAUNCH",
    period: "Planned — TBD",
    status: "upcoming" as const,
    items: [
      "Initial launch with δ_max = 0 (Section 9)",
      "Solutions submitted, verified, stored on-chain",
      "Discount to sequential baseline = 0",
      "Ledger security fully preserved",
      "Game-theoretic behaviour observed across epochs",
    ],
  },
  {
    phase: "SYNTHESIS",
    period: "Planned — TBD",
    status: "upcoming" as const,
    items: [
      "Discount ceiling (δ_max) activated via consensus upgrade",
      "Formal security proof completed",
      "Multiple useful problem rotation",
      "zkVM hardware acceleration",
      "Per-key submission cap (1%) enforced",
    ],
  },
  {
    phase: "TRANSCRIPTION",
    period: "Future",
    status: "upcoming" as const,
    items: [
      "Merge-mining protocol enabled",
      "Additional useful problems (e.g. protein folding)",
      "Cross-epoch strategy mitigations hardened",
      "Epoch-scale → block-scale proving (if zkVM overhead allows)",
      "10K+ zkVM submissions per period",
    ],
  },
]

const STATUS_STYLE = {
  active:   { bg: "var(--warning)",      fg: "white",               border: "var(--warning)",      label: "IN PROGRESS" },
  upcoming: { bg: "var(--accent-soft)",  fg: "var(--fg-subtle)",    border: "var(--border)",       label: "PLANNED" },
} as const

export function RoadmapSection() {
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
      id="roadmap"
      ref={ref}
      className="py-24 px-4 md:px-8 relative"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--border-strong) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs tracking-widest mb-6"
            style={{ border: "1px solid var(--border-strong)", color: "var(--accent)" }}
          >
            ROADMAP
          </div>
          <h2
            className="font-sans font-bold text-4xl md:text-6xl leading-tight tracking-tight"
            style={{ color: "var(--fg)" }}
          >
            From genesis<br />
            <span style={{ color: "var(--accent)" }}>to transcription.</span>
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-2xl mt-6" style={{ color: "var(--fg-muted)" }}>
            RIBO is being developed conservatively. The whitepaper explicitly recommends launching with the discount parameter set to zero (δ<sub>max</sub> = 0) — solutions can still be submitted, verified inside the zkVM, and stored on-chain, but the discount to the sequential baseline is zero, preserving full ledger security while behaviour is observed across multiple epochs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASES.map((phase, i) => {
            const style = STATUS_STYLE[phase.status]
            const isActive = phase.status === "active"
            return (
              <div
                key={phase.phase}
                style={{
                  border: `2px solid ${isActive ? "var(--warning)" : "var(--border)"}`,
                  background: "var(--bg-elevated)",
                  boxShadow: isActive ? "4px 4px 0 var(--warning)" : "2px 2px 0 var(--accent-soft)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(24px)",
                  transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-sm" style={{ color: "var(--fg)" }}>
                      {phase.phase}
                    </span>
                    <span
                      className="font-mono text-xs px-2 py-0.5"
                      style={{ background: style.bg, color: style.fg, fontSize: "8px" }}
                    >
                      {style.label}
                    </span>
                  </div>
                  <div className="font-mono text-xs" style={{ color: "var(--fg-subtle)" }}>
                    {phase.period}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex flex-col gap-2.5">
                    {phase.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <div
                          className="w-3.5 h-3.5 shrink-0 mt-0.5 flex items-center justify-center"
                          style={{
                            background: phase.status === "active" ? "var(--accent-soft)" : "var(--bg-inset)",
                            border: `1px solid ${phase.status === "active" ? "var(--accent)" : "var(--border-strong)"}`,
                          }}
                        >
                          {phase.status === "active" && (
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: "var(--accent)", animation: "pulse-blue 1.5s ease-in-out infinite" }}
                            />
                          )}
                        </div>
                        <span
                          className="font-sans text-xs leading-relaxed"
                          style={{ color: "var(--fg)" }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs tracking-widest" style={{ color: "var(--fg-subtle)" }}>
              OVERALL PROGRESS (SPEC → LAUNCH)
            </span>
            <span className="font-mono text-xs font-bold" style={{ color: "var(--accent)" }}>18%</span>
          </div>
          <div
            className="h-3 relative"
            style={{ background: "var(--accent-soft)", border: "1px solid var(--border)" }}
          >
            <div
              className="h-full absolute left-0 top-0"
              style={{
                width: visible ? "18%" : "0%",
                background: "var(--accent)",
                transition: "width 1.5s cubic-bezier(0.16,1,0.3,1) 0.5s",
              }}
            />
            <div
              className="absolute top-0 h-full w-0.5 -translate-x-0.5"
              style={{
                left: visible ? "18%" : "0%",
                background: "var(--fg)",
                transition: "left 1.5s cubic-bezier(0.16,1,0.3,1) 0.5s",
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[10px]" style={{ color: "var(--fg-subtle)" }}>SPEC PUBLISHED</span>
            <span className="font-mono text-[10px]" style={{ color: "var(--fg-subtle)" }}>ZERO-DISCOUNT LAUNCH</span>
            <span className="font-mono text-[10px]" style={{ color: "var(--fg-subtle)" }}>δ_max ACTIVATED</span>
          </div>
        </div>
      </div>
    </section>
  )
}

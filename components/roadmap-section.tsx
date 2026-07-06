"use client"

import { useEffect, useRef, useState } from "react"

const PHASES = [
  {
    phase: "GENESIS",
    period: "Q1 2025",
    status: "complete" as const,
    items: [
      "BC-UPoW Architecture Published",
      "Class Group VDF Setup",
      "Testnet v0.1: 0% Discount",
      "zkVM Integration (RISC Zero/SP1)",
      "Theorem 1 Formalization",
    ],
  },
  {
    phase: "IGNITION",
    period: "Q2–Q3 2025",
    status: "active" as const,
    items: [
      "Mainnet launch — LIVE",
      "zkVM Prover Software v1.0",
      "VDF Sequential Evaluator",
      "Discount Strategy Analysis",
      "First Valid zkVM Submissions",
    ],
  },
  {
    phase: "SYNTHESIS",
    period: "Q4 2025",
    status: "upcoming" as const,
    items: [
      "Discount Ceiling (δ_max) Activated",
      "Formal Security Proof Completed",
      "Multiple Useful Problem Rotation",
      "zkVM Hardware Acceleration",
      "Bridge to Ethereum",
    ],
  },
  {
    phase: "TRANSCRIPTION",
    period: "2026",
    status: "upcoming" as const,
    items: [
      "Merge-mining Protocol Enabled",
      "Protein Folding Verifier Added",
      "Cross-Period Strategy Mitigations",
      "Epoch-scale → Block-scale Proving",
      "10K zkVM Submissions/Period",
    ],
  },
]

const STATUS_STYLE = {
  complete: { bg: "var(--accent)", fg: "var(--accent-on)", border: "var(--accent)",  label: "COMPLETE" },
  active:   { bg: "var(--fg)",     fg: "var(--fg-inverse)", border: "var(--accent)", label: "LIVE NOW" },
  upcoming: { bg: "var(--accent-soft)", fg: "var(--fg-subtle)", border: "var(--border)", label: "UPCOMING" },
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASES.map((phase, i) => {
            const style = STATUS_STYLE[phase.status]
            const isActive = phase.status === "active"
            return (
              <div
                key={phase.phase}
                style={{
                  border: `2px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                  background: "var(--bg-elevated)",
                  boxShadow: isActive ? "4px 4px 0 var(--accent)" : "2px 2px 0 var(--accent-soft)",
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
                            background: phase.status === "complete" ? "var(--accent)" : phase.status === "active" ? "var(--accent-soft)" : "var(--bg-inset)",
                            border: `1px solid ${phase.status === "complete" ? "var(--accent)" : "var(--border-strong)"}`,
                          }}
                        >
                          {phase.status === "complete" && (
                            <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                              <path d="M1 3.5L3 5.5L6 1.5" stroke="var(--accent-on)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {phase.status === "active" && (
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: "var(--accent)", animation: "pulse-blue 1.5s ease-in-out infinite" }}
                            />
                          )}
                        </div>
                        <span
                          className="font-sans text-xs leading-relaxed"
                          style={{ color: phase.status === "upcoming" ? "var(--fg-subtle)" : "var(--fg)" }}
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
              OVERALL PROGRESS
            </span>
            <span className="font-mono text-xs font-bold" style={{ color: "var(--accent)" }}>38%</span>
          </div>
          <div
            className="h-3 relative"
            style={{ background: "var(--accent-soft)", border: "1px solid var(--border)" }}
          >
            <div
              className="h-full absolute left-0 top-0"
              style={{
                width: visible ? "38%" : "0%",
                background: "var(--accent)",
                transition: "width 1.5s cubic-bezier(0.16,1,0.3,1) 0.5s",
              }}
            />
            <div
              className="absolute top-0 h-full w-0.5 -translate-x-0.5"
              style={{
                left: visible ? "38%" : "0%",
                background: "var(--fg)",
                transition: "left 1.5s cubic-bezier(0.16,1,0.3,1) 0.5s",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

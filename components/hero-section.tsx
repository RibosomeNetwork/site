"use client"

import { useEffect, useRef, useState, lazy, Suspense } from "react"

// 3D background is heavy — lazy load it
const RiboBackground = lazy(() => import("./ribo-background").then(m => ({ default: m.RiboBackground })))

const BASES = ["A", "U", "G", "C"]
const RNA_SEQ = "AUGCGAAUUCGGCUAGCUAGCUAAGGCUAGCUAGCUAAGGCUAGCUAGCAUAGCUAGGCUAGCUAAGGCUAGCUAGCUAAGGC"

function PixelCounter({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    const target = parseInt(value.replace(/[^0-9]/g, ""))
    let current = 0
    const steps = 40
    const inc = Math.ceil(target / steps)
    const t = setInterval(() => {
      current = Math.min(current + inc, target)
      const suffix = value.replace(/[0-9,]/g, "")
      setDisplay(current.toLocaleString() + suffix)
      if (current >= target) clearInterval(t)
    }, 35)
    return () => clearInterval(t)
  }, [value])

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="font-mono font-bold text-4xl md:text-5xl tracking-tighter"
        style={{ color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}
      >
        {display}
      </div>
      <div
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: "var(--fg-muted)" }}
      >
        {label}
      </div>
    </div>
  )
}

function RNATicker() {
  const seq = RNA_SEQ.repeat(4)
  return (
    <div
      className="overflow-hidden w-full"
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "6px 0",
      }}
    >
      <div className="ticker-tape gap-6">
        {seq.split("").map((base, i) => (
          <span
            key={i}
            className="font-mono text-xs font-bold"
            style={{
              color: base === "A" ? "var(--accent)" : base === "U" ? "var(--fg)" : base === "G" ? "var(--fg-muted)" : "var(--fg-subtle)",
              letterSpacing: "0.15em",
            }}
          >
            {base}
          </span>
        ))}
      </div>
    </div>
  )
}

export function HeroSection() {
  const [cursor, setCursor] = useState(true)
  const [currentLine, setCurrentLine] = useState(0)

  const TERMINAL_LINES = [
    "> RIBO v2.0.0 — BC-UPoW",
    "> VDF Setup: Class Group (Unknown Order)",
    "> Sequential floor: 100% active",
    "> zkVM verified RNA submissions: 142",
    "> Discount applied: 1.7%",
    "> Block cost bounded below (1 - δ_max) * C_h",
    "> Consensus: VDF + zkVM execution proof",
    "_",
  ]

  useEffect(() => {
    const c = setInterval(() => setCursor(v => !v), 530)
    return () => clearInterval(c)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentLine(v => (v + 1) % (TERMINAL_LINES.length - 1))
    }, 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--border-strong) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Blue corner accent — top right */}
      <div
        className="absolute top-0 right-0 w-[40%] h-[55%] pointer-events-none"
        style={{
          background: "linear-gradient(225deg, var(--accent-soft) 0%, transparent 70%)",
        }}
      />

      {/* 3D RNA/Blockchain background — only on large viewports to save mobile GPU */}
      <div className="absolute inset-0 hidden md:block" style={{ opacity: 0.5 }}>
        <Suspense fallback={null}>
          <RiboBackground />
        </Suspense>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 md:px-8 pt-28 pb-20">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Headline */}
          <div>
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-3 px-3 py-1.5 mb-8 font-mono text-xs tracking-widest"
              style={{
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                background: "var(--accent-soft)",
              }}
            >
              <span
                className="w-1.5 h-1.5"
                style={{ background: "var(--accent)", animation: "pulse-blue 1.4s ease-in-out infinite" }}
              />
              MAINNET LIVE — BLOCK #847,291
            </div>

            {/* Headline */}
            <h1
              className="font-sans font-bold leading-[0.96] tracking-tight mb-6"
              style={{
                fontSize: "clamp(3.2rem, 7vw, 6.5rem)",
                color: "var(--fg)",
              }}
            >
              Useful<br />
              <span style={{ color: "var(--accent)" }}>Work,</span>{" "}
              <span
                style={{
                  color: "var(--accent)",
                  textDecoration: "underline",
                  textDecorationThickness: "4px",
                  textUnderlineOffset: "6px",
                }}
              >
                Bounded.
              </span>
            </h1>

            <p
              className="text-lg md:text-xl font-sans leading-relaxed mb-8 max-w-lg"
              style={{ color: "var(--fg-muted)", fontWeight: 400 }}
            >
              A proof-of-work puzzle can be hard to solve, or it can reward work that is actually useful, but not both. RIBO resolves this with{" "}
              <strong style={{ color: "var(--fg)" }}>Bounded-Composition Useful Proof-of-Work (BC-UPoW)</strong>. Security comes from sequential time. Useful work buys a bounded discount.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#mine"
                className="inline-flex items-center gap-2 px-6 py-3.5 font-mono text-sm font-bold tracking-widest transition-all duration-150"
                style={{
                  background: "var(--accent)",
                  border: "2px solid var(--accent)",
                  boxShadow: "4px 4px 0 var(--fg)",
                  color: "var(--accent-on)",
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"
                  ;(e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 var(--fg)"
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.transform = "none"
                  ;(e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 var(--fg)"
                }}
              >
                START MINING ↗
              </a>
              <a
                href="/RIBO_Whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 font-mono text-sm font-bold tracking-widest transition-all duration-150"
                style={{
                  background: "transparent",
                  border: "2px solid var(--accent)",
                  color: "var(--accent)",
                  boxShadow: "4px 4px 0 var(--accent-soft)",
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.background = "var(--accent-soft)"
                  ;(e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.background = "transparent"
                  ;(e.currentTarget as HTMLElement).style.transform = "none"
                }}
              >
                READ WHITEPAPER
              </a>
            </div>

            {/* Quick stats */}
            <div
              className="grid grid-cols-3 gap-0"
              style={{ borderTop: "2px solid var(--border-strong)" }}
            >
              {[
                { v: "15%", l: "Max Discount" },
                { v: "VDF", l: "Seq. Floor" },
                { v: "zkVM", l: "Exec. Proof" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="py-4 text-center"
                  style={{ borderRight: i < 2 ? "1px solid var(--border-strong)" : "none" }}
                >
                  <div className="font-mono font-bold text-2xl" style={{ color: "var(--accent)" }}>{s.v}</div>
                  <div className="font-mono text-xs tracking-widest mt-0.5" style={{ color: "var(--fg-muted)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Terminal — kept as a fixed dark panel for retro feel in both themes */}
          <div className="flex flex-col gap-4">
            <div
              className="relative scanlines"
              style={{
                background: "#0D0D2B",
                border: "2px solid var(--accent)",
                boxShadow: "6px 6px 0 var(--accent-soft)",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center gap-2 px-4 py-2"
                style={{ borderBottom: "1px solid var(--border-strong)" }}
              >
                {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => (
                  <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                ))}
                <span className="font-mono text-xs ml-2" style={{ color: "var(--fg)" }}>
                  ribosome-miner — bash
                </span>
              </div>
              {/* Terminal body */}
              <div className="p-4 min-h-[200px]">
                {TERMINAL_LINES.slice(0, currentLine + 1).map((line, i) => (
                  <div
                    key={i}
                    className="font-mono text-xs leading-7"
                    style={{
                      color: i === 0 ? "var(--accent)" : i === currentLine ? "var(--fg)" : "var(--fg-muted)",
                      animation: "float-up 0.25s ease both",
                    }}
                  >
                    {line === "_" ? (
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "2px",
                          background: cursor ? "var(--accent)" : "transparent",
                          verticalAlign: "middle",
                        }}
                      />
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RNA ticker at bottom */}
      <RNATicker />
    </section>
  )
}

"use client"

import { useState, useSyncExternalStore, lazy, Suspense } from "react"

// 3D BC-UPoW visualization — lazy loaded (three.js is heavy)
const RiboBackground = lazy(() => import("./ribo-background").then(m => ({ default: m.RiboBackground })))

const RNA_SEQ = "AUGCGAAUUCGGCUAGCUAGCUAAGGCUAGCUAGCUAAGGCUAGCUAGCAUAGCUAGGCUAGCUAAGGCUAGCUAGCUAAGGC"

// SSR-safe "is mounted" flag without calling setState inside an effect
// (avoids the React 19 set-state-in-effect lint rule).
function subscribe() { return () => {} }
function getClientSnapshot() { return true }
function getServerSnapshot() { return false }

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

// Caption labels overlaid on the 3D scene to explain each element
function SceneCaption({ label, color, position }: { label: string; color: string; position: "tl" | "tr" | "bl" | "br" | "tc" }) {
  const posClass = {
    tl: "top-3 left-3",
    tr: "top-3 right-3",
    bl: "bottom-3 left-3",
    br: "bottom-3 right-3",
    tc: "top-3 left-1/2 -translate-x-1/2",
  }[position]
  return (
    <div
      className={`absolute ${posClass} font-mono text-[10px] tracking-widest px-2 py-1`}
      style={{
        background: "rgba(13, 13, 43, 0.7)",
        border: `1px solid ${color}`,
        color: color,
        backdropFilter: "blur(4px)",
      }}
    >
      {label}
    </div>
  )
}

export function HeroSection() {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

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

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 md:px-8 pt-28 pb-12">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Headline */}
          <div>
            {/* Eyebrow — IN DEVELOPMENT */}
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
              IN DEVELOPMENT — PRE-TESTNET
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
              <strong style={{ color: "var(--fg)" }}>Bounded-Composition Useful Proof-of-Work (BC-UPoW)</strong>. Security comes from sequential time. Useful work buys a bounded discount — and the protocol is currently in active development.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#protocol"
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
                READ THE SPEC ↗
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

          {/* Right: 3D BC-UPoW Visualization */}
          <div className="flex flex-col gap-3 w-full">
            <div
              className="relative overflow-hidden"
              style={{
                background: "#0D0D2B",
                border: "2px solid var(--accent)",
                boxShadow: "6px 6px 0 var(--accent-soft)",
                minHeight: "420px",
                height: "clamp(420px, 50vh, 560px)",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center justify-between gap-2 px-4 py-2 absolute top-0 left-0 right-0 z-10"
                style={{ borderBottom: "1px solid var(--border-strong)", background: "rgba(13,13,43,0.85)", backdropFilter: "blur(6px)" }}
              >
                <div className="flex items-center gap-2">
                  {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => (
                    <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                  <span className="font-mono text-xs ml-2" style={{ color: "var(--fg-muted)" }}>
                    ribo-bc-upow · live visualization
                  </span>
                </div>
                <span
                  className="font-mono text-[10px] tracking-widest px-2 py-0.5"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}
                >
                  3D
                </span>
              </div>

              {/* 3D canvas */}
              <div className="absolute inset-0">
                {mounted && (
                  <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-xs tracking-widest" style={{ color: "var(--accent)" }}>
                        INITIALIZING SCENE…
                      </span>
                    </div>
                  }>
                    <RiboBackground />
                  </Suspense>
                )}
              </div>

              {/* Caption labels overlaid on the 3D scene */}
              <SceneCaption label="◆ DNA HELIX — USEFUL WORK (RNA)" color="var(--accent-bright, #9B9BFF)" position="tl" />
              <SceneCaption label="◆ BLOCK RING — VDF SEQUENTIAL FLOOR" color="#9B9BFF" position="bl" />
              <SceneCaption label="◆ zkVM PROOFS BIND RNA → BLOCKS" color="#9B9BFF" position="br" />
              <SceneCaption label="◆ δ_max CEILING (15%)" color="var(--warning)" position="tr" />
            </div>

            {/* Caption strip below the visualization */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-0"
              style={{ border: "1px solid var(--border-strong)" }}
            >
              {[
                { l: "DNA",     d: "Useful work", c: "var(--accent)" },
                { l: "Ring",    d: "VDF floor",   c: "var(--accent)" },
                { l: "Streams", d: "zkVM proofs", c: "var(--accent)" },
                { l: "Ceiling", d: "δ_max = 15%", c: "var(--warning)" },
              ].map((x, i) => (
                <div
                  key={i}
                  className="px-3 py-2 flex flex-col"
                  style={{
                    background: "var(--bg-elevated)",
                    borderRight: i < 3 ? "1px solid var(--border-strong)" : "none",
                  }}
                >
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest"
                    style={{ color: x.c }}
                  >
                    {x.l.toUpperCase()}
                  </span>
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: "var(--fg-subtle)" }}
                  >
                    {x.d}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RNA ticker at bottom */}
      <RNATicker />
    </section>
  )
}

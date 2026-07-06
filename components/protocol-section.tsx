"use client"

import { useRef, useEffect, useState } from "react"

const PROTOCOL_STEPS = [
  {
    n: "01",
    title: "Sequential Floor",
    desc: "A Verifiable Delay Function (VDF) evaluates repeated squarings in a class group of unknown order. This establishes a baseline cost that requires inherently sequential time.",
    tech: "Class Group VDF · No Trusted Setup",
  },
  {
    n: "02",
    title: "Useful Work",
    desc: "Solvers tackle multi-state RNA inverse design. An adversary could use a free, instant oracle for this, but the protocol's security does not depend on the biological problem's hardness.",
    tech: "RNA Inverse Design · Zuker-Stiegler",
  },
  {
    n: "03",
    title: "zkVM Execution Proof",
    desc: "Solvers generate a knowledge-sound zkSNARK proving a deterministic verifier ran for at least c_min cycles and accepted the RNA candidate, bound to a fresh beacon.",
    tech: "RISC Zero / SP1 · Constant-size recursion",
  },
  {
    n: "04",
    title: "Bounded Discount",
    desc: "Valid zkVM proofs are counted per period. The biological work earns a discount off the sequential cost, but this discount is mathematically capped (e.g., at 15%).",
    tech: "Monotone Concave Curve · Ceiling Invariance",
  },
  {
    n: "05",
    title: "Block Sealed",
    desc: "The combination of the VDF evaluation and the zkVM proofs determines block validity. Even with perfect biological algorithms, attack cost never drops below (1-δ_max) * C_h.",
    tech: "Provable Security · Bounded-Composition",
  },
]

function StepCard({ step, index }: { step: typeof PROTOCOL_STEPS[0]; index: number }) {
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
    <div
      ref={ref}
      className="relative flex gap-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(-24px)",
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms`,
      }}
    >
      {/* Number column */}
      <div className="flex flex-col items-center">
        <div
          className="w-12 h-12 flex items-center justify-center font-mono font-bold text-sm shrink-0"
          style={{
            background: "var(--accent)",
            color: "var(--accent-on)",
            border: "2px solid var(--accent)",
            boxShadow: "3px 3px 0 var(--fg)",
          }}
        >
          {step.n}
        </div>
        {index < PROTOCOL_STEPS.length - 1 && (
          <div
            className="w-0.5 flex-1 mt-2"
            style={{ background: "var(--border-strong)", minHeight: "40px" }}
          />
        )}
      </div>

      {/* Content */}
      <div className="pl-6 pb-10">
        <h3
          className="font-sans font-bold text-xl mb-2"
          style={{ color: "var(--fg)" }}
        >
          {step.title}
        </h3>
        <p
          className="font-sans text-sm leading-relaxed mb-3 max-w-xl"
          style={{ color: "var(--fg-muted)" }}
        >
          {step.desc}
        </p>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 font-mono text-xs"
          style={{
            background: "var(--accent-soft)",
            border: "1px solid var(--border-strong)",
            color: "var(--accent)",
          }}
        >
          {step.tech}
        </div>
      </div>
    </div>
  )
}

export function ProtocolSection() {
  return (
    <section
      id="protocol"
      className="py-24 px-4 md:px-8 relative"
      style={{ background: "var(--bg)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--border-strong) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: steps */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs tracking-widest mb-6"
              style={{ border: "1px solid var(--border-strong)", color: "var(--accent)" }}
            >
              HOW IT WORKS
            </div>
            <h2
              className="font-sans font-bold text-4xl md:text-5xl leading-tight tracking-tight mb-12"
              style={{ color: "var(--fg)" }}
            >
              Bounded-Composition<br />Useful Proof-of-Work<br />
              <span style={{ color: "var(--accent)" }}>Architecture.</span>
            </h2>

            {PROTOCOL_STEPS.map((step, i) => (
              <StepCard key={step.n} step={step} index={i} />
            ))}
          </div>

          {/* Right: comparison + visual */}
          <div className="flex flex-col gap-6">
            {/* Comparison table */}
            <div
              style={{
                border: "2px solid var(--border-strong)",
                background: "var(--bg-elevated)",
              }}
            >
              {/* Header */}
              <div
                className="grid grid-cols-3 font-mono text-xs tracking-widest py-3 px-4"
                style={{ borderBottom: "1px solid var(--border-strong)", color: "var(--fg-subtle)" }}
              >
                <span></span>
                <span>SHA-256</span>
                <span style={{ color: "var(--accent)" }}>BC-UPoW (RIBO)</span>
              </div>

              {[
                ["Security source", "Hash preimages", "VDF Sequential Time"],
                ["Useful Work", "None", "RNA Inverse Design"],
                ["Coupling", "Total (Dangerous)", "Bounded Discount (Safe)"],
                ["Proof system", "SHA-256", "zkVM (RISC Zero/SP1)"],
                ["Algorithmic Progress", "Erodes Security", "Ceiling Invariance"],
                ["Discount Ceiling", "N/A", "Strictly capped (e.g., 15%)"],
              ].map(([label, old, ribo], i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 py-3 px-4 text-xs font-sans"
                  style={{ borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}
                >
                  <span style={{ color: "var(--fg-subtle)", fontSize: "11px" }}>{label}</span>
                  <span style={{ color: "var(--fg-subtle)", fontSize: "11px", textDecoration: "line-through" }}>{old}</span>
                  <span style={{ color: "var(--fg)", fontSize: "11px", fontWeight: 500 }}>{ribo}</span>
                </div>
              ))}
            </div>

            {/* Scientific quote */}
            <div
              className="p-6"
              style={{
                border: "2px solid var(--accent)",
                background: "var(--accent-soft)",
                boxShadow: "4px 4px 0 var(--accent-soft)",
              }}
            >
              <div className="font-mono text-xs tracking-widest mb-4" style={{ color: "var(--accent)" }}>
                FROM THE WHITEPAPER
              </div>
              <blockquote
                className="font-sans text-base leading-relaxed italic"
                style={{ color: "var(--fg)" }}
              >
                "A security guarantee that degrades as algorithms improve is not a security guarantee. We stop trying to solve this by finding a harder useful problem. We solve it by refusing to let the useful problem touch security beyond a number fixed in advance."
              </blockquote>
              <div className="mt-4 font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
                — RIBO: BC-UPoW Architecture
              </div>
            </div>

            {/* Hash vis */}
            <div
              className="p-4"
              style={{
                border: "1px solid var(--border-strong)",
                background: "var(--bg-inset)",
              }}
            >
              <div className="font-mono text-xs tracking-widest mb-3" style={{ color: "var(--fg-muted)" }}>
                BLOCK #847,291 — WORK PROOF
              </div>
              <div
                className="font-mono text-xs leading-6 break-all"
                style={{ color: "var(--fg-muted)", fontSize: "9px" }}
              >
                ribo:AUGCGAAUUCGGCUA<span style={{ color: "var(--accent)" }}>GCUAGCUAAGGCUAGCUAGCUAAGGC</span>UAGCUAGCAUAGCUAGG
                <br />
                energy:-42.7kcal/mol binding:0.94 verified:true block:847291
                <br />
                <span style={{ color: "var(--fg-subtle)" }}>
                  hash:0x1a1aff847291c3f2a8b6d4e9f0231ac8b7f3d2e1a9c4b5f6e3d7a2c8b1f4e9d3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

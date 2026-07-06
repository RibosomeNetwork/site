"use client"

import { useRef, useEffect, useState } from "react"

const SCIENCE_TASKS = [
  {
    id: "mfe",
    label: "Minimum Free Energy",
    desc: "Zuker-Stiegler recurrence (1981). The deterministic backbone that checks if the sequence folds into the target structure.",
    complexity: "O(n³)",
    value: "VERIFIER" as const,
    example: "Fixed-point integer arithmetic",
  },
  {
    id: "partition",
    label: "Partition Function",
    desc: "McCaskill's algorithm (1990). Computes the equilibrium probability of the target structure to ensure it is at least one half.",
    complexity: "O(n³)",
    value: "VERIFIER" as const,
    example: "Boltzmann ensemble probability",
  },
  {
    id: "anti-target",
    label: "Anti-Target Avoidance",
    desc: "Ensures the minimum-free-energy structure under given conditions never equals any specified anti-target structure.",
    complexity: "O(n³)",
    value: "VERIFIER" as const,
    example: "Off-target therapeutic avoidance",
  },
  {
    id: "inverse",
    label: "Inverse Folding (The Useful Problem)",
    desc: "Finding a sequence that satisfies all conditions. Solvers use ML or heuristics, but consensus only checks the zkVM proof.",
    complexity: "NP-hard",
    value: "SOLVER" as const,
    example: "LEARNA / Eterna heuristics",
  },
]

const INSTITUTIONS = [
  "MIT Biology Dept.", "Stanford Medicine", "Pfizer R&D", "NIH Genomics",
  "EMBL", "Broad Institute", "CureDAO", "Novartis",
]

function PriorityBar({ value }: { value: "VERIFIER" | "SOLVER" }) {
  const vals = { VERIFIER: 100, SOLVER: 50 }
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(vals[value]), 400)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2 flex-1 relative"
        style={{ background: "var(--accent-soft)", border: "1px solid var(--border)" }}
      >
        <div
          className="h-full absolute left-0 top-0 transition-all duration-1000"
          style={{
            width: `${w}%`,
            background: value === "VERIFIER" ? "var(--accent)" : "color-mix(in srgb, var(--accent) 50%, transparent)",
          }}
        />
      </div>
      <span
        className="font-mono text-xs font-bold w-20 text-right"
        style={{ color: "var(--accent)", fontSize: "9px" }}
      >
        {value}
      </span>
    </div>
  )
}

export function ScienceSection() {
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
      id="science"
      ref={ref}
      className="py-24 px-4 md:px-8"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs tracking-widest mb-6"
            style={{ border: "1px solid var(--border-strong)", color: "var(--accent)" }}
          >
            THE SCIENCE
          </div>
          <h2
            className="font-sans font-bold text-4xl md:text-6xl leading-tight tracking-tight mb-6"
            style={{ color: "var(--fg)" }}
          >
            Deterministic Verifiers.<br />
            <span style={{ color: "var(--accent)" }}>zkVM Execution Proofs.</span>
          </h2>
          <p className="font-sans text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            The Zuker-Stiegler recurrence and McCaskill's algorithm are the decades-old deterministic backbone of our verifier. We use zkVMs in the most conservative way: prove a fixed program ran, on a fixed input, for at least a fixed number of cycles.
          </p>
        </div>

        {/* Task grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {SCIENCE_TASKS.map((task, i) => (
            <div
              key={task.id}
              className="p-6"
              style={{
                border: "2px solid var(--border)",
                background: "var(--bg-elevated)",
                boxShadow: "2px 2px 0 var(--accent-soft)",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(20px)",
                transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div
                    className="font-mono text-xs tracking-widest mb-1"
                    style={{ color: "var(--accent)" }}
                  >
                    TASK TYPE
                  </div>
                  <h3 className="font-sans font-bold text-lg" style={{ color: "var(--fg)" }}>
                    {task.label}
                  </h3>
                </div>
                <div
                  className="font-mono text-xs px-2 py-1"
                  style={{ background: "var(--fg)", color: "var(--fg-inverse)" }}
                >
                  {task.complexity}
                </div>
              </div>

              <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: "var(--fg-muted)" }}>
                {task.desc}
              </p>

              <div className="mb-3">
                <div
                  className="font-mono text-xs tracking-widest mb-2"
                  style={{ color: "var(--fg-subtle)" }}
                >
                  PROTOCOL ROLE
                </div>
                <PriorityBar value={task.value} />
              </div>

              <div
                className="flex items-center gap-2 px-3 py-2 font-mono text-xs"
                style={{
                  background: "var(--accent-soft)",
                  border: "1px solid var(--border)",
                  color: "var(--fg-muted)",
                }}
              >
                <span style={{ color: "var(--accent)" }}>EX:</span> {task.example}
              </div>
            </div>
          ))}
        </div>

        {/* Institutions marquee */}
        <div>
          <div
            className="font-mono text-xs tracking-widest mb-4 text-center"
            style={{ color: "var(--fg-subtle)" }}
          >
            INSTITUTIONS COMPUTING ON RIBO
          </div>
          <div
            className="overflow-hidden py-4"
            style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
          >
            <div
              className="flex gap-12 whitespace-nowrap"
              style={{ animation: "marqueeLeft 20s linear infinite" }}
            >
              {[...INSTITUTIONS, ...INSTITUTIONS].map((inst, i) => (
                <span
                  key={i}
                  className="font-mono font-bold text-sm tracking-widest"
                  style={{ color: i % 3 === 0 ? "var(--accent)" : "var(--fg-subtle)" }}
                >
                  {inst}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Large fact block — kept as a fixed accent block (looks good in both themes) */}
        <div
          className="mt-16 p-8 md:p-12 relative overflow-hidden"
          style={{ background: "var(--accent)", border: "2px solid var(--accent)", boxShadow: "6px 6px 0 var(--fg)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="font-mono text-xs tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                THE ASYMMETRY
              </div>
              <h3 className="font-sans font-bold text-3xl md:text-4xl leading-tight text-white mb-4">
                Proof generation: Minutes.<br />Verification: Milliseconds.
              </h3>
              <p className="font-sans text-base text-white/80 leading-relaxed">
                We do not use the zero-knowledge property for anything security-critical. The real value of zkVMs is succinctness and knowledge soundness. A solver takes minutes to generate a proof; any full node verifies it instantly via recursion.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "zkVM Overhead", val: "10³-10⁴×" },
                { label: "Proof Gen Time", val: "Minutes" },
                { label: "Verification Time", val: "Millisecs" },
              ].map(s => (
                <div
                  key={s.label}
                  className="p-4"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}
                >
                  <div className="font-mono font-bold text-2xl text-white">{s.val}</div>
                  <div className="font-mono text-xs tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

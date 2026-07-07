"use client"

import { useRef, useEffect, useState } from "react"

const PROTOCOL_STEPS = [
  {
    n: "01",
    title: "Sequential Floor",
    desc: "A Verifiable Delay Function (VDF) evaluates repeated squarings in a class group of unknown order. This establishes a baseline cost that requires inherently sequential time and cannot be meaningfully accelerated by parallel hardware.",
    tech: "Class Group VDF · No Trusted Setup",
  },
  {
    n: "02",
    title: "Useful Work",
    desc: "Solvers tackle multi-state RNA inverse design — finding a single sequence that satisfies a set of target secondary structures under varying physical conditions while avoiding anti-target configurations. An adversary could use a free, instant oracle for this; the protocol's security does not depend on the biological problem's hardness.",
    tech: "RNA Inverse Design · Zuker-Stiegler",
  },
  {
    n: "03",
    title: "zkVM Execution Proof",
    desc: "Solvers generate a knowledge-sound succinct proof that a deterministic RNA verifier ran for at least c_min cycles and accepted the candidate. The proof is bound to a fresh epoch beacon, and the cryptographic hash of the discovered sequence is exposed as a public input to enforce Data Availability.",
    tech: "zkVM (RISC Zero / SP1 style) · Succinct",
  },
  {
    n: "04",
    title: "Bounded Discount",
    desc: "Valid zkVM proofs are counted per epoch. The biological work earns a discount off the sequential cost, but this discount is mathematically capped by δ_max. The discount function δ(k) = α·√k is monotone concave in the number of independently-keyed submissions k.",
    tech: "Monotone Concave Curve · Ceiling Invariance",
  },
  {
    n: "05",
    title: "Block Sealed",
    desc: "The combination of the VDF evaluation and the zkVM proofs determines block validity. Even with a perfect biological algorithm, attack cost never drops below (1 − δ_max) · C_h. The plaintext RNA sequence is permanently recorded on the public ledger as a scientific commons.",
    tech: "Provable Security · Bounded-Composition",
  },
]

// Whitepaper Table 1 — Submission payload fields
const SUBMISSION_PAYLOAD = [
  { field: "program_id",       desc: "Hash of the canonical RNA verifier binary" },
  { field: "instance_commit",  desc: "Hash of target structures, anti-targets, and states" },
  { field: "epoch_beacon",     desc: "Hash of the recent block headers [t−w ... t]" },
  { field: "claimed_output",   desc: "Accept token" },
  { field: "discovered_seq",   desc: "Plaintext RNA nucleotide sequence broadcast to the public network" },
  { field: "sequence_hash",    desc: "Public input commitment (hw) binding the sequence to the proof" },
  { field: "proof",            desc: "Succinct zkVM execution proof (π_zk)" },
  { field: "cycle_bound",      desc: "Minimum cycle boundary requirement (c_min)" },
  { field: "submitter_pubkey", desc: "Public key of the solver" },
  { field: "signature",        desc: "Cryptographic signature over all fields above" },
]

// Whitepaper Table 2 — Protocol calibration constants
const PROTOCOL_SETTINGS = [
  { metric: "Max Discount (δ_max)",        setting: "15%",         purpose: "Guarantees that 85% of block cost is always pure sequential work." },
  { metric: "Scaling Constant (α)",        setting: "0.0015",      purpose: "Calibrates the discount curve relative to submission volume." },
  { metric: "Saturation Point (k)",        setting: "10,000",      purpose: "Number of unique solutions to reach the max discount." },
  { metric: "Key Contribution Limit",      setting: "1% of total", purpose: "Prevents a single participant from providing more than 1% of the epoch's count." },
]

// Whitepaper Table 3 — Performance profile (planned)
const PERFORMANCE_PROFILE = [
  { component: "Native Verification Time",   profile: "10 to 300 ms per RNA structure" },
  { component: "zkVM Prover Overhead",       profile: "10³ to 10⁴ cycle multiplier" },
  { component: "Proof Generation Window",    profile: "5 to 30 min on general-purpose solver hardware" },
  { component: "Node Validation Speed",      profile: "< 5 ms per submission (recursive proof pipelining)" },
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

          {/* Right: comparison + spec tables */}
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
                ["Proof system", "SHA-256", "zkVM (succinct)"],
                ["Algorithmic Progress", "Erodes Security", "Ceiling Invariance"],
                ["Discount Ceiling", "N/A", "Strictly capped (δ_max)"],
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
                FROM THE WHITEPAPER · CEILING INVARIANCE
              </div>
              <blockquote
                className="font-sans text-base leading-relaxed italic"
                style={{ color: "var(--fg)" }}
              >
                "For any useful problem U and for any computational strategy or optimization algorithm developed for it (including a theoretical possibility of an oracle that outputs a solution for free instantly), the attack cost is bounded: C<sub>attack</sub> ≥ (1 − δ<sub>max</sub>) · C<sub>h</sub>."
              </blockquote>
              <div className="mt-4 font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
                — RIBO: BC-UPoW Architecture, §2.1
              </div>
            </div>

            {/* Verification relation */}
            <div
              className="p-4 ribo-scroll"
              style={{
                border: "1px solid var(--border-strong)",
                background: "var(--bg-inset)",
                maxHeight: "180px",
                overflowY: "auto",
              }}
            >
              <div className="font-mono text-xs tracking-widest mb-3" style={{ color: "var(--fg-muted)" }}>
                NP RELATION VERIFIED BY THE zkVM
              </div>
              <pre
                className="font-mono text-xs leading-6"
                style={{ color: "var(--fg-muted)", fontSize: "10px", whiteSpace: "pre-wrap" }}
              >
{`R = { (pid, x, y, c_min, h_w) |
    ∃ w : Exec(pid, x, w) = y
        ∧ consumed ≥ c_min
        ∧ H(w) = h_w
}`}
              </pre>
              <div className="mt-3 font-mono text-[10px]" style={{ color: "var(--fg-subtle)" }}>
                pid · verifier program hash  ·  x · instance + beacon  ·  y · accepting state
                w · discovered RNA sequence  ·  h_w · public commitment to w
              </div>
            </div>
          </div>
        </div>

        {/* ── Whitepaper Table 1: Submission Payload ── */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="font-mono text-xs tracking-widest px-2 py-1"
              style={{ background: "var(--accent)", color: "var(--accent-on)" }}
            >
              TABLE 1
            </span>
            <h3
              className="font-sans font-bold text-2xl md:text-3xl tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              RIBO Submission — Public Data Payload
            </h3>
          </div>
          <p className="font-sans text-sm mb-6 max-w-3xl" style={{ color: "var(--fg-muted)" }}>
            Every accepted solution is broadcast to the network as a single signed message. The plaintext RNA sequence (<code className="font-mono" style={{ color: "var(--accent)" }}>discovered_seq</code>) is mandatory — submissions with missing, hidden, or mismatched sequences are entirely rejected, enforcing strict Data Availability.
          </p>
          <div
            style={{
              border: "2px solid var(--border-strong)",
              background: "var(--bg-elevated)",
            }}
          >
            <div
              className="grid grid-cols-[1fr_2fr] font-mono text-xs tracking-widest py-3 px-4"
              style={{ borderBottom: "1px solid var(--border-strong)", color: "var(--fg-subtle)" }}
            >
              <span>FIELD</span>
              <span>DESCRIPTION</span>
            </div>
            {SUBMISSION_PAYLOAD.map((row, i) => (
              <div
                key={row.field}
                className="grid grid-cols-[1fr_2fr] py-3 px-4"
                style={{ borderBottom: i < SUBMISSION_PAYLOAD.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  {row.field}
                </span>
                <span
                  className="font-sans text-xs"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {row.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Whitepaper Table 2: Protocol Settings + Table 3: Performance Profile ── */}
        <div id="settings" className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-24">
          {/* Table 2 — Calibration */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="font-mono text-xs tracking-widest px-2 py-1"
                style={{ background: "var(--accent)", color: "var(--accent-on)" }}
              >
                TABLE 2
              </span>
              <h3
                className="font-sans font-bold text-xl md:text-2xl tracking-tight"
                style={{ color: "var(--fg)" }}
              >
                Protocol Settings
              </h3>
            </div>
            <div
              style={{
                border: "2px solid var(--border-strong)",
                background: "var(--bg-elevated)",
              }}
            >
              {PROTOCOL_SETTINGS.map((row, i) => (
                <div
                  key={row.metric}
                  className="p-4"
                  style={{ borderBottom: i < PROTOCOL_SETTINGS.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: "var(--fg)" }}
                    >
                      {row.metric}
                    </span>
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      {row.setting}
                    </span>
                  </div>
                  <p
                    className="font-sans text-xs leading-relaxed"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {row.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Table 3 — Performance Profile (planned) */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="font-mono text-xs tracking-widest px-2 py-1"
                style={{ background: "var(--accent)", color: "var(--accent-on)" }}
              >
                TABLE 3
              </span>
              <h3
                className="font-sans font-bold text-xl md:text-2xl tracking-tight"
                style={{ color: "var(--fg)" }}
              >
                Performance Profile (Planned)
              </h3>
            </div>
            <div
              style={{
                border: "2px solid var(--border-strong)",
                background: "var(--bg-elevated)",
              }}
            >
              {PERFORMANCE_PROFILE.map((row, i) => (
                <div
                  key={row.component}
                  className="p-4"
                  style={{ borderBottom: i < PERFORMANCE_PROFILE.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <div className="font-mono text-xs font-bold mb-1" style={{ color: "var(--fg)" }}>
                    {row.component}
                  </div>
                  <p
                    className="font-mono text-sm"
                    style={{ color: "var(--accent)" }}
                  >
                    {row.profile}
                  </p>
                </div>
              ))}
              <div
                className="p-3 font-mono text-[10px] tracking-widest"
                style={{ background: "var(--bg-inset)", color: "var(--fg-subtle)" }}
              >
                ESTIMATED FROM CURRENT zkVM RESEARCH — SUBJECT TO CHANGE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

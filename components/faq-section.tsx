"use client"

import { useState } from "react"

const FAQ_ITEMS = [
  {
    q: "If an AI solver gets perfectly good at folding RNA, doesn't the network become insecure?",
    a: "No. This is exactly what Bounded-Composition UPoW (BC-UPoW) solves. Security comes entirely from the sequential floor (the VDF). The useful biological work only buys a bounded discount off that cost. Even an attacker with a free, instant, perfect oracle for RNA folding cannot push a block's cost below a fixed fraction (e.g., 85%) of the honest sequential cost.",
  },
  {
    q: "So the security doesn't rely on RNA inverse design being hard?",
    a: "Correct. We explicitly do not assume RNA inverse design is average-case hard. A security guarantee that degrades as algorithms improve is not a security guarantee. We assume only that the VDF is sequentially hard, and that the zkVM is knowledge-sound.",
  },
  {
    q: "How is the work verified?",
    a: "Miners generate a knowledge-sound execution proof (zkSNARK via a general-purpose zkVM like RISC Zero or SP1) that the deterministic RNA verifier ran for at least c_min cycles and accepted the candidate. Any full node can then verify this zkVM proof in milliseconds.",
  },
  {
    q: "What is the role of the VDF?",
    a: "A Verifiable Delay Function (evaluating repeated squarings in a class group of unknown order) establishes the baseline time and cost for block production. It requires inherently sequential steps, neutralizing advantages from massively parallel hardware.",
  },
  {
    q: "Is the discount applied per-block?",
    a: "No, currently the discount is evaluated per-period against an aggregate number of valid submissions. Block-scale cadence is simply not achievable at current zkVM overheads (proofs take minutes to tens of minutes).",
  },
  {
    q: "Is this proven secure?",
    a: "The ceiling invariance (the maximum discount bound) is mathematically proven given zkVM soundness. However, the full strategy-proofness across periods (ruling out stockpiling, sybil inflation, and merge-mine manipulation) is an explicitly stated open problem in the architecture. Until closed, the discount defaults to zero.",
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      className="py-24 px-4 md:px-8"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs tracking-widest mb-6"
            style={{ border: "1px solid var(--border-strong)", color: "var(--accent)" }}
          >
            FAQ
          </div>
          <h2
            className="font-sans font-bold text-4xl md:text-5xl leading-tight tracking-tight"
            style={{ color: "var(--fg)" }}
          >
            Hard questions.<br />
            <span style={{ color: "var(--accent)" }}>Straight answers.</span>
          </h2>
        </div>

        <div className="flex flex-col">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                borderTop: "1px solid var(--border)",
                borderBottom: i === FAQ_ITEMS.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <button
                className="w-full flex items-start justify-between gap-4 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className="font-sans font-medium text-base leading-relaxed"
                  style={{ color: "var(--fg)" }}
                >
                  {item.q}
                </span>
                <div
                  className="w-6 h-6 shrink-0 flex items-center justify-center mt-0.5 transition-all duration-200"
                  style={{
                    background: open === i ? "var(--accent)" : "var(--accent-soft)",
                    border: "1px solid var(--border-strong)",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    style={{ transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s ease" }}
                  >
                    <path d="M5 2V8M2 5H8" stroke={open === i ? "var(--accent-on)" : "var(--accent)"} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </button>

              <div
                style={{
                  maxHeight: open === i ? "300px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <p
                  className="font-sans text-sm leading-relaxed pb-5"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

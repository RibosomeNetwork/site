"use client"

import { useState } from "react"

const FAQ_ITEMS = [
  {
    q: "Is RIBO live? Can I mine or buy $RIBO today?",
    a: "No. RIBO is in active development and has not launched. The whitepaper specifies a BC-UPoW architecture, the protocol parameters are calibrated, and a reference implementation is being built — but there is no mainnet, no token contract, and no institutional users yet. Do not send funds to anyone claiming to sell $RIBO.",
  },
  {
    q: "If an AI solver gets perfectly good at folding RNA, doesn't the network become insecure?",
    a: "No. This is exactly what Bounded-Composition UPoW (BC-UPoW) solves. Security comes entirely from the sequential floor (the VDF). The useful biological work only buys a bounded discount off that cost. Even an attacker with a free, instant, perfect oracle for RNA folding cannot push a block's cost below a fixed fraction (1 − δ_max) of the honest sequential cost.",
  },
  {
    q: "So the security doesn't rely on RNA inverse design being hard?",
    a: "Correct. We explicitly do not assume RNA inverse design is average-case hard. A security guarantee that degrades as algorithms improve is not a security guarantee. We assume only that the VDF is sequentially hard and that the zkVM is knowledge-sound.",
  },
  {
    q: "What is the Zero-Discount Default (Section 9 of the whitepaper)?",
    a: "At initial launch the protocol will run with δ_max = 0. Solutions can still be submitted, verified inside the zkVM, and stored on-chain, but the discount to the sequential baseline is zero. This preserves full ledger security while the network gathers empirical data on multi-epoch submission behaviour. The discount can later be raised via a multi-step consensus upgrade, and reverted if flaws are found.",
  },
  {
    q: "How is the useful work verified?",
    a: "Solvers generate a knowledge-sound execution proof in a general-purpose zkVM that the deterministic RNA verifier ran for at least c_min cycles and accepted the candidate. The proof also enforces that H(w) — a cryptographic hash of the discovered sequence — is exposed as a public input, binding the published plaintext sequence to the proof. Any full node can verify this in milliseconds.",
  },
  {
    q: "What is the role of the VDF?",
    a: "A Verifiable Delay Function (evaluating repeated squarings in a class group of unknown order) establishes the baseline time and cost for block production. It requires inherently sequential steps, neutralizing advantages from massively parallel hardware. There is no trusted setup.",
  },
  {
    q: "Is the discount applied per-block?",
    a: "No. The discount is evaluated per-epoch against an aggregate number of valid submissions (k). Block-scale cadence is not achievable at current zkVM overheads — proofs take 5–30 minutes to generate. This is why useful work is evaluated on an epoch scale rather than per-block.",
  },
  {
    q: "How are stockpiling and Sybil attacks prevented?",
    a: "Stockpiling is prevented by the epoch beacon: solutions created before the beacon are invalid. Cross-epoch hoarding fails for the same reason. Sybil submissions are bounded by the concave square-root shape of δ(k) = α·√k and by the per-key 1% contribution cap. Generating a valid zkVM proof requires at least c_min cycles, so even an attacker with unlimited keys must spend real resources to inflate k.",
  },
  {
    q: "Is this proven secure?",
    a: "The ceiling invariance (the maximum discount bound) is mathematically proven given zkVM soundness and no replay of submitted solutions. The full strategy-proofness across periods (ruling out stockpiling, Sybil inflation, and merge-mine manipulation) is an explicitly stated open problem in the architecture. Until closed, the discount defaults to zero.",
  },
  {
    q: "Where can I read the full specification?",
    a: "The RIBO whitepaper — \"A Bounded-Composition Architecture for Useful Proof-of-Work\" — describes the framework, the building blocks, the RIBO instantiation, network operations, security analysis, protocol calibration, incentives, and deployment safety in full. It is the authoritative specification for this project.",
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
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
                  maxHeight: open === i ? "400px" : "0",
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

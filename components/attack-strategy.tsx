"use client"

import { useState } from "react"

const ATTACKS = [
  {
    n: "01",
    title: "Stockpile, then burst",
    desc: "Generate many valid proofs in advance and submit them all in a single period to spike k, raising δ(k) past the honest baseline.",
    mitigation: "Beacon window freshness",
    gap: "Exact bound on window width w relative to period length is required to give zero advantage, not just a small one.",
    severity: "high",
  },
  {
    n: "02",
    title: "Selective disclosure across periods",
    desc: "Time the disclosure of accepted submissions to maximize δ(k) over a multi-period horizon.",
    mitigation: "No cross-period carryover",
    gap: "Memoryless per-period evaluation must be shown strategy-proof against an adversary optimizing jointly over many periods.",
    severity: "high",
  },
  {
    n: "03",
    title: "Beacon grinding",
    desc: "A block producer who is also a submitter has some influence over which candidate block becomes canonical, hence over the next beacon.",
    mitigation: "Beacon derived from block hashes, unpredictable to submitters",
    gap: "An explicit bound on this influence as a function of the producer's share of consensus power is needed.",
    severity: "medium",
  },
  {
    n: "04",
    title: "Sybil inflation of k",
    desc: "Free identities plus per-proof real cost — can the cost be amortized below the honest baseline the √k curve assumes?",
    mitigation: "Per-key submission caps, real proving cost per submission",
    gap: "A proof that real per-proof cost makes sybil submission more expensive than the honest baseline in expectation.",
    severity: "medium",
  },
  {
    n: "05",
    title: "Double-counting across periods via near-duplicate instances",
    desc: "Submit the same logical work under two different instance commitments, hoping each counts as fresh.",
    mitigation: "Instance and beacon binding",
    gap: "Collision-resistance argument tying instance_commit uniqueness to actual non-reuse, including under adversarial near-duplicate targets.",
    severity: "medium",
  },
  {
    n: "06",
    title: "Manipulating the merge-mine target split",
    desc: "An adversary substitutes one cost component for the other in some parameter regime.",
    mitigation: "Independent hash and sequential components, neither dominating",
    gap: "A proof that the two costs genuinely add, not substitute, in any parameter regime.",
    severity: "low",
  },
  {
    n: "07",
    title: "Soundness loss across folded recursive proofs",
    desc: "Soundness degradation across many layers of recursive SNARK composition.",
    mitigation: "Standard recursive SNARK soundness",
    gap: "Not a new problem, but must be explicitly checked against whichever recursion scheme is deployed.",
    severity: "low",
  },
]

const SEVERITY_STYLE: Record<string, { fg: string; bg: string; label: string }> = {
  high:   { fg: "var(--accent-on)", bg: "var(--accent)",    label: "HIGH" },
  medium: { fg: "var(--fg)",  bg: "var(--bg-inset)", label: "MED"  },
  low:    { fg: "var(--fg-muted)", bg: "transparent",   label: "LOW"  },
}

export function AttackStrategyExplorer() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 mb-2 font-mono text-[10px] tracking-widest" style={{ color: "var(--fg-subtle)" }}>
        <span>7 ATTACKS A COMPLETE PROOF MUST RULE OUT</span>
        <span style={{ marginLeft: "auto" }}>CLICK A ROW</span>
      </div>
      {ATTACKS.map((a, i) => {
        const sev = SEVERITY_STYLE[a.severity]
        const isOpen = open === i
        return (
          <div
            key={a.n}
            style={{
              background: "var(--bg-elevated)",
              border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
              transition: "all 0.2s ease",
            }}
          >
            <button
              className="w-full flex items-center gap-3 p-4 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span
                className="font-mono font-bold text-sm shrink-0 w-8"
                style={{ color: "var(--accent)" }}
              >
                {a.n}
              </span>
              <span className="font-sans text-sm font-medium flex-1" style={{ color: "var(--fg)" }}>
                {a.title}
              </span>
              <span
                className="font-mono text-[9px] tracking-widest px-2 py-0.5"
                style={{ background: sev.bg, color: sev.fg }}
              >
                {sev.label}
              </span>
              <span
                className="w-5 h-5 flex items-center justify-center font-mono text-xs shrink-0"
                style={{
                  background: isOpen ? "var(--accent)" : "transparent",
                  color: isOpen ? "var(--accent-on)" : "var(--fg-muted)",
                  border: "1px solid var(--border-strong)",
                  transform: isOpen ? "rotate(45deg)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                className="px-4 pb-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 page-fade"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div className="pt-4">
                  <div className="font-mono text-[10px] tracking-widest mb-1" style={{ color: "var(--fg-subtle)" }}>
                    ATTACK
                  </div>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    {a.desc}
                  </p>
                </div>
                <div className="pt-4 grid grid-cols-1 gap-3">
                  <div>
                    <div className="font-mono text-[10px] tracking-widest mb-1" style={{ color: "var(--fg-subtle)" }}>
                      EXISTING MITIGATION
                    </div>
                    <p className="font-sans text-sm" style={{ color: "var(--fg)" }}>{a.mitigation}</p>
                  </div>
                  <div
                    className="p-3"
                    style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}
                  >
                    <div className="font-mono text-[10px] tracking-widest mb-1" style={{ color: "var(--accent)" }}>
                      WHAT'S STILL MISSING
                    </div>
                    <p className="font-sans text-xs leading-relaxed" style={{ color: "var(--fg)" }}>
                      {a.gap}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

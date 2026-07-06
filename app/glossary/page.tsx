"use client"

import { useState } from "react"
import Link from "next/link"
import { SubpageShell } from "@/components/subpage-shell"
import { PageHeader } from "@/components/page-header"

const TERMS = [
  {
    letter: "B",
    term: "Beacon",
    short: "A fresh, unpredictable per-period value derived from recent block hashes. Binds a submission to a specific period.",
    body: "epoch_beacon = H(block_hashes[t−w .. t]). The window w is set so that starting a proof before the beacon exists gains an attacker nothing. A proof made for period t will not verify against period t′ ≠ t's beacon, by collision resistance of the beacon derivation.",
    tags: ["freshness", "replay"],
    link: "/developers",
  },
  {
    letter: "B",
    term: "BC-UPoW",
    short: "Bounded-Composition Useful Proof-of-Work. The framework RIBO instantiates.",
    body: "A tuple (Π_floor, Π_verify, δ, δ_max) where useful work is gated by a knowledge-sound proof system and the discount function δ is monotone, concave, and hard-capped. Security comes from Π_floor (a sequential-cost primitive). Useful work only ever buys a bounded discount off that cost.",
    tags: ["framework", "ceiling"],
    link: "/#protocol",
  },
  {
    letter: "C",
    term: "Class Group VDF",
    short: "A VDF based on repeated squaring in the class group of an imaginary quadratic field of unknown order.",
    body: "The protocol's chosen Π_floor. No trusted setup is required because no party ever needs to know the group order. The construction is conjectural rather than reductionist: it is real, peer-reviewed, and running in production since 2021 (Chia), but it is not reduced to factoring or discrete log.",
    tags: ["VDF", "sequentiality"],
    link: "/developers",
  },
  {
    letter: "C",
    term: "Ceiling Invariance",
    short: "C_attack ≥ (1 − δ_max) · C_h, regardless of the useful-work solver's quality.",
    body: "Proven proposition. Holds for any useful problem U and any solver for it, including a free, instant, perfect oracle, provided the proof system is knowledge-sound and δ is only ever evaluated over genuinely fresh, non-replayed, non-double-counted submissions. The proof is close to a restatement of the definition; the open work is in showing the protocol's submission pipeline actually achieves those freshness properties.",
    tags: ["theorem", "security"],
    link: "/developers",
  },
  {
    letter: "D",
    term: "δ(k)",
    short: "The per-period discount function. Monotone, concave, hard-capped at δ_max.",
    body: "RIBO uses δ(k) = min(δ_max, α√k) with α set so the cap is reached at k★ = 10^4. At k=100, δ ≈ 0.015. At k=2500, δ ≈ 0.075, half the ceiling. The square root makes the marginal contribution of any single submission strictly decreasing, which is what gives the system its concentration-resistance.",
    tags: ["discount", "concentration"],
    link: "/#protocol",
  },
  {
    letter: "K",
    term: "Knowledge Soundness",
    short: "A verifying zkSNARK proof implies a witness actually existed.",
    body: "RIBO's Π_verify (the zkVM) is required to be knowledge-sound. In our usage that means: an accepted proof implies the claimed cycles were actually spent on a real execution trace. We do not use the zero-knowledge property for anything security-critical. Hiding the candidate before confirmation is a convenience against front-running, nothing more.",
    tags: ["zkSNARK", "zkVM"],
    link: "/developers",
  },
  {
    letter: "M",
    term: "McCaskill's Algorithm",
    short: "1990. Computes the equilibrium partition function of an RNA secondary structure.",
    body: "Together with the Zuker-Stiegler recurrence, this is the deterministic backbone of the RIBO verifier. For each condition P_i, the verifier checks that the equilibrium probability of the target structure σ_i is at least 1/2. All arithmetic is fixed-point integer to remove floating-point drift across hardware and compilers.",
    tags: ["RNA", "verifier"],
    link: "/#science",
  },
  {
    letter: "P",
    term: "Per-key Cap",
    short: "Each submitter key is capped at ~1% of the period's total accepted submissions.",
    body: "Recomputed each period so it scales with real network growth. One actor's max contribution to √k is O(√c) regardless of how much compute they have. Free identities plus real per-proof cost cannot make sybil submission cheaper than the honest baseline, in expectation — this is the open item in the attack checklist.",
    tags: ["sybil", "cap"],
    link: "/developers",
  },
  {
    letter: "S",
    term: "Sequentiality",
    short: "No adversary, regardless of parallel hardware, can evaluate a VDF meaningfully faster than T sequential steps.",
    body: "This is a conjecture about repeated squaring in groups of unknown order, not a theorem. The protocol states it as such rather than letting it blend into 'established'. The conjecture is widely deployed (Chia since 2021) but not reduced to a well-studied hardness assumption the way factoring or RSA are.",
    tags: ["VDF", "conjecture"],
    link: "/developers",
  },
  {
    letter: "V",
    term: "VDF",
    short: "Verifiable Delay Function. Three algorithms: Setup, Eval, Verify.",
    body: "Setup(λ) → pp generates public parameters. Eval(pp, x, T) → (y, π) computes y = x^{2^T} in T sequential steps plus a succinct proof. Verify(pp, x, y, π, T) checks the proof in time polylog(T). RIBO uses the class-group construction. Optionally composed with an established hash-PoW chain via merge-mining.",
    tags: ["primitive"],
    link: "/developers",
  },
  {
    letter: "Z",
    term: "Zuker-Stiegler Recurrence",
    short: "1981. The decades-old deterministic algorithm for RNA minimum-free-energy folding.",
    body: "Computes the secondary structure of an RNA sequence under a given condition, via dynamic programming in O(n^3). The RIBO verifier uses the integer-scaled nearest-neighbor energy model. The MFE structure must equal the target σ_i exactly; otherwise the submission is rejected. Anti-target structures are checked by the same recurrence.",
    tags: ["RNA", "verifier"],
    link: "/#science",
  },
  {
    letter: "Z",
    term: "zkVM",
    short: "A general-purpose zero-knowledge virtual machine. RISC Zero, SP1, Jolt.",
    body: "Lets you prove a deterministic program executed on some input for at least some number of cycles, without the verifier re-executing it. RIBO uses zkVMs in the most conservative way: prove a fixed program ran, on a fixed input, for at least a fixed number of cycles, bound to fresh randomness. We do not require the zero-knowledge property for security.",
    tags: ["proof", "snark"],
    link: "/developers",
  },
]

export default function GlossaryPage() {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState<string | null>(null)

  const filtered = TERMS.filter(t =>
    !query ||
    t.term.toLowerCase().includes(query.toLowerCase()) ||
    t.short.toLowerCase().includes(query.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <SubpageShell showStats={false}>
      <PageHeader
        eyebrow="GLOSSARY"
        title="Every term, in"
        highlight="plain language."
        description="The architecture is a careful composition of named primitives. This page is the index. Each entry links to the section of the whitepaper that treats the topic in depth."
      />

      <section className="py-12 px-4 md:px-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search terms, tags, or short descriptions..."
            className="w-full px-4 py-3 font-mono text-sm"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-strong)",
              color: "var(--fg)",
              outline: "none",
            }}
          />
          <div className="mt-3 font-mono text-[10px] tracking-widest" style={{ color: "var(--fg-subtle)" }}>
            {filtered.length} / {TERMS.length} TERMS
          </div>
        </div>
      </section>

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          {filtered.map(t => {
            const isOpen = active === t.term
            return (
              <div
                key={t.term}
                style={{
                  background: "var(--bg-elevated)",
                  border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                  transition: "all 0.2s ease",
                }}
              >
                <button
                  className="w-full grid grid-cols-12 gap-3 items-center p-4 text-left"
                  onClick={() => setActive(isOpen ? null : t.term)}
                >
                  <span
                    className="col-span-1 font-mono font-bold text-2xl text-center"
                    style={{ color: "var(--accent)" }}
                  >
                    {t.letter}
                  </span>
                  <span className="col-span-3 font-mono font-bold text-sm" style={{ color: "var(--fg)" }}>
                    {t.term}
                  </span>
                  <span className="col-span-7 font-sans text-sm leading-snug" style={{ color: "var(--fg-muted)" }}>
                    {t.short}
                  </span>
                  <span
                    className="col-span-1 w-6 h-6 flex items-center justify-center font-mono text-xs"
                    style={{
                      background: isOpen ? "var(--accent)" : "transparent",
                      color: isOpen ? "white" : "var(--fg-muted)",
                      border: "1px solid var(--border-strong)",
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >+</span>
                </button>
                {isOpen && (
                  <div
                    className="px-4 pb-4 pt-0 grid grid-cols-1 md:grid-cols-12 gap-4 page-fade"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    <div className="md:col-span-9 pt-3">
                      <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--fg)" }}>{t.body}</p>
                    </div>
                    <div className="md:col-span-3 pt-3 flex flex-col gap-2 items-start md:items-end">
                      <div className="flex flex-wrap gap-1.5">
                        {t.tags.map(tag => (
                          <span
                            key={tag}
                            className="font-mono text-[9px] tracking-widest px-1.5 py-0.5"
                            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={t.link}
                        className="font-mono text-[10px] tracking-widest"
                        style={{ color: "var(--accent)" }}
                      >
                        FULL REFERENCE →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div
              className="p-8 text-center font-mono text-sm"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--fg-subtle)" }}
            >
              No terms match "{query}".
            </div>
          )}
        </div>
      </section>
    </SubpageShell>
  )
}
